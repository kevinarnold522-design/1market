const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

const TABLES = [
  'listings', 'businesses', 'orders', 'carts', 'favourites', 'reviews', 'menu_items', 'groups', 'group_posts',
  'group_comments', 'group_members', 'group_post_likes', 'community_posts', 'notifications', 'verification_applications',
  'follows', 'reports', 'listing_hearts', 'listing_comments', 'reservations', 'chat_messages', 'draft_listings',
  'saved_listing_templates', 'user_rewards', 'user_tasks'
];

function serviceHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}` };
}

function entityName(table) {
  return table.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('').replace('Favourites', 'Favourite');
}

function esc(value) {
  return String(value ?? '').replace(/'/g, "''");
}

function mediaUrls(row) {
  const keys = ['image_url', 'extra_images', 'video_url', 'preview_media', 'cover_image', 'logo_url', 'profile_picture', 'cover_photo', 'doc1_url', 'doc2_url', 'doc3_url', 'listing_image'];
  const urls = [];
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) urls.push(...value.filter(Boolean));
    else if (typeof value === 'string' && value) urls.push(value);
  }
  return [...new Set(urls)];
}

async function readTable(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers: serviceHeaders() });
  if (!response.ok) return [];
  return await response.json();
}

Deno.serve(async () => {
  try {
    let sql = `-- 1MarketPH full Supabase transfer export\n-- Paste this into Supabase SQL Editor.\n\nbegin;\n\ninsert into storage.buckets (id, name, public)\nvalues ('1marketph', '1marketph', true)\non conflict (id) do update set public = excluded.public;\n\ncreate table if not exists public."1marketph" (\n  id uuid primary key default gen_random_uuid(),\n  entity_name text not null,\n  legacy_id text,\n  title text,\n  user_email text,\n  data jsonb not null default '{}'::jsonb,\n  media_urls text[] not null default '{}',\n  created_at timestamptz,\n  updated_at timestamptz,\n  imported_at timestamptz not null default now(),\n  unique(entity_name, legacy_id)\n);\n\ncreate index if not exists idx_1marketph_entity_name on public."1marketph" (entity_name);\ncreate index if not exists idx_1marketph_data_gin on public."1marketph" using gin (data);\n\n`;

    for (const table of TABLES) {
      const rows = await readTable(table);
      for (const row of rows) {
        const entity = entityName(table);
        const title = row.title || row.name || row.business_name || row.listing_title || '';
        const email = row.user_email || row.email || row.email_contact || row.seller_email || row.buyer_email || row.author_email || row.guest_email || row.created_by || '';
        const urls = mediaUrls(row);
        sql += `insert into public."1marketph" (entity_name, legacy_id, title, user_email, data, media_urls, created_at, updated_at) values ('${esc(entity)}', '${esc(row.id || '')}', '${esc(title)}', '${esc(email)}', '${esc(JSON.stringify(row))}'::jsonb, array[${urls.map((url) => `'${esc(url)}'`).join(',')}]::text[], ${row.created_at ? `'${esc(row.created_at)}'::timestamptz` : 'null'}, ${row.updated_at ? `'${esc(row.updated_at)}'::timestamptz` : 'null'}) on conflict (entity_name, legacy_id) do update set title = excluded.title, user_email = excluded.user_email, data = excluded.data, media_urls = excluded.media_urls, updated_at = excluded.updated_at;\n`;
      }
    }

    sql += `\ncommit;\n\n-- Read all rows:\n-- select * from public."1marketph" order by imported_at desc;\n`;

    return new Response(sql, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="1marketph-transfer.sql"'
      }
    });
  } catch (error) {
    console.error('export1MarketphSql error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});