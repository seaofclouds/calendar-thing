/**
 * Client-side JS for the calendar app.
 * Handles responsive column layout and image export.
 * Built by esbuild into public/client.js.
 */

// Responsive column count for non-print view
function updateColumns() {
  const calendar = document.querySelector(".year-view") as HTMLElement | null;
  if (!calendar || calendar.classList.contains("print")) return;

  const w = window.innerWidth;
  const cols = w < 600 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4;
  calendar.style.setProperty("--print-columns", String(cols));
}

window.addEventListener("resize", updateColumns);
updateColumns();

// Image export — triggered when server sets data-format on .year-view or .month-view
async function maybeExportImage() {
  const calendar = document.querySelector(".year-view[data-format], .month-view[data-format]") as HTMLElement | null;
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
    link.download = `calendar-${year}-${size}-${orientation}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Image export failed:", err);
  }
}

// Wait for fonts and layout to settle before exporting
if (document.querySelector("[data-format]")) {
  setTimeout(maybeExportImage, 2000);
}

// Config sidebar — format/orientation pill clicks update URL params
function initConfigPills() {
  const sidebar = document.querySelector(".config-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("config-option")) return;

    const url = new URL(window.location.href);

    if (target.dataset.size) {
      url.searchParams.set("size", target.dataset.size);
    }
    if (target.dataset.orientation) {
      url.searchParams.set("orientation", target.dataset.orientation);
    }

    window.location.href = url.toString();
  });
}

initConfigPills();
