/**
 * Month view renderer.
 * Reuses the same HTML structure as the year view (.month, .month-grid, .calendar-day)
 * so that mini prev/next calendars and the main grid share one design system.
 */

import type { CalendarEvent } from "@calendar-feeds/feed-types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  markers: CalendarEvent[];
  borders: boolean;
  events?: CalendarEvent[];
  queryString?: string;
  dataSource?: string;
}

interface DayData {
  date: number;
  currentMonth: boolean;
  marker?: CalendarEvent;
  isToday?: boolean;
  events?: CalendarEvent[];
}

export function renderMonthView(opts: MonthViewOptions): string {
  const monthIndex = opts.month - 1;
  const isPreview = opts.forExport;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Build marker and event maps by date
  const markersByDate = new Map<string, CalendarEvent>();
  for (const m of opts.markers) {
    if (!markersByDate.has(m.date)) markersByDate.set(m.date, m);
  }
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of opts.events ?? []) {
    const existing = eventsByDate.get(e.date) ?? [];
    existing.push(e);
    eventsByDate.set(e.date, existing);
  }

  // Generate main month grid (6 weeks)
  const weeks = generateWeeks(opts.year, monthIndex, markersByDate, todayStr, eventsByDate);

  // Prev/next month info
  const prev = monthIndex === 0
    ? { year: opts.year - 1, month: 11 }
    : { year: opts.year, month: monthIndex - 1 };
  const next = monthIndex === 11
    ? { year: opts.year + 1, month: 0 }
    : { year: opts.year, month: monthIndex + 1 };

  const qs = opts.queryString ?? "";
  const prevUrl = `/${prev.year}/${String(prev.month + 1).padStart(2, "0")}${qs}`;
  const nextUrl = `/${next.year}/${String(next.month + 1).padStart(2, "0")}${qs}`;
  const yearUrl = `/${opts.year}${qs}`;

  // Mini calendar grids (reuse exact same .month structure as year view)
  const prevMiniWeeks = generateWeeks(prev.year, prev.month, markersByDate, todayStr);
  const nextMiniWeeks = generateWeeks(next.year, next.month, markersByDate, todayStr);

  const rootClasses = [
    opts.size ? `size-${opts.size.toLowerCase()}` : "",
    `orientation-${opts.orientation}`,
    isPreview ? "print" : "",
  ].filter(Boolean).join(" ");

  const containerClasses = [
    "month-view",
    isPreview ? "print" : "",
    opts.testing ? "testing" : "",
    opts.borders ? "borders" : "",
  ].filter(Boolean).join(" ");

  const dataAttrs = opts.format
    ? ` data-format="${opts.format}" data-dpi="${opts.dpi ?? 300}" data-year="${opts.year}" data-size="${opts.size ?? "letter"}" data-orientation="${opts.orientation}"`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${MONTH_NAMES[monthIndex]} ${opts.year}</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body${opts.dataSource ? ` data-source="${opts.dataSource}"` : ""}>
  <div id="root" class="${rootClasses}">
    <div class="${containerClasses}"${dataAttrs}>
      <div class="month-view-header">
        <div class="month-view-nav">
          <a href="${prevUrl}" class="mini-calendar" aria-label="Previous month: ${MONTH_NAMES[prev.month]}">
${renderMiniMonth(MONTH_NAMES[prev.month] + (prev.year !== opts.year ? ` ${prev.year}` : ""), prevMiniWeeks)}
          </a>
        </div>
        <h1 class="month-view-title"><a href="${yearUrl}">${MONTH_NAMES[monthIndex]}</a></h1>
        <div class="month-view-nav">
          <a href="${nextUrl}" class="mini-calendar" aria-label="Next month: ${MONTH_NAMES[next.month]}">
${renderMiniMonth(MONTH_NAMES[next.month] + (next.year !== opts.year ? ` ${next.year}` : ""), nextMiniWeeks)}
          </a>
        </div>
      </div>
      <div class="month-view-grid">
        <div class="month-view-daynames">
${FULL_DAY_NAMES.map((d, i) => `          <div class="month-view-dayname"><span class="dayname-full">${d}</span><span class="dayname-short">${SHORT_DAY_NAMES[i]}</span></div>`).join("\n")}
        </div>
        <div class="month-view-days">
${renderWeeks(weeks)}
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Renders a mini calendar as a single flat 7-column grid */
function renderMiniMonth(title: string, weeks: DayData[][]): string {
  const titleCell = `<div class="mini-title">${title}</div>`;
  const weekdayCells = WEEK_DAYS.map((d) => `<div class="mini-weekday">${d}</div>`).join("");
  const dayCells = weeks.flat().map(renderDay).join("");
  return `            <div class="mini-grid">
              ${titleCell}
              ${weekdayCells}
              ${dayCells}
            </div>`;
}

/** Year-view style day cell (used in mini calendars) */
function renderDay(day: DayData): string {
  const classes = `calendar-day${!day.currentMonth ? " other-month" : ""}${day.isToday ? " today" : ""}`;

  let content: string;
  if (!day.currentMonth) {
    content = formatDate(day.date);
  } else if (day.marker?.emoji) {
    content = day.marker.emoji;
  } else {
    content = formatDate(day.date);
  }

  return `<div class="${classes}">${content}</div>`;
}

function formatDate(date: number): string {
  const leading = date < 10 ? `<span class="date-leading-zero">0</span>` : "";
  return `<span class="date">${leading}${date}</span>`;
}

/** Render all weeks, marking rows that contain current-month days */
function renderWeeks(weeks: DayData[][]): string {
  return weeks.map((week) => {
    const rowHasCurrent = week.some((d) => d.currentMonth);
    return week.map((day) => renderDayCell(day, rowHasCurrent)).join("\n");
  }).join("\n");
}

/** Main month grid day cell — with event markers right-aligned */
function renderDayCell(day: DayData, rowHasCurrent: boolean): string {
  const classes = [
    "month-day",
    !day.currentMonth ? "other-month" : "",
    day.isToday ? "today" : "",
    rowHasCurrent ? "current-row" : "",
  ].filter(Boolean).join(" ");

  const dayNum = `<span class="month-day-number">${day.date}</span>`;

  // Right-aligned indicator (day-marker events like moon phase or solar event)
  const indicator = day.marker?.emoji ?? "";

  // Event text (left-aligned, max 3)
  const eventHtml = (day.events ?? [])
    .slice(0, 3)
    .map((e) => {
      const icon = e.emoji ?? "";
      const text = escapeHtml(e.summary);
      return `<span class="month-day-event" title="${escapeAttr(e.summary)}">${icon}${text}</span>`;
    })
    .join("\n            ");

  return `          <div class="${classes}">
            <div class="month-day-header">
              ${dayNum}
              ${indicator}
            </div>
            ${eventHtml}
          </div>`;
}

function generateWeeks(
  year: number,
  monthIndex: number,
  markersByDate: Map<string, CalendarEvent>,
  todayStr: string,
  eventsByDate?: Map<string, CalendarEvent[]>,
): DayData[][] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const prevMonthLastDay = new Date(year, monthIndex, 0);

  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevMonthDays = prevMonthLastDay.getDate();

  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  for (let i = 0; i < startingDay; i++) {
    currentWeek.push({
      date: prevMonthDays - startingDay + i + 1,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    currentWeek.push({
      date: day,
      currentMonth: true,
      marker: markersByDate.get(dateStr),
      isToday: dateStr === todayStr,
      events: eventsByDate?.get(dateStr),
    });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  let nextDay = 1;
  while (currentWeek.length < 7) {
    currentWeek.push({ date: nextDay++, currentMonth: false });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  while (weeks.length < 6) {
    const fillWeek: DayData[] = [];
    for (let d = 0; d < 7; d++) {
      fillWeek.push({ date: nextDay++, currentMonth: false });
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
