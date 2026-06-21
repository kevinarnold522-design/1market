const SUPABASE_URL = 'https://ksnzljothfoaefifevch.supabase.co';

function serviceHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
}

async function selectOne(table, filter) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*&limit=1`, { headers: serviceHeaders() });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return rows[0] || null;
}

async function insertRow(table, row) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: 'POST', headers: serviceHeaders(), body: JSON.stringify(row) });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json().catch(() => []);
  return rows[0] || null;
}

Deno.serve(async (req) => {
  try {
    const { listing_id, status, admin_note } = await req.json();
    if (!listing_id || !status) return Response.json({ error: 'Missing listing_id or status' }, { status: 400 });

    const listing = await selectOne('listings', `id=eq.${encodeURIComponent(listing_id)}`);
    if (!listing) return Response.json({ error: 'Listing not found' }, { status: 404 });

    const sellerEmail = listing.email_contact;
    const listingTitle = listing.title || 'Your Listing';
    const isApproved = status === 'approved';

    if (sellerEmail) {
      await insertRow('notifications', {
        user_email: sellerEmail,
        type: isApproved ? 'rating' : 'comment',
        message: isApproved
          ? `Your listing "${listingTitle}" has been approved and is now live on 1MarketPH!`
          : `Your listing "${listingTitle}" was not approved. ${admin_note ? 'Reason: ' + admin_note : 'Please review and resubmit.'}`,
        listing_id,
        listing_title: listingTitle,
        from_user_name: '1MarketPH Team',
        is_read: false
      });
    }

    return Response.json({ success: true, notification_created: !!sellerEmail });
  } catch (error) {
    console.error('listingApprovalNotify error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});