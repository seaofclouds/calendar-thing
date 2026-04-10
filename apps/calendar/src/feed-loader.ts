import type { FeedPlugin } from "@calendar-feeds/shared";
import astronomyPlugin from "../../../feeds/astronomy/feed.plugin";
import { theatrical, digital } from "../../../feeds/movies/feed.plugin";
import busdPlugin from "../../../feeds/busd/feed.plugin";
import astrologyPlugin from "../../../feeds/astrology/feed.plugin";

const plugins: FeedPlugin[] = [
  astronomyPlugin,
  theatrical,
  digital,
  busdPlugin,
  astrologyPlugin,
];

const feeds = new Map<string, FeedPlugin>(plugins.map((p) => [p.id, p]));

export function getFeed(id: string): FeedPlugin | undefined {
  return feeds.get(id);
}

export function getAllFeeds(): FeedPlugin[] {
  return Array.from(feeds.values());
}
