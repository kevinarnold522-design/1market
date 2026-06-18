import { createClient } from '@supabase/supabase-js';

function adminClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase service role is not configured');
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { user_email } = req.body || {};
    const db = adminClient();
    let q = db.from('chat_messages').select('*').order('created_at', { ascending: false }).limit(200);
    if (user_email) q = q.or(`seller_email.eq.${user_email},buyer_email.eq.${user_email},sender_email.eq.${user_email}`);
    const { data, error } = await q;
    if (error) throw error;
    return res.status(200).json({ messages: data || [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}