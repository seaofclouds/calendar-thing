# Plan 006: Branch Code Review & Cleanup

## Context

This branch contains ~60 commits across 88 files (+8000 lines) — a major body of work spanning design tokens, config sidebar, feed plugin architecture, PDF export, image upload, spread layouts, and more. The feature is visually working. This review identifies code quality, safety, efficiency, and legibility issues that can be cleaned up **without structural or visual changes**.

Typecheck passes clean. No test suite exists (by design).

---

## Findings

### Tier 1 — Should Fix (bugs, safety, efficiency)

#### 1. `serializeParams()` duplicated and skips URL encoding
- **Where:** `apps/calendar/src/index.ts:29-33` and `apps/calendar/src/client.ts:15-19`
- Identical function in both files. Neither uses `encodeURIComponent()`. If a param value contains `&` or `=`, query strings break silently.
- **Fix:** In `index.ts`, replace with `params.toString()` (standard API handles encoding). In `client.ts`, same — or if colons/commas must stay unencoded, add a clear comment explaining why.

#### 2. `getConfigParams()` and `getActiveDpi()` duplicated
- **Where:** `client.ts:340-361` and `export-pdf.ts:45-63`
- Near-identical functions in both files.
- **Fix:** Extract to a shared `apps/calendar/src/config-helpers.ts` module. Import from both files.

#### 3. `getConfigParams()` called redundantly in `scalePages()`
- **Where:** `client.ts:456`, `493`, `520`
- Parses `window.location.href` three separate times in the same function, including inside a per-element loop.
- **Fix:** Call once at top of `scalePages()`, destructure what's needed.

#### 4. `URL.createObjectURL()` memory leak
- **Where:** `store-images.ts:75`
- `loadImageUrl()` creates object URLs that are never revoked by any caller. Each call allocates memory that persists until page unload.
- **Fix:** Add JSDoc documenting caller responsibility. Add exported `revokeImageUrl(url: string)` helper. Revoke in appropriate cleanup paths.

#### 5. Missing `try-finally` around `ImageBitmap`
- **Where:** `export-pdf.ts:77-109`
- `createImageBitmap()` allocates GPU/bitmap memory. `img.close()` at line 109 only runs on the success path. If `canvas.getContext("2d")` returns null or `drawImage` throws, the bitmap leaks.
- **Fix:** Wrap body in try-finally so `img.close()` always runs.

#### 6. `env: any` in feed worker factory
- **Where:** `shared/src/feed-worker.ts:12, 28`
- Defeats TypeScript's purpose — callers can access any property without compile-time checking.
- **Fix:** Make generic: `createFeedWorker<E extends Record<string, unknown>>()` and propagate `E` to `FeedRoute`. Or at minimum use `Record<string, unknown>`.

---

### Tier 2 — Should Improve (legibility, DRY, consistency)

#### 7. Render utility functions duplicated
- **Where:** `render.ts:142-158` and `render-month.ts:285-308`
- `buildMarkerMap()`, `markerPriority()`, `escapeHtml()`, `escapeAttr()` are identical in both files.
- **Fix:** Extract to `apps/calendar/src/render-utils.ts`. Import in both.

#### 8. Constants duplicated across render files
- **Where:** `render.ts:41-44`, `render-month.ts:9-14`, `render-config.ts:9-11`
- `MONTH_NAMES` and `WEEK_DAYS` appear in three files.
- **Fix:** Export from `render-utils.ts` or a dedicated `constants.ts`.

#### 9. Seven near-identical pill-rendering loops
- **Where:** `render-config.ts:124-196`
- Each generates `<button class="config-option ...">` with minor variations (data attribute name, label source).
- **Fix:** Extract a `renderPills(items, activeValue, dataAttr)` helper.

#### 10. Fragile string replacement for fragment embedding
- **Where:** `render-config.ts:206`
- `frag.html.replace('id="root" class="', 'class="page ')` — silently fails if root HTML structure changes.
- **Fix:** Pass an `embedMode` flag to `renderMonthViewFragment()` so it generates correct classes from the start.

#### 11. Inconsistent error handling across feed workers
- **Where:** `feeds/movies/src/index.ts` has try-catch on every handler. `feeds/astrology/src/index.ts` and `feeds/astronomy/src/index.ts` have zero error handling.
- If computation throws in Astrology/Astronomy, the worker returns an opaque 500 with no message.
- **Fix:** Add try-catch matching the Movies worker pattern.

#### 12. Magic numbers in `scalePages()`
- **Where:** `client.ts:454` (`24`), `502/537` (`80`), `551` (`480`), `496-497` (`96`)
- Unnamed constants for padding, toolbar height, narrow threshold, px-per-inch.
- **Fix:** Extract named constants at file top: `SCROLL_PADDING`, `TOOLBAR_HEIGHT`, `NARROW_THRESHOLD`, `PX_PER_INCH`.

#### 13. Inline CSS in styleguide renderer
- **Where:** `render-styleguide.ts:16-122`
- Entire styleguide CSS embedded as `<style>` instead of being in the external stylesheet.
- **Fix:** Move to `styles.css` under a `.styleguide-view` namespace.

---

### Tier 3 — Nice to Have (minor polish)

#### 14. Hardcoded `rgba()` colors in CSS
- **Where:** `styles.css` lines ~1280, 1299
- `rgba(0, 0, 0, 0.35)` and `rgba(0, 0, 0, 0.55)` should use CSS custom properties per the design token system.
- **Fix:** Add `--color-overlay` / `--color-overlay-dark` to `base.css`.

#### 15. Long CSS selector lists for border sizing
- **Where:** `styles.css` lines ~1306-1325
- 20+ lines of near-identical selectors for A6/A5/4x6/5x7.
- **Fix:** Add a `.small-format` class to those page containers, target once.

#### 16. `parseInt` without radix in feed workers
- **Where:** `feeds/astrology/src/index.ts:14`, `feeds/astronomy/src/index.ts:16`
- Should be `parseInt(val, 10)` for explicitness, and clamp year to a reasonable range.

#### 17. Handler signature inconsistency
- **Where:** Astrology/Astronomy handlers accept `(request)` while Movies accepts `(_request, env: Env)`.
- The factory calls all handlers with three args — works at runtime but misleading.
- **Fix:** All handlers should declare the full `(request, env, ctx)` signature.

---

## Implementation Plan

Grouped by file to minimize churn. No structural or visual changes.

### Step 1: Extract shared client utilities
- Create `apps/calendar/src/config-helpers.ts`
- Move `getConfigParams()` and `getActiveDpi()` there
- Import in both `client.ts` and `export-pdf.ts`
- Delete the duplicate copies

### Step 2: Extract shared render utilities
- Create `apps/calendar/src/render-utils.ts`
- Move `buildMarkerMap()`, `markerPriority()`, `escapeHtml()`, `escapeAttr()`, `MONTH_NAMES`, `WEEK_DAYS` there
- Import in `render.ts`, `render-month.ts`, and `render-config.ts`
- Delete the duplicate copies

### Step 3: Fix `scalePages()` efficiency in `client.ts`
- Call `getConfigParams()` once at the top, destructure `margin`, `gutter`
- Extract magic numbers to named constants at file top

### Step 4: Fix `composeImagePage()` safety in `export-pdf.ts`
- Wrap body in try-finally so `img.close()` always runs

### Step 5: Fix `URL.createObjectURL` leak in `store-images.ts`
- Add JSDoc to `loadImageUrl()` documenting caller must revoke
- Add exported `revokeImageUrl(url: string)` helper

### Step 6: Fix feed worker factory type safety in `shared/src/feed-worker.ts`
- Change `env: any` to generic type parameter or `Record<string, unknown>`
- Update handler signatures in all feed workers to be consistent

### Step 7: Add error handling to Astrology and Astronomy feed workers
- Add try-catch matching the Movies worker pattern

### Step 8: Extract pill-rendering helper in `render-config.ts`
- Create `renderPills()` helper function, refactor the 7 loops

### Step 9: Move styleguide inline CSS to `styles.css`
- Move the `<style>` block content to `styles.css` under `.styleguide-view`
- Remove the inline `<style>` from `render-styleguide.ts`

### Step 10: CSS token compliance
- Add overlay color token to `base.css`
- Replace hardcoded `rgba()` values in `styles.css`
- Consolidate the long border-sizing selector list with a shared class

### Step 11: Fix `serializeParams()`
- In `index.ts`: evaluate whether `params.toString()` works (it should — modern URL API handles encoding)
- In `client.ts`: same evaluation
- If the custom serializer is needed for colon/comma preservation, add a clear comment explaining why

---

## Verification

- `pnpm typecheck` must pass after every step
- Visual spot-check via `pnpm dev:calendar` — layout and behavior should be unchanged
- No new files beyond `config-helpers.ts` and `render-utils.ts`
