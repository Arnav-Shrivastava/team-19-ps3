import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareSlot - Clinic Appointment Agent",
  description: "AI-powered clinic appointment booking, rescheduling, and cancellation assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
