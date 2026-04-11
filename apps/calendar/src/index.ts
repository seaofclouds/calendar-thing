/**
 * Calendar Thing — Cloudflare Worker entry point.
 * Renders printable calendars with astronomical event overlays.
 * Fetches event data from feed plugins via service bindings.
 */

import { renderCalendar, renderCalendarFragment } from "./render";
import { renderMonthView, renderMonthViewFragment } from "./render-month";
import { renderConfigView } from "./render-config";
import { renderStyleguide } from "./render-styleguide";
import {
  createFeedRegistry,
  fetchFeedEvents,
  fetchExternalFeed,
  parseIncludeParam,
  isFeedEnabled,
  getActiveTokens,
  type IncludeState,
} from "@calendar-feeds/feeds";
import type { CalendarEvent } from "@calendar-feeds/shared";
import astronomyPlugin from "../../../feeds/astronomy/feed.plugin";
import { theatrical, digital } from "../../../feeds/movies/feed.plugin";
import busdPlugin from "../../../feeds/busd/feed.plugin";
import astrologyPlugin from "../../../feeds/astrology/feed.plugin";

const registry = createFeedRegistry([
  astronomyPlugin,
  theatrical,
  digital,
  busdPlugin,
  astrologyPlugin,
]);

interface Env {
  ASTRONOMY: Fetcher;
  MOVIE_RELEASE: Fetcher;
  ASTROLOGY: Fetcher;
  CALENDAR_TOKEN?: string;
  [key: string]: unknown;
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
  include: IncludeState;
  month?: number;
  viewMode: "year" | "month";
  borders: boolean;
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

    // Styleguide
    if (path === "/styleguide") {
      return new Response(renderStyleguide(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Feed proxy: /feeds/*.ics → service binding
    if (path.startsWith("/feeds/")) {
      return handleFeedProxy(path, url, env);
    }

    // Config view: /config/:year, /config/:year/:month
    if (path.startsWith("/config/")) {
      return handleConfigRoute(path, url, env);
    }

    // Parse URL
    const params = parseCalendarURL(path, url.searchParams);
    if (!params) {
      return Response.redirect(`${url.origin}/${new Date().getFullYear()}`, 302);
    }

    // Fetch all enabled feed events in parallel
    const token = env.CALENDAR_TOKEN;
    const feedUrls = url.searchParams.getAll("feed");
    const allFeeds = registry.getAll();

    const feedResults = await Promise.all([
      ...allFeeds
        .filter((feed) => isFeedEnabled(params.include, feed.id))
        .map((feed) =>
          fetchFeedEvents(feed, env, token, getActiveTokens(params.include, feed.id))
        ),
      ...feedUrls.map((u) => fetchExternalFeed(u)),
    ]);
    const allEvents = feedResults.flat();

    // Split by render mode: day-markers vs event-list
    const markerIds = new Set(
      allFeeds.filter((f) => f.renderMode === "day-marker").map((f) => f.category),
    );
    const markers = allEvents.filter((e) => markerIds.has(e.category));
    const events = allEvents.filter((e) => !markerIds.has(e.category));

    const forExport = params.format != null || params.size != null || params.testing;
    let html: string;

    if (params.viewMode === "month" && params.month != null) {
      // Filter events to requested month
      const monthStr = String(params.month).padStart(2, "0");
      const prefix = `${params.year}-${monthStr}-`;
      const monthEvents = events.filter((e) => e.date.startsWith(prefix));

      html = renderMonthView({
        year: params.year,
        month: params.month,
        size: params.size,
        orientation: params.orientation,
        header: params.header,
        testing: params.testing,
        forExport,
        format: params.format,
        dpi: params.dpi,
        markers,
        borders: params.borders,
        events: monthEvents,
        queryString: url.search,
      });
    } else {
      html = renderCalendar({
        ...params,
        header: params.header,
        forExport,
        queryString: url.search,
        markers,
      });
    }

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
  const include = parseIncludeParam(searchParams.get("include"), registry.getAll());
  const borders = searchParams.get("borders") !== "false"; // default true

  // Parse format/DPI, size, and orientation from remaining segments
  let format: "png" | "jpg" | undefined;
  let dpi = 300;
  let size: string | undefined;
  let orientation: "portrait" | "landscape" = "portrait";
  let month: number | undefined;
  let viewMode: "year" | "month" = "year";

  const rest = segments.slice(1);

  // Check if second segment is a month number (1-12)
  if (rest.length > 0) {
    const monthNum = parseInt(rest[0]);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 && /^\d{1,2}$/.test(rest[0])) {
      month = monthNum;
      viewMode = "month";
      rest.shift();
    }
  }

  for (const seg of rest) {
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
    month,
    viewMode,
    borders,
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

async function handleFeedProxy(path: string, url: URL, env: Env): Promise<Response> {
  // Derive route from feed registry: /feeds/{id}.ics → plugin.binding + plugin.endpoint
  const match = path.match(/^\/feeds\/([^/]+)\.ics$/);
  const feed = match ? registry.get(match[1]) : undefined;
  if (!feed) {
    return new Response("Not Found", { status: 404 });
  }

  // Validate token
  const token = url.searchParams.get("token");
  if (!token || token !== env.CALENDAR_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Proxy to service binding (internal hostname bypasses feed worker auth)
  // For fixture-only feeds (e.g. busd), serve fixture data directly
  if (!feed.binding) {
    if (feed.fixture) {
      return new Response(feed.fixture, {
        status: 200,
        headers: { "Content-Type": "text/calendar; charset=utf-8" },
      });
    }
    return new Response("Service Unavailable", { status: 503 });
  }
  const binding = env[feed.binding] as Fetcher | undefined;
  if (!binding) {
    return new Response("Service Unavailable", { status: 503 });
  }

  // Forward query params (except token) to upstream
  const upstream = new URL(`https://internal${feed.endpoint}`);
  for (const [key, value] of url.searchParams) {
    if (key !== "token") upstream.searchParams.set(key, value);
  }

  const response = await binding.fetch(new Request(upstream.toString()));
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

async function handleConfigRoute(path: string, url: URL, env: Env): Promise<Response> {
  const segments = path.replace(/^\/config\//, "").split("/").filter(Boolean);
  if (segments.length === 0) {
    return Response.redirect(`${url.origin}/config/${new Date().getFullYear()}`, 302);
  }

  const yearNum = parseInt(segments[0]);
  if (isNaN(yearNum)) {
    return Response.redirect(`${url.origin}/config/${new Date().getFullYear()}`, 302);
  }

  let month: number | undefined;
  if (segments[1]) {
    const monthNum = parseInt(segments[1]);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      month = monthNum;
    }
  }

  const sizeParam = url.searchParams.get("size") ?? "letter";
  const size = VALID_SIZES.has(sizeParam) ? sizeParam : "letter";
  const orientParam = url.searchParams.get("orientation") ?? "landscape";
  const orientation = (VALID_ORIENTATIONS.has(orientParam) ? orientParam : "landscape") as "portrait" | "landscape";
  const includeParam = url.searchParams.get("include") ?? undefined;
  const include = parseIncludeParam(includeParam ?? null, registry.getAll());
  const borders = url.searchParams.get("borders") !== "false";

  // Build query string for calendar-internal links (preserves config state)
  const configParams = new URLSearchParams();
  configParams.set("size", size);
  configParams.set("orientation", orientation);
  if (includeParam) configParams.set("include", includeParam);
  const configQs = `?${configParams.toString()}`;

  // Fetch events (same logic as main calendar routes)
  const token = env.CALENDAR_TOKEN;
  const feedUrls = url.searchParams.getAll("feed");
  const allFeeds = registry.getAll();

  const feedResults = await Promise.all([
    ...allFeeds
      .filter((feed) => isFeedEnabled(include, feed.id))
      .map((feed) =>
        fetchFeedEvents(feed, env, token, getActiveTokens(include, feed.id))
      ),
    ...feedUrls.map((u) => fetchExternalFeed(u)),
  ]);
  const allEvents = feedResults.flat();

  const markerIds = new Set(
    allFeeds.filter((f) => f.renderMode === "day-marker").map((f) => f.category),
  );
  const markers = allEvents.filter((e) => markerIds.has(e.category));
  const events = allEvents.filter((e) => !markerIds.has(e.category));

  // Render calendar fragment in print mode at selected paper size
  let calendarHtml: string;
  if (month != null) {
    const monthStr = String(month).padStart(2, "0");
    const prefix = `${yearNum}-${monthStr}-`;
    const monthEvents = events.filter((e) => e.date.startsWith(prefix));

    calendarHtml = renderMonthViewFragment({
      year: yearNum,
      month,
      size,
      orientation,
      header: true,
      testing: false,
      forExport: true,
      markers,
      borders,
      events: monthEvents,
      queryString: configQs,
      urlPrefix: "/config",
    });
  } else {
    calendarHtml = renderCalendarFragment({
      year: yearNum,
      size,
      orientation,
      header: true,
      testing: false,
      forExport: true,
      markers,
      queryString: configQs,
      urlPrefix: "/config",
    });
  }

  const html = renderConfigView({
    year: yearNum,
    month,
    size,
    orientation,
    calendarHtml,
    includeParam,
  });

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
