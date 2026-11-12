"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Stethoscope,
  Clock,
  Languages,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpDown,
  GraduationCap,
  Building2,
  AlertCircle,
} from "lucide-react";

export type Doctor = {
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

interface DoctorListProps {
  refreshKey: number;
  onRequestPrompt?: (prompt: string) => void;
  onDoctorsLoaded?: (doctors: Doctor[]) => void;
  initialDoctors?: Doctor[];
}

const SPECIALIZATION_KEYWORDS: Record<string, string[]> = {
  "General Medicine": [
    "general medicine",
    "general physician",
    "physician",
    "doctor",
    "internist",
    "fever",
    "cold",
    "cough",
    "body pain",
    "check-up",
    "family medicine",
    "gp",
    "general",
  ],
  "Dermatology": [
    "dermatology",
    "dermatologist",
    "skin",
    "acne",
    "rash",
    "itching",
    "hair",
    "hair fall",
    "derma",
    "nail",
    "allergy",
  ],
  "Pediatrics": [
    "pediatrics",
    "pediatrician",
    "paediatrics",
    "child",
    "children",
    "kids",
    "infant",
    "baby",
    "vaccination",
    "growth",
  ],
  "Orthopedics": [
    "orthopedics",
    "orthopedic",
    "orthopedist",
    "ortho",
    "bone",
    "joint",
    "joint pain",
    "knee",
    "back pain",
    "spine",
    "fracture",
    "neck pain",
    "sports injury",
  ],
  "Cardiology": [
    "cardiology",
    "cardiologist",
    "heart",
    "cardiac",
    "bp",
    "high bp",
    "chest pain",
    "chest discomfort",
    "palpitations",
    "hypertension",
  ],
  "ENT": [
    "ent",
    "ear",
    "nose",
    "throat",
    "sinus",
    "hearing",
    "sore throat",
    "blocked nose",
    "ear pain",
    "otolaryngologist",
  ],
  "Ophthalmology": [
    "ophthalmology",
    "ophthalmologist",
    "eye",
    "eyes",
    "vision",
    "spectacles",
    "glasses",
    "blurred vision",
    "red eye",
    "optics",
  ],
  "Dental": [
    "dental",
    "dentist",
    "teeth",
    "tooth",
    "tooth pain",
    "cavity",
    "gums",
    "gum bleeding",
    "braces",
    "oral",
    "cleaning",
  ],
};

export default function DoctorList({
  refreshKey,
  onRequestPrompt,
  onDoctorsLoaded,
  initialDoctors,
}: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors ?? []);
  const [loading, setLoading] = useState(!initialDoctors || initialDoctors.length === 0);
  const [error, setError] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"experience" | "fee" | "slots">("slots");

  useEffect(() => {
    if (initialDoctors && initialDoctors.length > 0 && refreshKey === 0) {
      setDoctors(initialDoctors);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/doctors")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load doctors");
        const list: Doctor[] = data.doctors ?? [];
        setDoctors(list);
        onDoctorsLoaded?.(list);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load doctors"))
      .finally(() => setLoading(false));
  }, [refreshKey, onDoctorsLoaded, initialDoctors]);

  // Derive unique departments
  const departments = useMemo(() => {
    return Array.from(new Set(doctors.map((d) => d.department)));
  }, [doctors]);

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((d) => {
        const matchesDept = selectedDept === "All" || d.department === selectedDept;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesDept;

        const docName = d.name.toLowerCase();
        const docDept = d.department.toLowerCase();
        const docQual = (d.qualification || "").toLowerCase();
        const docRoom = (d.room || "").toLowerCase();
        const docLangs = (d.languages || []).map((l) => l.toLowerCase());

        const matchesName = docName.includes(q);
        const matchesDepartment = docDept.includes(q);
        const matchesQualification = docQual.includes(q);
        const matchesRoom = docRoom.includes(q) || `room ${docRoom}`.includes(q);
        const matchesLanguage = docLangs.some((l) => l.includes(q));

        const keywords = SPECIALIZATION_KEYWORDS[d.department] || [];
        const matchesKeyword = keywords.some((kw) => kw.includes(q) || q.includes(kw));

        const matchesSearch =
          matchesName ||
          matchesDepartment ||
          matchesQualification ||
          matchesRoom ||
          matchesLanguage ||
          matchesKeyword;

        return matchesDept && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "slots") return b.free_slots - a.free_slots;
        if (sortBy === "experience") return b.experience_years - a.experience_years;
        if (sortBy === "fee") return a.consultation_fee - b.consultation_fee;
        return 0;
      });
  }, [doctors, selectedDept, searchQuery, sortBy]);

  return (
    <div className="flex flex-col">
      {/* Header Controls: Search, Sort & Department Pills */}
      <div className="border-b border-slate-100 bg-white/40 p-3 sm:p-4 backdrop-blur-md">
        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#74827F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor, specialty, language..."
              className="w-full rounded-xl border border-white/90 bg-white/80 py-1.5 pl-8 pr-3 text-xs text-[#172B2A] placeholder-[#74827F] outline-none transition-all focus:border-[#299D78] focus:bg-white"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "experience" | "fee" | "slots")}
              className="rounded-xl border border-white/90 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-[#74827F] outline-none transition-all focus:border-[#299D78]"
            >
              <option value="slots">Most Free Slots</option>
              <option value="experience">Most Experienced</option>
              <option value="fee">Lowest Fee</option>
            </select>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {["All", ...departments].map((dept) => {
            const count = dept === "All" ? doctors.length : doctors.filter((d) => d.department === dept).length;
            const active = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-[#172B2A] text-white shadow-2xs"
                    : "bg-white/70 text-[#74827F] hover:bg-white hover:text-[#172B2A]"
                }`}
              >
                {dept} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Feed */}
      <div className="divide-y divide-slate-100/80 p-2 sm:p-3">
        {/* Error State */}
        {error && (
          <div className="m-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && doctors.length === 0 && (
          <div className="space-y-3 p-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-white/80 bg-white/60 p-4 shadow-2xs"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-36 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="mt-2 h-3 w-48 rounded bg-slate-100" />
                <div className="mt-3 flex gap-2">
                  <div className="h-3 w-20 rounded bg-slate-100" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoctors.length === 0 && (
          <div className="py-10 text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF5E9] text-[#299D78]">
              <Stethoscope className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-[#172B2A]">No specialists found</p>
            <p className="mt-1 text-[11px] text-[#74827F]">
              Try searching with another name, department, or specialization.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("All");
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#B6E9D1] bg-[#D7F1E5] px-3.5 py-1.5 text-xs font-bold text-[#164D3C] hover:bg-[#B6E9D1] transition-all"
            >
              Clear search & show all doctors
            </button>
          </div>
        )}

        {/* Doctor Cards */}
        {!loading &&
          filteredDoctors.map((d) => (
            <div
              key={d.id}
              className="group my-1.5 rounded-2xl border border-white/85 bg-white/70 p-3.5 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white hover:shadow-sm"
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8E8D2] to-[#F8DCE8] text-xs font-bold text-[#172B2A] shadow-2xs">
                    {d.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] group-hover:text-[#299D78]">
                      {d.name}
                    </h4>
                    <p className="text-[11px] font-medium text-[#74827F]">
                      {d.department} · {d.qualification}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#172B2A]">
                    ₹{d.consultation_fee}
                  </span>
                  <p className="text-[10px] text-[#74827F]">Consultation</p>
                </div>
              </div>

              {/* Details & Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#172B2A] border border-slate-100">
                  <GraduationCap className="h-3 w-3 text-[#299D78]" />
                  {d.experience_years} yrs exp
                </span>

                <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#74827F] border border-slate-100">
                  <MapPin className="h-3 w-3 text-[#D98EAE]" />
                  Room {d.room}
                </span>

                <span className="flex items-center gap-1 rounded-lg bg-[#F7FAF9] px-2 py-0.5 font-medium text-[#74827F] border border-slate-100">
                  <Languages className="h-3 w-3 text-[#74827F]" />
                  {d.languages.join(", ")}
                </span>
              </div>

              {/* Footer: Free Slots + Book Action */}
              <div className="mt-3.5 flex items-center justify-between border-t border-slate-100/80 pt-2.5">
                <div>
                  {d.free_slots > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B6A51]">
                      <Clock className="h-3 w-3 text-[#299D78]" />
                      {d.free_slots} free slots
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      No free slots
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    onRequestPrompt?.(
                      `I would like to book an appointment with ${d.name} (${d.department}) in Room ${d.room}. What slots are free?`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#299D78] to-[#218364] px-3 py-1.5 text-[11px] font-semibold text-white shadow-2xs transition-all hover:opacity-95 hover:shadow-sm active:scale-95"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Book with AI</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
