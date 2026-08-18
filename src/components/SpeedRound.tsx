"use client";

import { useEffect, useState } from "react";
import { dictionaries, t } from "@/i18n/dictionaries";
import { getQuizCopy, type QuizQuestion } from "@/content/quizzes";
import type { Locale } from "@/lib/i18n";

export function SpeedRound({ locale, questions }: { locale: Locale; questions: QuizQuestion[] }) {
  const dict = dictionaries[locale];
  const [seconds, setSeconds] = useState(45);
  const [lives, setLives] = useState(3);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setOver(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [over]);

  const question = questions[index % questions.length];
  const copy = getQuizCopy(question, locale);

  function pick(i: number) {
    if (over) return;
    if (i === question.answer) {
      setScore((s) => s + 1);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) setOver(true);
    }
    setIndex((n) => n + 1);
  }

  if (over) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="text-xl font-semibold">{t(dict, "play.over")}</p>
        <p className="mt-2 text-[var(--teal)]">{score}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
      <div className="flex justify-between text-sm text-[var(--muted)]">
        <span>{t(dict, "play.time", { n: seconds })}</span>
        <span>{t(dict, "play.lives", { n: lives })}</span>
        <span>{score}</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold">{copy.prompt}</h2>
      <div className="mt-4 grid gap-2">
        {copy.options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => pick(i)}
            className="rounded-2xl border border-[var(--line)] px-4 py-3 text-left text-sm hover:border-[var(--teal)]"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
