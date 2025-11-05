import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    if (!prompt) {
      return NextResponse.json(
        { error: "Brak lub zły format 'prompt'" },
        { status: 400 }
      );
    }

// DEV fallback bez kosztów, gdy brak kredytów
if (process.env.OPENAI_MOCK === "1") {
  const mock =
    prompt.includes("fotosynteza")
      ? "• Fotosynteza to proces wytwarzania związków organicznych z CO2 i H2O przy udziale światła.\n• Zachodzi w chloroplastach roślin i części bakterii.\n• Produktem ubocznym jest tlen, a źródłem elektronów jest woda."
      : `MOCK: ${prompt.slice(0, 120)}...`;
  return NextResponse.json({ result: mock });
}



    const completion = await openai.chat.completions.create({
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
