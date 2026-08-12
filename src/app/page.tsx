"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProject, deleteProject, listProjects, loadSettings, saveSettings } from "@/lib/storage";
import { createSampleProject } from "@/lib/sample";
import type { Project, ProjectSettings } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ProjectSettings>({ model: "gpt-4o-mini" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(listProjects());
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const hasKey = useMemo(() => Boolean(settings.openaiApiKey?.trim()), [settings]);

  function refresh() {
    setProjects(listProjects());
  }

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const project = createProject(name, description);
    router.push(`/project/${project.id}`);
  }

  function onSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    saveSettings(settings);
    setSettingsOpen(false);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--panel)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="brand-mark text-2xl text-[var(--ink)]">Report Desk</p>
            <p className="text-sm text-[var(--muted)]">
              Guided Power BI delivery — six clear stages, no technical setup required
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] hover:border-[var(--teal)]"
          >
            {hasKey ? "Settings ✓" : "Add API key"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_20px_50px_rgba(18,42,48,0.08)]">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--teal-soft)] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-[var(--sand)] blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
            Start here
          </p>
          <h1 className="brand-mark mt-3 max-w-xl text-4xl leading-tight text-[var(--ink)] md:text-5xl">
            Turn a report idea into a finished Power BI package
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
            Walk through Requirements → Design → Data Check → Build Guide → QA → Docs.
            Each stage shows plain-English results you can edit before moving on.
          </p>

          <form onSubmit={onCreate} className="relative mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                Project name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sales Executive Dashboard"
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-[var(--ink)] outline-none ring-[var(--teal)] focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                What is this about? (optional)
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Paste a rough idea, meeting notes, or say it's an update to an existing report..."
                className="w-full resize-y rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-[var(--ink)] outline-none ring-[var(--teal)] focus:ring-2"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(11,95,107,0.28)] hover:bg-[var(--teal-deep)]"
              >
                Create project & begin Stage 1
              </button>
              <button
                type="button"
                onClick={() => {
                  const sample = createSampleProject();
                  router.push(`/project/${sample.id}`);
                }}
                className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--teal)]"
              >
                Open sample walkthrough
              </button>
            </div>
          </form>

          {!hasKey && hydrated && (
            <p className="mt-4 rounded-2xl bg-[var(--sand)] px-4 py-3 text-sm text-[var(--ink)]">
              Tip: open <button type="button" className="underline" onClick={() => setSettingsOpen(true)}>Settings</button> and paste your OpenAI API key so the agents can reply.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li><span className="font-semibold text-[var(--ink)]">1.</span> Paste your request — notes, RSD, or “we need a sales dashboard.”</li>
              <li><span className="font-semibold text-[var(--ink)]">2.</span> Review the living document on the right. Ask for changes in plain English.</li>
              <li><span className="font-semibold text-[var(--ink)]">3.</span> Click Approve & continue when that stage looks right.</li>
              <li><span className="font-semibold text-[var(--ink)]">4.</span> Later stages inherit what you already approved — nothing restarts from scratch.</li>
            </ol>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Your projects</h2>
              <button type="button" onClick={refresh} className="text-sm text-[var(--teal)]">
                Refresh
              </button>
            </div>
            {!hydrated ? (
              <p className="mt-4 text-sm text-[var(--muted)]">Loading…</p>
            ) : projects.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">
                No projects yet. Create one on the left.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/project/${p.id}`}
                        className="block truncate font-medium text-[var(--ink)] hover:text-[var(--teal)]"
                      >
                        {p.name}
                      </Link>
                      <p className="truncate text-xs text-[var(--muted)]">
                        Stage: {p.currentAgent} · Updated {new Date(p.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete “${p.name}”?`)) {
                          deleteProject(p.id);
                          refresh();
                        }
                      }}
                      className="shrink-0 text-xs text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={onSaveSettings}
            className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)]">Settings</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your API key is stored only in this browser. It is sent to our local chat API, which
              then calls OpenAI on your behalf. It is never saved on a server by this app.
            </p>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-medium">OpenAI API key</span>
              <input
                type="password"
                value={settings.openaiApiKey || ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, openaiApiKey: e.target.value }))
                }
                placeholder="sk-..."
                className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--teal)] focus:ring-2"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Model</span>
              <select
                value={settings.model || "gpt-4o-mini"}
                onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--teal)] focus:ring-2"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (recommended)</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4.1">gpt-4.1</option>
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-full px-4 py-2 text-sm text-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white"
              >
                Save settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
