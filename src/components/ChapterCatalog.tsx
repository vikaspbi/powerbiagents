"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getLessonCopy, getPathCopy, type LearningPath } from "@/content/lessons";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";

export function ChapterCatalog({
  locale,
  isPro,
  done,
  paths: incoming,
}: {
  locale: Locale;
  isPro: boolean;
  done: string[];
  paths: LearningPath[];
}) {
  const dict = dictionaries[locale];
  const doneSet = useMemo(() => new Set(done), [done]);
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("All");
  const tracks = useMemo(() => [...new Set(incoming.map((path) => path.track))], [incoming]);

  const paths = incoming.filter((path) => {
    const copy = getPathCopy(path, locale);
    const hay = `${path.number} ${copy.title} ${copy.subtitle} ${path.track}`.toLowerCase();
    const matchesTrack = track === "All" || path.track === track;
    const matchesQuery = hay.includes(query.toLowerCase());
    return matchesTrack && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 47 chapters…"
          className="w-full flex-1 rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm"
        />
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm"
        >
          <option>All</option>
          {tracks.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {paths.map((path) => {
          const copy = getPathCopy(path, locale);
          const completed = path.lessons.filter((lesson) => doneSet.has(lesson.id)).length;
          return (
            <section key={path.id} className="gold-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--teal-deep)]">
                    Chapter {String(path.number).padStart(2, "0")} · {path.track}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--ink)]">{copy.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{copy.subtitle}</p>
                </div>
                <span className="rounded-full bg-[var(--teal)] px-2 py-1 text-[11px] font-bold text-[var(--ink)]">
                  {completed}/{path.lessons.length}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {path.lessons.map((lesson) => {
                  const lessonCopy = getLessonCopy(lesson, locale);
                  const locked = !lesson.free && !isPro;
                  const href = `/${locale}/learn/${path.id}/${lesson.id}`;
                  return (
                    <li key={lesson.id}>
                      {locked ? (
                        <div className="flex items-center justify-between rounded-2xl border border-dashed border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
                          <span>{lessonCopy.title}</span>
                          <Link href={`/${locale}/subscribe`} className="font-semibold text-[var(--teal-deep)]">
                            Pro
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={href}
                          className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--background)]/60 px-3 py-2 text-sm hover:border-[var(--teal)]"
                        >
                          <span>{lessonCopy.title}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {doneSet.has(lesson.id) ? "✓" : t(dict, "learn.minutes", { n: lessonCopy.minutes })}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
