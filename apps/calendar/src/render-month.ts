/**
 * Month view renderer.
 * Renders a single month as a bordered table with full day names,
 * all moon phases, movie releases, solar events, and mini prev/next calendars.
 */

import { getPageLayout } from "./config";
import type { MoonPhaseEntry, MovieRelease } from "./types";

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
  allPhases: MoonPhaseEntry[];
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

interface DayCellData {
  date: number;
  currentMonth: boolean;
  dateStr: string; // YYYY-MM-DD
  phases: MoonPhaseEntry[];
  movies: MovieRelease[];
  solarEvent?: "solstice" | "equinox";
  isToday: boolean;
}

export function renderMonthView(opts: MonthViewOptions): string {
  const monthIndex = opts.month - 1; // 0-based
  const isPreview = opts.forExport;

  const weeks = generateMonthWeeks(opts.year, monthIndex, opts.allPhases, opts.movieReleases, opts.solarEvents);

  // Build phase lookup for quick access
  const prevMonth = monthIndex === 0 ? { year: opts.year - 1, month: 11 } : { year: opts.year, month: monthIndex - 1 };
  const nextMonth = monthIndex === 11 ? { year: opts.year + 1, month: 0 } : { year: opts.year, month: monthIndex + 1 };

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

  // Data attributes for client-side image export
  const dataAttrs = opts.format
    ? ` data-format="${opts.format}" data-dpi="${opts.dpi ?? 300}" data-year="${opts.year}" data-size="${opts.size ?? "letter"}" data-orientation="${opts.orientation}"`
    : "";

  const prevMonthName = MONTH_NAMES[prevMonth.month];
  const nextMonthName = MONTH_NAMES[nextMonth.month];
  const currentMonthName = MONTH_NAMES[monthIndex];

  // Navigation URLs
  const prevUrl = `/${prevMonth.year}/${String(prevMonth.month + 1).padStart(2, "0")}`;
  const nextUrl = `/${nextMonth.year}/${String(nextMonth.month + 1).padStart(2, "0")}`;
  const yearUrl = `/${opts.year}`;

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
          <a href="${yearUrl}" class="month-view-year-link">${currentMonthName}</a>
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

  const phaseIcons = day.phases.map((p) => renderPhaseIcon(p)).join("");
  const solarIcon = day.solarEvent ? renderSolarIcon(day.solarEvent) : "";
  const movieItems = day.movies.map((m) =>
    `<span class="day-event movie-event" title="${escapeAttr(m.title)}">${escapeHtml(m.title)}</span>`
  ).join("");

  const hasEvents = day.phases.length > 0 || day.movies.length > 0 || day.solarEvent;

  return `            <td class="${classes}">
              <div class="day-cell-inner">
                <div class="day-cell-header">
                  <span class="day-number">${day.date}</span>
                  <span class="day-indicators">${phaseIcons}${solarIcon}</span>
                </div>${hasEvents ? `
                <div class="day-cell-events">
${day.phases.map((p) => `                  <span class="day-event phase-event" title="${escapeAttr(p.name)}">${p.emoji} ${escapeHtml(p.name)}</span>`).join("\n")}
${day.solarEvent ? `                  <span class="day-event solar-event">${day.solarEvent === "solstice" ? "\u{25C6}" : "\u{25C7}"} ${capitalize(day.solarEvent)}</span>` : ""}
${movieItems ? `                  ${movieItems}` : ""}
                </div>` : ""}
              </div>
            </td>`;
}

function renderPhaseIcon(phase: MoonPhaseEntry): string {
  const svgMap: Record<string, string> = {
    new_moon: `<svg class="phase-indicator phase-new" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="black" stroke="black" stroke-width="1.5"/></svg>`,
    first_quarter: `<svg class="phase-indicator phase-first-quarter" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 1.5 A8.5 8.5 0 0 0 10 18.5 L10 1.5Z" fill="black"/></svg>`,
    full_moon: `<svg class="phase-indicator phase-full" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="1.5"/></svg>`,
    last_quarter: `<svg class="phase-indicator phase-last-quarter" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 1.5 A8.5 8.5 0 0 1 10 18.5 L10 1.5Z" fill="black"/></svg>`,
  };
  return svgMap[phase.phase] ?? "";
}

function renderSolarIcon(event: "solstice" | "equinox"): string {
  if (event === "solstice") {
    return `<span class="solar-indicator solstice" title="Solstice">\u{25C6}</span>`;
  }
  return `<span class="solar-indicator equinox" title="Equinox">\u{25C7}</span>`;
}

function renderMiniCalendar(year: number, monthIndex: number, monthName: string): string {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  const yearSuffix = year !== new Date().getFullYear() ? ` ${year}` : "";

  let html = `            <div class="mini-cal-title">${monthName}${yearSuffix}</div>\n`;
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

function generateMonthWeeks(
  year: number,
  monthIndex: number,
  allPhases: MoonPhaseEntry[],
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

  // Build lookup maps by date string
  const phaseMap = new Map<string, MoonPhaseEntry[]>();
  for (const p of allPhases) {
    const existing = phaseMap.get(p.date) ?? [];
    existing.push(p);
    phaseMap.set(p.date, existing);
  }

  const movieMap = new Map<string, MovieRelease[]>();
  for (const m of movieReleases) {
    const existing = movieMap.get(m.date) ?? [];
    existing.push(m);
    movieMap.set(m.date, existing);
  }

  const weeks: DayCellData[][] = [];
  let currentWeek: DayCellData[] = [];

  // Previous month padding
  for (let i = 0; i < startingDay; i++) {
    const d = prevMonthDays - startingDay + i + 1;
    const dateStr = `${prevYear}-${String(prevMonthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    currentWeek.push({
      date: d,
      currentMonth: false,
      dateStr,
      phases: phaseMap.get(dateStr) ?? [],
      movies: movieMap.get(dateStr) ?? [],
      solarEvent: solarEvents[dateStr],
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    currentWeek.push({
      date: day,
      currentMonth: true,
      dateStr,
      phases: phaseMap.get(dateStr) ?? [],
      movies: movieMap.get(dateStr) ?? [],
      solarEvent: solarEvents[dateStr],
      isToday: dateStr === todayStr,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month padding
  let nextDay = 1;
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    const dateStr = `${nextYear}-${String(nextMonthNum).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
    currentWeek.push({
      date: nextDay,
      currentMonth: false,
      dateStr,
      phases: phaseMap.get(dateStr) ?? [],
      movies: movieMap.get(dateStr) ?? [],
      solarEvent: solarEvents[dateStr],
      isToday: dateStr === todayStr,
    });
    nextDay++;
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Ensure at least 5 weeks for consistent layout; add 6th row if needed
  while (weeks.length < 5) {
    const fillWeek: DayCellData[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = `${nextYear}-${String(nextMonthNum).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
      fillWeek.push({
        date: nextDay,
        currentMonth: false,
        dateStr,
        phases: phaseMap.get(dateStr) ?? [],
        movies: movieMap.get(dateStr) ?? [],
        solarEvent: solarEvents[dateStr],
        isToday: dateStr === todayStr,
      });
      nextDay++;
    }
    weeks.push(fillWeek);
  }

  return weeks;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
