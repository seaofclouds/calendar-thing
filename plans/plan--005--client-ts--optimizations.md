# Plan 005: client.ts Optimizations

## Problem

`client.ts` is ~350 lines handling multiple concerns: sidebar wiring, scroll snap, page scaling, image upload, spread layout injection, and three export paths. It works but becomes harder to navigate as features grow.

## Proposed Split

### 1. `client.ts` — Init + wiring (~120 lines)
- Responsive column layout (year view)
- Config sidebar click handler (delegates to other modules)
- Scroll position save/restore (sessionStorage)
- Page scaling (`scalePages()`, resize handler)
- Init orchestration

### 2. `export-images.ts` — PNG export (~100 lines)
- `exportCurrentView()` — single month to PNG
- `exportAllMonths()` — batch all months to PNG
- `getActiveDpi()`, `getConfigParams()` helpers (shared with export-pdf)

### 3. `spread-layout.ts` — Photo layout (~100 lines)
- `initSpreadLayout()` — inject spread-image containers
- `refreshSpreadImage()` — update a single slot after upload
- File input management (`getFileInput()`, `triggerImageUpload()`)
- Click delegation for add/replace image

### 4. Already separate
- `store-images.ts` — IndexedDB CRUD
- `export-pdf.ts` — PDF generation with imposition

## Shared Helpers

`getActiveDpi()` and `getConfigParams()` are currently duplicated between `client.ts` and `export-pdf.ts`. Extract to a small `config-params.ts` module that both import from.

## Bundle Size

Currently 1.5MB due to jspdf being bundled into the single `client.js` output. Two options:

### Option A: esbuild code splitting
Switch from `--outfile=public/client.js` to `--splitting --outdir=public/js --format=esm`. Dynamic `import()` calls become real separate chunks:
- `js/client.js` — main entry (~50KB)
- `js/chunk-html-to-image.js` — loaded on first export
- `js/chunk-jspdf.js` — loaded on first PDF export

Requires updating HTML to `<script src="/js/client.js">` and serving the chunks directory.

### Option B: CDN import maps
Use an import map to load jspdf from a CDN at runtime instead of bundling. Saves ~300KB from the bundle but adds a network dependency.

**Recommendation**: Option A. It's a one-line build command change and keeps everything self-hosted.

## Priority

Low — functional correctness first. Do this when:
- Adding more client-side features to client.ts
- Bundle size becomes a user-facing concern
- Onboarding a contributor who needs to navigate the code
