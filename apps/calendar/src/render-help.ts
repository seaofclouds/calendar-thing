/**
 * Help page renderer.
 * A how-to guide for using the calendar app: viewing, printing, choosing
 * feeds, and — most asked — adding your own calendar (e.g. a class schedule).
 * Self-contained HTML using the shared design tokens, same pattern as
 * render-styleguide.ts.
 */

export function renderHelp(): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Help</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <style>
    .help {
      max-width: 760px;
      margin: 0 auto;
      padding: 2em 1.5em 5em;
      text-align: left;
      line-height: 1.6;
    }
    .help header.help-header {
      margin-bottom: 2.5em;
    }
    .help h1 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-book);
      margin-bottom: 0.2em;
    }
    .help .tagline {
      color: var(--color-muted);
      font-size: var(--font-size-md);
    }
    .help nav.help-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      margin-top: 1.2em;
    }
    .help nav.help-nav a {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      padding: 0.35em 0.9em;
    }
    .help nav.help-nav a:hover {
      border-color: var(--color-text);
    }
    .help section {
      margin-bottom: 2.8em;
    }
    .help h2 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.3em;
      margin-bottom: 0.8em;
    }
    .help h3 {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      margin: 1.4em 0 0.4em;
    }
    .help p, .help li {
      font-size: var(--font-size-md);
    }
    .help ul, .help ol {
      padding-left: 1.3em;
    }
    .help li {
      margin-bottom: 0.4em;
    }
    .help code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.9em;
      background: var(--color-bg-subtle, rgba(0,0,0,0.05));
      border: 1px solid var(--color-border-light);
      border-radius: 4px;
      padding: 0.1em 0.35em;
      white-space: nowrap;
    }
    .help table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
      margin: 0.8em 0;
    }
    .help th, .help td {
      text-align: left;
      padding: 0.5em 0.7em;
      border-bottom: 1px solid var(--color-border-light);
      vertical-align: top;
    }
    .help th {
      font-weight: var(--font-weight-semibold);
      border-bottom: 1px solid var(--color-border);
    }
    .help td code { white-space: nowrap; }
    .help .on { color: var(--color-accent); font-weight: var(--font-weight-medium); }
    .help .off { color: var(--color-muted); }
    .help .callout {
      border-left: 3px solid var(--color-accent);
      padding: 0.2em 0 0.2em 1em;
      margin: 1em 0;
      color: var(--color-text);
    }
    .help .callout strong { font-weight: var(--font-weight-semibold); }
  </style>
</head>
<body>
  <main class="help">
    <header class="help-header">
      <h1>Help</h1>
      <p class="tagline">A little tool for generating moderately print-friendly calendars.</p>
      <nav class="help-nav">
        <a href="/${year}">This year</a>
        <a href="/config/${year}">Customize (Config)</a>
        <a href="/styleguide">Styleguide</a>
      </nav>
    </header>

    <section>
      <h2>What this is</h2>
      <p>
        Enter a year and you get a printable calendar. It can overlay moon phases,
        solstices &amp; equinoxes, zodiac seasons, movie releases, holidays, and
        <strong>any calendar you bring yourself</strong> (like a class or work schedule).
        Everything renders as plain HTML you can print, or export as a high-resolution
        PNG or PDF.
      </p>
    </section>

    <section>
      <h2>Quick start</h2>
      <ol>
        <li>Open <code>/${year}</code> for the whole year, or <code>/${year}/04</code> for a single month.</li>
        <li>Go to <code>/config/${year}</code> to pick a paper size, orientation, and which feeds to show.</li>
        <li>Use the <strong>Save</strong> buttons in Config to export a PNG or PDF, or just print the page.</li>
      </ol>
    </section>

    <section>
      <h2>Adding your own calendar</h2>
      <p>This is the most common request — here are the two situations.</p>

      <h3>You already have a shareable calendar</h3>
      <p>
        If your class schedule lives in Google Calendar, Fastmail, Apple Calendar, or
        anything that can publish an <strong>ICS link</strong>, you can add it directly:
      </p>
      <ol>
        <li>Open <code>/config/${year}</code>.</li>
        <li>In the feeds sidebar, find the <strong>&ldquo;Paste ICS feed URL&hellip;&rdquo;</strong> box and paste the link, then press <strong>+</strong>.</li>
        <li>It appears as a toggleable pill (auto-named from the calendar), and it&rsquo;s remembered on your next visit.</li>
      </ol>
      <p class="callout">
        <strong>Where&rsquo;s the ICS link?</strong> In Google Calendar: <em>Settings → [your calendar] →
        &ldquo;Secret address in iCal format.&rdquo;</em> Recurring weekly events (like classes) are
        supported — the parser expands weekly and yearly repeats automatically.
      </p>
      <p>
        Prefer a URL you can bookmark? Append <code>?feed=</code> to any calendar URL instead:<br>
        <code>/${year}?feed=https://example.com/my-schedule.ics</code> (you can add more than one <code>?feed=</code>).
      </p>

      <h3>You don&rsquo;t have an online calendar &mdash; you just want a printout</h3>
      <p>
        There&rsquo;s no built-in &ldquo;type your events here&rdquo; editor yet, and the feed box needs a
        <em>hosted</em> ICS link (not a file). The least-effort path today:
      </p>
      <ul>
        <li>Create a free calendar (e.g. a new Google Calendar), add your weekly classes as recurring events, then grab its <em>secret ICS address</em> and paste it in Config as above.</li>
        <li>Once it&rsquo;s on the calendar, print or export — no account or sign-in needed to view the printout.</li>
      </ul>
    </section>

    <section>
      <h2>Feeds &amp; the <code>?include=</code> param</h2>
      <p>
        Each built-in feed is toggled with a token. With no <code>?include=</code>, the
        defaults below are shown. <strong>Passing <code>?include=</code> replaces the defaults</strong>,
        so list every feed you want — e.g. <code>?include=lunar:phases,solar:season,movies</code>
        keeps the moons and adds movies. The easiest way to toggle feeds is the Config sidebar.
      </p>
      <table>
        <thead>
          <tr><th>Feed</th><th>Token(s)</th><th>Default</th></tr>
        </thead>
        <tbody>
          <tr><td>Moon phases</td><td><code>lunar:full</code>, <code>lunar:new</code>, <code>lunar:quarter</code> (or <code>lunar:phases</code>)</td><td class="on">on</td></tr>
          <tr><td>Solar events (equinox/solstice)</td><td><code>solar:season</code></td><td class="on">on</td></tr>
          <tr><td>Zodiac seasons</td><td><code>astrology</code></td><td class="on">on</td></tr>
          <tr><td>BUSD school calendar</td><td><code>busd</code></td><td class="on">on</td></tr>
          <tr><td>Movie releases</td><td><code>movies</code> (or <code>movies-theatrical</code>, <code>movies-digital</code>)</td><td class="off">off</td></tr>
          <tr><td>Birthdays</td><td><code>birthdays</code></td><td class="off">off</td></tr>
          <tr><td>US holidays</td><td><code>holidays-us</code></td><td class="off">off</td></tr>
          <tr><td>BHS Cheer schedule</td><td><code>bhs-cheer</code></td><td class="off">off</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>URL cheat-sheet</h2>
      <table>
        <thead><tr><th>URL</th><th>What it shows</th></tr></thead>
        <tbody>
          <tr><td><code>/${year}</code></td><td>Responsive year view (columns adapt to width)</td></tr>
          <tr><td><code>/${year}/04</code></td><td>Single month (April)</td></tr>
          <tr><td><code>/${year}/letter</code></td><td>Print preview at a paper size</td></tr>
          <tr><td><code>/${year}/letter/landscape</code></td><td>Print preview with orientation</td></tr>
          <tr><td><code>/${year}/letter/portrait/300dpi.png</code></td><td>Download a 300&nbsp;dpi PNG</td></tr>
          <tr><td><code>/config/${year}</code></td><td>Customize: size, orientation, feeds, export</td></tr>
          <tr><td><code>/styleguide</code></td><td>Design tokens &amp; icon reference</td></tr>
          <tr><td><code>/help</code></td><td>This page</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Paper sizes</h2>
      <table>
        <thead><tr><th>Name</th><th>Dimensions</th></tr></thead>
        <tbody>
          <tr><td><code>a6</code></td><td>105 &times; 148 mm</td></tr>
          <tr><td><code>a5</code></td><td>148 &times; 210 mm</td></tr>
          <tr><td><code>a4</code></td><td>210 &times; 297 mm</td></tr>
          <tr><td><code>half-letter</code></td><td>5.5 &times; 8.5 in</td></tr>
          <tr><td><code>letter</code></td><td>8.5 &times; 11 in</td></tr>
          <tr><td><code>legal</code></td><td>8.5 &times; 14 in</td></tr>
          <tr><td><code>tabloid</code></td><td>11 &times; 17 in</td></tr>
        </tbody>
      </table>
      <p>Add <code>/portrait</code> or <code>/landscape</code> after the size to set orientation.</p>
    </section>

    <section>
      <h2>Printing &amp; exporting</h2>
      <ul>
        <li><strong>Print:</strong> open a sized view (e.g. <code>/${year}/letter</code>) and use your browser&rsquo;s Print.</li>
        <li><strong>PNG / PDF:</strong> use the <strong>Save</strong> buttons in <code>/config/${year}</code>. PNGs are optimized 8-bit grayscale; PDFs embed pages efficiently for crisp laser printing.</li>
        <li><strong>Direct image link:</strong> append <code>/300dpi.png</code> to a sized URL to download without opening Config.</li>
      </ul>
    </section>

    <section>
      <h2>Subscribing to feeds</h2>
      <p>
        The built-in feeds are also live ICS calendars you can subscribe to in any
        calendar app (they require the calendar token):
      </p>
      <ul>
        <li><code>/feeds/astronomy.ics?token=&hellip;</code> &mdash; moon phases + solar events</li>
        <li><code>/feeds/astrology.ics?token=&hellip;</code> &mdash; zodiac seasons</li>
        <li><code>/feeds/movies-theatrical.ics?token=&hellip;</code> / <code>/feeds/movies-digital.ics?token=&hellip;</code></li>
        <li><code>/feeds/busd.ics?token=&hellip;</code>, <code>/feeds/holidays-us.ics?token=&hellip;</code>, <code>/feeds/bhs-cheer.ics?token=&hellip;</code></li>
      </ul>
    </section>
  </main>
</body>
</html>`;
}
