/**
 * Config view renderer.
 * Sidebar for calendar layout, paper format, feeds, and export controls.
 * Right side is a scrollable preview of all calendar months.
 */

import { PAGE_TYPES } from "./page-config";
import { MONTH_NAMES } from "./render-utils";

/** Render a row of config pill buttons */
function renderPills(
  items: { value: string; label: string }[],
  dataAttr: string,
  isActive: (value: string) => boolean,
): string {
  return items.map((item) => {
    const active = isActive(item.value) ? " active" : "";
    return `          <button class="config-option${active}" data-${dataAttr}="${item.value}">${item.label}</button>`;
  }).join("\n");
}

/** SVG rectangle at paper aspect ratio, used as format icon */
function formatIcon(widthVal: number, heightVal: number, orientation: string): string {
  const w = orientation === "landscape" ? heightVal : widthVal;
  const h = orientation === "landscape" ? widthVal : heightVal;
  // Normalize to fit in a 16x16 viewBox
  const scale = 14 / Math.max(w, h);
  const rw = Math.round(w * scale * 10) / 10;
  const rh = Math.round(h * scale * 10) / 10;
  const rx = Math.round((16 - rw) / 2 * 10) / 10;
  const ry = Math.round((16 - rh) / 2 * 10) / 10;
  return `<svg class="format-icon" viewBox="0 0 16 16" width="16" height="16"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="0.5" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`;
}

/** SVG orientation icon — tall or wide rectangle */
function orientationIcon(type: "portrait" | "landscape"): string {
  if (type === "portrait") {
    return `<svg class="orientation-icon" viewBox="0 0 16 16" width="16" height="16"><rect x="4" y="1" width="8" height="14" rx="0.5" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`;
  }
  return `<svg class="orientation-icon" viewBox="0 0 16 16" width="16" height="16"><rect x="1" y="4" width="14" height="8" rx="0.5" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`;
}

const FORMAT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  letter: { w: 8.5, h: 11 },
  legal: { w: 8.5, h: 14 },
  tabloid: { w: 11, h: 17 },
  a5: { w: 148, h: 210 },
  a4: { w: 210, h: 297 },
  a6: { w: 105, h: 148 },
  "5x7": { w: 5, h: 7 },
  "4x6": { w: 4, h: 6 },
};

const METRIC_SIZES = new Set(["a6", "a5", "a4"]);

const MARGIN_OPTIONS_IMPERIAL = [
  { value: "0.125in", label: '1/8"' },
  { value: "0.25in", label: '1/4"' },
  { value: "0.5in", label: '1/2"' },
  { value: "1in", label: '1"' },
];

const MARGIN_OPTIONS_METRIC = [
  { value: "0.125in", label: '1/8"' },
  { value: "0.25in", label: '1/4"' },
  { value: "0.5in", label: '1/2"' },
  { value: "1in", label: '1"' },
  { value: "5mm", label: "5mm" },
  { value: "10mm", label: "10mm" },
];

const SCALING_OPTIONS = [
  { value: "fit", label: "Fit" },
  { value: "crop", label: "Crop" },
];

const GUTTER_OPTIONS = [
  { value: "0", label: "None" },
  { value: "0.5in", label: '1/2"' },
  { value: "0.75in", label: '3/4"' },
  { value: "1in", label: '1"' },
];

const DISPLAY_NAMES: Record<string, string> = {
  letter: "US Letter",
  legal: "US Legal",
  tabloid: "Tabloid",
  a5: "A5",
  a4: "A4",
  a6: "A6",
  "5x7": "5x7",
  "4x6": "4x6",
};

const FEED_OPTIONS = [
  { token: "lunar:phases", label: "Lunar" },
  { token: "solar:season", label: "Solar" },
  { token: "movies", label: "Movies" },
  { token: "holidays-us", label: "Holidays" },
  { token: "busd", label: "School" },
  { token: "astrology", label: "Astrology" },
  { token: "birthdays", label: "Birthdays" },
];

const DEFAULT_INCLUDE = ["lunar:phases", "solar:season", "holidays-us", "busd", "astrology"];

export interface MonthFragment {
  year: number;
  month: number; // 1-12
  html: string;
}

export interface ConfigViewOptions {
  year: number;
  scrollToMonth?: number;
  size: string;
  orientation: "portrait" | "landscape";
  margin: string;
  monthFragments: MonthFragment[];
  includeParam?: string;
  calendarLength: number;
  layout: "single" | "facing-photo" | "facing-month";
  scaling: "fit" | "crop";
  gutter: string;
}

export function renderConfigView(opts: ConfigViewOptions): string {
  const isFacing = opts.layout !== "single";
  const isPhoto = opts.layout === "facing-photo";

  // Format pills with SVG icons
  const formatEntries = Object.entries(FORMAT_DIMENSIONS);
  const formatPills = formatEntries.map(([value, dims]) => {
    const label = DISPLAY_NAMES[value] ?? value;
    const isActive = value === opts.size;
    const icon = formatIcon(dims.w, dims.h, opts.orientation);
    return `          <button class="config-option${isActive ? " active" : ""}" data-size="${value}">${icon} ${label}</button>`;
  }).join("\n");

  // Orientation pills with SVG icons
  const orientationPills = (["portrait", "landscape"] as const).map((o) => {
    const isActive = o === opts.orientation;
    const icon = orientationIcon(o);
    const label = o.charAt(0).toUpperCase() + o.slice(1);
    return `          <button class="config-option${isActive ? " active" : ""}" data-orientation="${o}">${icon} ${label}</button>`;
  }).join("\n");

  // Margin pills — filter out margins that leave < 2.5in content width
  const marginOptions = METRIC_SIZES.has(opts.size) ? MARGIN_OPTIONS_METRIC : MARGIN_OPTIONS_IMPERIAL;
  const pageDims = FORMAT_DIMENSIONS[opts.size];
  const pageWidthIn = pageDims
    ? (pageDims.w > 50 ? pageDims.w / 25.4 : pageDims.w) // mm → in if > 50
    : 8.5;
  const effectiveWidth = opts.orientation === "landscape"
    ? (pageDims && pageDims.h > 50 ? pageDims.h / 25.4 : pageDims?.h ?? 11)
    : pageWidthIn;
  const minContentWidth = 2.5; // inches

  const filteredMargins = marginOptions.filter((opt) => {
    const mVal = opt.value.endsWith("mm")
      ? parseFloat(opt.value) / 25.4
      : parseFloat(opt.value);
    return effectiveWidth - 2 * mVal >= minContentWidth;
  });
  const marginPills = renderPills(filteredMargins, "margin", (v) => v === opts.margin);

  // Layout top-level: Single Sheets / Facing Pages
  const singleActive = opts.layout === "single" ? " active" : "";
  const facingActive = isFacing ? " active" : "";

  // Facing sub-toggle: Photo + Month / Month + Month
  // Default to Month + Month when in single mode (so it's pre-selected when user clicks Facing Pages)
  const photoActive = opts.layout === "facing-photo" ? " active" : "";
  const monthActive = (opts.layout === "facing-month" || opts.layout === "single") ? " active" : "";
  const facingSubDisplay = isFacing ? "" : ' style="display:none"';

  // Image scaling (only when Photo + Month)
  const scalingPills = renderPills(SCALING_OPTIONS, "scaling", (v) => v === opts.scaling);
  const scalingDisplay = isPhoto ? "" : ' style="display:none"';

  // Gutter pills (only when facing pages)
  const gutterPills = renderPills(GUTTER_OPTIONS, "gutter", (v) => v === opts.gutter);
  const gutterDisplay = isFacing ? "" : ' style="display:none"';

  // Calendar length
  const lengthItems = ["12", "14", "16"].map((v) => ({ value: v, label: `${v}mo` }));
  const lengthPills = renderPills(lengthItems, "length", (v) => v === String(opts.calendarLength));

  // Feed toggles
  const feedItems = FEED_OPTIONS.map((opt) => ({ value: opt.token, label: opt.label }));
  const feedPills = renderPills(feedItems, "feed", (v) => isFeedActive(v, opts.includeParam));

  // Initial month name for export button
  const firstMonth = opts.monthFragments[0];
  const exportMonthName = firstMonth
    ? MONTH_NAMES[(firstMonth.month - 1) % 12]
    : "Month";

  // Render scrollable month list
  const monthCards = opts.monthFragments.map((frag) => {
    return `      <div class="scroll-month" data-year="${frag.year}" data-month="${frag.month}">
        ${frag.html}
      </div>`;
  }).join("\n");

  const scrollData = opts.scrollToMonth
    ? ` data-scroll-to="${opts.scrollToMonth}"`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar ${opts.year}</title>
  <link rel="stylesheet" href="/base.css">
  <link rel="stylesheet" href="/styles.css">
  <script src="/client.js" type="module" defer></script>
</head>
<body>
  <div class="config" data-year="${opts.year}" data-layout="${opts.layout}" data-scaling="${opts.scaling}" data-length="${opts.calendarLength}" data-gutter="${opts.gutter}">
    <aside class="config-sidebar">
      <section class="config-section">
        <h3 class="config-label">Feeds</h3>
        <div class="config-options config-options-feeds">
${feedPills}
        </div>
      </section>

      <section class="config-section config-my-feeds">
        <h3 class="config-label">My Feeds</h3>
        <div class="my-feeds-list"></div>
        <div class="my-feed-add">
          <input type="url" class="my-feed-input" placeholder="Paste ICS feed URL...">
          <button class="my-feed-add-btn" title="Add feed">+</button>
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Format</h3>
        <div class="config-options config-options-format">
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
        <h3 class="config-label">Layout</h3>
        <div class="config-options">
          <button class="config-option${singleActive}" data-layout="single">Single Sheets</button>
          <button class="config-option${facingActive}" data-layout="facing">Facing Pages</button>
        </div>
      </section>

      <section class="config-section config-facing-sub"${facingSubDisplay}>
        <div class="config-options">
          <button class="config-option${photoActive}" data-facing="facing-photo">Photo + Month</button>
          <button class="config-option${monthActive}" data-facing="facing-month">Month + Month</button>
        </div>
      </section>

      <section class="config-section config-scaling"${scalingDisplay}>
        <h3 class="config-label">Image Scaling</h3>
        <div class="config-options">
${scalingPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Length</h3>
        <div class="config-options">
${lengthPills}
        </div>
      </section>

      <section class="config-section">
        <h3 class="config-label">Margin</h3>
        <div class="config-options">
${marginPills}
        </div>
      </section>

      <section class="config-section config-gutter"${gutterDisplay}>
        <h3 class="config-label">Gutter</h3>
        <div class="config-options">
${gutterPills}
        </div>
      </section>

      <section class="config-section config-export">
        <h3 class="config-label">Export</h3>
        <div class="config-options">
          <button class="config-option" data-dpi="300">300dpi</button>
          <button class="config-option active" data-dpi="600">600dpi</button>
        </div>
        <button class="config-button" data-action="save">Export ${exportMonthName}.png</button>
        <button class="config-button" data-action="save-pdf">Export Calendar.pdf</button>
        <p class="config-status"></p>
      </section>
    </aside>

    <main class="config-content"${scrollData}>
      <div class="config-scroll">
${monthCards}
      </div>
    </main>
  </div>
</body>
</html>`;
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
