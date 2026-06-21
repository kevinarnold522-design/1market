const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

function serviceHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
}

async function insertUser(row) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, { method: 'POST', headers: serviceHeaders(), body: JSON.stringify(row) });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return rows[0];
}

Deno.serve(async (req) => {
  try {
    const { full_name, channel_name, user_type, business_name, location, bio, seller_area, admin_email } = await req.json();
    if (!full_name || !full_name.trim()) return Response.json({ error: 'Display name is required' }, { status: 400 });

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ghostId = `ghost_${timestamp}_${randomStr}`;
    const ghostEmail = `${ghostId}@1marketph-ghost.internal`;
    const username = ghostId.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const user = await insertUser({
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      email: ghostEmail,
      username,
      username_set: true,
      user_type: user_type || 'seller',
      is_seller: user_type !== 'customer',
      account_type: user_type === 'business' ? 'business_owner' : 'customer',
      business_name: business_name?.trim() || full_name.trim(),
      seller_location: location || 'Manila',
      location: location || 'Manila',
      seller_area: seller_area || '',
      seller_page_enabled: user_type !== 'customer',
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      ghost_linked: false,
      created_by_admin_email: admin_email || '',
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

    return Response.json({ success: true, user, profile_url: `/seller/${user.id}`, message: 'Ghost account created successfully' });
  } catch (error) {
    console.error('[GHOST_CREATE_ERROR]', error.message);
    return Response.json({ error: 'Failed to create ghost account', details: error.message }, { status: 500 });
  }
});