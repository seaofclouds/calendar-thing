# App Architecture Abstraction — Extract Feed Aggregator

## Context

The calendar app (`apps/calendar/`) combines two distinct concerns:

1. **Feed aggregation** — discovering feed plugins, fetching ICS via service bindings/URLs/fixtures, parsing ICS, filtering by include tokens
2. **Print/rendering** — generating HTML year/month views, print layouts, page sizing, image export

We want these cleanly separated so that:

- A new consumer (API worker, management UI, different renderer) can use feed aggregation without pulling in rendering code
- The calendar app's identity becomes explicit: it's a print/rendering app that imports a feed aggregation library
- Feed aggregation logic can evolve independently of rendering concerns

This is **not** about splitting into separate workers. It's about making implicit boundaries explicit through package structure.

## What changed since the original plan

The [worker factory refactoring](./plan--worker-factory.md) completed several things that affect this plan:

| Original assumption | Current reality |
|---|---|
| Three separate packages existed (`packages/feed-types`, `packages/ics-utils`, `packages/worker-utils`) | Consolidated into single `shared/` package (`@calendar-feeds/shared`) |
| `packages/` directory existed in workspace | `packages/` was deleted; workspace is `shared`, `feeds/*`, `apps/*` |
| Feed-aggregator would depend on `@calendar-feeds/feed-types` + `@calendar-feeds/ics-utils` | Single dependency: `@calendar-feeds/shared` |
| `feed-loader.ts` used `registerFeed()` pattern | Simplified to static array + Map; exports `getFeed()` / `getAllFeeds()` |
| `FeedPlugin` lacked `sourceUrl` / `fixture` | Both are now first-class optional fields on `FeedPlugin` |
| Feed workers had bespoke routing/auth/cache | All use `createFeedWorker()` factory from shared |
| BUSD had phantom `binding`/`prodUrl` workarounds | Cleaned up — BUSD is a clean fixture-only plugin |

**Net effect:** The code is already cleaner and more modular. The four files to extract (`feed-loader.ts`, `feed-fetcher.ts`, `parse-ics.ts`, `include.ts`) have no internal coupling to rendering code. Extraction is straightforward.

**Stale cleanup opportunity:** All three feed worker `wrangler.toml` files still have `[alias]` sections pointing to the deleted `../../packages/ics-utils` and `../../packages/worker-utils`. These are dead — feed workers import `@calendar-feeds/shared` via workspace resolution now. Should be cleaned up alongside or before this work.

## Design decision: registration vs. static imports

The original plan assumed feed-loader.ts would use `registerFeed()` calls. The current code is simpler — a static array of imported plugins. After extraction, the question is: **who imports the plugins?**

**Option A (recommended): Consumer provides plugins.** The feed-aggregator package exports utility functions that accept a plugin list. The calendar app imports plugins from `feeds/*/feed.plugin.ts` and passes them in. The aggregator has zero knowledge of specific feeds.

```typescript
// Calendar app's index.ts
import { createFeedRegistry } from "@calendar-feeds/feed-aggregator";
import astronomyPlugin from "../../feeds/astronomy/feed.plugin";
// ...
const registry = createFeedRegistry([astronomyPlugin, theatrical, digital, busdPlugin, astrologyPlugin]);
```

**Option B: Feed-aggregator imports plugins directly.** Simpler for the calendar app but creates a hard dependency — any consumer gets all plugins whether they want them or not.

Option A is better. It keeps the aggregator generic and lets consumers pick which feeds to register. The `createFeedRegistry()` factory replaces the current top-level Map construction in feed-loader.ts.

## Plan

### Phase 1: Create `packages/feed-aggregator/`

Re-introduce `packages/` for this purpose. The prior deletion of `packages/` was warranted — it held 3 tiny utility packages (265 lines total) that belonged together. A feed-aggregator is a different beast: a substantial, purpose-built package with clear boundaries.

**Files to move from `apps/calendar/src/`:**

| Source | Destination | Notes |
|---|---|---|
| `feed-loader.ts` | `packages/feed-aggregator/src/registry.ts` | Rename to reflect its role as a registry factory |
| `feed-fetcher.ts` | `packages/feed-aggregator/src/fetcher.ts` | Unchanged logic |
| `parse-ics.ts` | `packages/feed-aggregator/src/parse-ics.ts` | Unchanged |
| `include.ts` | `packages/feed-aggregator/src/include.ts` | Unchanged |

**New files:**

```
packages/feed-aggregator/
├── package.json            ← @calendar-feeds/feed-aggregator
├── tsconfig.json
└── src/
    ├── index.ts            ← barrel re-exports
    ├── registry.ts         ← createFeedRegistry(), getFeed(), getAllFeeds()
    ├── fetcher.ts          ← fetchFeedEvents() with 4-tier fallback
    ├── parse-ics.ts        ← parseICS()
    └── include.ts          ← parseIncludeParam(), isFeedEnabled(), getActiveTokens()
```

**Package setup:**

```json
{
  "name": "@calendar-feeds/feed-aggregator",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@calendar-feeds/shared": "workspace:*"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241127.0",
    "typescript": "^5.7.2"
  }
}
```

No build step — TypeScript source consumed directly via workspace resolution + wrangler alias (same pattern as `shared/`).

**Registry API change:**

Current `feed-loader.ts` constructs a module-level Map from hardcoded imports. After extraction, the registry becomes a factory:

```typescript
// packages/feed-aggregator/src/registry.ts
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
```

**Barrel export:**

```typescript
// packages/feed-aggregator/src/index.ts
export { createFeedRegistry, type FeedRegistry } from "./registry";
export { fetchFeedEvents } from "./fetcher";
export { parseICS } from "./parse-ics";
export { parseIncludeParam, isFeedEnabled, getActiveTokens, type IncludeState } from "./include";
```

### Phase 2: Update calendar app

After extraction, `apps/calendar/src/index.ts` becomes a thin orchestrator:

1. **Imports plugins** from `../../feeds/*/feed.plugin.ts` (same relative paths, just moved up one level from feed-loader)
2. **Creates registry** via `createFeedRegistry()`
3. **Parses URL** (routing — stays in calendar app)
4. **Fetches events** via feed-aggregator's `fetchFeedEvents()` + `parseIncludeParam()`
5. **Dispatches to renderers** (rendering — stays in calendar app)

The `fetchExternalFeed()` function currently in index.ts also moves to the aggregator — it's feed-fetching logic that uses `parseICS`.

**Files that stay in calendar app** (they ARE the app):
- `render.ts` — year view renderer
- `render-month.ts` — month view renderer
- `config.ts` — page sizes and layouts
- `client.ts` — client-side JS (image export)
- `styles.css` — print styles

**Import changes in `apps/calendar/src/index.ts`:**

```typescript
// Before
import { getAllFeeds } from "./feed-loader";
import { fetchFeedEvents } from "./feed-fetcher";
import { parseICS } from "./parse-ics";
import { parseIncludeParam, isFeedEnabled, getActiveTokens } from "./include";

// After
import {
  createFeedRegistry,
  fetchFeedEvents,
  fetchExternalFeed,
  parseIncludeParam,
  isFeedEnabled,
  getActiveTokens,
} from "@calendar-feeds/feed-aggregator";
import astronomyPlugin from "../../feeds/astronomy/feed.plugin";
import { theatrical, digital } from "../../feeds/movies/feed.plugin";
import busdPlugin from "../../feeds/busd/feed.plugin";
import astrologyPlugin from "../../feeds/astrology/feed.plugin";

const registry = createFeedRegistry([astronomyPlugin, theatrical, digital, busdPlugin, astrologyPlugin]);
```

### Phase 3: Update workspace and wrangler configs

**`pnpm-workspace.yaml`** — add `packages/*`:
```yaml
packages:
  - "shared"
  - "packages/*"
  - "feeds/*"
  - "apps/*"
```

**`apps/calendar/wrangler.toml`** — add alias for wrangler's bundler:
```toml
[alias]
"@calendar-feeds/feed-aggregator" = "../../packages/feed-aggregator/src/index.ts"
```

**`apps/calendar/package.json`** — add workspace dependency:
```json
"dependencies": {
  "@calendar-feeds/shared": "workspace:*",
  "@calendar-feeds/feed-aggregator": "workspace:*"
}
```

### Phase 4 (cleanup): Remove stale wrangler aliases

All three feed workers have dead `[alias]` sections:

```toml
# These point to ../../packages/ which was deleted
[alias]
"@calendar-feeds/ics-utils" = "../../packages/ics-utils/src/index.ts"
"@calendar-feeds/worker-utils" = "../../packages/worker-utils/src/index.ts"
```

Replace with the current shared package:

```toml
[alias]
"@calendar-feeds/shared" = "../../shared/src/index.ts"
```

This isn't strictly required (workspace resolution works without aliases), but aligns the wrangler configs with reality and prevents confusion.

## Files to modify/create

| File | Change |
|---|---|
| `packages/feed-aggregator/package.json` | Create — `@calendar-feeds/feed-aggregator` |
| `packages/feed-aggregator/tsconfig.json` | Create — extends base config |
| `packages/feed-aggregator/src/index.ts` | Create — barrel re-exports |
| `packages/feed-aggregator/src/registry.ts` | Move from `apps/calendar/src/feed-loader.ts`, refactor to factory |
| `packages/feed-aggregator/src/fetcher.ts` | Move from `apps/calendar/src/feed-fetcher.ts` |
| `packages/feed-aggregator/src/parse-ics.ts` | Move from `apps/calendar/src/parse-ics.ts` |
| `packages/feed-aggregator/src/include.ts` | Move from `apps/calendar/src/include.ts` |
| `apps/calendar/src/index.ts` | Update imports, create registry at startup, move `fetchExternalFeed` out |
| `apps/calendar/package.json` | Add `@calendar-feeds/feed-aggregator` dependency |
| `apps/calendar/wrangler.toml` | Add `[alias]` for feed-aggregator |
| `pnpm-workspace.yaml` | Add `"packages/*"` |
| `feeds/astronomy/wrangler.toml` | Fix stale `[alias]` section |
| `feeds/movies/wrangler.toml` | Fix stale `[alias]` section |
| `feeds/astrology/wrangler.toml` | Fix stale `[alias]` section |
| `apps/calendar/src/feed-loader.ts` | Delete (moved to aggregator) |
| `apps/calendar/src/feed-fetcher.ts` | Delete (moved to aggregator) |
| `apps/calendar/src/parse-ics.ts` | Delete (moved to aggregator) |
| `apps/calendar/src/include.ts` | Delete (moved to aggregator) |

## What this unlocks

- **New feed consumers** only need `@calendar-feeds/feed-aggregator` + `@calendar-feeds/shared` — no rendering code
- **Calendar app identity** is explicit: a print/rendering app that uses the feed aggregator
- **Future renderers** (photo calendars, agenda views, print-on-demand) are clearly separate apps importing the same aggregator
- **Feed management UI or API** can import the aggregator without any calendar rendering baggage
- **The aggregator is feed-agnostic** — consumers choose which plugins to register

## What stays the same

- Feed workers remain independent CF Workers (already clean)
- ICS is the integration format between feeds and consumers
- Service bindings stay in the calendar app's wrangler.toml
- All existing routes and behavior are unchanged
- No new workers, no new deployment targets
- `shared/` package unchanged — it provides types, ICS generation, and worker utilities

## Verification

1. `pnpm install` — workspace resolves new package
2. `pnpm typecheck` — all packages type-check
3. `pnpm dev:calendar` — calendar app works identically
4. `pnpm dev:astronomy` / `pnpm dev:movie` / `pnpm dev:astrology` — feed workers unaffected
5. Verify: calendar app imports from `@calendar-feeds/feed-aggregator`, not local files
6. Verify: `?include=` param still filters correctly
7. Verify: feed proxy (`/feeds/*.ics`) still works
8. Verify: external feed (`?feed=URL`) still works
