import { getPublishedExercise } from "@/content/activity-store";
import { getPublishedLesson, getPublishedPath } from "@/content/publish";
import type { PublicUser } from "@/lib/db";

export function canAccessLesson(user: PublicUser | null, lessonId: string) {
  const lesson = getPublishedLesson(lessonId);
  if (!lesson) return false;
  if (lesson.free) return true;
  return Boolean(user?.isPro);
}

export function canAccessExercise(user: PublicUser | null, exerciseId: string) {
  if (!user?.isPro) return false;
  return Boolean(getPublishedExercise(exerciseId));
}

export function canAccessPath(user: PublicUser | null, pathId: string) {
  const path = getPublishedPath(pathId);
  if (!path) return false;
  if (path.free) return true;
  return Boolean(user?.isPro);
}

export function canAccessProArea(user: PublicUser | null) {
  return Boolean(user?.isPro);
}
