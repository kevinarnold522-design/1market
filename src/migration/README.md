# 1MarketPH Migration Files

- `1marketph-transfer.sql` — copy/paste this into Supabase SQL Editor to create the `public."1marketph"` universal data table, create the `1marketph` storage bucket, and import all exported rows.
- Records exported: listings, businesses, orders, favourites, follows, and all other currently empty entities.

After pasting the SQL, read rows with:

```sql
select * from public."1marketph" order by imported_at desc;
select * from public."1marketph" where entity_name = 'Listing';
``