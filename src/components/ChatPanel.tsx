"use client";

import { useEffect, useRef, useState } from "react";
import { MarkdownView } from "./MarkdownView";
import type { ChatMessage } from "@/lib/types";

export function ChatPanel({
  messages,
  busy,
  onSend,
  starterHint,
}: {
  messages: ChatMessage[];
  busy: boolean;
  onSend: (text: string) => void;
  starterHint: string;
}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setText("");
    onSend(trimmed);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/70 p-5 text-sm text-[var(--muted)]">
            {starterHint}
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={[
              "max-w-[95%] rounded-2xl px-4 py-3",
              m.role === "user"
                ? "ml-auto bg-[var(--teal)] text-white"
                : "mr-auto border border-[var(--line)] bg-white text-[var(--ink)]",
            ].join(" ")}
          >
            {m.role === "user" ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
            ) : (
              <MarkdownView content={m.content} />
            )}
          </div>
        ))}
        {busy && (
          <div className="mr-auto rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
            Working on this stage…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="mt-3 border-t border-[var(--line)] pt-3">
        <label className="sr-only" htmlFor="chat-input">
          Your message
        </label>
        <textarea
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type in plain English… e.g. “Add a requirement for monthly churn” or “Remove the map from page 2”"
          className="w-full resize-y rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none ring-[var(--teal)] focus:ring-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)]">Enter to send · Shift+Enter for a new line</p>
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="rounded-full bg-[var(--teal)] px-5 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
