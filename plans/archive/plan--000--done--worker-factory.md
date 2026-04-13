# Feed Architecture Review & Improvements

## Context

The feed system works well but has accumulated inconsistencies across workers and the calendar app's feed pipeline. This change addresses three concerns:

1. **Worker consistency** — three workers share ~80% identical boilerplate but each implements from scratch
2. **Static feed pattern** — BUSD uses workarounds (empty `prodUrl`, phantom `binding`) because `FeedPlugin` doesn't model fixture-only feeds
3. **External URL feeds** — `?feed=URL` is ad-hoc with no icons/categories; we want registered external URL feeds as a stepping stone toward a config UI

**Follow-up (separate PR):** Switch internal transport from ICS to JSON — feeds return `CalendarEvent[]` directly, shared ICS converter handles `.ics` endpoints, calendar app fetches `.json`. The factory refactor here sets this up cleanly.

---

## 1. Merge shared packages into `shared/`

Consolidate `packages/feed-types` + `packages/ics-utils` + `packages/worker-utils` (265 lines total, 3 package.json + 3 tsconfig) into one package.

**New structure:**
```
shared/
├── package.json           ← @calendar-feeds/shared
├── tsconfig.json
└── src/
    ├── index.ts           ← re-exports everything
    ├── types.ts           ← FeedPlugin, CalendarEvent, FeedRenderMode, etc.
    ├── ics.ts             ← escapeICS, formatICSTimestamp, buildVEvent, wrapVCalendar (merged)
    ├── worker.ts          ← authenticateToken, withEdgeCache, icsResponse, jsonResponse, errorResponse
    └── feed-worker.ts     ← createFeedWorker() factory (new)
```

**Changes:**
- Create `shared/` at repo root with single `package.json` (`@calendar-feeds/shared`)
- Merge source files: `ics-utils/src/{escape,format,vevent,vcalendar}.ts` → `shared/src/ics.ts`
- Merge source files: `worker-utils/src/{auth,cache,response}.ts` → `shared/src/worker.ts`
- Move `feed-types/src/types.ts` → `shared/src/types.ts`
- Update `pnpm-workspace.yaml`: add `"shared"`, remove `"packages/*"`
- Delete `packages/` directory
- Update all imports across feeds and calendar app
- Update feed and app `package.json` dependencies to `@calendar-feeds/shared`

---

## 2. FeedPlugin type cleanup

**File:** `shared/src/types.ts`

Make `binding` and `prodUrl` optional. Add `sourceUrl` and `fixture`:

```typescript
export interface FeedPlugin {
  id: string;
  name: string;
  category: string;
  renderMode: FeedRenderMode;
  endpoint: string;
  binding?: string;        // optional — worker feeds only
  prodUrl?: string;        // optional — worker feeds only
  sourceUrl?: string;      // NEW — external ICS URL (e.g. Google Calendar)
  fixture?: string;        // moved from ResolvedFeed → first-class
  includeTokens?: Record<string, string>;
  tokenAliases?: Record<string, string[]>;
  defaultInclude?: string[];
  stripSummaryPrefix?: string;
  stripSummarySuffix?: string;
  icon?: string;
  signIcons?: Record<string, string>;
}
```

**Downstream:**
- Remove `ResolvedFeed` from `feed-loader.ts`, use `FeedPlugin` directly everywhere
- Remove `FeedPlugin & { fixture: string }` casts from all `feed.plugin.ts` files

---

## 3. Simplify feed loader

**File:** `apps/calendar/src/feed-loader.ts`

Replace individual `registerFeed()` calls with a single `plugins` array:

```typescript
import type { FeedPlugin } from "@calendar-feeds/shared";
// ... imports ...

const plugins: FeedPlugin[] = [
  astronomyPlugin, theatrical, digital, busdPlugin, astrologyPlugin,
];

const feeds = new Map<string, FeedPlugin>(plugins.map(p => [p.id, p]));

export function getFeed(id: string) { return feeds.get(id); }
export function getAllFeeds() { return Array.from(feeds.values()); }
```

---

## 4. Worker factory (`createFeedWorker`)

**File:** `shared/src/feed-worker.ts`

Extract the shared routing/auth/cache pattern. Each worker's entry point shrinks to config + domain logic:

```typescript
interface FeedRoute {
  path: string;
  handler: (request: Request, env: any, ctx: ExecutionContext) => Promise<Response>;
}

interface FeedWorkerConfig {
  name: string;
  cacheVersion: number;
  routes: FeedRoute[];
}

export function createFeedWorker(config: FeedWorkerConfig): ExportedHandler {
  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);

      // Health check (no auth)
      if (url.pathname === "/") {
        return new Response(`${config.name}\n`, {
          headers: { "Content-Type": "text/plain" },
        });
      }

      const route = config.routes.find(r => r.path === url.pathname);
      if (!route) return new Response("Not Found", { status: 404 });

      if (!authenticateToken(url, env.CALENDAR_TOKEN)) {
        return new Response("Unauthorized", { status: 401 });
      }

      return withEdgeCache(
        request, ctx,
        { version: config.cacheVersion },
        () => route.handler(request, env, ctx),
      );
    },
  };
}
```

**Refactored feeds:**
- `feeds/astronomy/src/index.ts` (~107 → ~30 lines): 2 routes, year parsing in handlers
- `feeds/astrology/src/index.ts` (~81 → ~25 lines): same pattern
- `feeds/movies/src/index.ts` (~126 → ~40 lines): 4 routes, try/catch for TMDB in handlers

---

## 5. External URL feed support (`sourceUrl`)

**File:** `apps/calendar/src/feed-fetcher.ts`

Add `sourceUrl` as fetch tier 3 in `fetchRaw()`, between prod URL and fixture:

```
1. Service binding (binding set + available in env)
2. Production URL + token (prodUrl set)
3. Source URL (sourceUrl set — external ICS, no token needed)
4. Fixture data (fixture set)
```

This lets external feeds be registered plugins with icons/categories/include tokens. The existing `?feed=URL` stays for one-off usage.

---

## 6. Feed plugin cleanups

- **BUSD** (`feeds/busd/feed.plugin.ts`): Remove phantom `binding: "BUSD"` and `prodUrl: ""`
- **All plugins**: Remove `FeedPlugin & { fixture: string }` type assertion

---

## Files to modify/create

| File | Change |
|------|--------|
| `shared/package.json` | New — `@calendar-feeds/shared` |
| `shared/tsconfig.json` | New |
| `shared/src/index.ts` | New — re-exports |
| `shared/src/types.ts` | From `packages/feed-types`, updated FeedPlugin |
| `shared/src/ics.ts` | Merged from `packages/ics-utils/src/*.ts` |
| `shared/src/worker.ts` | Merged from `packages/worker-utils/src/*.ts` |
| `shared/src/feed-worker.ts` | New — `createFeedWorker()` |
| `pnpm-workspace.yaml` | Add `"shared"`, remove `"packages/*"` |
| `feeds/astronomy/src/index.ts` | Refactor to `createFeedWorker()` |
| `feeds/astrology/src/index.ts` | Refactor to `createFeedWorker()` |
| `feeds/movies/src/index.ts` | Refactor to `createFeedWorker()` |
| `feeds/astronomy/feed.plugin.ts` | Remove type cast |
| `feeds/movies/feed.plugin.ts` | Remove type cast |
| `feeds/astrology/feed.plugin.ts` | Remove type cast |
| `feeds/busd/feed.plugin.ts` | Remove cast + phantom binding/prodUrl |
| `feeds/*/package.json` | Update dep to `@calendar-feeds/shared` |
| `apps/calendar/package.json` | Update dep |
| `apps/calendar/src/feed-loader.ts` | Remove `ResolvedFeed`, simplify |
| `apps/calendar/src/feed-fetcher.ts` | Add `sourceUrl` tier, `FeedPlugin` types |
| `apps/calendar/src/include.ts` | `ResolvedFeed` → `FeedPlugin` |
| `apps/calendar/src/index.ts` | Update types |
| `packages/` | Delete entire directory |

## Verification

1. `pnpm install` after workspace changes
2. `pnpm typecheck` — must pass across all packages
3. `pnpm dev:calendar` — verify calendar renders with all feeds
4. `pnpm dev:astronomy` / `pnpm dev:astrology` / `pnpm dev:movie` — verify workers serve ICS/JSON
5. Verify BUSD loads from fixture (no binding, no prodUrl)
6. Verify `?include=` param still filters correctly
