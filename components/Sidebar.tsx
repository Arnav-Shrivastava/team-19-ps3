"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  LayoutDashboard,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  X,
  Menu,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAI: () => void;
  upcomingCount?: number;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  onOpenAI,
  upcomingCount = 0,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "hero", label: "Overview", icon: LayoutDashboard },
    { id: "spotlight", label: "My Appointments", icon: Calendar, badge: upcomingCount > 0 ? upcomingCount : undefined },
    { id: "doctors", label: "Find Doctors", icon: Users },
    { id: "schedule", label: "Doctor's Schedule", icon: Clock },
    { id: "management", label: "Clinic Directory", icon: FileText },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-5">
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pb-6 pt-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6E9D1] via-[#D7F1E5] to-[#F5D5E3] p-0.5 shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
              <HeartPulse className="h-5 w-5 text-[#209B73]" />
            </div>
          </div>
          <div>
            <span className="font-editorial text-lg font-extrabold tracking-tight text-[#164D3C]">
              CareSlot
            </span>
            <p className="text-[10px] font-medium tracking-wide text-[#75847F]">
              Intelligent Clinic Platform
            </p>
          </div>
        </div>

        {/* PROMINENT BOOK WITH AI ACTION */}
        <div className="my-4">
          <button
            onClick={() => {
              onOpenAI();
              setMobileOpen(false);
            }}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#164D3C] via-[#209B73] to-[#32B58B] p-4 text-left text-white shadow-lg shadow-[#209B73]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#209B73]/30 active:scale-[0.98]"
          >
            {/* Ambient light glow inside button */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/20 blur-xl transition-transform group-hover:scale-150" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-[#B6E9D1] transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide uppercase text-[#B6E9D1]">
                  AI Scheduling
                </p>
                <p className="text-sm font-extrabold text-white">Book with AI</p>
              </div>
            </div>

            <ChevronRight className="relative z-10 h-5 w-5 text-[#B6E9D1] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#75847F]">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#D7F1E5] text-[#164D3C] font-bold shadow-2xs"
                    : "text-[#75847F] hover:bg-slate-100/80 hover:text-[#172D29]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${active ? "text-[#209B73]" : "text-[#75847F]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#164D3C] px-1.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="border-t border-slate-200/80 pt-4">
        {/* Patient Profile Card */}
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6E9D1] to-[#F5D5E3] font-bold text-[#164D3C]">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#172D29]">Arjun Mehta</p>
            <div className="flex items-center gap-1 text-[10px] font-medium text-[#209B73]">
              <ShieldCheck className="h-3 w-3" />
              <span>Patient ID: P001</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r border-slate-200/70 bg-[#FCFBF8]/95 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Trigger Bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-[#FCFBF8]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#172D29]"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-editorial text-base font-extrabold text-[#164D3C]">CareSlot</span>
        </div>

        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 rounded-xl bg-[#164D3C] px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#B6E9D1]" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#FCFBF8] shadow-2xl">
            <div className="absolute right-3 top-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[#75847F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
