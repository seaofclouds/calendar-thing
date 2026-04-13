/**
 * The interface every feed worker exposes — describes what the feed provides.
 */
export interface CalendarFeed {
  id: string;
  name: string;
  description: string;
  endpoints: FeedEndpoint[];
}

export interface FeedEndpoint {
  path: string;
  format: "ics" | "json";
  description: string;
}

/**
 * A single calendar event, normalized across all feed types.
 * Used by the calendar renderer to display events.
 */
export interface CalendarEvent {
  uid: string;
  date: string;
  summary: string;
  description?: string;
  emoji?: string;
  url?: string;
  allDay: boolean;
  category: string;
  /** Canonical key for cross-feed deduplication (e.g. "us-labor-day") */
  dedupeKey?: string;
}

/**
 * How the calendar renderer should display events from a feed.
 * - "event-list": text events in day cells (movies, school, astrology)
 * - "day-marker": icon replaces the date number (moon phases, solar events)
 */
export type FeedRenderMode = "event-list" | "day-marker";

/**
 * Feed plugin manifest — each feed defines this in its feed.plugin.ts.
 * The calendar app imports these to discover and configure feeds.
 */
export interface FeedPlugin {
  id: string;
  name: string;
  category: string;
  renderMode: FeedRenderMode;
  endpoint: string;
  /** Service binding name — worker feeds only */
  binding?: string;
  /** Production worker URL — worker feeds only */
  prodUrl?: string;
  /** External ICS URL (e.g. Google Calendar) */
  sourceUrl?: string;
  /** Environment variable name containing the source URL (for private feeds) */
  sourceUrlEnv?: string;
  /** Embedded ICS fixture data for offline dev fallback */
  fixture?: string;
  includeTokens?: Record<string, string>;
  tokenAliases?: Record<string, string[]>;
  defaultInclude?: string[];
  stripSummaryPrefix?: string;
  stripSummarySuffix?: string;
  icon?: string;
  signIcons?: Record<string, string>;
  /** Maps event summary text → canonical dedupe key for cross-feed deduplication */
  dedupeKeys?: Record<string, string>;
}
