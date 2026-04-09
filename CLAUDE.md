# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm install                # Install all dependencies
pnpm typecheck              # Type-check all packages (the only validation step — no test suite)
pnpm dev:calendar           # Run calendar app locally (Cloudflare Pages)
pnpm dev:moon               # Run moon-phase feed worker locally
pnpm dev:movie              # Run movie-release feed worker locally
pnpm deploy:calendar        # Deploy calendar app to CF Pages
pnpm deploy:moon            # Deploy moon-phase worker
pnpm deploy:movie           # Deploy movie-release worker
```

Individual packages use `pnpm --filter @calendar-feeds/<name> <script>`. Build is esbuild-based (calendar app only).

## Architecture

Monorepo of Cloudflare Workers (pnpm workspaces) generating calendar feeds and rendering printable calendars.

**Three layers:**

1. **Shared packages** (`packages/`) — no build step, TypeScript only
   - `feed-types` — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent` interfaces
   - `ics-utils` — RFC 5545 ICS generation helpers
   - `worker-utils` — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers

2. **Feed workers** (`feeds/`) — independent CF Workers serving ICS + JSON
   - `moon-phase` — Astronomical computations (Jean Meeus algorithms in `moon.ts`, `solar.ts`), no external APIs
   - `movie-release` — TMDB API integration (`tmdb.ts`), requires `TMDB_API_KEY` secret. Two-pass discovery (popularity + release date sort), theatrical/digital endpoint differentiation, excludes Indian cinema + Bengali + Cantonese + Arabic languages, filters re-releases, rolling date window, popularity threshold of 5

3. **Feed fixtures** (`feeds/*/fixtures/`) — ICS test data for local dev, imported as text modules
   - `movie-release/fixtures/theatrical.ics` — real 2026 TMDB data (Apr-Jun)
   - `busd-calendar/fixtures/busd-2025-2026.ics` — BUSD school calendar (3 school years)

4. **Calendar app** (`apps/calendar/`) — CF Worker rendering printable year + month calendars as server-side HTML
   - **Year view** (`/:year`) — 12-month grid with moon/solar markers, clickable months
   - **Month view** (`/:year/:month`) — single month with day cells, events, mini prev/next calendars
   - **Feed system** (`feeds.ts`) — plugin-style feed config with three-tier fallback: service binding → prod URL + token → fixture ICS
   - **ICS parser** (`parse-ics.ts`) — universal VEVENT parser, handles multi-day event expansion
   - Connects to feed workers via **service bindings** (not HTTP — uses `env.MOON_PHASE.fetch()`)
   - Internal service binding calls use `https://internal/...` hostname to bypass token auth
   - Client-side JS (`client.ts`) handles responsive layout and image export via `html-to-image`

**Data flow:** Calendar app → feed system (service binding / prod URL / fixture) → ICS → `parseICS()` → `CalendarEvent[]` → server-side HTML render

## Key Patterns

- **Auth:** All feed endpoints require `?token=CALENDAR_TOKEN`. Service binding calls use `hostname === "internal"` to bypass auth (handled by `authenticateToken()` in worker-utils).
- **Caching:** 24-hour edge caching via `withEdgeCache()` wrapper.
- **URL routing** (calendar app): `/:year`, `/:year/:month`, `/:year/:size`, `/:year/:size/:orientation`, `/:year/:size/:orientation/300dpi.png`. Query params: `rows`, `header`, `test`, `include`, `borders`, `feed`.
- **Include param:** `?include=moon:full,moon:new,solar:season,movies,busd` — controls which feeds are shown. Defaults: fullMoon + solarEvents on, others off.
- **Feed param:** `?feed=https://example.com/cal.ics` — external ICS feed URL (fetched with 5s timeout).
- **No test framework** — validation is `pnpm typecheck` only.
- **Wrangler configs** are per-worker (`apps/calendar/wrangler.toml`, `feeds/*/wrangler.toml`). The root `wrangler.toml` is unused.

## Secrets (set via `npx wrangler secret put`)

- `CALENDAR_TOKEN` — required by both feed workers
- `TMDB_API_KEY` — required by movie-release worker only
