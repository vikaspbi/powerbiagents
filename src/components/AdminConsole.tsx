"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizBank } from "@/content/quizzes";

type Tab = "content" | "daily" | "practice" | "play" | "dax" | "users";

interface CatalogLesson {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  example: string;
  takeaway: string;
  images: string[];
  videos: string[];
  check: { question: string; options: string[]; answer: number };
  free: boolean;
  source: "builtin" | "custom";
  hidden: boolean;
}

interface CatalogPath {
  id: string;
  number: number;
  track: string;
  title: string;
  subtitle: string;
  free: boolean;
  source: "builtin" | "custom";
  hidden: boolean;
  lessons: CatalogLesson[];
}

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  isPro: boolean;
  lockedOwner: boolean;
}

interface AdminQuiz {
  id: string;
  topic: string;
  answer: number;
  banks: QuizBank[];
  source: "builtin" | "custom";
  hidden: boolean;
  copy: { en: { prompt: string; options: string[]; explanation: string } };
}

interface AdminDax {
  id: string;
  free: boolean;
  expected: number;
  starter: string;
  source: "builtin" | "custom";
  hidden: boolean;
  copy: { en: { title: string; prompt: string; hint: string } };
}

const NAV: { id: Tab; label: string; hint: string }[] = [
  { id: "content", label: "Curriculum", hint: "Chapters & lessons" },
  { id: "daily", label: "Daily trivia", hint: "Five-a-day set" },
  { id: "practice", label: "Practice bank", hint: "Full quiz bank" },
  { id: "play", label: "Play area", hint: "Speed & boss" },
  { id: "dax", label: "DAX lab", hint: "Live exercises" },
  { id: "users", label: "Admins", hint: "Grant access" },
];

function fieldClass() {
  return "admin-field";
}

export function AdminConsole() {
  const [tab, setTab] = useState<Tab>("users");
  const [paths, setPaths] = useState<CatalogPath[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [questions, setQuestions] = useState<AdminQuiz[]>([]);
  const [exercises, setExercises] = useState<AdminDax[]>([]);
  const [pathId, setPathId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [message, setMessage] = useState("");
  const [pathTitle, setPathTitle] = useState("");
  const [pathSubtitle, setPathSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(8);
  const [bodyText, setBodyText] = useState("");
  const [example, setExample] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [checkQuestion, setCheckQuestion] = useState("");
  const [checkOptions, setCheckOptions] = useState("");
  const [checkAnswer, setCheckAnswer] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [pathFree, setPathFree] = useState(true);
  const [lessonFree, setLessonFree] = useState(true);
  const [newPathTitle, setNewPathTitle] = useState("");
  const [newPathSubtitle, setNewPathSubtitle] = useState("");
  const [newPathTrack, setNewPathTrack] = useState("Custom");
  const [newPathNumber, setNewPathNumber] = useState(48);
  const [newPathFree, setNewPathFree] = useState(false);

  const load = useCallback(async () => {
    const [catalogRes, usersRes, questionRes, daxRes] = await Promise.all([
      fetch("/api/admin/catalog"),
      fetch("/api/admin/users"),
      fetch("/api/admin/questions"),
      fetch("/api/admin/exercises"),
    ]);
    if (!catalogRes.ok) return;
    const catalog = (await catalogRes.json()) as { paths: CatalogPath[] };
    setPaths(catalog.paths);
    if (usersRes.ok) {
      const data = (await usersRes.json()) as { users: AdminUser[] };
      setUsers(data.users);
    }
    if (questionRes.ok) {
      const data = (await questionRes.json()) as { questions: AdminQuiz[] };
      setQuestions(data.questions);
    }
    if (daxRes.ok) {
      const data = (await daxRes.json()) as { exercises: AdminDax[] };
      setExercises(data.exercises);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const path = paths.find((item) => item.id === pathId);
  const lesson = path?.lessons.find((item) => item.id === lessonId);

  useEffect(() => {
    if (!path) return;
    setPathTitle(path.title);
    setPathSubtitle(path.subtitle);
    setPathFree(path.free);
  }, [path]);

  useEffect(() => {
    if (!lesson) return;
    setTitle(lesson.title);
    setMinutes(lesson.minutes);
    setBodyText(lesson.body.join("\n\n"));
    setExample(lesson.example);
    setTakeaway(lesson.takeaway);
    setCheckQuestion(lesson.check.question);
    setCheckOptions(lesson.check.options.join("\n"));
    setCheckAnswer(lesson.check.answer);
    setImages(lesson.images);
    setVideos(lesson.videos);
    setLessonFree(lesson.free);
  }, [lesson]);

  async function savePath() {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "path", id: pathId, title: pathTitle, subtitle: pathSubtitle, free: pathFree }),
    });
    setMessage(res.ok ? "Chapter heading saved." : "Could not save chapter.");
    if (res.ok) void load();
  }

  async function saveLesson() {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lesson",
        id: lessonId,
        title,
        minutes,
        bodyText,
        example,
        takeaway,
        images,
        videos,
        checkQuestion,
        checkOptions,
        checkAnswer,
        free: lessonFree,
      }),
    });
    setMessage(res.ok ? "Lesson saved. Learners will see it immediately." : "Could not save lesson.");
    if (res.ok) void load();
  }

  async function upload(kind: "image" | "video", file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: data });
    const payload = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !payload.url) {
      setMessage(payload.error || "Upload failed.");
      return;
    }
    if (kind === "image") setImages((list) => [...list, payload.url as string]);
    else setVideos((list) => [...list, payload.url as string]);
    setMessage("Uploaded. Save the lesson to attach it.");
  }

  async function toggleAdmin(user: AdminUser) {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, isAdmin: !user.isAdmin }),
    });
    setMessage(res.ok ? "User updated. Admins are Pro automatically." : "Could not update user.");
    if (res.ok) void load();
  }

  const stats = useMemo(
    () => ({
      users: users.length,
      admins: users.filter((user) => user.isAdmin).length,
      daily: questions.filter((item) => !item.hidden && item.banks.includes("daily")).length,
      practice: questions.filter((item) => !item.hidden && item.banks.includes("practice")).length,
      play: questions.filter((item) => !item.hidden && item.banks.includes("play")).length,
      dax: exercises.filter((item) => !item.hidden).length,
    }),
    [users, questions, exercises],
  );

  return (
    <div className="admin-shell pb-16">
      <aside className="admin-rail lg:sticky lg:top-24">
        <p className="admin-chip">Studio</p>
        <p className="brand-mark mt-3 text-2xl leading-none">Control room</p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">Curriculum, trivia, lab drills, and who gets the keys.</p>
        <nav className="mt-5 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={tab === item.id}
              className="admin-nav-btn"
              onClick={() => setTab(item.id)}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-black/10 text-xs font-black">
                {item.label.slice(0, 1)}
              </span>
              <span>
                <span className="block">{item.label}</span>
                <span className="block text-[11px] font-medium opacity-70">{item.hint}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-5">
        <section className="admin-hero">
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="admin-chip">Owner only</p>
              <h1 className="brand-mark mt-3 text-4xl sm:text-5xl">Admin panel</h1>
              <p className="mt-2 max-w-xl text-sm text-[#f6e7b8]/80">
                Add admins, shape the daily trivia, restock practice and play, and keep the DAX lab moving. Learners see
                changes as soon as you save.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
              {[
                ["Admins", stats.admins],
                ["Daily", stats.daily],
                ["Play", stats.play],
                ["DAX", stats.dax],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="brand-mark text-2xl">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0c419]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          {message && <p className="relative z-10 mt-4 text-sm font-medium text-[#ffd54a]">{message}</p>}
        </section>

        {tab === "users" && (
          <UsersPanel
            users={users}
            onToggle={(user) => void toggleAdmin(user)}
            onAdded={(text) => {
              setMessage(text);
              void load();
            }}
            onError={setMessage}
          />
        )}

        {tab === "content" && (
          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="gold-card space-y-3 p-5">
              <h2 className="brand-mark text-2xl">Curriculum</h2>
              <p className="text-sm text-[var(--muted)]">Add or delete chapters and lessons. Free items unlock for everyone; Pro items stay locked until subscribe.</p>
              <div className="rounded-2xl border border-[var(--line)] p-3 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--teal-deep)]">New chapter</p>
                <input value={newPathTitle} onChange={(e) => setNewPathTitle(e.target.value)} className={fieldClass()} placeholder="Chapter title" />
                <textarea value={newPathSubtitle} onChange={(e) => setNewPathSubtitle(e.target.value)} className={`h-16 ${fieldClass()}`} placeholder="Subtitle" />
                <div className="flex flex-wrap gap-2">
                  <input value={newPathTrack} onChange={(e) => setNewPathTrack(e.target.value)} className={`flex-1 ${fieldClass()}`} placeholder="Track" />
                  <input type="number" value={newPathNumber} onChange={(e) => setNewPathNumber(Number(e.target.value))} className="w-24 rounded-xl border border-[var(--line)] bg-transparent px-2 py-1" />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={newPathFree} onChange={(e) => setNewPathFree(e.target.checked)} />
                  Free for all learners
                </label>
                <button
                  type="button"
                  className="btn-gold rounded-full px-4 py-2 text-sm"
                  onClick={async () => {
                    const res = await fetch("/api/admin/content", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        action: "createPath",
                        title: newPathTitle,
                        subtitle: newPathSubtitle,
                        track: newPathTrack,
                        number: newPathNumber,
                        free: newPathFree,
                      }),
                    });
                    const payload = (await res.json()) as { error?: string; id?: string };
                    setMessage(res.ok ? "Chapter added for every learner." : payload.error || "Could not add chapter.");
                    if (res.ok) {
                      setNewPathTitle("");
                      setNewPathSubtitle("");
                      void load();
                    }
                  }}
                >
                  Add chapter
                </button>
              </div>
              <label className="block text-sm font-medium">
                Chapter
                <select
                  className={`mt-1 ${fieldClass()}`}
                  value={pathId}
                  onChange={(e) => {
                    setPathId(e.target.value);
                    setLessonId("");
                  }}
                >
                  <option value="">Select a chapter</option>
                  {paths.map((item) => (
                    <option key={item.id} value={item.id}>
                      {String(item.number).padStart(2, "0")} · {item.title}
                      {item.hidden ? " (removed)" : item.free ? " · Free" : " · Pro"}
                    </option>
                  ))}
                </select>
              </label>
              {path && (
                <>
                  <input value={pathTitle} onChange={(e) => setPathTitle(e.target.value)} className={fieldClass()} />
                  <textarea value={pathSubtitle} onChange={(e) => setPathSubtitle(e.target.value)} className={`h-20 ${fieldClass()}`} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={pathFree} onChange={(e) => setPathFree(e.target.checked)} />
                    Free chapter (unchecked = Pro lock, including all current lessons)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void savePath()} className="btn-gold rounded-full px-4 py-2 text-sm">
                      Save chapter
                    </button>
                    {path.hidden ? (
                      <button
                        type="button"
                        className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
                        onClick={async () => {
                          await fetch("/api/admin/content", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "path", id: path.id, restore: true }),
                          });
                          setMessage("Chapter restored.");
                          void load();
                        }}
                      >
                        Restore chapter
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-700 dark:text-red-300"
                        onClick={async () => {
                          await fetch("/api/admin/content", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ type: "path", id: path.id }),
                          });
                          setPathId("");
                          setLessonId("");
                          setMessage("Chapter removed for learners.");
                          void load();
                        }}
                      >
                        Delete chapter
                      </button>
                    )}
                  </div>
                  <label className="block text-sm font-medium">
                    Lesson
                    <select className={`mt-1 ${fieldClass()}`} value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                      <option value="">Select a lesson</option>
                      {path.lessons.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                          {item.hidden ? " (removed)" : item.free ? " · Free" : " · Pro"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
                    onClick={async () => {
                      const res = await fetch("/api/admin/content", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "createLesson",
                          pathId: path.id,
                          title: "New lesson",
                          bodyText: "Write the lesson here.",
                          takeaway: "Key takeaway",
                          free: pathFree,
                        }),
                      });
                      const payload = (await res.json()) as { error?: string; id?: string };
                      setMessage(res.ok ? "Lesson added." : payload.error || "Could not add lesson.");
                      if (res.ok && payload.id) {
                        await load();
                        setLessonId(payload.id);
                      }
                    }}
                  >
                    Add lesson to this chapter
                  </button>
                </>
              )}
            </div>
            {lesson && (
              <div className="gold-card space-y-3 p-5">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass()} />
                <label className="text-sm">
                  Minutes
                  <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="ml-2 w-20 rounded-xl border border-[var(--line)] bg-transparent px-2 py-1" />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={lessonFree} onChange={(e) => setLessonFree(e.target.checked)} />
                  Free lesson (unchecked = Pro)
                </label>
                <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} className={`h-40 ${fieldClass()}`} placeholder="Paragraphs separated by a blank line" />
                <textarea value={example} onChange={(e) => setExample(e.target.value)} className={`h-24 ${fieldClass()}`} placeholder="Example" />
                <textarea value={takeaway} onChange={(e) => setTakeaway(e.target.value)} className={`h-20 ${fieldClass()}`} placeholder="Takeaway" />
                <input value={checkQuestion} onChange={(e) => setCheckQuestion(e.target.value)} className={fieldClass()} placeholder="Check question" />
                <textarea value={checkOptions} onChange={(e) => setCheckOptions(e.target.value)} className={`h-24 ${fieldClass()}`} placeholder="One option per line" />
                <label className="text-sm">
                  Correct option index (0-based)
                  <input type="number" min={0} value={checkAnswer} onChange={(e) => setCheckAnswer(Number(e.target.value))} className="ml-2 w-16 rounded-xl border border-[var(--line)] bg-transparent px-2 py-1" />
                </label>
                <div className="flex flex-wrap gap-2 text-sm">
                  <label className="rounded-full border border-[var(--line)] px-3 py-2">
                    Upload image
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && void upload("image", e.target.files[0])} />
                  </label>
                  <label className="rounded-full border border-[var(--line)] px-3 py-2">
                    Upload video
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => e.target.files?.[0] && void upload("video", e.target.files[0])} />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {images.map((src) => (
                    <button key={src} type="button" onClick={() => setImages((list) => list.filter((item) => item !== src))} title="Remove">
                      {/* user-uploaded local files */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-16 w-16 rounded-xl object-cover" />
                    </button>
                  ))}
                  {videos.map((src) => (
                    <button key={src} type="button" className="text-xs underline" onClick={() => setVideos((list) => list.filter((item) => item !== src))}>
                      Remove video {src.slice(-8)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void saveLesson()} className="btn-gold rounded-full px-5 py-2 text-sm">
                    Save lesson
                  </button>
                  {lesson.hidden ? (
                    <button
                      type="button"
                      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
                      onClick={async () => {
                        await fetch("/api/admin/content", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ type: "lesson", id: lesson.id, restore: true }),
                        });
                        setMessage("Lesson restored.");
                        void load();
                      }}
                    >
                      Restore lesson
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full border border-red-400/40 px-4 py-2 text-sm text-red-700 dark:text-red-300"
                      onClick={async () => {
                        await fetch("/api/admin/content", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ type: "lesson", id: lesson.id }),
                        });
                        setLessonId("");
                        setMessage("Lesson removed for learners.");
                        void load();
                      }}
                    >
                      Delete lesson
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {(tab === "daily" || tab === "practice" || tab === "play") && (
          <QuestionPanel
            bank={tab}
            questions={questions}
            onChange={async (text) => {
              setMessage(text);
              await load();
            }}
          />
        )}

        {tab === "dax" && (
          <DaxPanel
            exercises={exercises}
            onChange={async (text) => {
              setMessage(text);
              await load();
            }}
          />
        )}
      </div>
    </div>
  );
}

function UsersPanel({
  users,
  onToggle,
  onAdded,
  onError,
}: {
  users: AdminUser[];
  onToggle: (user: AdminUser) => void;
  onAdded: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function addAdmin() {
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, displayName, password }),
    });
    const payload = (await res.json()) as { error?: string; created?: boolean };
    setBusy(false);
    if (!res.ok) {
      onError(payload.error || "Could not add admin.");
      return;
    }
    setEmail("");
    setDisplayName("");
    setPassword("");
    onAdded(payload.created ? "New admin account created. They can sign in with that password." : "Existing account promoted to admin (Pro included).");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="gold-card p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--teal-deep)]">Invite</p>
        <h2 className="brand-mark mt-1 text-3xl">Add another admin</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          If the email already has an account, they are promoted. If not, a new login is created with admin + Pro.
        </p>
        <div className="mt-4 space-y-3">
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={fieldClass()} placeholder="Display name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass()} placeholder="Email" type="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass()} placeholder="Password (required for new accounts, 8+ chars)" type="password" />
          <button type="button" disabled={busy} onClick={() => void addAdmin()} className="btn-gold rounded-full px-5 py-2.5 text-sm disabled:opacity-60">
            {busy ? "Saving…" : "Add admin"}
          </button>
        </div>
      </section>
      <section className="space-y-3">
        {users.map((user) => (
          <article key={user.id} className="gold-card flex items-center gap-4 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--teal)] font-black text-[#1a1400]">
              {(user.displayName || user.email).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{user.displayName}</p>
              <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--teal-deep)]">
                {user.lockedOwner ? "Owner" : user.isAdmin ? "Admin · Pro" : user.isPro ? "Pro" : "Learner"}
              </p>
            </div>
            {user.lockedOwner ? (
              <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-bold">Locked</span>
            ) : (
              <button type="button" onClick={() => onToggle(user)} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-semibold">
                {user.isAdmin ? "Remove admin" : "Make admin"}
              </button>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

function QuestionPanel({
  bank,
  questions,
  onChange,
}: {
  bank: QuizBank;
  questions: AdminQuiz[];
  onChange: (message: string) => Promise<void>;
}) {
  const titles: Record<QuizBank, string> = {
    daily: "Daily trivia",
    practice: "Practice bank",
    play: "Play area",
  };
  const visible = questions.filter((item) => item.banks.includes(bank) && !item.hidden);
  const hidden = questions.filter((item) => item.hidden && item.source === "builtin");
  const [editing, setEditing] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [topic, setTopic] = useState("general");
  const [banks, setBanks] = useState<QuizBank[]>([bank]);

  useEffect(() => {
    if (!editing) setBanks([bank]);
  }, [bank, editing]);

  function resetForm() {
    setEditing(null);
    setPrompt("");
    setOptions("");
    setAnswer(0);
    setExplanation("");
    setTopic("general");
    setBanks([bank]);
  }

  function startEdit(item: AdminQuiz) {
    setEditing(item.id);
    setPrompt(item.copy.en.prompt);
    setOptions(item.copy.en.options.join("\n"));
    setAnswer(item.answer);
    setExplanation(item.copy.en.explanation);
    setTopic(item.topic);
    setBanks(item.banks);
  }

  async function save() {
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing && questions.find((item) => item.id === editing)?.source === "custom" ? editing : undefined,
        prompt,
        options,
        answer,
        explanation,
        topic,
        banks,
      }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      await onChange(payload.error || "Could not save question.");
      return;
    }
    resetForm();
    await onChange("Question saved. Learners see it in the selected banks.");
  }

  async function remove(id: string) {
    const res = await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await onChange(res.ok ? "Question removed from learner banks." : "Could not delete question.");
  }

  async function restore(id: string) {
    const res = await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, restore: true }),
    });
    await onChange(res.ok ? "Built-in question restored." : "Could not restore question.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="gold-card p-5">
        <h2 className="brand-mark text-3xl">{editing ? "Edit question" : `Add to ${titles[bank]}`}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">One correct answer. Tick every bank that should show it.</p>
        <div className="mt-4 space-y-3">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`h-24 ${fieldClass()}`} placeholder="Question prompt" />
          <textarea value={options} onChange={(e) => setOptions(e.target.value)} className={`h-28 ${fieldClass()}`} placeholder="One option per line" />
          <label className="text-sm">
            Correct option index (0-based)
            <input type="number" min={0} value={answer} onChange={(e) => setAnswer(Number(e.target.value))} className="ml-2 w-16 rounded-xl border border-[var(--line)] bg-transparent px-2 py-1" />
          </label>
          <input value={explanation} onChange={(e) => setExplanation(e.target.value)} className={fieldClass()} placeholder="Explanation shown after answering" />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className={fieldClass()} placeholder="Topic tag (model, dax, visuals…)" />
          <div className="flex flex-wrap gap-2">
            {(["daily", "practice", "play"] as QuizBank[]).map((item) => (
              <label key={item} className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold ${banks.includes(item) ? "bg-[var(--teal)] text-[#1a1400]" : "border border-[var(--line)]"}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={banks.includes(item)}
                  onChange={() =>
                    setBanks((current) => (current.includes(item) ? current.filter((bankId) => bankId !== item) : [...current, item]))
                  }
                />
                {item}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => void save()} className="btn-gold rounded-full px-5 py-2 text-sm">
              {editing ? "Save question" : "Add question"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="space-y-3">
        {visible.length === 0 && <p className="gold-card p-5 text-sm text-[var(--muted)]">No live questions in this bank yet.</p>}
        {visible.map((item) => (
          <article key={item.id} className="gold-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold leading-snug">{item.copy.en.prompt}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {item.source === "builtin" ? "Built-in" : "Custom"} · {item.copy.en.options.length} options · answer {item.answer}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {item.source === "custom" && (
                  <button type="button" className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                )}
                <button type="button" className="rounded-full border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300" onClick={() => void remove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {hidden.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Removed built-ins</p>
            {hidden.map((item) => (
              <article key={item.id} className="mb-2 rounded-2xl border border-dashed border-[var(--line)] p-3 text-sm">
                <p className="opacity-70">{item.copy.en.prompt}</p>
                <button type="button" className="mt-2 text-xs font-bold underline" onClick={() => void restore(item.id)}>
                  Restore
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DaxPanel({
  exercises,
  onChange,
}: {
  exercises: AdminDax[];
  onChange: (message: string) => Promise<void>;
}) {
  const visible = exercises.filter((item) => !item.hidden);
  const hidden = exercises.filter((item) => item.hidden);
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [hint, setHint] = useState("");
  const [starter, setStarter] = useState("");
  const [expected, setExpected] = useState("0");
  const [free, setFree] = useState(true);

  function resetForm() {
    setEditing(null);
    setTitle("");
    setPrompt("");
    setHint("");
    setStarter("");
    setExpected("0");
    setFree(true);
  }

  function startEdit(item: AdminDax) {
    setEditing(item.id);
    setTitle(item.copy.en.title);
    setPrompt(item.copy.en.prompt);
    setHint(item.copy.en.hint);
    setStarter(item.starter);
    setExpected(String(item.expected));
    setFree(item.free);
  }

  async function save() {
    const res = await fetch("/api/admin/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing && exercises.find((item) => item.id === editing)?.source === "custom" ? editing : undefined,
        title,
        prompt,
        hint,
        starter,
        expected: Number(expected),
        free,
      }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      await onChange(payload.error || "Could not save exercise.");
      return;
    }
    resetForm();
    await onChange("DAX exercise saved.");
  }

  async function remove(id: string) {
    const res = await fetch("/api/admin/exercises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await onChange(res.ok ? "Exercise removed from the lab." : "Could not delete exercise.");
  }

  async function restore(id: string) {
    const res = await fetch("/api/admin/exercises", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, restore: true }),
    });
    await onChange(res.ok ? "Built-in exercise restored." : "Could not restore exercise.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="gold-card p-5">
        <h2 className="brand-mark text-3xl">{editing ? "Edit DAX exercise" : "Add DAX exercise"}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Expected value is checked against the in-app Sales lab model.</p>
        <div className="mt-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldClass()} placeholder="Title" />
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`h-24 ${fieldClass()}`} placeholder="Prompt for the learner" />
          <input value={hint} onChange={(e) => setHint(e.target.value)} className={fieldClass()} placeholder="Hint (DAX)" />
          <textarea value={starter} onChange={(e) => setStarter(e.target.value)} className={`h-20 font-mono ${fieldClass()}`} placeholder="Starter measure name" />
          <input value={expected} onChange={(e) => setExpected(e.target.value)} className={fieldClass()} placeholder="Expected number" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} />
            Free for all learners (unchecked = Pro)
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => void save()} className="btn-gold rounded-full px-5 py-2 text-sm">
              {editing ? "Save exercise" : "Add exercise"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="space-y-3">
        {visible.map((item) => (
          <article key={item.id} className="gold-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.copy.en.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.copy.en.prompt}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {item.source === "builtin" ? "Built-in" : "Custom"} · expected {item.expected} · {item.free ? "Free" : "Pro"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {item.source === "custom" && (
                  <button type="button" className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                )}
                <button type="button" className="rounded-full border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300" onClick={() => void remove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {hidden.map((item) => (
          <article key={item.id} className="rounded-2xl border border-dashed border-[var(--line)] p-3 text-sm">
            <p className="opacity-70">{item.copy.en.title}</p>
            <button type="button" className="mt-2 text-xs font-bold underline" onClick={() => void restore(item.id)}>
              Restore
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
