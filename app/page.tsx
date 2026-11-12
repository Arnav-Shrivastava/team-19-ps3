"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import AppointmentList from "@/components/AppointmentList";
import DoctorList from "@/components/DoctorList";
import DoctorDay from "@/components/DoctorDay";

/* HOME PAGE. Left: the agent chat. Right: tabs for My Appointments, Doctors, and Doctor's day. Owner: Frontend member. */
export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<"appointments" | "doctors" | "doctor-day">("appointments");

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const tabClass = (active: boolean) =>
    `flex-1 px-2 py-2 text-xs sm:px-3 sm:text-sm font-medium text-center transition-colors ${
      active ? "border-b-2 border-emerald-600 text-emerald-700" : "text-slate-500 hover:text-slate-700"
    }`;

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-semibold break-words">CareSlot · Clinic Appointment Agent</h1>
          <p className="text-xs sm:text-sm text-slate-500 break-words">Book, move or cancel appointments in plain English. Patient: Arjun Mehta (P001)</p>
        </div>
        <button onClick={logout} className="shrink-0 text-xs sm:text-sm text-slate-500 hover:text-slate-900">
          Log out
        </button>
      </header>
      <div className="grid gap-4 md:grid-cols-5">
        <section className="md:col-span-3">
          <AgentChat onDataChanged={() => setRefreshKey((k) => k + 1)} />
        </section>
        <section className="md:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex border-b border-slate-200">
              <button className={tabClass(tab === "appointments")} onClick={() => setTab("appointments")}>
                My Appointments
              </button>
              <button className={tabClass(tab === "doctors")} onClick={() => setTab("doctors")}>
                Doctors
              </button>
              <button className={tabClass(tab === "doctor-day")} onClick={() => setTab("doctor-day")}>
                {"Doctor's day"}
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {tab === "appointments" ? (
                <AppointmentList refreshKey={refreshKey} />
              ) : tab === "doctors" ? (
                <DoctorList refreshKey={refreshKey} />
              ) : (
                <DoctorDay refreshKey={refreshKey} />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
