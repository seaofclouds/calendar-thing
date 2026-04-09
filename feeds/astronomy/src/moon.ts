/**
 * Moon phase computation using Jean Meeus' Astronomical Algorithms (Chapter 49).
 * Pure functions, no I/O.
 */

export interface MoonPhase {
  date: string;
  phase: "new_moon" | "first_quarter" | "full_moon" | "last_quarter";
  emoji: string;
  illumination: number;
}

type PhaseType = MoonPhase["phase"];

const PHASE_META: Record<PhaseType, { emoji: string; illumination: number; name: string }> = {
  new_moon:      { emoji: "\u{1F311}", illumination: 0,   name: "New Moon" },
  first_quarter: { emoji: "\u{1F313}", illumination: 50,  name: "First Quarter" },
  full_moon:     { emoji: "\u{1F315}", illumination: 100, name: "Full Moon" },
  last_quarter:  { emoji: "\u{1F317}", illumination: 50,  name: "Last Quarter" },
};

export function phaseName(phase: PhaseType): string {
  return PHASE_META[phase].name;
}

export function phaseEmoji(phase: PhaseType): string {
  return PHASE_META[phase].emoji;
}

/** Degrees to radians */
function rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Normalize angle to [0, 360) */
function norm(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the Julian Ephemeris Day for a given phase.
 * k must be integer (new moon), +0.25 (FQ), +0.5 (FM), or +0.75 (LQ).
 */
function computePhaseJDE(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Mean JDE of the phase (Meeus eq. 49.1)
  let JDE =
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * T2 -
    0.00000015 * T3 +
    0.00000000073 * T4;

  // Eccentricity of Earth's orbit
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  // Sun's mean anomaly (degrees)
  const M = norm(
    2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3
  );

  // Moon's mean anomaly (degrees)
  const Mp = norm(
    201.5643 +
      385.81693528 * k +
      0.0107582 * T2 +
      0.00001238 * T3 -
      0.000000058 * T4
  );

  // Moon's argument of latitude (degrees)
  const F = norm(
    160.7108 +
      390.67050284 * k -
      0.0016118 * T2 -
      0.00000227 * T3 +
      0.000000011 * T4
  );

  // Longitude of ascending node (degrees)
  const Om = norm(
    124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3
  );

  // Determine which phase from fractional part of k
  const frac = ((k % 1) + 1) % 1;
  const phaseIndex = Math.round(frac * 4) % 4; // 0=NM, 1=FQ, 2=FM, 3=LQ

  let correction: number;

  if (phaseIndex === 0 || phaseIndex === 2) {
    // New Moon (0) or Full Moon (2) — same correction terms, different coefficients
    const isNew = phaseIndex === 0;
    correction =
      (isNew ? -0.4072 : -0.40614) * Math.sin(rad(Mp)) +
      (isNew ? 0.17241 : 0.17302) * E * Math.sin(rad(M)) +
      (isNew ? 0.01608 : 0.01614) * Math.sin(rad(2 * Mp)) +
      (isNew ? 0.01039 : 0.01043) * Math.sin(rad(2 * F)) +
      (isNew ? 0.00739 : 0.00734) * E * Math.sin(rad(Mp - M)) +
      -0.00515 * E * Math.sin(rad(Mp + M)) +
      (isNew ? 0.00208 : 0.00209) * E2 * Math.sin(rad(2 * M)) +
      -0.00111 * Math.sin(rad(Mp - 2 * F)) +
      -0.00057 * Math.sin(rad(Mp + 2 * F)) +
      0.00056 * E * Math.sin(rad(2 * Mp + M)) +
      -0.00042 * Math.sin(rad(3 * Mp)) +
      0.00042 * E * Math.sin(rad(M + 2 * F)) +
      0.00038 * E * Math.sin(rad(M - 2 * F)) +
      -0.00024 * E * Math.sin(rad(2 * Mp - M)) +
      -0.00017 * Math.sin(rad(Om)) +
      -0.00007 * Math.sin(rad(Mp + 2 * M)) +
      0.00004 * Math.sin(rad(2 * Mp - 2 * F)) +
      0.00004 * Math.sin(rad(3 * M)) +
      0.00003 * Math.sin(rad(Mp + M - 2 * F)) +
      0.00003 * Math.sin(rad(2 * Mp + 2 * F)) +
      -0.00003 * Math.sin(rad(Mp + M + 2 * F)) +
      0.00003 * Math.sin(rad(Mp - M + 2 * F)) +
      -0.00002 * Math.sin(rad(Mp - M - 2 * F)) +
      -0.00002 * Math.sin(rad(3 * Mp + M)) +
      0.00002 * Math.sin(rad(4 * Mp));
  } else {
    // First Quarter (1) or Last Quarter (3)
    correction =
      -0.62801 * Math.sin(rad(Mp)) +
      0.17172 * E * Math.sin(rad(M)) +
      -0.01183 * E * Math.sin(rad(Mp + M)) +
      0.00862 * Math.sin(rad(2 * Mp)) +
      0.00804 * Math.sin(rad(2 * F)) +
      0.00454 * E * Math.sin(rad(Mp - M)) +
      0.00204 * E2 * Math.sin(rad(2 * M)) +
      -0.0018 * Math.sin(rad(Mp - 2 * F)) +
      -0.0007 * Math.sin(rad(Mp + 2 * F)) +
      -0.0004 * Math.sin(rad(3 * Mp)) +
      -0.00034 * E * Math.sin(rad(2 * Mp - M)) +
      0.00032 * E * Math.sin(rad(M + 2 * F)) +
      0.00032 * E * Math.sin(rad(M - 2 * F)) +
      -0.00028 * E2 * Math.sin(rad(Mp + 2 * M)) +
      0.00027 * E * Math.sin(rad(2 * Mp + M)) +
      -0.00017 * Math.sin(rad(Om)) +
      -0.00005 * Math.sin(rad(Mp - M - 2 * F)) +
      0.00004 * Math.sin(rad(2 * Mp + 2 * F)) +
      -0.00004 * Math.sin(rad(Mp + M + 2 * F)) +
      0.00004 * Math.sin(rad(Mp - 2 * M)) +
      0.00003 * Math.sin(rad(Mp + M - 2 * F)) +
      0.00003 * Math.sin(rad(3 * M)) +
      0.00002 * Math.sin(rad(2 * Mp - 2 * F)) +
      0.00002 * Math.sin(rad(Mp - M + 2 * F)) +
      -0.00002 * Math.sin(rad(3 * Mp + M));

    // Quarter-specific W correction (Meeus)
    const W =
      0.00306 -
      0.00038 * E * Math.cos(rad(M)) +
      0.00026 * Math.cos(rad(Mp)) -
      0.00002 * Math.cos(rad(Mp - M)) +
      0.00002 * Math.cos(rad(Mp + M)) +
      0.00002 * Math.cos(rad(2 * F));

    correction += phaseIndex === 1 ? W : -W;
  }

  JDE += correction;
  return JDE;
}

/** Convert Julian Ephemeris Day to a JavaScript Date (UTC). */
function jdeToDate(jde: number): Date {
  // Unix epoch in JDE = 2440587.5
  const ms = (jde - 2440587.5) * 86400000;
  return new Date(ms);
}

/** Approximate lunation number k for a given date. */
function dateToK(date: Date): number {
  const decimalYear =
    date.getUTCFullYear() +
    (date.getUTCMonth() + date.getUTCDate() / 30) / 12;
  return (decimalYear - 2000) * 12.3685;
}

/** Format a Date as YYYY-MM-DD (UTC). */
function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Phase offsets within a single lunation cycle. */
const QUARTER_OFFSETS: [number, PhaseType][] = [
  [0, "new_moon"],
  [0.25, "first_quarter"],
  [0.5, "full_moon"],
  [0.75, "last_quarter"],
];

/**
 * Compute all moon phases between startDate and endDate (inclusive).
 * Returns phases sorted chronologically.
 */
export function computeMoonPhases(startDate: Date, endDate: Date): MoonPhase[] {
  const phases: MoonPhase[] = [];

  // Start one lunation before to avoid missing edge-case phases
  let k = Math.floor(dateToK(startDate)) - 1;

  outer: while (true) {
    for (const [offset, phaseKey] of QUARTER_OFFSETS) {
      const phaseK = k + offset;
      const jde = computePhaseJDE(phaseK);
      const date = jdeToDate(jde);

      if (date > endDate) break outer;
      if (date < startDate) continue;

      const meta = PHASE_META[phaseKey];
      phases.push({
        date: formatDateUTC(date),
        phase: phaseKey,
        emoji: meta.emoji,
        illumination: meta.illumination,
      });
    }
    k++;
  }

  return phases;
}
