import type { Locale } from "@/lib/i18n";

export interface LessonCopy {
  title: string;
  minutes: number;
  body: string[];
  exampleTitle?: string;
  example?: string;
  takeaway: string;
  images?: string[];
  videos?: string[];
  check: { question: string; options: string[]; answer: number };
}

export interface Lesson {
  id: string;
  pathId: string;
  order: number;
  free: boolean;
  copy: { en: LessonCopy } & Partial<Record<Locale, LessonCopy>>;
}

export interface PathCopy {
  title: string;
  subtitle: string;
}

export interface LearningPath {
  id: string;
  order: number;
  number: number;
  free: boolean;
  track: string;
  copy: { en: PathCopy } & Partial<Record<Locale, PathCopy>>;
  lessons: Lesson[];
}

export function getLessonCopy(lesson: Lesson, locale: Locale): LessonCopy {
  return lesson.copy[locale] ?? lesson.copy.en;
}

export function getPathCopy(path: LearningPath, locale: Locale): PathCopy {
  return path.copy[locale] ?? path.copy.en;
}

export function makeLesson(
  pathId: string,
  order: number,
  free: boolean,
  id: string,
  en: LessonCopy,
): Lesson {
  return { id, pathId, order, free, copy: { en } };
}

export function makePath(
  number: number,
  id: string,
  track: string,
  title: string,
  subtitle: string,
  lessons: Omit<Lesson, "pathId" | "order" | "free">[] | Lesson[],
): LearningPath {
  const freePath = number <= 3;
  const built: Lesson[] = lessons.map((lesson, index) => ({
    ...lesson,
    pathId: id,
    order: index + 1,
    free: freePath || index === 0,
  }));
  return {
    id,
    order: number,
    number,
    free: freePath,
    track,
    copy: { en: { title, subtitle } },
    lessons: built,
  };
}
