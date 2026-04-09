/**
 * Client-side JS for the calendar app.
 * Handles responsive column layout and image export.
 * Built by esbuild into public/client.js.
 */

// Responsive column count for non-print view
function updateColumns() {
  const calendar = document.querySelector(".calendar") as HTMLElement | null;
  if (!calendar || calendar.classList.contains("print")) return;

  const w = window.innerWidth;
  const cols = w < 600 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4;
  calendar.style.setProperty("--print-columns", String(cols));
}

window.addEventListener("resize", updateColumns);
updateColumns();

// Day click navigation: clicking a current-month day in year view navigates to month view
function setupDayNavigation() {
  const calendar = document.querySelector(".calendar") as HTMLElement | null;
  if (!calendar || calendar.classList.contains("print")) return;

  calendar.addEventListener("click", (e) => {
    const dayEl = (e.target as HTMLElement).closest(".calendar-day.current-month");
    if (!dayEl) return;

    const monthEl = dayEl.closest(".month") as HTMLElement | null;
    if (!monthEl) return;

    const year = monthEl.dataset.year;
    const month = monthEl.dataset.month;
    if (year && month) {
      window.location.href = `/${year}/${month.padStart(2, "0")}`;
    }
  });
}

setupDayNavigation();

// Image export — triggered when server sets data-format on .calendar
async function maybeExportImage() {
  const calendar = document.querySelector(".calendar") as HTMLElement | null;
  if (!calendar?.dataset.format) return;

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
if (document.querySelector(".calendar[data-format]")) {
  setTimeout(maybeExportImage, 2000);
}
