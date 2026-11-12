"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: number;
  status: string;
  reason: string | null;
  doctor_name: string;
  department: string;
  room: string;
  slot_date: string;
  start_time: string;
};

const BADGE: Record<string, string> = {
  booked: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-slate-100 text-slate-700",
};

/* Owner: Frontend member. Reads GET /api/appointments, reloads when refreshKey changes and every 5 seconds. */
export default function AppointmentList({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load appointments");
        if (alive) {
          setItems(data.appointments);
          setError("");
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Could not load appointments");
      }
    }
    load();
    const timer = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [refreshKey]);

  return (
    <ul className="divide-y divide-slate-100">
      {error && <li className="p-4 text-sm text-red-600">{error}</li>}
      {!error && items.length === 0 && <li className="p-4 text-sm text-slate-500">No appointments yet.</li>}
      {items.map((a) => (
        <li key={a.id} className="flex items-start justify-between gap-2 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="font-medium">{a.doctor_name}</p>
            <p className="text-xs text-slate-500">
              {a.department} · Room {a.room}
            </p>
            <p className="text-xs text-slate-700">
              {a.slot_date} at {a.start_time}
            </p>
            {a.reason && <p className="truncate text-xs text-slate-500">{a.reason}</p>}
            <p className="text-xs text-slate-400">Appointment #{a.id}</p>
          </div>
          <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${BADGE[a.status] ?? "bg-slate-100 text-slate-700"}`}>
            {a.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
