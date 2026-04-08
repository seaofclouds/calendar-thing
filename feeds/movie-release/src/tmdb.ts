// TMDB API client for fetching movie releases

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  popularity: number;
  vote_average: number;
}

interface TMDBDiscoverResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

interface TMDBReleaseDatesResponse {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: {
      certification: string;
      release_date: string;
      type: number;
    }[];
  }[];
}

interface TMDBMovieDetailResponse {
  id: number;
  release_dates: TMDBReleaseDatesResponse;
  external_ids?: {
    imdb_id: string | null;
  };
  credits?: {
    cast: { name: string; order: number }[];
    crew: { name: string; job: string }[];
  };
}

export interface MovieWithRelease extends Movie {
  theatrical_release_date: string;
  imdb_id: string | null;
  director: string | null;
  cast: string[];
}

export interface FetchResult {
  movies: MovieWithRelease[];
  debug: {
    total_api_results: number;
    pages_fetched: number;
    total_pages: number;
    after_popularity_filter: number;
    after_date_filter: number;
  };
}

// Release type constants
export const RELEASE_TYPE = {
  PREMIERE: 1,
  THEATRICAL_LIMITED: 2,
  THEATRICAL: 3,
  DIGITAL: 4,
  PHYSICAL: 5,
  TV: 6,
} as const;

export type ReleaseType = (typeof RELEASE_TYPE)[keyof typeof RELEASE_TYPE];

// Date range: ~14 months covering recent and upcoming releases
const DATE_RANGE_START = "2025-12-01";
const DATE_RANGE_END = "2027-01-31";

// Use all release types so TMDB applies regional date filtering
// (without with_release_type, release_date filters use the movie's
// global primary date, not the US date)
const ALL_RELEASE_TYPES = "1|2|3|4|5|6";

/**
 * Fetch upcoming movies from TMDB with US releases.
 *
 * Two-step process:
 * 1. Discover movies with US releases in date range (sorted by popularity)
 * 2. Look up actual US release dates per movie (discover's release_date
 *    is the original/global date, not regional)
 */
export async function fetchUpcomingMovies(
  apiKey: string,
  _releaseType: ReleaseType = RELEASE_TYPE.THEATRICAL,
  options: { popularityThreshold?: number; maxPages?: number } = {}
): Promise<FetchResult> {
  const { popularityThreshold = 10, maxPages = 15 } = options;

  const allMovies: Movie[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= maxPages) {
    const url = new URL("https://api.themoviedb.org/3/discover/movie");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("region", "US");
    url.searchParams.set("with_release_type", ALL_RELEASE_TYPES);
    url.searchParams.set("release_date.gte", DATE_RANGE_START);
    url.searchParams.set("release_date.lte", DATE_RANGE_END);
    url.searchParams.set("sort_by", "popularity.desc");
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data: TMDBDiscoverResponse = await response.json();
    totalPages = data.total_pages;
    allMovies.push(...data.results);
    page++;
  }

  const filtered = allMovies.filter((m) => m.popularity >= popularityThreshold);

  // Look up actual US release dates (discover's release_date is the original,
  // not the regional date - so re-releases like "The Shining" show 1980 instead
  // of their 2025 US re-release date)
  const withDates = await Promise.all(
    filtered.map((movie) => resolveUSReleaseDate(apiKey, movie))
  );

  // Drop movies where we couldn't resolve a US date in our range
  // (their fallback date will be outside the range)
  const inRange = withDates.filter(
    (m) => m.theatrical_release_date >= DATE_RANGE_START && m.theatrical_release_date <= DATE_RANGE_END
  );

  // Sort by the resolved US release date
  inRange.sort((a, b) => a.theatrical_release_date.localeCompare(b.theatrical_release_date));

  return {
    movies: inRange,
    debug: {
      total_api_results: allMovies.length,
      pages_fetched: Math.min(page - 1, maxPages),
      total_pages: totalPages,
      after_popularity_filter: filtered.length,
      after_date_filter: inRange.length,
    },
  };
}

/**
 * Get the US release date for a movie that falls within our date range.
 * Falls back to discover's release_date if the lookup fails.
 */
async function resolveUSReleaseDate(
  apiKey: string,
  movie: Movie
): Promise<MovieWithRelease> {
  const fallback: MovieWithRelease = {
    ...movie, theatrical_release_date: movie.release_date,
    imdb_id: null, director: null, cast: [],
  };

  try {
    const url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=release_dates,external_ids,credits`;
    const response = await fetch(url);
    if (!response.ok) return fallback;

    const data: TMDBMovieDetailResponse = await response.json();
    const imdb_id = data.external_ids?.imdb_id ?? null;
    const director = data.credits?.crew.find((c) => c.job === "Director")?.name ?? null;
    const cast = data.credits?.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map((c) => c.name) ?? [];

    const metadata = { imdb_id, director, cast };

    const usRelease = data.release_dates.results.find((r) => r.iso_3166_1 === "US");
    if (!usRelease) return { ...fallback, ...metadata };

    // Find US release dates within our date range
    const inRange = usRelease.release_dates
      .map((rd) => rd.release_date.split("T")[0])
      .filter((d) => d >= DATE_RANGE_START && d <= DATE_RANGE_END)
      .sort();

    if (inRange.length === 0) return { ...fallback, ...metadata };

    return { ...movie, theatrical_release_date: inRange[0], ...metadata };
  } catch {
    return fallback;
  }
}
