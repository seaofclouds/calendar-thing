/**
 * Astrology Calendar -- Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for zodiac season events.
 */

import { authenticateToken, withEdgeCache, icsResponse, jsonResponse } from "@calendar-feeds/worker-utils";
import { computeZodiacSeasons, formatSeasonRange } from "./zodiac";
import type { ZodiacEvent } from "./zodiac";
import { generateICS } from "./ics";

interface Env {
  CALENDAR_TOKEN: string;
}

const CACHE_VERSION = 1;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("Astrology Calendar\n", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (url.pathname !== "/feeds/astrology.ics" && url.pathname !== "/feeds/astrology.json") {
      return new Response("Not Found", { status: 404 });
    }

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
        const events = computeZodiacSeasons(year);

        if (url.pathname === "/feeds/astrology.ics") {
          return icsResponse(generateICS(events));
        }

        return jsonResponse(JSON.stringify(buildJSON(events, now), null, 2));
      }
    );
  },
} satisfies ExportedHandler<Env>;

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
