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

// Config sidebar — pill clicks and export buttons
function initConfigSidebar() {
  const sidebar = document.querySelector(".config-sidebar");
  if (!sidebar) return;

  sidebar.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Format/orientation pills — update URL and reload
    if (target.classList.contains("config-option")) {
      if (target.dataset.size || target.dataset.orientation) {
        const url = new URL(window.location.href);
        if (target.dataset.size) url.searchParams.set("size", target.dataset.size);
        if (target.dataset.orientation) url.searchParams.set("orientation", target.dataset.orientation);
        window.location.href = url.toString();
        return;
      }

      // DPI pills — client-side toggle only (no reload)
      if (target.dataset.dpi) {
        sidebar.querySelectorAll("[data-dpi]").forEach((el) => el.classList.remove("active"));
        target.classList.add("active");
        return;
      }

      // Feed toggles — update include param and reload
      if (target.dataset.feed) {
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
        const isActive = tokens.includes(feed)
          || (feed === "lunar:phases" && tokens.some((t) => t.startsWith("lunar:")))
          || (feed === "movies" && tokens.some((t) => t.startsWith("movies")));

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
        window.location.href = url.toString();
        return;
      }
    }

    // Export buttons
    if (target.classList.contains("config-button")) {
      if (target.dataset.action === "save") exportCurrentView();
      if (target.dataset.action === "save-all") exportAllMonths();
    }
  });
}

function getActiveDpi(): number {
  const active = document.querySelector(".config-option[data-dpi].active") as HTMLElement | null;
  return parseInt(active?.dataset.dpi ?? "300");
}

function getConfigParams() {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/\/config\/(\d+)(?:\/(\d+))?/);
  return {
    year: match?.[1] ?? String(new Date().getFullYear()),
    month: match?.[2] ?? "",
    size: url.searchParams.get("size") ?? "letter",
    orientation: url.searchParams.get("orientation") ?? "landscape",
    include: url.searchParams.get("include") ?? "",
  };
}

async function exportCurrentView() {
  const root = document.querySelector(".config-content #root") as HTMLElement;
  if (!root) return;

  const status = document.querySelector(".config-status") as HTMLElement | null;
  const originalStatus = status?.textContent ?? "";
  const dpi = getActiveDpi();
  const params = getConfigParams();

  if (status) status.textContent = "Exporting\u2026";

  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(root, {
      pixelRatio: dpi / 96,
      backgroundColor: "#FFFFFF",
    });

    const monthPart = params.month ? `-${params.month}` : "";
    const link = document.createElement("a");
    link.download = `calendar-${params.year}${monthPart}-${params.size}-${params.orientation}-${dpi}dpi.png`;
    link.href = dataUrl;
    link.click();

    if (status) status.textContent = originalStatus;
  } catch (err) {
    console.error("Export failed:", err);
    if (status) status.textContent = "Export failed";
    setTimeout(() => { if (status) status.textContent = originalStatus; }, 3000);
  }
}

async function exportAllMonths() {
  const status = document.querySelector(".config-status") as HTMLElement | null;
  const originalStatus = status?.textContent ?? "";
  const dpi = getActiveDpi();
  const params = getConfigParams();
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  // Create off-screen container for rendering fetched months
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  try {
    const { toPng } = await import("html-to-image");
    const pixelRatio = dpi / 96;

    for (let month = 1; month <= 12; month++) {
      const monthStr = String(month).padStart(2, "0");
      if (status) status.textContent = `Exporting ${months[month - 1]}\u2026 (${month}/12)`;

      // Fetch month page and extract #root
      const fetchParams = new URLSearchParams();
      fetchParams.set("size", params.size);
      fetchParams.set("orientation", params.orientation);
      if (params.include) fetchParams.set("include", params.include);

      const response = await fetch(`/config/${params.year}/${monthStr}?${fetchParams.toString()}`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const rootEl = doc.getElementById("root");
      if (!rootEl) continue;

      container.innerHTML = "";
      container.appendChild(document.importNode(rootEl, true));

      // Wait for layout
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      await new Promise((r) => setTimeout(r, 300));

      const dataUrl = await toPng(container.firstElementChild as HTMLElement, {
        pixelRatio,
        backgroundColor: "#FFFFFF",
      });

      const link = document.createElement("a");
      link.download = `calendar-${params.year}-${monthStr}-${params.size}-${params.orientation}-${dpi}dpi.png`;
      link.href = dataUrl;
      link.click();

      // Brief pause between downloads
      await new Promise((r) => setTimeout(r, 500));
    }

    if (status) status.textContent = "All months exported!";
    setTimeout(() => { if (status) status.textContent = originalStatus; }, 3000);
  } catch (err) {
    console.error("Batch export failed:", err);
    if (status) status.textContent = "Export failed";
    setTimeout(() => { if (status) status.textContent = originalStatus; }, 3000);
  } finally {
    document.body.removeChild(container);
  }
}

initConfigSidebar();
