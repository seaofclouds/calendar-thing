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
│   ├── moon-phase/             # CF Worker — moon phases + solar events (Jean Meeus)
│   └── movie-release/          # CF Worker — theatrical + digital releases (TMDB API)
├── apps/
│   └── calendar/               # CF Pages — printable calendar renderer
├── .github/workflows/deploy.yml
├── pnpm-workspace.yaml
└── wrangler.toml               # CF Pages build config
```

### Feed Workers

Each feed is an independent Cloudflare Worker serving ICS and JSON endpoints:

- **moon-phase** — Computes moon phases (new, first quarter, full, last quarter) and solar events (equinoxes, solstices) using Jean Meeus' Astronomical Algorithms. No external APIs.
- **movie-release** — Fetches theatrical and digital movie releases from the TMDB API with regional date filtering.

Both feeds use token-based authentication and 24-hour edge caching.

### Calendar App

A Cloudflare Pages app that renders printable year calendars as server-side HTML. Fetches astronomical data from the moon-phase feed via service bindings. Includes client-side JS for responsive layout and image export (html-to-image).

### Shared Packages

- **ics-utils** — `escapeICS()`, `formatICSTimestamp()`, `wrapVCalendar()`, `buildVEvent()`
- **worker-utils** — `authenticateToken()`, `buildCacheKey()`, `withEdgeCache()`, response helpers
- **feed-types** — `CalendarFeed`, `FeedEndpoint`, `CalendarEvent` TypeScript interfaces

## Usage

### Calendar URLs

```
/:year                              # View calendar (e.g. /2026)
/:year/:size                        # With page size (letter, a4, a6, etc.)
/:year/:size/:orientation           # portrait or landscape
/:year/:size/:orientation/300dpi.png  # Export as image
```

Query params: `rows=N`, `header=false`, `test=true`

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
- `/moon.ics` — ICS calendar feed
- `/moon.json` — JSON data

Movie release worker:
- `/theatrical.ics` — Theatrical releases
- `/digital.ics` — Digital releases
- `/theatrical.json`, `/digital.json` — JSON data

All feed endpoints require `?token=<CALENDAR_TOKEN>`.

### Astronomical Features

- **Full moons** — Filled circle markers on the calendar
- **Solstices** — Diamond markers (June, December)
- **Equinoxes** — Diamond markers (March, September)

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

# Type-check all packages
pnpm typecheck
```

## Deployment

The calendar app deploys automatically via Cloudflare Pages on push to `main`.

Feed workers deploy via GitHub Actions (`.github/workflows/deploy.yml`) when their files change. Requires:

| GitHub setting | Type | Value |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Repository secret | CF API token with Workers Scripts:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Repository variable | Your CF account ID |

Manual deploy:
```bash
# Deploy a feed worker
cd feeds/moon-phase && npx wrangler deploy

# Set secrets
npx wrangler secret put CALENDAR_TOKEN
```

### Service Bindings

The calendar app connects to feed workers via Cloudflare service bindings (configured in CF Pages dashboard):

| Binding | Service |
|---------|---------|
| `MOON_PHASE` | `moon-phase-calendar` |
| `MOVIE_RELEASE` | `movie-release-calendar` |

## Adding a New Feed

1. Create `feeds/my-feed/` with a CF Worker serving ICS + JSON
2. Use `@calendar-feeds/ics-utils` and `@calendar-feeds/worker-utils`
3. Add a deploy job to `.github/workflows/deploy.yml`
4. Add a service binding in the calendar app to consume it
