/**
 * Styleguide page renderer.
 * Shows all design tokens (colors, type scale, font weights) visually.
 */

export function renderStyleguide(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Styleguide</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <style>
    .styleguide {
      max-width: 960px;
      margin: 0 auto;
      padding: 2em;
      text-align: left;
    }
    .styleguide-section {
      margin-bottom: 3em;
    }
    .styleguide-section h2 {
      font-size: 1.4em;
      font-weight: var(--font-weight-medium);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.3em;
      margin-bottom: 1em;
    }
    .swatch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1em;
    }
    .swatch {
      display: flex;
      flex-direction: column;
      gap: 0.3em;
    }
    .swatch-color {
      width: 100%;
      height: 60px;
      border-radius: 4px;
      border: 1px solid var(--color-border-light);
    }
    .swatch-label {
      font-size: 0.85em;
      font-weight: var(--font-weight-medium);
    }
    .swatch-value {
      font-size: 0.75em;
      color: var(--color-border);
      font-family: monospace;
    }
    .type-sample {
      margin-bottom: 1em;
      display: flex;
      align-items: baseline;
      gap: 1em;
    }
    .type-sample-label {
      font-size: 0.75em;
      color: var(--color-border);
      font-family: monospace;
      white-space: nowrap;
      min-width: 200px;
    }
    .weight-sample {
      margin-bottom: 0.75em;
      display: flex;
      align-items: baseline;
      gap: 1em;
    }
    .weight-sample-label {
      font-size: 0.75em;
      color: var(--color-border);
      font-family: monospace;
      white-space: nowrap;
      min-width: 200px;
    }
    .structure-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9em;
    }
    .structure-table th,
    .structure-table td {
      text-align: left;
      padding: 0.4em 0.8em;
      border-bottom: 1px solid var(--color-border-light);
    }
    .structure-table th {
      font-weight: var(--font-weight-medium);
      background: #f8f8f8;
    }
    .structure-table code {
      font-size: 0.9em;
      background: #f0f0f0;
      padding: 0.1em 0.3em;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <main class="styleguide">
    <header class="view-header" style="justify-content: flex-start;">
      <h1 class="view-title" style="font-size: 2em; padding-bottom: 0.5em;">Styleguide</h1>
    </header>

    <section class="styleguide-section">
      <h2>Colors</h2>
      <div class="swatch-grid">
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-text);"></div>
          <span class="swatch-label">Text</span>
          <span class="swatch-value">--color-text: #000</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-bg); border: 1px solid var(--color-border);"></div>
          <span class="swatch-label">Background</span>
          <span class="swatch-value">--color-bg: #fff</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-accent);"></div>
          <span class="swatch-label">Accent</span>
          <span class="swatch-value">--color-accent: #c00</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-border);"></div>
          <span class="swatch-label">Border</span>
          <span class="swatch-value">--color-border: #aaa</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-border-light);"></div>
          <span class="swatch-label">Border Light</span>
          <span class="swatch-value">--color-border-light: #e0e0e0</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-muted);"></div>
          <span class="swatch-label">Muted</span>
          <span class="swatch-value">--color-muted: #ccc</span>
        </div>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Typography</h2>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-view-title: 3.6em</span>
        <span style="font-size: var(--font-size-view-title); font-weight: var(--font-weight-thin); line-height: 1;">2026</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-month-name: 1.8em</span>
        <span style="font-size: var(--font-size-month-name); font-weight: var(--font-weight-light);">January</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-day-number: 1.1em</span>
        <span style="font-size: var(--font-size-day-number); font-weight: var(--font-weight-book);">15</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-weekday-label: 0.6em</span>
        <span style="font-size: var(--font-size-weekday-label); font-weight: var(--font-weight-medium); text-transform: uppercase;">Sun Mon Tue Wed Thu Fri Sat</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-event: 0.75em</span>
        <span style="font-size: var(--font-size-event);">No School - Spring Break</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-mini-title: 1.1em</span>
        <span style="font-size: var(--font-size-mini-title); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.03em;">March</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">--font-size-mini-grid: 0.7em</span>
        <span style="font-size: var(--font-size-mini-grid);">1 2 3 4 5 6 7</span>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Font Weights</h2>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-thin: 100</span>
        <span style="font-weight: var(--font-weight-thin); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-light: 200</span>
        <span style="font-weight: var(--font-weight-light); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-book: 300</span>
        <span style="font-weight: var(--font-weight-book); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-normal: 400</span>
        <span style="font-weight: var(--font-weight-normal); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-medium: 500</span>
        <span style="font-weight: var(--font-weight-medium); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">--font-weight-semibold: 600</span>
        <span style="font-weight: var(--font-weight-semibold); font-size: 1.5em;">The quick brown fox jumps over the lazy dog</span>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Structure</h2>
      <table class="structure-table">
        <thead>
          <tr><th>Element</th><th>Class</th><th>Semantic tag</th><th>Context</th></tr>
        </thead>
        <tbody>
          <tr><td>Year page</td><td><code>.year-view</code></td><td><code>&lt;main&gt;</code></td><td>Top-level</td></tr>
          <tr><td>Month page</td><td><code>.month-view</code></td><td><code>&lt;main&gt;</code></td><td>Top-level</td></tr>
          <tr><td>Page header</td><td><code>.view-header</code></td><td><code>&lt;header&gt;</code></td><td>Inside view</td></tr>
          <tr><td>Page title</td><td><code>.view-title</code></td><td><code>&lt;h1&gt;</code></td><td>Inside header</td></tr>
          <tr><td>Navigation</td><td><code>.view-nav</code></td><td><code>&lt;nav&gt;</code></td><td>Inside header</td></tr>
          <tr><td>Year grid</td><td><code>.year-grid</code></td><td><code>&lt;section&gt;</code></td><td>Inside year-view</td></tr>
          <tr><td>Month component</td><td><code>.month</code></td><td><code>&lt;article&gt;</code></td><td>Reusable</td></tr>
          <tr><td>Mini month</td><td><code>.month.mini</code></td><td><code>&lt;a&gt;</code></td><td>Month-view nav</td></tr>
          <tr><td>Week row</td><td><code>.week</code></td><td><code>&lt;div&gt;</code></td><td>Inside month-grid</td></tr>
          <tr><td>Day cell</td><td><code>.day</code></td><td><code>&lt;div&gt;</code> or <code>&lt;article&gt;</code></td><td>Inside week/month-days</td></tr>
          <tr><td>Day header</td><td><code>.day-header</code></td><td><code>&lt;header&gt;</code></td><td>Inside day</td></tr>
          <tr><td>Event list</td><td><code>.day-events</code></td><td><code>&lt;ul&gt;</code></td><td>Inside day</td></tr>
          <tr><td>Event item</td><td><code>.event</code></td><td><code>&lt;li&gt;</code></td><td>Inside day-events</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}
