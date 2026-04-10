import type { ResolvedFeed } from "./feed-loader";

export type IncludeState = Record<string, Set<string>>;

export function parseIncludeParam(
  value: string | null,
  registry: ResolvedFeed[],
): IncludeState {
  const state: IncludeState = {};

  if (!value) {
    for (const feed of registry) {
      if (feed.defaultInclude && feed.defaultInclude.length > 0) {
        state[feed.id] = new Set(feed.defaultInclude);
      }
    }
    return state;
  }

  const tokens = expandAliases(value.split(",").map((s) => s.trim()), registry);
  for (const feed of registry) {
    if (feed.includeTokens) {
      const active = new Set<string>();
      for (const token of Object.keys(feed.includeTokens)) {
        if (tokens.includes(token)) active.add(token);
      }
      if (active.size > 0) state[feed.id] = active;
    } else {
      // Match exact id or prefix shorthand (e.g. "movies" matches "movies-theatrical" and "movies-digital")
      const match = tokens.includes(feed.id)
        || tokens.some((t) => feed.id.startsWith(t + "-"));
      if (match) {
        state[feed.id] = new Set([feed.id]);
      }
    }
  }
  return state;
}

export function isFeedEnabled(state: IncludeState, feedId: string): boolean {
  return feedId in state;
}

export function getActiveTokens(state: IncludeState, feedId: string): Set<string> {
  return state[feedId] ?? new Set();
}

function expandAliases(tokens: string[], registry: ResolvedFeed[]): string[] {
  const aliasMap = new Map<string, string[]>();
  for (const feed of registry) {
    if (feed.tokenAliases) {
      for (const [alias, expansion] of Object.entries(feed.tokenAliases)) {
        aliasMap.set(alias, expansion);
      }
    }
  }
  if (aliasMap.size === 0) return tokens;

  const expanded: string[] = [];
  for (const token of tokens) {
    const expansion = aliasMap.get(token);
    if (expansion) {
      expanded.push(...expansion);
    } else {
      expanded.push(token);
    }
  }
  return expanded;
}
