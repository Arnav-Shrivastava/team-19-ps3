"use client";

import { useState } from "react";
import FallingLeaves from "@/components/FallingLeaves";
import {
  HeartPulse,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Stethoscope,
  Clock,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Floating glass card 3D tilt & interaction states
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4; // subtle max 2 degrees tilt
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
    setTilt({ x, y });
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Invalid passcode. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100svh] h-[100svh] w-full overflow-y-auto lg:overflow-hidden bg-[#FCFBF8] text-[#18332D]">
      {/* Background Falling Leaves Animation Across Entire Page */}
      <FallingLeaves />

      {/* Ambient Gradient Blobs for Depth */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-[#B8E8D2]/35 blur-[90px]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#F5DCE8]/40 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E3F5EC]/30 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] lg:h-full flex-col lg:flex-row">
        {/* ========================================================================= */}
        {/* LEFT HALF — CARESLOT BRAND INTRODUCTION (~50% width on desktop)           */}
        {/* ========================================================================= */}
        <section className="relative flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-8 xl:p-12 lg:max-w-[50%] lg:h-full">
          {/* Top Branding */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8E8D2] via-[#E3F5EC] to-[#F5DCE8] p-0.5 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                  <HeartPulse className="h-5 w-5 text-[#219B76]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-xl font-extrabold tracking-tight text-[#164D3C]">
                    CareSlot
                  </span>
                  <span className="rounded-full border border-[#B8E8D2] bg-[#E3F5EC] px-2 py-0.5 text-[10px] font-bold text-[#164D3C]">
                    Clinical SaaS
                  </span>
                </div>
                <p className="text-xs text-[#788781]">
                  Intelligent Clinic Management
                </p>
              </div>
            </div>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/70 px-3 py-0.5 text-[11px] font-medium text-[#788781] shadow-2xs backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-[#219B76]" />
              <span>A smarter way to manage your healthcare journey</span>
            </div>
          </div>

          {/* Main Hero Editorial Content & 3D Sculpture */}
          <div className="my-auto py-2 space-y-4 max-w-lg">
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-[#164D3C] leading-[1.15]">
                Healthcare, made a little{" "}
                <span className="relative inline-block text-[#219B76]">
                  more human.
                  <span className="absolute bottom-1 left-0 -z-10 h-2.5 w-full rounded-sm bg-[#B8E8D2]/40" />
                </span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#788781]">
                Your health journey deserves thoughtful care. Discover a simpler way to connect with accredited specialists, schedule clinic appointments in plain English, and stay effortlessly on top of your well-being.
              </p>
            </div>

            {/* 3D Healthcare Sculpture Composition */}
            <div className="relative pt-1 sm:pt-2">
              <div className="relative flex items-center justify-center rounded-3xl border border-white/90 bg-gradient-to-r from-white/80 via-[#E3F5EC]/40 to-[#FBEAF1]/50 p-4 sm:p-5 shadow-sm backdrop-blur-xl">
                {/* 3D Glass Medical Sculpture Orb */}
                <div className="orb-container relative">
                  <div className="medical-orb flex items-center justify-center !w-[140px] !h-[140px] sm:!w-[170px] sm:!h-[170px] lg:!w-[150px] lg:!h-[150px] xl:!w-[180px] xl:!h-[180px]">
                    <div className="orb-ring" />
                    <div className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/85 shadow-md backdrop-blur-md">
                      <HeartPulse className="h-6 w-6 sm:h-7 sm:w-7 text-[#219B76] animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Floating Metric Badge 1 */}
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-2xl border border-white/95 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#E3F5EC] text-[#164D3C]">
                    <Stethoscope className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#164D3C]">15 Specialists</p>
                    <p className="text-[9px] text-[#788781]">8 Medical Wings</p>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="absolute right-3 bottom-3 flex items-center gap-2 rounded-2xl border border-white/95 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#FBEAF1] text-[#D879A1]">
                    <Clock className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#164D3C]">09:00 - 12:30 IST</p>
                    <p className="text-[9px] text-[#788781]">Mon–Sat Slots</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Section */}
          <div className="border-t border-slate-200/70 pt-3 text-xs text-[#788781]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#18332D]">
                Thoughtfully designed for better clinic experiences.
              </p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Building2 className="h-3.5 w-3.5 text-[#219B76]" />
                <span className="font-semibold text-[#164D3C]">SRM Multi-Speciality Clinic</span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#D879A1]" /> Chennai
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT HALF — REFINED MINIMAL GLASS LOGIN CARD (~50% width on desktop)     */}
        {/* ========================================================================= */}
        <section className="relative flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-8 xl:p-12 lg:h-full">
          {/* Physical Floating Glass Panel with Hover Lift, Shadow Depth & Border Glow */}
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onTouchCancel={() => setIsPressed(false)}
            style={{
              transform: isHovered
                ? `perspective(1000px) translateY(-5px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
                : isPressed
                ? "perspective(1000px) scale(0.99) translateY(0px) rotateX(0deg) rotateY(0deg)"
                : "perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg)",
              boxShadow: isHovered
                ? "0 25px 50px -12px rgba(22, 77, 60, 0.18), 0 0 32px rgba(184, 232, 210, 0.45)"
                : "0 20px 35px -10px rgba(0, 0, 0, 0.06)",
              borderColor: isHovered ? "#B8E8D2" : "rgba(255, 255, 255, 0.9)",
            }}
            className={`relative w-full max-w-[440px] overflow-hidden rounded-3xl border bg-white/85 p-8 sm:p-10 backdrop-blur-2xl transition-all duration-350 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
              isHovered ? "backdrop-blur-3xl bg-white/95" : ""
            }`}
          >
            {/* Subtle Ambient Glow inside Panel */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#B8E8D2]/35 to-[#F5DCE8]/35 blur-2xl" />

            {/* Login Header */}
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#164D3C] to-[#219B76] text-white shadow-md shadow-[#219B76]/20">
                <HeartPulse className="h-6 w-6 text-[#B8E8D2]" />
              </div>

              <div className="mt-5">
                <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-tight text-[#164D3C]">
                  Welcome to CareSlot
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#788781]">
                  Enter your team passcode to access the clinic portal.
                </p>
              </div>
            </div>

            {/* Authentication Form Section */}
            <div className="relative z-10 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Passcode Input Field */}
                <div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-[#788781]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter your passcode"
                      autoFocus
                      disabled={loading}
                      className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-11 pr-11 text-sm font-medium text-[#18332D] placeholder-[#788781] shadow-2xs outline-none transition-all duration-200 focus:border-[#219B76] focus:ring-4 focus:ring-[#B8E8D2]/40 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center text-[#788781] hover:text-[#18332D] transition-colors"
                      aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Inline Error State */}
                  {error && (
                    <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 px-3 py-2 text-xs text-rose-700 animate-in fade-in">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Remember session checkbox */}
                <div className="flex items-center text-xs text-[#788781] pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#219B76] focus:ring-[#219B76]"
                    />
                    <span className="text-[11px] font-medium">Remember clinic session</span>
                  </label>
                </div>

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={loading || !passcode.trim()}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#164D3C] via-[#219B76] to-[#164D3C] py-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#219B76]/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-[#219B76]/35 active:scale-[0.98] disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#B8E8D2]" />
                      <span>Verifying passcode...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Clinic Portal</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
