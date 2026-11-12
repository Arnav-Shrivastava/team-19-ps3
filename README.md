# CareSlot: Clinic Appointment Agent

Team 19 | PS3 | SRM Agentic AI Hackathon

## The problem
Patients of a multi-speciality clinic call the front desk just to book, move or cancel appointments. Lines are busy and desk staff cannot keep up.

## What our app does
- Patient describes what they need in plain English; the agent picks the right department
- Finds doctors by department or language and shows real free slots
- Books, reschedules and cancels appointments (a slot can be booked only once)
- Shows every tool the agent used, and live "My Appointments" and "Doctors" panels
- Never diagnoses or suggests medicine; it only helps with booking

## Live demo
- Vercel link: <PASTE VERCEL LINK>
- Passcode: <PASTE APP_PASSCODE>
- Try this prompt: "I have a skin rash, book me with a doctor on Friday morning."

## Agent tools
| Tool | What it does | Reads or writes |
| --- | --- | --- |
| getDepartments | Lists departments and the issues they handle, to route the patient | Reads |
| searchDoctors | Finds doctors by department, language or name | Reads |
| getAvailableSlots | Lists future free slots for a doctor or department | Reads |
| getMyAppointments | Shows the logged-in patient's appointments | Reads |
| bookAppointment | Books a free slot for the patient | Writes |
| cancelAppointment | Cancels an appointment and frees the slot | Writes |
| rescheduleAppointment | Moves an appointment to another free slot of the same doctor | Writes |

## Database tables
- departments: clinic departments and the common issues each handles
- doctors: doctor profile, fee, languages, room
- slots: 30-minute slots per doctor per day, with is_booked
- patients: patient details
- appointments: bookings with status booked, cancelled or completed

## Tech stack
Next.js, React, TypeScript, Tailwind CSS, Supabase, Gemini API (function calling), Zod, Vercel

## Team
| Name | Role |
| --- | --- |
| Arnav | Team Lead + Database |
| Prakarsh | AI / Agent |
| Madhvi | Backend / API |
| Hardik | Frontend |

## Run it locally
1. npm install
2. Copy .env.example to .env.local and fill in the keys
3. npm run dev
