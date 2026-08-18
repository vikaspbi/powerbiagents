"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lesson } from "@/content/lessons";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

export function LessonView({
  locale,
  lesson,
  nextHref,
  completed,
}: {
  locale: Locale;
  lesson: Lesson;
  nextHref?: string;
  completed: boolean;
}) {
  const dict = dictionaries[locale];
  const copy = lesson.copy[locale];
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(completed);
  const router = useRouter();

  async function complete() {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id }),
    });
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 pb-24">
      <p className="text-xs uppercase tracking-widest text-[var(--teal)]">{t(dict, "learn.minutes", { n: copy.minutes })}</p>
      <h1 className="brand-mark text-4xl text-[var(--ink)]">{copy.title}</h1>
      {copy.body.map((p) => (
        <p key={p} className="leading-relaxed text-[var(--muted)]">
          {p}
        </p>
      ))}
      <div className="rounded-3xl bg-[var(--sand)] p-5 dark:bg-[var(--teal-soft)]">
        <p className="text-xs font-semibold uppercase tracking-widest">{t(dict, "learn.takeaway")}</p>
        <p className="mt-2 font-medium text-[var(--ink)]">{copy.takeaway}</p>
      </div>
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-5">
        <h2 className="font-semibold">{t(dict, "learn.check")}</h2>
        <p className="mt-2">{copy.check.question}</p>
        <ul className="mt-3 space-y-2">
          {copy.check.options.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                  picked === i ? "border-[var(--teal)]" : "border-[var(--line)]"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        {picked !== null && (
          <p className="mt-3 text-sm">
            {picked === copy.check.answer ? t(dict, "quiz.correct") : t(dict, "quiz.wrong")}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void complete()}
          disabled={done}
          className="rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {done ? t(dict, "learn.completed") : t(dict, "learn.complete")}
        </button>
        {nextHref && (
          <Link href={nextHref} className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold">
            {t(dict, "learn.next")}
          </Link>
        )}
      </div>
    </article>
  );
}
