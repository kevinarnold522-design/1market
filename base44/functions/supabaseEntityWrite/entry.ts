const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

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

function tableFor(entity) {
  const table = tableMap[entity];
  if (!table) throw new Error('Unsupported data type');
  return table;
}

async function readJson(response) {
  const text = await response.text();
  if (!response.ok) throw new Error(text || 'Database write failed');
  return text ? JSON.parse(text) : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
    const { entity, action, id, record, records, patch } = await req.json();
    const table = tableFor(entity);
    let response;

    if (action === 'create') {
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST', headers: serviceHeaders({ Prefer: 'return=representation' }), body: JSON.stringify(record || {}),
      });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows?.[0] || null }, { headers: corsHeaders });
    }

    if (action === 'bulkCreate') {
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: 'POST', headers: serviceHeaders({ Prefer: 'return=representation' }), body: JSON.stringify(records || []),
      });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows || [] }, { headers: corsHeaders });
    }

    if (action === 'update') {
      if (!id) return Response.json({ error: 'Missing record ID' }, { status: 400, headers: corsHeaders });
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`, {
        method: 'PATCH', headers: serviceHeaders({ Prefer: 'return=representation' }), body: JSON.stringify({ ...(patch || {}), updated_at: new Date().toISOString() }),
      });
      const rows = await readJson(response);
      return Response.json({ success: true, data: rows?.[0] || null }, { headers: corsHeaders });
    }

    if (action === 'delete') {
      if (!id) return Response.json({ error: 'Missing record ID' }, { status: 400, headers: corsHeaders });
      response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE', headers: serviceHeaders(),
      });
      await readJson(response);
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    return Response.json({ error: 'Unsupported action' }, { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('[ENTITY_WRITE_ERROR]', error.message);
    return Response.json({ error: error.message || 'Database write failed' }, { status: 500, headers: corsHeaders });
  }
});