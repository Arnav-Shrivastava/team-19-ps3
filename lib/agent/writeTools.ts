import "server-only";
import { z } from "zod";
import { defineTool, type AgentTool } from "./defineTool";
import { getSupabase } from "../supabase";
import { CURRENT_USER_ID } from "../currentUser";
import { hhmm, isFutureSlot, one } from "../clinicRules";

/* WRITE TOOLS (the agent's hands). Owner: Backend / API member.
 * Every rule is checked in code BEFORE data changes. Slot claiming uses
 * "update ... where is_booked = false" so two people can never get the same slot. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

/** Atomically marks a slot as booked. Throws if it is missing, already taken, or in the past. */
async function claimSlot(slotId: number): Promise<Row> {
  const sb = getSupabase();
  const { data: slot, error } = await sb
    .from("slots")
    .select("id, doctor_id, slot_date, start_time, is_booked")
    .eq("id", slotId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!slot) throw new Error(`Slot ${slotId} does not exist.`);
  if (slot.is_booked) throw new Error("That slot is already booked. Please pick another free slot.");
  if (!isFutureSlot(slot.slot_date, slot.start_time)) throw new Error("That slot is in the past. Please pick a future slot.");

  const { data: claimed, error: claimErr } = await sb
    .from("slots")
    .update({ is_booked: true })
    .eq("id", slotId)
    .eq("is_booked", false)
    .select("id")
    .maybeSingle();
  if (claimErr) throw new Error(claimErr.message);
  if (!claimed) throw new Error("Someone just took that slot. Please pick another free slot.");
  return slot;
}

async function releaseSlot(slotId: number) {
  await getSupabase().from("slots").update({ is_booked: false }).eq("id", slotId);
}

const bookAppointment = defineTool({
  name: "bookAppointment",
  description:
    "Use this when the user clearly asks to book an appointment in a specific free slot. Needs slot_id from getAvailableSlots. Books for the logged-in patient only.",
  writes: true,
  schema: z.object({
    slot_id: z.number().int().positive().describe("The slot_id returned by getAvailableSlots"),
    reason: z.string().trim().max(200).optional().describe("Short reason for the visit in the patient's own words. Not a diagnosis."),
  }),
  run: async ({ slot_id, reason }) => {
    const sb = getSupabase();

    // Rule: the patient cannot hold two bookings at the same date and time.
    const { data: mine, error: mineErr } = await sb
      .from("appointments")
      .select("id, slots(slot_date, start_time)")
      .eq("patient_id", CURRENT_USER_ID)
      .eq("status", "booked");
    if (mineErr) throw new Error(mineErr.message);

    const { data: target, error: targetErr } = await sb
      .from("slots")
      .select("slot_date, start_time")
      .eq("id", slot_id)
      .maybeSingle();
    if (targetErr) throw new Error(targetErr.message);
    if (!target) throw new Error(`Slot ${slot_id} does not exist.`);
    const clash = (mine as Row[]).some((a) => {
      const s = one<Row>(a.slots);
      return s && s.slot_date === target.slot_date && hhmm(s.start_time) === hhmm(target.start_time);
    });
    if (clash) throw new Error("You already have an appointment at that date and time.");

    const slot = await claimSlot(slot_id);
    const { data, error } = await sb
      .from("appointments")
      .insert({ patient_id: CURRENT_USER_ID, doctor_id: slot.doctor_id, slot_id, reason: reason ?? null })
      .select("id, status")
      .single();
    if (error) {
      await releaseSlot(slot_id); // keep the data consistent if the insert failed
      throw new Error(error.message);
    }
    const { data: doc } = await sb.from("doctors").select("name, room").eq("id", slot.doctor_id).maybeSingle();
    return {
      booked: {
        appointment_id: data.id,
        status: data.status,
        doctor_name: doc?.name ?? slot.doctor_id,
        room: doc?.room ?? "",
        date: slot.slot_date,
        time: hhmm(slot.start_time),
      },
    };
  },
});

const cancelAppointment = defineTool({
  name: "cancelAppointment",
  description:
    "Use this when the user clearly asks to cancel one of their appointments. Needs appointment_id; call getMyAppointments first if unknown. Frees the slot again.",
  writes: true,
  schema: z.object({
    appointment_id: z.number().int().positive().describe("The appointment_id from getMyAppointments"),
  }),
  run: async ({ appointment_id }) => {
    const sb = getSupabase();
    const { data: appt, error } = await sb
      .from("appointments")
      .select("id, slot_id, status, slots(slot_date, start_time)")
      .eq("id", appointment_id)
      .eq("patient_id", CURRENT_USER_ID)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!appt) throw new Error(`You have no appointment with id ${appointment_id}.`);
    if (appt.status !== "booked") throw new Error(`Appointment ${appointment_id} is already ${appt.status}, so it cannot be cancelled.`);

    const currentSlot = one<Row>(appt.slots);
    if (currentSlot && !isFutureSlot(currentSlot.slot_date, currentSlot.start_time)) {
      throw new Error("That appointment time has already passed, so it cannot be changed.");
    }

    const { error: updErr } = await sb
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointment_id)
      .eq("patient_id", CURRENT_USER_ID);
    if (updErr) throw new Error(updErr.message);
    await releaseSlot(appt.slot_id);
    return { cancelled: { appointment_id, status: "cancelled", slot_freed: appt.slot_id } };
  },
});

const rescheduleAppointment = defineTool({
  name: "rescheduleAppointment",
  description:
    "Use this when the user clearly asks to move an existing appointment to another free slot with the SAME doctor. Needs appointment_id (getMyAppointments) and new_slot_id (getAvailableSlots with that doctor_id).",
  writes: true,
  schema: z.object({
    appointment_id: z.number().int().positive().describe("The appointment_id from getMyAppointments"),
    new_slot_id: z.number().int().positive().describe("A free slot_id of the same doctor from getAvailableSlots"),
  }),
  run: async ({ appointment_id, new_slot_id }) => {
    const sb = getSupabase();
    const { data: appt, error } = await sb
      .from("appointments")
      .select("id, slot_id, doctor_id, status, slots(slot_date, start_time)")
      .eq("id", appointment_id)
      .eq("patient_id", CURRENT_USER_ID)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!appt) throw new Error(`You have no appointment with id ${appointment_id}.`);
    if (appt.status !== "booked") throw new Error(`Appointment ${appointment_id} is ${appt.status}, so it cannot be moved.`);

    const currentSlot = one<Row>(appt.slots);
    if (currentSlot && !isFutureSlot(currentSlot.slot_date, currentSlot.start_time)) {
      throw new Error("That appointment time has already passed, so it cannot be changed.");
    }

    if (appt.slot_id === new_slot_id) throw new Error("That is already your current slot.");

    const { data: target, error: tErr } = await sb
      .from("slots")
      .select("doctor_id, slot_date, start_time")
      .eq("id", new_slot_id)
      .maybeSingle();
    if (tErr) throw new Error(tErr.message);
    if (!target) throw new Error(`Slot ${new_slot_id} does not exist.`);
    if (target.doctor_id !== appt.doctor_id) {
      throw new Error("Rescheduling keeps the same doctor. To change doctor, cancel this appointment and book a new one.");
    }

    // Rule: the patient cannot hold two bookings at the same date and time.
    const { data: mine, error: mineErr } = await sb
      .from("appointments")
      .select("id, slots(slot_date, start_time)")
      .eq("patient_id", CURRENT_USER_ID)
      .eq("status", "booked")
      .neq("id", appointment_id);
    if (mineErr) throw new Error(mineErr.message);

    const clash = (mine as Row[]).some((a) => {
      const s = one<Row>(a.slots);
      return s && s.slot_date === target.slot_date && hhmm(s.start_time) === hhmm(target.start_time);
    });
    if (clash) throw new Error("You already have an appointment at that date and time.");

    const slot = await claimSlot(new_slot_id);
    const { error: updErr } = await sb.from("appointments").update({ slot_id: new_slot_id }).eq("id", appointment_id);
    if (updErr) {
      await releaseSlot(new_slot_id);
      throw new Error(updErr.message);
    }
    await releaseSlot(appt.slot_id);
    return {
      rescheduled: { appointment_id, old_slot_id: appt.slot_id, new_slot_id, date: slot.slot_date, time: hhmm(slot.start_time) },
    };
  },
});

export const writeTools: AgentTool[] = [bookAppointment, cancelAppointment, rescheduleAppointment];
