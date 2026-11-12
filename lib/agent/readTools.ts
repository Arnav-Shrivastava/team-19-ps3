import "server-only";
import { z } from "zod";
import { defineTool, type AgentTool } from "./defineTool";
import { getSupabase } from "../supabase";
import { isoDate } from "../schemas";
import { CURRENT_USER_ID } from "../currentUser";
import { todayInIndia } from "../dates";
import { hhmm, isFutureSlot, one } from "../clinicRules";

/* READ TOOLS (the agent's eyes). Owner: AI / Agent member. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

const getDepartments = defineTool({
  name: "getDepartments",
  description:
    "Use this when the user describes a health problem or need in plain words and you must pick which clinic department they should book. Returns every department with the common issues it handles. Only use it to route to a department, never to diagnose.",
  schema: z.object({}),
  run: async () => {
    const { data, error } = await getSupabase()
      .from("departments")
      .select("id, name, common_issues")
      .order("id");
    if (error) throw new Error(error.message);
    return { departments: data };
  },
});

const searchDoctors = defineTool({
  name: "searchDoctors",
  description:
    "Use this when the user wants to find or list doctors, by department, spoken language or doctor name. All filters are optional. Returns at most 20 doctors with id, name, department, fee, languages and room.",
  schema: z.object({
    department: z.string().trim().max(60).optional().describe("Department name, e.g. Dermatology or General Medicine"),
    language: z.string().trim().max(30).optional().describe("A language the doctor speaks, e.g. Tamil, Hindi"),
    doctor_name: z.string().trim().max(60).optional().describe("Part of the doctor's name"),
  }),
  run: async ({ department, language, doctor_name }) => {
    const { data, error } = await getSupabase()
      .from("doctors")
      .select("id, name, qualification, experience_years, consultation_fee, languages, room, departments(name)")
      .order("id");
    if (error) throw new Error(error.message);
    let rows = (data as Row[]).map((d) => ({
      id: d.id as string,
      name: d.name as string,
      department: (one<Row>(d.departments)?.name ?? "") as string,
      qualification: d.qualification as string,
      experience_years: d.experience_years as number,
      consultation_fee: d.consultation_fee as number,
      languages: d.languages as string[],
      room: d.room as string,
    }));
    if (department) rows = rows.filter((d) => d.department.toLowerCase().includes(department.toLowerCase()));
    if (language) rows = rows.filter((d) => d.languages.some((l) => l.toLowerCase() === language.toLowerCase()));
    if (doctor_name) rows = rows.filter((d) => d.name.toLowerCase().includes(doctor_name.toLowerCase()));
    return { count: rows.length, doctors: rows.slice(0, 20) };
  },
});

const getAvailableSlots = defineTool({
  name: "getAvailableSlots",
  description:
    "Use this when the user wants free appointment times. Filter by doctor_id, department, and a date range. Returns future free slots only, earliest first, each with slot_id (needed for booking), doctor, date and time. Slots run 09:00 to 12:30, Monday to Saturday.",
  schema: z.object({
    doctor_id: z.string().trim().max(10).optional().describe("Doctor id like DR03. Call searchDoctors first if unknown."),
    department: z.string().trim().max(60).optional().describe("Department name, e.g. Dermatology"),
    date_from: isoDate.optional().describe("Earliest date, YYYY-MM-DD. Default today."),
    date_to: isoDate.optional().describe("Latest date, YYYY-MM-DD. Default 14 days from now."),
    earliest_time: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM").optional().describe("Only slots at or after this time, HH:MM 24-hour"),
    limit: z.number().int().min(1).max(20).optional().describe("How many slots to return. Default 8."),
  }),
  run: async ({ doctor_id, department, date_from, date_to, earliest_time, limit }) => {
    const sb = getSupabase();
    const from = date_from && date_from > todayInIndia() ? date_from : todayInIndia();

    // Work out which doctors to include.
    let doctorIds: string[] | null = null;
    if (doctor_id) doctorIds = [doctor_id.toUpperCase()];
    else if (department) {
      const { data: docs, error: docErr } = await sb.from("doctors").select("id, departments(name)");
      if (docErr) throw new Error(docErr.message);
      doctorIds = (docs as Row[])
        .filter((d) => (one<Row>(d.departments)?.name ?? "").toLowerCase().includes(department.toLowerCase()))
        .map((d) => d.id as string);
      if (doctorIds.length === 0) throw new Error(`No department matches "${department}".`);
    }

    let query = sb
      .from("slots")
      .select("id, slot_date, start_time, doctor_id, doctors(name, room)")
      .eq("is_booked", false)
      .gte("slot_date", from)
      .order("slot_date")
      .order("start_time")
      .limit(120);
    if (date_to) query = query.lte("slot_date", date_to);
    if (doctorIds) query = query.in("doctor_id", doctorIds);
    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const slots = (data as Row[])
      .filter((s) => isFutureSlot(s.slot_date, s.start_time))
      .filter((s) => !earliest_time || hhmm(s.start_time) >= earliest_time)
      .slice(0, limit ?? 8)
      .map((s) => ({
        slot_id: s.id as number,
        doctor_id: s.doctor_id as string,
        doctor_name: (one<Row>(s.doctors)?.name ?? "") as string,
        room: (one<Row>(s.doctors)?.room ?? "") as string,
        date: s.slot_date as string,
        time: hhmm(s.start_time),
      }));
    return { count: slots.length, slots };
  },
});

const getMyAppointments = defineTool({
  name: "getMyAppointments",
  description:
    "Use this when the user asks about their own appointments, or when you need an appointment_id to cancel or reschedule. Returns the logged-in patient's appointments, newest date first. Default status is booked.",
  schema: z.object({
    status: z.enum(["booked", "cancelled", "completed", "all"]).optional().describe("Default booked"),
  }),
  run: async ({ status }) => {
    let query = getSupabase()
      .from("appointments")
      .select("id, status, reason, doctor_id, slot_id, doctors(name, room, departments(name)), slots(slot_date, start_time)")
      .eq("patient_id", CURRENT_USER_ID)
      .order("id", { ascending: false })
      .limit(20);
    const wanted = status ?? "booked";
    if (wanted !== "all") query = query.eq("status", wanted);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const appointments = (data as Row[]).map((a) => {
      const doc = one<Row>(a.doctors);
      const slot = one<Row>(a.slots);
      return {
        appointment_id: a.id as number,
        status: a.status as string,
        reason: (a.reason ?? null) as string | null,
        doctor_id: a.doctor_id as string,
        doctor_name: (doc?.name ?? "") as string,
        department: (one<Row>(doc?.departments)?.name ?? "") as string,
        room: (doc?.room ?? "") as string,
        date: (slot?.slot_date ?? "") as string,
        time: slot ? hhmm(slot.start_time) : "",
      };
    });
    appointments.sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
    return { count: appointments.length, appointments };
  },
});

export const readTools: AgentTool[] = [getDepartments, searchDoctors, getAvailableSlots, getMyAppointments];
