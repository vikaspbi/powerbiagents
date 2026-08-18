import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";
import { LEARNING_PATHS } from "@/content/lessons";
import { getPublishedPaths } from "@/content/publish";
import { isCustomLesson, isCustomPath } from "@/content/catalog-store";
import { getDb } from "@/lib/db";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const hidden = getDb().prepare("SELECT kind, id FROM hidden_items").all() as { kind: string; id: string }[];
  const hiddenPaths = new Set(hidden.filter((row) => row.kind === "path").map((row) => row.id));
  const hiddenLessons = new Set(hidden.filter((row) => row.kind === "lesson").map((row) => row.id));
  const live = getPublishedPaths();
  const liveIds = new Set(live.map((path) => path.id));
  const restoredHidden = LEARNING_PATHS.filter((path) => hiddenPaths.has(path.id) && !liveIds.has(path.id));
  const paths = [...live, ...restoredHidden].map((path) => ({
    id: path.id,
    number: path.number,
    track: path.track,
    title: path.copy.en.title,
    subtitle: path.copy.en.subtitle,
    free: path.free,
    source: isCustomPath(path.id) ? "custom" : "builtin",
    hidden: hiddenPaths.has(path.id),
    lessons: [
      ...path.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.copy.en.title,
        minutes: lesson.copy.en.minutes,
        body: lesson.copy.en.body,
        example: lesson.copy.en.example ?? "",
        takeaway: lesson.copy.en.takeaway,
        images: lesson.copy.en.images ?? [],
        videos: lesson.copy.en.videos ?? [],
        check: lesson.copy.en.check,
        free: lesson.free,
        source: isCustomLesson(lesson.id) ? "custom" : "builtin",
        hidden: hiddenLessons.has(lesson.id),
      })),
      ...(LEARNING_PATHS.find((item) => item.id === path.id)?.lessons || [])
        .filter((lesson) => hiddenLessons.has(lesson.id))
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.copy.en.title,
          minutes: lesson.copy.en.minutes,
          body: lesson.copy.en.body,
          example: lesson.copy.en.example ?? "",
          takeaway: lesson.copy.en.takeaway,
          images: lesson.copy.en.images ?? [],
          videos: lesson.copy.en.videos ?? [],
          check: lesson.copy.en.check,
          free: lesson.free,
          source: "builtin" as const,
          hidden: true,
        })),
    ],
  }));
  return Response.json({ paths });
}
