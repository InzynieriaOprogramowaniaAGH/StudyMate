import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FlashcardDraft = { front: string; back: string };

function sanitizeCount(n: unknown, def = 12) {
  const parsed = typeof n === "number" ? n : typeof n === "string" ? Number(n) : NaN;
  if (!Number.isFinite(parsed)) return def;
  return Math.max(1, Math.min(30, Math.floor(parsed)));
}

function tryExtractJson(text: string): string {
  const trimmed = text.trim();

  // Remove markdown fences if present
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced?.[1]) return fenced[1].trim();

  // Try to extract first JSON object
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

function normalizeDrafts(drafts: any): FlashcardDraft[] {
  const arr: any[] = Array.isArray(drafts) ? drafts : [];

  const out: FlashcardDraft[] = [];
  const seen = new Set<string>();

  for (const item of arr) {
    const front = typeof item?.front === "string" ? item.front.trim() : "";
    const back = typeof item?.back === "string" ? item.back.trim() : "";

    if (!front || !back) continue;
    if (front.length > 280) continue;
    if (back.length > 1200) continue;

    const key = `${front}\n---\n${back}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ front, back });
  }

  return out;
}

function mockFlashcards(noteTitle: string, content: string, count: number): FlashcardDraft[] {
  const lines = content
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const drafts: FlashcardDraft[] = [];
  for (let i = 0; i < Math.min(count, lines.length); i++) {
    drafts.push({
      front: `Co oznacza: ${noteTitle} – punkt ${i + 1}?`,
      back: lines[i].slice(0, 400),
    });
  }

  // fallback jeśli notatka krótka
  while (drafts.length < count) {
    drafts.push({
      front: `Najważniejsza definicja z notatki „${noteTitle}” (nr ${drafts.length + 1})`,
      back: "(MOCK) Uzupełnij treść notatki lub wyłącz OPENAI_MOCK, aby generować prawdziwe fiszki.",
    });
  }

  return drafts;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const note = await prisma.note.findFirst({
      where: { id: params.id, userId: user.id },
      select: { id: true, title: true, content: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const count = sanitizeCount(body?.count, 12);

    // Limity, żeby nie wysyłać gigantycznych notatek
    const content = (note.content ?? "").slice(0, 12000);

    let drafts: FlashcardDraft[] = [];

    // MOCK mode
    if (process.env.OPENAI_MOCK === "1") {
      drafts = mockFlashcards(note.title, content, count);
    } else {
      const client = getOpenAI();
      if (!client) {
        return NextResponse.json(
          { error: "OpenAI API jest wyłączone (brak OPENAI_API_KEY)." },
          { status: 503 }
        );
      }

      const prompt =
        `Wygeneruj ${count} fiszek (flashcards) na podstawie notatki.\n` +
        `Zwróć WYŁĄCZNIE poprawny JSON bez markdown i bez dodatkowego tekstu.\n\n` +
        `Format odpowiedzi:\n` +
        `{"flashcards":[{"front":"...","back":"..."}]}\n\n` +
        `Zasady:\n` +
        `- "front" ma być krótkim pytaniem albo hasłem (max 1 zdanie).\n` +
        `- "back" ma być zwięzłą odpowiedzią/wyjaśnieniem.\n` +
        `- Nie powtarzaj tej samej fiszki.\n` +
        `- Pisz w języku notatki.\n\n` +
        `NOTATKA (tytuł: ${note.title}):\n${content}`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = completion.choices?.[0]?.message?.content ?? "";
      const jsonText = tryExtractJson(raw);

      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        return NextResponse.json(
          {
            error: "Model zwrócił niepoprawny JSON.",
            raw: raw.slice(0, 2000),
          },
          { status: 502 }
        );
      }

      drafts = normalizeDrafts(parsed?.flashcards);
    }

    if (drafts.length === 0) {
      return NextResponse.json(
        { error: "Nie udało się wygenerować żadnych fiszek." },
        { status: 502 }
      );
    }

    const created = await prisma.$transaction(
      drafts.map((fc) =>
        prisma.flashcard.create({
          data: {
            front: fc.front,
            back: fc.back,
            userId: user.id,
            noteId: note.id,
          },
        })
      )
    );

    return NextResponse.json({
      noteId: note.id,
      createdCount: created.length,
      flashcards: created,
    });
  } catch (err: any) {
    console.error("[generate flashcards] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
