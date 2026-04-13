/**
 * Astronomy Calendar — Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for moon phases and solar events.
 */

import { createFeedWorker, icsResponse, jsonResponse, errorResponse } from "@calendar-feeds/shared";
import { computeMoonPhases, phaseName } from "./moon";
import type { MoonPhase } from "./moon";
import { computeSolarEvents } from "./solar";
import type { SolarEvent } from "./solar";
import { generateICS } from "./ics";

function yearFromRequest(request: Request): number {
  const url = new URL(request.url);
  const requestedYear = url.searchParams.get("year");
  return requestedYear ? parseInt(requestedYear) : new Date().getUTCFullYear();
}

function computeYear(year: number) {
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  return {
    phases: computeMoonPhases(startDate, endDate),
    solarEvents: computeSolarEvents(startDate, endDate),
  };
}

export default createFeedWorker({
  name: "Astronomy Calendar",
  cacheVersion: 2,
  cacheParams: (request) => ({ _y: String(yearFromRequest(request)) }),
  routes: [
    {
      path: "/feeds/astronomy.ics",
      handler: async (request) => {
        try {
          const year = yearFromRequest(request);
          const { phases, solarEvents } = computeYear(year);
          return icsResponse(generateICS(phases, solarEvents));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, `Error generating calendar: ${message}`);
        }
      },
    },
    {
      path: "/feeds/astronomy.json",
      handler: async (request) => {
        try {
          const year = yearFromRequest(request);
          const { phases, solarEvents } = computeYear(year);
          const json = buildJSON(phases, solarEvents, new Date());
          return jsonResponse(JSON.stringify(json, null, 2));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, message, true);
        }
      },
    },
  ],
});

interface PhaseJSON {
  date: string;
  phase: string;
  name: string;
  emoji: string;
  illumination: number;
}

interface SolarEventJSON {
  date: string;
  event: string;
  name: string;
  emoji: string;
}

interface CalendarJSON {
  count: number;
  generated: string;
  phases: PhaseJSON[];
  solarEvents: SolarEventJSON[];
}

function buildJSON(phases: MoonPhase[], solarEvents: SolarEvent[], now: Date): CalendarJSON {
  return {
    count: phases.length + solarEvents.length,
    generated: now.toISOString(),
    phases: phases.map((p) => ({
      date: p.date,
      phase: p.phase,
      name: phaseName(p.phase),
      emoji: p.emoji,
      illumination: p.illumination,
    })),
    solarEvents: solarEvents.map((e) => ({
      date: e.date,
      event: e.event,
      name: e.name,
      emoji: e.emoji,
    })),
  };
}
