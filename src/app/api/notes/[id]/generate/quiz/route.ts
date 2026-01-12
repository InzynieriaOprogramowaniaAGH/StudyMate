import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DraftQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type NormalizedQuiz = {
  title: string;
  questions: DraftQuestion[];
};

function sanitizeCount(n: unknown, def = 5) {
  const parsed =
    typeof n === "number" ? n : typeof n === "string" ? Number(n) : NaN;
  if (!Number.isFinite(parsed)) return def;
  return Math.max(1, Math.min(30, Math.floor(parsed)));
}

function tryExtractJson(text: string): string {
  const trimmed = (text ?? "").trim();

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

function normalizeQuiz(parsed: any, fallbackTitle: string): NormalizedQuiz | null {
  const title =
    typeof parsed?.title === "string" && parsed.title.trim()
      ? parsed.title.trim()
      : fallbackTitle;

  const rawQuestions: any[] = Array.isArray(parsed?.questions) ? parsed.questions : [];
  const seen = new Set<string>();

  const questions: DraftQuestion[] = [];
  for (const q of rawQuestions) {
    const question = typeof q?.question === "string" ? q.question.trim() : "";
    const options = Array.isArray(q?.options)
      ? q.options
          .filter((x: any) => typeof x === "string")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    const correctAnswer =
      typeof q?.correctAnswer === "string" ? q.correctAnswer.trim() : "";

    if (!question || question.length > 500) continue;
    if (options.length !== 4) continue;

    // unique options
    const uniq = Array.from(new Set(options));
    if (uniq.length !== 4) continue;

    if (!correctAnswer || correctAnswer.length > 300) continue;
    if (!uniq.includes(correctAnswer)) continue;

    const key = `${question}\n${uniq.join("||")}\n${correctAnswer}`;
    if (seen.has(key)) continue;
    seen.add(key);

    questions.push({ question, options: uniq, correctAnswer });
  }

  if (questions.length === 0) return null;
  return { title, questions };
}

function mockQuiz(noteTitle: string, content: string, count: number): NormalizedQuiz {
  const lines = content
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 100);

  const questions: DraftQuestion[] = [];

  for (let i = 0; i < Math.min(count, Math.max(1, lines.length)); i++) {
    const base = lines[i] ?? `${noteTitle} (punkt ${i + 1})`;
    const options = [
      `${base} – A`,
      `${base} – B`,
      `${base} – C`,
      `${base} – D`,
    ];
    const correctAnswer = options[i % 4];
    questions.push({
      question: `Pytanie ${i + 1}: wybierz poprawną odpowiedź na podstawie notatki`,
      options,
      correctAnswer,
    });
  }

  while (questions.length < count) {
    const idx = questions.length + 1;
    const options = [`Opcja A ${idx}`, `Opcja B ${idx}`, `Opcja C ${idx}`, `Opcja D ${idx}`];
    questions.push({
      question: `(MOCK) Pytanie ${idx}`,
      options,
      correctAnswer: options[0],
    });
  }

  return { title: `Quiz: ${noteTitle}`, questions };
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

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
    const count = sanitizeCount(body?.count, 5);

    const content = (note.content ?? "").slice(0, 12000);
    const fallbackTitle = `Quiz: ${note.title}`;

    let normalized: NormalizedQuiz | null = null;

    if (process.env.OPENAI_MOCK === "1") {
      normalized = mockQuiz(note.title, content, count);
    } else {
      const client = getOpenAI();
      if (!client) {
        return NextResponse.json(
          { error: "OpenAI API jest wyłączone (brak OPENAI_API_KEY)." },
          { status: 503 }
        );
      }

      const prompt =
        `Wygeneruj quiz na podstawie notatki.\n` +
        `Liczba pytań: ${count}.\n\n` +
        `Zwróć WYŁĄCZNIE poprawny JSON bez markdown i bez dodatkowego tekstu.\n` +
        `Format odpowiedzi:\n` +
        `{"title":"...","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":"..."}]}\n\n` +
        `Zasady:\n` +
        `- Dokładnie 4 opcje odpowiedzi w każdym pytaniu.\n` +
        `- "correctAnswer" musi być IDENTYCZNY jak jedna z opcji (dokładne dopasowanie tekstu).\n` +
        `- Opcje w ramach pytania muszą być unikalne.\n` +
        `- Unikaj pytań dwuznacznych.\n` +
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

      normalized = normalizeQuiz(parsed, fallbackTitle);
      if (!normalized) {
        return NextResponse.json(
          { error: "Nie udało się znormalizować quizu (zła struktura odpowiedzi)." },
          { status: 502 }
        );
      }
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: normalized.title,
        userId: user.id,
        noteId: note.id,
        totalQuestions: normalized.questions.length,
        questions: {
          create: normalized.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({
      quizId: quiz.id,
      noteId: note.id,
      totalQuestions: quiz.totalQuestions ?? quiz.questions.length,
      quiz,
    });
  } catch (err: any) {
    console.error("[generate quiz] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
