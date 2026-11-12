"use client";

import { useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  RefreshCw,
  XCircle,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";

export type AppointmentData = {
  id: number;
  status: string;
  reason: string | null;
  doctor_name: string;
  department: string;
  room: string;
  slot_date: string;
  start_time: string;
};

interface AppointmentModalProps {
  appointment: AppointmentData | null;
  isOpen: boolean;
  onClose: () => void;
  onRescheduleWithAI?: (appointment: AppointmentData) => void;
  onCancelWithAI?: (appointment: AppointmentData) => void;
}

export default function AppointmentModal({
  appointment,
  isOpen,
  onClose,
  onRescheduleWithAI,
  onCancelWithAI,
}: AppointmentModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !appointment) return null;

  const isBooked = appointment.status === "booked";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl transition-all">
        {/* Header decoration */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-[#B8E8D2]/40 to-[#F8DCE8]/40 blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[#74827F] transition-colors hover:bg-slate-200 hover:text-[#172B2A]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8E8D2] to-[#DDF5E9] font-bold text-[#1B6A51] shadow-2xs">
            {appointment.doctor_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#172B2A]">
                {appointment.doctor_name}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                  appointment.status === "booked"
                    ? "bg-[#DDF5E9] text-[#1B6A51]"
                    : appointment.status === "cancelled"
                    ? "bg-[#FCEAF1] text-[#C2688E]"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <p className="text-xs text-[#74827F]">
              {appointment.department} · Appointment #{appointment.id}
            </p>
          </div>
        </div>

        {/* Appointment Key Facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-[#F7FAF9]/80 p-3.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#299D78] shadow-2xs">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#74827F]">Date</p>
              <p className="font-semibold text-[#172B2A]">{appointment.slot_date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#299D78] shadow-2xs">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#74827F]">Time</p>
              <p className="font-semibold text-[#172B2A]">{appointment.start_time} IST</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#D98EAE] shadow-2xs">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#74827F]">Clinic Location</p>
              <p className="font-semibold text-[#172B2A]">Room {appointment.room}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#D98EAE] shadow-2xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#74827F]">Department</p>
              <p className="font-semibold text-[#172B2A]">{appointment.department}</p>
            </div>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white/70 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-[#74827F]">
            <FileText className="h-3.5 w-3.5 text-[#299D78]" />
            <span>Reason for Visit</span>
          </div>
          <p className="mt-1 text-[#172B2A]">
            {appointment.reason ? appointment.reason : "General consultation & health follow-up."}
          </p>
        </div>

        {/* Patient Details */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-[11px] text-[#74827F]">
          <span>Patient: Arjun Mehta (ID: P001)</span>
          <span className="flex items-center gap-1 text-[#299D78]">
            <CheckCircle2 className="h-3 w-3" />
            Verified Record
          </span>
        </div>

        {/* Actions */}
        {isBooked && (
          <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => {
                onRescheduleWithAI?.(appointment);
                onClose();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#B8E8D2] bg-[#DDF5E9]/60 px-4 py-2.5 text-xs font-semibold text-[#1B6A51] transition-all hover:bg-[#DDF5E9] hover:shadow-2xs active:scale-98"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reschedule with AI</span>
            </button>

            <button
              onClick={() => {
                onCancelWithAI?.(appointment);
                onClose();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/70 px-4 py-2.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-98"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Cancel Appointment</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
