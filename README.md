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
│   ├── moon-phase/             # CF Worker — moon phases + solar events (Jean Meeus)
│   └── movie-release/          # CF Worker — theatrical + digital releases (TMDB API)
├── apps/
│   └── calendar/               # CF Worker — printable calendar renderer + static assets
├── .github/workflows/deploy.yml
└── pnpm-workspace.yaml
```

### Feed Workers

Each feed is an independent Cloudflare Worker serving ICS and JSON endpoints:

- **astrology** — Zodiac season events (tropical/Western astrology). Pure computation, no external APIs. Per-sign Streamline icons.
- **moon-phase** — Computes moon phases (new, first quarter, full, last quarter) and solar events (equinoxes, solstices) using Jean Meeus' Astronomical Algorithms. No external APIs.
- **movie-release** — Fetches theatrical and digital movie releases from the TMDB API with regional date filtering.

Both feeds use token-based authentication and 24-hour edge caching.

### Calendar App

A Cloudflare Worker that renders printable year calendars as server-side HTML with static assets (CSS, client JS). Fetches astronomical data from the moon-phase feed via service bindings. Includes client-side JS for responsive layout and image export (html-to-image).

### Shared Packages

- **ics-utils** — `escapeICS()`, `formatICSTimestamp()`, `wrapVCalendar()`, `buildVEvent()`
- **worker-utils** — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers
- **feed-types** — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent` TypeScript interfaces

## Usage

### Calendar URLs

```
/:year                              # Responsive calendar (e.g. /2026)
/:year/:orientation                 # portrait or landscape
/:year/:size                        # Print preview (letter, a4, a6, etc.)
/:year/:size/:orientation           # Print preview with orientation
/:year/:size/:orientation/300dpi.png  # Export as image
```

Query params: `rows=N`, `header=false`, `test=true`, `include=moon:full,moon:new,solar:season,movies,busd,astrology`

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

Moon phase worker:
- `/feeds/moon.ics` — ICS calendar feed
- `/feeds/moon.json` — JSON data (supports `?year=N` for specific year)

Movie release worker:
- `/theatrical.ics` — Theatrical releases
- `/digital.ics` — Digital releases
- `/theatrical.json`, `/digital.json` — JSON data

Astrology worker:
- `/feeds/astrology.ics` — Zodiac season events
- `/feeds/astrology.json` — JSON data (supports `?year=N`)

All feed endpoints require `?token=<CALENDAR_TOKEN>`.

### Astronomical Features

- **Full moons** — Open circle markers (SVG, white fill with black stroke)
- **New moons** — Filled circle markers (SVG, black fill with black stroke)
- **Solstices** — Diamond markers (June, December)
- **Equinoxes** — Diamond markers (March, September)

Control which symbols appear with `?include=moon:full,moon:new,solar:season`. Default (no param): full moons + solar events.

Computed using Jean Meeus' Astronomical Algorithms (Chapters 27 & 49).

## Development

```bash
# Install dependencies
pnpm install

# Run calendar app locally
pnpm dev:calendar

# Run moon-phase feed locally
pnpm dev:moon

# Run movie-release feed locally
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
pnpm --filter @calendar-feeds/moon-phase run deploy
pnpm --filter @calendar-feeds/movie-release run deploy
pnpm --filter @calendar-feeds/astrology run deploy
pnpm --filter @calendar-feeds/calendar run deploy
```

Feed worker secrets:
```bash
cd feeds/moon-phase && npx wrangler secret put CALENDAR_TOKEN
cd feeds/movie-release && npx wrangler secret put CALENDAR_TOKEN
cd feeds/movie-release && npx wrangler secret put TMDB_API_KEY
cd feeds/astrology && npx wrangler secret put CALENDAR_TOKEN
```

### Service Bindings

The calendar app connects to feed workers via Cloudflare service bindings (declared in `apps/calendar/wrangler.toml`, applied automatically by `wrangler deploy`):

| Binding | Service |
|---------|---------|
| `MOON_PHASE` | `moon-phase-calendar` |
| `MOVIE_RELEASE` | `movie-release-calendar` |
| `ASTROLOGY` | `astrology-calendar` |

**Auth bypass for internal calls:** Feed workers require `?token=CALENDAR_TOKEN` for external requests, but service binding calls use synthetic URLs (e.g. `https://internal/feeds/moon.json?year=2026`) with no token. The `authenticateToken()` helper in `worker-utils` detects `hostname === "internal"` and bypasses auth for these trusted internal requests. When adding a new feed worker, use the same `"internal"` hostname convention in service binding fetch calls and rely on `authenticateToken()` to handle it — no token plumbing needed.

**Verifying data source:** The calendar app renders a `data-source` attribute on `<body>` showing `"service-binding"` or `"static-fallback:reason"` (e.g. `no-binding`, `status-401`, `error-...`). Check in DevTools to confirm the pipeline is active.

## Adding a New Feed

1. Create `feeds/my-feed/` with a CF Worker serving ICS + JSON
2. Use `@calendar-feeds/ics-utils` and `@calendar-feeds/worker-utils`
3. Add a deploy job to `.github/workflows/deploy.yml`
4. Add a service binding in the calendar app to consume it
