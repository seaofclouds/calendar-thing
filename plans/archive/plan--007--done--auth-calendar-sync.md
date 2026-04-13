# Phase 7: Auth & Calendar Sync

## Context

The calendar app currently uses a bare `CALENDAR_TOKEN` query parameter for access control -- anyone with the URL can see the calendar, and the token is visible in URLs. There's no user concept, no sessions, no database.

This phase adds two connected features:
- **Phase 7A:** Session-based auth via OAuth (Google, Fastmail) replacing the token-in-URL pattern
- **Phase 7B:** Calendar sync -- fetch events from users' own Google Calendar and Fastmail calendars

The user model is single-user for now, but architected for multi-user so friends can generate their own calendars later. Google is the first provider (most common), followed by Fastmail (user's primary provider). iCloud/CalDAV is deferred due to complexity.

Read `CLAUDE.md` for full architecture context. Auth logic is in `shared/src/worker.ts` (`authenticateToken()`), routing in `apps/calendar/src/index.ts`, config sidebar in `render-config.ts`.

---

## Phase 7A: Session-Based Auth

### Infrastructure: D1 Database

D1 (Cloudflare's serverless SQL) is preferred over KV because:
- Users, sessions, and OAuth tokens have relational structure
- Need to query tokens by user ID and provider
- SQL simplifies token refresh and expiry logic

Add to `apps/calendar/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "calendar-auth"
database_id = "<created-via-wrangler-d1-create>"
```

Create the database: `npx wrangler d1 create calendar-auth`

### Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  provider TEXT NOT NULL,        -- 'google' or 'fastmail'
  provider_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login INTEGER NOT NULL,
  UNIQUE(provider, provider_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,           -- random 32-byte hex token
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,    -- AES-GCM encrypted
  refresh_token TEXT,            -- AES-GCM encrypted
  token_type TEXT NOT NULL,
  scope TEXT,
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, provider)
);
```

### New Routes

```
/auth/login              -> Login page with provider buttons
/auth/google             -> Initiate Google OAuth 2.0 + PKCE
/auth/google/callback    -> Google OAuth callback
/auth/fastmail           -> Initiate Fastmail OAuth 2.0
/auth/fastmail/callback  -> Fastmail OAuth callback
/auth/logout             -> Clear session cookie, redirect to login
```

### Auth Flow

1. User visits any calendar route without a valid session cookie
2. Auth middleware checks `__session` cookie, validates against D1 sessions table
3. If no valid session, redirect to `/auth/login?redirect=<original-url>`
4. Login page shows two buttons: "Sign in with Google", "Sign in with Fastmail"
5. User clicks provider -> redirect to OAuth authorization URL with state + PKCE verifier
6. Provider redirects to callback URL with authorization code
7. Callback handler:
   - Exchanges code for tokens (access + refresh)
   - Fetches user profile (email, name)
   - Creates or updates user in D1
   - Encrypts tokens and stores in D1
   - Creates session record in D1
   - Sets `__session` cookie (HttpOnly, Secure, SameSite=Lax, 30-day expiry)
   - Redirects to the original URL (from OAuth state parameter)

### Auth Middleware

In `apps/calendar/src/index.ts`, add middleware before all routes except public paths:

```typescript
// Public routes -- no auth required
const PUBLIC_PATHS = ["/auth/", "/favicon.ico", "/styleguide"];

// In fetch() handler:
if (!PUBLIC_PATHS.some(p => path.startsWith(p))) {
  const session = await validateSession(request, env.DB);
  if (!session) {
    const redirect = encodeURIComponent(path + url.search);
    return Response.redirect(new URL(`/auth/login?redirect=${redirect}`, url.origin).toString(), 302);
  }
}
```

### Backward Compatibility

The existing `?token=CALENDAR_TOKEN` query param continues to work as a fallback:
- Feed proxy routes (`/feeds/*.ics?token=`) -- still validated against `env.CALENDAR_TOKEN`
- Direct URL access with token -- accepted as alternative to session cookie
- Service binding calls (`hostname === "internal"`) -- unchanged, bypass all auth

### Provider Details

**Google OAuth 2.0:**
- Authorization: `https://accounts.google.com/o/oauth2/v2/auth`
- Token exchange: `https://oauth2.googleapis.com/token`
- User info: `https://www.googleapis.com/oauth2/v2/userinfo`
- Scopes: `openid email profile` (add `https://www.googleapis.com/auth/calendar.readonly` for Phase 7B)
- Secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Requires Google Cloud Console project with OAuth consent screen

**Fastmail OAuth 2.0:**
- Discovery: `https://www.fastmail.com/.well-known/openid-configuration`
- Authorization: `https://www.fastmail.com/oauth/authorize`
- Token exchange: `https://www.fastmail.com/oauth/token`
- User info: JMAP session at `https://api.fastmail.com/jmap/session`
- Scopes: `openid email profile` (add `urn:ietf:params:jmap:calendars` for Phase 7B)
- Secrets: `FASTMAIL_CLIENT_ID`, `FASTMAIL_CLIENT_SECRET`

### Security

- OAuth tokens encrypted at rest using AES-GCM via Web Crypto API (available in CF Workers)
- Encryption key stored as `ENCRYPTION_KEY` secret
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax`
- CSRF protection: OAuth state parameter with HMAC signature
- PKCE (Proof Key for Code Exchange) for OAuth flows

### New Files

| File | Purpose |
|------|---------|
| `apps/calendar/src/auth/session.ts` | Session creation, validation, cookie get/set |
| `apps/calendar/src/auth/oauth-google.ts` | Google OAuth 2.0 flow (authorize + callback) |
| `apps/calendar/src/auth/oauth-fastmail.ts` | Fastmail OAuth 2.0 flow (authorize + callback) |
| `apps/calendar/src/auth/db.ts` | D1 queries for users, sessions, oauth_tokens |
| `apps/calendar/src/auth/crypto.ts` | AES-GCM encrypt/decrypt for tokens |
| `apps/calendar/src/render-login.ts` | Login page HTML renderer |

### Modified Files

| File | Change |
|------|--------|
| `apps/calendar/wrangler.toml` | Add D1 binding, new secrets |
| `apps/calendar/src/index.ts` | Auth middleware, `/auth/*` routes, expanded `Env` interface |
| `apps/calendar/public/styles.css` | Login page styles |

### Env Interface Changes

```typescript
interface Env {
  // Existing
  ASTRONOMY: Fetcher;
  MOVIE_RELEASE: Fetcher;
  ASTROLOGY: Fetcher;
  CALENDAR_TOKEN?: string;
  // New -- Phase 7A
  DB: D1Database;
  ENCRYPTION_KEY: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  FASTMAIL_CLIENT_ID?: string;
  FASTMAIL_CLIENT_SECRET?: string;
}
```

### Verification (Phase 7A)

1. Visit `/2026` without session cookie -- redirected to `/auth/login`
2. Login page shows "Sign in with Google" and "Sign in with Fastmail" buttons
3. Click "Sign in with Google" -- redirected to Google consent screen
4. Complete Google OAuth -- redirected back, session cookie set, calendar renders
5. Refresh page -- still authenticated (session cookie valid)
6. Visit `/auth/logout` -- session cleared, redirected to login
7. Visit `/2026?token=CALENDAR_TOKEN` -- still works (backward compat)
8. Feed proxy `/feeds/astronomy.ics?token=...` -- still works
9. `pnpm typecheck` passes

---

## Phase 7B: Calendar Sync

### Architecture

Calendar sync fetches events from connected providers directly in the calendar app worker (not as separate feed workers). This is because:
- Data is user-specific and can't be shared/cached across users
- OAuth tokens live in the calendar app's D1 database
- No benefit to a separate worker for per-user data

User calendar events merge into the existing render pipeline alongside feed events (astronomy, movies, etc.).

### Provider Calendar Clients

**Google Calendar API:**
- Endpoint: `GET https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- Params: `timeMin`, `timeMax`, `singleEvents=true`, `orderBy=startTime`
- Returns JSON with `items[]` containing `start`, `end`, `summary`, `description`
- Calendar list: `GET https://www.googleapis.com/calendar/v3/users/me/calendarList`
- Token refresh: `POST https://oauth2.googleapis.com/token` with `refresh_token` + `grant_type=refresh_token`

**Fastmail JMAP:**
- Session discovery: `GET https://api.fastmail.com/jmap/session` (returns API URL + capabilities)
- Calendar events: POST to JMAP API with `CalendarEvent/query` + `CalendarEvent/get` method calls
- JSON-based protocol, simpler than CalDAV
- Token refresh: standard OAuth refresh flow

### Data Flow

1. Auth middleware validates session, loads user from D1
2. If user has connected providers, fetch their calendar list + events
3. Convert provider events to `CalendarEvent[]` format (same as feed events)
4. Merge with feed events before rendering
5. Cache results in D1 to avoid hitting provider APIs on every page load

### Caching

Add a D1 table for cached calendar data:

```sql
CREATE TABLE calendar_cache (
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  year_month TEXT NOT NULL,       -- "2026-04"
  events_json TEXT NOT NULL,      -- JSON array of CalendarEvent
  fetched_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, provider, year_month)
);
```

- Cache TTL: 15 minutes
- On page load: serve cached data immediately, trigger background refresh via `ctx.waitUntil()` if stale
- Manual "Refresh" button in config sidebar

### User Calendar Preferences

Add a D1 table for per-user calendar visibility:

```sql
CREATE TABLE user_calendars (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  provider_calendar_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,                     -- CSS color for events
  enabled INTEGER DEFAULT 1,     -- toggle visibility
  UNIQUE(user_id, provider, provider_calendar_id)
);
```

### Config Sidebar: Calendars Section

Add a "Calendars" section to the config sidebar (in `render-config.ts`) showing:
- Connected providers with status (Google: connected, Fastmail: not connected)
- Per-calendar toggles (show/hide individual calendars)
- "Connect" buttons for unconnected providers
- Calendar color indicators

### Integration with Render Pipeline

In `apps/calendar/src/index.ts`, after fetching feed events, add user calendar events:

```typescript
// Existing feed event fetching...
const feedEvents = await fetchFeeds(env, params);

// New: user calendar events
let userEvents: CalendarEvent[] = [];
if (session?.userId) {
  userEvents = await fetchUserCalendars(session.userId, env.DB, params.year, params.month);
}

// Merge all events
const allEvents = [...feedEvents, ...userEvents];
```

### New Files

| File | Purpose |
|------|---------|
| `apps/calendar/src/providers/types.ts` | Shared types for provider calendar data |
| `apps/calendar/src/providers/google-calendar.ts` | Google Calendar API client |
| `apps/calendar/src/providers/fastmail-calendar.ts` | Fastmail JMAP calendar client |

### Modified Files

| File | Change |
|------|--------|
| `apps/calendar/src/index.ts` | Merge user calendar events into render pipeline |
| `apps/calendar/src/render-config.ts` | Add "Calendars" section to sidebar |
| `apps/calendar/src/client.ts` | Calendar toggle handlers, connect/disconnect buttons |
| `apps/calendar/public/styles.css` | Calendar management UI styles |

### Verification (Phase 7B)

1. Visit `/config/2026/04` -- "Calendars" section in sidebar shows connected providers
2. Google calendars listed with toggles
3. Toggle a calendar on -- events from Google Calendar appear in month view
4. Events display with calendar's assigned color
5. Page loads fast (cached data), background refresh triggered if stale
6. Click "Refresh" -- fresh data fetched from provider
7. Token refresh works transparently when access token expires
8. `pnpm typecheck` passes

---

## Implementation Order

| Step | What | Depends on |
|------|------|-----------|
| 7A-1 | D1 database setup + schema | Cloudflare account |
| 7A-2 | Session management (cookie + D1) | 7A-1 |
| 7A-3 | Google OAuth flow | 7A-2, Google Cloud Console setup |
| 7A-4 | Auth middleware + login page | 7A-2, 7A-3 |
| 7A-5 | Fastmail OAuth flow | 7A-2 |
| 7B-1 | Google Calendar API client | 7A-3 |
| 7B-2 | Fastmail JMAP client | 7A-5 |
| 7B-3 | Calendar cache + preferences | 7A-1 |
| 7B-4 | Config sidebar calendar management | 7B-1 or 7B-2 |
| 7B-5 | Render pipeline integration | 7B-1 or 7B-2 |

### Secrets to configure

```bash
npx wrangler secret put ENCRYPTION_KEY
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put FASTMAIL_CLIENT_ID
npx wrangler secret put FASTMAIL_CLIENT_SECRET
```
