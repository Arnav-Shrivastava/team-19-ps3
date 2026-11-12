"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentResult, AgentStep } from "@/lib/agent/types";
import {
  Sparkles,
  Send,
  Building2,
  Users,
  Calendar,
  Clock,
  ClipboardList,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
  RotateCcw,
  Bot,
  User,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

type Message = {
  role: "user" | "model";
  text: string;
  steps?: AgentStep[];
  timestamp?: string;
};

const SUGGESTIONS = [
  { label: "Book a new appointment", prompt: "I would like to book a new appointment. What departments do you offer?", icon: Calendar },
  { label: "Find a dermatologist", prompt: "I have a skin rash and need a dermatologist for tomorrow or Friday.", icon: Stethoscope },
  { label: "Reschedule my visit", prompt: "Move my appointment to the next free slot with the same doctor.", icon: RefreshCw },
  { label: "Cancel an appointment", prompt: "Show my booked appointments and help me cancel one.", icon: XCircle },
  { label: "View my appointments", prompt: "Show all my upcoming and completed appointments.", icon: ClipboardList },
  { label: "Doctors speaking Tamil / Hindi", prompt: "Which doctors who speak Tamil or Hindi have free slots this week?", icon: Users },
];

const TOOL_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; detail: string }
> = {
  getDepartments: {
    label: "Routing to clinic department",
    icon: Building2,
    detail: "Matching symptoms to medical departments",
  },
  searchDoctors: {
    label: "Searching specialist doctors",
    icon: Users,
    detail: "Filtering by department, language, and fees",
  },
  getAvailableSlots: {
    label: "Scanning unbooked slots",
    icon: Clock,
    detail: "Finding future available slots (09:00 - 12:30 IST)",
  },
  getMyAppointments: {
    label: "Checking patient appointments",
    icon: ClipboardList,
    detail: "Retrieving records for logged-in patient P001",
  },
  bookAppointment: {
    label: "Securing appointment slot",
    icon: CheckCircle2,
    detail: "Atomic booking transaction and slot lock",
  },
  cancelAppointment: {
    label: "Cancelling appointment",
    icon: XCircle,
    detail: "Releasing slot and updating status to cancelled",
  },
  rescheduleAppointment: {
    label: "Rescheduling appointment slot",
    icon: RefreshCw,
    detail: "Switching slot with same doctor and freeing old slot",
  },
};

function formatTime(): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

interface DedicatedAIAssistantProps {
  onDataChanged?: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export default function DedicatedAIAssistant({
  onDataChanged,
  externalPrompt,
  onClearExternalPrompt,
}: DedicatedAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (externalPrompt) {
      send(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt, onClearExternalPrompt]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      role: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    const next: Message[] = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-20).map(({ role, text }) => ({ role, text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const result = data as AgentResult;

      setMessages([
        ...next,
        {
          role: "model",
          text: result.reply,
          steps: result.steps,
          timestamp: formatTime(),
        },
      ]);

      if (result.steps.some((s) => s.writes && s.ok)) {
        onDataChanged?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    if (confirm("Reset conversation with CareSlot AI Assistant?")) {
      setMessages([]);
      setError("");
    }
  }

  return (
    <section className="my-14" id="ai-assistant">
      {/* Section Header */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#209B73]">
          Conversational Intelligence
        </span>
        <h2 className="mt-1 font-editorial text-3xl font-extrabold tracking-tight text-[#164D3C] sm:text-4xl">
          Your personal healthcare companion.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#75847F]">
          Tell us what you need. We’ll help you find the right doctor, check slot availability, and book or move your appointment in plain English.
        </p>
      </div>

      {/* Main Full-Width Assistant Panel */}
      <div className="relative overflow-hidden rounded-3xl border border-[#B6E9D1] bg-gradient-to-b from-white via-[#FCFBF8] to-[#D7F1E5]/30 p-6 shadow-sm sm:p-8">
        {/* Assistant Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#164D3C] to-[#209B73] p-0.5 shadow-md shadow-[#209B73]/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                <Sparkles className="h-6 w-6 text-[#209B73]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-base font-bold text-[#164D3C]">
                  CareSlot AI Scheduling Agent
                </h3>
                <span className="flex items-center gap-1.5 rounded-full bg-[#D7F1E5] px-2.5 py-0.5 text-[10px] font-bold text-[#164D3C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#209B73] animate-ping" />
                  Live Agent
                </span>
              </div>
              <p className="text-xs text-[#75847F]">
                Zero hallucinations · Direct verified Supabase tool execution
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#75847F] hover:bg-slate-50 hover:text-[#172D29]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset conversation</span>
            </button>
          )}
        </div>

        {/* Conversation Feed */}
        <div className="my-6 min-h-[380px] max-h-[560px] overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D7F1E5] text-[#209B73]">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#164D3C]">
                Ready to assist your appointment booking
              </h4>
              <p className="mt-1 max-w-md mx-auto text-xs text-[#75847F]">
                Try typing a natural request or click one of the suggested prompts below to start.
              </p>

              {/* Suggestions Grid */}
              <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => send(item.prompt)}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-left shadow-2xs transition-all hover:border-[#209B73] hover:shadow-sm active:scale-98"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D7F1E5]/70 text-[#209B73] group-hover:bg-[#209B73] group-hover:text-white transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#172D29] group-hover:text-[#209B73]">
                          {item.label}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#75847F]">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
              >
                <div className="flex max-w-[85%] gap-3">
                  {m.role === "model" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#164D3C] to-[#209B73] text-white shadow-2xs">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className="space-y-2">
                    {/* Tool Execution Timeline */}
                    {m.steps && m.steps.length > 0 && (
                      <div className="space-y-1.5 rounded-2xl border border-[#B6E9D1] bg-[#D7F1E5]/30 p-3">
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#164D3C]">
                            Agent Verified Steps ({m.steps.length})
                          </span>
                          <span className="text-[10px] font-semibold text-[#209B73]">
                            Zero SQL Hallucination
                          </span>
                        </div>

                        {m.steps.map((step, sIdx) => {
                          const cfg = TOOL_CONFIG[step.tool] ?? {
                            label: step.tool,
                            icon: Sparkles,
                            detail: "Executed tool action",
                          };
                          const StepIcon = cfg.icon;

                          return (
                            <details
                              key={sIdx}
                              className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white"
                            >
                              <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ${
                                      step.ok ? "bg-[#D7F1E5] text-[#164D3C]" : "bg-rose-100 text-rose-700"
                                    }`}
                                  >
                                    {step.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                  </div>
                                  <span className="font-semibold text-[#172D29]">
                                    {cfg.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {step.writes && step.ok && (
                                    <span className="rounded-full bg-[#D7F1E5] px-2 py-0.5 text-[9px] font-bold text-[#164D3C]">
                                      SAVED TO DB
                                    </span>
                                  )}
                                  <ChevronDown className="h-3.5 w-3.5 text-[#75847F] transition-transform group-open:rotate-180" />
                                </div>
                              </summary>

                              <div className="border-t border-slate-100 bg-[#FCFBF8] p-3 text-[11px]">
                                <p className="mb-1 text-[#75847F]">{cfg.detail}</p>
                                <pre className="overflow-x-auto rounded-xl bg-[#164D3C] p-2.5 font-mono text-[10px] text-[#D7F1E5]">
                                  {JSON.stringify(
                                    {
                                      tool: step.tool,
                                      args: step.args,
                                      status: step.ok ? "OK" : "ERROR",
                                      result: step.ok ? step.result : step.error,
                                    },
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        m.role === "user"
                          ? "bg-[#164D3C] text-white rounded-tr-xs"
                          : "border border-slate-200/90 bg-white text-[#172D29] rounded-tl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      {m.timestamp && (
                        <div
                          className={`mt-1.5 text-right text-[10px] ${
                            m.role === "user" ? "text-slate-300" : "text-[#75847F]"
                          }`}
                        >
                          {m.timestamp}
                        </div>
                      )}
                    </div>
                  </div>

                  {m.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#209B73] font-bold text-white shadow-2xs">
                      AM
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#B6E9D1] bg-white p-4 shadow-2xs max-w-sm">
              <Bot className="h-5 w-5 text-[#209B73] animate-pulse" />
              <span className="text-xs font-semibold text-[#164D3C]">
                CareSlot AI is checking clinical slots...
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 flex items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask anything (e.g. 'Book a dermatologist for Friday morning')..."
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 text-xs sm:text-sm font-medium text-[#172D29] placeholder-[#75847F] shadow-sm outline-none transition-all focus:border-[#209B73] focus:ring-2 focus:ring-[#B6E9D1]/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#164D3C] text-white shadow-md shadow-[#164D3C]/20 transition-all hover:bg-[#209B73] active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] text-[#75847F]">
          <span>Logged-in User: Arjun Mehta (P001) · Safe atomic booking</span>
          <span>Clinic Hours: Mon–Sat 09:00 to 12:30 IST</span>
        </div>
      </div>
    </section>
  );
}
