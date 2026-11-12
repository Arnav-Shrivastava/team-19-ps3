import { todayInIndia } from "./dates";

/** Current time in India as "HH:MM". */
export function timeNowInIndia(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** True if the slot (date "YYYY-MM-DD", time "HH:MM" or "HH:MM:SS") is still in the future in India. */
export function isFutureSlot(slotDate: string, startTime: string): boolean {
  const today = todayInIndia();
  if (slotDate > today) return true;
  if (slotDate < today) return false;
  return startTime.slice(0, 5) > timeNowInIndia();
}

/** Supabase may return a joined row as an object or a one-item array. This handles both. */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/** "09:00:00" -> "09:00" */
export function hhmm(time: string): string {
  return time.slice(0, 5);
}
