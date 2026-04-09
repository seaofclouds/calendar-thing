import type { FeedPlugin } from "@calendar-feeds/feed-types";
import moonPlugin from "../../../feeds/moon-phase/feed.plugin";
import moviePlugin from "../../../feeds/movie-release/feed.plugin";
import busdPlugin from "../../../feeds/busd-calendar/feed.plugin";
import astrologyPlugin from "../../../feeds/astrology/feed.plugin";

export interface ResolvedFeed extends FeedPlugin {
  fixture: string;
}

const feeds = new Map<string, ResolvedFeed>();

function registerFeed(plugin: ResolvedFeed) {
  feeds.set(plugin.id, plugin);
}

registerFeed(moonPlugin);
registerFeed(moviePlugin);
registerFeed(busdPlugin);
registerFeed(astrologyPlugin);

export function getFeed(id: string): ResolvedFeed | undefined {
  return feeds.get(id);
}

export function getAllFeeds(): ResolvedFeed[] {
  return Array.from(feeds.values());
}
