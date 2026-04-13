/**
 * Shared utilities for server-side HTML renderers.
 * Used by render.ts (year view), render-month.ts (month view), and render-config.ts.
 */

import type { CalendarEvent } from "@calendar-feeds/shared";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function escapeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

/** Solar events are rarer and more significant — prioritize them over lunar in compact views */
function markerPriority(e: CalendarEvent): number {
  return e.uid.startsWith("solar-") ? 0 : 1;
}

export function buildMarkerMap(markers: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const m of markers) {
    const existing = map.get(m.date);
    if (existing) existing.push(m);
    else map.set(m.date, [m]);
  }
  for (const arr of map.values()) {
    if (arr.length > 1) arr.sort((a, b) => markerPriority(a) - markerPriority(b));
  }
  return map;
}
