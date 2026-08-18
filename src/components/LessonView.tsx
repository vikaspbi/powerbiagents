"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lesson } from "@/content/lessons";
import { getLessonCopy } from "@/content/lessons";
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
  const copy = getLessonCopy(lesson, locale);
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
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--teal-deep)]">
        {t(dict, "learn.minutes", { n: copy.minutes })}
      </p>
      <h1 className="brand-mark text-4xl text-[var(--ink)] md:text-5xl">{copy.title}</h1>
      {copy.body.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-[var(--muted)]">
          {paragraph}
        </p>
      ))}
      {(copy.images?.length ?? 0) > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {copy.images?.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="w-full rounded-2xl border border-[var(--line)]" />
          ))}
        </div>
      )}
      {copy.videos?.map((src) => (
        <video key={src} src={src} controls className="w-full rounded-2xl border border-[var(--line)]" />
      ))}
      {copy.example && (
        <div className="rounded-[24px] border border-[var(--line)] bg-[var(--sand)] p-5 dark:bg-[var(--teal-soft)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-deep)]">
            {t(dict, "learn.example")}
          </p>
          <p className="mt-2 leading-relaxed text-[var(--ink)]">{copy.example}</p>
        </div>
      )}
      <div className="rounded-[24px] bg-[var(--teal)]/40 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em]">{t(dict, "learn.takeaway")}</p>
        <p className="mt-2 font-medium text-[var(--ink)]">{copy.takeaway}</p>
      </div>
      <div className="gold-card p-5">
        <h2 className="font-semibold">{t(dict, "learn.check")}</h2>
        <p className="mt-2">{copy.check.question}</p>
        <ul className="mt-3 space-y-2">
          {copy.check.options.map((option, i) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                  picked === i ? "border-[var(--teal-deep)] bg-[var(--sand)]" : "border-[var(--line)]"
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        {picked !== null && (
          <p className="mt-3 text-sm font-medium">
            {picked === copy.check.answer ? t(dict, "quiz.correct") : t(dict, "quiz.wrong")}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void complete()}
          disabled={done}
          className="btn-gold rounded-full px-5 py-3 text-sm disabled:opacity-60"
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
