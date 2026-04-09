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
