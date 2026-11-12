"use client";

import { useState, useRef, useEffect } from "react";
import {
  HeartPulse,
  Bell,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Building2,
  MapPin,
} from "lucide-react";

interface HeaderProps {
  upcomingCount?: number;
}

export default function Header({ upcomingCount = 0 }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/70 bg-[#FCFBF8]/85 px-4 py-2.5 backdrop-blur-md transition-all sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6E9D1] via-[#D7F1E5] to-[#F5D5E3] p-0.5 shadow-2xs">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
              <HeartPulse className="h-4 w-4 text-[#209B73]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-base font-bold text-[#164D3C]">
                CareSlot
              </span>
              <span className="hidden rounded-full border border-[#D7F1E5] bg-[#D7F1E5]/70 px-2 py-0.5 text-[10px] font-semibold text-[#164D3C] md:inline-block">
                Clinic SaaS
              </span>
            </div>
            <p className="text-[11px] text-[#75847F]">Intelligent Clinic Management</p>
          </div>
        </div>

        {/* Center: Clinic Location Info */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs text-[#75847F] shadow-2xs md:flex">
          <Building2 className="h-3.5 w-3.5 text-[#209B73]" />
          <span className="font-semibold text-[#172D29]">SRM Multi-Speciality Clinic</span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-[#75847F]">
            <MapPin className="h-3 w-3 text-[#D879A1]" /> Chennai, India
          </span>
        </div>

        {/* Right: Notifications & Profile (NO "Book with AI" button as requested) */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-[#75847F] transition-all hover:bg-white hover:text-[#172D29] hover:shadow-2xs"
              aria-label="Clinic notifications"
            >
              <Bell className="h-4 w-4" />
              {upcomingCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D879A1] px-1 text-[9px] font-bold text-white shadow-2xs">
                  {upcomingCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl">
                <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-[#172D29]">Notifications</span>
                  <span className="rounded-full bg-[#D7F1E5] px-2 py-0.5 text-[10px] font-bold text-[#164D3C]">
                    Live updates
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 rounded-xl border border-[#D7F1E5] bg-[#FCFBF8] p-2.5">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#209B73]" />
                    <div className="text-xs">
                      <p className="font-bold text-[#172D29]">Upcoming Consultation</p>
                      <p className="text-[11px] text-[#75847F]">
                        Dr. Kavitha Subramanian (General Medicine)
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#209B73]">
                        <Clock className="h-3 w-3" /> Clinic operating: 09:00 - 12:30 IST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-[#FCFBF8] p-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D879A1]" />
                    <div className="text-xs">
                      <p className="font-bold text-[#172D29]">AI Assistant Ready</p>
                      <p className="text-[11px] text-[#75847F]">
                        Natural language booking, rescheduling and doctor search ready.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-1.5 transition-all hover:bg-white hover:shadow-2xs"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#B6E9D1] to-[#F5D5E3] text-xs font-bold text-[#164D3C]">
                AM
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-none text-[#172D29]">Arjun Mehta</p>
                <p className="text-[10px] text-[#75847F]">ID: P001</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#75847F]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6E9D1] to-[#F5D5E3] font-bold text-[#164D3C]">
                      AM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172D29]">Arjun Mehta</p>
                      <p className="text-[11px] text-[#75847F]">Chennai · 29 yrs</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#209B73]">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified Patient (P001)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2 text-xs text-[#75847F]">
                  <div className="flex items-center justify-between py-1">
                    <span>Phone:</span>
                    <span className="font-semibold text-[#172D29]">98400 12345</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Clinic:</span>
                    <span className="font-semibold text-[#172D29]">SRM Block A</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/70 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
