const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';
const OWNER_EMAIL = 'kevinarnold522@gmail.com';

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

async function getRequestUser(req, body = {}) {
  const token = body.supabase_access_token || (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: serviceHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!authResponse.ok) return null;
  const authUser = await authResponse.json();
  if (!authUser?.id) return null;
  const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(authUser.id)}&select=*`, {
    headers: serviceHeaders(),
  });
  if (!profileResponse.ok) throw new Error(await profileResponse.text());
  const profiles = await profileResponse.json();
  return profiles[0] || { id: authUser.id, email: authUser.email };
}

function isAdmin(user) {
  return user?.role === 'admin' || user?.email?.toLowerCase() === OWNER_EMAIL;
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
  if (!response.ok) throw new Error(text || 'Supabase request failed');
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
  for (let attempt = 0; attempt < 16; attempt += 1) {
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

    const body = await req.json();
    const adminUser = await getRequestUser(req, body);
    if (!isAdmin(adminUser)) return Response.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders });

    const { entity, action, id, patch, record, records, query } = body;
    const table = tableFor(entity);

    if (action === 'create') {
      const rows = await writeWithColumnRetry(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST', headers: serviceHeaders({ Prefer: 'return=representation' }),
      }, cleanPayload(record || patch || {}));
      return Response.json({ success: true, data: rows?.[0] || null }, { headers: corsHeaders });
    }

    if (action === 'bulkCreate') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST',
        headers: serviceHeaders({ Prefer: 'return=representation' }),
        body: JSON.stringify((records || []).map(cleanPayload)),
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
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE', headers: serviceHeaders(),
      });
      await readJson(response);
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (action === 'list') {
      const params = new URLSearchParams();
      params.set('select', '*');
      params.set('limit', '2000');
      for (const [key, value] of Object.entries(query || {})) params.set(key, `eq.${value}`);
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, { headers: serviceHeaders() });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows || [] }, { headers: corsHeaders });
    }

    return Response.json({ error: 'Unsupported action' }, { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('[SUPABASEBASE_ERROR]', error.message);
    return Response.json({ error: error.message || 'Supabase admin action failed' }, { status: 500, headers: corsHeaders });
  }
});