import { AuthForm } from "@/components/AuthForm";
import { parseLocale } from "@/lib/i18n";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuthForm mode="login" locale={parseLocale(locale)} />;
}
