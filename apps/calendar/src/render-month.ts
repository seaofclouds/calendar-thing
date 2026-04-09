/**
 * Month view renderer.
 * Renders a single month as a bordered table with full day names,
 * moon phase icons on quarter dates, movie releases, solar events,
 * and mini prev/next calendars.
 *
 * Design ref: https://www.figma.com/design/1Prjly9gQUUa963p9M3ZXr/Calendar-Thing?node-id=1-116&m=dev
 */

import type { MovieRelease } from "./types";

export interface MonthViewOptions {
  year: number;
  month: number; // 1-12
  size?: string;
  orientation: "portrait" | "landscape";
  header: boolean;
  testing: boolean;
  forExport: boolean;
  format?: "png" | "jpg";
  dpi?: number;
  fullMoonDates: string[];
  newMoonDates: string[];
  movieReleases: MovieRelease[];
  solarEvents: Record<string, "solstice" | "equinox">;
  dataSource?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBREVS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MINI_DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

// ─── Moon phase SVGs (full + new, matching year view) ───────────────

const FULL_MOON_SVG = `<svg class="phase-indicator" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/></svg>`;
const NEW_MOON_SVG = `<svg class="phase-indicator" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="black" stroke="black" stroke-width="2"/></svg>`;

// ─── Day cell data ──────────────────────────────────────────────────

interface DayCellData {
  date: number;
  year: number;
  month: number; // 1-based
  currentMonth: boolean;
  dateStr: string;
  moonPhase?: "full" | "new";
  movies: MovieRelease[];
  solarEvent?: "solstice" | "equinox";
  isToday: boolean;
}

// ─── Main renderer ──────────────────────────────────────────────────

export function renderMonthView(opts: MonthViewOptions): string {
  const monthIndex = opts.month - 1;
  const isPreview = opts.forExport;

  const weeks = generateMonthWeeks(
    opts.year, monthIndex, opts.fullMoonDates, opts.newMoonDates,
    opts.movieReleases, opts.solarEvents,
  );

  const prevMonth = monthIndex === 0
    ? { year: opts.year - 1, month: 11 }
    : { year: opts.year, month: monthIndex - 1 };
  const nextMonth = monthIndex === 11
    ? { year: opts.year + 1, month: 0 }
    : { year: opts.year, month: monthIndex + 1 };

  const rootClasses = [
    opts.size ? `size-${opts.size.toLowerCase()}` : "",
    `orientation-${opts.orientation}`,
    isPreview ? "print" : "",
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "month-view",
    isPreview ? "print" : "",
    opts.testing ? "testing" : "",
  ].filter(Boolean).join(" ");

  const dataAttrs = opts.format
    ? ` data-format="${opts.format}" data-dpi="${opts.dpi ?? 300}" data-year="${opts.year}" data-size="${opts.size ?? "letter"}" data-orientation="${opts.orientation}"`
    : "";

  const prevMonthName = MONTH_NAMES[prevMonth.month];
  const nextMonthName = MONTH_NAMES[nextMonth.month];
  const currentMonthName = MONTH_NAMES[monthIndex];

  const prevUrl = `/${prevMonth.year}/${String(prevMonth.month + 1).padStart(2, "0")}`;
  const nextUrl = `/${nextMonth.year}/${String(nextMonth.month + 1).padStart(2, "0")}`;
  const yearUrl = `/${opts.year}`;

  // Standalone responsive shows "January 2025"; sized print shows just "January"
  const titleText = isPreview
    ? `${currentMonthName} ${opts.year}`
    : currentMonthName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentMonthName} ${opts.year}</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body${opts.dataSource ? ` data-source="${opts.dataSource}"` : ""}>
  <div id="root" class="${rootClasses}">
    <div class="${containerClasses}"${dataAttrs}>
      <div class="month-view-header">
        <div class="month-view-nav">
          <a href="${prevUrl}" class="month-view-nav-link prev-month">&laquo;</a>
          <div class="mini-calendar prev">
${renderMiniCalendar(prevMonth.year, prevMonth.month, prevMonthName)}
          </div>
        </div>
        <div class="month-view-title">
          <a href="${yearUrl}" class="month-view-year-link">${titleText}</a>
        </div>
        <div class="month-view-nav">
          <div class="mini-calendar next">
${renderMiniCalendar(nextMonth.year, nextMonth.month, nextMonthName)}
          </div>
          <a href="${nextUrl}" class="month-view-nav-link next-month">&raquo;</a>
        </div>
      </div>
      <table class="month-view-table">
        <thead>
          <tr class="month-view-daynames">
${DAY_NAMES.map((d, i) => `            <th class="month-view-dayname"><span class="day-full">${d}</span><span class="day-abbrev">${DAY_ABBREVS[i]}</span></th>`).join("\n")}
          </tr>
        </thead>
        <tbody>
${weeks.map((week) => renderWeekRow(week)).join("\n")}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}

// ─── Row / cell rendering ───────────────────────────────────────────

function renderWeekRow(week: DayCellData[]): string {
  return `          <tr class="month-view-week">
${week.map((day) => renderDayCell(day)).join("\n")}
          </tr>`;
}

function renderDayCell(day: DayCellData): string {
  const classes = [
    "month-view-day",
    !day.currentMonth ? "other-month" : "",
    day.isToday ? "is-today" : "",
  ].filter(Boolean).join(" ");

  const moonSvg = day.moonPhase === "full" ? FULL_MOON_SVG
    : day.moonPhase === "new" ? NEW_MOON_SVG
    : "";

  const eventLines: string[] = [];
  if (day.solarEvent) {
    eventLines.push(
      `<span class="day-event solar-event">${capitalize(day.solarEvent)}</span>`
    );
  }
  for (const m of day.movies) {
    eventLines.push(
      `<span class="day-event movie-event" title="${escapeAttr(m.title)}">${escapeHtml(m.title)}</span>`
    );
  }

  return `            <td class="${classes}">
              <div class="day-cell-inner">
                <div class="day-cell-header">
                  <span class="day-number">${day.date}</span>
                  ${moonSvg}
                </div>${eventLines.length > 0 ? `
                <div class="day-cell-events">
                  ${eventLines.join("\n                  ")}
                </div>` : ""}
              </div>
            </td>`;
}

// ─── Mini calendar ──────────────────────────────────────────────────

function renderMiniCalendar(year: number, monthIndex: number, monthName: string): string {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  let html = `            <div class="mini-cal-title">${monthName.toUpperCase()} ${year}</div>\n`;
  html += `            <table class="mini-cal-table">\n`;
  html += `              <thead><tr>${MINI_DAY_LETTERS.map((d) => `<th>${d}</th>`).join("")}</tr></thead>\n`;
  html += `              <tbody>\n`;

  let dayNum = 1;
  let nextDayNum = 1;
  const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    if (i % 7 === 0) html += `                <tr>`;

    if (i < startingDay) {
      html += `<td class="mini-other">${prevMonthLastDay - startingDay + i + 1}</td>`;
    } else if (dayNum <= daysInMonth) {
      html += `<td>${dayNum}</td>`;
      dayNum++;
    } else {
      html += `<td class="mini-other">${nextDayNum}</td>`;
      nextDayNum++;
    }

    if (i % 7 === 6) html += `</tr>\n`;
  }

  html += `              </tbody>\n`;
  html += `            </table>`;
  return html;
}

// ─── Week generation ────────────────────────────────────────────────

function generateMonthWeeks(
  year: number,
  monthIndex: number,
  fullMoonDates: string[],
  newMoonDates: string[],
  movieReleases: MovieRelease[],
  solarEvents: Record<string, "solstice" | "equinox">
): DayCellData[][] {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevMonthLastDay = new Date(year, monthIndex, 0);
  const prevMonthDays = prevMonthLastDay.getDate();
  const prevMonthNum = monthIndex === 0 ? 12 : monthIndex;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const nextMonthNum = monthIndex === 11 ? 1 : monthIndex + 2;
  const nextYear = monthIndex === 11 ? year + 1 : year;

  const fullMoonSet = new Set(fullMoonDates);
  const newMoonSet = new Set(newMoonDates);

  const movieMap = new Map<string, MovieRelease[]>();
  for (const m of movieReleases) {
    const existing = movieMap.get(m.date) ?? [];
    existing.push(m);
    movieMap.set(m.date, existing);
  }

  function makeCell(
    date: number,
    cellYear: number,
    cellMonth: number,
    currentMonth: boolean,
  ): DayCellData {
    const dateStr = `${cellYear}-${String(cellMonth).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return {
      date,
      year: cellYear,
      month: cellMonth,
      currentMonth,
      dateStr,
      moonPhase: fullMoonSet.has(dateStr) ? "full" : newMoonSet.has(dateStr) ? "new" : undefined,
      movies: movieMap.get(dateStr) ?? [],
      solarEvent: solarEvents[dateStr],
      isToday: dateStr === todayStr,
    };
  }

  const weeks: DayCellData[][] = [];
  let currentWeek: DayCellData[] = [];

  // Previous month padding
  for (let i = 0; i < startingDay; i++) {
    const d = prevMonthDays - startingDay + i + 1;
    currentWeek.push(makeCell(d, prevYear, prevMonthNum, false));
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(makeCell(day, year, monthIndex + 1, true));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month padding to finish the week
  let nextDay = 1;
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(makeCell(nextDay, nextYear, nextMonthNum, false));
    nextDay++;
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Always 6 weeks for consistent grid
  while (weeks.length < 6) {
    const fillWeek: DayCellData[] = [];
    for (let d = 0; d < 7; d++) {
      fillWeek.push(makeCell(nextDay, nextYear, nextMonthNum, false));
      nextDay++;
    }
    weeks.push(fillWeek);
  }

  return weeks;
}

// ─── Helpers ────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
