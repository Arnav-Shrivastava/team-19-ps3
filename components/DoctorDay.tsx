"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Stethoscope,
  Sparkles,
} from "lucide-react";

type DoctorOption = {
  id: string;
  name: string;
  department?: string;
};

type Appointment = {
  id: number;
  patient_name: string;
  start_time: string;
  reason: string | null;
  status: string;
};

const STANDARD_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
];

function todayKolkata(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

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
          const list: DoctorOption[] = data.doctors.map((d: { id: string; name: string; department?: string }) => ({
            id: d.id,
            name: d.name,
            department: d.department,
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
        if (!res.ok) throw new Error(data.error ?? "Could not load schedule");
        if (alive) {
          setItems(Array.isArray(data.appointments) ? data.appointments : []);
          setError("");
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Could not load schedule");
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

  const selectedDoctor = useMemo(() => {
    return doctors.find((d) => d.id === selectedDoctorId);
  }, [doctors, selectedDoctorId]);

  // Map schedule slots to standard times
  const timelineMap = useMemo(() => {
    const map = new Map<string, Appointment>();
    items.forEach((a) => {
      map.set(a.start_time, a);
    });
    return map;
  }, [items]);

  return (
    <div className="flex flex-col">
      {/* Schedule Header / Filter bar */}
      <div className="border-b border-slate-100 bg-white/40 p-3 sm:p-4 backdrop-blur-md">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Doctor selector */}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#74827F]">
              Select Doctor
            </label>
            <div className="relative">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full rounded-xl border border-white/90 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#172B2A] outline-none transition-all focus:border-[#299D78] focus:bg-white"
              >
                {doctors.length === 0 && <option value="">Loading doctors...</option>}
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.department ? `(${d.department})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date selector */}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#74827F]">
              Schedule Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/90 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#172B2A] outline-none transition-all focus:border-[#299D78] focus:bg-white"
            />
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-white/60 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#299D78]"></span>
            <span className="font-medium text-[#172B2A]">
              {selectedDoctor ? selectedDoctor.name : "Doctor"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#74827F]">
            <span>
              Booked: <strong className="text-[#172B2A]">{items.length}</strong> / 8 slots
            </span>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="p-3 sm:p-4">
        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-12 animate-pulse rounded-xl border border-white/80 bg-white/50"
              />
            ))}
          </div>
        )}

        {!loading && (
          <div className="relative space-y-2">
            {/* Timeline track line */}
            <div className="absolute bottom-4 left-6 top-4 w-0.5 bg-gradient-to-b from-[#B8E8D2] via-[#DDF5E9] to-[#F8DCE8] opacity-60"></div>

            {STANDARD_TIMES.map((time) => {
              const appt = timelineMap.get(time);
              const isBooked = !!appt;

              return (
                <div
                  key={time}
                  className={`relative flex items-center gap-3 rounded-2xl border p-2.5 transition-all ${
                    isBooked
                      ? "border-white/90 bg-white/90 shadow-2xs"
                      : "border-white/60 bg-white/40 hover:bg-white/60"
                  }`}
                >
                  {/* Timeline Time Pill */}
                  <div className="relative z-10 flex h-8 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DDF5E9] to-[#B8E8D2]/50 text-xs font-bold text-[#1B6A51] shadow-2xs">
                    {time}
                  </div>

                  {/* Slot Details */}
                  {isBooked ? (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate text-xs font-bold text-[#172B2A]">
                          {appt.patient_name}
                        </p>
                        <span className="rounded-full bg-[#DDF5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B6A51]">
                          {appt.status}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-[#74827F]">
                        {appt.reason ? appt.reason : "Consultation appointment"} · #{appt.id}
                      </p>
                    </div>
                  ) : (
                    <div className="flex min-w-0 flex-1 items-center justify-between text-xs text-[#74827F]">
                      <span className="italic">Available Slot</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#299D78]">
                        Open for Booking
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
