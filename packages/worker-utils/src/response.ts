import { CACHE_TTL } from "./cache";

/**
 * Create an ICS calendar response with proper headers.
 */
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

/**
 * Create a JSON response with proper headers.
 */
export function jsonResponse(body: string, extraHeaders?: Record<string, string>): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${CACHE_TTL}`,
      ...extraHeaders,
    },
  });
}

/**
 * Create an error response with the given status and message.
 */
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
