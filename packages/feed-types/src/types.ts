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
