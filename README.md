# Calendar Feeds

A monorepo of Cloudflare Workers that generate calendar feeds (ICS/JSON) and render printable calendars with astronomical event overlays.

## Architecture

```
calendar-thing/                   # Monorepo root
├── packages/
│   ├── ics-utils/              # Shared ICS generation (RFC 5545)
│   ├── worker-utils/           # Shared CF Worker patterns (auth, cache, response)
│   └── feed-types/             # Shared TypeScript types & feed plugin interface
├── feeds/
│   ├── astrology/              # CF Worker — zodiac seasons (tropical astrology)
│   ├── astronomy/              # CF Worker — lunar phases + solar events (Jean Meeus)
│   └── movies/          # CF Worker — theatrical + digital releases (TMDB API)
├── apps/
│   └── calendar/               # CF Worker — printable calendar renderer + static assets
├── .github/workflows/deploy.yml
└── pnpm-workspace.yaml
```

### Feed Workers

Each feed is an independent Cloudflare Worker serving ICS and JSON endpoints:

- **astrology** — Zodiac season events (tropical/Western astrology). Pure computation, no external APIs. Per-sign Streamline icons.
- **astronomy** — Computes lunar phases (new, first quarter, full, last quarter) and solar events (equinoxes, solstices) using Jean Meeus' Astronomical Algorithms. No external APIs. Future: eclipses.
- **movies** — Fetches theatrical and digital movie releases from the TMDB API with regional date filtering.

Both feeds use token-based authentication and 24-hour edge caching.

### Calendar App

A Cloudflare Worker that renders printable year and month calendars as server-side HTML. Discovers feeds via a plugin system — each feed has a co-located `feed.plugin.ts` manifest defining its name, icons, include tokens, token aliases, and render mode. The calendar app imports these manifests through a loader (`feed-loader.ts`), fetches events via three-tier fallback (service binding → prod URL → fixture ICS), and splits them by `renderMode` for rendering. Includes client-side JS for responsive layout and image export (html-to-image).

### Shared Packages

- **ics-utils** — `escapeICS()`, `formatICSTimestamp()`, `wrapVCalendar()`, `buildVEvent()`
- **worker-utils** — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers
- **feed-types** — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent`, `FeedPlugin`, `FeedRenderMode` TypeScript interfaces

## Usage

### Calendar URLs

```
/:year                              # Responsive calendar (e.g. /2026)
/:year/:orientation                 # portrait or landscape
/:year/:size                        # Print preview (letter, a4, a6, etc.)
/:year/:size/:orientation           # Print preview with orientation
/:year/:size/:orientation/300dpi.png  # Export as image
```

Query params: `rows=N`, `header=false`, `test=true`, `include=lunar:full,lunar:new,lunar:quarter,solar:season,movies,movies-theatrical,movies-digital,busd,astrology`

### Default Layouts

| Size    | Portrait | Landscape |
|---------|----------|-----------|
| A6      | 4 × 3   | 3 × 4    |
| A5      | 4 × 3   | 3 × 4    |
| A4      | 4 × 3   | 3 × 4    |
| Letter  | 4 × 3   | 3 × 4    |
| Legal   | 5 × 3   | 3 × 5    |
| Tabloid | 5 × 3   | 3 × 5    |

### Feed Endpoints

All feed workers use `/feeds/{name}.ics` and `/feeds/{name}.json` endpoints. All require `?token=<CALENDAR_TOKEN>`.

| Worker | ICS | JSON |
|--------|-----|------|
| astronomy | `/feeds/astronomy.ics` | `/feeds/astronomy.json` |
| movies | `/feeds/movies-theatrical.ics` | `/feeds/movies-theatrical.json` |
| movies | `/feeds/movies-digital.ics` | `/feeds/movies-digital.json` |
| astrology | `/feeds/astrology.ics` | `/feeds/astrology.json` |

Astronomy and astrology endpoints support `?year=N` for a specific year.

### Feed Proxy

The calendar app proxies feed ICS through the main domain, so feeds can be subscribed to via:

```
https://calendar.seaofclouds.com/feeds/movies-theatrical.ics?token=TOKEN
https://calendar.seaofclouds.com/feeds/astronomy.ics?token=TOKEN
https://calendar.seaofclouds.com/feeds/astrology.ics?token=TOKEN
```

Routes are derived automatically from the feed plugin registry.

### Astronomical Features

- **Full moons** — Open circle markers (SVG, white fill with black stroke)
- **New moons** — Filled circle markers (SVG, black fill with black stroke)
- **First quarter** — Half-filled circle, left half black (SVG)
- **Last quarter** — Half-filled circle, right half black (SVG)
- **Solstices** — Diamond markers (June, December)
- **Equinoxes** — Diamond markers (March, September)

Control which symbols appear with `?include=lunar:full,lunar:new,lunar:quarter,solar:season`. Use `lunar:phases` as a shorthand for all lunar tokens. Default (no param): all lunar phases + solar events.

Computed using Jean Meeus' Astronomical Algorithms (Chapters 27 & 49).

## Development

```bash
# Install dependencies
pnpm install

# Run calendar app locally
pnpm dev:calendar

# Run astronomy feed locally
pnpm dev:astronomy

# Run movies feed locally
pnpm dev:movie

# Run astrology feed locally
pnpm dev:astrology

# Type-check all packages
pnpm typecheck
```

## Deployment

All workers (calendar app + feeds) deploy via GitHub Actions on push to `main`. Change detection (`dorny/paths-filter`) ensures only affected workers redeploy. You can also trigger all deploys manually from the Actions tab via "Run workflow".

| GitHub setting | Type | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Repository secret | CF API token with Workers Scripts:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Repository variable | Your CF account ID |

Manual deploy from monorepo root:
```bash
pnpm --filter @calendar-feeds/astronomy run deploy
pnpm --filter @calendar-feeds/movies run deploy
pnpm --filter @calendar-feeds/astrology run deploy
pnpm --filter @calendar-feeds/calendar run deploy
```

Feed worker secrets:
```bash
cd feeds/astronomy && npx wrangler secret put CALENDAR_TOKEN
cd feeds/movies && npx wrangler secret put CALENDAR_TOKEN
cd feeds/movies && npx wrangler secret put TMDB_API_KEY
cd feeds/astrology && npx wrangler secret put CALENDAR_TOKEN
```

### Service Bindings

The calendar app connects to feed workers via Cloudflare service bindings (declared in `apps/calendar/wrangler.toml`, applied automatically by `wrangler deploy`):

| Binding | Service |
|---------|---------|
| `ASTRONOMY` | `calendar-astronomy` |
| `MOVIE_RELEASE` | `calendar-movies` |
| `ASTROLOGY` | `calendar-astrology` |

**Auth bypass for internal calls:** Feed workers require `?token=CALENDAR_TOKEN` for external requests, but service binding calls use synthetic URLs (e.g. `https://internal/feeds/astronomy.json?year=2026`) with no token. The `authenticateToken()` helper in `worker-utils` detects `hostname === "internal"` and bypasses auth for these trusted internal requests. When adding a new feed worker, use the same `"internal"` hostname convention in service binding fetch calls and rely on `authenticateToken()` to handle it — no token plumbing needed.

**Verifying data source:** The calendar app renders a `data-source` attribute on `<body>` showing `"service-binding"` or `"static-fallback:reason"` (e.g. `no-binding`, `status-401`, `error-...`). Check in DevTools to confirm the pipeline is active.

## Adding a New Feed

1. Create `feeds/my-feed/` with a CF Worker serving ICS + JSON at `/feeds/{name}.ics` and `/feeds/{name}.json`
2. Use `@calendar-feeds/ics-utils` and `@calendar-feeds/worker-utils`
3. Create `feeds/my-feed/feed.plugin.ts` exporting a `FeedPlugin` manifest:
   - `id` — slug for `?include=` param and feed proxy route (`/feeds/{id}.ics`)
   - `renderMode` — `"event-list"` (text in day cells) or `"day-marker"` (icon replaces date number)
   - `icon` / `signIcons` — inline SVG icons
   - `includeTokens` / `defaultInclude` — sub-toggles and defaults
   - `tokenAliases` — shorthand aliases that expand to multiple tokens (e.g. `lunar:phases` → `[lunar:full, lunar:new, lunar:quarter]`)
   - `fixture` — imported ICS text for offline dev fallback
   - A single worker can export multiple plugins (e.g. movies exports `theatrical` and `digital`)
4. Register the plugin in `apps/calendar/src/feed-loader.ts`
5. Add a service binding in `apps/calendar/wrangler.toml`
6. Add a deploy job to `.github/workflows/deploy.yml`
7. The feed proxy route (`/feeds/{id}.ics`) is created automatically from the plugin registry
