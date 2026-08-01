/**
 * Feed fetching — four-tier fallback for loading events from feed plugins:
 * 1. Service binding (production / wrangler dev --remote)
 * 2. Production URL + token (local dev with internet)
 * 3. Source URL (external ICS feed, e.g. Google Calendar)
 * 4. Fixture ICS data (fully offline dev)
 */

import { parseICS, extractCalendarName } from "./parse-ics";
import type { CalendarEvent, FeedPlugin } from "@calendar-feeds/shared";

export interface ExternalFeedResult {
  events: CalendarEvent[];
  name?: string;
  url: string;
}

export async function fetchFeedEvents(
  feed: FeedPlugin,
  env: Record<string, unknown>,
  token?: string,
  activeTokens?: Set<string>,
): Promise<CalendarEvent[]> {
  let events = await fetchRaw(feed, env, token);
  events = cleanEvents(events, feed);

  if (activeTokens && feed.includeTokens) {
    events = filterByTokens(events, feed, activeTokens);
  }

  return events;
}

/**
 * Remove duplicate events across feeds using dedupeKey + date.
 * When multiple events share the same (dedupeKey, date), only the first is kept.
 * Feed order in the registry determines priority.
 */
export function deduplicateEvents(events: CalendarEvent[]): CalendarEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    if (!e.dedupeKey) return true;
    const key = `${e.date}:${e.dedupeKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchExternalFeed(url: string): Promise<ExternalFeedResult> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const ics = await response.text();
      return {
        events: parseICS(ics, "external"),
        name: extractCalendarName(ics),
        url,
      };
    }
  } catch {
    // external feed unavailable
  }
  return { events: [], url };
}

async function fetchRaw(
  feed: FeedPlugin,
  env: Record<string, unknown>,
  token?: string,
): Promise<CalendarEvent[]> {
  // 1. Try service binding
  if (feed.binding) {
    const binding = env[feed.binding] as Fetcher | undefined;
    if (binding) {
      try {
        const response = await binding.fetch(
          new Request(`https://internal${feed.endpoint}`)
        );
        if (response.ok) {
          const ics = await response.text();
          const events = parseICS(ics, feed.category);
          if (events.length > 0) return events;
        }
      } catch {
        // fall through
      }
    }
  }

  // 2. Try production URL with token
  if (token && feed.prodUrl) {
    try {
      const url = `${feed.prodUrl}${feed.endpoint}?token=${encodeURIComponent(token)}`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const ics = await response.text();
        const events = parseICS(ics, feed.category);
        if (events.length > 0) return events;
      }
    } catch {
      // fall through
    }
  }

  // 3. Try source URL (external ICS feed, or from env var for private feeds)
  const sourceUrl = feed.sourceUrl ?? (feed.sourceUrlEnv ? env[feed.sourceUrlEnv] as string : undefined);
  if (sourceUrl) {
    try {
      const response = await fetch(sourceUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const ics = await response.text();
        const events = parseICS(ics, feed.category);
        if (events.length > 0) return events;
      }
    } catch {
      // fall through
    }
  }

  // 4. Fixture data
  if (feed.fixture) {
    return parseICS(feed.fixture, feed.category);
  }

  return [];
}

function cleanEvents(events: CalendarEvent[], feed: FeedPlugin): CalendarEvent[] {
  return events.map((e) => {
    let summary = e.summary;
    if (feed.stripSummaryPrefix && summary.startsWith(feed.stripSummaryPrefix)) {
      summary = summary.slice(feed.stripSummaryPrefix.length);
    }
    if (feed.stripSummarySuffix && summary.endsWith(feed.stripSummarySuffix)) {
      summary = summary.slice(0, -feed.stripSummarySuffix.length);
    }
    let icon = feed.icon ?? e.emoji;
    if (feed.signIcons) {
      for (const [sign, svg] of Object.entries(feed.signIcons)) {
        if (summary.includes(sign)) {
          icon = svg;
          // Strip leading emoji + space from summary
          summary = summary.replace(/^\S+\s+/, "");
          break;
        }
      }
    }
    // Apply dedupeKey from plugin's dedupeKeys map (matches against cleaned summary)
    let dedupeKey = e.dedupeKey;
    if (!dedupeKey && feed.dedupeKeys) {
      dedupeKey = feed.dedupeKeys[summary];
    }
    return { ...e, summary, emoji: icon, dedupeKey };
  });
}

function filterByTokens(
  events: CalendarEvent[],
  feed: FeedPlugin,
  activeTokens: Set<string>,
): CalendarEvent[] {
  const tokenToFilter = feed.includeTokens!;
  const activeFilters = new Set<string>();
  for (const [token, filter] of Object.entries(tokenToFilter)) {
    if (activeTokens.has(token)) activeFilters.add(filter);
  }

  return events.filter((e) => {
    // Match UID prefix: "moon-full_moon-..." → "full_moon", "solar-winter_solstice-..." → "solar"
    for (const filter of activeFilters) {
      if (e.uid.includes(`-${filter}-`) || e.uid.startsWith(`${filter}-`)) {
        return true;
      }
    }
    return false;
  });
}
