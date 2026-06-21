# 1MarketPH Vercel Deployment Notes

Use the existing app with these environment variables in Vercel:

- `VITE_SUPABASE_URL=https://ksnzljothfoaefifevch.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key`
- `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key` for serverless API routes only
- Cloudflare R2 variables if uploads are handled by Vercel functions

The app already reads and writes through Supabase using `api/supabaseCompatClient.js`.