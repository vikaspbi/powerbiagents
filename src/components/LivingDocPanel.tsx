"use client";

import { MarkdownView } from "./MarkdownView";
import { downloadText } from "@/lib/storage";

export function LivingDocPanel({
  title,
  markdown,
  handoffJson,
  changelog,
}: {
  title: string;
  markdown: string;
  handoffJson: Record<string, unknown> | null;
  changelog: string[];
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">
            Living document
          </p>
          <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!markdown}
            onClick={() =>
              downloadText(
                `${title.replace(/\s+/g, "-").toLowerCase()}.md`,
                markdown,
                "text/markdown",
              )
            }
            className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Download markdown
          </button>
          <button
            type="button"
            disabled={!handoffJson}
            onClick={() =>
              downloadText(
                `${title.replace(/\s+/g, "-").toLowerCase()}-handoff.json`,
                JSON.stringify(handoffJson, null, 2),
                "application/json",
              )
            }
            className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Download JSON
          </button>
        </div>
      </div>

      {changelog.length > 0 && (
        <div className="mt-3 rounded-xl bg-[var(--sand)] px-3 py-2 text-xs text-[var(--ink)]">
          <span className="font-semibold">Recent changes: </span>
          {changelog.slice(-3).join(" · ")}
        </div>
      )}

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-4">
        {markdown ? (
          <MarkdownView content={markdown} />
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Nothing here yet. Chat with this stage agent on the left — the approved working copy
            will appear here and stay editable.
          </p>
        )}
      </div>
    </div>
  );
}
