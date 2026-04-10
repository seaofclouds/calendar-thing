/**
 * Minimal ICS parser — extracts VEVENT blocks into CalendarEvent[].
 * Not a full RFC 5545 parser; handles the common patterns used by
 * our feed workers and most external calendar feeds.
 */

import type { CalendarEvent } from "@calendar-feeds/shared";

export function parseICS(ics: string, category = "event"): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const blocks = ics.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    events.push(...parseVEvent(block, category));
  }

  return events;
}

function parseVEvent(block: string, category: string): CalendarEvent[] {
  const uid = getField(block, "UID");
  const summary = getField(block, "SUMMARY");
  const dtstart = parseDateField(block, "DTSTART");
  const dtend = parseDateField(block, "DTEND");

  if (!summary || !dtstart) return [];

  const base = {
    summary: unescapeICS(summary),
    description: unescapeICS(getField(block, "DESCRIPTION") ?? "") || undefined,
    url: getField(block, "URL") ?? undefined,
    allDay: true,
    category,
  };

  // Expand multi-day events (DTEND is exclusive in ICS)
  const dates = expandDateRange(dtstart, dtend);
  return dates.map((date) => ({
    ...base,
    uid: (uid ?? `${category}-${dtstart}-${summary}`) + (dates.length > 1 ? `-${date}` : ""),
    date,
  }));
}

/** Extract a field value from an ICS block, handling folded lines */
function getField(block: string, name: string): string | null {
  // Match field with optional parameters (e.g., DTSTART;VALUE=DATE:20260415)
  const regex = new RegExp(`^${name}[;:](.*)`, "m");
  const match = block.match(regex);
  if (!match) return null;

  // Strip parameters prefix if present (e.g., "VALUE=DATE:20260415" → "20260415")
  let value = match[1].trim();
  const colonIdx = value.indexOf(":");
  // If the match was on a semicolon variant (DTSTART;VALUE=DATE:val), extract after colon
  if (match[0].charAt(name.length) === ";" && colonIdx !== -1) {
    value = value.substring(colonIdx + 1).trim();
  }

  // Unfold continuation lines (RFC 5545: lines starting with space/tab are continuations)
  return value.replace(/\r?\n[ \t]/g, "");
}

/** Parse a date field (DTSTART or DTEND) into YYYY-MM-DD format */
function parseDateField(block: string, field: string): string | null {
  // Try FIELD;VALUE=DATE:YYYYMMDD
  const dateOnly = block.match(new RegExp(`${field};VALUE=DATE:(\\d{8})`));
  if (dateOnly) {
    const d = dateOnly[1];
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }

  // Try FIELD:YYYYMMDD or FIELD:YYYYMMDDTHHmmssZ
  const datetime = block.match(new RegExp(`${field}:(\\d{8})`));
  if (datetime) {
    const d = datetime[1];
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }

  return null;
}

/** Expand a date range into individual YYYY-MM-DD dates. DTEND is exclusive in ICS. */
function expandDateRange(start: string, end: string | null): string[] {
  if (!end || end === start) return [start];

  const dates: string[] = [];
  const current = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");

  while (current < endDate) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    const d = String(current.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return dates.length > 0 ? dates : [start];
}

function unescapeICS(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
