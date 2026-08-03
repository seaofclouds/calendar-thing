/**
 * Day view renderer.
 * A single day laid out as a pocket-notebook spread: two A6 facing pages.
 * The left page carries the narrow hour-timeline gutter and one wide day
 * column; the right page is a full ruled Notes page sharing the same hour
 * rules, so the two pages line up when the notebook is open.
 *
 *   Left page:  [ ‖ <day> ]    (‖ = narrow timeline gutter)
 *   Right page: [ Notes ]
 *
 * Feed events are all-day (CalendarEvent has no time), so they sit in an
 * "all-day" band beneath the day header. The hour grid below is left empty
 * for handwriting, with rules aligned to the timeline labels in the gutter.
 */

import type { CalendarEvent } from "@calendar-feeds/shared";
import { buildMarkerMap } from "./render-utils";
import {
  type Column,
  type DayInfo,
  HOUR_START,
  HOUR_END,
  toDateStr,
  renderColumnHeaders,
  renderAllDayRow,
  renderHourRows,
} from "./render-week";

const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface DayViewOptions {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  size?: string;
  markers: CalendarEvent[];
  events?: CalendarEvent[];
  borders: boolean;
  testing: boolean;
  forExport: boolean;
  queryString?: string;
  urlPrefix?: string;
  margin?: string;
  dataSource?: string;
}

export function renderDayViewFragment(opts: DayViewOptions): string {
  const size = opts.size ?? "a6";
  const isPreview = opts.forExport;

  const now = new Date();
  const todayStr = toDateStr(now);

  const markersByDate = buildMarkerMap(opts.markers);
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of opts.events ?? []) {
    const existing = eventsByDate.get(e.date) ?? [];
    existing.push(e);
    eventsByDate.set(e.date, existing);
  }

  const d = new Date(opts.year, opts.month - 1, opts.day);
  const dateStr = toDateStr(d);
  const dayInfo: DayInfo = {
    dateStr,
    weekday: d.getDay(),
    dateNum: d.getDate(),
    monthIndex: d.getMonth(),
    markers: markersByDate.get(dateStr) ?? [],
    events: eventsByDate.get(dateStr) ?? [],
  };

  const hours: number[] = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  // Left page: timeline gutter + the day. Right page: a full Notes page.
  const leftColumns: Column[] = [{ kind: "timeline" }, { kind: "day", day: dayInfo }];
  const rightColumns: Column[] = [{ kind: "notes" }];

  const pageClasses = [
    "page",
    `size-${size.toLowerCase()}`,
    "orientation-portrait",
    isPreview ? "print" : "",
  ].filter(Boolean).join(" ");

  const viewClasses = [
    "week-view",
    "day-view",
    isPreview ? "print" : "",
    opts.testing ? "testing" : "",
    opts.borders ? "borders" : "",
  ].filter(Boolean).join(" ");

  const marginStyle = opts.margin ? ` style="padding: ${opts.margin}"` : "";

  const renderPage = (columns: Column[], side: "day-left" | "day-right"): string => {
    return `<div class="${pageClasses}">
      <main class="${viewClasses}"${marginStyle} data-week-todaystr="${todayStr}">
        <div class="week-grid ${side}" style="--week-hours: ${hours.length}">
${renderColumnHeaders(columns, todayStr)}
${renderAllDayRow(columns)}
${renderHourRows(columns, hours)}
        </div>
      </main>
    </div>`;
  };

  // Screen-only navigation: previous / next day and a title that steps back up
  // to the week containing this day.
  const qs = opts.queryString ?? "";
  const prefix = opts.urlPrefix ?? "";
  const prevDay = new Date(d);
  prevDay.setDate(d.getDate() - 1);
  const nextDay = new Date(d);
  nextDay.setDate(d.getDate() + 1);
  const dayUrl = (x: Date) =>
    `${prefix}/${x.getFullYear()}/${String(x.getMonth() + 1).padStart(2, "0")}/${String(x.getDate()).padStart(2, "0")}/day${qs}`;
  const weekUrl = `${prefix}/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}${qs}`;

  const title = `${FULL_DAY_NAMES[d.getDay()]}, ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;

  const nav = `      <nav class="week-nav">
        <a href="${dayUrl(prevDay)}" class="week-nav-arrow prev" aria-label="Previous day"></a>
        <a href="${weekUrl}" class="week-nav-title">${title}</a>
        <a href="${dayUrl(nextDay)}" class="week-nav-arrow next" aria-label="Next day"></a>
      </nav>`;

  return `<div id="root" class="week-root day-root size-${size.toLowerCase()}${isPreview ? " print" : ""}">
${nav}
      <div class="week-spread">
${renderPage(leftColumns, "day-left")}
${renderPage(rightColumns, "day-right")}
      </div>
    </div>`;
}

export function renderDayView(opts: DayViewOptions): string {
  const d = new Date(opts.year, opts.month - 1, opts.day);
  const title = `${FULL_DAY_NAMES[d.getDay()]}, ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body${opts.dataSource ? ` data-source="${opts.dataSource}"` : ""}>
  ${renderDayViewFragment(opts)}
</body>
</html>`;
}
