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
    if (!id) return Response.json({ error: 'Missing listing id' }, { status: 400 });

    if (action === 'delete') {
      await base44.asServiceRole.entities.Listing.delete(id);
      await Promise.allSettled([
        base44.asServiceRole.entities.ListingHeart.deleteMany({ listing_id: id }),
        base44.asServiceRole.entities.ListingComment.deleteMany({ listing_id: id }),
        base44.asServiceRole.entities.Favourite.deleteMany({ listing_id: id }),
        base44.asServiceRole.entities.Cart.deleteMany({ listing_id: id }),
        base44.asServiceRole.entities.Report.deleteMany({ listing_id: id })
      ]);
      return Response.json({ success: true });
    }

    if (action !== 'update') {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const cleanPatch = {};
    for (const [key, value] of Object.entries(patch || {})) {
      if (['id', 'created_date', 'updated_date'].includes(key)) continue;
      if (value !== undefined) cleanPatch[key] = value;
    }

    try {
      const updated = await base44.asServiceRole.entities.Listing.update(id, cleanPatch);
      return Response.json({ success: true, listing: updated });
    } catch (error) {
      if (Object.prototype.hasOwnProperty.call(cleanPatch, 'created_by_id')) {
        const { created_by_id, ...withoutCreator } = cleanPatch;
        const updated = await base44.asServiceRole.entities.Listing.update(id, withoutCreator);
        return Response.json({ success: true, listing: updated, warning: 'Owner fields updated, creator field is protected.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('[ADMIN_LISTING_ACTION_ERROR]', error.message);
    return Response.json({ error: error.message || 'Admin listing action failed' }, { status: 500 });
  }
});