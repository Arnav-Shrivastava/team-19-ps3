import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { todayInIndia } from "@/lib/dates";
import { one } from "@/lib/clinicRules";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/* GET /api/doctors -> { doctors: [{ id, name, department, qualification, experience_years, consultation_fee, languages, room, free_slots }] }
 * free_slots = number of free slots from today onwards. Owner: Backend / API member. */
export async function GET() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("doctors")
    .select("id, name, qualification, experience_years, consultation_fee, languages, room, departments(name)")
    .order("id");
  if (error) {
    console.error("doctors GET failed:", error.message);
    return NextResponse.json({ error: "Could not load doctors" }, { status: 500 });
  }
  const { data: free, error: freeErr } = await sb
    .from("slots")
    .select("doctor_id")
    .eq("is_booked", false)
    .gte("slot_date", todayInIndia())
    .limit(2000);
  if (freeErr) {
    console.error("doctors free slots failed:", freeErr.message);
    return NextResponse.json({ error: "Could not load doctors" }, { status: 500 });
  }
  const counts: Record<string, number> = {};
  for (const s of (free ?? []) as Row[]) counts[s.doctor_id] = (counts[s.doctor_id] ?? 0) + 1;

  const doctors = (data as Row[]).map((d) => ({
    id: d.id as string,
    name: d.name as string,
    department: (one<Row>(d.departments)?.name ?? "") as string,
    qualification: d.qualification as string,
    experience_years: d.experience_years as number,
    consultation_fee: d.consultation_fee as number,
    languages: d.languages as string[],
    room: d.room as string,
    free_slots: counts[d.id] ?? 0,
  }));
  return NextResponse.json({ doctors });
}
