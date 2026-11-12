"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import FallingLeaves from "@/components/FallingLeaves";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import UpcomingSpotlight from "@/components/UpcomingSpotlight";
import DoctorDiscovery from "@/components/DoctorDiscovery";
import DedicatedAIAssistant from "@/components/DedicatedAIAssistant";
import AppointmentManagement from "@/components/AppointmentManagement";
import Footer from "@/components/Footer";
import AppointmentModal, { type AppointmentData } from "@/components/AppointmentModal";
import Toast, { type ToastMessage } from "@/components/Toast";
import type { Appointment } from "@/components/AppointmentList";
import type { Doctor } from "@/components/DoctorList";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  // Real data synced from child components
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState("");

  const fetchDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorsError("");
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load doctors");
      setDoctors(data.doctors ?? []);
    } catch (err) {
      setDoctorsError(err instanceof Error ? err.message : "Could not load doctors");
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors, refreshKey]);

  // Selected appointment for detail modal
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // External prompt passed from UI actions to DedicatedAIAssistant
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: "success" | "error" | "info", text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Compute metrics from real Supabase data
  const upcomingAppointments = useMemo(() => {
    return appointments.filter((a) => a.status === "booked");
  }, [appointments]);

  const completedCount = useMemo(() => {
    return appointments.filter((a) => a.status === "completed").length;
  }, [appointments]);

  const totalFreeSlotsCount = useMemo(() => {
    return doctors.reduce((acc, d) => acc + (d.free_slots || 0), 0);
  }, [doctors]);

  // Featured appointment is the earliest booked one
  const featuredAppointment = useMemo(() => {
    return upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  }, [upcomingAppointments]);

  // Handler when data is modified by AI write tools
  const handleDataChanged = useCallback(() => {
    setRefreshKey((k) => k + 1);
    addToast("success", "Clinic appointments synchronized with live database");
  }, [addToast]);

  // Smooth scroll to target section
  const handleNavigate = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Trigger prompt in AI Assistant and scroll to it
  const handleTriggerAIPrompt = useCallback(
    (promptText: string) => {
      setExternalPrompt(promptText);
      handleNavigate("ai-assistant");
      addToast("info", "Prompt delivered to CareSlot AI Assistant");
    },
    [handleNavigate, addToast]
  );

  return (
    <div className="relative min-h-screen bg-[#FCFBF8]">
      {/* Background Falling Leaves Animation */}
      <FallingLeaves />

      {/* Primary Left Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAI={() => handleNavigate("ai-assistant")}
        upcomingCount={upcomingAppointments.length}
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex min-h-screen flex-col">
        {/* Slim Top Header */}
        <Header upcomingCount={upcomingAppointments.length} />

        {/* Scrollable Editorial Main Content */}
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-8 py-8 space-y-12">
          {/* Section 1: Hero Section */}
          <div id="hero">
            <HeroSection
              onExploreAppointments={() => handleNavigate("management")}
              onMeetSpecialists={() => handleNavigate("doctors")}
            />
          </div>

          {/* Section 2: Visually Distinct Statistics Panels */}
          <div id="stats">
            <StatsSection
              upcomingCount={upcomingAppointments.length}
              completedCount={completedCount}
              availableDoctorsCount={doctors.length || 15}
              totalFreeSlotsCount={totalFreeSlotsCount}
            />
          </div>

          {/* Section 3: Upcoming Appointment Spotlight */}
          <div id="spotlight">
            <UpcomingSpotlight
              appointment={featuredAppointment}
              onViewDetails={(appt) => {
                setSelectedAppointment(appt);
                setModalOpen(true);
              }}
              onRescheduleWithAI={(appt) => {
                handleTriggerAIPrompt(
                  `Reschedule my appointment #${appt.id} with ${appt.doctor_name} to the next available free slot.`
                );
              }}
              onCancelWithAI={(appt) => {
                if (confirm(`Cancel your appointment #${appt.id} with ${appt.doctor_name}?`)) {
                  handleTriggerAIPrompt(`Cancel my appointment #${appt.id}`);
                }
              }}
              onBookNewWithAI={() => {
                handleTriggerAIPrompt(
                  "I would like to book a new appointment. What departments and specialists are available?"
                );
              }}
            />
          </div>

          {/* Section 4: Doctor Discovery Section */}
          <DoctorDiscovery
            doctors={doctors}
            loading={doctorsLoading}
            error={doctorsError}
            onRetry={fetchDoctors}
            onBookWithDoctor={(doc) => {
              handleTriggerAIPrompt(
                `I would like to book an appointment with ${doc.name} (${doc.department}) in Room ${doc.room}. What slots are free?`
              );
            }}
          />

          {/* Section 5: Dedicated Full-Width AI Appointment Assistant */}
          <DedicatedAIAssistant
            onDataChanged={handleDataChanged}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(null)}
          />

          {/* Section 6: Clinic Appointment Management & Timeline */}
          <div id="schedule">
            <AppointmentManagement
              refreshKey={refreshKey}
              onRequestPrompt={handleTriggerAIPrompt}
              onSelectAppointment={(appt) => {
                setSelectedAppointment(appt);
                setModalOpen(true);
              }}
              onAppointmentsLoaded={setAppointments}
              onDoctorsLoaded={setDoctors}
              doctors={doctors}
              upcomingCount={upcomingAppointments.length}
            />
          </div>
        </main>

        {/* Section 7: Deep Forest Green Editorial Footer */}
        <Footer />
      </div>

      {/* Appointment Details Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRescheduleWithAI={(appt) => {
          handleTriggerAIPrompt(
            `Reschedule my appointment #${appt.id} with ${appt.doctor_name} to the next available free slot.`
          );
        }}
        onCancelWithAI={(appt) => {
          handleTriggerAIPrompt(`Cancel my appointment #${appt.id}`);
        }}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
