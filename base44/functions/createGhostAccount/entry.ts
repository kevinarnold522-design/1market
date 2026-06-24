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

function missingColumnFrom(text) {
  try {
    const data = JSON.parse(text || '{}');
    const match = String(data.message || '').match(/Could not find the '([^']+)' column/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

async function insertUser(row) {
  const payload = { ...(row || {}) };
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
      method: 'POST',
      headers: serviceHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    if (response.ok) {
      const rows = text ? JSON.parse(text) : [];
      return rows[0];
    }
    const missing = missingColumnFrom(text);
    if (missing && missing in payload) {
      delete payload[missing];
      continue;
    }
    throw new Error(text || 'Failed to create user');
  }
  throw new Error('Too many unsupported user fields');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const adminUser = await getRequestUser(req);
    const isAdmin = adminUser?.role === 'admin' || adminUser?.email?.toLowerCase() === OWNER_EMAIL;
    if (!isAdmin) return Response.json({ error: 'Admin access required' }, { status: 403, headers: corsHeaders });

    const { full_name, channel_name, user_type, business_name, location, bio, seller_area, username: requestedUsername, phone } = await req.json();
    if (!full_name || !full_name.trim()) return Response.json({ error: 'Display name is required' }, { status: 400, headers: corsHeaders });

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ghostId = `ghost_${timestamp}_${randomStr}`;
    const ghostEmail = `${ghostId}@1marketph-ghost.internal`;
    const usernameBase = requestedUsername || channel_name || full_name || ghostId;
    const usernameSlug = String(usernameBase).toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 22) || 'ghost';
    const username = `${usernameSlug}_${randomStr}`;
    const normalizedType = user_type || 'seller';
    const isSeller = normalizedType !== 'customer';

    const user = await insertUser({
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      email: ghostEmail,
      username,
      username_set: true,
      role: 'user',
      user_type: normalizedType,
      is_seller: isSeller,
      account_type: normalizedType === 'business' ? 'business_owner' : (isSeller ? 'seller' : 'customer'),
      business_name: business_name?.trim() || channel_name?.trim() || full_name.trim(),
      seller_location: location || 'Manila',
      location: location || 'Manila',
      seller_area: seller_area || '',
      phone: phone || '',
      seller_page_enabled: isSeller,
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      ghost_linked: false,
      created_by_admin_email: adminUser.email || '',
      bio: bio || '',
      seller_bio: bio || '',
      profile_picture: '',
      cover_photo: '',
      is_verified_seller: false,
      verification_submitted: false,
      seller_pending: false,
      business_pending: false,
      seller_products: [],
      business_categories: []
    });

    return Response.json({ success: true, user, profile_url: `/seller/${user.id}`, message: 'Live user created successfully' }, { headers: corsHeaders });
  } catch (error) {
    console.error('[GHOST_CREATE_ERROR]', error.message);
    return Response.json({ error: 'Failed to create ghost account', details: error.message }, { status: 500, headers: corsHeaders });
  }
});