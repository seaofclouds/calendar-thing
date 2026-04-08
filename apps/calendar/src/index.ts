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

async function fetchMoonData(env: Env, year: number): Promise<MoonData> {
  const empty: MoonData = { fullMoonDates: [], solarEvents: {} };

  try {
    if (!env.MOON_PHASE) return empty;

    const response = await env.MOON_PHASE.fetch(
      new Request("https://internal/moon.json")
    );
    if (!response.ok) return empty;

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
      solarEvents[event.date] = month === 3 || month === 9 ? "equinox" : "solstice";
    }

    return { fullMoonDates, solarEvents };
  } catch {
    return empty;
  }
}
