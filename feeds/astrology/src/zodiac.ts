/**
 * Zodiac sign definitions and season date computation.
 * Uses tropical (Western) astrology dates.
 */

export interface ZodiacSign {
  name: string;
  emoji: string;
  startMonth: number; // 1-indexed
  startDay: number;
  endMonth: number;
  endDay: number;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Capricorn", emoji: "\u2651", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: "Aquarius", emoji: "\u2652", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: "Pisces", emoji: "\u2653", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: "Aries", emoji: "\u2648", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: "Taurus", emoji: "\u2649", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: "Gemini", emoji: "\u264A", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: "Cancer", emoji: "\u264B", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: "Leo", emoji: "\u264C", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: "Virgo", emoji: "\u264D", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: "Libra", emoji: "\u264E", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: "Scorpio", emoji: "\u264F", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: "Sagittarius", emoji: "\u2650", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

export interface ZodiacEvent {
  sign: ZodiacSign;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function formatShortDate(month: number, day: number): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[month - 1]} ${day}`;
}

export function formatSeasonRange(sign: ZodiacSign): string {
  return `${formatShortDate(sign.startMonth, sign.startDay)} \u2013 ${formatShortDate(sign.endMonth, sign.endDay)}`;
}

/**
 * Compute zodiac season events for a given year.
 * Returns one event per sign whose season starts within the year.
 */
export function computeZodiacSeasons(year: number): ZodiacEvent[] {
  const events: ZodiacEvent[] = [];

  for (const sign of ZODIAC_SIGNS) {
    const startYear = sign.startMonth === 12 && sign.endMonth === 1
      ? year // Capricorn starts in Dec of the requested year
      : year;
    const endYear = sign.endMonth < sign.startMonth ? startYear + 1 : startYear;

    events.push({
      sign,
      startDate: formatDate(startYear, sign.startMonth, sign.startDay),
      endDate: formatDate(endYear, sign.endMonth, sign.endDay),
    });
  }

  // Sort by start date
  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return events;
}
