# Phase 2: Print Config Sidebar

## Context

With design tokens and semantic HTML established in Phase 1, this phase adds the print config interface — a sidebar that wraps calendar views with controls for month navigation, paper format, and orientation. Matches the user's mockup: left sidebar on warm neutral background, calendar rendered at print dimensions on the right.

## Prerequisites

- Phase 1 complete (design tokens, semantic HTML, consistent class naming)

## Routes

```
/config/:year           → Year view + sidebar
/config/:year/:month    → Month view + sidebar
```

Clean view routes (`/:year`, `/:year/:month`) remain unchanged — no sidebar, no chrome, print-ready.

## Sidebar Structure (from mockup)

```html
<div class="config">
  <aside class="config-sidebar">
    <nav class="config-nav">
      <section class="config-section">
        <h3 class="config-year">2025</h3>
        <ul class="config-months">
          <li><a href="/config/2025/01" class="config-month active">Jan</a></li>
          <li><a href="/config/2025/02" class="config-month">Feb</a></li>
          ...
        </ul>
      </section>
      <section class="config-section">
        <h3 class="config-year">2026</h3>
        <ul class="config-months">
          <li><a href="/config/2026/01" class="config-month">Jan</a></li>
          ...
        </ul>
      </section>
    </nav>

    <section class="config-section">
      <h3 class="config-label">Format</h3>
      <div class="config-options">
        <button class="config-option active">Letter</button>
        <button class="config-option">Legal</button>
        <button class="config-option">Tabloid</button>
        <button class="config-option">A5</button>
        <button class="config-option">A4</button>
      </div>
    </section>

    <section class="config-section">
      <h3 class="config-label">Orientation</h3>
      <div class="config-options">
        <button class="config-option">Portrait</button>
        <button class="config-option active">Landscape</button>
      </div>
    </section>
  </aside>

  <main class="config-content">
    <p class="config-status">US Letter, Landscape, 11in x 8.5in</p>
    <!-- Calendar view HTML (existing render output, in print mode at selected size) -->
  </main>
</div>
```

## Rendering

### `apps/calendar/src/render-config.ts`

- Wraps existing year-view / month-view render output
- Receives same params plus config state (current format, orientation)
- Generates sidebar HTML with active states
- Embeds the calendar view inside `.config-content`
- The calendar is rendered in print mode at the selected paper size

### Sidebar behavior

- Month links are server-rendered `<a>` tags — clicking navigates to `/config/:year/:month`
- Format/orientation buttons update URL params via client-side JS → page re-renders
- Or: fully server-rendered with format/orientation as query params (`?size=letter&orientation=landscape`)

## CSS

### Sidebar tokens (add to base.css or app styles)

```css
:root {
  --color-config-bg: #e8e0d8;     /* Warm neutral from mockup */
  --color-config-active: #c5b9a8; /* Darker pill for active state */
  --config-sidebar-width: 7em;
}
```

### Config-specific styles

```css
.config {
  display: flex;
  height: 100vh;
  background: var(--color-config-bg);
}

.config-sidebar {
  width: var(--config-sidebar-width);
  padding: 1em;
  overflow-y: auto;
  flex-shrink: 0;
}

.config-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  overflow: auto;
}

.config-option {
  /* Pill buttons */
  border: none;
  border-radius: 1em;
  padding: 0.3em 0.8em;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size-event);
}

.config-option.active {
  background: var(--color-config-active);
}
```

### Print/export: sidebar hidden

The config sidebar is purely for interactive configuration. When exporting or printing, only the calendar content is captured.

## Future config additions (not in scope for Phase 2)

- Feed/calendar toggles (which feeds to include)
- Month images (upload or select per month)
- Year view vs month view toggle
- Grid row/column configuration
- Export button (currently URL-driven)

## Files to create

- `apps/calendar/src/render-config.ts` — config wrapper renderer

## Files to modify

- `apps/calendar/src/index.ts` — add `/config/...` route handling
- `apps/calendar/src/client.ts` — sidebar interaction (format/orientation pill clicks)
- `apps/calendar/public/styles.css` — config layout and sidebar styles

## Verification

1. `pnpm typecheck` — passes
2. Visit `/config/2026/01` — month view with sidebar rendered
3. Visit `/config/2026` — year view with sidebar rendered
4. Click month in sidebar → navigates to that month's config view
5. Click format pill → calendar re-renders at that paper size
6. Click orientation pill → calendar re-renders in that orientation
7. Status line shows current settings
8. Clean views (`/2026`, `/2026/01`) unaffected — no sidebar
