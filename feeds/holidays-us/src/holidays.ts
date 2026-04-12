/**
 * US Federal Holiday computation.
 * Handles both fixed-date and floating (rule-based) holidays.
 */

export interface USHoliday {
  key: string;
  name: string;
  date: string; // YYYY-MM-DD
}

interface HolidayRule {
  key: string;
  name: string;
  compute: (year: number) => string; // returns YYYY-MM-DD
}

/** Nth weekday of a month (1-indexed). weekday: 0=Sun, 1=Mon, ..., 6=Sat */
function nthWeekdayOf(year: number, month: number, weekday: number, n: number): string {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstDay = first.getUTCDay();
  let day = 1 + ((weekday - firstDay + 7) % 7) + (n - 1) * 7;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Last weekday of a month. weekday: 0=Sun, 1=Mon, ..., 6=Sat */
function lastWeekdayOf(year: number, month: number, weekday: number): string {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const last = new Date(Date.UTC(year, month - 1, lastDay));
  const lastDayOfWeek = last.getUTCDay();
  const diff = (lastDayOfWeek - weekday + 7) % 7;
  const day = lastDay - diff;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Fixed date in a given year */
function fixedDate(month: number, day: number): (year: number) => string {
  return (year) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const HOLIDAY_RULES: HolidayRule[] = [
  {
    key: "new-years-day",
    name: "New Year's Day",
    compute: fixedDate(1, 1),
  },
  {
    key: "mlk-day",
    name: "Martin Luther King Jr. Day",
    compute: (year) => nthWeekdayOf(year, 1, 1, 3), // 3rd Monday of January
  },
  {
    key: "presidents-day",
    name: "Presidents' Day",
    compute: (year) => nthWeekdayOf(year, 2, 1, 3), // 3rd Monday of February
  },
  {
    key: "memorial-day",
    name: "Memorial Day",
    compute: (year) => lastWeekdayOf(year, 5, 1), // Last Monday of May
  },
  {
    key: "juneteenth",
    name: "Juneteenth",
    compute: fixedDate(6, 19),
  },
  {
    key: "independence-day",
    name: "Independence Day",
    compute: fixedDate(7, 4),
  },
  {
    key: "labor-day",
    name: "Labor Day",
    compute: (year) => nthWeekdayOf(year, 9, 1, 1), // 1st Monday of September
  },
  {
    key: "indigenous-peoples-day",
    name: "Indigenous Peoples' Day",
    compute: (year) => nthWeekdayOf(year, 10, 1, 2), // 2nd Monday of October
  },
  {
    key: "veterans-day",
    name: "Veterans Day",
    compute: fixedDate(11, 11),
  },
  {
    key: "thanksgiving",
    name: "Thanksgiving",
    compute: (year) => nthWeekdayOf(year, 11, 4, 4), // 4th Thursday of November
  },
  {
    key: "christmas",
    name: "Christmas Day",
    compute: fixedDate(12, 25),
  },
];

export function computeUSHolidays(year: number): USHoliday[] {
  return HOLIDAY_RULES.map((rule) => ({
    key: rule.key,
    name: rule.name,
    date: rule.compute(year),
  }));
}
