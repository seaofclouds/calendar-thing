/**
 * Moon Phase Calendar — Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for moon phases and solar events.
 */

import { authenticateToken, withEdgeCache, icsResponse, jsonResponse } from "@calendar-feeds/worker-utils";
import { computeMoonPhases, phaseName } from "./moon";
import type { MoonPhase } from "./moon";
import { computeSolarEvents } from "./solar";
import type { SolarEvent } from "./solar";
import { generateICS } from "./ics";

interface Env {
  CALENDAR_TOKEN: string;
}

const CACHE_VERSION = 2;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Root health-check
    if (url.pathname === "/") {
      return new Response("Moon Phase Calendar\n", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Only /feeds/moon.ics and /feeds/moon.json are valid endpoints
    if (url.pathname !== "/feeds/moon.ics" && url.pathname !== "/feeds/moon.json") {
      return new Response("Not Found", { status: 404 });
    }

    // Token authentication
    if (!authenticateToken(url, env.CALENDAR_TOKEN)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const requestedYear = url.searchParams.get("year");
    const year = requestedYear ? parseInt(requestedYear) : now.getUTCFullYear();

    return withEdgeCache(
      request,
      ctx,
      { version: CACHE_VERSION, extraParams: { _y: String(year) } },
      async () => {
        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
        const phases = computeMoonPhases(startDate, endDate);
        const solarEvents = computeSolarEvents(startDate, endDate);

        if (url.pathname === "/feeds/moon.ics") {
          return icsResponse(generateICS(phases, solarEvents));
        }

        // /feeds/moon.json
        const json = buildJSON(phases, solarEvents, now);
        return jsonResponse(JSON.stringify(json, null, 2));
      }
    );
  },
} satisfies ExportedHandler<Env>;

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
