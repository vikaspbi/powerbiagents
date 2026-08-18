import { ThemeProvider } from "@/components/ThemeProvider";
import { AppChrome, LocaleGate } from "@/components/AppChrome";
import { getCurrentUser } from "@/lib/auth";
import { LOCALES, parseLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = parseLocale(raw);
  const user = await getCurrentUser();

  return (
    <ThemeProvider initialTheme={(user?.theme as "light" | "dark" | "system") || "system"}>
      <LocaleGate locale={locale} />
      <AppChrome
        locale={locale}
        signedIn={Boolean(user)}
        isPro={Boolean(user?.isPro)}
        showAdmin={Boolean(user?.canSeeAdminPanel)}
      />
      <main className="mx-auto min-h-[80vh] max-w-6xl px-4 py-8 pb-24">{children}</main>
    </ThemeProvider>
  );
}
