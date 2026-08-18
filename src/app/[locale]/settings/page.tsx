import { SettingsForm } from "@/components/AccountControls";
import { parseLocale } from "@/lib/i18n";
import { requireUser } from "@/lib/require-user";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await requireUser(locale);
  return <SettingsForm locale={locale} displayName={user.displayName} theme={user.theme} />;
}
