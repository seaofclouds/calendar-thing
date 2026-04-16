/**
 * PDF export for calendar printing.
 * Uses jsPDF for PDF generation and html-to-image for calendar rendering.
 *
 * Photo+Month layout page order:
 *   Cover image, Photo 1, Month 1, Photo 2, Month 2, ...
 *   Photos have margin + bottom gutter (binding edge).
 *   Calendar pages have margin + top gutter (binding edge).
 *
 * Month+Month layout page order:
 *   Month 1 (bottom gutter), Month 2 (top gutter), Month 3, ...
 */

import { loadImage } from "./store-images";
import { PAGE_TYPES } from "./page-config";
import { getConfigParams, getActiveDpi } from "./config-helpers";
import { toGrayscaleJpeg } from "./grayscale-png";

export interface ExportPDFOptions {
  getStatus: () => HTMLElement | null;
  getOriginalStatus: () => string;
}

/** Convert a dimension to mm */
function toMm(d: { value: number; unit: string }): number {
  return d.unit === "mm" ? d.value : d.value * 25.4;
}

/** Get page dimensions in mm for a given size and orientation */
function getPageDimensionsMm(
  size: string,
  orientation: string,
): { width: number; height: number } {
  const config = PAGE_TYPES[size];
  if (!config) return { width: 215.9, height: 279.4 };

  const w = toMm(config.dimensions.width);
  const h = toMm(config.dimensions.height);

  return orientation === "landscape"
    ? { width: h, height: w }
    : { width: w, height: h };
}

/**
 * Draw a user photo onto a canvas at the given page dimensions.
 * Supports fit (contain) and crop (cover) scaling modes.
 * Matches the web preview: image fills the margin-bounded area,
 * then the gutter zone is painted white over any overflow.
 */
async function composeImagePage(
  blob: Blob,
  canvasW: number,
  canvasH: number,
  scaling: string,
  margin: { top: number; right: number; bottom: number; left: number },
  gutterBottom: number,
): Promise<string> {
  const img = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Image area matches web: margin on all sides, gutter NOT subtracted
    // (web has the gutter as a separate element outside the image container)
    const drawX = margin.left;
    const drawY = margin.top;
    const drawW = canvasW - margin.left - margin.right;
    const drawH = canvasH - margin.top - margin.bottom;

    if (scaling === "crop") {
      // object-fit: cover — fill drawing area, center-crop
      const scale = Math.max(drawW / img.width, drawH / img.height);
      const sw = drawW / scale;
      const sh = drawH / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, drawX, drawY, drawW, drawH);
    } else {
      // object-fit: contain — fit within drawing area, letterboxed
      const scale = Math.min(drawW / img.width, drawH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = drawX + (drawW - dw) / 2;
      const dy = drawY + (drawH - dh) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
    }

    // Paint gutter zone white — the binding margin at the bottom edge.
    // Any image content that extends into this zone is covered.
    if (gutterBottom > 0) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, canvasH - margin.bottom - gutterBottom, canvasW, gutterBottom);
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  } finally {
    img.close();
  }
}

export async function exportCalendarPDF(opts: ExportPDFOptions): Promise<void> {
  const params = getConfigParams();
  const status = opts.getStatus();
  const originalStatus = opts.getOriginalStatus();
  const dpi = getActiveDpi();

  const { width: pageW, height: pageH } = getPageDimensionsMm(
    params.size,
    params.orientation,
  );

  // Pixel dimensions for canvas rendering
  const pxPerMm = (dpi / 25.4);
  const canvasW = Math.round(pageW * pxPerMm);
  const canvasH = Math.round(pageH * pxPerMm);
  const pixelRatio = dpi / 96;

  const isPhotoLayout = params.layout === "facing-photo";
  const isFacingMonth = params.layout === "facing-month";
  const isFacing = isFacingMonth || isPhotoLayout;
  const gutterVal = isFacing ? params.gutter : "0";
  const year = parseInt(params.year);

  // Convert a CSS length (e.g. "0.25in", "6mm") to pixels at the export DPI
  function cssLengthToPx(val: string): number {
    const num = parseFloat(val);
    if (val.endsWith("mm")) return num * pxPerMm;
    return num * dpi; // inches
  }

  // Margin inset in pixels (all sides)
  const marginPx = cssLengthToPx(params.margin);
  // Gutter inset in pixels (binding edge only)
  const gutterPx = gutterVal !== "0" ? cssLengthToPx(gutterVal) : 0;

  // Get rendered months from the DOM
  const scrollMonths = document.querySelectorAll(
    ".scroll-month",
  ) as NodeListOf<HTMLElement>;
  if (scrollMonths.length === 0) {
    if (status) status.textContent = "No months to export";
    return;
  }

  // Collect month metadata — handles single, facing-month, and facing-photo layouts.
  // In facing layouts, visible scroll-months contain a spread-pair with
  // two .page elements; the second (.month-facing) belongs to the next
  // (hidden) scroll-month.
  // gutterEdge tracks which edge needs binding margin:
  //   "bottom" = top page of a spread (binding at its bottom edge)
  //   "top"    = bottom page of a spread (binding at its top edge)
  //   "none"   = single layout, no binding margin
  type GutterEdge = "top" | "bottom" | "none";
  const months: { year: number; month: string; pageEl: HTMLElement; gutterEdge: GutterEdge }[] = [];
  for (let i = 0; i < scrollMonths.length; i++) {
    const el = scrollMonths[i];
    // Skip hidden scroll-months — their pages were moved into spread-pairs
    if (el.style.display === "none") continue;

    const pages = el.querySelectorAll(".page") as NodeListOf<HTMLElement>;
    for (const page of pages) {
      if (page.classList.contains("month-facing")) {
        // Second page in a facing pair (bottom of spread) — binding at top
        const nextEl = scrollMonths[i + 1];
        if (nextEl) {
          months.push({
            year: parseInt(nextEl.dataset.year ?? params.year),
            month: nextEl.dataset.month ?? "1",
            pageEl: page,
            gutterEdge: gutterVal !== "0" ? "top" : "none",
          });
        }
      } else {
        // First page in a facing pair (top of spread) — binding at bottom
        // For single layout or photo layout, calendar pages get top gutter
        const edge: GutterEdge = gutterVal === "0" ? "none"
          : (isFacingMonth ? "bottom" : "top");
        months.push({
          year: parseInt(el.dataset.year ?? params.year),
          month: el.dataset.month ?? "1",
          pageEl: page,
          gutterEdge: edge,
        });
      }
    }
  }

  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.jsPDF;

  const pdf = new jsPDF({
    orientation: params.orientation as "portrait" | "landscape",
    unit: "mm",
    format: [pageW, pageH],
  });

  let isFirstPage = true;

  function nextPage() {
    if (isFirstPage) {
      isFirstPage = false;
    } else {
      pdf.addPage([pageW, pageH]);
    }
  }

  function addFullPageImage(dataUrl: string, format: "PNG" | "JPEG" = "PNG") {
    nextPage();
    pdf.addImage(dataUrl, format, 0, 0, pageW, pageH);
  }

  async function renderCalendarToJpeg(el: HTMLElement, gutterEdge: GutterEdge): Promise<string> {
    // Temporarily reset viewport scaling so the capture is at natural page dimensions
    const origTransform = el.style.transform;
    const origMarginBottom = el.style.marginBottom;
    const origMarginRight = el.style.marginRight;
    el.style.transform = "";
    el.style.marginBottom = "";
    el.style.marginRight = "";

    // For facing layouts, add gutter as extra padding on the binding edge
    const monthView = el.querySelector(".month-view") as HTMLElement | null;
    let origPadding: string | undefined;
    let paddingProp: "paddingTop" | "paddingBottom" | undefined;
    if (gutterEdge !== "none" && monthView) {
      paddingProp = gutterEdge === "top" ? "paddingTop" : "paddingBottom";
      origPadding = monthView.style[paddingProp];
      monthView.style[paddingProp] = `calc(${params.margin} + ${gutterVal})`;
    }

    try {
      return await toGrayscaleJpeg(el, {
        pixelRatio,
        backgroundColor: "#FFFFFF",
        quality: 1.0,
      });
    } finally {
      el.style.transform = origTransform;
      el.style.marginBottom = origMarginBottom;
      el.style.marginRight = origMarginRight;
      if (origPadding !== undefined && monthView && paddingProp) {
        monthView.style[paddingProp] = origPadding;
      }
    }
  }

  const totalMonths = months.length;
  let step = 0;
  const totalSteps = isPhotoLayout ? totalMonths * 2 + 1 : totalMonths;

  const monthLabel = (m: { year: number; month: string }) => {
    const monthNum = parseInt(m.month);
    return new Date(2000, monthNum - 1).toLocaleString("en", { month: "short" });
  };

  // Margin rect for photo pages (same on all sides, matching web preview)
  const photoMargin = {
    top: marginPx,
    right: marginPx,
    bottom: marginPx,
    left: marginPx,
  };

  // ─── COVER PAGE ────────────────────────────────────────────────

  if (isPhotoLayout) {
    step++;
    if (status) status.textContent = `Rendering cover\u2026 (${step}/${totalSteps})`;

    const coverRecord = await loadImage(year, "cover");
    if (coverRecord) {
      const coverUrl = await composeImagePage(
        coverRecord.blob, canvasW, canvasH, params.scaling, photoMargin, 0,
      );
      addFullPageImage(coverUrl, "JPEG");
    } else {
      // Blank white cover
      nextPage();
    }
  }

  // ─── MONTH PAGES ──────────────────────────────────────────────

  for (let i = 0; i < months.length; i++) {
    const m = months[i];
    const label = monthLabel(m);

    if (isPhotoLayout) {
      // Photo page: same orientation as preview, with margin + bottom gutter
      step++;
      if (status) {
        status.textContent = `Composing ${label} image\u2026 (${step}/${totalSteps})`;
      }

      const imgRecord = await loadImage(m.year, m.month);
      if (imgRecord) {
        const imgUrl = await composeImagePage(
          imgRecord.blob, canvasW, canvasH, params.scaling, photoMargin, gutterPx,
        );
        addFullPageImage(imgUrl, "JPEG");
      } else {
        nextPage(); // blank photo page
      }
    }

    // Front of next sheet: calendar page (normal)
    step++;
    if (status) {
      status.textContent = `Rendering ${label} calendar\u2026 (${step}/${totalSteps})`;
    }

    const calendarUrl = await renderCalendarToJpeg(m.pageEl, m.gutterEdge);
    addFullPageImage(calendarUrl, "JPEG");

    // Yield to keep UI responsive
    await new Promise((r) => setTimeout(r, 50));
  }

  // ─── SAVE ─────────────────────────────────────────────────────

  if (status) status.textContent = "Saving PDF\u2026";

  const sizeName = params.size.charAt(0).toUpperCase() + params.size.slice(1);
  const layoutTag = isFacing ? "--facing" : "";
  pdf.save(`calendar--${params.year}--${sizeName}--${params.orientation}${layoutTag}--${dpi}dpi.pdf`);

  if (status) {
    status.textContent = "PDF exported!";
    setTimeout(() => {
      status.textContent = originalStatus;
    }, 3000);
  }
}
