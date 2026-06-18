import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '../server/email.js';

function adminClient() {
  if (!process.env.SUPABASE_URL || !(process.env.SUPABASE_SECRET_KEY || (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY))) throw new Error('Supabase service role is not configured');
  return createClient(process.env.SUPABASE_URL, (process.env.SUPABASE_SECRET_KEY || (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)));
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { listing_id, status, admin_note = '' } = req.body || {};
    if (!listing_id || !status) return res.status(400).json({ error: 'listing_id and status are required' });
    const db = adminClient();
    const { data: listing, error } = await db.from('listings').select('*').eq('id', listing_id).single();
    if (error) throw error;
    const to = listing.email_contact || listing.seller_email;
    if (to) {
      await sendEmail({
        to,
        subject: `Your 1MarketPH listing was ${status}`,
        body: `Hi ${listing.seller_name || 'there'},\n\nYour listing "${listing.title}" was ${status}.\n${admin_note ? `\nNote: ${admin_note}\n` : ''}\n— The 1MarketPH Team`
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}