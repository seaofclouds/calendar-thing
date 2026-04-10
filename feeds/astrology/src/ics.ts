/**
 * ICS (RFC 5545) calendar generation from zodiac season data.
 */

import {
  escapeICS,
  formatICSTimestamp,
  formatICSDateValue,
  wrapVCalendar,
  buildVEvent,
} from "@calendar-feeds/shared";
import type { ZodiacEvent } from "./zodiac";
import { formatSeasonRange } from "./zodiac";

export function generateICS(events: ZodiacEvent[]): string {
  const now = formatICSTimestamp(new Date());
  const entries = events.map((e) => generateZodiacEvent(e, now));

  return wrapVCalendar({
    prodId: "-//Astrology Calendar//EN",
    calName: "\u264B\uFE0F Astrology",
    events: entries,
  });
}

function generateZodiacEvent(event: ZodiacEvent, timestamp: string): string {
  const { sign, startDate } = event;
  const dateStr = formatICSDateValue(startDate);
  const range = formatSeasonRange(sign);
  const summary = `${sign.emoji} ${sign.name} Season (${range})`;

  return buildVEvent({
    uid: `zodiac-${sign.name.toLowerCase()}-${dateStr}@astrology-calendar`,
    dtstamp: timestamp,
    dtstart: dateStr,
    summary: escapeICS(summary),
    description: escapeICS(
      [`${sign.name} Season`, `${range}`, `Symbol: ${sign.emoji}`].join("\n")
    ),
  });
}
