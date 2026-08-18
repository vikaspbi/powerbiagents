import {
  createCustomLesson,
  createCustomPath,
  hideCatalogItem,
  isCustomLesson,
  isCustomPath,
  restoreCatalogItem,
  setCustomLessonFreeOnPath,
  updateCustomLesson,
  updateCustomPath,
} from "@/content/catalog-store";
import { LEARNING_PATHS, getLesson } from "@/content/lessons";
import { getPublishedLesson, saveOverride } from "@/content/publish";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    action?: "createPath" | "createLesson";
    number?: number;
    track?: string;
    title?: string;
    subtitle?: string;
    free?: boolean;
    pathId?: string;
    minutes?: number;
    bodyText?: string;
    example?: string;
    takeaway?: string;
    checkQuestion?: string;
    checkOptions?: string;
    checkAnswer?: number;
  } | null;
  try {
    if (body?.action === "createPath") {
      const id = createCustomPath({
        number: body.number,
        track: body.track,
        title: body.title,
        subtitle: body.subtitle,
        free: body.free,
      });
      return Response.json({ ok: true, id });
    }
    if (body?.action === "createLesson") {
      const id = createCustomLesson({
        pathId: body.pathId || "",
        title: body.title,
        minutes: body.minutes,
        bodyText: body.bodyText,
        example: body.example,
        takeaway: body.takeaway,
        checkQuestion: body.checkQuestion,
        checkOptions: body.checkOptions,
        checkAnswer: body.checkAnswer,
        free: body.free,
      });
      return Response.json({ ok: true, id });
    }
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not create.");
  }
  return jsonError("Unknown action.");
}

export async function DELETE(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    type?: "path" | "lesson";
    id?: string;
    restore?: boolean;
  } | null;
  if (!body?.type || !body.id) return jsonError("Missing type or id.");
  if (body.restore) {
    restoreCatalogItem(body.type, body.id);
    return Response.json({ ok: true, restored: true });
  }
  return Response.json({ ok: true, ...hideCatalogItem(body.type, body.id) });
}

export async function PUT(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const body = (await request.json().catch(() => null)) as {
    type?: "path" | "lesson";
    id?: string;
    title?: string;
    subtitle?: string;
    track?: string;
    number?: number;
    free?: boolean;
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
    if (isCustomPath(body.id)) {
      updateCustomPath(body.id, {
        number: body.number,
        track: body.track,
        title: body.title,
        subtitle: body.subtitle,
        free: body.free,
      });
    } else {
      saveOverride(`path:${body.id}`, {
        title: body.title?.trim(),
        subtitle: body.subtitle?.trim(),
        track: body.track?.trim(),
        number: body.number,
        free: body.free,
      });
    }
    if (typeof body.free === "boolean") {
      const builtin = LEARNING_PATHS.find((path) => path.id === body.id);
      if (builtin) {
        for (const lesson of builtin.lessons) {
          saveOverride(`lesson:${lesson.id}`, { free: body.free });
        }
      }
      setCustomLessonFreeOnPath(body.id, body.free);
    }
    return Response.json({ ok: true });
  }

  if (isCustomLesson(body.id)) {
    updateCustomLesson(body.id, {
      title: body.title,
      minutes: body.minutes,
      bodyText: body.bodyText,
      example: body.example,
      takeaway: body.takeaway,
      images: (body.images || []).filter((url) => url.startsWith("/uploads/")),
      videos: (body.videos || []).filter((url) => url.startsWith("/uploads/")),
      checkQuestion: body.checkQuestion,
      checkOptions: body.checkOptions,
      checkAnswer: body.checkAnswer,
      free: body.free,
    });
    return Response.json({ ok: true });
  }

  if (!getLesson(body.id) && !getPublishedLesson(body.id)) return jsonError("Unknown lesson.");
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
    free: body.free,
    check: {
      question: body.checkQuestion?.trim() || "Check question",
      options: options.length >= 2 ? options : ["Option A", "Option B"],
      answer: Number.isFinite(body.checkAnswer) ? Number(body.checkAnswer) : 0,
    },
  });
  return Response.json({ ok: true });
}
