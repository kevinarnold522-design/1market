# Deploy Changelog

Date: 2026-06-24

## Summary
- Fixed listing publish/schema alignment issues for Supabase.
- Fixed admin edit and listing edit navigation flows.
- Added inline listing edit in My Listings.
- Removed legacy `owner_user_id` fallback usage from source code.
- Included ghost users in admin total user counts.

## Changes Included
- Publishing now writes `created_by_id` (Supabase-native ownership) and avoids invalid `owner_user_id` writes.
- Listing write pipelines sanitize non-schema fields into `metadata` for compatibility.
- Admin listing/business edit buttons now reliably open edit forms.
- My Listings edit now opens inline editor directly on the page.
- Added route for seller dashboard editor flow (`/seller-dashboard`).
- Seller dashboard supports query-param edit deep-linking and uses `created_by_id` ownership checks.
- Leaderboard cards are no longer clickable.
- Admin totals now merge local ghost accounts with remote users.

## Validation
- Static diagnostics: no new errors in edited files.
- Build: `npm run build` completed successfully (exit code 0).

## Deployment Notes
- Ensure latest Supabase edge functions are deployed:
  - `adminListingAction`
  - `supabasebase`
  - `supabaseEntityWrite`
- No destructive migrations required for this patch.
