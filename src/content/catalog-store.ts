import {
  LEARNING_PATHS,
  type LearningPath,
  type Lesson,
  type LessonCopy,
  type PathCopy,
} from "@/content/lessons";
import { getDb } from "@/lib/db";

interface PathRow {
  id: string;
  number: number;
  track: string;
  free: number;
  copy: string;
}

interface LessonRow {
  id: string;
  path_id: string;
  sort_order: number;
  free: number;
  copy: string;
}

function hiddenSet(kind: "path" | "lesson") {
  const rows = getDb().prepare("SELECT id FROM hidden_items WHERE kind = ?").all(kind) as { id: string }[];
  return new Set(rows.map((row) => row.id));
}

function parsePathCopy(raw: string): PathCopy | null {
  try {
    const copy = JSON.parse(raw) as PathCopy;
    if (!copy?.title) return null;
    return copy;
  } catch {
    return null;
  }
}

function parseLessonCopy(raw: string): LessonCopy | null {
  try {
    const copy = JSON.parse(raw) as LessonCopy;
    if (!copy?.title || !Array.isArray(copy.body)) return null;
    return {
      ...copy,
      minutes: copy.minutes || 8,
      example: copy.example || "",
      takeaway: copy.takeaway || "",
      images: copy.images || [],
      videos: copy.videos || [],
      check: copy.check || { question: "Check question", options: ["Option A", "Option B"], answer: 0 },
    };
  } catch {
    return null;
  }
}

function customLessonsByPath(): Map<string, Lesson[]> {
  const lessonRows = getDb().prepare("SELECT * FROM catalog_lessons ORDER BY sort_order ASC").all() as LessonRow[];
  const map = new Map<string, Lesson[]>();
  for (const lesson of lessonRows) {
    const lessonCopy = parseLessonCopy(lesson.copy);
    const item: Lesson = {
      id: lesson.id,
      pathId: lesson.path_id,
      order: lesson.sort_order,
      free: lesson.free === 1,
      copy: {
        en:
          lessonCopy ?? {
            title: "Untitled",
            minutes: 8,
            body: [],
            takeaway: "",
            check: { question: "", options: ["A", "B"], answer: 0 },
          },
      },
    };
    const list = map.get(lesson.path_id) ?? [];
    list.push(item);
    map.set(lesson.path_id, list);
  }
  return map;
}

function customPaths(): LearningPath[] {
  const pathRows = getDb().prepare("SELECT * FROM catalog_paths ORDER BY number ASC").all() as PathRow[];
  const lessonsByPath = customLessonsByPath();
  return pathRows.map((row) => {
    const copy = parsePathCopy(row.copy) ?? { title: "Untitled", subtitle: "" };
    const lessons = lessonsByPath.get(row.id) ?? [];
    return {
      id: row.id,
      order: row.number,
      number: row.number,
      free: row.free === 1,
      track: row.track || "Custom",
      copy: { en: copy },
      lessons,
    };
  });
}

export function hideCatalogItem(kind: "path" | "lesson", id: string) {
  const builtinPath = LEARNING_PATHS.some((path) => path.id === id);
  const builtinLesson = LEARNING_PATHS.some((path) => path.lessons.some((lesson) => lesson.id === id));
  if (kind === "path" && !builtinPath) {
    getDb().prepare("DELETE FROM catalog_lessons WHERE path_id = ?").run(id);
    getDb().prepare("DELETE FROM catalog_paths WHERE id = ?").run(id);
    return { deleted: true };
  }
  if (kind === "lesson" && !builtinLesson) {
    getDb().prepare("DELETE FROM catalog_lessons WHERE id = ?").run(id);
    return { deleted: true };
  }
  getDb().prepare("INSERT OR IGNORE INTO hidden_items (kind, id) VALUES (?, ?)").run(kind, id);
  return { hidden: true };
}

export function restoreCatalogItem(kind: "path" | "lesson", id: string) {
  getDb().prepare("DELETE FROM hidden_items WHERE kind = ? AND id = ?").run(kind, id);
}

export function createCustomPath(input: { number?: number; track?: string; title?: string; subtitle?: string; free?: boolean }) {
  const title = input.title?.trim();
  if (!title) throw new Error("Chapter title is required.");
  const id = `path-${crypto.randomUUID()}`;
  const number = Number(input.number) || LEARNING_PATHS.length + customPaths().length + 1;
  getDb()
    .prepare("INSERT INTO catalog_paths (id, number, track, free, copy, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(
      id,
      number,
      input.track?.trim() || "Custom",
      input.free === false ? 0 : 1,
      JSON.stringify({ title, subtitle: input.subtitle?.trim() || "" } satisfies PathCopy),
      new Date().toISOString(),
    );
  return id;
}

export function createCustomLesson(input: {
  pathId: string;
  title?: string;
  minutes?: number;
  bodyText?: string;
  example?: string;
  takeaway?: string;
  checkQuestion?: string;
  checkOptions?: string;
  checkAnswer?: number;
  free?: boolean;
}) {
  const pathExists =
    LEARNING_PATHS.some((path) => path.id === input.pathId) ||
    Boolean(getDb().prepare("SELECT id FROM catalog_paths WHERE id = ?").get(input.pathId));
  if (!pathExists) throw new Error("Unknown chapter.");
  const title = input.title?.trim();
  if (!title) throw new Error("Lesson title is required.");
  const options = (input.checkOptions || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const id = `lesson-${crypto.randomUUID()}`;
  const sort =
    (
      getDb().prepare("SELECT COUNT(*) as c FROM catalog_lessons WHERE path_id = ?").get(input.pathId) as {
        c: number;
      }
    ).c + 1;
  const copy: LessonCopy = {
    title,
    minutes: Number(input.minutes) || 8,
    body: (input.bodyText || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    example: input.example?.trim() || "",
    takeaway: input.takeaway?.trim() || "",
    images: [],
    videos: [],
    check: {
      question: input.checkQuestion?.trim() || "Check question",
      options: options.length >= 2 ? options : ["Option A", "Option B"],
      answer: Number.isFinite(input.checkAnswer) ? Number(input.checkAnswer) : 0,
    },
  };
  getDb()
    .prepare("INSERT INTO catalog_lessons (id, path_id, sort_order, free, copy, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(id, input.pathId, sort, input.free ? 1 : 0, JSON.stringify(copy), new Date().toISOString());
  return id;
}

export function updateCustomPath(id: string, patch: { number?: number; track?: string; title?: string; subtitle?: string; free?: boolean }) {
  const row = getDb().prepare("SELECT * FROM catalog_paths WHERE id = ?").get(id) as PathRow | undefined;
  if (!row) return false;
  const copy = parsePathCopy(row.copy) ?? { title: "Untitled", subtitle: "" };
  getDb()
    .prepare("UPDATE catalog_paths SET number = ?, track = ?, free = ?, copy = ? WHERE id = ?")
    .run(
      Number(patch.number) || row.number,
      patch.track?.trim() || row.track,
      patch.free === false ? 0 : patch.free === true ? 1 : row.free,
      JSON.stringify({
        title: patch.title?.trim() || copy.title,
        subtitle: patch.subtitle?.trim() ?? copy.subtitle,
      } satisfies PathCopy),
      id,
    );
  return true;
}

export function updateCustomLesson(
  id: string,
  patch: {
    title?: string;
    minutes?: number;
    bodyText?: string;
    example?: string;
    takeaway?: string;
    images?: string[];
    videos?: string[];
    checkQuestion?: string;
    checkOptions?: string;
    checkAnswer?: number;
    free?: boolean;
  },
) {
  const row = getDb().prepare("SELECT * FROM catalog_lessons WHERE id = ?").get(id) as LessonRow | undefined;
  if (!row) return false;
  const copy = parseLessonCopy(row.copy);
  if (!copy) return false;
  const options = (patch.checkOptions || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const next: LessonCopy = {
    ...copy,
    title: patch.title?.trim() || copy.title,
    minutes: Number(patch.minutes) || copy.minutes,
    body: patch.bodyText
      ? patch.bodyText
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : copy.body,
    example: patch.example?.trim() ?? copy.example,
    takeaway: patch.takeaway?.trim() ?? copy.takeaway,
    images: patch.images ?? copy.images,
    videos: patch.videos ?? copy.videos,
    check: {
      question: patch.checkQuestion?.trim() || copy.check.question,
      options: options.length >= 2 ? options : copy.check.options,
      answer: Number.isFinite(patch.checkAnswer) ? Number(patch.checkAnswer) : copy.check.answer,
    },
  };
  getDb()
    .prepare("UPDATE catalog_lessons SET free = ?, copy = ? WHERE id = ?")
    .run(patch.free === false ? 0 : patch.free === true ? 1 : row.free, JSON.stringify(next), id);
  return true;
}

export function isCustomPath(id: string) {
  return Boolean(getDb().prepare("SELECT id FROM catalog_paths WHERE id = ?").get(id));
}

export function isCustomLesson(id: string) {
  return Boolean(getDb().prepare("SELECT id FROM catalog_lessons WHERE id = ?").get(id));
}

export function getSeedAndCustomPaths(): LearningPath[] {
  const hiddenPaths = hiddenSet("path");
  const hiddenLessons = hiddenSet("lesson");
  const extras = customPaths();
  const extraLessons = customLessonsByPath();
  const builtins = LEARNING_PATHS.filter((path) => !hiddenPaths.has(path.id)).map((path) => ({
    ...path,
    lessons: [...path.lessons.filter((lesson) => !hiddenLessons.has(lesson.id)), ...(extraLessons.get(path.id) ?? [])],
  }));
  const customOnly = extras.filter((path) => !LEARNING_PATHS.some((item) => item.id === path.id) && !hiddenPaths.has(path.id));
  return [...builtins, ...customOnly].sort((a, b) => a.number - b.number);
}

export function setCustomLessonFreeOnPath(pathId: string, free: boolean) {
  getDb().prepare("UPDATE catalog_lessons SET free = ? WHERE path_id = ?").run(free ? 1 : 0, pathId);
}
