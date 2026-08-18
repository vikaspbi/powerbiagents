import Link from "next/link";
import { dictionaries, t } from "@/i18n/dictionaries";
import { parseLocale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/learn`);
  const dict = dictionaries[locale];

  const features = [
    ["landing.f1t", "landing.f1d"],
    ["landing.f2t", "landing.f2d"],
    ["landing.f3t", "landing.f3d"],
    ["landing.f4t", "landing.f4d"],
  ] as const;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--panel)] p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">{t(dict, "landing.kicker")}</p>
        <h1 className="brand-mark mt-3 max-w-3xl text-4xl leading-tight md:text-6xl">{t(dict, "landing.title")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{t(dict, "landing.body")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/register`} className="rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white">
            {t(dict, "landing.cta")}
          </Link>
          <Link href={`/${locale}/login`} className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold">
            {t(dict, "landing.secondary")}
          </Link>
        </div>
        <p className="mt-6 text-xs text-[var(--muted)]">{t(dict, "app.disclaimer")}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {features.map(([title, body]) => (
          <div key={title} className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-semibold">{t(dict, title)}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, body)}</p>
          </div>
        ))}
      </section>
      <p className="text-center text-sm text-[var(--muted)]">
        <Link href={`/${locale}/privacy`} className="underline">
          {t(dict, "legal.privacy")}
        </Link>
        {" · "}
        <Link href={`/${locale}/terms`} className="underline">
          {t(dict, "legal.terms")}
        </Link>
      </p>
    </div>
  );
}
