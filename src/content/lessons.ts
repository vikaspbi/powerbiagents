import { CURRICULUM_PART_A } from "@/content/part-a";
import { CURRICULUM_PART_B } from "@/content/part-b";
import { CURRICULUM_PART_C } from "@/content/part-c";
import { CURRICULUM_PART_D } from "@/content/part-d";
import { CURRICULUM_PART_E } from "@/content/part-e";
import type { LearningPath, Lesson } from "@/content/schema";

export type { LearningPath, Lesson, LessonCopy, PathCopy } from "@/content/schema";
export { getLessonCopy, getPathCopy } from "@/content/schema";

export const LEARNING_PATHS: LearningPath[] = [
  ...CURRICULUM_PART_A,
  ...CURRICULUM_PART_B,
  ...CURRICULUM_PART_C,
  ...CURRICULUM_PART_D,
  ...CURRICULUM_PART_E,
];

export function allLessons(): Lesson[] {
  return LEARNING_PATHS.flatMap((path) => path.lessons);
}

export function getLesson(id: string): Lesson | undefined {
  return allLessons().find((lesson) => lesson.id === id);
}

export function getPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((path) => path.id === id);
}

export const TRACKS = [...new Set(LEARNING_PATHS.map((path) => path.track))];
