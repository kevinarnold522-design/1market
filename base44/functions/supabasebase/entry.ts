import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

const tableMap = {
  User: 'users', Listing: 'listings', Business: 'businesses', Order: 'orders', Cart: 'carts', Favourite: 'favourites', Review: 'reviews',
  MenuItem: 'menu_items', Group: 'groups', GroupPost: 'group_posts', GroupComment: 'group_comments', GroupMember: 'group_members',
  GroupPostLike: 'group_post_likes', CommunityPost: 'community_posts', Notification: 'notifications', VerificationApplication: 'verification_applications',
  Follow: 'follows', Report: 'reports', ListingHeart: 'listing_hearts', ListingComment: 'listing_comments', Reservation: 'reservations',
  ChatMessage: 'chat_messages', DraftListing: 'draft_listings', SavedListingTemplate: 'saved_listing_templates', UserReward: 'user_rewards', UserTasks: 'user_tasks'
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function serviceHeaders(extra = {}) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}

function tableFor(entity) {
  const table = tableMap[entity];
  if (!table) throw new Error('Unsupported entity');
  return table;
}

function cleanPayload(input = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (['id', 'created_at', 'created_date', 'updated_at', 'updated_date'].includes(key)) continue;
    if (value !== undefined) clean[key] = value;
  }
  return clean;
}

async function readJson(response) {
  const text = await response.text();
  if (!response.ok) throw new Error(text || 'Supabase write failed');
  return text ? JSON.parse(text) : null;
}

function missingColumnFrom(text) {
  try {
    const data = JSON.parse(text || '{}');
    const match = String(data.message || '').match(/Could not find the '([^']+)' column/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

async function writeWithColumnRetry(url, options, body) {
  const payload = { ...(body || {}) };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const response = await fetch(url, { ...options, body: JSON.stringify(payload) });
    const text = await response.text();
    if (response.ok) return text ? JSON.parse(text) : null;
    const missing = missingColumnFrom(text);
    if (missing && missing in payload) {
      delete payload[missing];
      continue;
    }
    throw new Error(text || 'Supabase write failed');
  }
  throw new Error('Too many unsupported fields for Supabase write');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const email = (user?.email || '').toLowerCase();
    if (!user || (user.role !== 'admin' && email !== 'kevinarnold522@gmail.com')) {
      return Response.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    const { entity, action, id, patch, record, records, query } = await req.json();
    const table = tableFor(entity);
    let response;

    if (action === 'create') {
      const rows = await writeWithColumnRetry(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST', headers: serviceHeaders({ Prefer: 'return=representation' }),
      }, cleanPayload(record || patch || {}));
      return Response.json({ success: true, data: rows?.[0] || null }, { headers: corsHeaders });
    }

    if (action === 'bulkCreate') {
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST', headers: serviceHeaders({ Prefer: 'return=representation' }), body: JSON.stringify((records || []).map(cleanPayload)),
      });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows || [] }, { headers: corsHeaders });
    }

    if (action === 'update') {
      if (!id) return Response.json({ error: 'Missing record ID' }, { status: 400, headers: corsHeaders });
      const safePatch = { ...cleanPayload(patch || record || {}), updated_at: new Date().toISOString() };
      const rows = await writeWithColumnRetry(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`, {
        method: 'PATCH', headers: serviceHeaders({ Prefer: 'return=representation' }),
      }, safePatch);
      return Response.json({ success: true, data: rows?.[0] || null }, { headers: corsHeaders });
    }

    if (action === 'delete') {
      if (!id) return Response.json({ error: 'Missing record ID' }, { status: 400, headers: corsHeaders });
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE', headers: serviceHeaders(),
      });
      await readJson(response);
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (action === 'list') {
      const params = new URLSearchParams();
      params.set('select', '*');
      for (const [key, value] of Object.entries(query || {})) params.set(key, `eq.${value}`);
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, { headers: serviceHeaders() });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows || [] }, { headers: corsHeaders });
    }

    return Response.json({ error: 'Unsupported action' }, { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('[SUPABASEBASE_ERROR]', error.message);
    return Response.json({ error: error.message || 'Supabase admin action failed' }, { status: 500, headers: corsHeaders });
  }
});