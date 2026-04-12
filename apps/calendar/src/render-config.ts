/**
 * Config view renderer.
 * Sidebar for calendar layout, paper format, feeds, and export controls.
 * Right side is a scrollable preview of all calendar months.
 */

import { PAGE_TYPES } from "./config";

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

const LAYOUT_OPTIONS = [
  { value: "calendar", label: "Calendar" },
  { value: "photo-calendar", label: "Calendar + Photos" },
];

const LENGTH_OPTIONS = [
  { value: "12", label: "12mo" },
  { value: "14", label: "14mo" },
  { value: "16", label: "16mo" },
];

const SCALING_OPTIONS = [
  { value: "fit", label: "Fit" },
  { value: "crop", label: "Crop" },
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

export interface MonthFragment {
  year: number;
  month: number; // 1-12
  html: string;
}

export interface ConfigViewOptions {
  year: number;
  scrollToMonth?: number; // 1-12, initial scroll target
  size: string;
  orientation: "portrait" | "landscape";
  margin: string;
  monthFragments: MonthFragment[];
  includeParam?: string;
  calendarLength: number; // 12, 14, or 16
  layout: "calendar" | "photo-calendar";
  scaling: "fit" | "crop";
}

export function renderConfigView(opts: ConfigViewOptions): string {
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

  // Layout toggle
  const layoutPills = LAYOUT_OPTIONS.map((opt) => {
    const isActive = opt.value === opts.layout;
    return `          <button class="config-option${isActive ? " active" : ""}" data-layout="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Calendar length
  const lengthPills = LENGTH_OPTIONS.map((opt) => {
    const isActive = opt.value === String(opts.calendarLength);
    return `          <button class="config-option${isActive ? " active" : ""}" data-length="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Image scaling (only visible when photo-calendar layout)
  const scalingPills = SCALING_OPTIONS.map((opt) => {
    const isActive = opt.value === opts.scaling;
    return `          <button class="config-option${isActive ? " active" : ""}" data-scaling="${opt.value}">${opt.label}</button>`;
  }).join("\n");

  // Feed toggles
  const feedPills = FEED_OPTIONS.map((opt) => {
    const isActive = isFeedActive(opt.token, opts.includeParam);
    return `          <button class="config-option${isActive ? " active" : ""}" data-feed="${opt.token}">${opt.label}</button>`;
  }).join("\n");

  // Status line
  const statusText = getStatusText(opts.size, opts.orientation);

  // Scaling section visibility
  const scalingDisplay = opts.layout === "photo-calendar" ? "" : ' style="display:none"';

  // Render scrollable month list
  const monthCards = opts.monthFragments.map((frag) => {
    // Merge "page" class into existing class attribute (avoid duplicate class attrs)
    const pageHtml = frag.html.replace('id="root" class="', 'class="page ');
    return `      <div class="scroll-month" data-year="${frag.year}" data-month="${frag.month}">
        ${pageHtml}
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
  <div class="config" data-year="${opts.year}" data-layout="${opts.layout}" data-scaling="${opts.scaling}" data-length="${opts.calendarLength}">
    <aside class="config-sidebar">
      <section class="config-section">
        <h3 class="config-label">Layout</h3>
        <div class="config-options">
${layoutPills}
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
        <h3 class="config-label">Export Resolution</h3>
        <div class="config-options">
          <button class="config-option active" data-dpi="300">300dpi</button>
          <button class="config-option" data-dpi="600">600dpi</button>
        </div>
      </section>

      <section class="config-section config-export">
        <button class="config-button" data-action="save">Save Image</button>
        <button class="config-button" data-action="save-all">Save All Months</button>
        <button class="config-button" data-action="save-pdf">Save PDF for Print</button>
      </section>
    </aside>

    <main class="config-content"${scrollData}>
      <p class="config-status">${statusText}</p>
      <div class="config-scroll">
${monthCards}
      </div>
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
