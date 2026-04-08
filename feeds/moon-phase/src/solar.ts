/**
 * Solstice and equinox computation using Jean Meeus' Astronomical Algorithms
 * (Chapter 27). Pure functions, no I/O.
 */

export interface SolarEvent {
  date: string;
  event: "vernal_equinox" | "summer_solstice" | "autumnal_equinox" | "winter_solstice";
  emoji: string;
  name: string;
}

export type SolarEventType = SolarEvent["event"];

const EVENT_META: Record<SolarEventType, { emoji: string; name: string }> = {
  vernal_equinox:    { emoji: "\u25D2", name: "Vernal Equinox" },
  summer_solstice:   { emoji: "\u25D1", name: "Summer Solstice" },
  autumnal_equinox:  { emoji: "\u25D3", name: "Autumnal Equinox" },
  winter_solstice:   { emoji: "\u25D0", name: "Winter Solstice" },
};

export function solarEventName(event: SolarEventType): string {
  return EVENT_META[event].name;
}

export function solarEventEmoji(event: SolarEventType): string {
  return EVENT_META[event].emoji;
}

/** Degrees to radians */
function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Meeus Table 27.B — mean JDE0 for year 1000–3000.
 * Y = (year - 2000) / 1000
 */
function meanJDE0(year: number, eventIndex: number): number {
  const Y = (year - 2000) / 1000;
  const Y2 = Y * Y;
  const Y3 = Y2 * Y;
  const Y4 = Y3 * Y;

  switch (eventIndex) {
    case 0: // March equinox
      return 2451623.80984 + 365242.37404 * Y + 0.05169 * Y2 - 0.00411 * Y3 - 0.00057 * Y4;
    case 1: // June solstice
      return 2451716.56767 + 365241.62603 * Y + 0.00325 * Y2 + 0.00888 * Y3 - 0.00030 * Y4;
    case 2: // September equinox
      return 2451810.21715 + 365242.01767 * Y - 0.11575 * Y2 + 0.00337 * Y3 + 0.00078 * Y4;
    case 3: // December solstice
      return 2451900.05952 + 365242.74049 * Y - 0.06223 * Y2 - 0.00823 * Y3 + 0.00032 * Y4;
    default:
      throw new Error(`Invalid event index: ${eventIndex}`);
  }
}

/** Meeus Table 27.C — 24 periodic terms for S. */
const PERIODIC_TERMS: [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

/**
 * Compute JDE for a specific solar event in a given year.
 * eventIndex: 0=March equinox, 1=June solstice, 2=Sept equinox, 3=Dec solstice
 */
function computeSolarJDE(year: number, eventIndex: number): number {
  const JDE0 = meanJDE0(year, eventIndex);

  const T = (JDE0 - 2451545.0) / 36525;

  const W = 35999.373 * T - 2.47;
  const dLambda = 1 + 0.0334 * Math.cos(rad(W)) + 0.0007 * Math.cos(rad(2 * W));

  let S = 0;
  for (const [A, B, C] of PERIODIC_TERMS) {
    S += A * Math.cos(rad(B + C * T));
  }

  return JDE0 + (0.00001 * S) / dLambda;
}

/** Convert Julian Ephemeris Day to a JavaScript Date (UTC). */
function jdeToDate(jde: number): Date {
  const ms = (jde - 2440587.5) * 86400000;
  return new Date(ms);
}

/** Format a Date as YYYY-MM-DD (UTC). */
function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const EVENT_KEYS: [number, SolarEventType][] = [
  [0, "vernal_equinox"],
  [1, "summer_solstice"],
  [2, "autumnal_equinox"],
  [3, "winter_solstice"],
];

/**
 * Compute all solstices and equinoxes between startDate and endDate (inclusive).
 * Returns events sorted chronologically.
 */
export function computeSolarEvents(startDate: Date, endDate: Date): SolarEvent[] {
  const events: SolarEvent[] = [];
  const startYear = startDate.getUTCFullYear();
  const endYear = endDate.getUTCFullYear();

  for (let year = startYear; year <= endYear; year++) {
    for (const [eventIndex, eventKey] of EVENT_KEYS) {
      const jde = computeSolarJDE(year, eventIndex);
      const date = jdeToDate(jde);

      if (date < startDate || date > endDate) continue;

      const meta = EVENT_META[eventKey];
      events.push({
        date: formatDateUTC(date),
        event: eventKey,
        emoji: meta.emoji,
        name: meta.name,
      });
    }
  }

  return events;
}
