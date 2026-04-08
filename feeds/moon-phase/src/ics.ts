/**
 * ICS (RFC 5545) calendar generation from moon phase and solar event data.
 * Uses shared @calendar-feeds/ics-utils for common ICS operations.
 */

import {
  escapeICS,
  formatICSTimestamp,
  formatICSDateValue,
  wrapVCalendar,
  buildVEvent,
} from "@calendar-feeds/ics-utils";
import type { MoonPhase } from "./moon";
import { phaseName, phaseEmoji } from "./moon";
import type { SolarEvent } from "./solar";

export function generateICS(phases: MoonPhase[], solarEvents: SolarEvent[]): string {
  const now = formatICSTimestamp(new Date());
  const moonEntries = phases.map((p) => generateMoonEvent(p, now));
  const solarEntries = solarEvents.map((e) => generateSolarEvent(e, now));

  return wrapVCalendar({
    prodId: "-//Moon Phase Calendar//EN",
    calName: "\uD83C\uDF17 Moon Phases",
    events: [...moonEntries, ...solarEntries],
  });
}

function generateMoonEvent(phase: MoonPhase, timestamp: string): string {
  const dateStr = formatICSDateValue(phase.date);
  const name = phaseName(phase.phase);
  const emoji = phaseEmoji(phase.phase);

  return buildVEvent({
    uid: `moon-${phase.phase}-${dateStr}@moon-phase-calendar`,
    dtstamp: timestamp,
    dtstart: dateStr,
    summary: escapeICS(`${emoji} ${name}`),
    description: escapeICS(
      [`Phase: ${name}`, `Illumination: ${phase.illumination}%`, `Date: ${phase.date}`].join("\n")
    ),
  });
}

function generateSolarEvent(event: SolarEvent, timestamp: string): string {
  const dateStr = formatICSDateValue(event.date);

  return buildVEvent({
    uid: `solar-${event.event}-${dateStr}@moon-phase-calendar`,
    dtstamp: timestamp,
    dtstart: dateStr,
    summary: escapeICS(`${event.emoji} ${event.name}`),
    description: escapeICS(
      [`Event: ${event.name}`, `Date: ${event.date}`].join("\n")
    ),
  });
}
