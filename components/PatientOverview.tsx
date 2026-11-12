"use client";

import { useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  Stethoscope,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
} from "lucide-react";

interface PatientOverviewProps {
  upcomingCount: number;
  completedCount: number;
  availableDoctorsCount: number;
  totalFreeSlotsCount: number;
  nextAppointment?: {
    doctor_name: string;
    department: string;
    slot_date: string;
    start_time: string;
    room: string;
  } | null;
}

export default function PatientOverview({
  upcomingCount,
  completedCount,
  availableDoctorsCount,
  totalFreeSlotsCount,
  nextAppointment,
}: PatientOverviewProps) {
  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  }, []);

  return (
    <section className="mb-6 w-full space-y-4">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-r from-white/90 via-[#DDF5E9]/50 to-[#F8DCE8]/40 p-5 shadow-sm backdrop-blur-xl md:p-6">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#B8E8D2]/40 to-[#F8DCE8]/40 blur-2xl"></div>

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#172B2A] sm:text-2xl">
                {greeting}, Arjun!
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-[#B8E8D2] bg-[#DDF5E9]/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#1B6A51]">
                <Sparkles className="h-3 w-3 text-[#299D78]" />
                Patient ID: P001
              </span>
            </div>
            <p className="mt-1 text-xs text-[#74827F] sm:text-sm">
              Your health journey, simplified. Multi-speciality appointment desk powered by AI.
            </p>
          </div>

          {/* Location & Date Pill */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-medium text-[#172B2A] shadow-2xs backdrop-blur-md">
              <Calendar className="h-3.5 w-3.5 text-[#299D78]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-medium text-[#74827F] shadow-2xs backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-[#D98EAE]" />
              <span>Chennai Clinic</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
        {/* Card 1: Upcoming Appointments */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-white/85 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#74827F]">Upcoming Visits</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DDF5E9] text-[#299D78] transition-transform group-hover:scale-105">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#172B2A]">
              {upcomingCount}
            </span>
            <span className="text-[11px] font-medium text-[#299D78]">
              {upcomingCount === 1 ? "Active booking" : "Active bookings"}
            </span>
          </div>
          <div className="mt-2 border-t border-slate-100/80 pt-2 text-[11px] text-[#74827F]">
            {nextAppointment ? (
              <p className="truncate">
                Next: <span className="font-semibold text-[#172B2A]">{nextAppointment.doctor_name}</span> ({nextAppointment.slot_date} · {nextAppointment.start_time})
              </p>
            ) : (
              <p>No upcoming visits scheduled</p>
            )}
          </div>
        </div>

        {/* Card 2: Completed Appointments */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-white/85 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#74827F]">Past Visits</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8DCE8] text-[#D98EAE] transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#172B2A]">
              {completedCount}
            </span>
            <span className="text-[11px] font-medium text-[#74827F]">
              Consultations completed
            </span>
          </div>
          <div className="mt-2 border-t border-slate-100/80 pt-2 text-[11px] text-[#74827F]">
            <p className="flex items-center gap-1 text-[#299D78]">
              <TrendingUp className="h-3 w-3" />
              <span>Full medical history synced</span>
            </p>
          </div>
        </div>

        {/* Card 3: Available Specialists */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/85 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-white/85 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#74827F]">Available Specialists</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8E8D2] to-[#DDF5E9] text-[#1B6A51] transition-transform group-hover:scale-105">
              <Stethoscope className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#172B2A]">
              {availableDoctorsCount}
            </span>
            <span className="text-[11px] font-medium text-[#299D78]">
              Across 8 departments
            </span>
          </div>
          <div className="mt-2 border-t border-slate-100/80 pt-2 text-[11px] text-[#74827F]">
            <p className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#299D78]" />
              <span>{totalFreeSlotsCount} open slots available</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
