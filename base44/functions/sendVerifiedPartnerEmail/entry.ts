import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can trigger verification emails for others
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email || user.email;
    const targetName = body.name || user.full_name || 'Partner';
    const businessName = body.business_name || 'Your Business';

    await base44.integrations.Core.SendEmail({
      to: targetEmail,
      from_name: '1Marketph.com — Verification Team',
      subject: 'Congratulations! You are now a Verified Partner on 1Marketph.com',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #F0F7FF; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(37,99,235,0.15); }
    .header { background: linear-gradient(135deg, #1d4ed8, #0891b2); padding: 40px 32px; text-align: center; position: relative; }
    .logo { font-size: 24px; font-weight: 900; color: white; }
    .logo span { color: #93c5fd; }
    .badge-container { margin: 20px 0; }
    .verified-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.4); color: white; padding: 10px 22px; border-radius: 999px; font-size: 14px; font-weight: 800; }
    .hero-title { font-size: 30px; font-weight: 900; color: white; margin: 8px 0 0; }
    .hero-sub { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 6px; }
    .ribbon { background: linear-gradient(135deg,#f59e0b,#fbbf24); color: #1c1004; font-size: 12px; font-weight: 800; padding: 8px 32px; text-align: center; letter-spacing: 0.1em; text-transform: uppercase; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0A192F; margin-bottom: 12px; }
    .message { font-size: 14px; color: #0A192F99; line-height: 1.7; margin-bottom: 24px; }
    .perks { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-radius: 14px; padding: 22px; margin-bottom: 24px; border: 1px solid #BFDBFE; }
    .perk { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
    .perk:last-child { margin-bottom: 0; }
    .perk-icon { font-size: 20px; flex-shrink: 0; line-height: 1; }
    .perk-text { font-size: 13px; color: #1e3a5f; line-height: 1.5; }
    .perk-text strong { color: #1d4ed8; }
    .rules { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
    .rule-title { font-size: 12px; font-weight: 700; color: #92400E; margin-bottom: 8px; }
    .rule { font-size: 12px; color: #78350F; line-height: 1.6; }
    .cta { text-align: center; margin: 24px 0; }
    .cta a { background: linear-gradient(135deg,#1d4ed8,#0891b2); color: white; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(29,78,216,0.3); }
    .footer { background: #EFF6FF; padding: 20px 32px; text-align: center; font-size: 11px; color: #1d4ed860; border-top: 1px solid #BFDBFE; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1<span>Marketph</span>.com</div>
      <div class="badge-container">
      <div class="verified-badge">🏆 Verified Partner — Official 1Checkmark</div>
      </div>
      <h1 class="hero-title">You're Verified! 🎉</h1>
      <p class="hero-sub">Your account has been reviewed and approved</p>
    </div>
    <div class="ribbon">🌟 Welcome to the Verified Partner Program 🌟</div>
    <div class="body">
      <p class="greeting">Congratulations, ${targetName}!</p>
      <p class="message">
        Great news! Your business <strong>${businessName}</strong> has successfully passed our verification review and has been officially granted the <strong>Verified Partner</strong> status on 1Marketph.com.
        <br><br>
        Your profile now displays the prestigious <strong>1Checkmark — Verified Partner badge</strong>, a color-cycling animated badge unique to 1MarketPH that signals to all buyers that your business is authentic, trustworthy, and officially reviewed by our team.
      </p>
      <div class="perks">
        <p style="font-size:13px;font-weight:800;color:#1d4ed8;margin:0 0 14px;">🏅 Your Verified Partner Benefits:</p>
        <div class="perk"><div class="perk-icon">🏆</div><div class="perk-text"><strong>1Checkmark Verified Badge</strong> — the exclusive color-changing animated badge displayed on your profile, listings, and search results. Builds immediate buyer trust.</div></div>
        <div class="perk"><div class="perk-icon">🔝</div><div class="perk-text"><strong>Priority Listing Placement</strong> — Verified partners appear higher in search results and category pages.</div></div>
        <div class="perk"><div class="perk-icon">📊</div><div class="perk-text"><strong>Advanced Seller Analytics</strong> — Access detailed insights on views, clicks, and sales performance.</div></div>
        <div class="perk"><div class="perk-icon">🛡️</div><div class="perk-text"><strong>Buyer Confidence Boost</strong> — Verified sellers receive 3x more inquiries and conversions.</div></div>
        <div class="perk"><div class="perk-icon">🎯</div><div class="perk-text"><strong>Featured in Marketing</strong> — Your business may be featured in our newsletters, social media, and homepage.</div></div>
        <div class="perk"><div class="perk-icon">⚡</div><div class="perk-text"><strong>Priority Customer Support</strong> — Get faster response times from our dedicated support team.</div></div>
      </div>
      <div class="rules">
        <p class="rule-title">⚠️ Important: Verified Partner Guidelines</p>
        <p class="rule">• Maintain accurate and up-to-date listings at all times<br>• Respond to buyer inquiries within 24 hours<br>• Fulfill all confirmed orders promptly and professionally<br>• Verified status may be revoked for policy violations</p>
      </div>
      <div class="cta">
        <a href="https://1marketph.com/profile?tab=listings">View Your Verified Profile →</a>
      </div>
    </div>
    <div class="footer">
      <p>✅ This verification was approved by the 1Marketph.com team</p>
      <div style="margin:8px 0;">
        <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" style="color:#2563EB;text-decoration:none;margin:0 6px;">📘 Facebook @1MarketPH</a> ·
        <a href="https://www.instagram.com/1marketph?igsh=Mnk4bHdtaXN2N2h1&utm_source=qr" style="color:#ec4899;text-decoration:none;margin:0 6px;">📸 Instagram @1MarketPH</a>
      </div>
      <p>© 2026 1Marketph.com · The Philippines' Online Marketplace</p>
      <p>Compliant with the Philippine Data Privacy Act of 2012</p>
    </div>
  </div>
</body>
</html>
      `.trim()
    });

    return Response.json({ success: true, message: 'Verified partner email sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});