"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  XCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import type { AppointmentData } from "./AppointmentModal";

export type Appointment = AppointmentData;

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  booked: {
    label: "Booked",
    badgeClass: "bg-[#DDF5E9] text-[#1B6A51] border border-[#B8E8D2]",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-[#FCEAF1] text-[#C2688E] border border-[#F8DCE8]",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-100",
    icon: CheckCircle2,
  },
};

interface AppointmentListProps {
  refreshKey: number;
  onSelectAppointment?: (appointment: Appointment) => void;
  onRequestPrompt?: (prompt: string) => void;
  onAppointmentsLoaded?: (appointments: Appointment[]) => void;
}

export default function AppointmentList({
  refreshKey,
  onSelectAppointment,
  onRequestPrompt,
  onAppointmentsLoaded,
}: AppointmentListProps) {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "booked" | "cancelled" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load appointments");
        if (alive) {
          const list: Appointment[] = data.appointments ?? [];
          setItems(list);
          onAppointmentsLoaded?.(list);
          setError("");
        }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Could not load appointments");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [refreshKey, onAppointmentsLoaded]);

  // Filter items by status and search query
  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.doctor_name.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        (a.reason && a.reason.toLowerCase().includes(q)) ||
        a.id.toString().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* Search & Filter Header */}
      <div className="border-b border-slate-100 bg-white/40 p-3 sm:p-4 backdrop-blur-md">
        {/* Search Bar */}
        <div className="relative mb-2.5">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#74827F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor, department or reason..."
            className="w-full rounded-xl border border-white/90 bg-white/80 py-1.5 pl-8 pr-3 text-xs text-[#172B2A] placeholder-[#74827F] outline-none transition-all focus:border-[#299D78] focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1">
          {(["all", "booked", "completed", "cancelled"] as const).map((s) => {
            const count = s === "all" ? items.length : items.filter((x) => x.status === s).length;
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-[#172B2A] text-white shadow-2xs"
                    : "bg-white/70 text-[#74827F] hover:bg-white hover:text-[#172B2A]"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}{" "}
                <span className={`ml-0.5 opacity-70 ${active ? "text-slate-200" : ""}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List Container */}
      <div className="divide-y divide-slate-100/80 p-2 sm:p-3">
        {/* Error State */}
        {error && (
          <div className="m-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && items.length === 0 && (
          <div className="space-y-3 p-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-white/80 bg-white/60 p-3.5 shadow-2xs"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-14 rounded-full bg-slate-200" />
                </div>
                <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
                <div className="mt-3 flex gap-2">
                  <div className="h-3 w-20 rounded bg-slate-100" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-10 text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF5E9] text-[#299D78]">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-[#172B2A]">No appointments found</p>
            <p className="mt-1 text-[11px] text-[#74827F]">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search filter."
                : "Ask CareSlot AI on the left to book your first appointment."}
            </p>
          </div>
        )}

        {/* Appointment Cards */}
        {!loading &&
          filtered.map((a) => {
            const statusCfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.booked;
            const isBooked = a.status === "booked";

            return (
              <div
                key={a.id}
                className="group my-1.5 rounded-2xl border border-white/85 bg-white/70 p-3.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white hover:shadow-sm"
              >
                {/* Top Row: Doctor info + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8E8D2] to-[#DDF5E9] text-xs font-bold text-[#1B6A51] shadow-2xs">
                      {a.doctor_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#172B2A] group-hover:text-[#299D78]">
                        {a.doctor_name}
                      </h4>
                      <p className="text-[11px] text-[#74827F]">{a.department}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCfg.badgeClass}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Metadata Pills: Date, Time, Room */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#172B2A] border border-slate-100">
                    <Calendar className="h-3 w-3 text-[#299D78]" />
                    {a.slot_date}
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#172B2A] border border-slate-100">
                    <Clock className="h-3 w-3 text-[#299D78]" />
                    {a.start_time} IST
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#74827F] border border-slate-100">
                    <MapPin className="h-3 w-3 text-[#D98EAE]" />
                    Room {a.room}
                  </span>
                  <span className="ml-auto text-[10px] font-semibold text-[#74827F]">
                    #{a.id}
                  </span>
                </div>

                {/* Reason (if given) */}
                {a.reason && (
                  <p className="mt-2 truncate rounded-lg bg-[#FDF4F8] px-2 py-1 text-[11px] text-[#C2688E]">
                    <span className="font-semibold">Reason:</span> {a.reason}
                  </p>
                )}

                {/* Card Action Buttons */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100/80 pt-2 text-xs">
                  <button
                    onClick={() => onSelectAppointment?.(a)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#299D78] transition-colors hover:text-[#1B6A51]"
                  >
                    <span>View details</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>

                  {isBooked && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onRequestPrompt?.(
                            `Reschedule my appointment #${a.id} with ${a.doctor_name} to the next available free slot.`
                          )
                        }
                        className="flex items-center gap-1 rounded-lg border border-[#B8E8D2] bg-[#DDF5E9]/60 px-2 py-1 text-[10px] font-semibold text-[#1B6A51] transition-colors hover:bg-[#DDF5E9]"
                        title="Ask AI to reschedule this appointment"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel appointment #${a.id} with ${a.doctor_name}?`)) {
                            onRequestPrompt?.(`Cancel my appointment #${a.id}`);
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50/70 px-2 py-1 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100"
                        title="Cancel this appointment"
                      >
                        <XCircle className="h-3 w-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
