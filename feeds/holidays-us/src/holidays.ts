/**
 * US Holiday computation.
 * Includes federal holidays, widely observed cultural holidays, and
 * other dates commonly printed on wall calendars.
 * Handles fixed-date, floating (rule-based), and Easter-derived holidays.
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
  const day = 1 + ((weekday - firstDay + 7) % 7) + (n - 1) * 7;
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

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Compute Easter Sunday using the Anonymous Gregorian algorithm (Computus).
 * Valid for any year in the Gregorian calendar.
 * Returns YYYY-MM-DD.
 */
function computeEaster(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return formatDate(year, month, day);
}

/** Offset a YYYY-MM-DD date string by a number of days */
function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/**
 * Election Day: first Tuesday after the first Monday in November.
 * Only in even-numbered years (federal elections).
 */
function computeElectionDay(year: number): string | null {
  if (year % 2 !== 0) return null;
  // First Monday in November
  const firstMonday = nthWeekdayOf(year, 11, 1, 1);
  // Tuesday after that
  return offsetDate(firstMonday, 1);
}

const HOLIDAY_RULES: HolidayRule[] = [
  // --- Federal holidays ---
  {
    key: "new-years-day",
    name: "New Year's Day",
    compute: fixedDate(1, 1),
  },
  {
    key: "mlk-day",
    name: "Martin Luther King Jr. Day",
    compute: (year) => nthWeekdayOf(year, 1, 1, 3),
  },
  {
    key: "presidents-day",
    name: "Presidents' Day",
    compute: (year) => nthWeekdayOf(year, 2, 1, 3),
  },
  {
    key: "memorial-day",
    name: "Memorial Day",
    compute: (year) => lastWeekdayOf(year, 5, 1),
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
    compute: (year) => nthWeekdayOf(year, 9, 1, 1),
  },
  {
    key: "indigenous-peoples-day",
    name: "Indigenous Peoples' Day",
    compute: (year) => nthWeekdayOf(year, 10, 1, 2),
  },
  {
    key: "veterans-day",
    name: "Veterans Day",
    compute: fixedDate(11, 11),
  },
  {
    key: "thanksgiving",
    name: "Thanksgiving",
    compute: (year) => nthWeekdayOf(year, 11, 4, 4),
  },
  {
    key: "christmas",
    name: "Christmas Day",
    compute: fixedDate(12, 25),
  },

  // --- Widely observed / cultural ---
  {
    key: "valentines-day",
    name: "Valentine's Day",
    compute: fixedDate(2, 14),
  },
  {
    key: "st-patricks-day",
    name: "St. Patrick's Day",
    compute: fixedDate(3, 17),
  },
  {
    key: "easter",
    name: "Easter",
    compute: computeEaster,
  },
  {
    key: "mothers-day",
    name: "Mother's Day",
    compute: (year) => nthWeekdayOf(year, 5, 0, 2),
  },
  {
    key: "cinco-de-mayo",
    name: "Cinco de Mayo",
    compute: fixedDate(5, 5),
  },
  {
    key: "fathers-day",
    name: "Father's Day",
    compute: (year) => nthWeekdayOf(year, 6, 0, 3),
  },
  {
    key: "halloween",
    name: "Halloween",
    compute: fixedDate(10, 31),
  },
  {
    key: "black-friday",
    name: "Black Friday",
    compute: (year) => offsetDate(nthWeekdayOf(year, 11, 4, 4), 1),
  },
  {
    key: "new-years-eve",
    name: "New Year's Eve",
    compute: fixedDate(12, 31),
  },
];

/** Conditionally-included holidays (not every year) */
function conditionalHolidays(year: number): USHoliday[] {
  const results: USHoliday[] = [];
  const electionDay = computeElectionDay(year);
  if (electionDay) {
    results.push({ key: "election-day", name: "Election Day", date: electionDay });
  }
  return results;
}

export function computeUSHolidays(year: number): USHoliday[] {
  const holidays = HOLIDAY_RULES.map((rule) => ({
    key: rule.key,
    name: rule.name,
    date: rule.compute(year),
  }));
  holidays.push(...conditionalHolidays(year));
  holidays.sort((a, b) => a.date.localeCompare(b.date));
  return holidays;
}
