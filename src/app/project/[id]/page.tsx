"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { AGENTS } from "@/lib/types";
import type { AgentId, ChatMessage, Project } from "@/lib/types";
import {
  approveStage,
  collectHandoffs,
  extractJsonBlock,
  extractLivingDoc,
  getProject,
  loadSettings,
  reopenStage,
  saveProject,
  saveSettings,
} from "@/lib/storage";
import { StageNav } from "@/components/StageNav";
import { ChatPanel } from "@/components/ChatPanel";
import { LivingDocPanel } from "@/components/LivingDocPanel";

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const p = getProject(params.id);
    if (!p) {
      setMissing(true);
      return;
    }
    setProject(p);
    const s = loadSettings();
    setApiKey(s.openaiApiKey || "");
    setModel(s.model || "gpt-4o-mini");
  }, [params.id]);

  const agentId = project?.currentAgent ?? "requirements";
  const stage = project?.stages[agentId];
  const meta = AGENTS[agentId];

  const statuses = useMemo(() => {
    if (!project) return null;
    return Object.fromEntries(
      Object.entries(project.stages).map(([id, s]) => [id, s.status]),
    ) as Record<AgentId, Project["stages"][AgentId]["status"]>;
  }, [project]);

  const persist = useCallback((next: Project) => {
    saveProject(next);
    setProject(next);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!project) return;
      setError(null);
      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };

      const working = structuredClone(project);
      const current = working.currentAgent;
      working.stages[current].messages.push(userMsg);
      if (working.stages[current].status === "approved") {
        working.stages[current].status = "active";
      }
      persist(working);
      setBusy(true);

      try {
        const settings = loadSettings();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: current,
            messages: working.stages[current].messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            handoffs: collectHandoffs(working),
            apiKey: settings.openaiApiKey,
            model: settings.model,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Chat failed");
        }

        const assistantMsg: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: data.content,
          createdAt: new Date().toISOString(),
        };

        const next = structuredClone(working);
        next.stages[current].messages.push(assistantMsg);
        next.stages[current].livingDocMarkdown = extractLivingDoc(data.content);
        const json = extractJsonBlock(data.content);
        if (json) {
          next.stages[current].handoffJson = json;
        }
        next.stages[current].status = "in_review";
        next.stages[current].changelog.push(
          `${new Date().toLocaleString()}: response updated living document`,
        );
        persist(next);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setBusy(false);
      }
    },
    [persist, project],
  );

  function onApprove() {
    if (!project) return;
    if (!project.stages[project.currentAgent].livingDocMarkdown) {
      setError("Ask the agent to produce an output first, then approve.");
      return;
    }
    const next = approveStage(project, project.currentAgent);
    setProject(next);
    setError(null);
  }

  function onSelectStage(id: AgentId) {
    if (!project) return;
    if (project.stages[id].status === "locked") return;
    const next = structuredClone(project);
    next.currentAgent = id;
    persist(next);
  }

  function onReopen() {
    if (!project) return;
    setProject(reopenStage(project, project.currentAgent));
  }

  if (missing) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <p className="mt-2 text-[var(--muted)]">It may have been deleted in this browser.</p>
        <Link href="/" className="mt-6 inline-block text-[var(--teal)] underline">
          Back to home
        </Link>
      </div>
    );
  }

  if (!project || !stage || !statuses) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center text-[var(--muted)]">
        Loading project…
      </div>
    );
  }

  const starterHints: Record<AgentId, string> = {
    requirements:
      "Paste your idea, meeting notes, RSD/PRD, or describe an existing report change. Example: “We need a sales dashboard showing revenue by region, with filters for year and product line.”",
    architecture:
      "Say “Proceed with architecture from the approved requirements” — or ask for a specific change like “Add a security boundary for RLS.”",
    feasibility:
      "Paste your Power BI table/column list or a sample. Example: “Tables: Orders(OrderId, CustomerId, OrderDate, Amount), Customers(CustomerId, Region, Name).”",
    build:
      "Say “Create the build guide from the approved design and data check” — or request a change like “Only include completed orders in the revenue measure.”",
    qa: "Say “Use the default test case format and generate the sheet” — then report Pass/Fail results as you check them.",
    documentation:
      "Say “Use the default documentation template and compile from prior stages” — or paste your company’s template.",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--line)] bg-[var(--panel)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link href="/" className="text-xs font-medium text-[var(--teal)]">
              ← All projects
            </Link>
            <h1 className="truncate text-xl font-semibold text-[var(--ink)]">{project.name}</h1>
            {project.description && (
              <p className="truncate text-sm text-[var(--muted)]">{project.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm"
          >
            {apiKey ? "Settings ✓" : "Add API key"}
          </button>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 pb-4">
          <StageNav current={agentId} statuses={statuses} onSelect={onSelectStage} />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 gap-4 px-4 py-4 lg:grid-cols-2 lg:gap-6">
        <section className="flex min-h-[70vh] flex-col rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">
              Stage {meta.number} · Chat
            </p>
            <h2 className="text-lg font-semibold text-[var(--ink)]">{meta.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{meta.plainDescription}</p>
            <p className="mt-2 rounded-xl bg-[var(--sand)] px-3 py-2 text-xs text-[var(--ink)]">
              <span className="font-semibold">What you do: </span>
              {meta.whatYouDo}
            </p>
          </div>
          <div className="min-h-0 flex-1">
            <ChatPanel
              messages={stage.messages}
              busy={busy}
              onSend={sendMessage}
              starterHint={starterHints[agentId]}
            />
          </div>
        </section>

        <section className="flex min-h-[70vh] flex-col rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm">
          <LivingDocPanel
            title={meta.outputLabel}
            markdown={stage.livingDocMarkdown}
            handoffJson={stage.handoffJson}
            changelog={stage.changelog}
          />
        </section>
      </div>

      <footer className="sticky bottom-0 border-t border-[var(--line)] bg-[var(--panel)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm text-[var(--muted)]">
            {error ? (
              <span className="text-red-700">{error}</span>
            ) : stage.status === "approved" ? (
              <span>This stage is approved. You can still ask for changes anytime.</span>
            ) : stage.status === "in_review" ? (
              <span>Review the living document, then approve — or ask for a change in chat.</span>
            ) : (
              <span>Open / locked items stay clear until you say otherwise.</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {stage.status === "approved" ? (
              <button
                type="button"
                onClick={onReopen}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium"
              >
                Reopen for edits
              </button>
            ) : (
              <button
                type="button"
                onClick={onApprove}
                disabled={!stage.livingDocMarkdown || busy}
                className="rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                {meta.nextId ? "Approve & continue →" : "Approve & finish"}
              </button>
            )}
          </div>
        </div>
      </footer>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSettings({ openaiApiKey: apiKey, model });
              setSettingsOpen(false);
            }}
            className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-xl"
          >
            <h3 className="text-xl font-semibold">Settings</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Paste an OpenAI API key. It stays in your browser only.
            </p>
            <label className="mt-5 block text-sm font-medium">
              API key
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--teal)] focus:ring-2"
                placeholder="sk-..."
              />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Model
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none ring-[var(--teal)] focus:ring-2"
              >
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4.1">gpt-4.1</option>
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setSettingsOpen(false)} className="px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
