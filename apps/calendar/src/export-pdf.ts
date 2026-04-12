/**
 * PDF export with imposition for spiral-bound calendar printing.
 * Uses jsPDF for PDF generation and html-to-image for calendar rendering.
 *
 * Imposition order (double-sided, spiral-bound at top):
 *   Sheet 1 front: Cover image (normal)
 *   Sheet 1 back:  Month 1 image (rotated 180°)
 *   Sheet 2 front: Month 1 calendar (normal)
 *   Sheet 2 back:  Month 2 image (rotated 180°)
 *   ...
 *   Sheet N front: Last month calendar (normal)
 *   Sheet N back:  (blank)
 */

import { loadImage } from "./store-images";
import { PAGE_TYPES } from "./config";

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

/** Read config params from the current URL */
function getConfigParams() {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/\/config\/(\d+)/);
  return {
    year: match?.[1] ?? String(new Date().getFullYear()),
    size: url.searchParams.get("size") ?? "letter",
    orientation: url.searchParams.get("orientation") ?? "landscape",
    layout: url.searchParams.get("layout") ?? "calendar",
    scaling: url.searchParams.get("scaling") ?? "fit",
  };
}

/** Get active DPI from sidebar */
function getActiveDpi(): number {
  const el = document.querySelector(
    ".config-option[data-dpi].active",
  ) as HTMLElement | null;
  return parseInt(el?.dataset.dpi ?? "300");
}

/**
 * Draw a user photo onto a canvas at the given page dimensions.
 * Supports fit (contain) and crop (cover) scaling modes.
 * Optionally rotates 180° for back-side imposition.
 */
async function composeImagePage(
  blob: Blob,
  canvasW: number,
  canvasH: number,
  scaling: string,
  rotate180: boolean,
): Promise<string> {
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasW, canvasH);

  if (rotate180) {
    ctx.translate(canvasW, canvasH);
    ctx.rotate(Math.PI);
  }

  if (scaling === "crop") {
    // object-fit: cover — fill canvas, center-crop
    const scale = Math.max(canvasW / img.width, canvasH / img.height);
    const sw = canvasW / scale;
    const sh = canvasH / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
  } else {
    // object-fit: contain — fit within canvas, letterboxed
    const scale = Math.min(canvasW / img.width, canvasH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (canvasW - dw) / 2;
    const dy = (canvasH - dh) / 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
  }

  img.close();
  return canvas.toDataURL("image/jpeg", 0.92);
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

  const isPhotoLayout = params.layout === "photo-calendar";
  const year = parseInt(params.year);

  // Get rendered months from the DOM
  const scrollMonths = document.querySelectorAll(
    ".scroll-month",
  ) as NodeListOf<HTMLElement>;
  if (scrollMonths.length === 0) {
    if (status) status.textContent = "No months to export";
    return;
  }

  // Collect month metadata
  const months: { year: number; month: string; pageEl: HTMLElement }[] = [];
  for (const el of scrollMonths) {
    const page = el.querySelector(".page") as HTMLElement | null;
    if (!page) continue;
    months.push({
      year: parseInt(el.dataset.year ?? params.year),
      month: el.dataset.month ?? "1",
      pageEl: page,
    });
  }

  const { toJpeg } = await import("html-to-image");
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

  function addFullPageImage(dataUrl: string) {
    nextPage();
    pdf.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH);
  }

  async function renderCalendarToJpeg(el: HTMLElement): Promise<string> {
    // Reset zoom to capture at natural dimensions
    const origZoom = el.style.zoom;
    el.style.zoom = "1";
    const result = await toJpeg(el, {
      pixelRatio,
      backgroundColor: "#FFFFFF",
      quality: 0.92,
    });
    el.style.zoom = origZoom;
    return result;
  }

  const totalMonths = months.length;
  let step = 0;
  const totalSteps = isPhotoLayout ? totalMonths * 2 + 1 : totalMonths;

  const monthLabel = (m: { year: number; month: string }) => {
    const monthNum = parseInt(m.month);
    return new Date(2000, monthNum - 1).toLocaleString("en", { month: "short" });
  };

  // ─── COVER PAGE ────────────────────────────────────────────────

  if (isPhotoLayout) {
    step++;
    if (status) status.textContent = `Rendering cover\u2026 (${step}/${totalSteps})`;

    const coverRecord = await loadImage(year, "cover");
    if (coverRecord) {
      const coverUrl = await composeImagePage(
        coverRecord.blob, canvasW, canvasH, params.scaling, false,
      );
      addFullPageImage(coverUrl);
    } else {
      // Blank white cover
      nextPage();
    }
  }

  // ─── MONTH PAGES (IMPOSED) ────────────────────────────────────

  for (let i = 0; i < months.length; i++) {
    const m = months[i];
    const label = monthLabel(m);

    if (isPhotoLayout) {
      // Back of previous sheet: this month's photo, rotated 180°
      step++;
      if (status) {
        status.textContent = `Composing ${label} image\u2026 (${step}/${totalSteps})`;
      }

      const imgRecord = await loadImage(m.year, m.month);
      if (imgRecord) {
        const imgUrl = await composeImagePage(
          imgRecord.blob, canvasW, canvasH, params.scaling, true,
        );
        addFullPageImage(imgUrl);
      } else {
        nextPage(); // blank back
      }
    }

    // Front of next sheet: calendar page (normal)
    step++;
    if (status) {
      status.textContent = `Rendering ${label} calendar\u2026 (${step}/${totalSteps})`;
    }

    const calendarUrl = await renderCalendarToJpeg(m.pageEl);
    addFullPageImage(calendarUrl);

    // Yield to keep UI responsive
    await new Promise((r) => setTimeout(r, 50));
  }

  // ─── SAVE ─────────────────────────────────────────────────────

  if (status) status.textContent = "Saving PDF\u2026";

  const sizeName = params.size.charAt(0).toUpperCase() + params.size.slice(1);
  pdf.save(`calendar--${params.year}--${sizeName}.pdf`);

  if (status) {
    status.textContent = "PDF exported!";
    setTimeout(() => {
      status.textContent = originalStatus;
    }, 3000);
  }
}
