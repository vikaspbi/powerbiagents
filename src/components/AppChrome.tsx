"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import { LOCALES, parseLocale, type Locale } from "@/lib/i18n";
import { useTheme, type Theme } from "@/components/ThemeProvider";

const tabs = [
  { href: "/learn", key: "nav.learn" },
  { href: "/quiz", key: "nav.quiz" },
  { href: "/dax", key: "nav.dax" },
  { href: "/play", key: "nav.play" },
  { href: "/profile", key: "nav.profile" },
] as const;

function pathWithoutLocale(pathname: string) {
  const parts = pathname.split("/");
  if (LOCALES.includes(parts[1] as Locale)) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

export function AppChrome({
  locale,
  signedIn,
  isPro,
  showAdmin = false,
}: {
  locale: Locale;
  signedIn: boolean;
  isPro: boolean;
  showAdmin?: boolean;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const dict = dictionaries[locale];
  const rest = pathWithoutLocale(pathname);
  const { theme, setTheme } = useTheme();

  function switchLocale(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    router.push(`/${next}${rest === "/" ? "" : rest}`);
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--panel)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href={`/${locale}${signedIn ? "/learn" : ""}`} className="brand-mark text-xl text-[var(--ink)]">
            LearnInPowerBI
          </Link>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="locale">
              {t(dict, "settings.language")}
            </label>
            <select
              id="locale"
              value={locale}
              onChange={(e) => switchLocale(e.target.value)}
              className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-2 py-1 text-xs text-[var(--ink)]"
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
            <select
              aria-label={t(dict, "settings.theme")}
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-2 py-1 text-xs text-[var(--ink)]"
            >
              <option value="system">{t(dict, "settings.system")}</option>
              <option value="light">{t(dict, "settings.light")}</option>
              <option value="dark">{t(dict, "settings.dark")}</option>
            </select>
            {signedIn ? (
              <>
                {showAdmin && (
                  <Link href={`/${locale}/admin`} className="text-sm font-bold text-[var(--teal-deep)]">
                    {t(dict, "nav.admin")}
                  </Link>
                )}
                <Link
                  href={`/${locale}/subscribe`}
                  className="gold-fill hidden rounded-full px-3 py-1.5 text-xs sm:inline"
                >
                  {isPro ? "Pro" : t(dict, "nav.subscribe")}
                </Link>
              </>
            ) : (
              <Link href={`/${locale}/login`} className="text-sm font-medium text-[var(--teal)]">
                {t(dict, "nav.login")}
              </Link>
            )}
          </div>
        </div>
      </header>
      {signedIn && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--line)] bg-[var(--panel)] sm:hidden">
          <ul className="grid grid-cols-5 text-[11px]">
            {tabs.map((tab) => {
              const href = `/${locale}${tab.href}`;
              const active = rest === tab.href || rest.startsWith(`${tab.href}/`);
              return (
                <li key={tab.href}>
                  <Link
                    href={href}
                    className={`flex h-14 flex-col items-center justify-center ${active ? "text-[var(--teal)]" : "text-[var(--muted)]"}`}
                  >
                    {t(dict, tab.key)}
                    {!isPro && (tab.href === "/quiz" || tab.href === "/dax" || tab.href === "/play") ? " 🔒" : ""}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      {signedIn && (
        <nav className="mx-auto hidden max-w-6xl gap-4 px-4 pt-4 sm:flex">
          {tabs.map((tab) => {
            const href = `/${locale}${tab.href}`;
            const active = rest === tab.href || rest.startsWith(`${tab.href}/`);
            const locked = !isPro && (tab.href === "/quiz" || tab.href === "/dax" || tab.href === "/play");
            return (
              <Link
                key={tab.href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm ${active ? "gold-fill" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
              >
                {t(dict, tab.key)}
                {locked ? " 🔒" : ""}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
}

export function LocaleGate({ locale }: { locale: string }) {
  const parsed = parseLocale(locale);
  useEffect(() => {
    document.documentElement.lang = parsed;
  }, [parsed]);
  return null;
}
