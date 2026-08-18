"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";
import { useTheme, type Theme } from "@/components/ThemeProvider";

export function SettingsForm({
  locale,
  displayName,
  theme: initialTheme,
}: {
  locale: Locale;
  displayName: string;
  theme: string;
}) {
  const dict = dictionaries[locale];
  const router = useRouter();
  const { setTheme } = useTheme();
  const [name, setName] = useState(displayName);
  const [nextLocale, setNextLocale] = useState(locale);
  const [nextTheme, setNextTheme] = useState<Theme>((initialTheme as Theme) || "system");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setTheme(nextTheme);
    await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name, locale: nextLocale, theme: nextTheme }),
    });
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(`/${nextLocale}/settings`);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void save(e)} className="mx-auto max-w-lg space-y-4 rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
      <h1 className="brand-mark text-3xl">{t(dict, "settings.title")}</h1>
      <label className="block text-sm">
        <span className="mb-1 block">{t(dict, "auth.name")}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block">{t(dict, "settings.language")}</span>
        <select value={nextLocale} onChange={(e) => setNextLocale(e.target.value as Locale)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3">
          {LOCALES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block">{t(dict, "settings.theme")}</span>
        <select value={nextTheme} onChange={(e) => setNextTheme(e.target.value as Theme)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3">
          <option value="system">{t(dict, "settings.system")}</option>
          <option value="light">{t(dict, "settings.light")}</option>
          <option value="dark">{t(dict, "settings.dark")}</option>
        </select>
      </label>
      <button className="gold-fill rounded-full px-5 py-3 text-sm">{t(dict, "settings.save")}</button>
    </form>
  );
}

export function DeleteAccount({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirm }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || t(dict, "common.error"));
      return;
    }
    window.location.href = `/${locale}`;
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-3 rounded-[28px] border border-red-200 p-6 dark:border-red-900">
      <h2 className="font-semibold text-red-800 dark:text-red-200">{t(dict, "profile.delete")}</h2>
      <p className="text-sm text-[var(--muted)]">{t(dict, "profile.deleteHint")}</p>
      <input
        type="password"
        placeholder={t(dict, "auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3"
      />
      <input
        placeholder={t(dict, "profile.confirm")}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3"
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white">{t(dict, "profile.delete")}</button>
    </form>
  );
}

export function LogoutButton({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = `/${locale}`;
      }}
      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
    >
      {t(dict, "nav.logout")}
    </button>
  );
}
