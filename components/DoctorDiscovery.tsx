"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Stethoscope,
  Clock,
  MapPin,
  Languages,
  Sparkles,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import type { Doctor } from "./DoctorList";

interface DoctorDiscoveryProps {
  doctors: Doctor[];
  loading: boolean;
  onBookWithDoctor: (doctor: Doctor) => void;
}

const DOCTOR_PHOTOS: Record<string, string> = {
  DR01: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350",
  DR02: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350",
  DR03: "https://images.unsplash.com/photo-1594824813504-4696a4b1fc78?auto=format&fit=crop&q=80&w=350",
  DR04: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=350",
  DR05: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=350",
  DR06: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=350",
  DR07: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=350",
  DR08: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=350",
  DR09: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=350",
  DR10: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=350",
  DR11: "https://images.unsplash.com/photo-1594824813715-06079c5c96b7?auto=format&fit=crop&q=80&w=350",
  DR12: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?auto=format&fit=crop&q=80&w=350",
  DR13: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=350",
  DR14: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=350",
  DR15: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=350",
};

export default function DoctorDiscovery({
  doctors,
  loading,
  onBookWithDoctor,
}: DoctorDiscoveryProps) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const departments = useMemo(() => {
    return Array.from(new Set(doctors.map((d) => d.department)));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchesDept = selectedDept === "All" || d.department === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.languages.some((l) => l.toLowerCase().includes(q));
      return matchesDept && matchesSearch;
    });
  }, [doctors, selectedDept, searchQuery]);

  return (
    <section className="my-14" id="doctors">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#209B73]">
            Expert Clinical Team
          </span>
          <h2 className="mt-1 font-editorial text-3xl font-extrabold tracking-tight text-[#164D3C] sm:text-4xl">
            Care from specialists you can trust.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#75847F]">
            Find the right expertise for your healthcare needs across all 8 multi-speciality wings.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#75847F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, dept, language..."
            className="w-full rounded-2xl border border-slate-200/90 bg-white/90 py-2.5 pl-10 pr-4 text-xs font-medium text-[#172D29] placeholder-[#75847F] shadow-2xs outline-none transition-all focus:border-[#209B73] focus:bg-white"
          />
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-6">
        {["All", ...departments].map((dept) => {
          const count = dept === "All" ? doctors.length : doctors.filter((d) => d.department === dept).length;
          const active = selectedDept === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                active
                  ? "bg-[#164D3C] text-white shadow-2xs"
                  : "border border-slate-200/80 bg-white/80 text-[#75847F] hover:bg-white hover:text-[#172D29]"
              }`}
            >
              {dept} <span className="opacity-70 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Doctors Grid with Real Photos & Diverse Touches */}
      {loading && doctors.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-72 animate-pulse rounded-3xl border border-slate-200/80 bg-white/60 p-6"
            />
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-12 text-center">
          <Stethoscope className="mx-auto h-8 w-8 text-[#209B73]" />
          <p className="mt-2 text-sm font-bold text-[#164D3C]">No specialists found</p>
          <p className="mt-1 text-xs text-[#75847F]">Try clearing the search query or selecting "All".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc, idx) => {
            const photoUrl = DOCTOR_PHOTOS[doc.id];
            // Alternating accent pill colors for high design aesthetic
            const accentBorder =
              idx % 3 === 0
                ? "hover:border-[#B6E9D1]"
                : idx % 3 === 1
                ? "hover:border-[#F5D5E3]"
                : "hover:border-[#D7F1E5]";

            return (
              <div
                key={doc.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accentBorder}`}
              >
                <div>
                  {/* Doctor Image & Availability Tag */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#D7F1E5] to-[#F9E8EF] shadow-sm">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={doc.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-editorial text-lg font-bold text-[#164D3C]">
                          {doc.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-editorial text-lg font-extrabold text-[#164D3C]">
                        ₹{doc.consultation_fee}
                      </span>
                      <p className="text-[10px] font-semibold text-[#75847F]">Per consult</p>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-[#D7F1E5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#164D3C]">
                      {doc.department}
                    </span>
                    <h3 className="mt-1.5 font-editorial text-base font-extrabold text-[#172D29] group-hover:text-[#209B73] transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#75847F]">
                      {doc.qualification}
                    </p>
                  </div>

                  {/* Meta details */}
                  <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-[#75847F]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <GraduationCap className="h-3.5 w-3.5 text-[#209B73]" />
                        Experience:
                      </span>
                      <span className="font-bold text-[#172D29] text-[11px]">{doc.experience_years} years</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-[#D879A1]" />
                        Location:
                      </span>
                      <span className="font-bold text-[#172D29] text-[11px]">Room {doc.room}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Languages className="h-3.5 w-3.5 text-[#75847F]" />
                        Languages:
                      </span>
                      <span className="font-medium text-[#172D29] text-[11px] truncate max-w-[130px]">
                        {doc.languages.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Free Slots + Book Button */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100/90 pt-3.5">
                  <div>
                    {doc.free_slots > 0 ? (
                      <span className="flex items-center gap-1 rounded-full bg-[#D7F1E5] px-2.5 py-0.5 text-[10px] font-bold text-[#164D3C]">
                        <Clock className="h-3 w-3 text-[#209B73]" />
                        {doc.free_slots} free slots
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        No open slots
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onBookWithDoctor(doc)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#164D3C] px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[#209B73] active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#B6E9D1]" />
                    <span>Book with AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
