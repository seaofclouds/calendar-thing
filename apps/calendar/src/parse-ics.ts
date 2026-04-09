/**
 * Minimal ICS parser — extracts VEVENT blocks into CalendarEvent[].
 * Not a full RFC 5545 parser; handles the common patterns used by
 * our feed workers and most external calendar feeds.
 */

import type { CalendarEvent } from "@calendar-feeds/feed-types";

export function parseICS(ics: string, category = "event"): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const blocks = ics.split("BEGIN:VEVENT");

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split("END:VEVENT")[0];
    const event = parseVEvent(block, category);
    if (event) events.push(event);
  }

  return events;
}

function parseVEvent(block: string, category: string): CalendarEvent | null {
  const uid = getField(block, "UID");
  const summary = getField(block, "SUMMARY");
  const dtstart = parseDTStart(block);

  if (!summary || !dtstart) return null;

  return {
    uid: uid ?? `${category}-${dtstart}-${summary}`,
    date: dtstart,
    summary: unescapeICS(summary),
    description: unescapeICS(getField(block, "DESCRIPTION") ?? "") || undefined,
    url: getField(block, "URL") ?? undefined,
    allDay: true,
    category,
  };
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

/** Parse DTSTART into YYYY-MM-DD format */
function parseDTStart(block: string): string | null {
  // Try DTSTART;VALUE=DATE:YYYYMMDD
  const dateOnly = block.match(/DTSTART;VALUE=DATE:(\d{8})/);
  if (dateOnly) {
    const d = dateOnly[1];
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }

  // Try DTSTART:YYYYMMDD or DTSTART:YYYYMMDDTHHmmssZ
  const datetime = block.match(/DTSTART:(\d{8})/);
  if (datetime) {
    const d = datetime[1];
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }

  return null;
}

function unescapeICS(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
