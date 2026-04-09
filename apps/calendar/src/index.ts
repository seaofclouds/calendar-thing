/**
 * Calendar Thing — Cloudflare Worker entry point.
 * Renders printable calendars with astronomical event overlays.
 * Fetches event data from feed workers via service bindings.
 */

import { renderCalendar } from "./render";

interface Env {
  ASSETS: Fetcher;
  MOON_PHASE: Fetcher;
  MOVIE_RELEASE: Fetcher;
}

interface IncludeOptions {
  fullMoon: boolean;
  newMoon: boolean;
  solarEvents: boolean;
}

interface CalendarParams {
  year: number;
  size?: string;
  orientation: "portrait" | "landscape";
  rows?: number;
  header: boolean;
  testing: boolean;
  format?: "png" | "jpg";
  dpi: number;
  include: IncludeOptions;
}

const VALID_SIZES = new Set(["letter", "legal", "tabloid", "half-tabloid", "a4", "a5", "a6"]);
const VALID_ORIENTATIONS = new Set(["portrait", "landscape"]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Favicon
    if (path === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    // Serve static assets (CSS, JS) via Pages ASSETS binding
    if (path.match(/\.(css|js|ico|png|jpg|svg|woff2?)$/)) {
      return env.ASSETS.fetch(request);
    }

    // Parse URL
    const params = parseCalendarURL(path, url.searchParams);
    if (!params) {
      return Response.redirect(`${url.origin}/${new Date().getFullYear()}`, 302);
    }

    // Fetch event data from moon-phase feed
    const { fullMoonDates, newMoonDates, solarEvents } = await fetchMoonData(env, params.year);

    // Render HTML
    const html = renderCalendar({
      ...params,
      header: params.header,
      forExport: params.format != null || params.size != null || params.testing,
      fullMoonDates: params.include.fullMoon ? fullMoonDates : [],
      newMoonDates: params.include.newMoon ? newMoonDates : [],
      solarEvents: params.include.solarEvents ? solarEvents : {},
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

  const yearNum = parseInt(segments[0]);
  if (isNaN(yearNum)) return null;

  const rows = searchParams.get("rows")
    ? parseInt(searchParams.get("rows")!)
    : undefined;
  const header = searchParams.get("header") !== "false";
  const testing = searchParams.get("test") === "true";
  const include = parseIncludeParam(searchParams.get("include"));

  // Parse format/DPI, size, and orientation from remaining segments
  let format: "png" | "jpg" | undefined;
  let dpi = 300;
  let size: string | undefined;
  let orientation: "portrait" | "landscape" = "portrait";

  for (const seg of segments.slice(1)) {
    // Check for image format (e.g., "300dpi.png", "portrait.jpg")
    if (!format) {
      const parsed = parseFormatSegment(seg);
      if (parsed) {
        format = parsed.format;
        dpi = parsed.dpi;
      }
    }

    const clean = seg.replace(/\.(?:png|jpg)$/i, "").replace(/\d+dpi/i, "").toLowerCase();
    if (!clean) continue;

    if (VALID_ORIENTATIONS.has(clean)) {
      orientation = clean as "portrait" | "landscape";
    } else if (VALID_SIZES.has(clean)) {
      size = clean;
    }
  }

  return {
    year: yearNum,
    size,
    orientation,
    rows,
    header,
    testing,
    format,
    dpi,
    include,
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

function parseIncludeParam(value: string | null): IncludeOptions {
  if (!value) {
    return { fullMoon: true, newMoon: false, solarEvents: true };
  }
  const tokens = value.split(",").map((s) => s.trim());
  return {
    fullMoon: tokens.includes("moon:full"),
    newMoon: tokens.includes("moon:new"),
    solarEvents: tokens.includes("solar:season"),
  };
}

interface MoonData {
  fullMoonDates: string[];
  newMoonDates: string[];
  solarEvents: Record<string, "solstice" | "equinox">;
}

// Pre-computed test data (Jean Meeus algorithms, 2025–2027)
// Replace with service binding fetch when moon-phase worker is deployed
const FULL_MOON_DATES: Record<number, string[]> = {
  2025: ["2025-01-13","2025-02-12","2025-03-14","2025-04-13","2025-05-12","2025-06-11","2025-07-10","2025-08-09","2025-09-07","2025-10-07","2025-11-05","2025-12-04"],
  2026: ["2026-01-03","2026-02-01","2026-03-03","2026-04-02","2026-05-01","2026-05-31","2026-06-29","2026-07-29","2026-08-28","2026-09-26","2026-10-26","2026-11-24","2026-12-24"],
  2027: ["2027-01-22","2027-02-20","2027-03-22","2027-04-20","2027-05-20","2027-06-19","2027-07-18","2027-08-17","2027-09-15","2027-10-15","2027-11-14","2027-12-13"],
};

const NEW_MOON_DATES: Record<number, string[]> = {
  2025: ["2025-01-29","2025-02-28","2025-03-29","2025-04-27","2025-05-27","2025-06-25","2025-07-24","2025-08-23","2025-09-21","2025-10-21","2025-11-20","2025-12-20"],
  2026: ["2026-01-18","2026-02-17","2026-03-19","2026-04-17","2026-05-16","2026-06-15","2026-07-14","2026-08-12","2026-09-11","2026-10-10","2026-11-09","2026-12-09"],
  2027: ["2027-01-07","2027-02-06","2027-03-08","2027-04-06","2027-05-06","2027-06-04","2027-07-04","2027-08-02","2027-08-31","2027-09-30","2027-10-29","2027-11-28","2027-12-27"],
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
        new Request("https://internal/feeds/moon.json")
      );
      if (response.ok) {
        const data = (await response.json()) as {
          phases: Array<{ date: string; phase: string }>;
          solarEvents: Array<{ date: string; event: string }>;
        };

        const fullMoonDates = data.phases
          .filter((p) => p.phase === "full_moon")
          .map((p) => p.date);

        const newMoonDates = data.phases
          .filter((p) => p.phase === "new_moon")
          .map((p) => p.date);

        const solarEvents: Record<string, "solstice" | "equinox"> = {};
        for (const event of data.solarEvents) {
          const month = parseInt(event.date.split("-")[1]);
          solarEvents[event.date] =
            month === 3 || month === 9 ? "equinox" : "solstice";
        }

        return { fullMoonDates, newMoonDates, solarEvents };
      }
    }
  } catch {
    // Service binding unavailable — fall through to test data
  }

  // Static test data fallback
  return {
    fullMoonDates: FULL_MOON_DATES[year] ?? [],
    newMoonDates: NEW_MOON_DATES[year] ?? [],
    solarEvents: SOLAR_EVENTS[year] ?? {},
  };
}
