# Plan 008: CSS Modularization

## Context

`apps/calendar/public/styles.css` is 1,384 lines — the second-largest file in the project. It has 16 well-commented sections covering layout, year view, month view, config sidebar, print styles, spreads, and responsive breakpoints. While the internal organization is good, working on any one area requires scrolling through the entire file. As features like config sidebar, spreads, and month view continue to grow, this will become increasingly unwieldy.

## Goal

Split `styles.css` into focused CSS modules without changing any visual behavior. The result should be easier to navigate, review, and extend — especially when working on a single area (e.g., print styles or config sidebar) without touching the rest.

## Current Section Map

| Lines | Section | Proposed Module |
|-------|---------|----------------|
| 1-17 | Layout Containers | `layout.css` |
| 19-100 | Year View — Main Structure | `year-view.css` |
| 102-148 | Month Components | `year-view.css` (same context) |
| 150-192 | Day Components & Markers | `year-view.css` |
| 194-274 | Print Styles | `print.css` |
| 276-483 | Size-specific Styles | `print.css` (print-only page sizes) |
| 485-516 | Responsive Styles | `layout.css` |
| 518-530 | Today Highlight | `layout.css` |
| 532-909 | Month View (grid, borders, markers, events, print, responsive) | `month-view.css` |
| 911-1091 | Config View | `config.css` |
| 1093-1170 | Scrollable Config Preview | `config.css` |
| 1172-1299 | Spread Layout | `spreads.css` |
| 1301-1326 | Thinner borders for small sizes | `print.css` |
| 1328-1360 | Print media — hide config UI | `print.css` |
| 1362-1374 | Mini calendar width for small sizes | `print.css` |
| 1376-1384 | Testing Styles | `layout.css` |

## Proposed File Structure

```
apps/calendar/public/
  base.css          (unchanged — design tokens)
  styles.css        (becomes an index that @imports the modules below)
  css/
    layout.css      (~80 lines — body, #root, responsive, today, testing)
    year-view.css   (~190 lines — year structure, months, days, markers)
    month-view.css  (~380 lines — month grid, borders, events, print, responsive)
    print.css       (~290 lines — page sizes, orientations, print-only rules)
    config.css      (~260 lines — config sidebar, scrollable preview)
    spreads.css     (~130 lines — spread/facing page layout)
```

## Approach

### Option A: CSS `@import` (simplest)
Replace `styles.css` contents with:
```css
@import url("css/layout.css");
@import url("css/year-view.css");
@import url("css/month-view.css");
@import url("css/print.css");
@import url("css/config.css");
@import url("css/spreads.css");
```
**Pros:** Zero build tooling needed; Cloudflare Workers serves static assets from `public/`.
**Cons:** Multiple HTTP requests in dev (minor, since these are local); `@import` is technically slower than a single file. In production this should be fine since Cloudflare edge-caches static assets.

### Option B: Build-time concatenation
Add a build step that concatenates the CSS modules into a single `styles.css`.
**Pros:** Single HTTP request in production.
**Cons:** Adds build complexity; need to update the existing `build` script.

### Recommendation
Start with **Option A** (`@import`). It's simpler, reversible, and the performance difference is negligible for a tool that generates printable calendars (not a high-traffic SPA). If performance becomes a concern later, switching to build-time concatenation is straightforward.

## Steps

1. Create `apps/calendar/public/css/` directory
2. Extract each section into its module file, preserving exact CSS (no changes to selectors, properties, or order)
3. Replace `styles.css` with `@import` statements in the correct order (order matters for cascade)
4. Verify `@import` order matches original section order (layout → year → month → print → config → spreads)
5. Visual test: run dev server and compare year view, month view, config view, and print preview against current behavior
6. Run `pnpm typecheck` (CSS changes shouldn't affect TS, but good hygiene)

## Risks

- **Cascade order:** CSS `@import` order must match the original section order. Getting this wrong could break specificity-dependent rules (e.g., print overrides).
- **`@media print` rules are scattered:** Print-related rules exist in month-view and config sections, not just the print section. Need to decide whether to consolidate or keep them co-located with their component.
- **Wrangler asset serving:** Verify that Cloudflare Workers serves files from `public/css/` subdirectory (should work with `[assets] directory = "./public"`).

## Verification

1. Start dev server with `pnpm dev:calendar`
2. Compare year view at `/:year` — layout, month grid, markers, responsive columns
3. Compare month view at `/:year/:month` — grid borders, events, mini calendars
4. Compare config view at `/config/:year` — sidebar, preview, spreads
5. Test print preview in browser — page sizes, orientations, margins
6. Test spread layout with image — photo + calendar facing pages
