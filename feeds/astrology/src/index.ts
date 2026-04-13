/**
 * Astrology Calendar -- Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for zodiac season events.
 */

import { createFeedWorker, icsResponse, jsonResponse, errorResponse } from "@calendar-feeds/shared";
import { computeZodiacSeasons, formatSeasonRange } from "./zodiac";
import type { ZodiacEvent } from "./zodiac";
import { generateICS } from "./ics";

function yearFromRequest(request: Request): number {
  const url = new URL(request.url);
  const requestedYear = url.searchParams.get("year");
  return requestedYear ? parseInt(requestedYear) : new Date().getUTCFullYear();
}

export default createFeedWorker({
  name: "Astrology Calendar",
  cacheVersion: 1,
  cacheParams: (request) => ({ _y: String(yearFromRequest(request)) }),
  routes: [
    {
      path: "/feeds/astrology.ics",
      handler: async (request) => {
        try {
          const events = computeZodiacSeasons(yearFromRequest(request));
          return icsResponse(generateICS(events));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, `Error generating calendar: ${message}`);
        }
      },
    },
    {
      path: "/feeds/astrology.json",
      handler: async (request) => {
        try {
          const events = computeZodiacSeasons(yearFromRequest(request));
          return jsonResponse(JSON.stringify(buildJSON(events, new Date()), null, 2));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, message, true);
        }
      },
    },
  ],
});

interface ZodiacJSON {
  count: number;
  generated: string;
  events: {
    sign: string;
    emoji: string;
    startDate: string;
    endDate: string;
    range: string;
  }[];
}

function buildJSON(events: ZodiacEvent[], now: Date): ZodiacJSON {
  return {
    count: events.length,
    generated: now.toISOString(),
    events: events.map((e) => ({
      sign: e.sign.name,
      emoji: e.sign.emoji,
      startDate: e.startDate,
      endDate: e.endDate,
      range: formatSeasonRange(e.sign),
    })),
  };
}
