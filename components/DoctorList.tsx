"use client";

import { useEffect, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  languages: string[];
  room: string;
  free_slots: number;
};

/* Owner: Frontend member. Reads GET /api/doctors. */
export default function DoctorList({ refreshKey }: { refreshKey: number }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/doctors")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load doctors");
        setDoctors(data.doctors);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load doctors"));
  }, [refreshKey]);

  return (
    <ul className="divide-y divide-slate-100">
      {error && <li className="p-4 text-sm text-red-600">{error}</li>}
      {!error && doctors.length === 0 && <li className="p-4 text-sm text-slate-500">Loading doctors...</li>}
      {doctors.map((d) => (
        <li key={d.id} className="px-4 py-3 text-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-slate-500">
                {d.department} · {d.qualification} · {d.experience_years} yrs
              </p>
              <p className="text-xs text-slate-500">
                {d.languages.join(", ")} · Room {d.room}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium">Rs {d.consultation_fee}</p>
              <p className="text-xs text-slate-500">{d.free_slots} free slots</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
