import { SpeedRound } from "@/components/SpeedRound";
import { QuizPlayer } from "@/components/QuizPlayer";
import { QUIZ_BANK } from "@/content/quizzes";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function PlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { locale: raw } = await params;
  const { mode } = await searchParams;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const dict = dictionaries[locale];
  const lessonCount = (
    getDb().prepare("SELECT COUNT(*) as c FROM lesson_progress WHERE user_id = ?").get(user.id) as { c: number }
  ).c;
  const bossUnlocked = user.isPro || lessonCount >= 3;

  if (mode === "speed") {
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "play.speed")}</h1>
        <SpeedRound locale={locale} questions={QUIZ_BANK} />
      </div>
    );
  }
  if (mode === "boss") {
    if (!bossUnlocked) {
      return <p className="text-[var(--muted)]">{t(dict, "play.locked")}</p>;
    }
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "play.boss")}</h1>
        <QuizPlayer locale={locale} quizId="boss" questions={QUIZ_BANK} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="brand-mark text-4xl">{t(dict, "play.title")}</h1>
      <a href={`/${locale}/play?mode=speed`} className="block rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-semibold">{t(dict, "play.speed")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "play.speedDesc")}</p>
      </a>
      <a href={`/${locale}/play?mode=boss`} className="block rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-semibold">{t(dict, "play.boss")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "play.bossDesc")}</p>
        {!bossUnlocked && <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">{t(dict, "play.locked")}</p>}
      </a>
    </div>
  );
}
