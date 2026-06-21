const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const allowedFields = [
  'full_name','username','username_set','bio','seller_bio','phone','location','seller_location','seller_area','channel_name',
  'profile_picture','profile_photos','cover_photo','cover_photos','social_facebook','social_instagram','social_tiktok','social_youtube',
  'social_viber','social_telegram','show_phone_public','show_email_public','paypal_email','gcash_number','business_name','business_type',
  'business_categories','seller_products','seller_page_enabled','facebook_page_id','facebook_page_name','facebook_live_enabled'
];

function serviceHeaders(extra = {}) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}

async function getAuthUser(req) {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: serviceHeaders({ Authorization: `Bearer ${token}` }),
  });
  if (!response.ok) return null;
  return response.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    const authUser = await getAuthUser(req);
    if (!authUser?.id) return Response.json({ error: 'Not authenticated' }, { status: 401, headers: corsHeaders });

    const { patch = {} } = await req.json();
    const clean = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = patch[key];
    }
    clean.updated_at = new Date().toISOString();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(authUser.id)}&select=*`, {
      method: 'PATCH',
      headers: serviceHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(clean),
    });
    if (!response.ok) throw new Error(await response.text());
    const rows = await response.json();
    return Response.json({ success: true, user: rows[0] || null }, { headers: corsHeaders });
  } catch (error) {
    console.error('[PROFILE_UPDATE_ERROR]', error.message);
    return Response.json({ error: error.message || 'Profile update failed' }, { status: 500, headers: corsHeaders });
  }
});