import Link from "next/link";
import { DeleteAccount, LogoutButton } from "@/components/AccountControls";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getDb } from "@/lib/db";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const dict = dictionaries[locale];
  const lessons = (getDb().prepare("SELECT COUNT(*) as c FROM lesson_progress WHERE user_id = ?").get(user.id) as { c: number }).c;
  const quizzes = (getDb().prepare("SELECT COUNT(*) as c FROM quiz_attempts WHERE user_id = ?").get(user.id) as { c: number }).c;

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-16">
      <h1 className="brand-mark text-4xl">{t(dict, "profile.title")}</h1>
      <p className="text-lg">{user.displayName}</p>
      <p className="text-sm text-[var(--muted)]">{user.email}</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--line)] p-4">
          <p className="text-xs text-[var(--muted)]">{t(dict, "profile.lessons")}</p>
          <p className="text-2xl font-semibold">{lessons}</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] p-4">
          <p className="text-xs text-[var(--muted)]">{t(dict, "profile.quizzes")}</p>
          <p className="text-2xl font-semibold">{quizzes}</p>
        </div>
      </div>
      <p className="text-sm text-[var(--teal)]">
        {t(dict, "dash.xp", { xp: user.xp })} · {t(dict, "dash.streak", { n: user.streak })} · {user.isPro ? "Pro" : "Free"}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/settings`} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          {t(dict, "nav.settings")}
        </Link>
        <Link href={`/${locale}/subscribe`} className="rounded-full bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white">
          {t(dict, "nav.subscribe")}
        </Link>
        <LogoutButton locale={locale} />
      </div>
      <DeleteAccount locale={locale} />
    </div>
  );
}
