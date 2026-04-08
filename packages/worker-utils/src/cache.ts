/**
 * Edge caching utilities for Cloudflare Workers.
 */

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
