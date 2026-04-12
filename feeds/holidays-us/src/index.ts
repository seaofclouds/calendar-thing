/**
 * US Holidays Calendar -- Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for US federal holidays.
 */

import { createFeedWorker, icsResponse, jsonResponse } from "@calendar-feeds/shared";
import { computeUSHolidays } from "./holidays";
import type { USHoliday } from "./holidays";
import { generateICS } from "./ics";

function yearFromRequest(request: Request): number {
  const url = new URL(request.url);
  const requestedYear = url.searchParams.get("year");
  return requestedYear ? parseInt(requestedYear) : new Date().getUTCFullYear();
}

export default createFeedWorker({
  name: "US Holidays Calendar",
  cacheVersion: 1,
  cacheParams: (request) => ({ _y: String(yearFromRequest(request)) }),
  routes: [
    {
      path: "/feeds/holidays-us.ics",
      handler: async (request) => {
        const holidays = computeUSHolidays(yearFromRequest(request));
        return icsResponse(generateICS(holidays));
      },
    },
    {
      path: "/feeds/holidays-us.json",
      handler: async (request) => {
        const holidays = computeUSHolidays(yearFromRequest(request));
        return jsonResponse(JSON.stringify(buildJSON(holidays, new Date()), null, 2));
      },
    },
  ],
});

interface HolidaysJSON {
  count: number;
  generated: string;
  holidays: {
    key: string;
    name: string;
    date: string;
  }[];
}

function buildJSON(holidays: USHoliday[], now: Date): HolidaysJSON {
  return {
    count: holidays.length,
    generated: now.toISOString(),
    holidays: holidays.map((h) => ({
      key: h.key,
      name: h.name,
      date: h.date,
    })),
  };
}
