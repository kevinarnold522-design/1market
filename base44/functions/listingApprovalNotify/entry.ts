import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { listing_id, status, admin_note } = await req.json();

    if (!listing_id || !status) {
      return Response.json({ error: 'Missing listing_id or status' }, { status: 400 });
    }

    const listings = await base44.asServiceRole.entities.Listing.filter({ id: listing_id });
    const listing = listings[0];
    if (!listing) {
      return Response.json({ error: 'Listing not found' }, { status: 404 });
    }

    const sellerEmail = listing.email_contact;
    const sellerName = listing.seller_name || 'Lister';
    const listingTitle = listing.title || 'Your Listing';
    const isApproved = status === 'approved';

    // Create in-app notification
    if (sellerEmail) {
      await base44.asServiceRole.entities.Notification.create({
        user_email: sellerEmail,
        type: isApproved ? 'rating' : 'comment',
        message: isApproved
          ? `Your listing "${listingTitle}" has been approved and is now live on 1MarketPH!`
          : `Your listing "${listingTitle}" was not approved. ${admin_note ? 'Reason: ' + admin_note : 'Please review and resubmit.'}`,
        listing_id: listing_id,
        listing_title: listingTitle,
        from_user_name: '1MarketPH Team',
        is_read: false,
      });
    }

    // Send approval email
    if (sellerEmail) {
      const subject = isApproved
        ? `Your listing "${listingTitle}" is now LIVE on 1MarketPH!`
        : `Update on your listing "${listingTitle}" — Action Required`;

      const approvedBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#001060;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0D1F3C;border-radius:16px;overflow:hidden;border:1px solid rgba(0,212,255,0.2);">
    <div style="background:linear-gradient(135deg,#0033CC,#2563EB);padding:32px 24px;text-align:center;">
      <div style="width:64px;height:64px;background:rgba(34,197,94,0.2);border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(34,197,94,0.4);">
        <span style="font-size:28px;">&#10003;</span>
      </div>
      <h1 style="color:#FFD700;font-size:22px;font-weight:800;margin:0 0 6px;">Listing Approved!</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Hi ${sellerName} — great news!</p>
    </div>
    <div style="padding:28px 24px;">
      <p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.7;margin:0 0 16px;">
        Your listing <strong style="color:#00D4FF;">"${listingTitle}"</strong> has been reviewed and <strong style="color:#34d399;">approved</strong> by our team. It is now <strong>live</strong> on 1MarketPH.com and visible to thousands of buyers across the Philippines!
      </p>
      <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#34d399;font-weight:700;font-size:13px;margin:0 0 6px;">What's next?</p>
        <ul style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
          <li>Buyers can now find and contact you</li>
          <li>Share your listing on social media to get more views</li>
          <li>Keep your contact info updated for quick responses</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="https://1marketph.com/listing/${listing_id}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#001060;font-weight:800;font-size:14px;border-radius:12px;text-decoration:none;">
          View Your Live Listing
        </a>
      </div>
    </div>
    <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">1MarketPH.com — Buy, Sell &amp; Connect across the Philippines</p>
      <div style="margin-top:8px;display:flex;justify-content:center;gap:12px;">
        <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" style="color:#60a5fa;font-size:11px;text-decoration:none;">📘 @1MarketPH</a>
        <a href="https://www.instagram.com/1marketph?igsh=Mnk4bHdtaXN2N2h1&utm_source=qr" style="color:#f9a8d4;font-size:11px;text-decoration:none;">📸 @1MarketPH</a>
        <a href="https://tiktok.com/@1marketph" style="color:#ffffff;font-size:11px;text-decoration:none;">TikTok</a>
      </div>
    </div>
  </div>
</body>
</html>`.trim();

      const rejectedBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#001060;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0D1F3C;border-radius:16px;overflow:hidden;border:1px solid rgba(239,68,68,0.2);">
    <div style="background:linear-gradient(135deg,#7f1d1d,#991b1b);padding:32px 24px;text-align:center;">
      <h1 style="color:#fca5a5;font-size:22px;font-weight:800;margin:0 0 6px;">Listing Not Approved</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Hi ${sellerName}, your listing needs attention.</p>
    </div>
    <div style="padding:28px 24px;">
      <p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.7;margin:0 0 16px;">
        Your listing <strong style="color:#fca5a5;">"${listingTitle}"</strong> was reviewed and could not be approved at this time.
      </p>
      ${admin_note ? `<div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;padding:16px;margin-bottom:16px;"><p style="color:#fca5a5;font-weight:700;font-size:13px;margin:0 0 6px;">Reason:</p><p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">${admin_note}</p></div>` : ''}
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 20px;">Please review our listing guidelines, make the necessary corrections, and resubmit. Common issues include inaccurate information, prohibited items, or missing photos.</p>
      <div style="text-align:center;">
        <a href="https://1marketph.com" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0033CC,#2563EB);color:#fff;font-weight:800;font-size:14px;border-radius:12px;text-decoration:none;">
          Post a New Listing
        </a>
      </div>
    </div>
    <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">1MarketPH.com — Questions? Contact us on Facebook @1marketph</p>
    </div>
  </div>
</body>
</html>`.trim();

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: sellerEmail,
        from_name: '1MarketPH Approval Team',
        subject,
        body: isApproved ? approvedBody : rejectedBody,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('listingApprovalNotify error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});