import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

function serviceHeaders(extra = {}) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}

async function listSupabaseUsers() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&order=created_date.desc&limit=1000`, {
    headers: serviceHeaders()
  });
  if (!response.ok) return [];
  return await response.json();
}

async function updateSupabaseUser(id, patch) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: serviceHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(patch)
  });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return rows[0] || null;
}

async function deleteSupabaseUser(id) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: serviceHeaders()
  });
  if (!response.ok) throw new Error(await response.text());
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const email = (user?.email || '').toLowerCase();
    if (!user || (user.role !== 'admin' && email !== 'kevinarnold522@gmail.com')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, id, patch = {} } = await req.json();

    if (action === 'list') {
      const [baseUsers, supabaseUsers] = await Promise.all([
        base44.asServiceRole.entities.User.list('-created_date', 1000).catch(() => []),
        listSupabaseUsers()
      ]);
      const byId = new Map();
      [...baseUsers, ...supabaseUsers].forEach(item => {
        if (item?.id) byId.set(item.id, { ...(byId.get(item.id) || {}), ...item });
      });
      const users = Array.from(byId.values()).sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
      return Response.json({ success: true, users });
    }

    if (!id) return Response.json({ error: 'Missing user id' }, { status: 400 });

    if (action === 'delete') {
      await Promise.allSettled([
        base44.asServiceRole.entities.User.delete(id),
        deleteSupabaseUser(id)
      ]);
      return Response.json({ success: true });
    }

    if (action !== 'update') {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const allowed = [
      'role', 'user_type', 'is_seller', 'account_type', 'business_pending',
      'business_name', 'channel_name', 'is_verified_seller', 'verification_submitted',
      'ghost_linked', 'is_ghost_account', 'email', 'seller_page_enabled',
      'seller_pending', 'member_type'
    ];
    const cleanPatch = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) cleanPatch[key] = patch[key];
    }

    const [baseResult, supabaseResult] = await Promise.allSettled([
      base44.asServiceRole.entities.User.update(id, cleanPatch),
      updateSupabaseUser(id, cleanPatch)
    ]);
    if (baseResult.status === 'rejected' && supabaseResult.status === 'rejected') {
      throw new Error(baseResult.reason?.message || supabaseResult.reason?.message || 'User update failed');
    }
    const updated = baseResult.status === 'fulfilled' ? baseResult.value : supabaseResult.value;
    return Response.json({ success: true, user: updated || { id, ...cleanPatch } });
  } catch (error) {
    console.error('[ADMIN_UPDATE_USER_ERROR]', error.message);
    return Response.json({ error: error.message || 'Admin user update failed' }, { status: 500 });
  }
});