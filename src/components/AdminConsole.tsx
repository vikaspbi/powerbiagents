"use client";

import { useCallback, useEffect, useState } from "react";

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
}

interface CatalogPath {
  id: string;
  number: number;
  track: string;
  title: string;
  subtitle: string;
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

export function AdminConsole() {
  const [tab, setTab] = useState<"content" | "users">("content");
  const [paths, setPaths] = useState<CatalogPath[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
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

  const load = useCallback(async () => {
    const [catalogRes, usersRes] = await Promise.all([fetch("/api/admin/catalog"), fetch("/api/admin/users")]);
    if (!catalogRes.ok) return;
    const catalog = (await catalogRes.json()) as { paths: CatalogPath[] };
    setPaths(catalog.paths);
    if (usersRes.ok) {
      const data = (await usersRes.json()) as { users: AdminUser[] };
      setUsers(data.users);
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
  }, [lesson]);

  async function savePath() {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "path", id: pathId, title: pathTitle, subtitle: pathSubtitle }),
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

  return (
    <div className="space-y-6 pb-16">
      <section className="gold-card p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--teal-deep)]">Owner only</p>
        <h1 className="brand-mark mt-2 text-4xl">Admin panel</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Edit chapter names and lesson content, upload images or videos, and grant admin (Pro) to other accounts. This
          screen is only shown to hello.vikaspaswan@gmail.com.
        </p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setTab("content")} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === "content" ? "bg-[var(--teal)] text-[var(--ink)]" : "border border-[var(--line)]"}`}>
            Curriculum
          </button>
          <button type="button" onClick={() => setTab("users")} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === "users" ? "bg-[var(--teal)] text-[var(--ink)]" : "border border-[var(--line)]"}`}>
            Users
          </button>
        </div>
        {message && <p className="mt-3 text-sm font-medium text-[var(--teal-deep)]">{message}</p>}
      </section>

      {tab === "users" && (
        <section className="gold-card overflow-x-auto p-4">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Pro</th>
                <th className="p-2">Admin</th>
                <th className="p-2"> </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-[var(--line)]">
                  <td className="p-2">{user.displayName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.isPro ? "Yes" : "No"}</td>
                  <td className="p-2">{user.isAdmin ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {user.lockedOwner ? (
                      <span className="text-xs text-[var(--muted)]">Owner</span>
                    ) : (
                      <button type="button" onClick={() => void toggleAdmin(user)} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold">
                        {user.isAdmin ? "Remove admin" : "Make admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "content" && (
        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="gold-card space-y-3 p-4">
            <label className="block text-sm font-medium">
              Chapter
              <select
                className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2"
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
                  </option>
                ))}
              </select>
            </label>
            {path && (
              <>
                <input value={pathTitle} onChange={(e) => setPathTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" />
                <textarea value={pathSubtitle} onChange={(e) => setPathSubtitle(e.target.value)} className="h-20 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" />
                <button type="button" onClick={() => void savePath()} className="btn-gold rounded-full px-4 py-2 text-sm">
                  Save chapter heading
                </button>
                <label className="block text-sm font-medium">
                  Lesson
                  <select className="mt-1 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                    <option value="">Select a lesson</option>
                    {path.lessons.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>
          {lesson && (
            <div className="gold-card space-y-3 p-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2" />
              <label className="text-sm">
                Minutes
                <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="ml-2 w-20 rounded-xl border border-[var(--line)] bg-transparent px-2 py-1" />
              </label>
              <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} className="h-40 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Paragraphs separated by a blank line" />
              <textarea value={example} onChange={(e) => setExample(e.target.value)} className="h-24 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Example" />
              <textarea value={takeaway} onChange={(e) => setTakeaway(e.target.value)} className="h-20 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Takeaway" />
              <input value={checkQuestion} onChange={(e) => setCheckQuestion(e.target.value)} className="w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Check question" />
              <textarea value={checkOptions} onChange={(e) => setCheckOptions(e.target.value)} className="h-24 w-full rounded-2xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="One option per line" />
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
              <button type="button" onClick={() => void saveLesson()} className="btn-gold rounded-full px-5 py-2 text-sm">
                Save lesson
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
