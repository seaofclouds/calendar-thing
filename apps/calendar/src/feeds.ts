/**
 * Feed configuration — defines known event sources with three-tier fallback:
 * 1. Service binding (production / wrangler dev --remote)
 * 2. Production URL + token (local dev with internet)
 * 3. Fixture ICS data (fully offline dev)
 */

import { parseICS } from "./parse-ics";
import type { CalendarEvent } from "@calendar-feeds/feed-types";
import movieFixture from "../../../feeds/movie-release/fixtures/theatrical.ics";

export interface FeedConfig {
  name: string;
  binding: string;
  endpoint: string;
  prodUrl: string;
  category: string;
  fixture: string;
  /** Strip this prefix from event summaries (e.g. emoji added by the worker) */
  stripSummaryPrefix?: string;
  /** Inline SVG icon to display before event summaries */
  icon?: string;
}

export const FEEDS: Record<string, FeedConfig> = {
  movies: {
    name: "Theatrical Releases",
    binding: "MOVIE_RELEASE",
    endpoint: "/theatrical.ics",
    prodUrl: "https://movie-release-calendar.seaofclouds.workers.dev",
    category: "movie",
    fixture: movieFixture,
    stripSummaryPrefix: "🎥 ",
    icon: `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M0 3.5C0 1.567 1.567 0 3.5 0S7 1.567 7 3.5 5.433 7 3.5 7 0 5.433 0 3.5ZM10.5 2C9.119 2 8 3.119 8 4.5S9.119 7 10.5 7C11.881 7 13 5.881 13 4.5S11.881 2 10.5 2ZM1.912 9.609c0-.89.722-1.612 1.612-1.612h6.114c.89 0 1.612.722 1.612 1.612v2.779c0 .89-.722 1.612-1.612 1.612H3.524c-.89 0-1.612-.722-1.612-1.612V9.609Zm11.966.14c0-.414-.336-.75-.75-.75-.414 0-.75.336-.75.75v2.5c0 .414.336.75.75.75.414 0 .75-.336.75-.75V9.749Z" clip-rule="evenodd"/></svg>`,
  },
};

/**
 * Fetch events from a feed using three-tier fallback:
 * 1. Service binding → works in prod + wrangler dev --remote
 * 2. Production URL + token → works in local dev with internet
 * 3. Fixture ICS → works fully offline
 */
export async function fetchFeedEvents(
  feed: FeedConfig,
  env: Record<string, unknown>,
  token?: string,
): Promise<CalendarEvent[]> {
  // 1. Try service binding
  const binding = env[feed.binding] as Fetcher | undefined;
  if (binding) {
    try {
      const response = await binding.fetch(
        new Request(`https://internal${feed.endpoint}`)
      );
      if (response.ok) {
        const ics = await response.text();
        const events = cleanEvents(parseICS(ics, feed.category), feed);
        if (events.length > 0) return events;
      }
    } catch {
      // fall through
    }
  }

  // 2. Try production URL with token
  if (token) {
    try {
      const url = `${feed.prodUrl}${feed.endpoint}?token=${encodeURIComponent(token)}`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const ics = await response.text();
        const events = cleanEvents(parseICS(ics, feed.category), feed);
        if (events.length > 0) return events;
      }
    } catch {
      // fall through
    }
  }

  // 3. Fixture data
  if (feed.fixture) {
    return cleanEvents(parseICS(feed.fixture, feed.category), feed);
  }

  return [];
}

function cleanEvents(events: CalendarEvent[], feed: FeedConfig): CalendarEvent[] {
  return events.map((e) => ({
    ...e,
    summary: feed.stripSummaryPrefix && e.summary.startsWith(feed.stripSummaryPrefix)
      ? e.summary.slice(feed.stripSummaryPrefix.length)
      : e.summary,
    emoji: feed.icon ?? e.emoji,
  }));
}
