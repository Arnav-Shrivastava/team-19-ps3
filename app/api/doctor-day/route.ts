import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { hhmm, one } from "@/lib/clinicRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/* GET /api/doctor-day?doctor_id=DR01&date=2026-11-12
 * Returns booked appointments for a doctor on a specific date. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctor_id = searchParams.get("doctor_id");
  const date = searchParams.get("date");

  if (!doctor_id || !date) {
    return NextResponse.json({ appointments: [] });
  }

  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("appointments")
      .select("id, status, reason, patients(name), slots!inner(slot_date, start_time)")
      .eq("doctor_id", doctor_id)
      .eq("slots.slot_date", date)
      .order("id");

    if (error) {
      console.error("doctor-day GET failed:", error.message);
      return NextResponse.json({ appointments: [] });
    }

    const appointments = (data as Row[]).map((a) => {
      const p = one<Row>(a.patients);
      const s = one<Row>(a.slots);
      return {
        id: a.id as number,
        patient_name: (p?.name ?? "Patient") as string,
        start_time: s ? hhmm(s.start_time) : "",
        reason: (a.reason ?? null) as string | null,
        status: a.status as string,
      };
    });

    appointments.sort((a, b) => a.start_time.localeCompare(b.start_time));
    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("doctor-day error:", err);
    return NextResponse.json({ appointments: [] });
  }
}
