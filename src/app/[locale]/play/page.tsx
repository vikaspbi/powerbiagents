import { SpeedRound } from "@/components/SpeedRound";
import { QuizPlayer } from "@/components/QuizPlayer";
import { ProGate } from "@/components/ProGate";
import { getPublishedQuizBank } from "@/content/activity-store";
import { dictionaries, t } from "@/i18n/dictionaries";
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
  if (!user.isPro) {
    return <ProGate locale={locale} title={t(dict, "play.title")} />;
  }

  if (mode === "speed") {
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "play.speed")}</h1>
        <SpeedRound locale={locale} questions={getPublishedQuizBank("play")} />
      </div>
    );
  }
  if (mode === "boss") {
    return (
      <div className="space-y-4">
        <h1 className="brand-mark text-4xl">{t(dict, "play.boss")}</h1>
        <QuizPlayer locale={locale} quizId="boss" questions={getPublishedQuizBank("play")} />
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
      </a>
    </div>
  );
}
