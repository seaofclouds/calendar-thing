# Marker & List Display Options

## Context

Today each feed plugin declares a single `renderMode: "event-list" | "day-marker"`. Events are split into two non-overlapping arrays at render time — an event is either an icon marker OR a text list item, never both. This is too rigid:

- **Birthdays/anniversaries** should show a marker icon on the year view AND the name in the month view (both modes)
- **Moon/solstice** work fine as markers alone, but a user might want them listed too
- **Too many markers** on one day creates visual clutter — need a cap (~2)
- **Markers in different contexts** — a birthday marker makes sense in year/mini views but shouldn't compete with moon/solar in the month view header

This plan designs the type system, include param, and rendering changes to support flexible per-feed display modes. Since there's only one user, we do a clean cut — no deprecation bridge or backward-compat shim for `renderMode`.

---

## Design

### 1. Replace `renderMode` with display capabilities

**File: `shared/src/types.ts`**

```typescript
// New type replacing FeedRenderMode
export type DisplayMode = "marker" | "list";

export interface FeedPlugin {
  // REMOVE: renderMode: FeedRenderMode;
  
  // What this feed CAN show as (capabilities of the data)
  displayModes: DisplayMode[];
  
  // Which modes are active by default (subset of displayModes)
  defaultDisplayModes: DisplayMode[];
  
  // ... rest unchanged ...
}
```

**Feed mapping (clean replacement — delete `renderMode` and `FeedRenderMode` entirely):**

| Feed | Old `renderMode` | `displayModes` | `defaultDisplayModes` |
|---|---|---|---|
| `astronomy` | `"day-marker"` | `["marker", "list"]` | `["marker"]` |
| `movies-*` | `"event-list"` | `["list"]` | `["list"]` |
| `holidays-us` | `"event-list"` | `["list", "marker"]` | `["list"]` |
| `busd` | `"event-list"` | `["list"]` | `["list"]` |
| `astrology` | `"event-list"` | `["list"]` | `["list"]` |

Astronomy gets `["marker", "list"]` because its events have both icons and meaningful text ("Full Moon", "Summer Solstice"). A future birthday feed would declare `displayModes: ["marker", "list"]`, `defaultDisplayModes: ["marker", "list"]`, and `markerContext: "compact"` — showing the marker in year/mini views but not competing with moon/solar in the month header.

### 2. Include param syntax for display overrides

**File: `packages/feeds/src/include.ts`**

Display overrides apply **per-feed** (not per-token). Extend the `?include=` syntax with an optional `[mode]` suffix on the feed-level token:

```
?include=lunar:full,solar:season                          # defaults (backward compat)
?include=astronomy[list],movies                           # override whole feed's display
?include=birthday[marker+list]                            # both modes
```

- No suffix = use feed's `defaultDisplayModes`
- `[marker]` / `[list]` / `[marker+list]` = override for the feed
- `+` separates modes within brackets (avoids collision with `,` token delimiter)
- Square brackets are URL-safe in practice, no percent-encoding needed
- For feeds with sub-tokens (e.g. `lunar:full`), the override attaches to any token for that feed — all tokens share the feed's display mode

**Extended IncludeState:**

```typescript
// Old: Record<string, Set<string>>
// New:
export interface FeedIncludeEntry {
  tokens: Set<string>;
  displayOverride?: Set<DisplayMode>;  // undefined = use feed defaults
}
export type IncludeState = Record<string, FeedIncludeEntry>;
```

New helper:

```typescript
export function getEffectiveDisplayModes(
  state: IncludeState, feed: FeedPlugin
): Set<DisplayMode> {
  const entry = state[feed.id];
  if (!entry) return new Set();
  return entry.displayOverride ?? new Set(feed.defaultDisplayModes);
}
```

### 3. Event splitting: allow both arrays

**File: `apps/calendar/src/index.ts` (lines 125-130 and 406-410)**

Current binary split becomes independent membership:

```typescript
// Build category -> display modes map
const categoryModes = new Map<string, Set<DisplayMode>>();
for (const feed of enabledFeeds) {
  const modes = getEffectiveDisplayModes(params.include, feed);
  const existing = categoryModes.get(feed.category);
  if (existing) { for (const m of modes) existing.add(m); }
  else categoryModes.set(feed.category, new Set(modes));
}

// Events can appear in BOTH arrays now (independent ifs, not if/else)
const markers = allEvents.filter(e => categoryModes.get(e.category)?.has("marker"));
const events  = allEvents.filter(e => categoryModes.get(e.category)?.has("list"));
```

Extract to a shared helper `splitEventsByDisplayMode()` since this logic is duplicated in two places in index.ts.

### 4. Marker limit (max 2 per day)

**File: `apps/calendar/src/render-utils.ts`**

Enhance `buildMarkerMap` with a `maxPerDay` parameter (default 2). The existing `markerPriority` function already sorts solar > lunar. Generalize for new feed types:

```typescript
function markerPriority(e: CalendarEvent): number {
  if (e.uid.startsWith("solar-")) return 0;   // rarest, highest priority
  if (e.uid.startsWith("lunar-")) return 1;
  return 2;                                     // birthdays, holidays, etc.
}
```

Later, could add `markerPriority: number` to `FeedPlugin` for plugin-controlled ordering, but hardcoded is fine for now.

**Year view** (`render.ts`): Currently shows only `markers[0]` — the highest-priority marker. No change needed; the limit ensures the sorted list is pre-truncated. All marker-enabled feeds compete equally for the year view slot.

**Month view** (`render-month.ts`): Already joins multiple marker emojis. The limit caps what gets passed in.

### 5. View-context markers (future consideration)

Some markers (moon, solar) belong everywhere. Others (birthdays) make sense in the year/mini views (where they replace the date number to flag a notable day) but shouldn't compete for marker space in the month view header — the list entry with icon is the primary representation there.

This could be modeled as an optional `markerContext` on `FeedPlugin`:

```typescript
markerContext?: "all" | "compact";  // default "all"
// "all"     — marker shows in year + month views (moon, solar)
// "compact" — marker only in year + mini views (birthdays, anniversaries)
```

The month view rendering would filter out `"compact"` markers from the day header while still including them in the markers array for the year view. This keeps the priority system simple — `markerContext` controls WHERE markers appear, `markerPriority` controls which ones WIN when there's a limit.

Not needed for v1 but worth baking into the `FeedPlugin` interface early so plugins can declare it.

### 6. List items always show their icon

When a feed is displayed as both marker+list, the list entry still includes its emoji/icon prefix — the marker and list are fully independent representations. This keeps rendering logic simple (no conditional "suppress icon when marker is also present") and is visually consistent.

### 7. Known limitation: per-category granularity

Events carry `category` (not `feed.id`), so two feeds sharing a category (e.g., `movies-theatrical` + `movies-digital` both have category `"movie"`) get their display modes unioned. You can't make one a marker and the other a list. This is fine for current feeds — the only shared-category feeds are the two movie plugins, which are both list-only. If finer granularity is needed later, events would need to carry their `feed.id`.

---

## Files to modify

1. **`shared/src/types.ts`** — Add `DisplayMode`, update `FeedPlugin` interface
2. **`packages/feeds/src/include.ts`** — `IncludeState` shape change, bracket parsing, `getEffectiveDisplayModes`, `splitEventsByDisplayMode`
3. **`apps/calendar/src/index.ts`** — Wire up new splitting logic (two locations: main route ~L126, config route ~L406)
4. **`feeds/astronomy/feed.plugin.ts`** — Migrate to `displayModes: ["marker", "list"]`
5. **All other `feed.plugin.ts` files** — Migrate to new fields
6. **`apps/calendar/src/render-utils.ts`** — `buildMarkerMap` limit + priority generalization

## Implementation sequence

1. Replace `FeedRenderMode` with `DisplayMode` in types, update `FeedPlugin` interface (clean cut — no bridge)
2. Update all feed plugins to new fields
3. Extend `IncludeState` and include parsing with bracket syntax
4. Update splitting logic in `index.ts` (both locations)
5. Add marker limit to `buildMarkerMap`

## Verification

- `pnpm typecheck` passes at each step
- Default URLs produce identical output (defaultDisplayModes match old renderMode behavior)
- `?include=astronomy[list]` moves moon/solar from markers to event list in month view
- `?include=astronomy[marker+list]` shows solstice/moon as both marker icon and text entry
- Days with >2 markers only render the top 2 by priority
- Year view still shows highest-priority marker per day
