import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Generuje notatkę na podstawie tekstu, pliku PDF lub obrazu z użyciem AI
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let inputText = "";

    // Obsługa JSON (tekst wklejony bezpośrednio)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      inputText = body?.text?.trim() || "";

      if (!inputText) {
        return NextResponse.json(
          { error: "Brak tekstu do przetworzenia" },
          { status: 400 }
        );
      }
    }
    // Obsługa FormData (plik PDF lub obraz)
    else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      let files = formData.getAll("files") as File[];
      if (!files || files.length === 0) {
        const single = formData.get("file") as File | null;
        if (single) files = [single];
      }

      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: "Brak plików do przetworzenia" },
          { status: 400 }
        );
      }

      const parts: string[] = [];
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        const name = (file as any).name || "plik";
        if (file.type === "application/pdf") {
          try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const pdfParse = require("pdf-parse/lib/pdf-parse.js");
            const pdfData: any = await pdfParse(fileBuffer);
            const text = (pdfData?.text ?? "").trim();
            if (text) parts.push(`--- PDF: ${name} ---\n${text}`);
          } catch (err) {
            console.error("PDF parsing error:", err);
          }
        } else if (file.type.startsWith("image/")) {
          try {
            const normalizedBuffer = await sharp(fileBuffer)
              .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
              .toBuffer();

            const base64Image = normalizedBuffer.toString("base64");
            const client = getOpenAI();
            if (!client) {
              return NextResponse.json(
                { error: "OpenAI API jest wyłączone (brak OPENAI_API_KEY)." },
                { status: 503 }
              );
            }

            const visionResponse = await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Image}` } },
                    { type: "text", text: "Proszę odczytaj cały tekst z obrazu bez komentarzy." },
                  ],
                },
              ],
            });
            const text = visionResponse.choices?.[0]?.message?.content?.trim() || "";
            if (text) parts.push(`--- Obraz: ${name} ---\n${text}`);
          } catch (err) {
            console.error("Image processing error:", err);
          }
        } else {
          console.warn("Nieobsługiwany typ pliku:", file.type);
        }
      }

      inputText = parts.join("\n\n");
      if (!inputText.trim()) {
        return NextResponse.json(
          { error: "Nie udało się wyodrębnić tekstu z przesłanych plików" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Nieobsługiwany typ zawartości" },
        { status: 400 }
      );
    }

    // Jeśli wciąż nie mamy tekstu
    if (!inputText) {
      return NextResponse.json(
        { error: "Nie udało się wyodrębnić tekstu z pliku" },
        { status: 400 }
      );
    }

    // Tryb MOCK do testowania
    if (process.env.OPENAI_MOCK === "1") {
      const mockContent = `# Wygenerowana notatka

## Kluczowe punkty:
- Punkt 1
- Punkt 2
- Punkt 3

## Streszczenie
Notatka wygenerowana w trybie mock na podstawie przesłanego materiału.`;

      return NextResponse.json({ content: mockContent });
    }

    // Normalna ścieżka z OpenAI
    const client = getOpenAI();
    if (!client) {
      return NextResponse.json(
        { error: "OpenAI API jest wyłączone (brak OPENAI_API_KEY)." },
        { status: 503 }
      );
    }

    // Prompt dla AI do generowania notatek w formacie JSON
    const systemPrompt = `Jesteś ekspertem w tworzeniu zwięzłych, uporządkowanych notatek do nauki.
Zwracaj wynik *wyłącznie* jako JSON z kluczami: title, subject, description, content.
- title: krótki tytuł (max 120 znaków)
- subject: nazwa przedmiotu/obszaru (np. Algebra, Analiza, Fizyka, Biologia)
- description: 1-2 zdania streszczenia
- content: notatka w Markdown, nagłówki + wypunktowania, bez nadmiarowych komentarzy.
Nie duplikuj subject ani title wewnątrz content.`;

    const userPrompt = `Opracuj notatkę na podstawie materiału poniżej.
Wypełnij pola title, subject, description oraz content (Markdown, zwięzły):

---
${inputText.slice(0, 5000)}
---`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.25,
      max_tokens: 2000,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    let parsed: { title?: string; subject?: string; description?: string; content?: string } = {};
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error from AI response", err, raw);
    }

    if (!parsed.content) {
      return NextResponse.json(
        { error: "AI nie wygenerował zawartości" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      title: parsed.title || "",
      subject: parsed.subject || "",
      description: parsed.description || "",
      content: parsed.content,
    });
  } catch (error: any) {
    console.error("AI note generation error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Generowanie notatki nie powiodło się" },
      { status: 500 }
    );
  }
}
