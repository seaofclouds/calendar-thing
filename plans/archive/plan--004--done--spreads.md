# Phase 4: Spread Views, Photo Pages, and PDF Export

## Context

With the config sidebar established in Phase 2, this phase adds three connected features: split/spread page layouts for binding, per-month photo pages, and PDF assembly for print-ready output. The goal is to produce spiral-bound or saddle-stitched calendars with photo covers.

Read `CLAUDE.md` and `plans/plan--002-config.md` for full architecture context. The config sidebar is in `apps/calendar/src/render-config.ts`, fragments in `render.ts` and `render-month.ts`, routing in `index.ts`, client-side export in `client.ts`.

## Feature 1: Split View (A6 facing pages)

A month view that splits the 7-day week across two A6 portrait pages meant to sit side by side:

- **Left page (A6 portrait):** S M T W — 4 equal columns
- **Right page (A6 portrait):** T F S + Notes — 4 equal columns (8th column is blank for marginalia)
- Both pages share the same 6-row week grid, same month header, same events
- The split point is between Wednesday and Thursday
- Each page rendered as a separate `#root` element with A6 portrait dimensions
- Gutter margin on the inside edges (left page right margin, right page left margin) for spiral binding
- Add "Split" as a layout option in the config sidebar, available for A6 format

Route: `/config/:year/:month?size=a6&layout=split`

### Files

- Create `apps/calendar/src/render-split.ts` — new `renderSplitMonthFragment` generating two side-by-side A6 page divs

## Feature 2: Spread View (photo + calendar)

A two-sheet spread where the top sheet is a full-bleed photo and the bottom sheet is the month calendar. Think wall calendar or spiral-bound desk calendar:

- **Top sheet:** Full page photo (user-selected image per month)
- **Bottom sheet:** Month calendar view at the selected paper size
- Available for Letter, Legal, Tabloid — any size where a photo spread makes sense
- Extra inside margin for spiral binding (add a `binding` margin option, e.g., 0.5in on the edge where sheets meet)
- The spread is two separate pages (top and bottom), not one tall page

### Photo selection

- Add a "Photos" section to the config sidebar
- Allow image upload per month (stored client-side, e.g., in IndexedDB or as data URLs in memory)
- Show a thumbnail preview in the sidebar for each month that has a photo
- The photo page renders as a simple full-bleed `<img>` inside a page-sized container with no padding
- Photos should be cropped/scaled to fill the page (CSS `object-fit: cover`)
- When no photo is selected for a month, the photo page is blank or shows a placeholder

Route: `/config/:year/:month?size=letter&layout=spread`

## Feature 3: PDF Export

Bundle all exported pages into a single PDF for print-ready output:

- Use **jsPDF** (lightweight, runs in browser, no server dependencies) to assemble PNG images into a multi-page PDF
- Each page is a full-bleed image at the selected paper size and DPI
- For spread view: photo page first, then calendar page, repeating for each month (24 pages for 12 months)
- For split view: left page then right page per month (24 pages for 12 months)
- For standard view: one page per month (12 pages) or single year view (1 page)
- Add a "Save PDF" button to the config-export section alongside "Save Image" and "Save All Months"
- PDF metadata: title "Calendar {year}", paper size matching the selected format
- The flow: render each page as PNG via html-to-image (same as current batch export), then assemble into PDF via jsPDF, then trigger download

Install jsPDF: `pnpm --filter @calendar-feeds/calendar add jspdf`

## Implementation notes

- The `layout` query param (`standard` | `split` | `spread`) controls which renderer is used. Default is `standard` (current behavior).
- Add layout pills to the config sidebar: Standard, Split, Spread. Split only available for A6. Spread available for Letter/Legal/Tabloid.
- The fragment functions (`renderCalendarFragment`, `renderMonthViewFragment`) don't need to change for spread — the photo page is a separate element.
- For split view, create a new `renderSplitMonthFragment` in a new file `render-split.ts` that generates two side-by-side A6 page divs.
- Photo storage is ephemeral (session only, client-side). No server-side storage needed.
- Clean routes (`/:year`, `/:year/:month`) remain completely unaffected.
- Run `pnpm typecheck` to validate. Test with `pnpm dev:calendar`.

## Verification

1. `pnpm typecheck` — passes
2. Visit `/config/2026/04?size=a6&layout=split` — two A6 pages side by side with S-W left, T-S+Notes right
3. Visit `/config/2026/04?size=letter&layout=spread` — photo page + calendar page stacked
4. Upload a photo for April — thumbnail appears in sidebar, photo page renders with image
5. Click "Save PDF" — downloads multi-page PDF with all months
6. Gutter margins visible on inside edges of split/spread pages
7. Clean views (`/2026`, `/2026/04`) unaffected
