import { getLesson } from "@/content/lessons";
import { saveOverride } from "@/content/publish";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function PUT(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    type?: "path" | "lesson";
    id?: string;
    title?: string;
    subtitle?: string;
    minutes?: number;
    bodyText?: string;
    example?: string;
    takeaway?: string;
    images?: string[];
    videos?: string[];
    checkQuestion?: string;
    checkOptions?: string;
    checkAnswer?: number;
  } | null;
  if (!body?.type || !body.id) return jsonError("Missing type or id.");

  if (body.type === "path") {
    saveOverride(`path:${body.id}`, {
      title: body.title?.trim(),
      subtitle: body.subtitle?.trim(),
    });
    return Response.json({ ok: true });
  }

  if (!getLesson(body.id)) return jsonError("Unknown lesson.");
  const options = (body.checkOptions || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  saveOverride(`lesson:${body.id}`, {
    title: body.title?.trim(),
    minutes: Number(body.minutes) || 8,
    body: (body.bodyText || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    example: body.example?.trim(),
    takeaway: body.takeaway?.trim(),
    images: (body.images || []).filter((url) => url.startsWith("/uploads/")),
    videos: (body.videos || []).filter((url) => url.startsWith("/uploads/")),
    check: {
      question: body.checkQuestion?.trim() || "Check question",
      options: options.length >= 2 ? options : ["Option A", "Option B"],
      answer: Number.isFinite(body.checkAnswer) ? Number(body.checkAnswer) : 0,
    },
  });
  return Response.json({ ok: true });
}
