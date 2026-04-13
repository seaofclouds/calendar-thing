/**
 * Shared config helpers for client-side modules.
 * Used by both client.ts and export-pdf.ts.
 */

/** Read config params from the current URL */
export function getConfigParams() {
  const url = new URL(window.location.href);
  const match = url.pathname.match(/\/config\/(\d+)/);
  return {
    year: match?.[1] ?? String(new Date().getFullYear()),
    size: url.searchParams.get("size") ?? "letter",
    orientation: url.searchParams.get("orientation") ?? "landscape",
    include: url.searchParams.get("include") ?? "",
    margin: url.searchParams.get("margin") ?? "0.25in",
    layout: url.searchParams.get("layout") ?? "calendar",
    length: url.searchParams.get("length") ?? "12",
    scaling: url.searchParams.get("scaling") ?? "fit",
    gutter: url.searchParams.get("gutter") ?? "0.5in",
  };
}

/** Get active DPI from the config sidebar pill */
export function getActiveDpi(): number {
  const el = document.querySelector(
    ".config-option[data-dpi].active",
  ) as HTMLElement | null;
  return parseInt(el?.dataset.dpi ?? "300", 10);
}
