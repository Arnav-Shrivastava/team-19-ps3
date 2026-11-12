"use client";

import { HeartPulse, MapPin, Phone, Mail, ShieldCheck, Sparkles, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[#164D3C] text-white">
      {/* Decorative botanical ambient lighting */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#209B73]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#B6E9D1]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Clinic Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D7F1E5] text-[#164D3C] shadow-sm">
                <HeartPulse className="h-6 w-6 text-[#209B73]" />
              </div>
              <span className="font-editorial text-2xl font-extrabold tracking-tight text-white">
                CareSlot
              </span>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-[#D7F1E5]/80">
              Intelligent Clinic Appointment Management platform for multi-speciality healthcare centers. Simplifying patient-doctor journeys through natural language agent workflows.
            </p>

            <div className="space-y-1.5 text-xs text-[#D7F1E5]/90 pt-1">
              <p className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#B6E9D1]" />
                <span>SRM Multi-Speciality Clinic · Main Block</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#B6E9D1]" />
                <span>GST Road, Kattankulathur, Chennai, Tamil Nadu 603203</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#B6E9D1]" />
                <span>Helpline: +91 44 2741 7000 (09:00 - 12:30 IST)</span>
              </p>
            </div>
          </div>

          {/* Specialities Quick Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B6E9D1]">
              Clinical Departments
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#D7F1E5]/80">
              <span>General Medicine</span>
              <span>Dermatology</span>
              <span>Pediatrics</span>
              <span>Orthopedics</span>
              <span>Cardiology</span>
              <span>ENT</span>
              <span>Ophthalmology</span>
              <span>Dental Care</span>
            </div>
          </div>

          {/* Safety & Compliance */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B6E9D1]">
              Clinical Safety
            </h4>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-relaxed text-[#D7F1E5]/85">
              <p className="flex items-center gap-1.5 font-bold text-white mb-1">
                <ShieldCheck className="h-4 w-4 text-[#B6E9D1]" />
                <span>Scheduling Agent Only</span>
              </p>
              CareSlot never diagnoses illnesses and never suggests medications. It securely routes symptoms and schedules clinic appointments with accredited physicians.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-[11px] text-[#D7F1E5]/60">
          <p>© {new Date().getFullYear()} CareSlot — SRM Agentic AI Hackathon. Team 19.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#B6E9D1]" />
            Powered by Next.js, Supabase & Gemini Function Calling
          </p>
        </div>
      </div>
    </footer>
  );
}
