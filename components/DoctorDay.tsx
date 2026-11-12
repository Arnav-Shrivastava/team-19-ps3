"use client";

import { useEffect, useState } from "react";

type DoctorOption = {
  id: string;
  name: string;
};

type Appointment = {
  id: number;
  patient_name: string;
  start_time: string;
  reason: string | null;
  status: string;
};

const BADGE: Record<string, string> = {
  booked: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-slate-100 text-slate-700",
};

function todayKolkata(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/* Owner: Frontend member. Reads GET /api/doctor-day for a doctor and date. Reloads when refreshKey changes. */
export default function DoctorDay({ refreshKey }: { refreshKey: number }) {
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [date, setDate] = useState(todayKolkata);
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load doctors for dropdown
  useEffect(() => {
    let alive = true;
    async function loadDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load doctors");
        if (alive && Array.isArray(data.doctors)) {
          const list: DoctorOption[] = data.doctors.map((d: { id: string; name: string }) => ({
            id: d.id,
            name: d.name,
          }));
          setDoctors(list);
          setSelectedDoctorId((prev) => prev || (list[0]?.id ?? ""));
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Could not load doctors");
        }
      }
    }
    loadDoctors();
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  // Load appointments for selected doctor and date
  useEffect(() => {
    if (!selectedDoctorId || !date) return;
    let alive = true;
    setLoading(true);
    async function loadSchedule() {
      try {
        const params = new URLSearchParams({ doctor_id: selectedDoctorId, date });
        const res = await fetch(`/api/doctor-day?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load doctor's day schedule");
        if (alive) {
          setItems(Array.isArray(data.appointments) ? data.appointments : []);
          setError("");
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Could not load doctor's day schedule");
          setItems([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadSchedule();
    return () => {
      alive = false;
    };
  }, [selectedDoctorId, date, refreshKey]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="max-w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
        >
          {doctors.length === 0 && <option value="">Loading doctors...</option>}
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="max-w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
        />
      </div>

      <ul className="divide-y divide-slate-100">
        {error && <li className="p-4 text-sm text-red-600 break-words">{error}</li>}
        {!error && loading && <li className="p-4 text-sm text-slate-500">Loading appointments...</li>}
        {!error && !loading && items.length === 0 && (
          <li className="p-4 text-sm text-slate-500">No appointments booked for this day.</li>
        )}
        {!loading &&
          items.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-2 px-4 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-medium break-words">{a.patient_name}</p>
                <p className="text-xs text-slate-700">Time: {a.start_time}</p>
                {a.reason && <p className="text-xs text-slate-500 break-words">{a.reason}</p>}
                <p className="text-xs text-slate-400">Appointment #{a.id}</p>
              </div>
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-xs ${
                  BADGE[a.status] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {a.status}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

