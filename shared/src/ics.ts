/**
 * ICS (RFC 5545) generation helpers — escaping, formatting, VEVENT/VCALENDAR builders.
 */

// --- Escaping ---

/** Escape special characters for ICS (RFC 5545) format. */
export function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

/** Truncate text to a maximum length, appending "..." if truncated. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// --- Date formatting ---

/** Format a Date to ICS timestamp format (UTC): YYYYMMDDTHHMMSSZ */
export function formatICSTimestamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Format a YYYY-MM-DD date string to ICS date format: YYYYMMDD */
export function formatICSDateValue(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

// --- VEVENT builder ---

export interface VEventOptions {
  uid: string;
  dtstamp: string;
  dtstart: string;
  dtend?: string;
  summary: string;
  description?: string;
  url?: string;
  transp?: string;
}

/** Build a single VEVENT block for an ICS calendar. */
export function buildVEvent(opts: VEventOptions): string {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${opts.dtstamp}`,
    `DTSTART;VALUE=DATE:${opts.dtstart}`,
    `DTEND;VALUE=DATE:${opts.dtend ?? opts.dtstart}`,
    `SUMMARY:${opts.summary}`,
  ];

  if (opts.description) {
    lines.push(`DESCRIPTION:${opts.description}`);
  }

  if (opts.url) {
    lines.push(`URL:${opts.url}`);
  }

  lines.push(`TRANSP:${opts.transp ?? "TRANSPARENT"}`);
  lines.push("END:VEVENT");

  return lines.join("\r\n");
}

// --- VCALENDAR wrapper ---

export interface VCalendarOptions {
  prodId: string;
  calName: string;
  events: string[];
}

/** Wrap VEVENT entries in a VCALENDAR container. */
export function wrapVCalendar(opts: VCalendarOptions): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${opts.prodId}`,
    `X-WR-CALNAME:${opts.calName}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...opts.events,
    "END:VCALENDAR",
  ].join("\r\n");
}
