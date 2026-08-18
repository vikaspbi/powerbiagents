import { dictionaries, t } from "@/i18n/dictionaries";
import { parseLocale } from "@/lib/i18n";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = parseLocale((await params).locale);
  const dict = dictionaries[locale];
  return (
    <article className="prose-sm mx-auto max-w-2xl space-y-4 pb-16 text-[var(--muted)]">
      <h1 className="brand-mark text-4xl text-[var(--ink)]">{t(dict, "legal.termsTitle")}</h1>
      <p>
        LearnInPowerBI is an independent educational product. It is not affiliated with, endorsed by, or sponsored by
        Microsoft. Power BI is a trademark of Microsoft Corporation.
      </p>
      <p>
        The in-app DAX lab is a teaching engine with a limited function set. Results can differ from Microsoft Power BI
        Desktop / VertiPaq. Do not use lab output as production measures without testing in Power BI.
      </p>
      <p>
        Free and Pro feature gates are described in the app. Paid subscriptions renew until cancelled. Google Play
        purchases follow Google’s refund policies; web purchases follow Stripe and the publisher’s refund policy.
      </p>
    </article>
  );
}
