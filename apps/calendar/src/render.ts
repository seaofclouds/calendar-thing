/**
 * Server-side HTML calendar renderer.
 * Replaces the React Calendar.tsx component with plain template strings.
 */

import { getPageLayout } from "./config";

export interface RenderOptions {
  year: number;
  size: string;
  orientation: "portrait" | "landscape";
  rows?: number;
  header: boolean;
  testing: boolean;
  forExport: boolean;
  format?: "png" | "jpg";
  dpi?: number;
  fullMoonDates: string[];
  newMoonDates: string[];
  solarEvents: Record<string, "solstice" | "equinox">;
}

interface DayData {
  date: number;
  currentMonth: boolean;
  moonPhase?: "full" | "new";
  isSpecialDay?: "solstice" | "equinox";
}

interface MonthData {
  name: string;
  weeks: DayData[][];
}

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function renderCalendar(opts: RenderOptions): string {
  const layout = getPageLayout(opts.size, opts.orientation);
  const actualRows = opts.rows ?? layout.rows;
  const totalMonths = actualRows * layout.columns;
  const isPreview = opts.forExport || opts.size !== "letter" || opts.testing;

  const months = generateMonths(opts.year, totalMonths, opts.fullMoonDates, opts.newMoonDates, opts.solarEvents);

  const calendarClasses = [
    "calendar",
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
    ? ` data-format="${opts.format}" data-dpi="${opts.dpi ?? 300}" data-year="${opts.year}" data-size="${opts.size}" data-orientation="${opts.orientation}"`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar ${opts.year}</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body>
  <div id="root" class="${rootClasses}">
    <div class="${calendarClasses}" style="--print-columns: ${printColumns}"${dataAttrs}>
      ${opts.header ? `<div class="calendar-header"><h1>${opts.year}</h1></div>` : ""}
      <div class="calendar-grid">
        ${months.map(renderMonth).join("\n        ")}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderMonth(month: MonthData): string {
  return `<div class="month">
          <div class="month-header"><h2>${month.name}</h2></div>
          <div class="week-days">
            ${WEEK_DAYS.map((d) => `<h3 class="week-day">${d}</h3>`).join("")}
          </div>
          <div class="month-grid">
            ${month.weeks.flat().map(renderDay).join("")}
          </div>
        </div>`;
}

function renderDay(day: DayData): string {
  const classes = `calendar-day${!day.currentMonth ? " other-month" : ""}`;

  let content: string;
  if (!day.currentMonth) {
    content = `<span class="date">${day.date}</span>`;
  } else if (day.moonPhase === "full") {
    content = `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="black" stroke="black" stroke-width="1"/></svg>`;
  } else if (day.moonPhase === "new") {
    content = `<svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="white" stroke="black" stroke-width="1"/></svg>`;
  } else if (day.isSpecialDay) {
    content = `<div class="day-marker-${day.isSpecialDay}"></div>`;
  } else {
    content = `<span class="date">${day.date}</span>`;
  }

  return `<div class="${classes}">${content}</div>`;
}

function generateMonths(
  baseYear: number,
  totalMonths: number,
  fullMoonDates: string[],
  newMoonDates: string[],
  solarEvents: Record<string, "solstice" | "equinox">
): MonthData[] {
  const fullMoonSet = new Set(fullMoonDates);
  const newMoonSet = new Set(newMoonDates);

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
        moonPhase: fullMoonSet.has(dateStr) ? "full" : newMoonSet.has(dateStr) ? "new" : undefined,
        isSpecialDay: solarEvents[dateStr],
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
      weeks,
    };
  });
}
