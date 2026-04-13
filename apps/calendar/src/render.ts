/**
 * Server-side HTML calendar renderer.
 * Replaces the React Calendar.tsx component with plain template strings.
 */

import { getPageLayout } from "./page-config";
import { MONTH_NAMES, WEEK_DAYS, buildMarkerMap } from "./render-utils";
import type { CalendarEvent } from "@calendar-feeds/shared";

export interface RenderOptions {
  year: number;
  size?: string;
  orientation: "portrait" | "landscape";
  rows?: number;
  header: boolean;
  testing: boolean;
  forExport: boolean;
  format?: "png" | "jpg";
  dpi?: number;
  markers: CalendarEvent[];
  queryString?: string;
  dataSource?: string;
  urlPrefix?: string;
  margin?: string;
}

interface DayData {
  date: number;
  currentMonth: boolean;
  markers?: CalendarEvent[];
  isToday?: boolean;
}

interface MonthData {
  name: string;
  year: number;
  monthIndex: number; // 0-based
  weeks: DayData[][];
}

export function renderCalendarFragment(opts: RenderOptions): string {
  const layout = getPageLayout(opts.size ?? "letter", opts.orientation);
  const actualRows = opts.rows ?? layout.rows;
  const totalMonths = actualRows * layout.columns;
  const isPreview = opts.forExport;

  const markersByDate = buildMarkerMap(opts.markers);
  const months = generateMonths(opts.year, totalMonths, markersByDate);

  const calendarClasses = [
    "year-view",
    isPreview ? "print" : "",
    opts.testing ? "testing" : "",
  ].filter(Boolean).join(" ");

  const rootClasses = [
    opts.size ? `size-${opts.size.toLowerCase()}` : "",
    `orientation-${opts.orientation}`,
    isPreview ? "print" : "",
  ].filter(Boolean).join(" ");

  const printColumns = layout.columns;

  // Data attributes for client-side image export
  const dataAttrs = opts.format
    ? ` data-format="${opts.format}" data-dpi="${opts.dpi ?? 300}" data-year="${opts.year}" data-size="${opts.size ?? "letter"}" data-orientation="${opts.orientation}"`
    : "";

  const prefix = opts.urlPrefix ?? "";

  return `<div id="root" class="${rootClasses}">
    <main class="${calendarClasses}" style="--print-columns: ${printColumns}${opts.margin ? `; padding: ${opts.margin}` : ""}"${dataAttrs}>
      ${opts.header ? `<header class="view-header">
        <a href="${prefix}/${opts.year - 1}${opts.queryString ?? ""}" class="year-nav prev" aria-label="Previous year"></a>
        <h1><a href="${prefix}/${new Date().getFullYear()}${opts.queryString ?? ""}">${opts.year}</a></h1>
        <a href="${prefix}/${opts.year + 1}${opts.queryString ?? ""}" class="year-nav next" aria-label="Next year"></a>
      </header>` : ""}
      <section class="year-grid">
        ${months.map((m) => renderMonth(m, opts.queryString, prefix)).join("\n        ")}
      </section>
    </main>
  </div>`;
}

export function renderCalendar(opts: RenderOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar ${opts.year}</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body${opts.dataSource ? ` data-source="${opts.dataSource}"` : ""}>
  ${renderCalendarFragment(opts)}
</body>
</html>`;
}

function renderMonth(month: MonthData, queryString?: string, urlPrefix?: string): string {
  const qs = queryString ?? "";
  const monthUrl = `${urlPrefix ?? ""}/${month.year}/${String(month.monthIndex + 1).padStart(2, "0")}${qs}`;
  return `<a href="${monthUrl}" class="month-link">
          <article class="month">
          <header class="month-header"><h2>${month.name}</h2></header>
          <div class="weekdays">
            ${WEEK_DAYS.map((d) => `<div class="weekday">${d}</div>`).join("")}
          </div>
          <section class="month-grid">
            ${month.weeks.map((week) => `<div class="week">${week.map(renderDay).join("")}</div>`).join("\n            ")}
          </section>
        </article></a>`;
}

function formatDate(date: number): string {
  const leading = date < 10 ? `<span class="date-leading-zero">0</span>` : "";
  return `<span class="date">${leading}${date}</span>`;
}

function renderDay(day: DayData): string {
  const classes = `day${!day.currentMonth ? " other-month" : ""}${day.isToday ? " today" : ""}`;

  let content: string;
  if (!day.currentMonth) {
    content = formatDate(day.date);
  } else if (day.markers && day.markers.length > 0) {
    content = day.markers[0].emoji || formatDate(day.date);
  } else {
    content = formatDate(day.date);
  }

  return `<div class="${classes}">${content}</div>`;
}

function generateMonths(
  baseYear: number,
  totalMonths: number,
  markersByDate: Map<string, CalendarEvent[]>,
): MonthData[] {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return Array.from({ length: totalMonths }, (_, i) => {
    const monthIndex = i % 12;
    const yearOffset = Math.floor(i / 12);
    const year = baseYear + yearOffset;

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const prevMonthLastDay = new Date(year, monthIndex, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const prevMonthDays = prevMonthLastDay.getDate();

    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Previous month padding days
    for (let i = 0; i < startingDay; i++) {
      currentWeek.push({
        date: prevMonthDays - startingDay + i + 1,
        currentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      currentWeek.push({
        date: day,
        currentMonth: true,
        markers: markersByDate.get(dateStr),
        isToday: dateStr === todayStr,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Next month padding days
    let nextDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: nextDay++,
        currentMonth: false,
      });
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Ensure 6 weeks for consistent grid
    while (weeks.length < 6) {
      const fillWeek: DayData[] = [];
      for (let d = 0; d < 7; d++) {
        fillWeek.push({
          date: nextDay++,
          currentMonth: false,
        });
      }
      weeks.push(fillWeek);
    }

    return {
      name: MONTH_NAMES[monthIndex],
      year,
      monthIndex,
      weeks,
    };
  });
}
