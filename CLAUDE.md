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

**Four layers:**

1. **Shared package** (`shared/`) — no build step, TypeScript only, single `@calendar-feeds/shared` package
   - `types.ts` — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent`, `FeedPlugin`, `FeedRenderMode` interfaces
   - `ics.ts` — RFC 5545 ICS generation helpers (`escapeICS`, `buildVEvent`, `wrapVCalendar`)
   - `worker.ts` — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers
   - `feed-worker.ts` — `createFeedWorker()` factory for shared routing/auth/cache boilerplate

2. **Feed workers** (`feeds/`) — independent CF Workers serving ICS + JSON (plus several fixture/external feeds with no worker)
   - `astrology` — Zodiac season events (tropical/Western dates in `zodiac.ts`), no external APIs. Per-sign Streamline SVG icons in calendar app
   - `astronomy` — Astronomical computations (Jean Meeus algorithms in `moon.ts`, `solar.ts`), no external APIs. Lunar phases + solar events (equinox/solstice)
   - `busd` — BUSD TK-12 school calendar (fixture-only, no worker — served via calendar app feed proxy)
   - `bhs-cheer` — Berkeley High cheer schedule (fixture-only). Off by default
   - `birthdays` — Personal birthdays with `RRULE:FREQ=YEARLY` expansion (fixture-only; fixture gitignored). Off by default
   - `holidays-us` — US holidays (fixture-only, `sourceUrl` points at Google's public US-holidays ICS with a bundled fixture fallback). Off by default
   - `movies` — TMDB API integration (`tmdb.ts`), requires `TMDB_API_KEY` secret. Two plugins (`movies-theatrical`, `movies-digital`) from one worker. Two-pass discovery (popularity + release date sort), excludes Indian cinema + Bengali + Cantonese + Arabic languages, filters re-releases, rolling date window, popularity threshold of 5

3. **Feed plugins** (`feeds/*/feed.plugin.ts`) — co-located config for each feed
   - Each feed exports a `FeedPlugin` manifest with name, icons, include tokens, transforms, and fixture data
   - `renderMode: "event-list"` for text events (movies, school, astrology) or `"day-marker"` for icon markers (lunar, solar)
   - Plugins can define `tokenAliases` to expand shorthand tokens (e.g. `lunar:phases` → `lunar:full,lunar:new,lunar:quarter`)
   - Fixtures in `feeds/*/fixtures/*.ics` — ICS data for offline dev fallback

4. **Styles package** (`packages/styles/`) — `@calendar-feeds/styles`, CSS custom properties (design tokens) and reset
   - `base.css` — color tokens, font weight scale, 4-step type scale (xl/lg/md/sm), minimal reset
   - Copied to `apps/calendar/public/base.css` at build time

5. **Calendar app** (`apps/calendar/`) — CF Worker rendering printable year + month calendars as server-side HTML
   - **Year view** (`/:year`) — 12-month grid with lunar/solar markers, clickable months
   - **Month view** (`/:year/:month`) — single month with day cells, events, mini prev/next calendars
   - **Config view** (`/config/:year[/:month]`, `render-config.ts`) — sidebar for size/orientation/layout/feeds + PNG/PDF export; custom feeds persist via `localStorage`
   - **Help** (`/help`, `render-help.ts`) — how-to guide: routes, feed tokens, and adding your own calendar (paste an ICS URL)
   - **Styleguide** (`/styleguide`) — live token reference with color swatches, type scale, font weights, component examples
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
- **URL routing** (calendar app): `/:year`, `/:year/:month`, `/:year/:size`, `/:year/:size/:orientation`, `/:year/:size/:orientation/300dpi.png`, `/config/:year[/:month]`, `/help`, `/styleguide`. Query params: `rows`, `header`, `test`, `include`, `borders`, `feed`.
- **Include param:** `?include=lunar:full,lunar:new,lunar:quarter,solar:season,movies,busd,astrology` — controls which feeds are shown. Defaults defined per-plugin via `defaultInclude` (lunar:full + lunar:new + lunar:quarter + solar:season on by default, others off). `movies` is shorthand for both `movies-theatrical` and `movies-digital`. `lunar:phases` is an alias for all lunar tokens.
- **Feed proxy:** `/feeds/{id}.ics?token=` — proxies ICS feeds through the calendar app via service bindings (e.g. `/feeds/movies-theatrical.ics`, `/feeds/astronomy.ics`, `/feeds/astrology.ics`, `/feeds/busd.ics`). Routes are derived from the feed plugin registry.
- **Feed param:** `?feed=https://example.com/cal.ics` — external ICS feed URL (fetched with 5s timeout).
- **No test framework** — validation is `pnpm typecheck` only.
- **Wrangler configs** are per-worker (`apps/calendar/wrangler.toml`, `feeds/*/wrangler.toml`). The root `wrangler.toml` is unused.

## Design Tokens (`packages/styles/base.css`)

All colors, font weights, and font sizes in `styles.css` use CSS custom properties defined in `base.css`. Never use hardcoded hex colors, numeric font-weights, or magic font-size values — always reference a token.

**Type scale** — 4 steps, applied directly on elements (no container-level font-size inheritance):
- `--font-size-xl` (3.6em) — view titles ("2026", "April")
- `--font-size-lg` (1.8em) — month headings ("January")
- `--font-size-md` (1.1em) — day numbers, mini calendar titles
- `--font-size-sm` (0.75em) — weekday labels, events, mini calendar text

**Font weights** — `--font-weight-thin` (100), `--font-weight-light` (200), `--font-weight-book` (300), `--font-weight-normal` (400), `--font-weight-medium` (500), `--font-weight-semibold` (600)

**Colors** — `--color-text`, `--color-bg`, `--color-accent`, `--color-border`, `--color-border-light`, `--color-muted`

When adding new styles, use existing tokens. If a new value is truly needed, add a token to `base.css` first — don't introduce one-off values. The `/styleguide` route shows all tokens visually.

## Semantic HTML Conventions

- Pages use `<main class="{x}-view">` (`.year-view`, `.month-view`)
- Components use bare nouns: `.month`, `.week`, `.day`, `.event`
- Modifiers use compound classes: `.month.mini`, `.day.today`, `.day.other-month`
- Semantic elements: `<header>` for `.view-header`/`.month-header`/`.day-header`, `<nav>` for `.view-nav`, `<section>` for grids, `<article>` for `.month`, `<ul>`/`<li>` for events
- Grid items (`.weekday`, `.day`) use `<div>` — they're layout containers, not semantic content
- See the `/styleguide` Structure table for the full mapping

## Visual Testing with Playwright

A Playwright MCP server is configured in `.mcp.json` for browser-based visual testing. When running in the cloud environment (claude.ai/code), Chromium is pre-installed but needs to be symlinked for the Playwright MCP server to find it. A `SessionStart` hook in `.claude/settings.local.json` handles this automatically.

If Playwright tools fail with "Chromium distribution 'chrome' is not found", run:
```bash
sudo mkdir -p /opt/google/chrome && sudo ln -sf /opt/pw-browsers/chromium-1194/chrome-linux/chrome /opt/google/chrome/chrome
```

When starting the dev server, note the port in the wrangler output (`Ready on http://localhost:XXXX`) — it may vary between sessions.

## Secrets (set via `npx wrangler secret put`)

- `CALENDAR_TOKEN` — required by all feed workers (astronomy, movies, astrology)
- `TMDB_API_KEY` — required by movies worker only
