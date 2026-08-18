import { QuizPlayer } from "@/components/QuizPlayer";
import { ProGate } from "@/components/ProGate";
import { getPublishedQuizBank } from "@/content/activity-store";
import { shuffleDaily } from "@/content/quizzes";
import { dictionaries, t } from "@/i18n/dictionaries";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function QuizPage({
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
  if (!user.isPro) {
    return <ProGate locale={locale} title={t(dict, "quiz.title")} />;
  }

  if (mode === "daily") {
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "quiz.daily")}</h1>
        <QuizPlayer locale={locale} quizId="daily" questions={shuffleDaily(getPublishedQuizBank("daily"))} />
      </div>
    );
  }
  if (mode === "practice") {
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "quiz.practice")}</h1>
        <QuizPlayer locale={locale} quizId="practice" questions={getPublishedQuizBank("practice")} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="brand-mark text-4xl">{t(dict, "quiz.title")}</h1>
      <p className="text-sm text-[var(--muted)]">
        {t(dict, "dash.xp", { xp: user.xp })}
      </p>
      <a href={`/${locale}/quiz?mode=daily`} className="block rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-semibold">{t(dict, "quiz.daily")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "quiz.dailyDesc")}</p>
      </a>
      <a href={`/${locale}/quiz?mode=practice`} className="block rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-semibold">{t(dict, "quiz.practice")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "quiz.practiceDesc")}</p>
      </a>
    </div>
  );
}
