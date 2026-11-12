import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { CURRENT_USER_ID } from "@/lib/currentUser";
import { hhmm, one } from "@/lib/clinicRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/* GET /api/appointments -> { appointments: [{ id, status, reason, doctor_name, department, room, slot_date, start_time }] }
 * Owner: Backend / API member. The shape is flat on purpose so the frontend stays simple. */
export async function GET() {
  const { data, error } = await getSupabase()
    .from("appointments")
    .select("id, status, reason, doctors(name, room, departments(name)), slots(slot_date, start_time)")
    .eq("patient_id", CURRENT_USER_ID)
    .order("id", { ascending: false })
    .limit(50);
  if (error) {
    console.error("appointments GET failed:", error.message);
    return NextResponse.json({ error: "Could not load appointments" }, { status: 500 });
  }
  const appointments = (data as Row[]).map((a) => {
    const doc = one<Row>(a.doctors);
    const slot = one<Row>(a.slots);
    return {
      id: a.id as number,
      status: a.status as string,
      reason: (a.reason ?? null) as string | null,
      doctor_name: (doc?.name ?? "") as string,
      department: (one<Row>(doc?.departments)?.name ?? "") as string,
      room: (doc?.room ?? "") as string,
      slot_date: (slot?.slot_date ?? "") as string,
      start_time: slot ? hhmm(slot.start_time) : "",
    };
  });
  appointments.sort((a, b) => (a.slot_date + a.start_time < b.slot_date + b.start_time ? 1 : -1));
  return NextResponse.json({ appointments });
}
