import { AuthForm } from "@/components/AuthForm";
import { parseLocale } from "@/lib/i18n";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AuthForm mode="register" locale={parseLocale(locale)} />;
}
