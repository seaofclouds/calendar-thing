/**
 * Feed worker factory — shared routing, auth, and caching for feed workers.
 * Each feed defines its routes and handlers; the factory handles the boilerplate.
 */

import { authenticateToken } from "./worker";
import { withEdgeCache } from "./worker";
import type { CacheKeyOptions } from "./worker";

export interface FeedRoute {
  path: string;
  handler: (request: Request, env: any, ctx: ExecutionContext) => Promise<Response>;
}

export interface FeedWorkerConfig {
  /** Display name shown at the health-check root */
  name: string;
  /** Cache version — increment to invalidate on deploy */
  cacheVersion: number;
  /** Route definitions — path + handler pairs */
  routes: FeedRoute[];
  /** Extra cache key params applied to all routes (e.g. { _y: year }) */
  cacheParams?: (request: Request) => Record<string, string> | undefined;
}

export function createFeedWorker(config: FeedWorkerConfig): ExportedHandler {
  return {
    async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
      const url = new URL(request.url);

      // Health check — no auth required
      if (url.pathname === "/") {
        return new Response(`${config.name}\n`, {
          headers: { "Content-Type": "text/plain" },
        });
      }

      // Find matching route
      const route = config.routes.find((r) => r.path === url.pathname);
      if (!route) {
        return new Response("Not Found", { status: 404 });
      }

      // Token authentication
      if (!authenticateToken(url, env.CALENDAR_TOKEN)) {
        return new Response("Unauthorized", { status: 401 });
      }

      // Cache + handler
      const cacheOpts: CacheKeyOptions = {
        version: config.cacheVersion,
        extraParams: config.cacheParams?.(request),
      };

      return withEdgeCache(request, ctx, cacheOpts, () =>
        route.handler(request, env, ctx),
      );
    },
  };
}
