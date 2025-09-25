// src/utils/temperature.ts
export const toFahrenheit = (c?: number) =>
  typeof c === "number" ? (c * 9) / 5 + 32 : undefined;

export const fmtTempF = (c?: number) =>
  typeof c === "number" ? `${toFahrenheit(c)!.toFixed(0)}°F` : "—";

export const fmtPct = (n?: number) => (typeof n === "number" ? `${n}%` : "—");
export const toMph = (kph?: number) =>
  typeof kph === "number" ? Math.round(kph * 0.621371) : undefined;

