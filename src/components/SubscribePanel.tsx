"use client";

import { useState } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

export function SubscribePanel({
  locale,
  isPro,
  periodEnd,
  status,
  provider,
  isAdmin,
}: {
  locale: Locale;
  isPro: boolean;
  periodEnd?: string | null;
  status?: string | null;
  provider?: string | null;
  isAdmin?: boolean;
}) {
  const dict = dictionaries[locale];
  const [message, setMessage] = useState("");

  async function checkout(plan: "monthly" | "yearly") {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMessage(data.error || t(dict, "common.error"));
  }

  async function cancel() {
    const res = await fetch("/api/billing/cancel", { method: "POST" });
    const data = (await res.json()) as { error?: string; message?: string };
    if (!res.ok) {
      setMessage(data.error || t(dict, "common.error"));
      return;
    }
    setMessage(data.message || t(dict, "sub.canceled", { date: periodEnd ? new Date(periodEnd).toLocaleDateString(locale) : "" }));
    window.location.reload();
  }

  async function demo() {
    const res = await fetch("/api/billing/checkout", { method: "PUT" });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setMessage(data.error || t(dict, "common.error"));
      return;
    }
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <h1 className="brand-mark text-4xl">{t(dict, "sub.title")}</h1>
      <p className="text-[var(--muted)]">{t(dict, "sub.included")}</p>
      {isPro && periodEnd && (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
          {status === "canceled"
            ? t(dict, "sub.canceled", { date: new Date(periodEnd).toLocaleDateString(locale) })
            : t(dict, "sub.active", { date: new Date(periodEnd).toLocaleDateString(locale) })}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void checkout("monthly")}
          className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6 text-left"
        >
          <p className="text-lg font-semibold">{t(dict, "sub.monthly")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "sub.priceM")}</p>
          <p className="mt-4 text-sm font-medium text-[var(--teal)]">{t(dict, "sub.web")}</p>
        </button>
        <button
          type="button"
          onClick={() => void checkout("yearly")}
          className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6 text-left"
        >
          <p className="text-lg font-semibold">{t(dict, "sub.yearly")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{t(dict, "sub.priceY")}</p>
          <p className="mt-4 text-sm font-medium text-[var(--teal)]">{t(dict, "sub.web")}</p>
        </button>
      </div>
      <p className="text-sm text-[var(--muted)]">{t(dict, "sub.play")}</p>
      <p className="text-sm text-[var(--muted)]">{t(dict, "sub.restore")}</p>
      {isPro && !isAdmin && status !== "canceled" && (
        <button type="button" onClick={() => void cancel()} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
          {t(dict, "sub.cancel")}
        </button>
      )}
      {provider === "google_play" && (
        <p className="text-sm text-[var(--muted)]">{t(dict, "sub.playCancel")}</p>
      )}
      <button type="button" onClick={() => void demo()} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
        {t(dict, "sub.demo")}
      </button>
      {message && <p className="text-sm text-amber-800 dark:text-amber-200">{message}</p>}
    </div>
  );
}
