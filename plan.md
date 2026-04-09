# Calendar App Improvements Plan

## Context

The monorepo integration is complete and deployed. The calendar app renders at `calendar-thing.pages.dev` but has rendering bugs and is missing features. This plan addresses 4 areas: 2 bugs and 2 new features.

**Repo:** `seaofclouds/calendar-thing` (monorepo, deployed on CF Pages)
**Key files:** all in `apps/calendar/src/`

---

## Phase A: Bug Fixes

### A1. Fix left edge cutoff at `/:year`

**Problem:** `/2026` defaults `size` to `"letter"` and `forExport` logic applies the `print` class with fixed-width CSS. On narrow viewports, the left edge runs off screen.

**Root cause** (`render.ts:44`):
```typescript
const isPreview = opts.forExport || opts.size !== "letter" || opts.testing;
```
This always applies print mode. When no size is explicitly provided, the calendar should render in responsive screen mode (no `print` class, no `size-*` class).

**Fix:**
- `index.ts`: Track whether size was explicitly provided via URL. Add `sizeExplicit: boolean` to `CalendarParams`. When second segment is a known page size, `sizeExplicit = true`. When defaulting to `"letter"`, `sizeExplicit = false`.
- `index.ts`: Change `forExport` to: `params.format != null || params.sizeExplicit || params.testing`
- `render.ts`: Only apply `size-*` class and `print` class when `forExport` is true
- Result: `/2026` renders responsive (1-4 columns by viewport width). `/2026/letter` renders fixed print layout.

**Files:** `apps/calendar/src/index.ts`, `apps/calendar/src/render.ts`

### A2. Fix image export (300dpi.png not downloading)

**Problem:** Appending `300dpi.png` to URL shows blank page, no download.

**Root cause** (`index.ts:37-39`):
```typescript
if (path.match(/\.(css|js|ico|png|jpg|svg|woff2?)$/)) {
  return env.ASSETS.fetch(request);
}
```
This regex matches ALL `.png`/`.jpg` URLs, including `/2026/300dpi.png`, routing them to static assets (404) instead of the calendar Worker. The `_routes.json` already handles actual static files (`/styles.css`, `/client.js`).

**Fix:**
- `index.ts`: Remove the broad static asset regex. `_routes.json` already excludes the two static files. The Worker only needs the favicon handler.
- Verify URL parsing handles format in all positions (it already does via `parseFormatSegment`).
- Verify client.ts `html-to-image` export works once the Worker actually renders the page.

**Files:** `apps/calendar/src/index.ts`

---

## Phase B: Month View

**Goal:** Add single-month views at `/:year/:month` (e.g., `/2026/01`) with a different layout than the compact year-view grid.

### Routing

**Route disambiguation:** `/:year/:month` vs `/:year/:size`
- If second segment is a 1-2 digit number 1-12, it's a month -> month view
- If second segment is a known size name (letter, a4, etc.), it's a size -> year view
- Extended: `/:year/:month/:size/:orientation` -> month view at specific paper size

**In `parseCalendarURL()`:** Check second segment before assuming it's a size:
```typescript
const monthNum = parseInt(secondSegment);
if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
  // Month view
  return { ...params, month: monthNum, viewMode: "month" };
}
```

Add `month?: number` and `viewMode: "year" | "month"` to `CalendarParams`.

### Month view rendering (from mockups)

**Layout (bordered table-style):**
```
+---------------------------------------------+
| << DECEMBER 2024    January    FEBRUARY 2025 >>|
+-------+-------+-------+-------+-------+-------+-------+
|Sunday |Monday |Tuesday|Wednes.|Thursd.|Friday |Saturd.|
+-------+-------+-------+-------+-------+-------+-------+
|  29   |  30   |  31   |  1    |  2    |  3    |  4    |
|       |       |       |NY Day |NoSchool|WBreak|       |
+-------+-------+-------+-------+-------+-------+-------+
|  5    |  6    |  7    |  8    |  9    |  10   |  11   |
|       |NoSchol|       |       |       |       |       |
+-------+-------+-------+-------+-------+-------+-------+
```

**Key differences from year view:**
- Full day names (Sunday-Saturday) instead of single letters (S M T W T F S)
- Bordered cells with visible grid lines
- ALL moon phases shown (not just full moons) -- various circle fill indicators
- Events displayed as text within each cell (movie titles, holidays)
- Previous/next month mini calendars in header corners
- Larger cells to accommodate event text

**New file:** `apps/calendar/src/render-month.ts`
- `renderMonthView(opts)` generates the month view HTML
- Mini calendar renderer for prev/next month in header
- Event list renderer for each cell
- Moon phase indicator (all 4 phases + intermediates)

**Data for month view:**
- Moon phases: Fetch ALL phases from moon-phase feed (not just full moons). The `/moon.json` endpoint returns `phases[]` with all 4 quarter types.
- Movie releases: Fetch from `env.MOVIE_RELEASE.fetch('/theatrical.json')` -- show movie titles on release dates
- Holidays: Future feed (not implemented yet, but leave hook for it)

**Update `fetchMoonData()` in `index.ts`:**
- For month view, return ALL phases (new_moon, first_quarter, full_moon, last_quarter), not just full moons
- Add movie release data fetch for month view

**CSS for month view:** Add new styles in `styles.css`:
- `.month-view` -- bordered table layout
- `.month-view .day-cell` -- bordered cells with min-height
- `.month-view .day-events` -- event text list within cells
- `.month-view .mini-calendar` -- small prev/next month calendars
- `.month-view .phase-indicator` -- moon phase circles (varying fill)

**Files:** `apps/calendar/src/index.ts`, `apps/calendar/src/render-month.ts` (new), `apps/calendar/public/styles.css`

---

## Phase C: Config UI

**Goal:** Add a `/config` route with a sidebar for customizing and previewing calendars.

### Route

- `/config` -> redirect to `/config/:currentYear/01`
- `/config/:year/:month` -> config UI showing month view
- `/config/:year` -> config UI showing year view

### Layout (from mockups)

```
+----------+------------------------------------+
| SIDEBAR  |  CALENDAR PREVIEW                   |
|          |                                      |
| 2025     |  +----------------------------+     |
| [Jan]    |  |                            |     |
|  Feb     |  |  Calendar renders here     |     |
|  Mar     |  |  (same as standalone view) |     |
|  ...     |  |                            |     |
|          |  +----------------------------+     |
| Format   |                                      |
| [Letter] |  "US Letter, Portrait, 8.5in x 11in" |
|  Legal   |                                      |
|  Tabloid |                                      |
|  A5      |                                      |
|  A4      |                                      |
|          |                                      |
| Orient.  |                                      |
| Portrait |                                      |
|[Landscp] |                                      |
|          |                                      |
| Sources  |                                      |
| * Moon   |                                      |
| o Civil  |                                      |
| o Bdays  |                                      |
|          |                                      |
| [Save]   |                                      |
| Save All |                                      |
+----------+------------------------------------+
```

**Background:** Warm beige/cream (#f5f0e8 or similar from mockups)

### Implementation

**Server-side (`index.ts`):**
- New route handler for `/config/*` paths
- Renders the config page HTML with sidebar + calendar content inline
- Calendar content is the same `renderMonthView()` or `renderCalendar()` output

**New file:** `apps/calendar/src/render-config.ts`
- `renderConfigPage(opts)` wraps calendar output in config layout
- Sidebar HTML with controls
- Format info header

**Client-side (`client.ts`):**
- Sidebar click handlers:
  - Month buttons: navigate to `/config/:year/:month`
  - Format buttons: update URL param, re-fetch calendar content
  - Orientation toggle: update URL param, re-fetch
  - Source toggles: update URL param, re-fetch
- Save button: trigger image export of the calendar preview area
- Save All: export all months sequentially
- Use `fetch()` to reload just the calendar area (or full page navigation for simplicity)

**CSS additions:**
- `.config-page` -- flex row layout, beige background
- `.config-sidebar` -- fixed width ~120px, control styling
- `.config-preview` -- flex-grow, centers the calendar on white paper surface
- Button styles: rounded, active state (yellow highlight)

**Files:** `apps/calendar/src/index.ts`, `apps/calendar/src/render-config.ts` (new), `apps/calendar/src/client.ts`, `apps/calendar/public/styles.css`

---

## Pre-requisite: Service Binding Auth (DONE)

Feed workers require `?token=CALENDAR_TOKEN` for external requests. Service binding calls from the calendar app use synthetic URLs (`https://internal/...`) with no token — these were returning 401 and silently falling back to hardcoded test data.

**Fix applied:** `authenticateToken()` in `worker-utils` now detects `hostname === "internal"` and bypasses auth. Merged in PR #3.

**Known limitation:** Moon-phase worker computes data for `currentYear` through `currentYear+1` only. Years outside this range get empty data even with a working service binding. The calendar app's static fallback data covers 2025-2027.

**Verification:** Check `<body data-source="service-binding|static-fallback">` in DevTools on `/2026/` or `/2027/`. The `deploy-moon-phase` GitHub Action must have run for the fix to take effect on the feed worker side.

## Implementation Order

| Step | What | Status |
|------|------|--------|
| Pre | Service binding auth bypass | DONE (PR #3) |
| A1 | Fix responsive default route | pending |
| A2 | Fix image export (remove ASSETS regex) | pending |
| B1 | Add month view routing | pending (depends on A1) |
| B2 | Month view rendering (render-month.ts) | pending |
| B3 | Month view CSS | pending |
| B4 | All moon phases + movie data for month view | pending |
| C1 | Config route + layout (render-config.ts) | pending |
| C2 | Config sidebar HTML + CSS | pending |
| C3 | Config client-side JS (navigation, save) | pending |

A1 and A2 are independent -- can be done in parallel.
B depends on A1 (routing changes).
C depends on B (month view needed for config preview).

---

## Key Files

| File | Changes |
|------|---------|
| `apps/calendar/src/index.ts` | Route fixes, month view routing, config routing, remove ASSETS regex |
| `apps/calendar/src/render.ts` | Fix isPreview/forExport logic, add sizeExplicit support |
| `apps/calendar/src/render-month.ts` | **New** -- month view HTML rendering |
| `apps/calendar/src/render-config.ts` | **New** -- config page layout with sidebar |
| `apps/calendar/src/client.ts` | Config sidebar interactions, save/export |
| `apps/calendar/public/styles.css` | Month view styles, config page styles |
| `apps/calendar/src/config.ts` | No changes needed (page sizes already defined) |

---

## Verification

- `/2026` -- renders responsive (no left cutoff), columns adapt to viewport
- `/2026/letter` -- renders fixed print layout (letter size)
- `/2026/letter/portrait/300dpi.png` -- downloads PNG image
- `/2026/01` -- renders January month view with bordered cells, all moon phases
- `/2026/01/letter/landscape` -- month view at letter landscape size
- `/config/2026/01` -- shows config UI with sidebar + month preview
- Sidebar controls update the preview in real time
- Save button exports current view as image
