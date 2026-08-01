/**
 * Styleguide page renderer.
 * Shows all design tokens (colors, type scale, font weights) visually,
 * plus live component examples and the feed icon catalog.
 */

import { FEED_ICONS, PICKER_ICONS, getIconSvg } from "@calendar-feeds/shared";

export function renderStyleguide(): string {
  // Generate icon grid from the shared catalog
  const iconGrid = PICKER_ICONS.map(({ id, name }) => {
    const svg = getIconSvg(id) ?? "";
    const entry = FEED_ICONS[id as keyof typeof FEED_ICONS];
    const viewBox = entry?.viewBox ?? "0 0 14 14";
    return `<div class="icon-item">
              <div class="icon-preview">${svg}</div>
              <span class="icon-name">${name}</span>
              <span class="icon-id">${id}</span>
              <span class="icon-meta">${viewBox}</span>
            </div>`;
  }).join("\n");

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
    .styleguide-section > h2 {
      font-size: 1.4em;
      font-weight: var(--font-weight-medium);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.3em;
      margin-bottom: 1em;
    }
    .swatch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
    .swatch-value {
      font-size: var(--font-size-sm);
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
      font-size: var(--font-size-sm);
      color: var(--color-border);
      font-family: monospace;
      white-space: nowrap;
      min-width: 180px;
    }
    .weight-sample {
      margin-bottom: 0.75em;
      display: flex;
      align-items: baseline;
      gap: 1em;
    }
    .weight-sample-label {
      font-size: var(--font-size-sm);
      color: var(--color-border);
      font-family: monospace;
      white-space: nowrap;
      min-width: 180px;
    }
    .structure-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }
    .structure-table th,
    .structure-table td {
      text-align: left;
      padding: 0.4em 0.8em;
      border-bottom: 1px solid var(--color-border-light);
    }
    .structure-table th {
      font-weight: var(--font-weight-medium);
    }
    .structure-table code {
      font-family: monospace;
    }
    .component-example {
      border: 1px solid var(--color-border-light);
      border-radius: 4px;
      padding: 1.5em;
      margin-bottom: 1.5em;
    }
    .component-example-label {
      font-size: var(--font-size-sm);
      color: var(--color-border);
      font-family: monospace;
      margin-bottom: 0.5em;
    }
    .mini-example {
      max-width: 220px;
    }
    .event-examples {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      max-width: 300px;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 1.5em 1em;
    }
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3em;
    }
    .icon-preview {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-preview .event-icon {
      width: 24px;
      height: 24px;
    }
    .icon-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }
    .icon-id {
      font-size: var(--font-size-sm);
      color: var(--color-border);
      font-family: monospace;
    }
    .icon-meta {
      font-size: 0.6em;
      color: var(--color-border-light);
      font-family: monospace;
    }
    .icon-usage {
      margin-top: 1.5em;
    }
    .icon-usage-row {
      display: flex;
      align-items: center;
      gap: 0.5em;
      margin-bottom: 0.4em;
      font-size: var(--font-size-sm);
    }
    .icon-usage-row .event-icon {
      width: 0.9em;
      height: 0.9em;
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
          <span class="swatch-value">--color-text</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-bg); border-color: var(--color-border);"></div>
          <span class="swatch-label">Background</span>
          <span class="swatch-value">--color-bg</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-accent);"></div>
          <span class="swatch-label">Accent</span>
          <span class="swatch-value">--color-accent</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-border);"></div>
          <span class="swatch-label">Border</span>
          <span class="swatch-value">--color-border</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-border-light);"></div>
          <span class="swatch-label">Border Light</span>
          <span class="swatch-value">--color-border-light</span>
        </div>
        <div class="swatch">
          <div class="swatch-color" style="background: var(--color-muted);"></div>
          <span class="swatch-label">Muted</span>
          <span class="swatch-value">--color-muted</span>
        </div>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Type Scale</h2>
      <div class="type-sample">
        <span class="type-sample-label">xl &middot; 3.6em</span>
        <span style="font-size: var(--font-size-xl); font-weight: var(--font-weight-thin); line-height: 1;">2026</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">lg &middot; 1.8em</span>
        <span style="font-size: var(--font-size-lg); font-weight: var(--font-weight-light);">January</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">md &middot; 1.1em</span>
        <span style="font-size: var(--font-size-md); font-weight: var(--font-weight-book);">15</span>
      </div>
      <div class="type-sample">
        <span class="type-sample-label">sm &middot; 0.75em</span>
        <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.03em;">Sunday Monday Tuesday</span>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Font Weights</h2>
      <div class="weight-sample">
        <span class="weight-sample-label">thin &middot; 100</span>
        <span style="font-weight: var(--font-weight-thin); font-size: 1.5em;">The quick brown fox</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">light &middot; 200</span>
        <span style="font-weight: var(--font-weight-light); font-size: 1.5em;">The quick brown fox</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">book &middot; 300</span>
        <span style="font-weight: var(--font-weight-book); font-size: 1.5em;">The quick brown fox</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">normal &middot; 400</span>
        <span style="font-weight: var(--font-weight-normal); font-size: 1.5em;">The quick brown fox</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">medium &middot; 500</span>
        <span style="font-weight: var(--font-weight-medium); font-size: 1.5em;">The quick brown fox</span>
      </div>
      <div class="weight-sample">
        <span class="weight-sample-label">semibold &middot; 600</span>
        <span style="font-weight: var(--font-weight-semibold); font-size: 1.5em;">The quick brown fox</span>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Components</h2>

      <div class="component-example-label">.month.mini</div>
      <div class="component-example mini-example">
        <article class="month mini">
          <header class="month-header"><h2>January</h2></header>
          <div class="weekdays">
            <div class="weekday">S</div><div class="weekday">M</div><div class="weekday">T</div><div class="weekday">W</div><div class="weekday">T</div><div class="weekday">F</div><div class="weekday">S</div>
          </div>
          <section class="month-grid">
            <div class="week"><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div><div class="day"><div class="date">1</div></div><div class="day"><div class="date">2</div></div><div class="day"><div class="date">3</div></div><div class="day"><div class="date">4</div></div></div>
            <div class="week"><div class="day"><div class="date">5</div></div><div class="day"><div class="date">6</div></div><div class="day"><div class="date">7</div></div><div class="day"><div class="date">8</div></div><div class="day"><div class="date">9</div></div><div class="day"><div class="date">10</div></div><div class="day"><div class="date">11</div></div></div>
            <div class="week"><div class="day"><div class="date">12</div></div><div class="day"><div class="date">13</div></div><div class="day"><div class="date">14</div></div><div class="day"><div class="date">15</div></div><div class="day"><div class="date">16</div></div><div class="day"><div class="date">17</div></div><div class="day"><div class="date">18</div></div></div>
            <div class="week"><div class="day"><svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="black" stroke="black" stroke-width="2"/></svg></div><div class="day"><div class="date">20</div></div><div class="day"><div class="date">21</div></div><div class="day"><div class="date">22</div></div><div class="day"><div class="date">23</div></div><div class="day"><div class="date">24</div></div><div class="day"><div class="date">25</div></div></div>
            <div class="week"><div class="day"><svg class="day-marker-moon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8.5" fill="white" stroke="black" stroke-width="2"/><path d="M10 1.5 A8.5 8.5 0 0 0 10 18.5 Z" fill="black"/></svg></div><div class="day"><div class="date">27</div></div><div class="day"><div class="date">28</div></div><div class="day"><div class="date">29</div></div><div class="day"><div class="date">30</div></div><div class="day"><div class="date">31</div></div><div class="day other-month"></div></div>
            <div class="week"><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div><div class="day other-month"></div></div>
          </section>
        </article>
      </div>

      <div class="component-example-label">.event (with icons)</div>
      <div class="component-example">
        <ul class="day-events event-examples">
          <li class="event">${getIconSvg("school")}Spring Recess (No school)</li>
          <li class="event">${getIconSvg("film")}The Super Mario Galaxy Movie</li>
          <li class="event">${getIconSvg("star")}US Holiday</li>
          <li class="event">${getIconSvg("cake")}Dad&rsquo;s Birthday</li>
          <li class="event">${getIconSvg("dining")}Dinner Reservation</li>
          <li class="event">${getIconSvg("airplane")}Flight to Portland</li>
        </ul>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Feed Icons</h2>
      <div class="icon-grid">
${iconGrid}
      </div>
      <div class="icon-usage">
        <div class="component-example-label">In-context (event list)</div>
        <ul class="day-events event-examples">
${PICKER_ICONS.map(({ id, name }) => `          <li class="event">${getIconSvg(id) ?? ""}${name} event example</li>`).join("\n")}
        </ul>
      </div>
    </section>

    <section class="styleguide-section">
      <h2>Structure</h2>
      <table class="structure-table">
        <thead>
          <tr><th>Element</th><th>Class</th><th>Tag</th><th>Context</th></tr>
        </thead>
        <tbody>
          <tr><td>Year page</td><td><code>.year-view</code></td><td><code>main</code></td><td>Top-level</td></tr>
          <tr><td>Month page</td><td><code>.month-view</code></td><td><code>main</code></td><td>Top-level</td></tr>
          <tr><td>Page header</td><td><code>.view-header</code></td><td><code>header</code></td><td>Inside view</td></tr>
          <tr><td>Page title</td><td><code>.view-title</code></td><td><code>h1</code></td><td>Inside header</td></tr>
          <tr><td>Navigation</td><td><code>.view-nav</code></td><td><code>nav</code></td><td>Inside header</td></tr>
          <tr><td>Year grid</td><td><code>.year-grid</code></td><td><code>section</code></td><td>Inside year-view</td></tr>
          <tr><td>Month</td><td><code>.month</code></td><td><code>article</code></td><td>Reusable</td></tr>
          <tr><td>Mini month</td><td><code>.month.mini</code></td><td><code>a</code></td><td>Month-view nav</td></tr>
          <tr><td>Week row</td><td><code>.week</code></td><td><code>div</code></td><td>Inside month-grid</td></tr>
          <tr><td>Day cell</td><td><code>.day</code></td><td><code>div</code></td><td>Inside week</td></tr>
          <tr><td>Weekday</td><td><code>.weekday</code></td><td><code>div</code></td><td>Inside weekdays</td></tr>
          <tr><td>Day header</td><td><code>.day-header</code></td><td><code>header</code></td><td>Inside day</td></tr>
          <tr><td>Event list</td><td><code>.day-events</code></td><td><code>ul</code></td><td>Inside day</td></tr>
          <tr><td>Event</td><td><code>.event</code></td><td><code>li</code></td><td>Inside day-events</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}
