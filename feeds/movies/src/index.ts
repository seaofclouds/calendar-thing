/**
 * Movie Release Calendar — Cloudflare Worker entry point.
 * Serves ICS and JSON feeds for theatrical and digital movie releases.
 */

import {
  createFeedWorker,
  icsResponse,
  jsonResponse,
  errorResponse,
} from "@calendar-feeds/shared";
import { fetchUpcomingMovies, RELEASE_TYPE, type ReleaseType, type FetchResult } from "./tmdb";
import { generateICS } from "./ics";

interface Env {
  TMDB_API_KEY: string;
  CALENDAR_TOKEN: string;
}

export default createFeedWorker({
  name: "Movie Release Calendar",
  cacheVersion: 11,
  routes: [
    {
      path: "/feeds/movies-theatrical.ics",
      handler: async (_request, env: Env) => {
        try {
          const result = await fetchUpcomingMovies(env.TMDB_API_KEY, RELEASE_TYPE.THEATRICAL);
          return icsResponse(generateICS(result.movies, "🎥 Movies (theatrical)"), "movies-theatrical.ics");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, `Error generating calendar: ${message}`);
        }
      },
    },
    {
      path: "/feeds/movies-digital.ics",
      handler: async (_request, env: Env) => {
        try {
          const result = await fetchUpcomingMovies(env.TMDB_API_KEY, RELEASE_TYPE.DIGITAL);
          return icsResponse(generateICS(result.movies, "📺 Movies (digital)"), "movies-digital.ics");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, `Error generating calendar: ${message}`);
        }
      },
    },
    {
      path: "/feeds/movies-theatrical.json",
      handler: async (_request, env: Env) => {
        try {
          const result = await fetchUpcomingMovies(env.TMDB_API_KEY, RELEASE_TYPE.THEATRICAL);
          return jsonResponse(formatJson(result, RELEASE_TYPE.THEATRICAL), {
            "X-Movies-Count": String(result.movies.length),
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, message, true);
        }
      },
    },
    {
      path: "/feeds/movies-digital.json",
      handler: async (_request, env: Env) => {
        try {
          const result = await fetchUpcomingMovies(env.TMDB_API_KEY, RELEASE_TYPE.DIGITAL);
          return jsonResponse(formatJson(result, RELEASE_TYPE.DIGITAL), {
            "X-Movies-Count": String(result.movies.length),
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return errorResponse(500, message, true);
        }
      },
    },
  ],
});

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
