/**
 * Local-state persistence via localStorage.
 * Saves feed selections, config preferences, and custom ICS URLs
 * so they persist across page reloads and browser sessions.
 * Client-side only — bundled by esbuild into client.js.
 */

const STORAGE_KEY = "calendar-state";

export interface CustomFeed {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

export interface CalendarConfig {
  size: string;
  orientation: string;
  layout: string;
  length: string;
  margin: string;
  scaling: string;
  gutter: string;
}

export interface CalendarState {
  version: 1;
  year: number;
  config: CalendarConfig;
  include: string;
  customFeeds: CustomFeed[];
}

// ─── Read / Write ─────────────────────────────────────────────────

export function loadState(): CalendarState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return null;
    return parsed as CalendarState;
  } catch {
    return null;
  }
}

export function saveState(state: CalendarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// ─── Partial updates ──────────────────────────────────────────────

/** Save config changes, merging with existing state */
export function saveConfig(updates: Partial<CalendarConfig>): void {
  const state = loadState() ?? stateFromUrl();
  Object.assign(state.config, updates);
  saveState(state);
}

/** Save the include param string */
export function saveInclude(include: string): void {
  const state = loadState() ?? stateFromUrl();
  state.include = include;
  saveState(state);
}

// ─── Custom feeds ─────────────────────────────────────────────────

export function addCustomFeed(name: string, url: string): CustomFeed {
  const state = loadState() ?? stateFromUrl();
  const feed: CustomFeed = {
    id: `cf_${Date.now()}`,
    name,
    url,
    enabled: true,
  };
  state.customFeeds.push(feed);
  saveState(state);
  return feed;
}

export function removeCustomFeed(id: string): void {
  const state = loadState();
  if (!state) return;
  state.customFeeds = state.customFeeds.filter((f) => f.id !== id);
  saveState(state);
}

export function toggleCustomFeed(id: string, enabled: boolean): void {
  const state = loadState();
  if (!state) return;
  const feed = state.customFeeds.find((f) => f.id === id);
  if (feed) {
    feed.enabled = enabled;
    saveState(state);
  }
}

// ─── URL ↔ State ──────────────────────────────────────────────────

/** Capture the current URL state into a CalendarState object */
export function stateFromUrl(): CalendarState {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/\/config\/(\d+)/);
  const year = match ? parseInt(match[1]) : new Date().getFullYear();

  return {
    version: 1,
    year,
    config: {
      size: url.searchParams.get("size") ?? "letter",
      orientation: url.searchParams.get("orientation") ?? "landscape",
      layout: url.searchParams.get("layout") ?? "single",
      length: url.searchParams.get("length") ?? "12",
      margin: url.searchParams.get("margin") ?? "0.25in",
      scaling: url.searchParams.get("scaling") ?? "fit",
      gutter: url.searchParams.get("gutter") ?? "0.5in",
    },
    include: url.searchParams.get("include") ?? "",
    customFeeds: [],
  };
}

/** Build a full URL from saved state */
export function buildUrlFromState(state: CalendarState, basePath: string): string {
  const url = new URL(basePath, window.location.origin);

  url.searchParams.set("size", state.config.size);
  url.searchParams.set("orientation", state.config.orientation);
  url.searchParams.set("layout", state.config.layout);
  url.searchParams.set("length", state.config.length);
  url.searchParams.set("margin", state.config.margin);
  url.searchParams.set("scaling", state.config.scaling);
  url.searchParams.set("gutter", state.config.gutter);

  if (state.include) {
    url.searchParams.set("include", state.include);
  }

  for (const cf of state.customFeeds) {
    if (cf.enabled) {
      url.searchParams.append("feed", cf.url);
    }
  }

  // Serialize without encoding colons/commas (readable include param),
  // but encode feed URLs which contain special characters
  const parts: string[] = [];
  url.searchParams.forEach((v, k) => {
    parts.push(`${k}=${k === "feed" ? encodeURIComponent(v) : v}`);
  });
  return url.pathname + (parts.length ? "?" + parts.join("&") : "");
}

/**
 * Check if the current URL has explicit config params.
 * If not, the client should restore from localStorage.
 */
export function urlHasExplicitParams(): boolean {
  const url = new URL(window.location.href);
  return url.searchParams.has("size") ||
    url.searchParams.has("orientation") ||
    url.searchParams.has("include") ||
    url.searchParams.has("feed");
}

/**
 * Append custom feed ?feed= params to a URL from saved state.
 * Used by config.ts when building reload URLs.
 */
export function appendCustomFeeds(url: URL): void {
  const state = loadState();
  if (!state) return;
  url.searchParams.delete("feed");
  for (const cf of state.customFeeds) {
    if (cf.enabled) {
      url.searchParams.append("feed", cf.url);
    }
  }
}
