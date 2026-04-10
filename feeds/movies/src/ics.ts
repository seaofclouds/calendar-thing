/**
 * ICS (iCalendar) generator for movie releases.
 * Uses shared @calendar-feeds/shared for common ICS operations.
 */

import {
  escapeICS,
  truncate,
  formatICSTimestamp,
  formatICSDateValue,
  wrapVCalendar,
  buildVEvent,
} from "@calendar-feeds/shared";
import type { MovieWithRelease } from "./tmdb";

export function generateICS(movies: MovieWithRelease[], calendarName: string): string {
  const now = formatICSTimestamp(new Date());
  const events = movies.map((movie) => generateEvent(movie, now));

  return wrapVCalendar({
    prodId: "-//Movie Release Calendar//EN",
    calName: calendarName,
    events,
  });
}

function generateEvent(movie: MovieWithRelease, timestamp: string): string {
  const dateStr = formatICSDateValue(movie.theatrical_release_date);
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;
  const imdbUrl = movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}/` : null;

  const description = escapeICS(
    [
      truncate(movie.overview, 500),
      "",
      ...(movie.director ? [`Director: ${movie.director}`] : []),
      ...(movie.cast.length > 0 ? [`Cast: ${movie.cast.join(", ")}`] : []),
      "",
      `TMDB Popularity: ${movie.popularity}`,
      `TMDB Rating: ${movie.vote_average}`,
      "",
      tmdbUrl,
      ...(imdbUrl ? [imdbUrl] : []),
    ].join("\n")
  );

  return buildVEvent({
    uid: `movie-${movie.id}@calendar-movies`,
    dtstamp: timestamp,
    dtstart: dateStr,
    summary: escapeICS(`\uD83C\uDFA5 ${movie.title}`),
    description,
    url: tmdbUrl,
  });
}
