import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { getPath } from "@/content/lessons";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { canAccessLesson } from "@/lib/entitlements";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; pathId: string; lessonId: string }>;
}) {
  const { locale: raw, pathId, lessonId } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const path = getPath(pathId);
  const lesson = path?.lessons.find((l) => l.id === lessonId);
  if (!path || !lesson) notFound();
  const dict = dictionaries[locale];
  if (!canAccessLesson(user, lesson.id)) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-8">
        <h1 className="text-2xl font-semibold">{t(dict, "paywall.title")}</h1>
        <p className="mt-2 text-[var(--muted)]">{t(dict, "paywall.body")}</p>
        <Link href={`/${locale}/subscribe`} className="mt-4 inline-block rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white">
          {t(dict, "paywall.cta")}
        </Link>
      </div>
    );
  }
  const idx = path.lessons.findIndex((l) => l.id === lesson.id);
  const next = path.lessons[idx + 1];
  const completed = Boolean(
    getDb().prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id),
  );
  return (
    <LessonView
      locale={locale}
      lesson={lesson}
      completed={completed}
      nextHref={next ? `/${locale}/learn/${path.id}/${next.id}` : `/${locale}/learn`}
    />
  );
}
