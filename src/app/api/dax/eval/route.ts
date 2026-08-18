import { getExercise } from "@/content/exercises";
import { getCurrentUser, touchStreak } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { evaluateDax, valuesMatch } from "@/lib/dax-engine";
import { canAccessExercise } from "@/lib/entitlements";
import { jsonError } from "@/lib/http";
import { SALES_MODEL } from "@/lib/sample-model";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = (await request.json().catch(() => null)) as {
    expression?: string;
    exerciseId?: string;
  } | null;
  const expression = body?.expression || "";
  const exerciseId = body?.exerciseId;
  if (exerciseId && !canAccessExercise(user, exerciseId)) {
    return jsonError("Pro required.", 402);
  }
  const evaluated = evaluateDax(expression, SALES_MODEL);
  let passed = false;
  let expected: number | undefined;
  if (exerciseId) {
    const exercise = getExercise(exerciseId);
    expected = exercise?.expected;
    passed = Boolean(evaluated.ok && exercise && typeof evaluated.value === "number" && valuesMatch(evaluated.value, exercise.expected));
    getDb()
      .prepare(
        "INSERT INTO dax_attempts (id, user_id, exercise_id, expression, passed, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(crypto.randomUUID(), user.id, exerciseId, expression, passed ? 1 : 0, new Date().toISOString());
    if (passed) touchStreak(user.id, 15);
  }
  return Response.json({ ...evaluated, passed, expected });
}
