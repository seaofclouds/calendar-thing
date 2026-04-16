/**
 * 8-bit grayscale PNG export.
 * Renders an element via html-to-image, converts to grayscale,
 * then encodes as an indexed 8-bit PNG using UPNG for smaller file sizes.
 */

import UPNG from "upng-js";

interface GrayscaleOptions {
  pixelRatio: number;
  backgroundColor?: string;
}

/**
 * Render an HTML element to an 8-bit grayscale PNG data URL.
 * Uses a 256-shade grayscale palette for ~4× smaller files than 32-bit RGBA.
 */
export async function toGrayscalePng(
  el: HTMLElement,
  opts: GrayscaleOptions,
): Promise<string> {
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
    // data[i+3] (alpha) left unchanged — will be 255 with white background
  }

  // Encode as 8-bit indexed PNG (256 grayscale shades)
  const pngBuffer = UPNG.encode(
    [data.buffer],
    canvas.width,
    canvas.height,
    256,
  );

  // Convert ArrayBuffer to base64 data URL
  const bytes = new Uint8Array(pngBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return "data:image/png;base64," + btoa(binary);
}
