# Phase 3: Agenda View

## Context

With design tokens (Phase 1) and the config sidebar (Phase 2) in place, this phase adds an agenda/timeline view — a chronological event list centered on a target date. This is the "feeds browser" concept, integrated as a view within the unified calendar app rather than a separate worker.

## Prerequisites

- Phase 1 complete (design tokens, semantic HTML conventions, shared `.day`/`.event` classes)
- Phase 2 complete (config sidebar can wrap any view)

## Route

```
/:year/:month/:day    → Agenda view centered on that date
/config/:year/:month/:day → Agenda view with config sidebar
```

## Data

- Fetch all feed events for ~6 months before and after the target date
- Group by date, sort chronologically
- Skip days with no events (denser, more useful)
- Embed as JSON in `<script id="feed-data">` for client-side feed filtering
- ~175-200 events total — all loaded at once, no pagination

## HTML Structure

Uses the same component classes from Phase 1 (`.day`, `.event`, `.view-header`), styled contextually via `.agenda-view .day` vs `.month-view .day`:

```html
<main class="agenda-view">
  <header class="view-header">
    <h1 class="view-title">
      <a href="/:year/:month">April 2026</a>
    </h1>
    <nav class="feed-toggles">
      <label class="feed-toggle" data-feed="lunar">
        <input type="checkbox" checked>
        <span class="feed-toggle-icon">...</span>
        <span class="feed-toggle-name">Lunar</span>
      </label>
      ...
    </nav>
  </header>

  <section class="agenda-timeline">
    <article class="day today" data-date="2026-04-10">
      <header class="day-header">
        <h2 class="day-date">Friday, April 10, 2026</h2>
      </header>
      <ul class="day-events">
        <li class="event" data-feed="busd">
          <span class="event-icon">...</span>
          <span class="event-summary">No School</span>
        </li>
      </ul>
    </article>

    <hr class="today-marker">

    <article class="day" data-date="2026-04-11">
      ...
    </article>
  </section>
</main>
```

## Client-Side

### Feed filtering

- Read localStorage for saved feed preferences on load
- Toggle checkboxes show/hide `.event[data-feed="{id}"]` elements
- Hide `.day` articles that have no visible events after filtering
- Save preferences to localStorage on change

### Today marker

- `<hr class="today-marker">` — thin `var(--color-accent)` line positioned between the last past day and first future day
- Auto-scroll to today marker on page load

## Navigation

- **Month view → Agenda**: Click a date in month view navigates to `/:year/:month/:day`
- **Agenda → Month view**: Date headers link back to `/:year/:month`
- **Year view → Agenda**: Click month → month view → click date → agenda (two clicks)
- **Config sidebar**: Can navigate to agenda view at `/config/:year/:month/:day`

## CSS

Agenda-specific styles, building on design tokens:

```css
.agenda-view {
  max-width: 40em;
  margin: 0 auto;
  padding: 1em;
}

.agenda-view .day-header {
  font-weight: var(--font-weight-book);
  font-size: var(--font-size-day-number);
}

.agenda-view .day.today .day-header {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}

.today-marker {
  border: none;
  border-top: 2px solid var(--color-accent);
  margin: 1em 0;
}

.feed-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
```

## Files to create

- `apps/calendar/src/render-agenda.ts` — agenda HTML renderer

## Files to modify

- `apps/calendar/src/index.ts` — add `/:year/:month/:day` route
- `apps/calendar/src/render-month.ts` — make date numbers clickable (link to agenda)
- `apps/calendar/src/client.ts` — feed toggle filtering, today scroll
- `apps/calendar/public/styles.css` — agenda-specific styles

## Verification

1. `pnpm typecheck` — passes
2. Visit `/2026/04/10` — agenda renders centered on April 10
3. Events from all feeds displayed chronologically
4. Toggle feeds on/off — events filter without page reload
5. Preferences persist across page refresh (localStorage)
6. Auto-scrolls to today marker (red line)
7. Date headers link to month view
8. From month view, clicking a date navigates to agenda
9. `/config/2026/04/10` — agenda with config sidebar works
