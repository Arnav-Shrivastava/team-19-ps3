"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Clock,
  LayoutGrid,
  FileText,
} from "lucide-react";
import AppointmentList, { type Appointment } from "./AppointmentList";
import DoctorList, { type Doctor } from "./DoctorList";
import DoctorDay from "./DoctorDay";
import type { AppointmentData } from "./AppointmentModal";

interface AppointmentManagementProps {
  refreshKey: number;
  onRequestPrompt: (prompt: string) => void;
  onSelectAppointment: (appointment: AppointmentData) => void;
  onAppointmentsLoaded?: (appointments: Appointment[]) => void;
  onDoctorsLoaded?: (doctors: Doctor[]) => void;
  upcomingCount?: number;
}

export default function AppointmentManagement({
  refreshKey,
  onRequestPrompt,
  onSelectAppointment,
  onAppointmentsLoaded,
  onDoctorsLoaded,
  upcomingCount = 0,
}: AppointmentManagementProps) {
  const [activeTab, setActiveTab] = useState<"appointments" | "doctors" | "doctor-day">("appointments");

  return (
    <section className="my-14" id="management">
      {/* Section Header */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#209B73]">
          Records & Timelines
        </span>
        <h2 className="mt-1 font-editorial text-3xl font-extrabold tracking-tight text-[#164D3C] sm:text-4xl">
          Clinic appointment management.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#75847F]">
          Review your personal consultations, browse the doctor directory, or inspect daily clinic schedules.
        </p>
      </div>

      {/* Tabs Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-xl">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap border-b border-slate-200/80 bg-[#FCFBF8] p-2.5">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
              activeTab === "appointments"
                ? "bg-[#164D3C] text-white shadow-2xs"
                : "text-[#75847F] hover:bg-white hover:text-[#172D29]"
            }`}
          >
            <Calendar className="h-4 w-4 text-[#B6E9D1]" />
            <span>My Visits</span>
            {upcomingCount > 0 && (
              <span className={`ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${activeTab === "appointments" ? "bg-white/20 text-white" : "bg-[#D7F1E5] text-[#164D3C]"}`}>
                {upcomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
              activeTab === "doctors"
                ? "bg-[#164D3C] text-white shadow-2xs"
                : "text-[#75847F] hover:bg-white hover:text-[#172D29]"
            }`}
          >
            <Users className="h-4 w-4 text-[#D879A1]" />
            <span>Doctors Directory</span>
          </button>

          <button
            onClick={() => setActiveTab("doctor-day")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
              activeTab === "doctor-day"
                ? "bg-[#164D3C] text-white shadow-2xs"
                : "text-[#75847F] hover:bg-white hover:text-[#172D29]"
            }`}
          >
            <Clock className="h-4 w-4 text-[#209B73]" />
            <span>Doctor's Daily Schedule</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-2 sm:p-4">
          {activeTab === "appointments" ? (
            <AppointmentList
              refreshKey={refreshKey}
              onRequestPrompt={onRequestPrompt}
              onSelectAppointment={onSelectAppointment}
              onAppointmentsLoaded={onAppointmentsLoaded}
            />
          ) : activeTab === "doctors" ? (
            <DoctorList
              refreshKey={refreshKey}
              onRequestPrompt={onRequestPrompt}
              onDoctorsLoaded={onDoctorsLoaded}
            />
          ) : (
            <DoctorDay refreshKey={refreshKey} />
          )}
        </div>
      </div>
    </section>
  );
}
