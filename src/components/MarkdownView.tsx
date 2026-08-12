"use client";

import { useEffect, useRef, useState } from "react";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code class='rounded bg-black/5 px-1 py-0.5 text-[0.9em]'>$1</code>");
}

function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;
  let inList = false;
  let inTable = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  const closeTable = () => {
    if (inTable) {
      html.push("</tbody></table></div>");
      inTable = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      closeList();
      closeTable();
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        body.push(lines[i]);
        i += 1;
      }
      if (lang === "mermaid") {
        html.push(
          `<pre class="mermaid-block overflow-x-auto rounded-xl bg-[#f4f7f6] p-4 text-xs"><code>${escapeHtml(body.join("\n"))}</code></pre>`,
        );
      } else {
        html.push(
          `<pre class="overflow-x-auto rounded-xl bg-[#122a30] p-4 text-xs text-[#e8f2ef]"><code>${escapeHtml(body.join("\n"))}</code></pre>`,
        );
      }
      i += 1;
      continue;
    }

    const tableMatch = /^\|(.+)\|$/.test(line);
    if (tableMatch) {
      closeList();
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      const isSeparator =
        cells.every((c) => /^:?-{3,}:?$/.test(c)) ||
        (i + 1 < lines.length &&
          /^\|(.+)\|$/.test(lines[i + 1]) &&
          lines[i + 1]
            .split("|")
            .slice(1, -1)
            .every((c) => /^:?-{3,}:?$/.test(c.trim())));

      if (!inTable) {
        html.push('<div class="overflow-x-auto"><table class="md-table w-full text-left text-sm">');
        // peek: if next is separator, this is header
        if (
          i + 1 < lines.length &&
          /^\|(.+)\|$/.test(lines[i + 1]) &&
          lines[i + 1]
            .split("|")
            .slice(1, -1)
            .every((c) => /^:?-{3,}:?$/.test(c.trim()))
        ) {
          html.push(
            `<thead><tr>${cells.map((c) => `<th>${inlineFormat(c)}</th>`).join("")}</tr></thead><tbody>`,
          );
          i += 2; // skip header + separator
          inTable = true;
          continue;
        }
        html.push("<tbody>");
        inTable = true;
      }

      if (isSeparator) {
        i += 1;
        continue;
      }

      html.push(`<tr>${cells.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`);
      i += 1;
      continue;
    }
    closeTable();

    if (/^###\s+/.test(line)) {
      closeList();
      html.push(`<h3 class="mt-4 text-base font-semibold">${inlineFormat(line.replace(/^###\s+/, ""))}</h3>`);
      i += 1;
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeList();
      html.push(`<h2 class="mt-5 text-lg font-semibold">${inlineFormat(line.replace(/^##\s+/, ""))}</h2>`);
      i += 1;
      continue;
    }
    if (/^#\s+/.test(line)) {
      closeList();
      html.push(`<h1 class="mt-5 text-xl font-semibold">${inlineFormat(line.replace(/^#\s+/, ""))}</h1>`);
      i += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        html.push('<ul class="my-2 list-disc space-y-1 pl-5">');
        inList = true;
      }
      html.push(`<li>${inlineFormat(line.replace(/^[-*]\s+/, ""))}</li>`);
      i += 1;
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      closeList();
      html.push(`<p class="my-1">${inlineFormat(line)}</p>`);
      i += 1;
      continue;
    }
    if (!line.trim()) {
      closeList();
      html.push('<div class="h-2"></div>');
      i += 1;
      continue;
    }
    closeList();
    html.push(`<p class="my-1.5 leading-relaxed">${inlineFormat(line)}</p>`);
    i += 1;
  }
  closeList();
  closeTable();
  return html.join("\n");
}

export function MarkdownView({ content, className = "" }: { content: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    setHtml(markdownToHtml(content || ""));
  }, [content]);

  useEffect(() => {
    let cancelled = false;
    async function renderMermaid() {
      const root = ref.current;
      if (!root) return;
      const blocks = root.querySelectorAll("pre.mermaid-block code");
      if (!blocks.length) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
        });
        for (const [idx, block] of Array.from(blocks).entries()) {
          if (cancelled) return;
          const source = block.textContent || "";
          const id = `mmd-${Date.now()}-${idx}`;
          try {
            const { svg } = await mermaid.render(id, source);
            const wrapper = document.createElement("div");
            wrapper.className = "my-3 overflow-x-auto rounded-xl bg-[#f4f7f6] p-3";
            wrapper.innerHTML = svg;
            block.parentElement?.replaceWith(wrapper);
          } catch {
            // leave source visible if mermaid fails
          }
        }
      } catch {
        // mermaid optional
      }
    }
    void renderMermaid();
    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className={`markdown-body text-sm text-[var(--ink)] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
