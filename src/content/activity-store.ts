import { DAX_EXERCISES, type DaxExercise, type DaxExerciseCopy } from "@/content/exercises";
import { QUIZ_BANK, QUIZ_BANKS, type QuizBank, type QuizQuestion } from "@/content/quizzes";
import { getDb } from "@/lib/db";

export interface AdminQuizItem extends QuizQuestion {
  banks: QuizBank[];
  source: "builtin" | "custom";
  hidden: boolean;
}

export interface AdminDaxItem extends DaxExercise {
  source: "builtin" | "custom";
  hidden: boolean;
}

interface QuizItemRow {
  id: string;
  topic: string;
  answer: number;
  banks: string;
  copy: string;
}

interface DaxItemRow {
  id: string;
  free: number;
  expected: number;
  starter: string;
  copy: string;
}

function hiddenSet(kind: "quiz" | "dax") {
  const rows = getDb().prepare("SELECT id FROM hidden_items WHERE kind = ?").all(kind) as { id: string }[];
  return new Set(rows.map((row) => row.id));
}

function parseBanks(raw: string): QuizBank[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...QUIZ_BANKS];
    return QUIZ_BANKS.filter((bank) => parsed.includes(bank));
  } catch {
    return [...QUIZ_BANKS];
  }
}

function parseQuizCopy(raw: string): QuizQuestion["copy"] | null {
  try {
    const copy = JSON.parse(raw) as QuizQuestion["copy"];
    if (!copy?.en?.prompt || !Array.isArray(copy.en.options)) return null;
    return copy;
  } catch {
    return null;
  }
}

function parseDaxCopy(raw: string): DaxExercise["copy"] | null {
  try {
    const copy = JSON.parse(raw) as DaxExercise["copy"];
    if (!copy?.en?.title || !copy.en.prompt) return null;
    return copy;
  } catch {
    return null;
  }
}

function customQuizzes(): QuizQuestion[] {
  const rows = getDb().prepare("SELECT * FROM quiz_items ORDER BY created_at ASC").all() as QuizItemRow[];
  const questions: QuizQuestion[] = [];
  for (const row of rows) {
    const copy = parseQuizCopy(row.copy);
    if (!copy) continue;
    questions.push({
      id: row.id,
      topic: row.topic || "general",
      answer: Number(row.answer) || 0,
      copy,
    });
  }
  return questions;
}

function customQuizMeta(): Map<string, QuizBank[]> {
  const rows = getDb().prepare("SELECT id, banks FROM quiz_items").all() as { id: string; banks: string }[];
  return new Map(rows.map((row) => [row.id, parseBanks(row.banks)]));
}

function customDax(): DaxExercise[] {
  const rows = getDb().prepare("SELECT * FROM dax_items ORDER BY created_at ASC").all() as DaxItemRow[];
  const items: DaxExercise[] = [];
  for (const row of rows) {
    const copy = parseDaxCopy(row.copy);
    if (!copy) continue;
    items.push({
      id: row.id,
      free: row.free === 1,
      expected: Number(row.expected),
      starter: row.starter || "",
      copy,
    });
  }
  return items;
}

export function listAdminQuizzes(): AdminQuizItem[] {
  const hidden = hiddenSet("quiz");
  const customs = getDb().prepare("SELECT * FROM quiz_items ORDER BY created_at ASC").all() as QuizItemRow[];
  const builtinIds = new Set(QUIZ_BANK.map((item) => item.id));
  const builtins: AdminQuizItem[] = QUIZ_BANK.map((item) => ({
    ...item,
    banks: [...QUIZ_BANKS],
    source: "builtin",
    hidden: hidden.has(item.id),
  }));
  const customItems: AdminQuizItem[] = [];
  for (const row of customs) {
    if (builtinIds.has(row.id)) continue;
    const copy = parseQuizCopy(row.copy);
    if (!copy) continue;
    customItems.push({
      id: row.id,
      topic: row.topic || "general",
      answer: Number(row.answer) || 0,
      copy,
      banks: parseBanks(row.banks),
      source: "custom",
      hidden: false,
    });
  }
  return [...builtins, ...customItems];
}

export function getPublishedQuizBank(bank?: QuizBank): QuizQuestion[] {
  const hidden = hiddenSet("quiz");
  const meta = customQuizMeta();
  const builtins = QUIZ_BANK.filter((item) => !hidden.has(item.id)).map((item) => ({
    item,
    banks: [...QUIZ_BANKS] as QuizBank[],
  }));
  const customs = customQuizzes()
    .filter((item) => !hidden.has(item.id))
    .map((item) => ({ item, banks: meta.get(item.id) ?? [...QUIZ_BANKS] }));
  return [...builtins, ...customs]
    .filter(({ banks }) => !bank || banks.includes(bank))
    .map(({ item }) => item);
}

export function saveQuizItem(input: {
  id?: string;
  topic?: string;
  answer?: number;
  banks?: QuizBank[];
  prompt?: string;
  options?: string[];
  explanation?: string;
}) {
  const options = (input.options || []).map((line) => line.trim()).filter(Boolean);
  if (options.length < 2) throw new Error("Add at least two answer options.");
  const prompt = input.prompt?.trim();
  if (!prompt) throw new Error("Question prompt is required.");
  const answer = Number(input.answer) || 0;
  if (answer < 0 || answer >= options.length) throw new Error("Correct answer index is out of range.");
  const banks = (input.banks || []).filter((bank): bank is QuizBank => QUIZ_BANKS.includes(bank as QuizBank));
  if (banks.length === 0) throw new Error("Pick at least one bank: daily, practice, or play.");
  const builtinIds = new Set(QUIZ_BANK.map((item) => item.id));
  const id = input.id?.trim() && !builtinIds.has(input.id.trim()) ? input.id.trim() : `q-${crypto.randomUUID()}`;
  const copy: QuizQuestion["copy"] = {
    en: {
      prompt,
      options,
      explanation: input.explanation?.trim() || "",
    },
  };
  getDb()
    .prepare(
      `INSERT INTO quiz_items (id, topic, answer, banks, copy, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET topic = excluded.topic, answer = excluded.answer, banks = excluded.banks, copy = excluded.copy`,
    )
    .run(
      id,
      input.topic?.trim() || "general",
      answer,
      JSON.stringify(banks),
      JSON.stringify(copy),
      new Date().toISOString(),
    );
  return id;
}

export function deleteQuizItem(id: string) {
  const builtin = QUIZ_BANK.some((item) => item.id === id);
  if (builtin) {
    getDb().prepare("INSERT OR IGNORE INTO hidden_items (kind, id) VALUES ('quiz', ?)").run(id);
    return { hidden: true };
  }
  getDb().prepare("DELETE FROM quiz_items WHERE id = ?").run(id);
  return { deleted: true };
}

export function restoreQuizItem(id: string) {
  getDb().prepare("DELETE FROM hidden_items WHERE kind = 'quiz' AND id = ?").run(id);
}

export function listAdminDax(): AdminDaxItem[] {
  const hidden = hiddenSet("dax");
  const builtinIds = new Set(DAX_EXERCISES.map((item) => item.id));
  const builtins: AdminDaxItem[] = DAX_EXERCISES.map((item) => ({
    ...item,
    source: "builtin",
    hidden: hidden.has(item.id),
  }));
  const customItems: AdminDaxItem[] = customDax()
    .filter((item) => !builtinIds.has(item.id))
    .map((item) => ({ ...item, source: "custom" as const, hidden: false }));
  return [...builtins, ...customItems];
}

export function getPublishedExercises(): DaxExercise[] {
  const hidden = hiddenSet("dax");
  const builtinIds = new Set(DAX_EXERCISES.map((item) => item.id));
  return [...DAX_EXERCISES.filter((item) => !hidden.has(item.id)), ...customDax().filter((item) => !builtinIds.has(item.id))];
}

export function getPublishedExercise(id: string) {
  return getPublishedExercises().find((item) => item.id === id);
}

export function saveDaxItem(input: {
  id?: string;
  free?: boolean;
  expected?: number;
  starter?: string;
  title?: string;
  prompt?: string;
  hint?: string;
}) {
  const title = input.title?.trim();
  const prompt = input.prompt?.trim();
  if (!title || !prompt) throw new Error("Title and prompt are required.");
  const expected = Number(input.expected);
  if (!Number.isFinite(expected)) throw new Error("Expected numeric result is required.");
  const builtinIds = new Set(DAX_EXERCISES.map((item) => item.id));
  const id = input.id?.trim() && !builtinIds.has(input.id.trim()) ? input.id.trim() : `dax-${crypto.randomUUID()}`;
  const copy: DaxExercise["copy"] = {
    en: {
      title,
      prompt,
      hint: input.hint?.trim() || "",
    } satisfies DaxExerciseCopy,
  };
  getDb()
    .prepare(
      `INSERT INTO dax_items (id, free, expected, starter, copy, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET free = excluded.free, expected = excluded.expected, starter = excluded.starter, copy = excluded.copy`,
    )
    .run(id, input.free === false ? 0 : 1, expected, input.starter ?? "", JSON.stringify(copy), new Date().toISOString());
  return id;
}

export function deleteDaxItem(id: string) {
  const builtin = DAX_EXERCISES.some((item) => item.id === id);
  if (builtin) {
    getDb().prepare("INSERT OR IGNORE INTO hidden_items (kind, id) VALUES ('dax', ?)").run(id);
    return { hidden: true };
  }
  getDb().prepare("DELETE FROM dax_items WHERE id = ?").run(id);
  return { deleted: true };
}

export function restoreDaxItem(id: string) {
  getDb().prepare("DELETE FROM hidden_items WHERE kind = 'dax' AND id = ?").run(id);
}
