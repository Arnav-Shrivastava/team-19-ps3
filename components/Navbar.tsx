"use client";

import { useState, useRef, useEffect } from "react";
import {
  HeartPulse,
  Bell,
  LogOut,
  Sparkles,
  ChevronDown,
  User,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface NavbarProps {
  onQuickBook?: () => void;
  unreadCount?: number;
}

export default function Navbar({ onQuickBook, unreadCount = 2 }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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
    <header className="sticky top-0 z-40 w-full px-3 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/85 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl transition-all">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8E8D2] via-[#DDF5E9] to-[#F8DCE8] p-0.5 shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white/85 backdrop-blur-sm">
              <HeartPulse className="h-5 w-5 text-[#299D78]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#299D78] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#299D78]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-[#172B2A]">
                CareSlot
              </span>
              <span className="hidden rounded-full border border-[#B8E8D2] bg-[#DDF5E9]/60 px-2 py-0.5 text-[10px] font-medium text-[#1B6A51] sm:inline-block">
                SaaS 2.0
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#74827F]">
              Intelligent Clinic Management
            </p>
          </div>
        </div>

        {/* Center Badge / Status */}
        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-3 py-1 text-xs text-[#74827F] shadow-2xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[#172B2A]">SRM Multi-Speciality Clinic</span>
            <span className="text-[#74827F]">· Chennai</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Book Button */}
          {onQuickBook && (
            <button
              onClick={onQuickBook}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#299D78] to-[#218364] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Book with AI</span>
              <span className="sm:hidden">Book</span>
            </button>
          )}

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-[#74827F] transition-all hover:bg-white hover:text-[#172B2A] hover:shadow-2xs"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D98EAE] px-1 text-[9px] font-bold text-white shadow-2xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="glass-dropdown absolute right-0 mt-2 w-80 rounded-2xl p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#172B2A]">
                      Clinic Notifications
                    </span>
                    <span className="rounded-full bg-[#DDF5E9] px-1.5 py-0.2 text-[10px] font-semibold text-[#1B6A51]">
                      {unreadCount} new
                    </span>
                  </div>
                  <span className="text-[10px] text-[#74827F]">Live updates</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 rounded-xl border border-[#DDF5E9] bg-[#F7FAF9]/80 p-2.5 transition-colors hover:bg-white">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#DDF5E9] text-[#299D78]">
                      <Calendar className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#172B2A]">
                        Upcoming Appointment
                      </p>
                      <p className="text-[11px] text-[#74827F]">
                        Dr. Kavitha Subramanian (General Medicine)
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[#299D78]">
                        <Clock className="h-3 w-3" />
                        <span>Mon–Sat slots 09:00 - 12:30</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white/70 p-2.5 transition-colors hover:bg-white">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F8DCE8] text-[#D98EAE]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#172B2A]">
                        CareSlot AI Online
                      </p>
                      <p className="text-[11px] text-[#74827F]">
                        Natural language booking, rescheduling & cancellation ready.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 border-t border-slate-100 pt-2 text-center">
                  <span className="text-[10px] text-[#74827F]">
                    All notifications synced with clinic database
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 p-1.5 transition-all hover:bg-white hover:shadow-2xs"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#B8E8D2] to-[#F8DCE8] text-xs font-semibold text-[#172B2A] shadow-2xs">
                AM
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-[#172B2A]">
                  Arjun Mehta
                </p>
                <p className="text-[10px] text-[#74827F]">P001 · Patient</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#74827F]" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="glass-dropdown absolute right-0 mt-2 w-64 rounded-2xl p-3 shadow-xl">
                <div className="border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8E8D2] to-[#F8DCE8] font-bold text-[#172B2A]">
                      AM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#172B2A]">Arjun Mehta</p>
                      <p className="text-[11px] text-[#74827F]">arjun.mehta@example.com</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#299D78]">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Patient ID: P001</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2 text-xs text-[#74827F]">
                  <div className="flex items-center justify-between py-1">
                    <span>City:</span>
                    <span className="font-medium text-[#172B2A]">Chennai</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Age:</span>
                    <span className="font-medium text-[#172B2A]">29 years</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Phone:</span>
                    <span className="font-medium text-[#172B2A]">98400 12345</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100/80"
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
