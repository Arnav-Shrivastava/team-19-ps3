"use client";

import { Calendar, CheckCircle2, Stethoscope, Clock, TrendingUp } from "lucide-react";

interface StatsSectionProps {
  upcomingCount: number;
  completedCount: number;
  availableDoctorsCount: number;
  totalFreeSlotsCount: number;
}

export default function StatsSection({
  upcomingCount,
  completedCount,
  availableDoctorsCount,
  totalFreeSlotsCount,
}: StatsSectionProps) {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Panel 1: Rich Mint-Green Panel (Upcoming Visits) */}
        <div className="group relative overflow-hidden rounded-3xl border border-[#B6E9D1] bg-gradient-to-br from-[#D7F1E5] to-[#B6E9D1]/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          {/* Decorative background shape */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/30 blur-xl transition-transform group-hover:scale-125" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#164D3C]/75">
                Active Bookings
              </span>
              <h3 className="mt-1 font-editorial text-xl font-extrabold text-[#164D3C]">
                Upcoming Visits
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#164D3C] shadow-2xs backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-baseline gap-2">
            <span className="font-editorial text-5xl font-extrabold tracking-tight text-[#164D3C]">
              {upcomingCount}
            </span>
            <span className="text-xs font-semibold text-[#164D3C]/80">
              {upcomingCount === 1 ? "Scheduled visit" : "Scheduled visits"}
            </span>
          </div>

          <div className="relative z-10 mt-4 border-t border-[#164D3C]/15 pt-3 text-xs text-[#164D3C]/80">
            <p className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-[#209B73]" />
              <span>Confirmed with clinic doctor</span>
            </p>
          </div>
        </div>

        {/* Panel 2: Pale Blush-Pink Panel (Past Consultations) */}
        <div className="group relative overflow-hidden rounded-3xl border border-[#F5D5E3] bg-gradient-to-br from-[#F9E8EF] to-[#F5D5E3]/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          {/* Decorative background shape */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/40 blur-xl transition-transform group-hover:scale-125" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D879A1]">
                Patient History
              </span>
              <h3 className="mt-1 font-editorial text-xl font-extrabold text-[#172D29]">
                Past Visits
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#D879A1] shadow-2xs backdrop-blur-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-baseline gap-2">
            <span className="font-editorial text-5xl font-extrabold tracking-tight text-[#172D29]">
              {completedCount}
            </span>
            <span className="text-xs font-semibold text-[#75847F]">
              Completed consultations
            </span>
          </div>

          <div className="relative z-10 mt-4 border-t border-[#D879A1]/20 pt-3 text-xs text-[#75847F]">
            <p className="flex items-center gap-1.5 font-medium text-[#172D29]">
              <TrendingUp className="h-3.5 w-3.5 text-[#D879A1]" />
              <span>Records archived in database</span>
            </p>
          </div>
        </div>

        {/* Panel 3: Warm Ivory Panel with Deep Emerald Accents (Available Specialists) */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/90 bg-[#FCFBF8] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B6E9D1] hover:shadow-md">
          {/* Decorative background shape */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-[#D7F1E5]/40 blur-xl transition-transform group-hover:scale-125" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#209B73]">
                Clinic Directory
              </span>
              <h3 className="mt-1 font-editorial text-xl font-extrabold text-[#164D3C]">
                Available Specialists
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D7F1E5] text-[#164D3C] shadow-2xs">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-baseline gap-2">
            <span className="font-editorial text-5xl font-extrabold tracking-tight text-[#164D3C]">
              {availableDoctorsCount}
            </span>
            <span className="text-xs font-semibold text-[#75847F]">
              Across 8 departments
            </span>
          </div>

          <div className="relative z-10 mt-4 border-t border-slate-200/70 pt-3 text-xs text-[#75847F]">
            <p className="flex items-center gap-1.5 font-medium text-[#164D3C]">
              <Clock className="h-3.5 w-3.5 text-[#209B73]" />
              <span>{totalFreeSlotsCount} unbooked future slots open</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
