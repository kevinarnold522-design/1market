# Base44 Dependency Audit

Audit date: 2026-06-18

## Summary

The project still contains Base44-specific imports and service calls. This migration adds a Supabase compatibility layer and Vercel API routes, but the frontend still uses the existing `base44` client name heavily. That is intentional for a phased migration: the runtime switch in `src/api/base44Client.js` chooses Supabase when `VITE_BACKEND_PROVIDER=supabase`.

## Remaining Base44 packages

Current package dependencies still include:

- `@base44/sdk`
- `@base44/vite-plugin`

These should remain during the transition so the current Base44 preview keeps working. Remove them only after the Vercel/Supabase deployment has replaced all Base44-only behavior.

## Remaining Base44 service surfaces

### Frontend entity calls
Pattern:

```js
base44.entities.EntityName.list/filter/create/update/delete
```

Replacement:

- Runtime compatibility: `src/api/supabaseCompatClient.js`
- Long-term cleanup: replace direct Base44 entity calls with typed Supabase service modules.

### Frontend auth calls
Pattern:

```js
base44.auth.me()
base44.auth.updateMe()
base44.auth.redirectToLogin()
base44.auth.logout()
```

Replacement:

- Runtime compatibility: `src/api/supabaseCompatClient.js`
- Long-term cleanup: use `supabase.auth.*` directly through a central auth provider.

### Backend function calls
Pattern:

```js
base44.functions.invoke('functionName', payload)
```

Replacement:

- Runtime compatibility: calls `/api/functionName` when `VITE_BACKEND_PROVIDER=supabase`.
- Ported routes are in `api/`.

### Base44 Core integrations
Patterns:

```js
base44.integrations.Core.SendEmail
base44.integrations.Core.InvokeLLM
base44.integrations.Core.UploadFile
```

Replacement status:

- SendEmail: replaced with Resend helper `api/_email.js`.
- UploadFile/media: replaced with Cloudflare R2 route `api/uploadMediaToR2.js`.
- InvokeLLM: requires a selected AI provider; `api/analyzeListingImages.js` is a placeholder.

## Highest-risk remaining app areas

These areas historically had the highest Base44 usage and should be tested first on Vercel:

1. Admin dashboard and created user accounts
2. Listing detail and listing CRUD
3. Seller dashboard/profile pages
4. Messaging
5. Notifications
6. Groups/community
7. Rewards/tasks
8. Upload and AI listing assistant flows

## Verification command

Run this locally to find remaining Base44 references:

```bash
grep -R "base44\|@base44\|createClientFromRequest\|Core\." -n src api functions --exclude-dir=node_modules
```

Expected during phased migration: references still exist in `src/`, but runtime should route them through the Supabase-compatible `base44` export when `VITE_BACKEND_PROVIDER=supabase`.

## Final removal checklist

Only remove Base44 after all items pass on Vercel:

- Set `VITE_BACKEND_PROVIDER=supabase`.
- Confirm auth/session flows with Supabase.
- Confirm every major entity list/create/update/delete flow.
- Confirm R2 uploads.
- Confirm emails via Resend.
- Confirm admin functions.
- Implement AI route replacement.
- Replace Base44 package imports and remove `@base44/sdk` / `@base44/vite-plugin`.