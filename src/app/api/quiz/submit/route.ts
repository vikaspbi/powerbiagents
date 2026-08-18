import { getPublishedQuizBank } from "@/content/activity-store";
import { shuffleDaily } from "@/content/quizzes";
import { getCurrentUser, touchStreak } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!user.isPro) {
    return jsonError("Pro required.", 402);
  }
  const body = (await request.json().catch(() => null)) as {
    quizId?: string;
    answers?: Record<string, number>;
  } | null;
  const quizId = body?.quizId || "practice";
  const answers = body?.answers || {};

  const practice = getPublishedQuizBank("practice");
  const play = getPublishedQuizBank("play");
  const bank =
    quizId === "daily"
      ? shuffleDaily(getPublishedQuizBank("daily"))
      : quizId === "boss"
        ? play.slice(0, 8)
        : practice;
  let score = 0;
  for (const q of bank) {
    if (answers[q.id] === q.answer) score += 1;
  }
  const xp = score * 8;
  getDb()
    .prepare(
      "INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total, xp_earned, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(crypto.randomUUID(), user.id, quizId, score, bank.length, xp, new Date().toISOString());
  touchStreak(user.id, xp);
  return Response.json({ score, total: bank.length, xp });
}
