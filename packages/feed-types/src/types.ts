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
  binding: string;
  endpoint: string;
  prodUrl: string;
  category: string;
  renderMode: FeedRenderMode;
  includeTokens?: Record<string, string>;
  tokenAliases?: Record<string, string[]>;
  defaultInclude?: string[];
  stripSummaryPrefix?: string;
  stripSummarySuffix?: string;
  icon?: string;
  signIcons?: Record<string, string>;
}
