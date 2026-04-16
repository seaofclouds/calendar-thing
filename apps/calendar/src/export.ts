/**
 * Export functions for PNG, batch PNG, and PDF.
 * Also handles scroll tracking to update export labels with the visible month name.
 */

import { getConfigParams, getActiveDpi } from "./config-helpers";
import { toGrayscalePng } from "./grayscale-png";

// ─── Scroll tracking for export label ──────────────────────────────

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getVisibleMonth(): { year: string; month: string } | null {
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  if (!scroll) return null;

  const scrollRect = scroll.getBoundingClientRect();
  const months = scroll.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;

  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  for (const m of months) {
    // Skip hidden scroll-months (e.g. the second month in a facing-month pair)
    if (m.style.display === "none") continue;
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

export function updateExportLabel() {
  const btn = document.querySelector('[data-action="save"]') as HTMLElement | null;
  if (!btn) return;

  const visible = getVisibleMonth();
  if (visible) {
    const monthNum = parseInt(visible.month);
    const name = MONTH_NAMES[monthNum] || "Month";
    btn.textContent = `Export ${name}.png`;
  }
}

export function initScrollTracking() {
  const content = document.querySelector(".config-content") as HTMLElement | null;
  if (!content) return;

  let scrollTimer: ReturnType<typeof setTimeout>;
  content.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateExportLabel, 100);
  }, { passive: true });
}

// ─── Export: current view ──────────────────────────────────────────

export async function exportCurrentView() {
  // Find the most centered visible month in the scroll view
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  const scrollMonths = document.querySelectorAll(".scroll-month") as NodeListOf<HTMLElement>;
  let targetPage: HTMLElement | null = null;
  let targetMonth: HTMLElement | null = null;

  if (scroll && scrollMonths.length > 0) {
    const scrollRect = scroll.getBoundingClientRect();
    let bestDist = Infinity;
    for (const m of scrollMonths) {
      // Skip hidden scroll-months (e.g. the second month in a facing-month pair)
      if (m.style.display === "none") continue;
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
  const origMarginBottom = targetPage.style.marginBottom;
  const origMarginRight = targetPage.style.marginRight;
  targetPage.style.transform = "";
  targetPage.style.marginBottom = "";
  targetPage.style.marginRight = "";

  try {
    const dataUrl = await toGrayscalePng(targetPage, {
      pixelRatio: dpi / 96,
      backgroundColor: "#FFFFFF",
    });

    const monthPart = monthNum ? `--${monthNum.padStart(2, "0")}` : "";
    const layoutTag = (params.layout === "facing-month" || params.layout === "facing-photo") ? "--facing" : "";
    const link = document.createElement("a");
    link.download = `calendar--${params.year}${monthPart}--${params.size}--${params.orientation}${layoutTag}--${dpi}dpi.png`;
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
    targetPage.style.marginBottom = origMarginBottom;
    targetPage.style.marginRight = origMarginRight;
  }
}

// ─── Export: all months ────────────────────────────────────────────

export async function exportAllMonths() {
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

  // Collect all pages — handles both single and facing-month layouts.
  // In facing layout, visible scroll-months have spread-pairs with two pages;
  // the second (.month-facing) belongs to the next (hidden) scroll-month.
  const allPages: { yearNum: string; monthNum: number; page: HTMLElement }[] = [];
  for (let i = 0; i < scrollMonths.length; i++) {
    const el = scrollMonths[i];
    if (el.style.display === "none") continue;

    const pages = el.querySelectorAll(".page") as NodeListOf<HTMLElement>;
    for (const page of pages) {
      if (page.classList.contains("month-facing")) {
        const nextEl = scrollMonths[i + 1];
        if (nextEl) {
          allPages.push({
            yearNum: nextEl.dataset.year ?? params.year,
            monthNum: parseInt(nextEl.dataset.month ?? "0"),
            page,
          });
        }
      } else {
        allPages.push({
          yearNum: el.dataset.year ?? params.year,
          monthNum: parseInt(el.dataset.month ?? "0"),
          page,
        });
      }
    }
  }

  try {
    const pixelRatio = dpi / 96;

    for (let i = 0; i < allPages.length; i++) {
      const { yearNum, monthNum, page } = allPages[i];
      const monthStr = String(monthNum).padStart(2, "0");
      const label = monthNames[monthNum] || monthStr;

      if (status) {
        status.textContent = `Exporting ${label}\u2026 (${i + 1}/${allPages.length})`;
      }

      // Temporarily remove transform + margin for clean export
      const origTransform = page.style.transform;
      const origMarginBottom = page.style.marginBottom;
      const origMarginRight = page.style.marginRight;
      page.style.transform = "";
      page.style.marginBottom = "";
      page.style.marginRight = "";

      const dataUrl = await toGrayscalePng(page, {
        pixelRatio,
        backgroundColor: "#FFFFFF",
      });

      page.style.transform = origTransform;
      page.style.marginBottom = origMarginBottom;
      page.style.marginRight = origMarginRight;

      const link = document.createElement("a");
      const layoutTag = (params.layout === "facing-month" || params.layout === "facing-photo") ? "--facing" : "";
      link.download = `calendar--${yearNum}--${monthStr}--${params.size}--${params.orientation}${layoutTag}--${dpi}dpi.png`;
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

export async function exportPDF() {
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
