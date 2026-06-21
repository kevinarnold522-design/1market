# 1MarketPH Supabase Functions

Deploy these functions with the Supabase CLI after setting project secrets:

```bash
supabase link --project-ref ksnzljothfoaefifevch
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase functions deploy adminViewMessages
supabase functions deploy listingApprovalNotify
supabase functions deploy createGhostAccount
supabase functions deploy sendFeedback
supabase functions deploy sendOtp
supabase functions deploy uploadMediaToR2
supabase functions deploy export1MarketphSql
```

The SQL export is in `migration/1marketph-transfer.sql`. Paste it into the Supabase SQL Editor to create the `1marketph` table and `1marketph` storage bucket and import all exported records.