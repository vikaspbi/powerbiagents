import Link from "next/link";
import { LEARNING_PATHS } from "@/content/lessons";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const dict = dictionaries[locale];
  const done = new Set(
    (getDb().prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ?").all(user.id) as { lesson_id: string }[]).map(
      (r) => r.lesson_id,
    ),
  );

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="brand-mark text-4xl">{t(dict, "learn.title")}</h1>
        <p className="mt-2 text-[var(--muted)]">{t(dict, "dash.hello", { name: user.displayName })}</p>
        <p className="mt-1 text-sm text-[var(--teal)]">
          {t(dict, "dash.xp", { xp: user.xp })} · {t(dict, "dash.streak", { n: user.streak })}
        </p>
        {!user.isPro && <p className="mt-3 text-sm text-[var(--muted)]">{t(dict, "dash.freeHint")}</p>}
      </div>
      {LEARNING_PATHS.map((path) => {
        const locked = !path.free && !user.isPro;
        const copy = path.copy[locale];
        return (
          <section key={path.id} className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{copy.title}</h2>
                <p className="text-sm text-[var(--muted)]">{copy.subtitle}</p>
              </div>
              {locked && <span className="text-xs text-[var(--muted)]">{t(dict, "learn.locked")}</span>}
            </div>
            <ul className="mt-4 space-y-2">
              {path.lessons.map((lesson) => {
                const lessonLocked = !lesson.free && !user.isPro;
                const href = `/${locale}/learn/${path.id}/${lesson.id}`;
                return (
                  <li key={lesson.id}>
                    {lessonLocked ? (
                      <div className="flex items-center justify-between rounded-2xl border border-dashed border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
                        <span>{lesson.copy[locale].title}</span>
                        <Link href={`/${locale}/subscribe`} className="text-[var(--teal)]">
                          Pro
                        </Link>
                      </div>
                    ) : (
                      <Link href={href} className="flex items-center justify-between rounded-2xl border border-[var(--line)] px-4 py-3 text-sm hover:border-[var(--teal)]">
                        <span>{lesson.copy[locale].title}</span>
                        <span className="text-xs text-[var(--muted)]">
                          {done.has(lesson.id) ? "✓" : t(dict, "learn.minutes", { n: lesson.copy[locale].minutes })}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
