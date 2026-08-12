"use client";

import { AGENTS, AGENT_ORDER, type AgentId, type StageStatus } from "@/lib/types";

const statusLabel: Record<StageStatus, string> = {
  locked: "Locked",
  active: "In progress",
  in_review: "Review",
  approved: "Approved",
};

export function StageNav({
  current,
  statuses,
  onSelect,
}: {
  current: AgentId;
  statuses: Record<AgentId, StageStatus>;
  onSelect: (id: AgentId) => void;
}) {
  return (
    <nav className="overflow-x-auto">
      <ol className="flex min-w-max gap-2 pb-1">
        {AGENT_ORDER.map((id, index) => {
          const meta = AGENTS[id];
          const status = statuses[id];
          const isCurrent = current === id;
          const clickable = status !== "locked" || isCurrent;
          return (
            <li key={id}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(id)}
                className={[
                  "flex min-w-[148px] flex-col rounded-2xl border px-3 py-3 text-left transition",
                  isCurrent
                    ? "border-[var(--teal)] bg-[var(--teal-soft)] shadow-sm"
                    : status === "approved"
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-[var(--line)] bg-white",
                  !clickable ? "cursor-not-allowed opacity-45" : "hover:border-[var(--teal)]",
                ].join(" ")}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Stage {meta.number}
                  {index < AGENT_ORDER.length - 1 ? "" : ""}
                </span>
                <span className="mt-1 text-sm font-semibold text-[var(--ink)]">
                  {meta.shortName}
                </span>
                <span className="mt-1 text-[11px] text-[var(--muted)]">
                  {statusLabel[status]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
