# 1MarketPH Base44 → Vercel/Supabase/R2 Migration

This repository now contains a phased migration foundation that lets the app move from Base44-hosted services toward a Vercel deployment using Supabase for auth/database and Cloudflare R2 for media storage.

## Current migration status

### Added in this phase
- Vercel deployment configuration: `vercel.json`
- Environment template: `.env.example`
- Supabase browser client: `src/lib/supabaseClient.js`
- Base44-compatible Supabase adapter: `src/api/supabaseCompatClient.js`
- Runtime switch in `src/api/base44Client.js` using `VITE_BACKEND_PROVIDER=supabase`
- Vercel API route ports for key backend functions:
  - `api/uploadMediaToR2.js`
  - `api/sendFeedback.js`
  - `api/sendOtp.js`
  - `api/adminViewMessages.js`
  - `api/createGhostAccount.js`
  - `api/listingApprovalNotify.js`
  - `api/sendWelcomeEmail.js`
  - `api/sendSellerWelcomeEmail.js`
  - `api/sendBusinessWelcomeEmail.js`
  - `api/sendVerifiedPartnerEmail.js`
  - `api/autoWelcomeEmail.js`
  - `api/inviteUser.js`
  - `api/analyzeListingImages.js` placeholder for an AI provider
  - `api/health.js`
- Supabase schema migration: `supabase/migrations/001_initial_schema.sql`
- Migration/deployment docs: `VERCEL_DEPLOYMENT.md`, `MIGRATION.md`, `DEPENDENCY_AUDIT.md`

## What cannot be directly exported from Base44

Base44 is not just code hosting. The app currently depends on managed services that do not export as standalone Vercel code automatically:

1. **Base44 Auth**
   - Current usage: `base44.auth.me()`, `base44.auth.updateMe()`, `base44.auth.redirectToLogin()`, `base44.auth.logout()`.
   - Replacement: Supabase Auth.
   - Migration path: the compatibility client maps common auth calls to Supabase Auth, but login/register UI should be reviewed and fully tested against Supabase.

2. **Base44 Entities / Database**
   - Current usage: `base44.entities.EntityName.list/filter/create/update/delete`.
   - Replacement: Supabase Postgres tables.
   - Migration path: `supabase/migrations/001_initial_schema.sql` creates the first table set and RLS policies. The compatibility client maps entity calls to Supabase tables.

3. **Base44 Backend Function Runtime**
   - Current usage: `base44.functions.invoke('functionName', payload)`.
   - Replacement: Vercel API routes under `/api/functionName`.
   - Migration path: key functions have been ported into `api/`.

4. **Base44 Core Integrations**
   - `Core.SendEmail` → replaced with Resend in Vercel API routes.
   - `Core.UploadFile` → replaced previously with Cloudflare R2 and now exported as `api/uploadMediaToR2.js`.
   - `Core.InvokeLLM` → not portable without choosing an AI provider. `api/analyzeListingImages.js` is a placeholder that should be implemented with OpenAI, Gemini, or another provider.

5. **Base44 GitHub/hosting automation**
   - Repository sync and deployment workflows are platform-managed inside Base44.
   - Replacement: GitHub remote + Vercel project import.

## Phased migration plan

### Phase 1 — Foundation, schemas, API routes
Completed in this pass:
- Added Supabase adapter and Vercel config.
- Added Vercel API route equivalents for main backend functions.
- Added Supabase initial schema.
- Added docs and dependency audit.

### Phase 2 — Data export/import
Manual step required:
1. Export entity data from Base44 dashboard or API.
2. Transform records to snake_case table names where needed.
3. Import into Supabase tables.
4. Preserve user IDs where possible, or map old user IDs to new Supabase Auth IDs.

### Phase 3 — Auth cutover
1. Configure Supabase Auth providers.
2. Recreate existing users or invite them through Supabase.
3. Validate admin access rules.
4. Test created-user account flow against Supabase Auth.

### Phase 4 — Frontend service cutover
1. Set `VITE_BACKEND_PROVIDER=supabase` in Vercel.
2. Test all Base44-compatible calls through `src/api/base44Client.js`.
3. Replace remaining direct Base44-only integrations as shown in `DEPENDENCY_AUDIT.md`.

### Phase 5 — Production hardening
1. Tighten Supabase RLS policies table by table.
2. Add indexes for high-traffic queries.
3. Add API rate limiting for OTP, feedback, uploads, and admin endpoints.
4. Add observability in Vercel logs.
5. Replace the AI placeholder with the selected AI provider.

## Important recommendation

Do not remove Base44 dependencies from the live app until the Vercel deployment passes end-to-end tests. The current app can still run in Base44 by leaving `VITE_BACKEND_PROVIDER` unset. The Vercel version switches to Supabase by setting `VITE_BACKEND_PROVIDER=supabase`.