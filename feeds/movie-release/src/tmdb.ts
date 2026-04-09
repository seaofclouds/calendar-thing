// TMDB API client for fetching movie releases

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  original_language: string;
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
    date_range: { start: string; end: string };
    total_api_results: number;
    after_filter: number;
    after_date_filter: number;
    after_rerelease_filter: number;
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

// Rolling date window: ~3 months back + ~14 months ahead
function getDateRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 4, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 14, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

// Indian cinema languages to exclude — these get wide US theatrical
// distribution but aren't relevant to our calendar
const EXCLUDED_LANGUAGES = new Set(["hi", "te", "ta", "kn", "ml"]);
const EXCLUDED_LANGUAGES_PARAM = [...EXCLUDED_LANGUAGES].join(",");

// Release type sets for discover queries.
// Must specify release types so TMDB applies regional date filtering
// (without with_release_type, release_date filters use the movie's
// global primary date, not the US date)
const THEATRICAL_RELEASE_TYPES = "2|3"; // limited + wide theatrical
const DIGITAL_RELEASE_TYPES = "4|5|6"; // digital, physical, TV
const ALL_RELEASE_TYPES = "1|2|3|4|5|6";

/**
 * Fetch upcoming movies from TMDB with US releases.
 *
 * Two-step process:
 * 1. Discover movies sorted by release date, filtered by language and
 *    a sliding popularity threshold (stricter for near-term, lenient for far-out)
 * 2. Look up actual US release dates per movie (discover's release_date
 *    is the original/global date, not regional)
 */
export async function fetchUpcomingMovies(
  apiKey: string,
  releaseType: ReleaseType = RELEASE_TYPE.THEATRICAL,
  options: { maxPages?: number } = {}
): Promise<FetchResult> {
  const { maxPages = 15 } = options;

  const { start: dateStart, end: dateEnd } = getDateRange();

  // Use release-type-specific filtering so theatrical and digital
  // endpoints return different movies
  const discoverReleaseTypes =
    releaseType === RELEASE_TYPE.THEATRICAL
      ? THEATRICAL_RELEASE_TYPES
      : releaseType === RELEASE_TYPE.DIGITAL
        ? DIGITAL_RELEASE_TYPES
        : ALL_RELEASE_TYPES;

  // Two-pass discovery: popularity sort catches buzzy near-term movies,
  // release-date sort catches notable films across the full window
  const seen = new Set<number>();
  const allMovies: Movie[] = [];

  for (const sortBy of ["popularity.desc", "primary_release_date.asc"] as const) {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages && page <= maxPages) {
      const url = new URL("https://api.themoviedb.org/3/discover/movie");
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("region", "US");
      url.searchParams.set("with_release_type", discoverReleaseTypes);
      url.searchParams.set("release_date.gte", dateStart);
      url.searchParams.set("release_date.lte", dateEnd);
      url.searchParams.set("sort_by", sortBy);
      url.searchParams.set("without_original_language", EXCLUDED_LANGUAGES_PARAM);
      url.searchParams.set("page", String(page));

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data: TMDBDiscoverResponse = await response.json();
      totalPages = data.total_pages;
      for (const movie of data.results) {
        if (!seen.has(movie.id)) {
          seen.add(movie.id);
          allMovies.push(movie);
        }
      }
      page++;
    }
  }

  const now = new Date();
  const filtered = allMovies.filter((m) => {
    if (EXCLUDED_LANGUAGES.has(m.original_language)) return false;
    // Sliding popularity threshold: far-out movies haven't built buzz yet,
    // so we use a lower bar the further out they are
    const releaseDate = new Date(m.release_date);
    const monthsAway = (releaseDate.getFullYear() - now.getFullYear()) * 12
      + releaseDate.getMonth() - now.getMonth();
    const threshold = monthsAway > 6 ? 5 : monthsAway > 3 ? 15 : 20;
    return m.popularity >= threshold;
  });

  // Look up actual US release dates (discover's release_date is the original,
  // not the regional date - so re-releases like "The Shining" show 1980 instead
  // of their 2025 US re-release date)
  const withDates = await Promise.all(
    filtered.map((movie) => resolveUSReleaseDate(apiKey, movie, releaseType, dateStart, dateEnd))
  );

  // Drop movies where we couldn't resolve a US date in our range
  // (their fallback date will be outside the range)
  const inRange = withDates.filter(
    (m) => m.theatrical_release_date >= dateStart && m.theatrical_release_date <= dateEnd
  );

  // Filter out re-releases: if the original release date is more than
  // a year before the US theatrical date, it's a re-release
  const newReleases = inRange.filter((m) => {
    const original = new Date(m.release_date).getTime();
    const theatrical = new Date(m.theatrical_release_date).getTime();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    return theatrical - original < oneYear;
  });

  // Sort by the resolved US release date
  newReleases.sort((a, b) => a.theatrical_release_date.localeCompare(b.theatrical_release_date));

  return {
    movies: newReleases,
    debug: {
      date_range: { start: dateStart, end: dateEnd },
      total_api_results: allMovies.length,
      after_filter: filtered.length,
      after_date_filter: inRange.length,
      after_rerelease_filter: newReleases.length,
    },
  };
}

function releaseTypeFilter(releaseType: ReleaseType): number[] {
  if (releaseType === RELEASE_TYPE.THEATRICAL) return [RELEASE_TYPE.THEATRICAL_LIMITED, RELEASE_TYPE.THEATRICAL];
  if (releaseType === RELEASE_TYPE.DIGITAL) return [RELEASE_TYPE.DIGITAL, RELEASE_TYPE.PHYSICAL, RELEASE_TYPE.TV];
  return [1, 2, 3, 4, 5, 6];
}

/**
 * Get the US release date for a movie that falls within our date range.
 * Falls back to discover's release_date if the lookup fails.
 */
async function resolveUSReleaseDate(
  apiKey: string,
  movie: Movie,
  releaseType: ReleaseType,
  dateStart: string,
  dateEnd: string
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

    // Determine which release types to match
    const typeFilter = releaseTypeFilter(releaseType);

    // Prefer dates matching the requested release type, fall back to any
    const matchingType = usRelease.release_dates
      .filter((rd) => typeFilter.includes(rd.type))
      .map((rd) => rd.release_date.split("T")[0])
      .filter((d) => d >= dateStart && d <= dateEnd)
      .sort();

    const anyType = usRelease.release_dates
      .map((rd) => rd.release_date.split("T")[0])
      .filter((d) => d >= dateStart && d <= dateEnd)
      .sort();

    const inRange = matchingType.length > 0 ? matchingType : anyType;
    if (inRange.length === 0) return { ...fallback, ...metadata };

    return { ...movie, theatrical_release_date: inRange[0], ...metadata };
  } catch {
    return fallback;
  }
}
