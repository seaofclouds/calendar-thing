/**
 * Client-side JS entry point for the calendar app.
 * Handles responsive column layout and URL-triggered image export.
 * Delegates config sidebar, scaling, spreads, and export to focused modules.
 * Built by esbuild into public/client.js.
 */

import { initConfigSidebar } from "./config";
import { scalePages, restoreScrollPosition, onResize } from "./scaling";
import { initSpreadLayout, initMonthSpreadLayout } from "./spreads";
import { updateExportLabel, initScrollTracking } from "./export";

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

  const dpi = parseInt(calendar.dataset.dpi || "300");
  const year = calendar.dataset.year || "";
  const size = calendar.dataset.size || "";
  const orientation = calendar.dataset.orientation || "";

  const pixelRatio = dpi / 96;
  const opts = {
    pixelRatio,
    backgroundColor: "#FFFFFF",
  };

  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(calendar, opts);

    const link = document.createElement("a");
    link.download = `calendar--${year}--${size}--${orientation}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Image export failed:", err);
  }
}

if (document.querySelector("[data-format]")) {
  setTimeout(maybeExportImage, 2000);
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
