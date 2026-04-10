import type { FeedPlugin } from "@calendar-feeds/shared";

export interface FeedRegistry {
  get(id: string): FeedPlugin | undefined;
  getAll(): FeedPlugin[];
}

export function createFeedRegistry(plugins: FeedPlugin[]): FeedRegistry {
  const feeds = new Map<string, FeedPlugin>(plugins.map((p) => [p.id, p]));
  return {
    get: (id) => feeds.get(id),
    getAll: () => Array.from(feeds.values()),
  };
}
