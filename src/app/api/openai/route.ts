
import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // upewnia, że Next nie próbuje nic prerenderować

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Brak lub zły format 'prompt'" },
        { status: 400 }
      );
    }

    // Tryb MOCK – szybki fallback bez kosztów, np. na dev:
    if (process.env.OPENAI_MOCK === "1") {
      const mock =
        prompt.includes("fotosynteza")
          ? "• Fotosynteza to proces wytwarzania związków organicznych z CO2 i H2O przy udziale światła.\n• Zachodzi w chloroplastach roślin.\n• Produktem ubocznym jest tlen."
          : `MOCK: ${prompt.slice(0, 120)}...`;
      return NextResponse.json({ result: mock });
    }

    // Normalna ścieżka z OpenAI
    const client = getOpenAI();
    if (!client) {
      // Brak klucza = usługa wyłączona w tym środowisku,
      // ale build/serwer wciąż działają
      return NextResponse.json(
        { error: "OpenAI API jest wyłączone (brak OPENAI_API_KEY)." },
        { status: 503 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ result: text });
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: err?.message ?? "OpenAI request failed" },
      { status: 500 }
    );
  }
}
