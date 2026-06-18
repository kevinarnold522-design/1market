# Vercel Deployment Guide

## 1. Create Supabase project

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Copy your Supabase project URL and keys.

Required Supabase values:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

## 2. Configure Cloudflare R2

Keep the existing R2 bucket and keys, then add these to Vercel:

- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_PUBLIC_BASE_URL` recommended for public asset URLs

The exported Vercel route is `api/uploadMediaToR2.js`.

## 3. Configure email

The exported email routes use Resend as the standard replacement for Base44 `Core.SendEmail`.

Add:
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `FEEDBACK_EMAIL=kevin@1marketph.com`

Routes using email:
- `/api/sendFeedback`
- `/api/sendOtp`
- `/api/sendWelcomeEmail`
- `/api/sendSellerWelcomeEmail`
- `/api/sendBusinessWelcomeEmail`
- `/api/sendVerifiedPartnerEmail`
- `/api/listingApprovalNotify`

## 4. Configure app runtime

Set this in Vercel to use Supabase instead of Base44 at runtime:

```bash
VITE_BACKEND_PROVIDER=supabase
```

Without this value, the app continues to use Base44, which is useful while testing inside Base44.

## 5. Optional AI provider

Base44 `Core.InvokeLLM` is not portable. To complete AI listing image analysis, choose a provider and configure one of:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

Then implement `api/analyzeListingImages.js` with your chosen provider.

## 6. Optional Stripe

If enabling payments on Vercel:

- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 7. Vercel project setup

1. Push this repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add all environment variables from `.env.example`.
7. Deploy.

## 8. Local development outside Base44

Create `.env.local` from `.env.example`, then run:

```bash
npm install
npm run dev
```

For local API route testing, use Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## 9. Database import notes

Base44 entity records must be exported separately and imported into Supabase. Keep a mapping file for old user IDs to Supabase Auth IDs. Records with ownership fields should be mapped to `created_by_id` for tenant isolation.

## 10. Verification checklist

- Home page loads from Vercel.
- Login/register works through Supabase.
- `base44.entities.*` compatibility calls resolve to Supabase when `VITE_BACKEND_PROVIDER=supabase`.
- Uploads go to Cloudflare R2.
- Email routes send through Resend.
- Admin-created user accounts appear in `users.created_by_admin_id`.
- User-owned records query only the active user's `created_by_id` where required.
- No production-only secret is exposed with a `VITE_` prefix except safe public keys.