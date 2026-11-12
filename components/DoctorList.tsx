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
  const [dept, setDept] = useState("All");

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

  // derive unique departments from the loaded data
  const departments = Array.from(new Set(doctors.map((d) => d.department)));
  const filtered = dept === "All" ? doctors : doctors.filter((d) => d.department === dept);

  return (
    <div>
      {/* department filter buttons */}
      {doctors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 px-3 py-2">
          {["All", ...departments].map((name) => (
            <button
              key={name}
              onClick={() => setDept(name)}
              className={`min-h-[32px] rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                dept === name
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <ul className="divide-y divide-slate-100">
        {error && <li className="p-4 text-sm text-red-600">{error}</li>}
        {!error && doctors.length === 0 && <li className="p-4 text-sm text-slate-500">Loading doctors...</li>}
        {!error && doctors.length > 0 && filtered.length === 0 && (
          <li className="p-4 text-sm text-slate-500">No doctors in this department.</li>
        )}
        {filtered.map((d) => (
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
                {d.free_slots > 0 ? (
                  <p className="text-xs text-slate-500">{d.free_slots} free slots</p>
                ) : (
                  <p className="text-xs text-slate-400">No free slots</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
