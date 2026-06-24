const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';
const OWNER_EMAIL = 'kevinarnold522@gmail.com';

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

async function getRequestUser(req) {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
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

function cleanUserPatch(patch = {}) {
  const allowed = [
    'role', 'user_type', 'is_seller', 'account_type', 'business_pending',
    'business_name', 'channel_name', 'is_verified_seller', 'verification_submitted',
    'ghost_linked', 'is_ghost_account', 'email', 'seller_page_enabled',
    'seller_pending', 'member_type', 'seller_location', 'location', 'phone',
    'username', 'username_set', 'ghost_id', 'is_connected_account'
  ];
  const clean = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = patch[key];
  }
  return clean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

    const adminUser = await getRequestUser(req);
    if (!isAdmin(adminUser)) return Response.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders });

    const { action, id, patch = {} } = await req.json();

    if (action === 'list') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&limit=2000`, { headers: serviceHeaders() });
      const users = await readJson(response) || [];
      users.sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0));
      return Response.json({ success: true, users }, { headers: corsHeaders });
    }

    if (!id) return Response.json({ error: 'Missing user id' }, { status: 400, headers: corsHeaders });

    if (action === 'delete') {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: serviceHeaders(),
      });
      await readJson(response);
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (action !== 'update') return Response.json({ error: 'Unsupported action' }, { status: 400, headers: corsHeaders });

    const cleanPatch = cleanUserPatch(patch);
    const rows = await writeWithColumnRetry(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}&select=*`, {
      method: 'PATCH',
      headers: serviceHeaders({ Prefer: 'return=representation' }),
    }, cleanPatch);

    return Response.json({ success: true, user: rows?.[0] || { id, ...cleanPatch } }, { headers: corsHeaders });
  } catch (error) {
    console.error('[ADMIN_UPDATE_USER_ERROR]', error.message);
    return Response.json({ error: error.message || 'Admin user update failed' }, { status: 500, headers: corsHeaders });
  }
});