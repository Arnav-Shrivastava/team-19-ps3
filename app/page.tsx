"use client";

import { useState } from "react";
import AgentChat from "@/components/AgentChat";
import AppointmentList from "@/components/AppointmentList";
import DoctorList from "@/components/DoctorList";

/* HOME PAGE. Left: the agent chat. Right: tabs for My Appointments and Doctors. Owner: Frontend member. */
export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<"appointments" | "doctors">("appointments");

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const tabClass = (active: boolean) =>
    `flex-1 px-3 py-2 text-sm font-medium ${active ? "border-b-2 border-emerald-600 text-emerald-700" : "text-slate-500"}`;

  return (
    <main className="mx-auto max-w-6xl p-3 md:p-6">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">CareSlot · Clinic Appointment Agent</h1>
          <p className="text-sm text-slate-500">Book, move or cancel appointments in plain English. Patient: Arjun Mehta (P001)</p>
        </div>
        <button onClick={logout} className="shrink-0 text-sm text-slate-500 hover:text-slate-900">
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
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {tab === "appointments" ? <AppointmentList refreshKey={refreshKey} /> : <DoctorList refreshKey={refreshKey} />}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
