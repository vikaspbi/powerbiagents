"use client";

import { useMemo, useState } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getQuizCopy, type QuizQuestion } from "@/content/quizzes";
import type { Locale } from "@/lib/i18n";

export function QuizPlayer({
  locale,
  quizId,
  questions,
}: {
  locale: Locale;
  quizId: string;
  questions: QuizQuestion[];
}) {
  const dict = dictionaries[locale];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; xp: number } | null>(null);
  const [error, setError] = useState("");
  const question = questions[index];
  const copy = question ? getQuizCopy(question, locale) : undefined;
  const done = index >= questions.length;

  const progress = useMemo(
    () => `${Math.min(index + 1, questions.length)}/${questions.length}`,
    [index, questions.length],
  );

  async function finish(nextAnswers: Record<string, number>) {
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, answers: nextAnswers }),
    });
    const data = (await res.json()) as { score?: number; total?: number; xp?: number; error?: string };
    if (!res.ok) {
      setError(data.error || t(dict, "quiz.limit"));
      return;
    }
    setResult({ score: data.score || 0, total: data.total || questions.length, xp: data.xp || 0 });
  }

  if (result) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="text-2xl font-semibold">{t(dict, "quiz.score", { score: result.score, total: result.total })}</p>
        <p className="mt-2 text-[var(--teal)]">{t(dict, "quiz.xp", { xp: result.xp })}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No questions in this bank yet.</p>;
  }

  if (!question || !copy || done) return null;

  return (
    <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">{progress}</p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">{copy.prompt}</h2>
      <ul className="mt-4 space-y-2">
        {copy.options.map((option, i) => {
          const selected = picked === i;
          const revealed = picked !== null;
          const correct = i === question.answer;
          return (
            <li key={option}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(i)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                  revealed && correct
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : revealed && selected
                      ? "border-red-400 bg-red-50 dark:bg-red-950"
                      : selected
                        ? "border-[var(--teal)]"
                        : "border-[var(--line)]"
                }`}
              >
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          {picked === question.answer ? t(dict, "quiz.correct") : t(dict, "quiz.wrong")} — {copy.explanation}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button
        type="button"
        disabled={picked === null}
        onClick={() => {
          const next = { ...answers, [question.id]: picked as number };
          setAnswers(next);
          setPicked(null);
          if (index + 1 >= questions.length) {
            void finish(next);
            setIndex(index + 1);
          } else {
            setIndex(index + 1);
          }
        }}
        className="mt-5 gold-fill rounded-full px-5 py-2 text-sm disabled:opacity-50"
      >
        {index + 1 >= questions.length ? t(dict, "quiz.submit") : t(dict, "quiz.next")}
      </button>
    </div>
  );
}
