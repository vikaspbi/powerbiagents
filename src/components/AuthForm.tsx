"use client";

import Link from "next/link";
import { useState } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

export function AuthForm({
  mode,
  locale,
}: {
  mode: "login" | "register";
  locale: Locale;
}) {
  const dict = dictionaries[locale];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, locale }),
    });
    const data = (await res.json()) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setError(data.error || t(dict, "auth.error"));
      return;
    }
    window.location.href = `/${locale}/learn`;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4 rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
      <h1 className="brand-mark text-3xl text-[var(--ink)]">
        {t(dict, mode === "login" ? "auth.loginTitle" : "auth.registerTitle")}
      </h1>
      {mode === "register" && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium">{t(dict, "auth.name")}</span>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3"
          />
        </label>
      )}
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t(dict, "auth.email")}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{t(dict, "auth.password")}</span>
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-4 py-3"
        />
      </label>
      {error && <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-100">{error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-[var(--teal)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {t(dict, mode === "login" ? "auth.submitLogin" : "auth.submitRegister")}
      </button>
      <p className="text-sm text-[var(--muted)]">
        {mode === "login" ? t(dict, "auth.noAccount") : t(dict, "auth.hasAccount")}{" "}
        <Link className="text-[var(--teal)]" href={`/${locale}/${mode === "login" ? "register" : "login"}`}>
          {t(dict, mode === "login" ? "nav.register" : "nav.login")}
        </Link>
      </p>
    </form>
  );
}
