import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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
    if (!id) return Response.json({ error: 'Missing user id' }, { status: 400 });

    if (action === 'delete') {
      await base44.entities.User.delete(id);
      return Response.json({ success: true });
    }

    if (action !== 'update') {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const allowed = [
      'role', 'user_type', 'is_seller', 'account_type', 'business_pending',
      'business_name', 'channel_name', 'is_verified_seller', 'verification_submitted',
      'ghost_linked', 'is_ghost_account', 'email'
    ];
    const cleanPatch = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) cleanPatch[key] = patch[key];
    }

    const updated = await base44.asServiceRole.entities.User.update(id, cleanPatch);
    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error('[ADMIN_UPDATE_USER_ERROR]', error.message);
    return Response.json({ error: error.message || 'Admin user update failed' }, { status: 500 });
  }
});