import { createClient } from '@supabase/supabase-js';

function adminClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase service role is not configured');
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const db = adminClient();
    const { full_name, channel_name, user_type = 'seller', business_name, location = 'Manila', bio = '', seller_area = '', created_by_admin_id = null, created_by_admin_email = null } = req.body || {};
    if (!full_name?.trim()) return res.status(400).json({ error: 'Display name is required' });

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const ghostId = `created_${timestamp}_${randomStr}`;
    const email = `${ghostId}@1marketph-created.internal`;
    const userPayload = {
      email,
      email_confirm: true,
      user_metadata: { full_name: full_name.trim(), user_type }
    };
    const { data: authData, error: authError } = await db.auth.admin.createUser(userPayload);
    if (authError) throw authError;
    const id = authData.user.id;
    const profile = {
      id,
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      email,
      role: 'user',
      username: ghostId.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      username_set: true,
      user_type,
      is_seller: user_type !== 'customer',
      account_type: user_type === 'business' ? 'business_owner' : 'customer',
      business_name: business_name?.trim() || full_name.trim(),
      seller_location: location,
      location,
      seller_area,
      seller_page_enabled: user_type !== 'customer',
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      created_by_admin_id,
      created_by_admin_email,
      bio,
      seller_bio: bio
    };
    const { data, error } = await db.from('users').upsert(profile).select('*').single();
    if (error) throw error;
    return res.status(200).json({ success: true, user: data, profile_url: `/seller/${data.id}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}