/**
 * Client-side JS for the calendar app.
 * Handles responsive column layout, config sidebar, image upload,
 * and image/PDF export.
 * Built by esbuild into public/client.js.
 */

import {
  storeImage,
  loadImageUrl,
  listImages,
} from "./store-images";

/** Serialize URL search params without over-encoding safe chars like : and , */
function serializeParams(params: URLSearchParams): string {
  const parts: string[] = [];
  params.forEach((v, k) => parts.push(`${k}=${v}`));
  return parts.join("&");
}

/** Build full href from URL using our clean serializer */
function buildHref(url: URL): string {
  const qs = serializeParams(url.searchParams);
  return url.origin + url.pathname + (qs ? `?${qs}` : "");
}

// ─── Responsive columns (year view) ────────────────────────────────

function updateColumns() {
  const calendar = document.querySelector(".year-view") as HTMLElement | null;
  if (!calendar || calendar.classList.contains("print")) return;

  const w = window.innerWidth;
  const cols = w < 600 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4;
  calendar.style.setProperty("--print-columns", String(cols));
}

window.addEventListener("resize", updateColumns);
updateColumns();

// ─── URL-triggered image export ────────────────────────────────────

async function maybeExportImage() {
  const calendar = document.querySelector(
    ".year-view[data-format], .month-view[data-format]",
  ) as HTMLElement | null;
  if (!calendar) return;

  const format = calendar.dataset.format as "png" | "jpg";
  const dpi = parseInt(calendar.dataset.dpi || "300");
  const year = calendar.dataset.year || "";
  const size = calendar.dataset.size || "";
  const orientation = calendar.dataset.orientation || "";

  const pixelRatio = dpi / 96;
  const opts = {
    quality: format === "png" ? 1.0 : 0.95,
    pixelRatio,
    backgroundColor: "#FFFFFF",
  };

  try {
    const { toPng, toJpeg } = await import("html-to-image");
    const fn = format === "png" ? toPng : toJpeg;
    const dataUrl = await fn(calendar, opts);

    const link = document.createElement("a");
    link.download = `calendar--${year}--${size}--${orientation}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Image export failed:", err);
  }
}

if (document.querySelector("[data-format]")) {
  setTimeout(maybeExportImage, 2000);
}

// ─── Layout management ─────────────────────────────────────────────

/** Remove any spread elements and restore pages to their scroll-months */
function clearSpreads() {
  document.querySelectorAll(".spread-pair").forEach((pair) => {
    const parent = pair.parentElement!;

    // Restore all pages from the pair back to their scroll-months
    const pages = pair.querySelectorAll(".page");
    pages.forEach((p) => {
      const pg = p as HTMLElement;
      pg.style.transform = "";
      pg.style.marginBottom = "";
      pg.style.marginRight = "";
      pg.classList.remove("month-facing", "narrow-content");

      // Find the scroll-month this page belongs to (by data-month match)
      const monthView = pg.querySelector(".month-view");
      const monthAttr = parent.dataset.month;
      // If the page was moved from another scroll-month, find it
      const allScrollMonths = document.querySelectorAll(".scroll-month");
      for (const sm of allScrollMonths) {
        if (sm.querySelector(".page") === null && sm.style.display === "none") {
          // This is a hidden scroll-month that lost its page
          sm.style.display = "";
          sm.appendChild(pg);
          return;
        }
      }
      // Otherwise put it back in the current parent
      parent.appendChild(pg);
    });

    pair.remove();
  });
  document.querySelectorAll(".spread-image").forEach((el) => el.remove());
  document.querySelectorAll(".spread-gutter").forEach((el) => el.remove());
}

/** Apply a layout mode: single, facing-photo, or facing-month */
function applyLayout(config: HTMLElement, layout: string) {
  // Save current scroll position before rebuilding
  saveVisibleMonth();

  const url = new URL(window.location.href);
  url.searchParams.set("layout", layout);
  history.replaceState(null, "", buildHref(url));
  config.dataset.layout = layout;

  // Show/hide scaling and gutter sections
  const scalingSection = document.querySelector(".config-scaling") as HTMLElement | null;
  if (scalingSection) {
    scalingSection.style.display = layout === "facing-photo" ? "" : "none";
  }
  const gutterSection = document.querySelector(".config-gutter") as HTMLElement | null;
  if (gutterSection) {
    gutterSection.style.display = (layout === "facing-photo" || layout === "facing-month") ? "" : "none";
  }

  // Disable 14mo for month+month (odd target-year pairing)
  const len14btn = document.querySelector('[data-length="14"]') as HTMLElement | null;
  if (len14btn) {
    if (layout === "facing-month") {
      len14btn.classList.add("disabled");
      len14btn.setAttribute("aria-disabled", "true");
      // If currently 14mo, switch to 16mo
      if (getConfigParams().length === "14") {
        const url = new URL(window.location.href);
        url.searchParams.set("length", "16");
        saveVisibleMonth();
        window.location.href = buildHref(url);
      }
    } else {
      len14btn.classList.remove("disabled");
      len14btn.removeAttribute("aria-disabled");
    }
  }

  // Clear existing spreads first
  clearSpreads();

  const afterLayout = () => {
    scalePages();
    requestAnimationFrame(() => restoreScrollPosition());
  };

  if (layout === "facing-photo") {
    initSpreadLayout().then(afterLayout);
  } else if (layout === "facing-month") {
    initMonthSpreadLayout().then(afterLayout);
  } else {
    afterLayout();
  }
}

// ─── Config sidebar ────────────────────────────────────────────────

function initConfigSidebar() {
  const sidebar = document.querySelector(".config-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("config-option")) {
      // Layout top-level toggle: Single Sheets / Facing Pages
      if (target.dataset.layout) {
        const isFacing = target.dataset.layout === "facing";
        const config = document.querySelector(".config") as HTMLElement;

        // Toggle active pill
        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        // Show/hide facing sub-toggle
        const facingSub = document.querySelector(".config-facing-sub") as HTMLElement | null;
        if (facingSub) facingSub.style.display = isFacing ? "" : "none";

        if (isFacing) {
          // Determine which facing mode is active (default to photo)
          const activeFacing = facingSub?.querySelector(".config-option.active") as HTMLElement | null;
          const facingMode = activeFacing?.dataset.facing ?? "facing-month";
          applyLayout(config, facingMode);
        } else {
          applyLayout(config, "single");
        }

        return;
      }

      // Facing sub-toggle: Photo + Month / Month + Month
      // Reload required — DOM state after month-pairing can't be cleanly
      // converted to photo-spreading (or vice versa)
      if (target.dataset.facing) {
        saveVisibleMonth();
        const url = new URL(window.location.href);
        url.searchParams.set("layout", target.dataset.facing);
        window.location.href = buildHref(url);
        return;
      }

      // Scaling toggle — client-side only, no reload
      if (target.dataset.scaling) {
        const url = new URL(window.location.href);
        url.searchParams.set("scaling", target.dataset.scaling);
        history.replaceState(null, "", url.toString());

        // Toggle active pill
        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        // Update data attribute
        const config = document.querySelector(".config") as HTMLElement;
        config.dataset.scaling = target.dataset.scaling;

        // Update all spread-image scaling classes
        document.querySelectorAll(".spread-image:not(.empty)").forEach((el) => {
          el.classList.remove("scaling-fit", "scaling-crop");
          el.classList.add(`scaling-${target.dataset.scaling}`);
        });
        return;
      }

      // URL-reloading options: size, orientation, margin, length
      if (
        target.dataset.size ||
        target.dataset.orientation ||
        target.dataset.margin !== undefined ||
        target.dataset.length
      ) {
        // Save current visible month before navigating
        saveVisibleMonth();

        const url = new URL(window.location.href);
        if (target.dataset.size) url.searchParams.set("size", target.dataset.size);
        if (target.dataset.orientation) url.searchParams.set("orientation", target.dataset.orientation);
        if (target.dataset.margin !== undefined) url.searchParams.set("margin", target.dataset.margin);
        if (target.dataset.length) url.searchParams.set("length", target.dataset.length);
        window.location.href = buildHref(url);
        return;
      }

      // Gutter toggle — client-side only
      if (target.dataset.gutter !== undefined) {
        const url = new URL(window.location.href);
        url.searchParams.set("gutter", target.dataset.gutter);
        history.replaceState(null, "", buildHref(url));

        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        const config = document.querySelector(".config") as HTMLElement;
        config.dataset.gutter = target.dataset.gutter;
        scalePages();
        return;
      }

      // DPI pills — client-side toggle only
      if (target.dataset.dpi) {
        sidebar.querySelectorAll("[data-dpi]").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");
        return;
      }

      // Feed toggles — update include param and reload
      if (target.dataset.feed) {
        saveVisibleMonth();

        const url = new URL(window.location.href);
        const includeParam = url.searchParams.get("include");
        const defaults = ["lunar:phases", "solar:season"];
        let tokens: string[];
        if (includeParam !== null) {
          tokens = includeParam ? includeParam.split(",") : [];
        } else {
          tokens = [...defaults];
        }

        const feed = target.dataset.feed;
        const isActive =
          tokens.includes(feed) ||
          (feed === "lunar:phases" && tokens.some((t) => t.startsWith("lunar:"))) ||
          (feed === "movies" && tokens.some((t) => t.startsWith("movies")));

        if (isActive) {
          if (feed === "lunar:phases") {
            tokens = tokens.filter((t) => !t.startsWith("lunar:"));
          } else if (feed === "movies") {
            tokens = tokens.filter((t) => !t.startsWith("movies"));
          } else {
            tokens = tokens.filter((t) => t !== feed);
          }
        } else {
          tokens.push(feed);
        }

        if (tokens.length) {
          url.searchParams.set("include", tokens.join(","));
        } else {
          url.searchParams.set("include", "");
        }
        window.location.href = buildHref(url);
        return;
      }
    }

    // Export buttons
    if (target.classList.contains("config-button")) {
      if (target.dataset.action === "save") exportCurrentView();
      if (target.dataset.action === "save-all") exportAllMonths();
      if (target.dataset.action === "save-pdf") exportPDF();
    }
  });
}

// ─── Config helpers ────────────────────────────────────────────────

function getActiveDpi(): number {
  const active = document.querySelector(
    ".config-option[data-dpi].active",
  ) as HTMLElement | null;
  return parseInt(active?.dataset.dpi ?? "300");
}

function getConfigParams() {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/\/config\/(\d+)/);
  return {
    year: match?.[1] ?? String(new Date().getFullYear()),
    size: url.searchParams.get("size") ?? "letter",
    orientation: url.searchParams.get("orientation") ?? "landscape",
    include: url.searchParams.get("include") ?? "",
    margin: url.searchParams.get("margin") ?? "0.25in",
    layout: url.searchParams.get("layout") ?? "calendar",
    length: url.searchParams.get("length") ?? "12",
    scaling: url.searchParams.get("scaling") ?? "fit",
    gutter: url.searchParams.get("gutter") ?? "0.5in",
  };
}

// ─── Scroll position preservation ──────────────────────────────────

/** Save the currently visible month to sessionStorage so config changes don't lose position */
function saveVisibleMonth() {
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  if (!scroll) return;

  // Use getBoundingClientRect for reliable position detection
  const scrollRect = scroll.getBoundingClientRect();
  const months = scroll.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;

  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  for (const m of months) {
    const rect = m.getBoundingClientRect();
    const dist = Math.abs(rect.top - scrollRect.top);
    if (dist < bestDist) {
      bestDist = dist;
      best = m;
    }
  }

  if (best) {
    const key = `${best.dataset.year}-${best.dataset.month}`;
    sessionStorage.setItem("config-scroll-month", key);
  }
}

/** Scroll to a specific month, or restore from sessionStorage */
function restoreScrollPosition() {
  const content = document.querySelector(".config-content") as HTMLElement | null;
  const scroll = document.querySelector(".config-scroll") as HTMLElement | null;
  if (!content || !scroll) return;

  // Priority: data-scroll-to (from URL), then sessionStorage
  let targetYear: string | null = null;
  let targetMonth: string | null = null;

  const scrollTo = content.dataset.scrollTo;
  if (scrollTo) {
    const params = getConfigParams();
    targetYear = params.year;
    targetMonth = scrollTo;
  } else {
    const saved = sessionStorage.getItem("config-scroll-month");
    if (saved) {
      const [y, m] = saved.split("-");
      targetYear = y;
      targetMonth = m;
      sessionStorage.removeItem("config-scroll-month");
    }
  }

  if (targetYear && targetMonth) {
    const target = scroll.querySelector(
      `.scroll-month[data-year="${targetYear}"][data-month="${targetMonth}"]`,
    ) as HTMLElement | null;
    if (target) {
      // Scroll immediately without animation
      requestAnimationFrame(() => {
        target.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
      });
      return;
    }
  }

  // Default: scroll to first month of the target year
  const params = getConfigParams();
  const firstMonth = scroll.querySelector(
    `.scroll-month[data-year="${params.year}"][data-month="1"]`,
  ) as HTMLElement | null;
  if (firstMonth) {
    requestAnimationFrame(() => {
      firstMonth.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
    });
  }
}

// ─── Page scaling ──────────────────────────────────────────────────

/**
 * Scale .page elements to fit within the viewport, maintaining paper proportions.
 * Uses transform: scale() (preserves correct PDF export) with negative margins
 * to collapse the unused layout space so elements sit adjacent.
 */
function scalePages() {
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  if (!scroll) return;

  const scrollWidth = scroll.clientWidth;
  const scrollHeight = scroll.clientHeight;
  const padding = 24;
  const availableWidth = scrollWidth - padding * 2;
  const margin = getConfigParams().margin;

  const scrollMonths = scroll.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;

  for (const scrollMonth of scrollMonths) {
    // Find the ORIGINAL page (not a facing clone)
    const page = scrollMonth.querySelector(".page:not(.month-facing)") as HTMLElement | null;
    if (!page) continue;

    const spreadImage = scrollMonth.querySelector(".spread-image") as HTMLElement | null;
    const monthFacing = scrollMonth.querySelector(".page.month-facing") as HTMLElement | null;
    const facingEl = spreadImage || monthFacing;
    const hasFacing = facingEl !== null;

    // Reset transforms and margins
    page.style.transform = "";
    page.style.marginBottom = "";
    if (facingEl) {
      facingEl.style.transform = "";
      facingEl.style.marginBottom = "";
    }

    const pageWidth = page.offsetWidth;
    const pageHeight = page.offsetHeight;
    if (pageWidth <= 0 || pageHeight <= 0) continue;

    if (hasFacing && facingEl) {
      if (spreadImage) {
        // Photo facing: needs explicit dimensions + padding for margins
        facingEl.style.width = `${pageWidth}px`;
        facingEl.style.height = `${pageHeight}px`;
        facingEl.style.padding = margin;
        facingEl.style.boxSizing = "border-box";
      }
      // Month-facing pages already have correct CSS dimensions from .page.size-* classes

      // Parse gutter to estimate pixel height for scale calculation
      const gutterVal = getConfigParams().gutter;
      let gutterPx = 0;
      if (gutterVal !== "0") {
        if (gutterVal.endsWith("in")) gutterPx = parseFloat(gutterVal) * 96;
        else if (gutterVal.endsWith("mm")) gutterPx = parseFloat(gutterVal) * 96 / 25.4;
      }

      // Both pages at natural height + gutter between them
      const totalNaturalH = pageHeight * 2 + gutterPx;
      const maxContentH = scrollHeight - 80;
      const scale = Math.min(1, availableWidth / pageWidth, maxContentH / totalNaturalH);
      const unusedH = Math.max(0, pageHeight * (1 - scale));

      facingEl.style.transform = `scale(${scale})`;
      facingEl.style.marginBottom = `${-unusedH}px`;
      facingEl.style.marginRight = `${-(pageWidth * (1 - scale))}px`;

      page.style.transform = `scale(${scale})`;
      page.style.marginBottom = `${-unusedH}px`;
      page.style.marginRight = `${-(pageWidth * (1 - scale))}px`;

      // Constrain spread-pair width and add gutter
      const pair = scrollMonth.querySelector(".spread-pair") as HTMLElement | null;
      if (pair) {
        pair.style.width = `${pageWidth * scale}px`;

        // Insert or update gutter strip between the two pages
        const gutter = getConfigParams().gutter;
        let gutterEl = pair.querySelector(".spread-gutter") as HTMLElement | null;
        if (gutter !== "0") {
          if (!gutterEl) {
            gutterEl = document.createElement("div");
            gutterEl.className = "spread-gutter";
            // Insert before the second child (between the two pages)
            const secondChild = pair.children[1];
            pair.insertBefore(gutterEl, secondChild);
          }
          gutterEl.style.height = gutter;
        } else if (gutterEl) {
          gutterEl.remove();
        }
      }
    } else {
      // Calendar-only mode: no gutter
      const maxContentH = scrollHeight - 80;
      const scale = Math.min(1, availableWidth / pageWidth, maxContentH / pageHeight);
      const unusedSpace = Math.max(0, pageHeight * (1 - scale));

      page.style.transform = `scale(${scale})`;
      page.style.marginBottom = `${-unusedSpace}px`;
      page.style.marginRight = `${-(pageWidth * (1 - scale))}px`;
    }

    // Dynamic mini cal width: if content area is narrow, use wider mini cal columns
    const marginVal = parseFloat(margin);
    const marginUnit = margin.replace(/[\d.]/g, "");
    const marginPx = marginUnit === "mm" ? marginVal * 96 / 25.4 : marginVal * 96;
    const contentWidth = pageWidth - 2 * marginPx;
    page.classList.toggle("narrow-content", contentWidth < 480);

    // Also apply to facing clone if present
    const facingClone = scrollMonth.querySelector(".page.month-facing") as HTMLElement | null;
    if (facingClone) facingClone.classList.toggle("narrow-content", contentWidth < 480);
  }
}

let resizeTimer: ReturnType<typeof setTimeout>;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scalePages();
  }, 100);
}

// ─── Image upload for spread layout ────────────────────────────────

/** Hidden file input, reused for all image slots */
let fileInput: HTMLInputElement | null = null;
let pendingSlot: { year: number; month: string } | null = null;

function getFileInput(): HTMLInputElement {
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    fileInput.addEventListener("change", async () => {
      if (!fileInput?.files?.[0] || !pendingSlot) return;
      const file = fileInput.files[0];
      const { year, month } = pendingSlot;
      pendingSlot = null;

      await storeImage(year, month, file);
      await refreshSpreadImage(year, month);
      fileInput.value = "";
    });
  }
  return fileInput;
}

function triggerImageUpload(year: number, month: string) {
  pendingSlot = { year, month };
  getFileInput().click();
}

/** SVG icons for fit/crop toggle */
const ICON_FIT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="12" height="8" rx="1"/><rect x="4" y="5.5" width="8" height="5" rx="0.5" stroke-dasharray="2 1"/></svg>`;
const ICON_CROP = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="12" height="8" rx="1"/><line x1="2" y1="4" x2="14" y2="12"/><line x1="14" y1="4" x2="2" y2="12"/></svg>`;

function buildImageContent(url: string, scaling: string): string {
  const isCrop = scaling === "crop";
  const nextMode = isCrop ? "fit" : "crop";
  const icon = isCrop ? ICON_FIT : ICON_CROP;
  const title = isCrop ? "Switch to Fit" : "Switch to Crop";
  return `<img src="${url}"><button class="spread-scaling-toggle" data-next-scaling="${nextMode}" title="${title}">${icon}</button>`;
}

async function refreshSpreadImage(year: number, month: string) {
  const container = document.querySelector(
    `.scroll-month[data-year="${year}"][data-month="${month}"] .spread-image`,
  ) as HTMLElement | null;
  if (!container) return;

  const url = await loadImageUrl(year, month);
  if (url) {
    const scaling = getConfigParams().scaling;
    container.classList.remove("empty");
    container.classList.remove("scaling-fit", "scaling-crop");
    container.classList.add(`scaling-${scaling}`);
    container.innerHTML = buildImageContent(url, scaling);
  } else {
    container.classList.add("empty");
    container.classList.remove("scaling-fit", "scaling-crop");
    container.innerHTML = `<button class="spread-add-btn">+ Add Image</button>`;
  }
}

/** Inject spread image containers above each calendar month when in photo-calendar layout */
async function initSpreadLayout() {
  const config = document.querySelector(".config") as HTMLElement | null;
  if (!config || config.dataset.layout !== "facing-photo") return;

  const scrollMonths = document.querySelectorAll(".scroll-month");
  const scaling = getConfigParams().scaling;

  // Collect all years referenced by the scroll months
  const yearsInView = new Set<number>();
  for (const el of scrollMonths) {
    yearsInView.add(parseInt(el.getAttribute("data-year") ?? "0"));
  }

  // Build a set of all slots that have images across relevant years
  const imageSet = new Set<string>();
  for (const y of yearsInView) {
    if (!y) continue;
    const imgs = await listImages(y);
    for (const img of imgs) {
      imageSet.add(`${y}-${img.slot}`);
    }
  }

  for (const el of scrollMonths) {
    const month = el.getAttribute("data-month") ?? "";
    const elYear = parseInt(el.getAttribute("data-year") ?? "0");
    const page = el.querySelector(".page") as HTMLElement | null;
    if (!page || !elYear) continue;

    // Create image container sized to match the page's natural dimensions
    const imageDiv = document.createElement("div");
    imageDiv.className = "spread-image";

    if (imageSet.has(`${elYear}-${month}`)) {
      const url = await loadImageUrl(elYear, month);
      if (url) {
        imageDiv.classList.add(`scaling-${scaling}`);
        imageDiv.innerHTML = buildImageContent(url, scaling);
      } else {
        imageDiv.classList.add("empty");
        imageDiv.innerHTML = `<button class="spread-add-btn">+ Add Image</button>`;
      }
    } else {
      imageDiv.classList.add("empty");
      imageDiv.innerHTML = `<button class="spread-add-btn">+ Add Image</button>`;
    }

    // Wrap image + page in .spread-pair for single box-shadow
    const pair = document.createElement("div");
    pair.className = "spread-pair";
    el.insertBefore(pair, page);
    pair.appendChild(imageDiv);
    pair.appendChild(page);
  }

  // Handle clicks on spread images (uses per-element year)
  document.querySelector(".config-scroll")?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Add image button
    if (target.classList.contains("spread-add-btn")) {
      const scrollMonth = target.closest(".scroll-month") as HTMLElement | null;
      const month = scrollMonth?.dataset.month ?? "";
      const elYear = parseInt(scrollMonth?.dataset.year ?? "0");
      if (month && elYear) triggerImageUpload(elYear, month);
      return;
    }

    // Per-image fit/crop toggle
    const toggleBtn = target.closest(".spread-scaling-toggle") as HTMLElement | null;
    if (toggleBtn) {
      const spreadImage = toggleBtn.closest(".spread-image") as HTMLElement | null;
      if (!spreadImage) return;
      const nextScaling = toggleBtn.dataset.nextScaling ?? "fit";
      spreadImage.classList.remove("scaling-fit", "scaling-crop");
      spreadImage.classList.add(`scaling-${nextScaling}`);
      // Update button to show the opposite toggle
      const newNext = nextScaling === "crop" ? "fit" : "crop";
      const icon = nextScaling === "crop" ? ICON_FIT : ICON_CROP;
      const title = nextScaling === "crop" ? "Switch to Fit" : "Switch to Crop";
      toggleBtn.dataset.nextScaling = newNext;
      toggleBtn.title = title;
      toggleBtn.innerHTML = icon;
      return;
    }

    // Click on existing image to replace
    if (target.tagName === "IMG" && target.closest(".spread-image")) {
      const scrollMonth = target.closest(".scroll-month") as HTMLElement | null;
      const month = scrollMonth?.dataset.month ?? "";
      const elYear = parseInt(scrollMonth?.dataset.year ?? "0");
      if (month && elYear) triggerImageUpload(elYear, month);
    }
  });
}

// ─── Month + Month facing layout ───────────────────────────────────

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** For facing-month layout: pair all months into spreads.
 *  Nov+Dec, Jan+Feb, Mar+Apr, etc. Each month appears exactly once. */
async function initMonthSpreadLayout() {
  const scrollMonths = document.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;
  const monthElements = Array.from(scrollMonths);

  // Pair all months sequentially: [0,1], [2,3], [4,5], ...
  for (let i = 0; i < monthElements.length - 1; i += 2) {
    const firstEl = monthElements[i];
    const secondEl = monthElements[i + 1];

    const firstPage = firstEl.querySelector(".page") as HTMLElement | null;
    const secondPage = secondEl?.querySelector(".page") as HTMLElement | null;
    if (!firstPage || !secondPage) continue;

    // Move second month's page into first scroll-month as a spread-pair
    secondPage.classList.add("month-facing");
    const pair = document.createElement("div");
    pair.className = "spread-pair";
    firstEl.insertBefore(pair, firstPage);
    pair.appendChild(firstPage);  // first month on top
    pair.appendChild(secondPage); // second month on bottom

    // Hide the now-empty second scroll-month
    secondEl.style.display = "none";
  }
}

// ─── Scroll tracking for export label ──────────────────────────────

function getVisibleMonth(): { year: string; month: string } | null {
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  if (!scroll) return null;

  const scrollRect = scroll.getBoundingClientRect();
  const months = scroll.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;

  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  for (const m of months) {
    const rect = m.getBoundingClientRect();
    const dist = Math.abs(rect.top - scrollRect.top);
    if (dist < bestDist) {
      bestDist = dist;
      best = m;
    }
  }

  if (!best) return null;
  return { year: best.dataset.year ?? "", month: best.dataset.month ?? "" };
}

function updateExportLabel() {
  const btn = document.querySelector('[data-action="save"]') as HTMLElement | null;
  if (!btn) return;

  const visible = getVisibleMonth();
  if (visible) {
    const monthNum = parseInt(visible.month);
    const name = MONTH_NAMES[monthNum] || "Month";
    btn.textContent = `Export ${name}.png`;
  }
}

function initScrollTracking() {
  const content = document.querySelector(".config-content") as HTMLElement | null;
  if (!content) return;

  let scrollTimer: ReturnType<typeof setTimeout>;
  content.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateExportLabel, 100);
  }, { passive: true });
}

// ─── Export: current view ──────────────────────────────────────────

async function exportCurrentView() {
  // Find the most centered visible month in the scroll view
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  const scrollMonths = document.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;
  let targetPage: HTMLElement | null = null;
  let targetMonth: HTMLElement | null = null;

  if (scroll && scrollMonths.length > 0) {
    const scrollRect = scroll.getBoundingClientRect();
    let bestDist = Infinity;
    for (const m of scrollMonths) {
      const rect = m.getBoundingClientRect();
      const dist = Math.abs(rect.top - scrollRect.top);
      if (dist < bestDist) {
        bestDist = dist;
        targetMonth = m;
      }
    }
    if (targetMonth) {
      targetPage = targetMonth.querySelector(".page") as HTMLElement;
    }
  }

  // Fallback to old behavior for non-scroll views
  if (!targetPage) {
    targetPage = document.querySelector(".config-content #root") as HTMLElement;
  }
  if (!targetPage) return;

  const status = document.querySelector(".config-status") as HTMLElement | null;
  const originalStatus = status?.textContent ?? "";
  const dpi = getActiveDpi();
  const params = getConfigParams();

  const monthNum = targetMonth?.dataset.month ?? "";

  if (status) status.textContent = "Exporting\u2026";

  // Temporarily remove transform + margin for clean export at natural dimensions
  const origTransform = targetPage.style.transform;
  const origMargin = targetPage.style.marginBottom;
  targetPage.style.transform = "";
  targetPage.style.marginBottom = "";

  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(targetPage, {
      pixelRatio: dpi / 96,
      backgroundColor: "#FFFFFF",
    });

    const monthPart = monthNum ? `--${monthNum.padStart(2, "0")}` : "";
    const link = document.createElement("a");
    link.download = `calendar--${params.year}${monthPart}--${params.size}--${params.orientation}--${dpi}dpi.png`;
    link.href = dataUrl;
    link.click();

    if (status) status.textContent = originalStatus;
  } catch (err) {
    console.error("Export failed:", err);
    if (status) status.textContent = "Export failed";
    setTimeout(() => {
      if (status) status.textContent = originalStatus;
    }, 3000);
  } finally {
    targetPage.style.transform = origTransform;
    targetPage.style.marginBottom = origMargin;
  }
}

// ─── Export: all months ────────────────────────────────────────────

async function exportAllMonths() {
  const status = document.querySelector(".config-status") as HTMLElement | null;
  const originalStatus = status?.textContent ?? "";
  const dpi = getActiveDpi();
  const params = getConfigParams();
  const monthNames = [
    "", "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  const scrollMonths = document.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;
  if (scrollMonths.length === 0) return;

  try {
    const { toPng } = await import("html-to-image");
    const pixelRatio = dpi / 96;

    for (let i = 0; i < scrollMonths.length; i++) {
      const scrollMonth = scrollMonths[i];
      const page = scrollMonth.querySelector(".page") as HTMLElement | null;
      if (!page) continue;

      const monthNum = parseInt(scrollMonth.dataset.month ?? "0");
      const yearNum = scrollMonth.dataset.year ?? params.year;
      const monthStr = String(monthNum).padStart(2, "0");
      const label = monthNames[monthNum] || monthStr;

      if (status) {
        status.textContent = `Exporting ${label}\u2026 (${i + 1}/${scrollMonths.length})`;
      }

      // Temporarily remove transform + margin for clean export
      const origTransform = page.style.transform;
      const origMargin = page.style.marginBottom;
      page.style.transform = "";
      page.style.marginBottom = "";

      const dataUrl = await toPng(page, {
        pixelRatio,
        backgroundColor: "#FFFFFF",
      });

      page.style.transform = origTransform;
      page.style.marginBottom = origMargin;

      const link = document.createElement("a");
      link.download = `calendar--${yearNum}--${monthStr}--${params.size}--${params.orientation}--${dpi}dpi.png`;
      link.href = dataUrl;
      link.click();

      await new Promise((r) => setTimeout(r, 500));
    }

    if (status) status.textContent = "All months exported!";
    setTimeout(() => {
      if (status) status.textContent = originalStatus;
    }, 3000);
  } catch (err) {
    console.error("Batch export failed:", err);
    if (status) status.textContent = "Export failed";
    setTimeout(() => {
      if (status) status.textContent = originalStatus;
    }, 3000);
  }
}

// ─── Export: PDF for print ─────────────────────────────────────────

async function exportPDF() {
  const status = document.querySelector(".config-status") as HTMLElement | null;
  const originalStatus = status?.textContent ?? "";

  if (status) status.textContent = "Preparing PDF export\u2026";

  try {
    const { exportCalendarPDF } = await import("./export-pdf");
    await exportCalendarPDF({
      getStatus: () => status,
      getOriginalStatus: () => originalStatus,
    });
  } catch (err) {
    console.error("PDF export failed:", err);
    if (status) status.textContent = "PDF export failed";
    setTimeout(() => {
      if (status) status.textContent = originalStatus;
    }, 3000);
  }
}

// ─── Init ──────────────────────────────────────────────────────────

initConfigSidebar();

// Config scroll view setup
if (document.querySelector(".config-scroll")) {
  const config = document.querySelector(".config") as HTMLElement;
  const layout = config?.dataset.layout ?? "single";

  const initDone = () => {
    // Double rAF ensures one paint cycle has completed before measuring.
    // Safari needs this to resolve CSS mm-based dimensions on .page elements.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scalePages();
        restoreScrollPosition();
        updateExportLabel();
      });
    });
  };

  if (layout === "facing-photo") {
    initSpreadLayout().then(initDone);
  } else if (layout === "facing-month") {
    initMonthSpreadLayout().then(initDone);
  } else {
    initDone();
  }

  window.addEventListener("resize", onResize);
  initScrollTracking();
}
