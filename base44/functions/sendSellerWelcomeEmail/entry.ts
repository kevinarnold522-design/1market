import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email || user.email;
    const targetName = body.name || user.full_name || 'Business Owner';

    await base44.integrations.Core.SendEmail({
      to: targetEmail,
      from_name: '1Marketph.com',
      subject: '🎉 Congratulations! You\'re now a Seller on 1Marketph.com',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #F8FAFC; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,25,47,0.1); }
    .header { background: linear-gradient(135deg, #0A192F, #1d4ed8); padding: 40px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 900; color: white; letter-spacing: -0.5px; }
    .logo span { color: #00D4FF; }
    .badge { display: inline-block; background: rgba(0,212,255,0.2); border: 1.5px solid rgba(0,212,255,0.4); color: #00D4FF; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-top: 12px; }
    .hero-emoji { font-size: 64px; margin: 20px 0 8px; }
    .hero-title { font-size: 28px; font-weight: 900; color: white; margin: 0; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0A192F; margin-bottom: 12px; }
    .message { font-size: 14px; color: #0A192F99; line-height: 1.7; margin-bottom: 24px; }
    .steps { background: #F0F7FF; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .step { display: flex; gap: 12px; margin-bottom: 14px; }
    .step:last-child { margin-bottom: 0; }
    .step-num { width: 28px; height: 28px; background: #2563EB; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #0A192F; line-height: 1.5; }
    .step-text strong { color: #0A192F; font-weight: 700; }
    .cta { text-align: center; margin: 24px 0; }
    .cta a { background: linear-gradient(135deg,#2563EB,#00D4FF); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; }
    .footer { background: #F8FAFC; padding: 20px 32px; text-align: center; font-size: 11px; color: #0A192F60; border-top: 1px solid #0A192F0A; }
    .social { margin: 8px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1<span>Marketph</span>.com</div>
      <div class="badge">🏪 New Seller Account</div>
      <div class="hero-emoji">🎉</div>
      <h1 class="hero-title">Welcome Aboard, Business Owner!</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${targetName}! 👋</p>
      <p class="message">
        Congratulations and a huge welcome to <strong>1Marketph.com</strong>! We're thrilled to have you join our growing community of Filipino business owners, sellers, and entrepreneurs.
        <br><br>
        Your seller account is now active and you're ready to start reaching thousands of buyers across Manila, Cavite, and the entire Philippines! 🇵🇭
      </p>
      <div class="steps">
        <p style="font-size:13px; font-weight:700; color:#0A192F; margin:0 0 14px;">🚀 Get started in 3 easy steps:</p>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Complete your profile</strong> — Add your business name, location, and contact info to build trust with buyers.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Create your first listing</strong> — Go to Dashboard → My Listings → Add New Listing in any category.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Apply for Verified Partner</strong> — Stand out with a blue badge. Go to Profile → Settings → Request Verification.</div>
        </div>
      </div>
      <div class="cta">
        <a href="https://1marketph.com/profile?tab=listings">Start Selling Now →</a>
      </div>
      <p class="message" style="font-size:12px;">
        💡 <strong>Pro Tip:</strong> Listings with photos, detailed descriptions, and competitive pricing get 5x more views. Upload high-quality images for best results!
      </p>
    </div>
    <div class="footer">
      <div class="social">
        <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" style="color:#2563EB;text-decoration:none;margin:0 6px;">📘 Facebook @1MarketPH</a> ·
        <a href="https://www.instagram.com/1marketph?igsh=Mnk4bHdtaXN2N2h1&utm_source=qr" style="color:#ec4899;text-decoration:none;margin:0 6px;">📸 Instagram @1MarketPH</a>
      </div>
      <p>© 2026 1Marketph.com · Serving Filipino buyers and sellers nationwide</p>
      <p>Compliant with the Philippine Data Privacy Act of 2012</p>
    </div>
  </div>
</body>
</html>
      `.trim()
    });

    return Response.json({ success: true, message: 'Seller welcome email sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});