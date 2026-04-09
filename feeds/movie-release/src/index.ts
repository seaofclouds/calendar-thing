/**
 * Movie Release Calendar — Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for theatrical and digital movie releases.
 */

import {
  authenticateToken,
  withEdgeCache,
  icsResponse,
  jsonResponse,
  errorResponse,
} from "@calendar-feeds/worker-utils";
import { fetchUpcomingMovies, RELEASE_TYPE, type ReleaseType, type FetchResult } from "./tmdb";
import { generateICS } from "./ics";

interface Env {
  TMDB_API_KEY: string;
  CALENDAR_TOKEN: string;
}

const CACHE_VERSION = 11;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Root is public (no secrets exposed)
    if (url.pathname === "/") {
      return new Response("Movie Release Calendar\n", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // All other endpoints require a valid token
    if (!authenticateToken(url, env.CALENDAR_TOKEN)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Route handling
    if (url.pathname === "/theatrical.ics") {
      return handleCalendarRequest(request, env, ctx, RELEASE_TYPE.THEATRICAL, "Movie Releases (Theatrical)");
    }

    if (url.pathname === "/digital.ics") {
      return handleCalendarRequest(request, env, ctx, RELEASE_TYPE.DIGITAL, "Movie Releases (Digital)");
    }

    if (url.pathname === "/theatrical.json") {
      return handleJsonRequest(request, env, ctx, RELEASE_TYPE.THEATRICAL);
    }

    if (url.pathname === "/digital.json") {
      return handleJsonRequest(request, env, ctx, RELEASE_TYPE.DIGITAL);
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;

async function handleCalendarRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  releaseType: ReleaseType,
  calendarName: string
): Promise<Response> {
  return withEdgeCache(request, ctx, { version: CACHE_VERSION }, async () => {
    try {
      const result = await fetchUpcomingMovies(env.TMDB_API_KEY, releaseType);
      const icsContent = generateICS(result.movies, calendarName);
      const filename = releaseType === RELEASE_TYPE.THEATRICAL ? "theatrical.ics" : "digital.ics";

      return icsResponse(icsContent, filename);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return errorResponse(500, `Error generating calendar: ${message}`);
    }
  });
}

async function handleJsonRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  releaseType: ReleaseType
): Promise<Response> {
  return withEdgeCache(request, ctx, { version: CACHE_VERSION }, async () => {
    try {
      const result = await fetchUpcomingMovies(env.TMDB_API_KEY, releaseType);
      const body = formatJson(result, releaseType);

      return jsonResponse(body, {
        "X-Movies-Count": String(result.movies.length),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return errorResponse(500, message, true);
    }
  });
}

function formatJson(result: FetchResult, releaseType: ReleaseType): string {
  return JSON.stringify(
    {
      type: releaseType === RELEASE_TYPE.THEATRICAL ? "theatrical" : "digital",
      count: result.movies.length,
      generated: new Date().toISOString(),
      debug: result.debug,
      movies: result.movies.map((m) => ({
        id: m.id,
        title: m.title,
        release_date: m.theatrical_release_date,
        overview: m.overview,
        popularity: m.popularity,
        vote_average: m.vote_average,
        director: m.director,
        cast: m.cast,
        tmdb_url: `https://www.themoviedb.org/movie/${m.id}`,
        imdb_url: m.imdb_id ? `https://www.imdb.com/title/${m.imdb_id}/` : null,
      })),
    },
    null,
    2
  );
}
