import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ALFIE_IMG = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/745fd96c6_5C2B4377-0629-406D-97F0-9485947B48FD.png';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data?.email) {
      return Response.json({ error: 'No user email in payload' }, { status: 400 });
    }

    const name = data.full_name || 'there';
    const email = data.email;
    const role = data.role || 'user';
    const isSeller = role === 'admin' || role === 'seller' || data.account_type === 'business_owner';

    const subject = isSeller
      ? `Welcome to 1Market.ph — Your Seller Account is Ready! 🏪`
      : `Welcome to 1Market.ph — Meet Alfie & Start Exploring! 🐾`;

    // Seller email — includes listing walkthrough
    const sellerBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#001060;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0D1F3C;border-radius:16px;overflow:hidden;border:1px solid rgba(0,212,255,0.2);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0033CC,#2563EB);padding:32px 24px;text-align:center;">
      <img src="${ALFIE_IMG}" alt="Alfie" style="width:110px;height:110px;object-fit:contain;margin-bottom:12px;" />
      <h1 style="color:#FFD700;font-size:24px;font-weight:800;margin:0 0 6px;">Hi ${name}! 🎉</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Welcome to <strong>1Market Philippines</strong> — I'm Alfie, your guide! 🐾</p>
    </div>

    <!-- Intro -->
    <div style="padding:24px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;margin:0;">
        Your seller account is ready! Follow these simple steps below to post your first listing and start reaching thousands of buyers across the Philippines. Arf arf! 🐶
      </p>
    </div>

    <!-- Step-by-step Guide -->
    <div style="padding:24px;">
      <h2 style="color:#00D4FF;font-size:16px;font-weight:700;margin:0 0 20px;">📋 How to Post a Listing on 1Market.ph</h2>

      <!-- Step 1 -->
      <div style="display:flex;gap:16px;margin-bottom:20px;padding:16px;background:rgba(0,212,255,0.06);border-radius:12px;border:1px solid rgba(0,212,255,0.15);">
        <div style="width:36px;height:36px;background:#0033CC;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#FFD700;font-weight:800;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">1</div>
        <div>
          <p style="color:#FFD700;font-weight:700;font-size:13px;margin:0 0 4px;">Click "Post & Add" in the Navigation Bar</p>
          <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;line-height:1.6;">Look for the blue <strong style="color:#00D4FF;">Post & Add</strong> button at the top of the page in the navbar. You must be logged in to see it. This button is available to all sellers and business owners!</p>
        </div>
      </div>

      <!-- Step 2 -->
      <div style="display:flex;gap:16px;margin-bottom:20px;padding:16px;background:rgba(139,92,246,0.06);border-radius:12px;border:1px solid rgba(139,92,246,0.15);">
        <div style="width:36px;height:36px;background:#7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">2</div>
        <div>
          <p style="color:#a78bfa;font-weight:700;font-size:13px;margin:0 0 4px;">Choose Your Category</p>
          <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;line-height:1.6;">Select the right category for your listing: <strong style="color:white;">Travel, Food, Buy & Sell, Rent & Lease, Services,</strong> or <strong style="color:white;">Jobs</strong>. Each category is designed for its own type of listing!</p>
        </div>
      </div>

      <!-- Step 3 -->
      <div style="display:flex;gap:16px;margin-bottom:20px;padding:16px;background:rgba(249,115,22,0.06);border-radius:12px;border:1px solid rgba(249,115,22,0.15);">
        <div style="width:36px;height:36px;background:#ea580c;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">3</div>
        <div>
          <p style="color:#fb923c;font-weight:700;font-size:13px;margin:0 0 4px;">Fill in Your Listing Details</p>
          <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;line-height:1.6;">Add a clear <strong style="color:white;">title, description, price,</strong> and <strong style="color:white;">location</strong>. Upload a high-quality photo — listings with photos get 5x more views! Add your contact number so buyers can reach you easily.</p>
        </div>
      </div>

      <!-- Step 4 -->
      <div style="display:flex;gap:16px;margin-bottom:20px;padding:16px;background:rgba(16,185,129,0.06);border-radius:12px;border:1px solid rgba(16,185,129,0.15);">
        <div style="width:36px;height:36px;background:#059669;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">4</div>
        <div>
          <p style="color:#34d399;font-weight:700;font-size:13px;margin:0 0 4px;">Accept the Data Privacy Agreement</p>
          <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;line-height:1.6;">Check the DPA consent box to confirm you agree to our data privacy policy (Republic Act 10173). This is required to keep both buyers and sellers protected on our platform.</p>
        </div>
      </div>

      <!-- Step 5 -->
      <div style="display:flex;gap:16px;margin-bottom:8px;padding:16px;background:rgba(255,215,0,0.08);border-radius:12px;border:1px solid rgba(255,215,0,0.3);">
        <div style="width:36px;height:36px;background:#d97706;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;flex-shrink:0;text-align:center;line-height:36px;">5</div>
        <div>
          <p style="color:#FFD700;font-weight:700;font-size:13px;margin:0 0 4px;">🚀 Click "Publish Listing"</p>
          <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;line-height:1.6;">Hit the big blue <strong style="color:#FFD700;">Publish Listing</strong> button and your listing goes live instantly! Buyers across Manila, Cavite, and the whole Philippines can now find you. Woof! 🐾</p>
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="padding:0 24px 24px;text-align:center;">
      <a href="https://1market.ph" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#001060;font-weight:800;font-size:14px;border-radius:12px;text-decoration:none;box-shadow:0 0 20px rgba(255,215,0,0.4);">
        🐾 Start Posting on 1Market.ph →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">— The 1Market.ph Team · Founded by Kevin Roberto, 2026</p>
      <p style="color:rgba(255,255,255,0.15);font-size:10px;margin:4px 0 0;">1MarketPH.com — Buy, Sell & Connect across the Philippines</p>
    </div>
  </div>
</body>
</html>
`.trim();

    // Buyer email — simpler, with Alfie welcome
    const buyerBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#001060;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0D1F3C;border-radius:16px;overflow:hidden;border:1px solid rgba(0,212,255,0.2);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0033CC,#2563EB);padding:32px 24px;text-align:center;">
      <img src="${ALFIE_IMG}" alt="Alfie" style="width:110px;height:110px;object-fit:contain;margin-bottom:12px;" />
      <h1 style="color:#FFD700;font-size:24px;font-weight:800;margin:0 0 6px;">Welcome, ${name}! 🐾</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">I'm Alfie — your 1Market Philippines mascot!</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;margin:0 0 20px;">
        You're now part of the <strong style="color:#00D4FF;">1Market Philippines</strong> community — connecting you to the best local food, travel deals, products, rentals, and services across the Philippines. Arf arf! 🎉
      </p>

      <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#00D4FF;font-weight:700;font-size:13px;margin:0 0 10px;">🌟 What you can do on 1Market.ph:</p>
        <ul style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
          <li>🍜 Find the best food deals near you</li>
          <li>✈️ Book travel packages & hotels</li>
          <li>🛍️ Buy & sell products safely</li>
          <li>🏠 Browse rentals across the Philippines</li>
          <li>💼 Discover job opportunities</li>
          <li>⭐ Rate & review businesses</li>
        </ul>
      </div>

      <div style="text-align:center;">
        <a href="https://1market.ph" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#001060;font-weight:800;font-size:14px;border-radius:12px;text-decoration:none;box-shadow:0 0 20px rgba(255,215,0,0.4);">
          🐾 Start Exploring 1Market.ph →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
      <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">— The 1Market.ph Team · Founded by Kevin Roberto, 2026</p>
    </div>
  </div>
</body>
</html>
`.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: '1Market.ph — Alfie 🐾',
      subject,
      body: isSeller ? sellerBody : buyerBody,
    });

    return Response.json({ success: true, sent_to: email });
  } catch (error) {
    console.error('autoWelcomeEmail error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});