import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { getAllAvailableProviders } from "@/lib/ai";
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
            const { extractText } = await import("unpdf");
            const uint8Array = new Uint8Array(fileBuffer);
            const result = await extractText(uint8Array);
            
            let text = '';
            if (typeof result === 'string') {
              text = result;
            } else if (result && typeof result === 'object') {
              text = String(result.text || result.contents || '');
            }
            
            if (text && text.trim()) {
              parts.push(`--- PDF: ${name} ---\n${text.trim()}`);
            }
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

    // Wybierz dostępnego dostawcę AI z fallbackiem (OpenAI/Gemini/Claude/Mistral/Cohere)
    const providers = getAllAvailableProviders();

    if (providers.length === 0) {
      return NextResponse.json(
        { error: "Brak dostępnego dostawcy AI. Ustaw klucz API w .env" },
        { status: 503 }
      );
    }

    let result: { title: string; subject: string; description: string; content: string } | null = null;
    let lastError: unknown;

    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      const providerName = provider?.constructor?.name || "UnknownProvider";
      const isLast = i === providers.length - 1;
      try {
        result = await provider.generateNote({ inputText });
        break;
      } catch (error: any) {
        lastError = error;
        const message = error?.message || "";
        const isQuota =
          error?.status === 429 ||
          error?.code === "insufficient_quota" ||
          message.includes("429") ||
          message.toLowerCase().includes("quota");

        console.warn(`[AI][note] ${providerName} failed: ${message || error}`);

        if (!isLast) {
          console.warn("Trying next provider...");
          continue;
        }

        if (isQuota) {
          return NextResponse.json(
            { error: "All AI providers are rate limited or out of quota. Add another key or wait." },
            { status: 503 }
          );
        }
        throw error;
      }
    }

    if (!result) {
      const message = lastError instanceof Error ? lastError.message : "AI generation failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI note generation error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Generowanie notatki nie powiodło się" },
      { status: 500 }
    );
  }
}
