/**
 * Wrap VEVENT entries in a VCALENDAR container.
 */
export interface VCalendarOptions {
  prodId: string;
  calName: string;
  events: string[];
}

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
