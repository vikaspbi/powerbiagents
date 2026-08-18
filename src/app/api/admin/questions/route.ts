import {
  deleteQuizItem,
  listAdminQuizzes,
  restoreQuizItem,
  saveQuizItem,
} from "@/content/activity-store";
import { QUIZ_BANKS, type QuizBank } from "@/content/quizzes";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  return Response.json({ questions: listAdminQuizzes() });
}

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    id?: string;
    topic?: string;
    answer?: number;
    banks?: QuizBank[];
    prompt?: string;
    options?: string[] | string;
    explanation?: string;
  } | null;
  const options = Array.isArray(body?.options)
    ? body.options
    : String(body?.options || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
  try {
    const id = saveQuizItem({
      id: body?.id,
      topic: body?.topic,
      answer: body?.answer,
      banks: (body?.banks || []).filter((bank): bank is QuizBank => QUIZ_BANKS.includes(bank)),
      prompt: body?.prompt,
      options,
      explanation: body?.explanation,
    });
    return Response.json({ ok: true, id });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save question.");
  }
}

export async function DELETE(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as { id?: string; restore?: boolean } | null;
  if (!body?.id) return jsonError("Missing id.");
  if (body.restore) {
    restoreQuizItem(body.id);
    return Response.json({ ok: true, restored: true });
  }
  return Response.json({ ok: true, ...deleteQuizItem(body.id) });
}
