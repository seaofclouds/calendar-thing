/**
 * Config view renderer.
 * Wraps calendar views with a sidebar for month navigation,
 * paper format, orientation, margin, and feed controls.
 */

import { PAGE_TYPES } from "./config";

const MONTH_ABBRS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const FORMAT_OPTIONS = [
  { value: "letter", label: "Letter" },
  { value: "legal", label: "Legal" },
  { value: "tabloid", label: "Tabloid" },
  { value: "a5", label: "A5" },
  { value: "a4", label: "A4" },
  { value: "a6", label: "A6" },
];

const ORIENTATION_OPTIONS = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

const MARGIN_OPTIONS = [
  { value: "0.25in", label: '1/4"' },
  { value: "0.5in", label: '1/2"' },
  { value: "1in", label: '1"' },
];

const DISPLAY_NAMES: Record<string, string> = {
  letter: "US Letter",
  legal: "US Legal",
  tabloid: "Tabloid",
  a5: "A5",
  a4: "A4",
  a6: "A6",
};

const FEED_OPTIONS = [
  { token: "lunar:phases", label: "Lunar" },
  { token: "solar:season", label: "Solar" },
  { token: "movies", label: "Movies" },
  { token: "busd", label: "School" },
  { token: "astrology", label: "Astrology" },
];

const DEFAULT_INCLUDE = ["lunar:phases", "solar:season"];

export interface ConfigViewOptions {
  year: number;
  month?: number;
  size: string;
  orientation: "portrait" | "landscape";
  margin: string;
  calendarHtml: string;
  includeParam?: string;
}

export function renderConfigView(opts: ConfigViewOptions): string {
  const params = new URLSearchParams();
  params.set("size", opts.size);
  params.set("orientation", opts.orientation);
  params.set("margin", opts.margin);
  if (opts.includeParam) params.set("include", opts.includeParam);
  const queryParams = `?${params.toString()}`;

  // Generate month nav for current year only
  const years = [opts.year];

  const monthNav = years.map((year) => {
    const monthLinks = MONTH_ABBRS.map((abbr, i) => {
      const monthNum = String(i + 1).padStart(2, "0");
      const isActive = year === opts.year && (i + 1) === opts.month;
      const activeClass = isActive ? " active" : "";
      return `            <li><a href="/config/${year}/${monthNum}${queryParams}" class="config-month${activeClass}">${abbr}</a></li>`;
    }).join("\n");

    return `        <section class="config-section">
          <h3 class="config-year"><a href="/config/${year}${queryParams}">${year}</a></h3>
          <ul class="config-months">
${monthLinks}
          </ul>
        </section>`;
  }).join("\n");

  // Format pills
  const formatPills = FORMAT_OPTIONS.map((opt) => {
    const isActive = opt.value === opts.size;
    return `          <button class="config-option${isActive ? " active" : ""}" data-size="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Orientation pills
  const orientationPills = ORIENTATION_OPTIONS.map((opt) => {
    const isActive = opt.value === opts.orientation;
    return `          <button class="config-option${isActive ? " active" : ""}" data-orientation="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Margin pills
  const marginPills = MARGIN_OPTIONS.map((opt) => {
    const isActive = opt.value === opts.margin;
    return `          <button class="config-option${isActive ? " active" : ""}" data-margin="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Feed toggles
  const feedPills = FEED_OPTIONS.map((opt) => {
    const isActive = isFeedActive(opt.token, opts.includeParam);
    return `          <button class="config-option${isActive ? " active" : ""}" data-feed="${opt.token}">${opt.label}</button>`;
  }).join("\n");

  // Status line
  const statusText = getStatusText(opts.size, opts.orientation);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar Config ${opts.year}${opts.month ? ` / ${MONTH_ABBRS[opts.month - 1]}` : ""}</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body>
  <div class="config">
    <aside class="config-sidebar">
      <nav class="config-nav">
${monthNav}
      </nav>

      <section class="config-section">
        <h3 class="config-label">Format</h3>
        <div class="config-options">
${formatPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Orientation</h3>
        <div class="config-options">
${orientationPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Margin</h3>
        <div class="config-options">
${marginPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Feeds</h3>
        <div class="config-options">
${feedPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Resolution</h3>
        <div class="config-options">
          <button class="config-option active" data-dpi="300">300dpi</button>
          <button class="config-option" data-dpi="600">600dpi</button>
        </div>
      </section>

      <section class="config-section config-export">
        <button class="config-button" data-action="save">Save Image</button>
        <button class="config-button" data-action="save-all">Save All Months</button>
      </section>
    </aside>

    <main class="config-content">
      <p class="config-status">${statusText}</p>
      ${opts.calendarHtml}
    </main>
  </div>
</body>
</html>`;
}

function getStatusText(size: string, orientation: string): string {
  const config = PAGE_TYPES[size];
  if (!config) return size;

  const name = DISPLAY_NAMES[size] ?? size;
  const { width, height } = config.dimensions;

  const w = orientation === "landscape" ? height : width;
  const h = orientation === "landscape" ? width : height;

  const formatDim = (d: { value: number; unit: string }) => `${d.value}${d.unit}`;

  return `${name}, ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}, ${formatDim(w)} \u00d7 ${formatDim(h)}`;
}

function isFeedActive(token: string, includeParam?: string): boolean {
  if (includeParam === undefined) {
    return DEFAULT_INCLUDE.includes(token);
  }
  if (!includeParam) return false;
  const tokens = includeParam.split(",");
  if (tokens.includes(token)) return true;
  if (token === "lunar:phases") return tokens.some((t) => t.startsWith("lunar:"));
  if (token === "movies") return tokens.some((t) => t.startsWith("movies"));
  return false;
}
