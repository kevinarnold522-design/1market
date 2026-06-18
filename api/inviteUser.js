import { createClient } from '@supabase/supabase-js';

function adminClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase service role is not configured');
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, role = 'user' } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const db = adminClient();
    const { data, error } = await db.auth.admin.inviteUserByEmail(email, { data: { role } });
    if (error) throw error;
    return res.status(200).json({ success: true, user: data?.user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}