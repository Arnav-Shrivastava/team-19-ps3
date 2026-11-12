"use client";

import { useState } from "react";
import { HeartPulse, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = "/";
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Invalid passcode. Please try again.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-[#F7FAF9] overflow-hidden">
      {/* Ambient background glow */}
      <div className="ambient-bg">
        <div className="blob-mint" />
        <div className="blob-pink" />
        <div className="blob-center" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl">
          {/* Subtle gradient element */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-[#B8E8D2]/40 to-[#F8DCE8]/40 blur-2xl"></div>

          {/* Logo & Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8E8D2] via-[#DDF5E9] to-[#F8DCE8] p-1 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                <HeartPulse className="h-7 w-7 text-[#299D78]" />
              </div>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#172B2A]">
              CareSlot Clinic Portal
            </h1>
            <p className="mt-1 text-xs text-[#74827F]">
              Intelligent Multi-Speciality Clinic Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#74827F]">
                Team Passcode
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#74827F]" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-2xl border border-white/90 bg-white/90 py-2.5 pl-10 pr-4 text-sm text-[#172B2A] placeholder-[#74827F] outline-none transition-all focus:border-[#299D78] focus:bg-white focus:ring-2 focus:ring-[#B8E8D2]/50"
                  placeholder="Enter passcode"
                  autoFocus
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#74827F]">
                Protects the clinic system and your Gemini API quota.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !passcode}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#299D78] to-[#218364] py-3 text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md active:scale-98 disabled:opacity-40"
            >
              <span>{loading ? "Verifying..." : "Enter Clinic Portal"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#74827F]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#299D78]" />
              Logged-in Demo User: Arjun Mehta (P001)
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
