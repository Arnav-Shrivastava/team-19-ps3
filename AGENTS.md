# AGENTS.md: CareSlot (PS3 Clinic Appointment Agent), Team 19

Business user: a patient of a multi-speciality clinic. Logged-in user id: P001 (Arjun Mehta), set in lib/currentUser.ts.

## Stack
- Next.js App Router, TypeScript, Tailwind, Supabase (server only, secret key), Gemini function calling, Zod.

## Tables (seed/ps3_clinic_appointments.sql)
- departments(id, name, common_issues)
- doctors(id, name, department_id, qualification, experience_years, consultation_fee, languages text[], room)
- slots(id, doctor_id, slot_date, start_time, is_booked)  unique(doctor_id, slot_date, start_time)
- patients(id, name, phone, age, city)
- appointments(id, patient_id, doctor_id, slot_id, reason, status booked|cancelled|completed, created_at)

## Agent
- Read tools: lib/agent/readTools.ts. Write tools: lib/agent/writeTools.ts. Both are joined in lib/agent/tools.ts.
- Tools use defineTool() with a Zod schema; descriptions start with "Use this when...".
- The logged-in user id comes from lib/currentUser.ts. Never take a user id as a tool argument.

## Business rules
- A slot can be booked only once. Booking sets slots.is_booked = true; cancelling sets it back to false.
- No booking of past slots. No two booked appointments for the same patient at the same date and time.
- Reschedule keeps the same doctor.
- Safety: the agent never diagnoses and never suggests medicine. It only helps with booking.

## Never
- Never use the Supabase secret key in components. Never commit .env.local.
