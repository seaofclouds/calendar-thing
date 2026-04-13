# Phase 1: Design Tokens + Calendar CSS Refactor ✓

> **Status: Complete** — merged in PR #26. Final type scale simplified to 4 tokens (xl/lg/md/sm), no em compounding. See `/styleguide` for live reference.

## Context

The calendar app (`apps/calendar/`) renders year and month views as server-side HTML. All styling is in a single `public/styles.css` (895 lines) with hardcoded values — colors as hex literals, font weights as numbers, font sizes as magic values. There are minor inconsistencies (weekday header weight differs between year/month views, legal/tabloid have ad-hoc overrides).

This phase extracts a design token system, refactors the CSS to use it, adopts semantic HTML conventions, and tightens typographic consistency — laying the foundation for the config sidebar (Phase 2) and agenda view (Phase 3).

## Scope

1. **Design tokens** — CSS custom properties in a shared package
2. **CSS refactor** — replace hardcoded values with token references
3. **Semantic HTML** — refactor rendered HTML to use semantic elements with consistent naming
4. **Typographic tightening** — resolve inconsistencies in font sizes/weights across views
5. **Styleguide page** — `/styleguide` route showing all tokens visually
6. **Build integration** — copy shared CSS to app's public/ at build time

---

## 1. Design Tokens

### Create `packages/styles/base.css`

```css
:root {
  /* Colors */
  --color-text: #000;
  --color-bg: #fff;
  --color-accent: #c00;
  --color-border: #aaa;
  --color-border-light: #e0e0e0;
  --color-muted: #ccc;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  --line-height: 1.5;

  /* Font weight scale */
  --font-weight-thin: 100;
  --font-weight-light: 200;
  --font-weight-book: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Type scale — relative to container context */
  --font-size-view-title: 3.6em;
  --font-size-month-name: 1.8em;
  --font-size-day-number: 1.1em;
  --font-size-weekday-label: 0.6em;
  --font-size-event: 0.75em;
  --font-size-mini-title: 1.1em;
  --font-size-mini-grid: 0.7em;
}

/* === Reset === */
html { height: 100%; margin: 0; padding: 0; }

:root {
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  line-height: var(--line-height);
  font-weight: var(--font-weight-normal);
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--color-bg);
}

h1, h2, h3 {
  margin: 0;
  padding: 0;
}
```

### Create `packages/styles/package.json`

```json
{ "name": "@calendar-feeds/styles", "version": "1.0.0", "private": true }
```

---

## 2. CSS Refactor

### Hardcoded values → token references

In `apps/calendar/public/styles.css`, replace:

| Hardcoded | Token | Occurrences |
|-----------|-------|-------------|
| `#c00` | `var(--color-accent)` | ~4 (hover, today highlight) |
| `#aaa` | `var(--color-border)` | ~5 (grid borders) |
| `#e0e0e0` | `var(--color-border-light)` | ~2 (other-month borders) |
| `#ccc` | `var(--color-muted)` | ~2 (other-month text) |
| `#000` | `var(--color-text)` | ~3 (month header, weekday, mini title) |
| `#888` | `var(--color-muted)` | 1 (mobile event dot) |
| `font-weight: 100` | `var(--font-weight-thin)` | ~3 (view titles) |
| `font-weight: 200` | `var(--font-weight-light)` | ~3 (month headers) |
| `font-weight: 300` | `var(--font-weight-book)` | ~2 (day numbers) |
| `font-weight: 500` | `var(--font-weight-medium)` | ~3 (weekday labels, mini) |
| `font-weight: 600` | `var(--font-weight-semibold)` | ~1 (year-view weekdays) |
| `font-size: 3.6em` | `var(--font-size-view-title)` | ~2 (year h1, month-view title) |
| `font-size: 1.8em` | `var(--font-size-month-name)` | ~1 (month header h2) |
| `font-size: 0.75em` | `var(--font-size-event)` | ~1 (events) |

### Remove reset from styles.css

The html/body reset moves to `base.css`. Remove the duplicate from `styles.css`.

### Tighten inconsistencies

| Issue | Current | Fix |
|-------|---------|-----|
| Weekday header weight differs | Year: `font-weight: 600`, Month: `font-weight: 500` | Standardize to `var(--font-weight-medium)` (500) everywhere |
| Legal month-header h2 overrides size | `font-size: 1.5em` | Use `var(--font-size-month-name)` (1.8em), adjust spacing instead |
| Legal/tabloid h1 weight | `font-weight: 25` (invalid) | Use `var(--font-weight-thin)` |
| Duplicate `.calendar.print .month-grid` rule | Lines 259-265 and 420-422 | Consolidate |
| Duplicate `.size-legal .print .calendar-grid` | Lines 448-449 and 450-452 | Consolidate |

---

## 3. Semantic HTML Conventions

### Naming System

**Pages** (top-level, one per route — suffixed with `-view`):
- `.year-view` — year page
- `.month-view` — month page
- `.agenda-view` — agenda page (Phase 3)
- `.config` — config wrapper (Phase 2)

**Components** (reusable, bare nouns):
- `.month` — a rendered month grid (×12 in year-view, ×2 as `.month.mini` in month-view header)
- `.week` — a row of 7 days within a `.month`
- `.day` — individual day cell (in `.month`, in `.month-view` expanded grid, in `.agenda-view`)
- `.event` — an event entry (in `.day`)

### Principles

- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Pages are `<main class="{x}-view">`
- Components use bare nouns as classes
- Modifiers use compound classes: `.month.mini`, `.day.today`, `.day.other-month`
- Keep `#root` as the sizing container (used for paper dimensions)
- Mini calendars in month-view header use **identical HTML** to year-view months (just add `.mini`)

### The `.month` component (shared across views)

```html
<article class="month">
  <header class="month-header">
    <h2>January</h2>
  </header>
  <div class="weekdays">
    <span class="weekday">S</span>
    <span class="weekday">M</span>
    ...
  </div>
  <section class="month-grid">
    <div class="week">
      <div class="day other-month">...</div>
      <div class="day">...</div>
      ...
    </div>
    <!-- 5-6 .week rows -->
  </section>
</article>
```

This structure appears:
- 12× in `.year-view` (wrapped in `<a>` links)
- 2× in `.month-view` header as `.month.mini` (prev/next navigation)

### Year View — HTML changes

```
Current                          → Semantic
─────────────────────────────────────────────
<div class="calendar">           → <main class="year-view">
<div class="calendar-header">    → <header class="view-header">
<div class="calendar-grid">      → <section class="year-grid">
<div class="month">              → <article class="month"> (stays)
<div class="month-header">       → <header class="month-header">
<h3 class="week-day">            → <span class="weekday">
<div class="month-grid">         → <section class="month-grid">
(no row grouping currently)      → <div class="week"> (add row wrapper)
<div class="calendar-day">       → <div class="day">
```

### Month View — HTML changes

```
Current                               → Semantic
──────────────────────────────────────────────────
<div class="month-view">              → <main class="month-view">
<div class="month-view-header">       → <header class="view-header">
<div class="month-view-nav">          → <nav class="view-nav">
<a class="mini-calendar">             → <a class="month mini"> (reuse .month markup)
<div class="mini-grid">               → (removed — .month handles it)
<div class="mini-title">              → (removed — .month-header h2 handles it)
<div class="mini-weekday">            → (removed — .weekday handles it)
<div class="month-view-grid">         → <section class="month-expanded">
<div class="month-view-daynames">     → <div class="weekdays">
<div class="month-view-dayname">      → <div class="weekday">
<div class="month-view-days">         → <section class="month-days">
<div class="month-day">               → <article class="day">
<div class="month-day-header">        → <header class="day-header">
<span class="month-day-number">       → <span class="day-number">
<span class="month-day-event">        → <li class="event"> inside <ul class="day-events">
```

### Shared patterns

**Day cell** (in `.month` grids, `.month-view` expanded grid, and later `.agenda-view`):
```html
<div class="day {today} {other-month}" data-date="2026-04-10">
  <header class="day-header">
    <span class="day-number">10</span>
    <!-- optional markers (moon, solar) -->
  </header>
  <ul class="day-events">
    <li class="event" data-feed="busd">
      <span class="event-icon">...</span>
      <span class="event-summary">No School</span>
    </li>
  </ul>
</div>
```

Note: In `.month` grids (year-view + minis), days are simple — just `.day-number` or a marker emoji. The `.day-events` list only appears in `.month-view` expanded grid and `.agenda-view`.

**View header** (consistent across all page-level views):
```html
<header class="view-header">
  <nav class="view-nav">...</nav>
  <h1 class="view-title">...</h1>
  <nav class="view-nav">...</nav>
</header>
```

### CSS class renaming map

| Old class | New class |
|-----------|-----------|
| `.calendar` (year container) | `.year-view` |
| `.calendar-header` | `.view-header` |
| `.calendar-grid` | `.year-grid` |
| `.calendar-day` | `.day` |
| `.calendar-print-container` | `.print-container` |
| `.month-view` (container) | `.month-view` (stays) |
| `.month-view-header` | `.view-header` (shared) |
| `.month-view-title` | `.view-title` (shared) |
| `.month-view-nav` | `.view-nav` (shared) |
| `.month-view-grid` | `.month-expanded` |
| `.month-view-daynames` | `.weekdays` (shared) |
| `.month-view-dayname` | `.weekday` (shared) |
| `.month-view-days` | `.month-days` |
| `.month-day` | `.day` (shared) |
| `.month-day-header` | `.day-header` (shared) |
| `.month-day-number` | `.day-number` (shared) |
| `.month-day-event` | `.event` (shared) |
| `.mini-calendar` | `.month.mini` |
| `.mini-grid` | (removed — .month handles it) |
| `.mini-title` | (removed — .month-header handles it) |
| `.mini-weekday` | (removed — .weekday handles it) |
| `.week-day` (year h3) | `.weekday` (shared span) |

Contextual styling uses parent selectors: `.year-view .day`, `.month-view .day`, `.month.mini .day`.

---

## 4. Styleguide Page

### Route: `/styleguide`

Server-rendered HTML page at `apps/calendar/src/render-styleguide.ts`:

```html
<main class="styleguide">
  <header class="view-header">
    <h1 class="view-title">Styleguide</h1>
  </header>

  <section class="styleguide-section">
    <h2>Colors</h2>
    <!-- Swatches showing each color token with name and hex value -->
  </section>

  <section class="styleguide-section">
    <h2>Typography</h2>
    <!-- Each type scale level rendered at actual size with token name -->
  </section>

  <section class="styleguide-section">
    <h2>Font Weights</h2>
    <!-- Sample text at each weight -->
  </section>

  <section class="styleguide-section">
    <h2>Structure</h2>
    <!-- Document the semantic HTML conventions -->
  </section>
</main>
```

---

## 5. Build Integration

### `apps/calendar/package.json`

```json
"build": "cp ../../packages/styles/base.css public/base.css && esbuild src/client.ts --bundle --outfile=public/client.js --format=esm --target=es2020"
```

### HTML head (both renderers)

```html
<link rel="stylesheet" href="/base.css">
<link rel="stylesheet" href="/styles.css">
```

### `pnpm-workspace.yaml`

Verify `packages/*` glob already covers `packages/styles/`. If not, add it.

---

## Files to Create

- `packages/styles/base.css` — design tokens + reset
- `packages/styles/package.json` — workspace package manifest
- `apps/calendar/src/render-styleguide.ts` — styleguide HTML renderer

## Files to Modify

- `apps/calendar/public/styles.css` — refactor to tokens, rename classes, remove reset, fix inconsistencies
- `apps/calendar/src/render.ts` — semantic HTML elements, new class names, add base.css link
- `apps/calendar/src/render-month.ts` — semantic HTML elements, new class names, add base.css link
- `apps/calendar/src/index.ts` — add `/styleguide` route
- `apps/calendar/src/client.ts` — update class selectors (`.calendar` → `.year-view`, `.month-view` stays)
- `apps/calendar/package.json` — add base.css copy to build script

## Verification

1. `pnpm install` — workspace resolves `@calendar-feeds/styles`
2. `pnpm typecheck` — passes
3. `pnpm dev:calendar` — start dev server
4. Visit `/:year` — year view renders identically (visual comparison)
5. Visit `/:year/:month` — month view renders identically
6. Visit `/styleguide` — tokens displayed correctly
7. View source — semantic elements (`<main>`, `<header>`, `<nav>`, `<article>`, `<section>`) in use
8. Inspect CSS — no hardcoded hex colors or font weights remain (all via `var()`)
9. Export still works — `/:year/:size/:orientation/300dpi.png` produces image
