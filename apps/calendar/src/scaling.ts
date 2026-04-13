/**
 * Page scaling and scroll position management.
 * Scales .page elements to fit within the viewport while maintaining
 * paper proportions for accurate PDF/PNG export.
 */

import { getConfigParams } from "./config-helpers";

// ─── Scale constants ──────────────────────────────────────────────

const SCROLL_PADDING = 24;
const TOOLBAR_HEIGHT = 80;
const PX_PER_INCH = 96;
const NARROW_CONTENT_THRESHOLD = 480;

/**
 * Scale .page elements to fit within the viewport, maintaining paper proportions.
 * Uses transform: scale() (preserves correct PDF export) with negative margins
 * to collapse the unused layout space so elements sit adjacent.
 */
export function scalePages() {
  const scroll = document.querySelector(".config-content") as HTMLElement | null;
  if (!scroll) return;

  const scrollWidth = scroll.clientWidth;
  const scrollHeight = scroll.clientHeight;
  const availableWidth = scrollWidth - SCROLL_PADDING * 2;
  const { margin, gutter } = getConfigParams();

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
      let gutterPx = 0;
      if (gutter !== "0") {
        if (gutter.endsWith("in")) gutterPx = parseFloat(gutter) * PX_PER_INCH;
        else if (gutter.endsWith("mm")) gutterPx = parseFloat(gutter) * PX_PER_INCH / 25.4;
      }

      // Both pages at natural height + gutter between them
      const totalNaturalH = pageHeight * 2 + gutterPx;
      const maxContentH = scrollHeight - TOOLBAR_HEIGHT;
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
      const maxContentH = scrollHeight - TOOLBAR_HEIGHT;
      const scale = Math.min(1, availableWidth / pageWidth, maxContentH / pageHeight);
      const unusedSpace = Math.max(0, pageHeight * (1 - scale));

      page.style.transform = `scale(${scale})`;
      page.style.marginBottom = `${-unusedSpace}px`;
      page.style.marginRight = `${-(pageWidth * (1 - scale))}px`;
    }

    // Dynamic mini cal width: if content area is narrow, use wider mini cal columns
    const marginVal = parseFloat(margin);
    const marginUnit = margin.replace(/[\d.]/g, "");
    const marginPx = marginUnit === "mm" ? marginVal * PX_PER_INCH / 25.4 : marginVal * PX_PER_INCH;
    const contentWidth = pageWidth - 2 * marginPx;
    page.classList.toggle("narrow-content", contentWidth < NARROW_CONTENT_THRESHOLD);

    // Also apply to facing clone if present
    const facingClone = scrollMonth.querySelector(".page.month-facing") as HTMLElement | null;
    if (facingClone) facingClone.classList.toggle("narrow-content", contentWidth < NARROW_CONTENT_THRESHOLD);
  }
}

let resizeTimer: ReturnType<typeof setTimeout>;
export function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scalePages();
  }, 100);
}

// ─── Scroll position preservation ──────────────────────────────────

/** Save the currently visible month to sessionStorage so config changes don't lose position */
export function saveVisibleMonth() {
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
export function restoreScrollPosition() {
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
