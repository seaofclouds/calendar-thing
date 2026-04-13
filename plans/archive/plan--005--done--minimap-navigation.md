# Phase 5: Minimap Navigation

## Context

When browsing month views, there's no quick way to see all 12 months at a glance or jump to a specific month. Users must click prev/next arrows one at a time. Additionally, with the photo/spread feature (from `claude/image-upload-pdf-export-7WX6s`), users need a way to see which months still need photos added.

The minimap is a fixed vertical strip on the far right of the viewport showing 12 mini month thumbnails. Clicking a thumbnail navigates to that month. The current month is highlighted. Months without photos show a `+` icon overlay.

Read `CLAUDE.md` and `plans/plan--004-spreads.md` for full architecture context. The config sidebar is in `apps/calendar/src/render-config.ts`, month rendering in `render-month.ts`, client-side behavior in `client.ts`. Photo storage uses IndexedDB via `store-images.ts` (on the image-upload branch).

## Where it appears

- Month view (`/:year/:month`) and config month view (`/config/:year/:month`) -- yes
- Year view (`/:year`) and config year view (`/config/:year`) -- no (already shows all 12 months)
- Print/export mode -- hidden (not captured by `html-to-image`)
- Mobile (< 900px) -- hidden

## Approach: Server-rendered HTML with client-side photo indicators

Server-render all 12 mini month grids using the existing `renderMiniMonth()` and `generateWeeks()` helpers in `render-month.ts`. These produce the same `.month.mini` markup used for the prev/next navigation calendars in the month view header.

Photo indicators (`+` icon for missing photos) are applied client-side after checking IndexedDB via `listImages(year)` from `store-images.ts`. The server renders the structural HTML; the client decorates it with photo status.

Place the minimap **outside** `#root` (as a sibling element in `<body>`) so that `html-to-image` export of `#root` naturally excludes it. For the config view, place it inside `.config-content` but outside `#root`.

## Implementation

### Step 1: Export `renderMinimap()` from `render-month.ts`

Add a new exported function that generates all 12 month thumbnails for a year:

```typescript
export function renderMinimap(opts: {
  year: number;
  currentMonth: number;
  markers: CalendarEvent[];
  queryString?: string;
  urlPrefix?: string;
}): string
```

Each month is an `<a class="minimap-month" href="/:year/:month">` wrapping a `.month.mini` grid. The current month gets an `.active` class. All 12 are wrapped in a `<nav class="minimap">` with a toggle button.

Reuse existing private helpers:
- `generateWeeks()` at line 222 -- builds week grid data for any month
- `renderMiniMonth()` at line 147 -- renders `.month.mini` HTML
- `buildMarkerMap()` at line 286 -- groups markers by date

### Step 2: Include minimap in month view HTML

In `renderMonthView()` (line 128), add the minimap HTML after `renderMonthViewFragment()` output, as a sibling to `#root`:

```html
<body>
  <div id="root" class="...">
    <main class="month-view">...</main>
  </div>
  <nav class="minimap" aria-label="Month navigation">
    <button class="minimap-toggle" aria-label="Toggle minimap"></button>
    <div class="minimap-months">
      <!-- 12 mini month thumbnails -->
    </div>
  </nav>
</body>
```

For `renderMonthViewFragment()` (used by config view), return the minimap as a separate value or append it conditionally.

### Step 3: Include minimap in config month view

In `renderConfigView()` in `render-config.ts`, when rendering a month view (opts.month is set), include the minimap HTML inside `.config-content` but outside `#root`. This keeps it visible in config mode but excluded from image export.

### Step 4: Add minimap CSS

In `apps/calendar/public/styles.css`:

```css
/* Minimap -- fixed right strip */
.minimap {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 8em;
  overflow-y: auto;
  padding: 0.5em;
  background: var(--color-bg);
  border-left: 1px solid var(--color-border-light);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.minimap-month {
  display: block;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.minimap-month.active {
  outline: 2px solid var(--color-accent);
  border-radius: 2px;
}

/* Photo placeholder -- + icon overlay for months without photos */
.minimap-month.needs-photo::after {
  content: "+";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-light);
  color: var(--color-muted);
  pointer-events: none;
  opacity: 0.6;
}

.minimap-toggle {
  /* Small collapse/expand button */
}

/* Hide in print/export */
.print .minimap { display: none; }
@media print { .minimap { display: none; } }

/* Hide on mobile */
@media screen and (max-width: 900px) {
  .minimap { display: none; }
}

/* Collapsed state */
.minimap.collapsed { width: 1.5em; }
.minimap.collapsed .minimap-months { display: none; }

/* Adjust main content to avoid overlap */
body:has(.minimap:not(.collapsed)) .month-view {
  padding-right: 9em;
}
```

### Step 5: Client-side minimap behavior

In `apps/calendar/src/client.ts`, add `initMinimap()`:

```typescript
function initMinimap() {
  const minimap = document.querySelector('.minimap');
  if (!minimap) return;

  // Restore collapsed state from localStorage
  const collapsed = localStorage.getItem('minimap-collapsed') === 'true';
  if (collapsed) minimap.classList.add('collapsed');

  // Toggle button
  const toggle = minimap.querySelector('.minimap-toggle');
  toggle?.addEventListener('click', () => {
    minimap.classList.toggle('collapsed');
    localStorage.setItem('minimap-collapsed',
      String(minimap.classList.contains('collapsed')));
  });

  // Photo indicators (requires store-images.ts from image-upload branch)
  updatePhotoIndicators();
}

async function updatePhotoIndicators() {
  const minimap = document.querySelector('.minimap');
  if (!minimap) return;

  const year = /* extract from URL */;
  const photos = await listImages(year);
  const photoSlots = new Set(photos.map(p => p.slot));

  minimap.querySelectorAll('.minimap-month').forEach((el, i) => {
    const month = String(i + 1);
    if (!photoSlots.has(month)) {
      el.classList.add('needs-photo');
    }
  });
}
```

Call `initMinimap()` at module level alongside `initConfigSidebar()`.

## Files to modify

| File | Change |
|------|--------|
| `apps/calendar/src/render-month.ts` | Export `renderMinimap()` function using existing `generateWeeks()`, `renderMiniMonth()`, `buildMarkerMap()` |
| `apps/calendar/src/render-month.ts` | Include minimap HTML in `renderMonthView()` after `#root` |
| `apps/calendar/src/render-config.ts` | Include minimap in config month view inside `.config-content` |
| `apps/calendar/src/client.ts` | Add `initMinimap()` with toggle, localStorage, photo indicator integration |
| `apps/calendar/public/styles.css` | `.minimap` positioning, `.active`, `.needs-photo`, responsive/print hiding, collapsed state |

## Dependencies

- Depends on `store-images.ts` from `claude/image-upload-pdf-export-7WX6s` branch for photo indicator functionality. If building before that branch merges, the photo indicator code can be stubbed or feature-gated.
- No server-side infrastructure changes needed.

## Verification

1. Visit `/:year/:month` -- minimap visible on right with 12 mini months, current month highlighted
2. Click a different month in minimap -- navigates to that month's view
3. Click toggle -- minimap collapses; refresh -- collapsed state persists
4. Visit `/:year` (year view) -- no minimap visible
5. Export image from config view -- minimap not included in PNG
6. Print -- minimap not included
7. Mobile (< 900px) -- minimap hidden
8. Photo indicators: months without photos in IndexedDB show `+` overlay
9. `pnpm typecheck` passes
10. Test with `pnpm dev:calendar`
