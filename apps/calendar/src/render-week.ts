/**
 * Week view renderer.
 * A week spread laid out for a pocket notebook: two A6 facing pages. All seven
 * days run Sunday → Saturday, four days to a page. A narrow hour-timeline
 * gutter runs down the left edge of the left page; the last column on the
 * right page is left blank for notes.
 *
 *   Left page:  [ ‖ Sun | Mon | Tue | Wed ]   (‖ = narrow timeline gutter)
 *   Right page: [ Thu | Fri | Sat | Notes ]
 *
 * Feed events are all-day (CalendarEvent has no time), so they sit in an
 * "all-day" band beneath each day header. The hour grid below is left empty
 * for handwriting, with rules aligned to the timeline labels in the gutter.
 */

import type { CalendarEvent } from "@calendar-feeds/shared";
import { escapeHtml, escapeAttr, buildMarkerMap } from "./render-utils";

const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Timeline range (inclusive). Tuned to fit an A6 page height comfortably. */
export const HOUR_START = 6;
export const HOUR_END = 23;

/** Weekday indices to show as day columns (0 = Sunday). Sunday → Saturday. */
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6];

/** Max all-day events shown per day before truncation. */
const MAX_DAY_EVENTS = 3;

export interface WeekViewOptions {
  /** Anchor date — the week shown is the one containing this date. */
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

export interface DayInfo {
  dateStr: string; // YYYY-MM-DD
  weekday: number; // 0-6
  dateNum: number;
  monthIndex: number; // 0-11
  markers: CalendarEvent[];
  events: CalendarEvent[];
}

export type Column =
  | { kind: "timeline" }
  | { kind: "day"; day: DayInfo }
  | { kind: "notes" };

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 12-hour compact label: 6 → "6a", 12 → "12p", 13 → "1p", 0 → "12a". */
function formatHour(h: number): string {
  const period = h < 12 ? "a" : "p";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${period}`;
}

export function renderWeekViewFragment(opts: WeekViewOptions): string {
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

  // Find the Sunday that starts the week containing the anchor date.
  const anchor = new Date(opts.year, opts.month - 1, opts.day);
  const weekStart = new Date(anchor);
  weekStart.setDate(anchor.getDate() - anchor.getDay());

  const days: DayInfo[] = DAY_INDICES.map((offset) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + offset);
    const dateStr = toDateStr(d);
    return {
      dateStr,
      weekday: d.getDay(),
      dateNum: d.getDate(),
      monthIndex: d.getMonth(),
      markers: markersByDate.get(dateStr) ?? [],
      events: eventsByDate.get(dateStr) ?? [],
    };
  });

  const hours: number[] = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  // Split the seven days four-to-a-page. The left page carries a narrow
  // timeline gutter before its four days; the right page ends with Notes.
  const leftColumns: Column[] = [
    { kind: "timeline" },
    ...days.slice(0, 4).map((day): Column => ({ kind: "day", day })),
  ];
  const rightColumns: Column[] = [
    ...days.slice(4, 7).map((day): Column => ({ kind: "day", day })),
    { kind: "notes" },
  ];

  const pageClasses = [
    "page",
    `size-${size.toLowerCase()}`,
    "orientation-portrait",
    isPreview ? "print" : "",
  ].filter(Boolean).join(" ");

  const viewClasses = [
    "week-view",
    isPreview ? "print" : "",
    opts.testing ? "testing" : "",
    opts.borders ? "borders" : "",
  ].filter(Boolean).join(" ");

  const marginStyle = opts.margin ? ` style="padding: ${opts.margin}"` : "";

  // Day headers drill into the single-day view on the interactive page only;
  // in exports the anchors would just bake dead links into the image.
  const qsForLinks = opts.queryString ?? "";
  const prefixForLinks = opts.urlPrefix ?? "";
  const dayLink: DayHeaderLink | undefined = isPreview
    ? undefined
    : { prefix: prefixForLinks, qs: qsForLinks };

  const renderPage = (columns: Column[], side: "left" | "right"): string => {
    return `<div class="${pageClasses}">
      <main class="${viewClasses}"${marginStyle} data-week-todaystr="${todayStr}">
        <div class="week-grid ${side}" style="--week-hours: ${hours.length}">
${renderColumnHeaders(columns, todayStr, dayLink)}
${renderAllDayRow(columns)}
${renderHourRows(columns, hours)}
        </div>
      </main>
    </div>`;
  };

  // Screen-only navigation: previous / next week and a title with the range.
  const qs = opts.queryString ?? "";
  const prefix = opts.urlPrefix ?? "";
  const prevAnchor = new Date(weekStart);
  prevAnchor.setDate(weekStart.getDate() - 7);
  const nextAnchor = new Date(weekStart);
  nextAnchor.setDate(weekStart.getDate() + 7);
  const weekUrl = (d: Date) =>
    `${prefix}/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}${qs}`;
  const monthUrl = `${prefix}/${weekStart.getFullYear()}/${String(weekStart.getMonth() + 1).padStart(2, "0")}${qs}`;

  const lastDay = days[days.length - 1];
  const rangeLabel = formatRange(weekStart, lastDay);

  const nav = `      <nav class="week-nav">
        <a href="${weekUrl(prevAnchor)}" class="week-nav-arrow prev" aria-label="Previous week"></a>
        <a href="${monthUrl}" class="week-nav-title">${rangeLabel}</a>
        <a href="${weekUrl(nextAnchor)}" class="week-nav-arrow next" aria-label="Next week"></a>
      </nav>`;

  return `<div id="root" class="week-root size-${size.toLowerCase()}${isPreview ? " print" : ""}">
${nav}
      <div class="week-spread">
${renderPage(leftColumns, "left")}
${renderPage(rightColumns, "right")}
      </div>
    </div>`;
}

export function renderWeekView(opts: WeekViewOptions): string {
  const anchor = new Date(opts.year, opts.month - 1, opts.day);
  const weekStart = new Date(anchor);
  weekStart.setDate(anchor.getDate() - anchor.getDay());
  const title = `Week of ${MONTH_ABBR[weekStart.getMonth()]} ${weekStart.getDate()}, ${weekStart.getFullYear()}`;

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
  ${renderWeekViewFragment(opts)}
</body>
</html>`;
}

/** "Jan 4 – 10, 2026" or "Nov 30 – Dec 6, 2025" spanning a month boundary. */
function formatRange(start: Date, lastDay: DayInfo): string {
  const startMonth = MONTH_ABBR[start.getMonth()];
  const endMonth = MONTH_ABBR[lastDay.monthIndex];
  // The week spans at most one month boundary; the only year rollover is Dec → Jan.
  const endYear = start.getMonth() === 11 && lastDay.monthIndex === 0
    ? start.getFullYear() + 1
    : start.getFullYear();
  if (start.getMonth() === lastDay.monthIndex) {
    return `${startMonth} ${start.getDate()} – ${lastDay.dateNum}, ${endYear}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${lastDay.dateNum}, ${endYear}`;
}

/** When set, day headers become links that drill into the single-day view. */
export interface DayHeaderLink {
  prefix: string;
  qs: string;
}

export function renderColumnHeaders(
  columns: Column[],
  todayStr: string,
  dayLink?: DayHeaderLink,
): string {
  return columns.map((col) => {
    if (col.kind === "timeline") {
      return `          <div class="wk-cell wk-corner"></div>`;
    }
    if (col.kind === "notes") {
      return `          <div class="wk-cell wk-dayhead wk-noteshead"><span class="wk-dayname">Notes</span></div>`;
    }
    const { day } = col;
    const isToday = day.dateStr === todayStr ? " today" : "";
    const markers = day.markers.map((m) => m.emoji).filter(Boolean).join("");
    const markerHtml = markers ? `<span class="wk-markers">${markers}</span>` : "";
    const inner = `
            <span class="wk-dayname">${SHORT_DAY_NAMES[day.weekday]}</span>
            <span class="wk-daydate">${day.dateNum}</span>
            ${markerHtml}
          `;
    if (dayLink) {
      const [y, m, d] = day.dateStr.split("-");
      const href = `${dayLink.prefix}/${y}/${m}/${d}/day${dayLink.qs}`;
      return `          <a class="wk-cell wk-dayhead wk-dayhead-link${isToday}" href="${href}">${inner}</a>`;
    }
    return `          <div class="wk-cell wk-dayhead${isToday}">${inner}</div>`;
  }).join("\n");
}

export function renderAllDayRow(columns: Column[]): string {
  return columns.map((col) => {
    if (col.kind === "timeline") {
      return `          <div class="wk-cell wk-allday-label"></div>`;
    }
    if (col.kind === "notes") {
      return `          <div class="wk-cell wk-allday"></div>`;
    }
    const items = col.day.events
      .slice(0, MAX_DAY_EVENTS)
      .map((e) => {
        const icon = e.emoji ? `<span class="wk-event-icon">${e.emoji}</span>` : "";
        return `<li class="wk-event" title="${escapeAttr(e.summary)}">${icon}${escapeHtml(e.summary)}</li>`;
      })
      .join("");
    const list = items ? `<ul class="wk-events">${items}</ul>` : "";
    return `          <div class="wk-cell wk-allday">${list}</div>`;
  }).join("\n");
}

export function renderHourRows(columns: Column[], hours: number[]): string {
  const rows: string[] = [];
  for (const h of hours) {
    for (const col of columns) {
      if (col.kind === "timeline") {
        rows.push(`          <div class="wk-cell wk-hour"><span class="wk-hour-label">${formatHour(h)}</span></div>`);
      } else {
        rows.push(`          <div class="wk-cell wk-slot"></div>`);
      }
    }
  }
  return rows.join("\n");
}
