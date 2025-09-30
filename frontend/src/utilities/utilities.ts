import { TimeOfDay } from "../types";

export function timeOfDayToDate(timeOfDay: TimeOfDay): Date {
  return new Date(
    timeOfDay.year,
    timeOfDay.month - 1, // JS months are 0-based
    timeOfDay.day,
    timeOfDay.hours,
    timeOfDay.minutes,
    timeOfDay.seconds,
    Math.floor((timeOfDay.nanos ?? 0) / 1_000_000) // nanos → ms
  );
}

export const toFahrenheit = (c?: number) =>
  typeof c === "number" ? (c * 9) / 5 + 32 : undefined;

export const fmtTempF = (c?: number) =>
  typeof c === "number" ? `${toFahrenheit(c)!.toFixed(0)}°F` : "—";

export const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");

export const toMph = (kph?: number) =>
  typeof kph === "number" ? Math.round(kph * 0.621371) : undefined;
