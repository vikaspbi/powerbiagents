import { NextRequest, NextResponse } from "next/server";
import { AGENT_SYSTEM_PROMPTS, buildContextPreamble } from "@/lib/agents";
import type { AgentId } from "@/lib/types";

interface ChatBody {
  agentId: AgentId;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  handoffs?: Partial<Record<AgentId, Record<string, unknown> | null>>;
  apiKey?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatBody;
    const { agentId, messages, handoffs = {}, apiKey, model } = body;

    if (!agentId || !AGENT_SYSTEM_PROMPTS[agentId]) {
      return NextResponse.json({ error: "Unknown agent." }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Add your OpenAI API key in Settings (top right). The key stays in your browser and is only sent with each chat request.",
        },
        { status: 400 },
      );
    }
    if (!messages?.length) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const system = [
      AGENT_SYSTEM_PROMPTS[agentId],
      buildContextPreamble(agentId, handoffs),
    ].join("\n\n");

    const openaiMessages = [
      { role: "system", content: system },
      ...messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = "OpenAI request failed.";
      try {
        const parsed = JSON.parse(errText);
        message = parsed?.error?.message || message;
      } catch {
        message = errText.slice(0, 300) || message;
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
