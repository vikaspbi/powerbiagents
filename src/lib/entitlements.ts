import { DAX_EXERCISES } from "@/content/exercises";
import { LEARNING_PATHS } from "@/content/lessons";
import type { PublicUser } from "@/lib/db";

export function canAccessLesson(user: PublicUser | null, lessonId: string) {
  const lesson = LEARNING_PATHS.flatMap((p) => p.lessons).find((l) => l.id === lessonId);
  if (!lesson) return false;
  if (lesson.free) return true;
  return Boolean(user?.isPro);
}

export function canAccessExercise(user: PublicUser | null, exerciseId: string) {
  const exercise = DAX_EXERCISES.find((e) => e.id === exerciseId);
  if (!exercise) return false;
  if (exercise.free) return true;
  return Boolean(user?.isPro);
}

export function canAccessPath(user: PublicUser | null, pathId: string) {
  const path = LEARNING_PATHS.find((p) => p.id === pathId);
  if (!path) return false;
  if (path.free) return true;
  return Boolean(user?.isPro);
}
