# Plan 009: Auth & Calendar Sync

## Context

The calendar app currently uses a bare `CALENDAR_TOKEN` query parameter for access control — anyone with the URL can see the calendar, and the token is visible in URLs. There's no user concept, no sessions, no database. All configuration (size, orientation, feeds, layout) lives in URL params. Images live in IndexedDB (browser-only, lost on device change).

This plan adds user identity, persistent calendars, and calendar sync from external providers. It has two phases: a local-first MVP that adds persistence without server infrastructure, and a full server-side auth system for multi-user access.

Read `CLAUDE.md` for full architecture context.

---

## Phase A: Local-First Persistence (MVP)

### Goal

Let users customize their calendar — pick feeds, paste ICS URLs, upload images — and have it all persist locally across page reloads. No auth, no server database. The public URL works as-is; state saves to the browser.

### Storage: localStorage + IndexedDB

Images already live in IndexedDB (`calendar-images` db). Extend this pattern:

- **localStorage** for small structured data (feed selections, custom feed URLs, config preferences)
- **IndexedDB** (existing) for images

#### localStorage Schema

```json
{
  "calendar-state": {
    "version": 1,
    "feeds": {
      "lunar:full": true,
      "lunar:new": true,
      "solar:season": true,
      "movies-theatrical": false,
      "holidays-us": true
    },
    "customFeeds": [
      {
        "id": "cf_1",
        "name": "Family Calendar",
        "url": "https://p70-caldav.icloud.com/published/2/...",
        "enabled": true
      },
      {
        "id": "cf_2",
        "name": "Kids School",
        "url": "https://example.com/school.ics",
        "enabled": true
      }
    ],
    "config": {
      "size": "letter",
      "orientation": "landscape",
      "layout": "single",
      "length": 12,
      "margin": "0.25in",
      "scaling": "fit",
      "gutter": "0.5in"
    }
  }
}
```

### Behavior Changes

1. **On page load:** Read `calendar-state` from localStorage. If present, use saved feed/config preferences instead of defaults. URL params still override (for sharing specific views).
2. **On config change:** Write updated state to localStorage. No page reload needed for feed toggles — use `history.replaceState()` to update URL and re-render.
3. **Custom feed URLs:** New section in config sidebar — "My Calendars" with:
   - Text input to paste an ICS URL
   - Name field (auto-populated from ICS `X-WR-CALNAME` if available)
   - Enable/disable toggle per custom feed
   - Remove button
4. **Priority:** URL params > localStorage > defaults. This means shared URLs still work as expected, but day-to-day use remembers your preferences.

### Custom Feed UX

In the config sidebar, below the existing feed toggles:

```
── My Calendars ──────────────────
  ✓ Family Calendar          [×]
  ✓ Kids School              [×]

  [paste ICS URL here...    ] [+]
──────────────────────────────────
```

Custom feed URLs are fetched server-side (same as existing `?feed=` param) to avoid CORS issues. The client sends them as `?feed=` params derived from localStorage.

### Data Flow

```
Page load
  → Read localStorage for saved state
  → Merge with URL params (URL wins on conflict)
  → Build ?include= and ?feed= params
  → Server fetches all feeds (existing pipeline, unchanged)
  → Render calendar
  → Client hydrates config sidebar from saved state

Config change (client-side)
  → Update localStorage
  → Update URL via replaceState
  → Reload page (structural changes) or re-render (toggles)
```

### Files to Create/Modify

| File | Change |
|------|--------|
| `apps/calendar/src/local-state.ts` | NEW — Read/write localStorage, merge with URL params |
| `apps/calendar/src/config.ts` | Load saved state on init, save on change |
| `apps/calendar/src/render-config.ts` | Add "My Calendars" section to sidebar |
| `apps/calendar/public/styles.css` | Styles for custom feed management UI |

### What This Enables

- Share the public `calendar.sea...` URL with family
- Each person's browser remembers their feed choices + custom ICS URLs
- Kids paste their iCloud shared calendar URL once, it persists
- Images already persist locally (IndexedDB)
- No server changes needed — pure client-side enhancement

### Limitations

- State is per-browser, per-device (no cross-device sync)
- Clearing browser data loses everything
- No auth — anyone with the URL sees the calendar (same as today)
- Custom feeds are fetched on every page load (no server-side caching of user feeds)

---

## Phase B: Server-Side Auth & Persistence

### Goal

Add user accounts via OAuth, persist calendars server-side, enable cross-device access, and gate the app behind authentication so it's not fully public.

### Auth Providers (Identity Only)

| Provider | Protocol | Why |
|----------|----------|-----|
| Sign in with Apple | OAuth 2.0 / OpenID Connect | Family already has Apple IDs |
| Fastmail | OAuth 2.0 / OpenID Connect | User's primary email provider |
| Google | OAuth 2.0 / OpenID Connect | Broadest reach for friends |

All three are identity-only — scopes limited to `openid email profile`. Calendar data comes from the feed system, not from auth providers.

### Connected Calendar Providers (Optional, Per-User)

Separate from login identity. A user signed in via Apple can connect Google Calendar for data:

| Provider | Protocol | Scope | Data Access |
|----------|----------|-------|-------------|
| Google Calendar | OAuth 2.0 | `calendar.readonly` | REST API v3 — list calendars, fetch events |
| Fastmail | OAuth 2.0 | `urn:ietf:params:jmap:calendars` | JMAP — CalendarEvent/query + get |
| iCloud | — | — | Public shared ICS URLs (no auth, treat as custom feed) |
| Any ICS URL | — | — | Paste URL (same as Phase A) |

### Infrastructure

**D1 Database** (Cloudflare serverless SQL):

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_login INTEGER NOT NULL,
  UNIQUE(provider, provider_id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE connected_providers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  scope TEXT,
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, provider)
);

CREATE TABLE calendars (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL DEFAULT 'My Calendar',
  year INTEGER NOT NULL,
  config_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE calendar_feeds (
  calendar_id TEXT NOT NULL REFERENCES calendars(id),
  feed_id TEXT NOT NULL,
  PRIMARY KEY (calendar_id, feed_id)
);

CREATE TABLE calendar_custom_feeds (
  id TEXT PRIMARY KEY,
  calendar_id TEXT NOT NULL REFERENCES calendars(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  enabled INTEGER DEFAULT 1
);

CREATE TABLE calendar_images (
  calendar_id TEXT NOT NULL REFERENCES calendars(id),
  slot TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  filename TEXT,
  scaling TEXT DEFAULT 'fit',
  uploaded_at INTEGER NOT NULL,
  PRIMARY KEY (calendar_id, slot)
);
```

**R2 Object Storage** for images:

```toml
# apps/calendar/wrangler.toml
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "calendar-images"
```

### Auth Routes

```
/auth/login              → Login page (provider buttons)
/auth/apple              → Initiate Sign in with Apple
/auth/apple/callback     → Apple OAuth callback
/auth/google             → Initiate Google OAuth
/auth/google/callback    → Google OAuth callback
/auth/fastmail           → Initiate Fastmail OAuth
/auth/fastmail/callback  → Fastmail OAuth callback
/auth/logout             → Clear session, redirect to login
```

### Access Tiers

| Route | Access |
|-------|--------|
| `/auth/*`, `/styleguide`, `/favicon.ico` | Public |
| `/feeds/*.ics?token=` | Token auth (for ICS subscribers) |
| `/:year`, `/:year/:month`, `/config/*` | Session cookie (OAuth) or `?token=` fallback |

### Auth Flow

1. Visitor hits any calendar route without session → redirect to `/auth/login`
2. Login page shows "Sign in with Apple / Google / Fastmail"
3. OAuth flow → callback creates user + session in D1
4. `__session` cookie set (HttpOnly, Secure, SameSite=Lax, 30-day expiry)
5. Redirect to original URL
6. Session middleware validates cookie on subsequent requests

### Security

- OAuth tokens encrypted at rest (AES-GCM via Web Crypto API)
- `ENCRYPTION_KEY` secret for token encryption
- PKCE for all OAuth flows
- CSRF protection via HMAC-signed OAuth state parameter
- Session cookies: HttpOnly, Secure, SameSite=Lax

### Saved Calendars

Authenticated users get:
- Multiple saved calendars (e.g., "Family 2026", "Gift for Grandma")
- Config, feeds, custom URLs, images all persist server-side
- Cross-device access — sign in anywhere, same calendars
- Dashboard listing saved calendars

### Migration from Phase A

Phase A localStorage state can be imported into Phase B:
- On first authenticated visit, check for `calendar-state` in localStorage
- Offer to import saved feeds, custom URLs, and config into a new server-side calendar
- Copy IndexedDB images to R2
- Clear localStorage after successful import

### Secrets to Configure

```bash
npx wrangler secret put ENCRYPTION_KEY
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put FASTMAIL_CLIENT_ID
npx wrangler secret put FASTMAIL_CLIENT_SECRET
# Apple Sign In uses a different credential model (key file + team ID)
```

### New Files (Phase B)

| File | Purpose |
|------|---------|
| `apps/calendar/src/auth/session.ts` | Session creation, validation, cookie handling |
| `apps/calendar/src/auth/oauth-apple.ts` | Sign in with Apple flow |
| `apps/calendar/src/auth/oauth-google.ts` | Google OAuth flow |
| `apps/calendar/src/auth/oauth-fastmail.ts` | Fastmail OAuth flow |
| `apps/calendar/src/auth/db.ts` | D1 queries for users, sessions, tokens |
| `apps/calendar/src/auth/crypto.ts` | AES-GCM encrypt/decrypt for OAuth tokens |
| `apps/calendar/src/providers/google-calendar.ts` | Google Calendar API client |
| `apps/calendar/src/providers/fastmail-calendar.ts` | Fastmail JMAP calendar client |
| `apps/calendar/src/render-login.ts` | Login page HTML renderer |
| `apps/calendar/src/render-dashboard.ts` | Calendar list / dashboard renderer |

---

## Implementation Order

| Step | Phase | What | Depends on |
|------|-------|------|-----------|
| 1 | A | localStorage state management (`local-state.ts`) | — |
| 2 | A | Config sidebar: load/save from localStorage | Step 1 |
| 3 | A | "My Calendars" section: paste ICS URLs | Step 2 |
| 4 | A | URL param ↔ localStorage merge logic | Step 1 |
| 5 | B | D1 database setup + schema | Cloudflare account |
| 6 | B | Session management (cookie + D1) | Step 5 |
| 7 | B | Sign in with Apple OAuth | Step 6, Apple Developer setup |
| 8 | B | Auth middleware + login page | Step 6 |
| 9 | B | Google + Fastmail OAuth | Step 6 |
| 10 | B | Saved calendar CRUD (D1) | Step 6 |
| 11 | B | R2 image upload/serving | Step 10 |
| 12 | B | localStorage → D1 migration | Steps 4 + 10 |
| 13 | B | Google Calendar API client | Step 9 |
| 14 | B | Fastmail JMAP calendar client | Step 9 |
| 15 | B | Connected provider management UI | Steps 13/14 |
