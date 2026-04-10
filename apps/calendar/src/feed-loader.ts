import type { FeedPlugin } from "@calendar-feeds/feed-types";
import astronomyPlugin from "../../../feeds/astronomy/feed.plugin";
import { theatrical as movieTheatricalPlugin, digital as movieDigitalPlugin } from "../../../feeds/movies/feed.plugin";
import busdPlugin from "../../../feeds/busd/feed.plugin";
import astrologyPlugin from "../../../feeds/astrology/feed.plugin";

export interface ResolvedFeed extends FeedPlugin {
  fixture: string;
}

const feeds = new Map<string, ResolvedFeed>();

function registerFeed(plugin: ResolvedFeed) {
  feeds.set(plugin.id, plugin);
}

registerFeed(astronomyPlugin);
registerFeed(movieTheatricalPlugin);
registerFeed(movieDigitalPlugin);
registerFeed(busdPlugin);
registerFeed(astrologyPlugin);

export function getFeed(id: string): ResolvedFeed | undefined {
  return feeds.get(id);
}

export function getAllFeeds(): ResolvedFeed[] {
  return Array.from(feeds.values());
}
