import { getCurrentUser, touchStreak } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { canAccessLesson } from "@/lib/entitlements";
import { jsonError } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const lessons = getDb()
    .prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ?")
    .all(user.id) as { lesson_id: string }[];
  const quizzes = getDb()
    .prepare("SELECT COUNT(*) as c FROM quiz_attempts WHERE user_id = ?")
    .get(user.id) as { c: number };
  const dax = getDb()
    .prepare("SELECT exercise_id FROM dax_attempts WHERE user_id = ? AND passed = 1")
    .all(user.id) as { exercise_id: string }[];
  return Response.json({
    lessons: lessons.map((l) => l.lesson_id),
    quizRuns: quizzes.c,
    daxPassed: dax.map((d) => d.exercise_id),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as { lessonId?: string } | null;
  const lessonId = body?.lessonId || "";
  if (!canAccessLesson(user, lessonId)) {
    return jsonError("Pro required.", 402);
  }
  const existing = getDb()
    .prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId) as { id: string } | undefined;
  if (!existing) {
    getDb()
      .prepare("INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at) VALUES (?, ?, ?, ?)")
      .run(crypto.randomUUID(), user.id, lessonId, new Date().toISOString());
    touchStreak(user.id, 10);
  }
  return Response.json({ ok: true });
}
