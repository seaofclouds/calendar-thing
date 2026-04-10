# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm install                # Install all dependencies
pnpm typecheck              # Type-check all packages (the only validation step — no test suite)
pnpm dev:calendar           # Run calendar app locally (Cloudflare Pages)
pnpm dev:astronomy          # Run astronomy feed worker locally
pnpm dev:movie              # Run movies feed worker locally
pnpm dev:astrology          # Run astrology feed worker locally
pnpm deploy:calendar        # Deploy calendar app to CF Pages
pnpm deploy:astronomy       # Deploy astronomy worker
pnpm deploy:movie           # Deploy movies worker
pnpm deploy:astrology       # Deploy astrology worker
```

Individual packages use `pnpm --filter @calendar-feeds/<name> <script>`. Build is esbuild-based (calendar app only).

## Architecture

Monorepo of Cloudflare Workers (pnpm workspaces) generating calendar feeds and rendering printable calendars.

**Three layers:**

1. **Shared package** (`shared/`) — no build step, TypeScript only, single `@calendar-feeds/shared` package
   - `types.ts` — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent`, `FeedPlugin`, `FeedRenderMode` interfaces
   - `ics.ts` — RFC 5545 ICS generation helpers (`escapeICS`, `buildVEvent`, `wrapVCalendar`)
   - `worker.ts` — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers
   - `feed-worker.ts` — `createFeedWorker()` factory for shared routing/auth/cache boilerplate

2. **Feed workers** (`feeds/`) — independent CF Workers serving ICS + JSON
   - `astrology` — Zodiac season events (tropical/Western dates in `zodiac.ts`), no external APIs. Per-sign Streamline SVG icons in calendar app
   - `astronomy` — Astronomical computations (Jean Meeus algorithms in `moon.ts`, `solar.ts`), no external APIs. Lunar phases + solar events (equinox/solstice)
   - `busd` — BUSD TK-12 school calendar (fixture-only, no worker — served via calendar app feed proxy)
   - `movies` — TMDB API integration (`tmdb.ts`), requires `TMDB_API_KEY` secret. Two plugins (`movies-theatrical`, `movies-digital`) from one worker. Two-pass discovery (popularity + release date sort), excludes Indian cinema + Bengali + Cantonese + Arabic languages, filters re-releases, rolling date window, popularity threshold of 5

3. **Feed plugins** (`feeds/*/feed.plugin.ts`) — co-located config for each feed
   - Each feed exports a `FeedPlugin` manifest with name, icons, include tokens, transforms, and fixture data
   - `renderMode: "event-list"` for text events (movies, school, astrology) or `"day-marker"` for icon markers (lunar, solar)
   - Plugins can define `tokenAliases` to expand shorthand tokens (e.g. `lunar:phases` → `lunar:full,lunar:new,lunar:quarter`)
   - Fixtures in `feeds/*/fixtures/*.ics` — ICS data for offline dev fallback

4. **Calendar app** (`apps/calendar/`) — CF Worker rendering printable year + month calendars as server-side HTML
   - **Year view** (`/:year`) — 12-month grid with lunar/solar markers, clickable months
   - **Month view** (`/:year/:month`) — single month with day cells, events, mini prev/next calendars
   - **Feed loader** (`feed-loader.ts`) — registers all feed plugins, provides `getFeed()`/`getAllFeeds()`
   - **Feed fetcher** (`feed-fetcher.ts`) — four-tier fallback: service binding → prod URL + token → source URL (external ICS) → fixture ICS
   - **Include parser** (`include.ts`) — data-driven `?include=` param parsing from feed plugin manifests, with alias expansion
   - **ICS parser** (`parse-ics.ts`) — universal VEVENT parser, handles multi-day event expansion
   - Connects to feed workers via **service bindings** (not HTTP — uses `env.ASTRONOMY.fetch()`)
   - Internal service binding calls use `https://internal/...` hostname to bypass token auth
   - Client-side JS (`client.ts`) handles responsive layout and image export via `html-to-image`

**Data flow:** Calendar app → feed-loader (discovers plugins) → feed-fetcher (service binding / prod URL / source URL / fixture) → ICS → `parseICS()` → `CalendarEvent[]` → split by `renderMode` → server-side HTML render

## Key Patterns

- **Auth:** All feed endpoints require `?token=CALENDAR_TOKEN`. Service binding calls use `hostname === "internal"` to bypass auth (handled by `authenticateToken()` in shared).
- **Feed worker factory:** Feed workers use `createFeedWorker()` from `@calendar-feeds/shared` — provides shared routing, auth, and caching. Each worker just defines its routes and handlers.
- **Caching:** 24-hour edge caching via `withEdgeCache()` wrapper.
- **URL routing** (calendar app): `/:year`, `/:year/:month`, `/:year/:size`, `/:year/:size/:orientation`, `/:year/:size/:orientation/300dpi.png`. Query params: `rows`, `header`, `test`, `include`, `borders`, `feed`.
- **Include param:** `?include=lunar:full,lunar:new,lunar:quarter,solar:season,movies,busd,astrology` — controls which feeds are shown. Defaults defined per-plugin via `defaultInclude` (lunar:full + lunar:new + lunar:quarter + solar:season on by default, others off). `movies` is shorthand for both `movies-theatrical` and `movies-digital`. `lunar:phases` is an alias for all lunar tokens.
- **Feed proxy:** `/feeds/{id}.ics?token=` — proxies ICS feeds through the calendar app via service bindings (e.g. `/feeds/movies-theatrical.ics`, `/feeds/astronomy.ics`, `/feeds/astrology.ics`, `/feeds/busd.ics`). Routes are derived from the feed plugin registry.
- **Feed param:** `?feed=https://example.com/cal.ics` — external ICS feed URL (fetched with 5s timeout).
- **No test framework** — validation is `pnpm typecheck` only.
- **Wrangler configs** are per-worker (`apps/calendar/wrangler.toml`, `feeds/*/wrangler.toml`). The root `wrangler.toml` is unused.

## Secrets (set via `npx wrangler secret put`)

- `CALENDAR_TOKEN` — required by all feed workers (astronomy, movies, astrology)
- `TMDB_API_KEY` — required by movies worker only
