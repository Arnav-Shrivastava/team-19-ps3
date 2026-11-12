"use client";

import { useMemo } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Activity,
} from "lucide-react";

interface HeroSectionProps {
  onExploreAppointments: () => void;
  onMeetSpecialists: () => void;
}

export default function HeroSection({
  onExploreAppointments,
  onMeetSpecialists,
}: HeroSectionProps) {
  // Time-aware greeting pinned to Asia/Kolkata timezone to avoid server/client hydration mismatch
  const greeting = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const hour = parseInt(formatter.format(new Date()), 10);
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-[#D7F1E5]/60 via-[#FCFBF8] to-[#F9E8EF]/50 p-8 shadow-sm backdrop-blur-xl sm:p-12 lg:min-h-[380px] flex items-center">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#B6E9D1]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#F5D5E3]/40 blur-3xl" />

      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left Side: Large Editorial Headline & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata pill badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-[#B6E9D1] bg-[#D7F1E5] px-3 py-1 text-xs font-bold text-[#164D3C] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#209B73]" />
              Patient ID: P001
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-xs font-semibold text-[#172D29] shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-[#209B73]" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-xs font-semibold text-[#75847F] shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-[#D879A1]" />
              Chennai Clinic
            </span>
          </div>

          {/* Large Headline */}
          <div>
            <h1 className="font-editorial text-3xl font-extrabold tracking-tight text-[#164D3C] sm:text-4xl lg:text-5xl">
              {greeting}, Arjun.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#75847F] sm:text-base">
              Your health deserves thoughtful care. We’re here to make every step simpler—from discovering specialized physicians to booking appointments in plain English.
            </p>
          </div>

          {/* Prominent Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreAppointments}
              className="flex items-center gap-2 rounded-2xl bg-[#164D3C] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#164D3C]/20 transition-all duration-300 hover:bg-[#209B73] hover:shadow-lg hover:shadow-[#209B73]/25 active:scale-98"
            >
              <span>Explore appointments</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onMeetSpecialists}
              className="group flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-bold text-[#164D3C] transition-colors hover:text-[#209B73]"
            >
              <span>Meet our specialists</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3D Healthcare Visual & Floating Elements */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative flex items-center justify-center p-6">
            {/* 3D Medical Glass Orb */}
            <div className="orb-container relative">
              <div className="medical-orb flex items-center justify-center">
                {/* Orbital Ring */}
                <div className="orb-ring" />

                {/* Center Healthcare Cross & Pulse */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 shadow-lg backdrop-blur-md">
                  <HeartPulse className="h-10 w-10 text-[#209B73] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Floating Organic Metric Badges */}
            <div className="absolute -left-4 bottom-2 flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D7F1E5] text-[#164D3C]">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#164D3C]">15 Doctors</p>
                <p className="text-[10px] text-[#75847F]">8 Departments</p>
              </div>
            </div>

            <div className="absolute -right-2 top-2 flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/90 p-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F9E8EF] text-[#D879A1]">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#164D3C]">Instant Booking</p>
                <p className="text-[10px] text-[#75847F]">09:00 - 12:30 IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
