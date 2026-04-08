/**
 * Validate token-based authentication from a query parameter.
 * Returns true if authenticated, false otherwise.
 */
export function authenticateToken(url: URL, token: string | undefined): boolean {
  if (!token) return false;
  return url.searchParams.get("token") === token;
}
