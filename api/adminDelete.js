import { createClient } from '@supabase/supabase-js';

function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase service role is not configured');
  return createClient(url, key);
}

const tableMap = {
  User: 'users',
  Listing: 'listings',
  Business: 'businesses',
  Order: 'orders',
  Cart: 'carts',
  Favourite: 'favourites',
  Review: 'reviews',
  MenuItem: 'menu_items',
};

function tableName(entity) {
  if (!entity) return null;
  if (tableMap[entity]) return tableMap[entity];
  return entity.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() + 's';
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { entity, id } = req.body || {};
    if (!entity || !id) return res.status(400).json({ error: 'Missing entity or id' });
    const db = adminClient();
    const table = tableName(entity);
    if (!table) return res.status(400).json({ error: 'Unknown entity' });
    const { error } = await db.from(table).delete().eq('id', id);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('adminDelete error:', error?.message || error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
