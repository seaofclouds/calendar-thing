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

// ─── Config sidebar ────────────────────────────────────────────────

function initConfigSidebar() {
  const sidebar = document.querySelector(".config-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("config-option")) {
      // Layout toggle — client-side only, no reload
      if (target.dataset.layout) {
        const url = new URL(window.location.href);
        url.searchParams.set("layout", target.dataset.layout);
        history.replaceState(null, "", url.toString());

        // Toggle active pill
        const section = target.closest(".config-section")!;
        section.querySelectorAll(".config-option").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");

        // Update data attribute
        const config = document.querySelector(".config") as HTMLElement;
        config.dataset.layout = target.dataset.layout;

        // Show/hide scaling section
        const scalingSection = document.querySelector(".config-scaling") as HTMLElement | null;
        if (scalingSection) {
          scalingSection.style.display = target.dataset.layout === "photo-calendar" ? "" : "none";
        }

        // Toggle spread layout
        if (target.dataset.layout === "photo-calendar") {
          initSpreadLayout().then(() => scalePages());
        } else {
          // Remove spread elements, restore pages
          document.querySelectorAll(".spread-pair").forEach((pair) => {
            const parent = pair.parentElement!;
            const page = pair.querySelector(".page");
            if (page) parent.appendChild(page);
            pair.remove();
          });
          document.querySelectorAll(".spread-image").forEach((el) => el.remove());
          scalePages();
        }
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
  };
}

// ─── Scroll position preservation ──────────────────────────────────

/** Save the currently visible month to sessionStorage so config changes don't lose position */
function saveVisibleMonth() {
  const scroll = document.querySelector(".config-scroll") as HTMLElement | null;
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
  const scroll = document.querySelector(".config-scroll") as HTMLElement | null;
  if (!scroll) return;

  const scrollWidth = scroll.clientWidth;
  const scrollHeight = scroll.clientHeight;
  const padding = 24;
  const availableWidth = scrollWidth - padding * 2;
  const margin = getConfigParams().margin;

  const scrollMonths = scroll.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;

  for (const scrollMonth of scrollMonths) {
    const page = scrollMonth.querySelector(".page") as HTMLElement | null;
    if (!page) continue;

    const spreadImage = scrollMonth.querySelector(".spread-image") as HTMLElement | null;
    const hasSpread = spreadImage !== null;

    // Reset transforms and margins to measure natural dimensions
    page.style.transform = "";
    page.style.marginBottom = "";
    if (spreadImage) {
      spreadImage.style.transform = "";
      spreadImage.style.marginBottom = "";
    }

    const pageWidth = page.offsetWidth;
    const pageHeight = page.offsetHeight;
    if (pageWidth <= 0 || pageHeight <= 0) continue;

    // Scale to fit: account for 2 pages stacked in spread mode
    const totalNaturalH = hasSpread ? pageHeight * 2 : pageHeight;
    const maxContentH = scrollHeight - 40;
    const scale = Math.min(availableWidth / pageWidth, maxContentH / totalNaturalH);

    // transform: scale() doesn't change layout box.
    // Negative margin collapses the unused space below each element
    // so the next element sits flush against the visual boundary.
    const unusedSpace = pageHeight * (1 - scale);

    page.style.transform = `scale(${scale})`;
    page.style.marginBottom = `${-unusedSpace}px`;

    if (hasSpread && spreadImage) {
      spreadImage.style.width = `${pageWidth}px`;
      spreadImage.style.height = `${pageHeight}px`;
      spreadImage.style.padding = margin;
      spreadImage.style.boxSizing = "border-box";
      spreadImage.style.transform = `scale(${scale})`;
      spreadImage.style.marginBottom = `${-unusedSpace}px`;
      // Also collapse horizontal unused space
      spreadImage.style.marginRight = `${-(pageWidth * (1 - scale))}px`;
    }

    // Collapse horizontal unused space on the page too
    page.style.marginRight = `${-(pageWidth * (1 - scale))}px`;

    // Constrain spread-pair width so shadow doesn't go wide
    const pair = scrollMonth.querySelector(".spread-pair") as HTMLElement | null;
    if (pair) {
      pair.style.width = `${pageWidth * scale}px`;
    }
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
    container.innerHTML = `<img src="${url}" alt="Photo for month ${month}">`;
  } else {
    container.classList.add("empty");
    container.classList.remove("scaling-fit", "scaling-crop");
    container.innerHTML = `<button class="spread-add-btn">+ Add Image</button>`;
  }
}

/** Inject spread image containers above each calendar month when in photo-calendar layout */
async function initSpreadLayout() {
  const config = document.querySelector(".config") as HTMLElement | null;
  if (!config || config.dataset.layout !== "photo-calendar") return;

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
        imageDiv.innerHTML = `<img src="${url}" alt="Photo for month ${month}">`;
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

    // Click on existing image to replace
    if (target.tagName === "IMG" && target.closest(".spread-image")) {
      const scrollMonth = target.closest(".scroll-month") as HTMLElement | null;
      const month = scrollMonth?.dataset.month ?? "";
      const elYear = parseInt(scrollMonth?.dataset.year ?? "0");
      if (month && elYear) triggerImageUpload(elYear, month);
    }
  });
}

// ─── Export: current view ──────────────────────────────────────────

async function exportCurrentView() {
  // Find the most centered visible month in the scroll view
  const scroll = document.querySelector(".config-scroll") as HTMLElement | null;
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
  const isPhotoLayout = document.querySelector('.config[data-layout="photo-calendar"]');

  if (isPhotoLayout) {
    // Init spread layout first (adds spread-image divs), then scale, then scroll
    initSpreadLayout().then(() => {
      scalePages();
      restoreScrollPosition();
    });
  } else {
    scalePages();
    restoreScrollPosition();
  }

  window.addEventListener("resize", onResize);
}
