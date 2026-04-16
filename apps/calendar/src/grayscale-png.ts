/**
 * Grayscale image export utilities.
 * Renders elements via html-to-image, converts to grayscale, then encodes as:
 *   - 8-bit indexed PNG (for standalone file exports)
 *   - JPEG (for PDF embedding, where jsPDF decodes PNGs to raw pixels anyway)
 */

import UPNG from "upng-js";

export interface GrayscaleOptions {
  pixelRatio: number;
  backgroundColor?: string;
}

/** Render an element to a grayscale canvas via html-to-image. */
async function toGrayscaleCanvas(
  el: HTMLElement,
  opts: GrayscaleOptions,
): Promise<HTMLCanvasElement> {
  const { toCanvas } = await import("html-to-image");

  const canvas = await toCanvas(el, {
    pixelRatio: opts.pixelRatio,
    backgroundColor: opts.backgroundColor ?? "#FFFFFF",
  });

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert RGBA to grayscale in-place (ITU-R BT.601 luminance)
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Render an HTML element to an 8-bit grayscale PNG data URL.
 * Uses a 256-shade grayscale palette for ~4× smaller files than 32-bit RGBA.
 */
export async function toGrayscalePng(
  el: HTMLElement,
  opts: GrayscaleOptions,
): Promise<string> {
  const canvas = await toGrayscaleCanvas(el, opts);
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const pngBuffer = UPNG.encode(
    [imageData.data.buffer],
    canvas.width,
    canvas.height,
    256,
  );

  const bytes = new Uint8Array(pngBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return "data:image/png;base64," + btoa(binary);
}

/**
 * Render an HTML element to a grayscale JPEG data URL.
 * Ideal for PDF embedding where jsPDF decodes PNGs to raw pixels anyway —
 * JPEG is far more compact for mostly-white calendar pages.
 */
export async function toGrayscaleJpeg(
  el: HTMLElement,
  opts: GrayscaleOptions & { quality?: number },
): Promise<string> {
  const canvas = await toGrayscaleCanvas(el, opts);
  return canvas.toDataURL("image/jpeg", opts.quality ?? 0.92);
}
