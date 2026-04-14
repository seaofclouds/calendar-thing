/**
 * URL serialization helpers.
 * Shared between server-side (index.ts) and client-side modules.
 */

/**
 * Serialize URLSearchParams without percent-encoding colons and commas.
 * Standard toString() encodes `:` → `%3A` and `,` → `%2C`, which makes
 * the `include` param unreadable (e.g. `lunar%3Afull%2Clunar%3Anew`).
 * Safe because all keys and values are from a controlled vocabulary
 * (feed tokens, page sizes, orientations) — never free-text user input.
 */
export function serializeParams(params: URLSearchParams): string {
  const parts: string[] = [];
  params.forEach((v, k) => {
    // Feed URLs contain special characters (://, ?, &) that must be encoded
    parts.push(`${k}=${k === "feed" ? encodeURIComponent(v) : v}`);
  });
  return parts.join("&");
}

/** Build full href from URL using our clean serializer */
export function buildHref(url: URL): string {
  const qs = serializeParams(url.searchParams);
  return url.origin + url.pathname + (qs ? `?${qs}` : "");
}
