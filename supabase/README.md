# Supabase Setup

1. Create a Supabase project.
2. Apply `migrations/001_initial_schema.sql`.
3. Enable email auth in Supabase Auth.
4. Add the Supabase URL and keys to Vercel.
5. Import exported Base44 data into matching tables.

## Ownership and tenant isolation

Most tenant-owned tables include `created_by_id`. The Vercel migration should write the active Supabase user ID to this field when creating user-owned records.

Admin-created accounts are tracked in `users.created_by_admin_id` and `users.created_by_admin_email`.

## RLS

The initial migration enables core RLS policies for users, listings, businesses, messages, and notifications. Add stricter policies table-by-table as each flow is validated.