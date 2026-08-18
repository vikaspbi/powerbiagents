import { ChapterCatalog } from "@/components/ChapterCatalog";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";
import { LEARNING_PATHS } from "@/content/lessons";

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const dict = dictionaries[locale];
  const done = (
    getDb().prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ?").all(user.id) as { lesson_id: string }[]
  ).map((row) => row.lesson_id);
  const lessonCount = LEARNING_PATHS.reduce((sum, path) => sum + path.lessons.length, 0);

  return (
    <div className="space-y-6 pb-16">
      <section className="gold-card overflow-hidden p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--teal-deep)]">47-chapter academy</p>
        <h1 className="brand-mark mt-2 text-4xl md:text-5xl">{t(dict, "learn.title")}</h1>
        <p className="mt-2 text-[var(--muted)]">{t(dict, "dash.hello", { name: user.displayName })}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--teal-deep)]">
          {t(dict, "dash.xp", { xp: user.xp })} · {t(dict, "dash.streak", { n: user.streak })} · {lessonCount} lessons
        </p>
        {!user.isPro && <p className="mt-3 text-sm text-[var(--muted)]">{t(dict, "dash.freeHint")}</p>}
      </section>
      <ChapterCatalog locale={locale} isPro={user.isPro} done={done} />
    </div>
  );
}
