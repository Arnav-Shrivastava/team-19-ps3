-- =====================================================================
-- PS3 Clinic Appointment Agent (CareSlot) - Verification Queries
-- Run these read-only checks in Supabase -> SQL Editor after testing.
-- =====================================================================

-- 1. Slots marked is_booked = true that have no appointment with status 'booked'.
-- Expected result: A positive count (~350 to 450), expected because seed marks roughly a third of slots as taken by other patients without appointment records.
select count(*) as booked_slots_without_booked_appointment
from slots s
where s.is_booked = true
  and not exists (
    select 1
    from appointments a
    where a.slot_id = s.id
      and a.status = 'booked'
  );

-- 2. Appointments with status 'booked' whose slot has is_booked = false.
-- Expected result: Exactly 0 rows (proves every booked appointment has its slot marked is_booked = true).
select
  a.id as appointment_id,
  a.patient_id,
  a.doctor_id,
  a.slot_id,
  a.status,
  s.slot_date,
  s.start_time,
  s.is_booked as slot_is_booked
from appointments a
join slots s on a.slot_id = s.id
where a.status = 'booked'
  and s.is_booked = false;

-- 3. Slots that are referenced by more than one appointment with status 'booked'.
-- Expected result: Exactly 0 rows (proves there is no double booking on any slot).
select
  a.slot_id,
  count(*) as active_booked_count
from appointments a
where a.status = 'booked'
group by a.slot_id
having count(*) > 1;

-- 4. All appointments for patient P001 with doctor name, date, time and status, newest first.
-- Expected result: All appointments for patient P001 sorted with newest first (shows doctor name, slot date, start time, and booking status).
select
  a.id as appointment_id,
  d.name as doctor_name,
  s.slot_date,
  s.start_time,
  a.status,
  a.reason,
  a.created_at
from appointments a
join doctors d on a.doctor_id = d.id
join slots s on a.slot_id = s.id
where a.patient_id = 'P001'
order by a.created_at desc, s.slot_date desc, s.start_time desc;

-- 5. Count of free slots per doctor from today onward.
-- Expected result: Each doctor with their count of unbooked slots from current_date onward (typically ~50-80 available slots per doctor).
select
  d.id as doctor_id,
  d.name as doctor_name,
  count(s.id) as free_slots_count
from doctors d
left join slots s
  on d.id = s.doctor_id
  and s.is_booked = false
  and s.slot_date >= current_date
group by d.id, d.name
order by d.id;

