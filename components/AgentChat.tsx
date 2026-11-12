"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentResult, AgentStep } from "@/lib/agent/types";

type Message = { role: "user" | "model"; text: string; steps?: AgentStep[] };

// YOUR JOB: change these sample prompts to match your problem statement.
const SAMPLE_PROMPTS = [
  "I have a skin rash, book me with a doctor on Friday morning.",
  "Move my appointment to the next free slot.",
  "Which Tamilspeaking doctors are free tomorrow?",
];

export default function AgentChat({ onDataChanged }: { onDataChanged?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the last 20 messages are sent, to keep requests small.
        body: JSON.stringify({ messages: next.slice(-20).map(({ role, text }) => ({ role, text })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const result = data as AgentResult;
      setMessages([...next, { role: "model", text: result.reply, steps: result.steps }]);
      if (result.steps.some((s) => s.writes && s.ok)) onDataChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[60dvh] min-h-[320px] max-h-[560px] md:h-[70vh] md:max-h-none flex-col rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold">Agent</h2>
        <p className="text-xs text-slate-500">Ask in plain English. You can see every tool the agent uses.</p>
      </div>

      <div className="flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-3 sm:p-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">Try one of these:</p>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="flex min-h-[40px] w-full items-center rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm leading-snug hover:bg-slate-50 active:bg-slate-100"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] break-words rounded-2xl bg-slate-900 px-3 py-2 text-sm text-white"
                  : "max-w-[85%] min-w-0 break-words space-y-2"
              }
            >
              {m.steps && m.steps.length > 0 && <ToolSteps steps={m.steps} />}
              {m.role === "model" ? (
                <div className="whitespace-pre-wrap break-words rounded-2xl bg-slate-100 px-3 py-2 text-sm">{m.text}</div>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}

        {loading && <p className="text-sm text-slate-500">Agent is working...</p>}
        {error && <p className="text-sm text-red-600 break-words">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-slate-200 p-2.5 sm:p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your request..."
          className="flex-1 min-h-[40px] rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex min-h-[40px] shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 active:bg-slate-800"
        >
          Send
        </button>
      </form>
    </div>
  );
}

/** Shows each tool call so users (and judges) can see what the agent did. */
function ToolSteps({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="space-y-1">
      {steps.map((s, i) => (
        <details key={i} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
          <summary className="cursor-pointer select-none py-1 min-h-[40px] flex items-center flex-wrap gap-1 leading-normal">
            <span className={s.ok ? "text-emerald-700" : "text-red-600"}>{s.ok ? "Done" : "Failed"}</span>
            {" · "}
            <span className="font-mono font-medium">{s.tool}</span>
            {s.writes && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">writes data</span>}
          </summary>
          <pre className="mt-1 max-w-full overflow-x-auto whitespace-pre-wrap break-all text-slate-600">
            {JSON.stringify({ args: s.args, ...(s.ok ? { result: s.result } : { error: s.error }) }, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  );
}
