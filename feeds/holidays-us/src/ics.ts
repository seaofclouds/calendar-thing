/**
 * ICS (RFC 5545) calendar generation from US holiday data.
 */

import {
  escapeICS,
  formatICSTimestamp,
  formatICSDateValue,
  wrapVCalendar,
  buildVEvent,
} from "@calendar-feeds/shared";
import type { USHoliday } from "./holidays";

export function generateICS(holidays: USHoliday[]): string {
  const now = formatICSTimestamp(new Date());
  const entries = holidays.map((h) => generateHolidayEvent(h, now));

  return wrapVCalendar({
    prodId: "-//US Holidays Calendar//EN",
    calName: "\uD83C\uDDFA\uD83C\uDDF8 US Holidays",
    events: entries,
  });
}

function generateHolidayEvent(holiday: USHoliday, timestamp: string): string {
  const dateStr = formatICSDateValue(holiday.date);

  return buildVEvent({
    uid: `holiday-us-${holiday.key}-${dateStr}@holidays-us-calendar`,
    dtstamp: timestamp,
    dtstart: dateStr,
    summary: escapeICS(holiday.name),
  });
}
