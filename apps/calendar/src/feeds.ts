/**
 * Feed configuration — defines known event sources with three-tier fallback:
 * 1. Service binding (production / wrangler dev --remote)
 * 2. Production URL + token (local dev with internet)
 * 3. Fixture ICS data (fully offline dev)
 */

import { parseICS } from "./parse-ics";
import type { CalendarEvent } from "@calendar-feeds/feed-types";
import movieFixture from "../../../feeds/movie-release/fixtures/theatrical.ics";
import busdFixture from "../../../feeds/busd-calendar/fixtures/busd-2025-2026.ics";

export interface FeedConfig {
  name: string;
  binding: string;
  endpoint: string;
  prodUrl: string;
  category: string;
  fixture: string;
  /** Strip this prefix from event summaries (e.g. emoji added by the worker) */
  stripSummaryPrefix?: string;
  /** Strip this suffix from event summaries (e.g. redundant "Holiday") */
  stripSummarySuffix?: string;
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
  busd: {
    name: "BUSD School Calendar",
    binding: "BUSD_CALENDAR",
    endpoint: "/calendar.ics",
    prodUrl: "",
    category: "school",
    fixture: busdFixture,
    stripSummarySuffix: " Holiday",
    icon: `<svg class="event-icon" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M9.255.032c-.773-.042-1.47-.042-2.242 0-.357.019-.652.294-.707.659-.054.357-.071.695-.052 1.04-.001.017-.002.034-.002.051v2.297c-1.287.285-2.407 1.331-2.485 3.15-.005.073-.009.147-.013.22v6.52c.728.016 1.483.026 2.246.031V11.92c0-.553.448-1 1-1s1 .447 1 1v2.067L8 14c.763-.005 1.518-.015 2.246-.031V7.394l-.01-.16c-.077-1.8-1.197-2.853-2.485-3.149V2.92c.498.01.983.001 1.503-.028.357-.02.652-.294.707-.659.079-.528.079-1.015 0-1.542-.055-.365-.35-.64-.707-.66ZM11.496 7.697v6.238c.325-.011.64-.023.946-.036.744-.032 1.335-.638 1.427-1.407.085-.712.131-1.192.131-1.68 0-.487-.046-.967-.131-1.679-.092-.77-.683-1.376-1.427-1.407-.243-.01-.583-.02-.946-.03ZM2.504 13.935V7.697c-.363.009-.702.019-.946.029-.743.031-1.334.637-1.426 1.407C.046 9.845 0 10.325 0 10.813c0 .487.046.967.131 1.679.092.77.683 1.376 1.427 1.407.305.013.621.025.946.036ZM7 8.687c.705 0 1.102-.41 1.102-1.138 0-.728-.397-1.138-1.102-1.138s-1.102.41-1.102 1.138c0 .728.397 1.138 1.102 1.138Z" clip-rule="evenodd"/></svg>`,
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
  return events.map((e) => {
    let summary = e.summary;
    if (feed.stripSummaryPrefix && summary.startsWith(feed.stripSummaryPrefix)) {
      summary = summary.slice(feed.stripSummaryPrefix.length);
    }
    if (feed.stripSummarySuffix && summary.endsWith(feed.stripSummarySuffix)) {
      summary = summary.slice(0, -feed.stripSummarySuffix.length);
    }
    return { ...e, summary, emoji: feed.icon ?? e.emoji };
  });
}
