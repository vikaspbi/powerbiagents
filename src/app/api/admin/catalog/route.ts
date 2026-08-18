import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";
import { getPublishedPaths } from "@/content/publish";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const paths = getPublishedPaths().map((path) => ({
    id: path.id,
    number: path.number,
    track: path.track,
    title: path.copy.en.title,
    subtitle: path.copy.en.subtitle,
    lessons: path.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.copy.en.title,
      minutes: lesson.copy.en.minutes,
      body: lesson.copy.en.body,
      example: lesson.copy.en.example ?? "",
      takeaway: lesson.copy.en.takeaway,
      images: lesson.copy.en.images ?? [],
      videos: lesson.copy.en.videos ?? [],
      check: lesson.copy.en.check,
    })),
  }));
  return Response.json({ paths });
}
