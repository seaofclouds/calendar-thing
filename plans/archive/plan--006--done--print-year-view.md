# Phase 6: Print Year View

## Context

The config sidebar (`/config/:year`) has "Save Image" and "Save All Months" export buttons, but these don't adapt to context. "Save Image" already works for the year view (it captures whatever `#root` contains via `exportCurrentView()`), but its label is generic. "Save All Months" is irrelevant in year view. And there's no browser print support at all.

This adds context-aware export buttons and native browser print support via `window.print()`.

Read `CLAUDE.md` and `plans/plan--002-config.md` for config sidebar architecture. The sidebar is in `apps/calendar/src/render-config.ts`, export logic in `client.ts`.

## Current state

- `exportCurrentView()` in `client.ts:161` captures `.config-content #root` as PNG -- already works for both year and month views
- `exportAllMonths()` in `client.ts:193` fetches all 12 months individually and exports each as PNG -- only relevant for month view
- `.year-view.print` CSS class in `styles.css` handles paper-size rendering for the year grid
- Config sidebar button section at `render-config.ts:171-174` always shows the same two buttons regardless of context

## Implementation

### Step 1: Context-aware export buttons in config sidebar

In `render-config.ts`, make the export section conditional on whether `opts.month` is set:

**Year view** (`/config/:year`, month is undefined):
```html
<section class="config-section config-export">
  <button class="config-button" data-action="save">Save Year Image</button>
  <button class="config-button" data-action="print">Print</button>
</section>
```

**Month view** (`/config/:year/:month`, month is set):
```html
<section class="config-section config-export">
  <button class="config-button" data-action="save">Save Image</button>
  <button class="config-button" data-action="save-all">Save All Months</button>
  <button class="config-button" data-action="print">Print</button>
</section>
```

Both views get a "Print" button. Year view replaces "Save All Months" with nothing (the single "Save Year Image" captures everything).

### Step 2: Print handler in client.ts

In `initConfigSidebar()`, add a handler for `data-action="print"` (after the existing `save` and `save-all` handlers around line 137):

```typescript
if (target.dataset.action === "print") printCalendar();
```

The `printCalendar()` function:

```typescript
function printCalendar() {
  window.print();
}
```

This is intentionally simple. The browser's native print dialog handles paper selection, orientation, and margins. CSS `@media print` rules handle hiding the sidebar.

### Step 3: Print CSS for config view

In `apps/calendar/public/styles.css`, add `@media print` rules:

```css
@media print {
  .config-sidebar { display: none; }
  .config-status { display: none; }
  .config {
    display: block;
    background: white;
  }
  .config-content {
    padding: 0;
    margin: 0;
  }
  .config-content #root {
    box-shadow: none;
    margin: 0;
  }
}
```

This hides the sidebar and status bar, letting the calendar content fill the printed page. The existing paper-size CSS (`.year-view.print`, `.month-view.print`, `.size-*` classes) handles the actual calendar layout since the config view renders with the `print` class.

## Files to modify

| File | Change |
|------|--------|
| `apps/calendar/src/render-config.ts` | Conditional export buttons based on `opts.month` |
| `apps/calendar/src/client.ts` | Add `printCalendar()` handler for `data-action="print"` |
| `apps/calendar/public/styles.css` | `@media print` rules for config view |

## Verification

1. Visit `/config/2026` -- see "Save Year Image" and "Print" buttons (no "Save All Months")
2. Visit `/config/2026/04` -- see "Save Image", "Save All Months", and "Print" buttons
3. Click "Save Year Image" on year view -- downloads PNG of full 12-month year grid
4. Click "Print" on year view -- browser print dialog opens, sidebar hidden, year grid fills page
5. Click "Print" on month view -- browser print dialog opens, sidebar hidden, month fills page
6. `pnpm typecheck` passes
7. Test with `pnpm dev:calendar`
