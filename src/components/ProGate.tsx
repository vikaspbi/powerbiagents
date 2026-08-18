import Link from "next/link";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

export function ProGate({ locale, title }: { locale: Locale; title?: string }) {
  const dict = dictionaries[locale];
  return (
    <div className="gold-card p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-deep)]">Pro</p>
      <h1 className="brand-mark mt-2 text-3xl">{title || t(dict, "paywall.title")}</h1>
      <p className="mt-2 text-[var(--muted)]">{t(dict, "paywall.body")}</p>
      <Link href={`/${locale}/subscribe`} className="btn-gold mt-5 inline-block rounded-full px-5 py-2 text-sm">
        {t(dict, "paywall.cta")}
      </Link>
    </div>
  );
}
