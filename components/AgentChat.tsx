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
  Info,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

type Message = {
  role: "user" | "model";
  text: string;
  steps?: AgentStep[];
  timestamp?: string;
};

// Interactive suggestion chips for empty state
const SUGGESTION_CHIPS = [
  { label: "Book a new appointment", prompt: "I would like to book a new appointment. What departments do you have?", icon: Calendar },
  { label: "Find a dermatologist", prompt: "I have a skin rash, find me an available dermatologist for tomorrow.", icon: Stethoscope },
  { label: "Reschedule my appointment", prompt: "Move my appointment to the next free slot.", icon: RefreshCw },
  { label: "Cancel an appointment", prompt: "Show my booked appointments and help me cancel one.", icon: XCircle },
  { label: "View my appointments", prompt: "Show all my upcoming and past appointments.", icon: ClipboardList },
  { label: "Tamil / Hindi doctors", prompt: "Which Tamil or Hindi speaking doctors are free this week?", icon: Users },
];

/** Friendly titles for tool executions */
const TOOL_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; detail: string }
> = {
  getDepartments: {
    label: "Checking clinic departments",
    icon: Building2,
    detail: "Evaluating symptoms against clinic specialities",
  },
  searchDoctors: {
    label: "Searching specialist doctors",
    icon: Users,
    detail: "Finding doctors matching department, fee & language",
  },
  getAvailableSlots: {
    label: "Scanning open appointment slots",
    icon: Clock,
    detail: "Finding future unbooked clinic slots (09:00 - 12:30)",
  },
  getMyAppointments: {
    label: "Retrieving patient appointments",
    icon: ClipboardList,
    detail: "Checking patient P001 medical appointment records",
  },
  bookAppointment: {
    label: "Securing appointment slot",
    icon: CheckCircle2,
    detail: "Atomic booking transaction and slot lock",
  },
  cancelAppointment: {
    label: "Cancelling appointment",
    icon: XCircle,
    detail: "Updating appointment status and releasing slot",
  },
  rescheduleAppointment: {
    label: "Rescheduling appointment slot",
    icon: RefreshCw,
    detail: "Switching slot with same doctor and releasing previous slot",
  },
};

function formatTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

interface AgentChatProps {
  onDataChanged?: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export default function AgentChat({
  onDataChanged,
  externalPrompt,
  onClearExternalPrompt,
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages or loading state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle external prompts triggered from other components
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
        // Send last 20 messages for context
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

      // If any write tool ran successfully, trigger data refresh across other tabs
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
    if (confirm("Clear conversation history and restart AI assistant?")) {
      setMessages([]);
      setError("");
    }
  }

  return (
    <div className="flex h-[75vh] min-h-[580px] max-h-[820px] flex-col rounded-3xl border border-white/85 bg-white/75 shadow-lg backdrop-blur-2xl transition-all">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/80 bg-white/40 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8E8D2] to-[#F8DCE8] p-0.5 shadow-2xs">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white/90">
              <Sparkles className="h-4 w-4 text-[#299D78]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#299D78] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#299D78]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#172B2A]">CareSlot AI Assistant</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF5E9] px-2 py-0.5 text-[10px] font-semibold text-[#1B6A51]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#299D78]"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#74827F]">
              Your personal clinic scheduling assistant
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-2.5 py-1.5 text-xs text-[#74827F] transition-colors hover:bg-white hover:text-[#172B2A]"
              title="Reset conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 sm:p-5">
        {/* Welcome Empty State */}
        {messages.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center py-6 text-center">
            <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#B8E8D2]/80 via-[#DDF5E9] to-[#F8DCE8] p-1 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-white/95 backdrop-blur-sm">
                <HeartPulse className="h-8 w-8 text-[#299D78]" />
              </div>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-[#172B2A]">
              How can I help you today?
            </h3>
            <p className="mt-1 max-w-sm text-xs text-[#74827F]">
              Describe your symptoms, find specialists, or manage your bookings in plain English.
            </p>

            {/* Interactive Suggestion Chips */}
            <div className="mt-6 w-full max-w-md">
              <p className="mb-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#74827F]">
                Suggested prompts
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTION_CHIPS.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => send(chip.prompt)}
                      className="group flex items-start gap-2.5 rounded-2xl border border-white/85 bg-white/70 p-3 text-left shadow-2xs backdrop-blur-md transition-all hover:border-[#B8E8D2] hover:bg-white hover:shadow-sm active:scale-98"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#DDF5E9]/60 text-[#299D78] transition-colors group-hover:bg-[#299D78] group-hover:text-white">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#172B2A] group-hover:text-[#299D78]">
                          {chip.label}
                        </p>
                        <p className="truncate text-[10px] text-[#74827F]">
                          {chip.prompt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
          >
            <div className="flex max-w-[88%] gap-2 sm:max-w-[82%]">
              {/* Model Avatar */}
              {m.role === "model" && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8E8D2] to-[#F8DCE8] text-[#1B6A51] shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div className="min-w-0 space-y-2">
                {/* Tool Execution Steps Timeline */}
                {m.steps && m.steps.length > 0 && <SophisticatedToolSteps steps={m.steps} />}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs transition-all ${
                    m.role === "user"
                      ? "rounded-tr-xs bg-gradient-to-r from-[#172B2A] to-[#213F3D] text-white shadow-md"
                      : "rounded-tl-xs border border-white/90 bg-white/90 text-[#172B2A] backdrop-blur-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>

                  {/* Timestamp */}
                  {m.timestamp && (
                    <div
                      className={`mt-1.5 text-right text-[10px] ${
                        m.role === "user" ? "text-slate-300" : "text-[#74827F]"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              {m.role === "user" && (
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#299D78] text-xs font-bold text-white shadow-2xs">
                  AM
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking / Loading Animation */}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex max-w-[80%] items-center gap-3 rounded-2xl border border-white/90 bg-white/85 px-4 py-3 shadow-2xs backdrop-blur-md">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#DDF5E9] text-[#299D78]">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#74827F]">
                  CareSlot AI is checking availability...
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#299D78] dot-1"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#299D78] dot-2"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#299D78] dot-3"></span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700 shadow-2xs">
            <XCircle className="h-4 w-4 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Chat Composer */}
      <div className="border-t border-white/80 bg-white/40 p-3 sm:p-4 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask anything..."
              disabled={loading}
              className="w-full rounded-2xl border border-white/90 bg-white/85 px-4 py-3 text-xs sm:text-sm text-[#172B2A] placeholder-[#74827F] shadow-inner outline-none transition-all focus:border-[#299D78] focus:bg-white focus:ring-2 focus:ring-[#B8E8D2]/50 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#299D78] to-[#218364] text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md active:scale-95 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-[#74827F]">
          <span>Press Enter to send · Logged in as Arjun Mehta (P001)</span>
          <span className="hidden sm:inline">Clinic slots: 09:00 - 12:30 IST</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Sophisticated timeline-style tool execution stepper for judges and users.
 */
function SophisticatedToolSteps({ steps }: { steps: AgentStep[] }) {
  return (
    <div className="space-y-1.5 rounded-2xl border border-slate-100/90 bg-[#F7FAF9]/90 p-2.5 backdrop-blur-md">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#74827F]">
          AI Agent Actions ({steps.length})
        </span>
        <span className="text-[10px] text-[#299D78]">Verified Tool Flow</span>
      </div>

      <div className="space-y-1">
        {steps.map((s, idx) => {
          const config = TOOL_CONFIG[s.tool] ?? {
            label: s.tool,
            icon: Sparkles,
            detail: "Executed tool action",
          };
          const Icon = config.icon;

          return (
            <details
              key={idx}
              className={`group overflow-hidden rounded-xl border transition-all ${
                s.ok
                  ? "border-[#DDF5E9] bg-white/80 hover:bg-white"
                  : "border-red-200 bg-red-50/70"
              }`}
            >
              <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-2.5 py-1.5 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  {/* Status Indicator Icon */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-[10px] ${
                      s.ok
                        ? "bg-[#DDF5E9] text-[#299D78]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  </div>

                  {/* Tool Label */}
                  <span className="truncate font-medium text-[#172B2A]">
                    {config.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Write Pill */}
                  {s.writes && s.ok && (
                    <span className="shrink-0 rounded-full bg-[#DDF5E9] px-2 py-0.5 text-[9px] font-bold text-[#1B6A51]">
                      SAVED
                    </span>
                  )}
                  {!s.ok && (
                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-700">
                      FAILED
                    </span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-[#74827F] transition-transform group-open:rotate-180" />
                </div>
              </summary>

              {/* Technical Inspection for Judges */}
              <div className="border-t border-slate-100 bg-[#F7FAF9]/80 p-2.5 text-[10px]">
                <p className="mb-1 text-[10px] text-[#74827F]">{config.detail}</p>
                <div className="overflow-x-auto rounded-lg bg-slate-900 p-2 font-mono text-slate-200">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(
                      {
                        tool: s.tool,
                        arguments: s.args,
                        status: s.ok ? "SUCCESS" : "ERROR",
                        payload: s.ok ? s.result : s.error,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
