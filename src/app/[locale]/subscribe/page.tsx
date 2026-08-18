import { SubscribePanel } from "@/components/SubscribePanel";
import { getSubscription } from "@/lib/auth";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function SubscribePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  const sub = getSubscription(user.id);
  return <SubscribePanel locale={locale} isPro={user.isPro} periodEnd={sub?.current_period_end} />;
}
