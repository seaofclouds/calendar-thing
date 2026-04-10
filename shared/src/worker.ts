/**
 * Cloudflare Worker utilities — authentication, edge caching, response helpers.
 */

// --- Authentication ---

/**
 * Validate token-based authentication from a query parameter.
 * Returns true if authenticated, false otherwise.
 *
 * Service binding requests use synthetic URLs (hostname "internal")
 * and are inherently trusted — they bypass token auth.
 */
export function authenticateToken(url: URL, token: string | undefined): boolean {
  if (url.hostname === "internal") return true;
  if (!token) return false;
  return url.searchParams.get("token") === token;
}

// --- Edge caching ---

/** Default cache TTL: 24 hours in seconds */
export const CACHE_TTL = 60 * 60 * 24;

export interface CacheKeyOptions {
  /** Cache version — increment to invalidate on deploy */
  version: number;
  /** Additional params to include in the cache key */
  extraParams?: Record<string, string>;
}

/**
 * Build a cache key from a request, stripping the auth token
 * and adding version + extra params for cache invalidation.
 */
export function buildCacheKey(request: Request, opts: CacheKeyOptions): Request {
  const url = new URL(request.url);
  url.searchParams.delete("token");
  url.searchParams.set("_v", String(opts.version));
  if (opts.extraParams) {
    for (const [key, value] of Object.entries(opts.extraParams)) {
      url.searchParams.set(key, value);
    }
  }
  return new Request(url.toString(), { method: "GET" });
}

/**
 * Cache-then-compute wrapper. Checks edge cache first, then calls the handler
 * and stores the result.
 */
export async function withEdgeCache(
  request: Request,
  ctx: ExecutionContext,
  opts: CacheKeyOptions,
  handler: () => Promise<Response>
): Promise<Response> {
  const cacheKeyRequest = buildCacheKey(request, opts);
  const cache = caches.default;

  const cached = await cache.match(cacheKeyRequest);
  if (cached) return cached;

  const response = await handler();
  ctx.waitUntil(cache.put(cacheKeyRequest, response.clone()));
  return response;
}

// --- Response helpers ---

/** Create an ICS calendar response with proper headers. */
export function icsResponse(body: string, filename?: string): Response {
  const headers: Record<string, string> = {
    "Content-Type": "text/calendar; charset=utf-8",
    "Cache-Control": `public, max-age=${CACHE_TTL}`,
  };
  if (filename) {
    headers["Content-Disposition"] = `inline; filename="${filename}"`;
  }
  return new Response(body, { headers });
}

/** Create a JSON response with proper headers. */
export function jsonResponse(body: string, extraHeaders?: Record<string, string>): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${CACHE_TTL}`,
      ...extraHeaders,
    },
  });
}

/** Create an error response with the given status and message. */
export function errorResponse(status: number, message: string, json = false): Response {
  if (json) {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain" },
  });
}
