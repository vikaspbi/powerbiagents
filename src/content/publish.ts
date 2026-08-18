import { LEARNING_PATHS, type LearningPath, type Lesson, type LessonCopy, type PathCopy } from "@/content/lessons";
import { getSeedAndCustomPaths } from "@/content/catalog-store";
import { getDb } from "@/lib/db";

export interface LessonOverride extends Partial<LessonCopy> {
  title?: string;
  subtitle?: string;
  free?: boolean;
  track?: string;
  number?: number;
}

export function loadOverrideMap(): Record<string, LessonOverride> {
  const rows = getDb().prepare("SELECT key, payload FROM content_overrides").all() as { key: string; payload: string }[];
  const map: Record<string, LessonOverride> = {};
  for (const row of rows) {
    try {
      map[row.key] = JSON.parse(row.payload) as LessonOverride;
    } catch {
      /* skip bad rows */
    }
  }
  return map;
}

export function saveOverride(key: string, payload: LessonOverride) {
  const current = loadOverrideMap()[key] || {};
  getDb()
    .prepare(
      `INSERT INTO content_overrides (key, payload, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`,
    )
    .run(key, JSON.stringify({ ...current, ...payload }), new Date().toISOString());
}

export function getPublishedPaths(): LearningPath[] {
  const map = loadOverrideMap();
  return getSeedAndCustomPaths().map((path) => applyPathOverride(path, map));
}

export function getPublishedPath(id: string): LearningPath | undefined {
  return getPublishedPaths().find((path) => path.id === id);
}

export function getPublishedLesson(id: string): Lesson | undefined {
  return getPublishedPaths()
    .flatMap((path) => path.lessons)
    .find((lesson) => lesson.id === id);
}

function applyPathOverride(path: LearningPath, map: Record<string, LessonOverride>): LearningPath {
  const pathPatch = map[`path:${path.id}`];
  const en: PathCopy = {
    title: pathPatch?.title ?? path.copy.en.title,
    subtitle: pathPatch?.subtitle ?? path.copy.en.subtitle,
  };
  const free = pathPatch?.free ?? path.free;
  return {
    ...path,
    number: pathPatch?.number ?? path.number,
    track: pathPatch?.track ?? path.track,
    free,
    copy: { ...path.copy, en },
    lessons: path.lessons.map((lesson) => applyLessonOverride(lesson, map[`lesson:${lesson.id}`], free)),
  };
}

function applyLessonOverride(lesson: Lesson, patch: LessonOverride | undefined, pathFree: boolean): Lesson {
  const base = lesson.copy.en;
  const en: LessonCopy = {
    ...base,
    ...patch,
    title: patch?.title ?? base.title,
    minutes: patch?.minutes ?? base.minutes,
    body: patch?.body ?? base.body,
    example: patch?.example ?? base.example,
    exampleTitle: patch?.exampleTitle ?? base.exampleTitle,
    takeaway: patch?.takeaway ?? base.takeaway,
    images: patch?.images ?? base.images,
    videos: patch?.videos ?? base.videos,
    check: patch?.check ?? base.check,
  };
  const free = patch?.free ?? lesson.free ?? pathFree;
  return { ...lesson, free, copy: { ...lesson.copy, en } };
}

export { LEARNING_PATHS };
