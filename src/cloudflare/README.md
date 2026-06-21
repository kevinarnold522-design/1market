# 1MarketPH Cloudflare/R2 Notes

The upload function uses Cloudflare R2 and the bucket should be named `1marketph` or configured with:

- `CLOUDFLARE_R2_BUCKET_NAME=1marketph`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_ACCOUNT_ID`

If using Cloudflare Pages, set the same Vite Supabase public variables used by Vercel.