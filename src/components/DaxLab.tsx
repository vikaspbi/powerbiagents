"use client";

import { useMemo, useState } from "react";
import { getExerciseCopy, type DaxExercise } from "@/content/exercises";
import { dictionaries, t } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SALES_MODEL } from "@/lib/sample-model";

export function DaxLab({
  locale,
  isPro,
  passedIds,
  exercises,
}: {
  locale: Locale;
  isPro: boolean;
  passedIds: string[];
  exercises: DaxExercise[];
}) {
  const dict = dictionaries[locale];
  const first = exercises[0];
  const [exerciseId, setExerciseId] = useState<string | "sandbox">(first?.id ?? "sandbox");
  const [code, setCode] = useState(first ? first.starter : "SUM(Sales[Amount])");
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);

  const exercise: DaxExercise | undefined = exercises.find((e) => e.id === exerciseId);
  const copy = exercise ? getExerciseCopy(exercise, locale) : null;

  const locked = Boolean(exercise && !exercise.free && !isPro);

  const tables = useMemo(() => SALES_MODEL.tables, []);

  async function run() {
    setMessage("");
    const res = await fetch("/api/dax/eval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: code,
        exerciseId: exerciseId === "sandbox" ? undefined : exerciseId,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      value?: number;
      error?: string;
      passed?: boolean;
      expected?: number;
      explanation?: string;
    };
    if (!res.ok) {
      setOk(false);
      setMessage(data.error || t(dict, "dax.locked"));
      return;
    }
    if (exerciseId !== "sandbox") {
      if (data.passed) {
        setOk(true);
        setMessage(t(dict, "dax.passed"));
      } else if (data.ok) {
        setOk(false);
        setMessage(t(dict, "dax.failed", { expected: String(data.expected), actual: String(data.value) }));
      } else {
        setOk(false);
        setMessage(data.error || t(dict, "dax.error"));
      }
    } else if (data.ok) {
      setOk(true);
      setMessage(`${data.value} — ${data.explanation || ""}`);
    } else {
      setOk(false);
      setMessage(data.error || t(dict, "dax.error"));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-3">
        <h2 className="font-semibold">{t(dict, "dax.exercises")}</h2>
        {exercises.map((item) => {
          const itemLocked = !item.free && !isPro;
          const itemCopy = getExerciseCopy(item, locale);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setExerciseId(item.id);
                setCode(item.starter);
                setHint(false);
                setMessage("");
                setOk(null);
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                exerciseId === item.id ? "border-[var(--teal)] bg-[var(--teal-soft)]" : "border-[var(--line)]"
              }`}
            >
              <span className="font-medium">{itemCopy.title}</span>
              {itemLocked && <span className="ml-2 text-xs text-[var(--muted)]">{t(dict, "dax.locked")}</span>}
              {passedIds.includes(item.id) && <span className="ml-2 text-xs text-emerald-700">✓</span>}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setExerciseId("sandbox");
            setCode("SUM(Sales[Amount])");
            setMessage("");
            setOk(null);
          }}
          className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
            exerciseId === "sandbox" ? "border-[var(--teal)]" : "border-[var(--line)]"
          }`}
        >
          {t(dict, "dax.sandbox")}
        </button>
        <div className="rounded-2xl border border-[var(--line)] p-3 text-xs">
          <p className="font-semibold">{t(dict, "dax.model")}</p>
          {tables.map((table) => (
            <div key={table.name} className="mt-2 overflow-x-auto">
              <p className="font-medium">{table.name}</p>
              <table className="mt-1 w-full text-left">
                <thead>
                  <tr>
                    {table.columns.map((c) => (
                      <th key={c.name} className="pr-2">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i}>
                      {table.columns.map((c) => (
                        <td key={c.name} className="pr-2 text-[var(--muted)]">
                          {String(row[c.name])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </aside>
      <section className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-4">
        {exercise && copy && <p className="text-sm text-[var(--muted)]">{copy.prompt}</p>}
        {locked ? (
          <p className="mt-4 rounded-2xl bg-[var(--sand)] px-4 py-3 text-sm dark:bg-[var(--teal-soft)]">{t(dict, "paywall.body")}</p>
        ) : (
          <>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="mt-4 h-48 w-full rounded-2xl border border-[var(--line)] bg-transparent p-4 font-mono text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void run()} className="gold-fill rounded-full px-5 py-2 text-sm">
                {t(dict, "dax.run")}
              </button>
              {exercise && (
                <button type="button" onClick={() => setHint(true)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
                  {t(dict, "dax.hint")}
                </button>
              )}
            </div>
            {hint && exercise && copy && <p className="mt-3 font-mono text-sm text-[var(--teal)]">{copy.hint}</p>}
            {message && (
              <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${ok ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100"}`}>
                {message}
              </p>
            )}
          </>
        )}
        <p className="mt-6 text-xs text-[var(--muted)]">{t(dict, "dax.engineNote")}</p>
      </section>
    </div>
  );
}
