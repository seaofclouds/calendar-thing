/**
 * Spread layout and image upload.
 * Handles photo+calendar and month+month facing page layouts,
 * including image upload to IndexedDB and spread DOM construction.
 */

import {
  storeImage,
  loadImageUrl,
  listImages,
} from "./store-images";
import { getConfigParams } from "./config-helpers";

// ─── SVG icons for fit/crop toggle ────────────────────────────────

const ICON_FIT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="12" height="8" rx="1"/><rect x="4" y="5.5" width="8" height="5" rx="0.5" stroke-dasharray="2 1"/></svg>`;
const ICON_CROP = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="12" height="8" rx="1"/><line x1="2" y1="4" x2="14" y2="12"/><line x1="14" y1="4" x2="2" y2="12"/></svg>`;

// ─── Image upload ─────────────────────────────────────────────────

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

// ─── Spread layout management ─────────────────────────────────────

/** Remove any spread elements and restore pages to their scroll-months */
export function clearSpreads() {
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

      // Find the scroll-month this page belongs to by matching source tags
      const srcYear = pg.dataset.sourceYear;
      const srcMonth = pg.dataset.sourceMonth;
      delete pg.dataset.sourceYear;
      delete pg.dataset.sourceMonth;

      if (srcYear && srcMonth) {
        const target = document.querySelector(
          `.scroll-month[data-year="${srcYear}"][data-month="${srcMonth}"]`,
        ) as HTMLElement | null;
        if (target) {
          target.style.display = "";
          target.appendChild(pg);
          return;
        }
      }
      // Fallback: put it back in the current parent
      parent.appendChild(pg);
    });

    pair.remove();
  });
  document.querySelectorAll(".spread-image").forEach((el) => el.remove());
  document.querySelectorAll(".spread-gutter").forEach((el) => el.remove());
}

/** Inject spread image containers above each calendar month when in photo-calendar layout */
export async function initSpreadLayout() {
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

    // Tag page with source scroll-month so clearSpreads can restore it
    page.dataset.sourceYear = String(elYear);
    page.dataset.sourceMonth = month;

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

/** For facing-month layout: pair all months into spreads.
 *  Nov+Dec, Jan+Feb, Mar+Apr, etc. Each month appears exactly once. */
export async function initMonthSpreadLayout() {
  const scrollMonths = document.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;
  const monthElements = Array.from(scrollMonths);

  // Pair all months sequentially: [0,1], [2,3], [4,5], ...
  for (let i = 0; i < monthElements.length - 1; i += 2) {
    const firstEl = monthElements[i];
    const secondEl = monthElements[i + 1];

    const firstPage = firstEl.querySelector(".page") as HTMLElement | null;
    const secondPage = secondEl?.querySelector(".page") as HTMLElement | null;
    if (!firstPage || !secondPage) continue;

    // Tag pages with their source scroll-month so clearSpreads can restore them
    firstPage.dataset.sourceYear = firstEl.dataset.year ?? "";
    firstPage.dataset.sourceMonth = firstEl.dataset.month ?? "";
    secondPage.dataset.sourceYear = secondEl.dataset.year ?? "";
    secondPage.dataset.sourceMonth = secondEl.dataset.month ?? "";

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
