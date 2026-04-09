/**
 * Calendar Thing — Cloudflare Worker entry point.
 * Renders printable calendars with astronomical event overlays.
 * Fetches event data from feed workers via service bindings.
 */

import { renderCalendar } from "./render";

interface Env {
  MOON_PHASE: Fetcher;
  MOVIE_RELEASE: Fetcher;
}

interface CalendarParams {
  year: number;
  size: string;
  orientation: "portrait" | "landscape";
  rows?: number;
  header: boolean;
  testing: boolean;
  format?: "png" | "jpg";
  dpi: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Favicon
    if (path === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    // Static assets (CSS, JS) served automatically by [assets] config in wrangler.toml

    // Parse URL
    const params = parseCalendarURL(path, url.searchParams);
    if (!params) {
      return Response.redirect(`${url.origin}/${new Date().getFullYear()}`, 302);
    }

    // Fetch event data from moon-phase feed
    const { fullMoonDates, solarEvents } = await fetchMoonData(env, params.year);

    // Render HTML
    const html = renderCalendar({
      ...params,
      header: params.header,
      forExport: params.format != null || params.size !== "letter" || params.testing,
      fullMoonDates,
      solarEvents,
    });

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
} satisfies ExportedHandler<Env>;

function parseCalendarURL(
  path: string,
  searchParams: URLSearchParams
): CalendarParams | null {
  const segments = path.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  if (segments.length === 0) return null;

  let [yearStr, size, orientation, lastSegment] = segments;
  const yearNum = parseInt(yearStr);
  if (isNaN(yearNum)) return null;

  const rows = searchParams.get("rows")
    ? parseInt(searchParams.get("rows")!)
    : undefined;
  const header = searchParams.get("header") !== "false";
  const testing = searchParams.get("test") === "true";

  // Parse image format and DPI
  let format: "png" | "jpg" | undefined;
  let dpi = 300;

  // Check lastSegment for format
  if (lastSegment) {
    const parsed = parseFormatSegment(lastSegment);
    if (parsed) {
      format = parsed.format;
      dpi = parsed.dpi;
    }
  }

  // Check if size contains format
  if (!format && size) {
    const parsed = parseFormatSegment(size);
    if (parsed) {
      format = parsed.format;
      size = size.replace(/\.(?:png|jpg)$/i, "");
    }
  }

  // Check if orientation contains format
  if (!format && orientation) {
    const parsed = parseFormatSegment(orientation);
    if (parsed) {
      format = parsed.format;
      orientation = orientation.replace(/\.(?:png|jpg)$/i, "");
    }
  }

  return {
    year: yearNum,
    size: size || "letter",
    orientation: (orientation as "portrait" | "landscape") || "portrait",
    rows,
    header,
    testing,
    format,
    dpi,
  };
}

function parseFormatSegment(
  segment: string
): { format: "png" | "jpg"; dpi: number } | null {
  const formatMatch = segment.match(/\.?(png|jpg)$/i);
  if (!formatMatch) return null;

  const format = formatMatch[1].toLowerCase() as "png" | "jpg";
  let dpi = 300;

  const dpiMatch = segment.match(/(\d+)dpi/);
  if (dpiMatch) dpi = parseInt(dpiMatch[1]);

  return { format, dpi };
}

interface MoonData {
  fullMoonDates: string[];
  solarEvents: Record<string, "solstice" | "equinox">;
}

// Pre-computed test data (Jean Meeus algorithms, 2025–2027)
// Replace with service binding fetch when moon-phase worker is deployed
const FULL_MOON_DATES: Record<number, string[]> = {
  2025: ["2025-01-13","2025-02-12","2025-03-14","2025-04-13","2025-05-12","2025-06-11","2025-07-10","2025-08-09","2025-09-07","2025-10-07","2025-11-05","2025-12-04"],
  2026: ["2026-01-03","2026-02-01","2026-03-03","2026-04-02","2026-05-01","2026-05-31","2026-06-29","2026-07-29","2026-08-28","2026-09-26","2026-10-26","2026-11-24","2026-12-24"],
  2027: ["2027-01-22","2027-02-20","2027-03-22","2027-04-20","2027-05-20","2027-06-19","2027-07-18","2027-08-17","2027-09-15","2027-10-15","2027-11-14","2027-12-13"],
};

const SOLAR_EVENTS: Record<number, Record<string, "solstice" | "equinox">> = {
  2025: { "2025-03-20": "equinox", "2025-06-21": "solstice", "2025-09-22": "equinox", "2025-12-21": "solstice" },
  2026: { "2026-03-20": "equinox", "2026-06-21": "solstice", "2026-09-23": "equinox", "2026-12-21": "solstice" },
  2027: { "2027-03-20": "equinox", "2027-06-21": "solstice", "2027-09-23": "equinox", "2027-12-22": "solstice" },
};

async function fetchMoonData(env: Env, year: number): Promise<MoonData> {
  // Try service binding first (when moon-phase worker is deployed)
  try {
    if (env.MOON_PHASE) {
      const response = await env.MOON_PHASE.fetch(
        new Request("https://internal/moon.json")
      );
      if (response.ok) {
        const data = (await response.json()) as {
          phases: Array<{ date: string; phase: string }>;
          solarEvents: Array<{ date: string; event: string }>;
        };

        const fullMoonDates = data.phases
          .filter((p) => p.phase === "full_moon")
          .map((p) => p.date);

        const solarEvents: Record<string, "solstice" | "equinox"> = {};
        for (const event of data.solarEvents) {
          const month = parseInt(event.date.split("-")[1]);
          solarEvents[event.date] =
            month === 3 || month === 9 ? "equinox" : "solstice";
        }

        return { fullMoonDates, solarEvents };
      }
    }
  } catch {
    // Service binding unavailable — fall through to test data
  }

  // Static test data fallback
  return {
    fullMoonDates: FULL_MOON_DATES[year] ?? [],
    solarEvents: SOLAR_EVENTS[year] ?? {},
  };
}
