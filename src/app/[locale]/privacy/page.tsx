import { dictionaries, t } from "@/i18n/dictionaries";
import { parseLocale } from "@/lib/i18n";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = parseLocale((await params).locale);
  const dict = dictionaries[locale];
  return (
    <article className="prose-sm mx-auto max-w-2xl space-y-4 pb-16 text-[var(--muted)]">
      <h1 className="brand-mark text-4xl text-[var(--ink)]">{t(dict, "legal.privacyTitle")}</h1>
      <p>
        LearnInPowerBI stores the account data you provide (email, display name, password hash), learning progress,
        quiz and DAX attempts, language/theme preferences, and subscription entitlements.
      </p>
      <p>
        Passwords are hashed. Payment card numbers are never stored on our servers. Android subscriptions are processed
        by Google Play. Web subscriptions are processed by Stripe when configured.
      </p>
      <p>
        You can delete your account in Profile. That removes your user record and progress on this backend. Cancel Play
        or Stripe subscriptions with those providers as well.
      </p>
      <p>Contact the publisher listed on the Play Store listing for privacy requests.</p>
    </article>
  );
}
