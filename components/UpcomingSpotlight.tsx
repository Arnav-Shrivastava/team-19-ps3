"use client";

import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  XCircle,
  FileText,
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { AppointmentData } from "./AppointmentModal";

interface UpcomingSpotlightProps {
  appointment: AppointmentData | null;
  onViewDetails: (appointment: AppointmentData) => void;
  onRescheduleWithAI: (appointment: AppointmentData) => void;
  onCancelWithAI: (appointment: AppointmentData) => void;
  onBookNewWithAI: () => void;
}

export default function UpcomingSpotlight({
  appointment,
  onViewDetails,
  onRescheduleWithAI,
  onCancelWithAI,
  onBookNewWithAI,
}: UpcomingSpotlightProps) {
  if (!appointment) {
    return (
      <section className="my-10 rounded-3xl border border-[#B6E9D1] bg-gradient-to-r from-[#D7F1E5]/70 via-[#FCFBF8] to-[#F9E8EF]/50 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#209B73] shadow-sm">
          <Calendar className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-editorial text-xl font-bold text-[#164D3C]">
          No Upcoming Appointments
        </h3>
        <p className="mt-1.5 max-w-md mx-auto text-xs text-[#75847F]">
          You have no active clinic visits scheduled. Use our AI booking assistant to find an open slot with a specialist today.
        </p>
        <button
          onClick={onBookNewWithAI}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#164D3C] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#209B73] active:scale-98"
        >
          <Sparkles className="h-4 w-4 text-[#B6E9D1]" />
          <span>Book an appointment with AI</span>
        </button>
      </section>
    );
  }

  // Parse date into day and month for typographic block
  const dateObj = new Date(appointment.slot_date);
  const dayNumber = appointment.slot_date.split("-")[2] || dateObj.getDate().toString();
  const monthName = dateObj.toLocaleDateString("en-IN", { month: "short" });
  const weekdayName = dateObj.toLocaleDateString("en-IN", { weekday: "long" });

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-[#B6E9D1] bg-gradient-to-br from-[#D7F1E5] via-[#FCFBF8] to-[#B6E9D1]/40 p-6 shadow-sm transition-all sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Typographic Date Block & Doctor Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Typographic Calendar Date Block */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/90 bg-white/90 p-4 shadow-sm backdrop-blur-md min-w-[90px] text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#209B73]">
              {monthName}
            </span>
            <span className="font-editorial text-3xl font-extrabold leading-tight text-[#164D3C]">
              {dayNumber}
            </span>
            <span className="text-[10px] font-medium text-[#75847F]">
              {weekdayName}
            </span>
          </div>

          {/* Doctor & Appointment Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#164D3C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Upcoming Consultation
              </span>
              <span className="rounded-full border border-[#B6E9D1] bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#164D3C]">
                #{appointment.id}
              </span>
            </div>

            <h2 className="font-editorial text-2xl font-extrabold tracking-tight text-[#164D3C]">
              {appointment.doctor_name}
            </h2>

            <p className="text-xs font-semibold text-[#209B73]">
              {appointment.department} · SRM Clinic Main Block
            </p>

            {/* Metadata Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1 font-semibold text-[#172D29]">
                <Clock className="h-3.5 w-3.5 text-[#209B73]" />
                {appointment.start_time} IST
              </span>

              <span className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1 font-semibold text-[#172D29]">
                <MapPin className="h-3.5 w-3.5 text-[#D879A1]" />
                Room {appointment.room}
              </span>

              {appointment.reason && (
                <span className="flex items-center gap-1.5 rounded-xl border border-[#F5D5E3] bg-[#F9E8EF]/80 px-3 py-1 font-medium text-[#164D3C]">
                  <FileText className="h-3.5 w-3.5 text-[#D879A1]" />
                  {appointment.reason}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 border-t border-[#164D3C]/10 pt-4 lg:border-t-0 lg:pt-0">
          <button
            onClick={() => onViewDetails(appointment)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-[#164D3C] shadow-2xs transition-all hover:bg-white active:scale-98"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#209B73]" />
          </button>

          <button
            onClick={() => onRescheduleWithAI(appointment)}
            className="flex items-center gap-1.5 rounded-xl bg-[#209B73] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#164D3C] active:scale-98"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reschedule</span>
          </button>

          <button
            onClick={() => onCancelWithAI(appointment)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 active:scale-98"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </section>
  );
}
