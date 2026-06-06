import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { email, name, business_name } = body;

    if (!email) {
      return Response.json({ error: 'email is required' }, { status: 400 });
    }

    const displayName = name || 'Business Owner';
    const biz = business_name || 'Your Business';

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: '1Marketph.com',
      subject: `🎉 Congratulations! ${biz} is now a Verified Business on 1Marketph.com`,
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
    .verified-box { background: linear-gradient(135deg,rgba(37,99,235,0.08),rgba(0,212,255,0.05)); border: 1.5px solid rgba(37,99,235,0.3); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; text-align: center; }
    .footer { background: #F8FAFC; padding: 20px 32px; text-align: center; font-size: 11px; color: #0A192F60; border-top: 1px solid #0A192F0A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">1<span>Marketph</span>.com</div>
      <div class="badge">✅ Verified Business Account</div>
      <div class="hero-emoji">🎊</div>
      <h1 class="hero-title">Welcome to the Family!</h1>
    </div>
    <div class="body">
      <p class="greeting">Congratulations, ${displayName}! 🥳</p>
      <p class="message">
        We're thrilled to announce that <strong>${biz}</strong> has been officially approved and verified on <strong>1Marketph.com</strong>! 
        Your business is now live and ready to reach thousands of Filipino buyers across Manila, Cavite, and nationwide.
      </p>
      <div class="verified-box">
        <p style="font-size:24px; margin:0 0 4px;">✅ Verified Partner Status Granted</p>
        <p style="font-size:13px; color:#2563EB; font-weight:700; margin:0;">${biz} — Official Verified Business</p>
        <p style="font-size:11px; color:#0A192F60; margin:4px 0 0;">Your blue checkmark is now active on all your listings and profile.</p>
      </div>
      <div class="steps">
        <p style="font-size:13px; font-weight:700; color:#0A192F; margin:0 0 14px;">🚀 Next steps for your business:</p>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text"><strong>Set up your Business Profile</strong> — Add your logo, cover photo, and business description to make a great first impression.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text"><strong>Post your listings</strong> — Add your products and services. Your business name will appear on all your listings.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text"><strong>Share your Business Page</strong> — You now have a dedicated public page for your business. Share it with your customers!</div>
        </div>
      </div>
      <div class="cta">
        <a href="https://1marketph.com/profile?tab=listings">Start Posting Listings →</a>
      </div>
      <p class="message" style="font-size:12px;">
        💡 <strong>Tip:</strong> Verified Partner listings appear with a blue badge and get priority visibility in search results. Make the most of it!
      </p>
    </div>
    <div class="footer">
      <p>© 2026 1Marketph.com · Proudly Filipino · Serving businesses nationwide 🇵🇭</p>
      <p>Compliant with the Philippine Data Privacy Act of 2012</p>
    </div>
  </div>
</body>
</html>
      `.trim()
    });

    return Response.json({ success: true, message: 'Business welcome email sent' });
  } catch (error) {
    console.error('sendBusinessWelcomeEmail error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});