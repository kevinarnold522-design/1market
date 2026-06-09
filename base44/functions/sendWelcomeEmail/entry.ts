import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role = 'buyer' } = await req.json().catch(() => ({}));

    const isSeller = role === 'seller';

    const subject = isSeller
      ? `Welcome to 1Market.ph — Your Seller Account is Ready!`
      : `Welcome to 1Market.ph — You're Now Part of the Community!`;

    const body = isSeller
      ? `
Hi ${user.full_name || 'there'},

🏪 Welcome to 1Market.ph as a Seller!

You're now part of a growing community of local businesses connecting with buyers across Manila and Cavite.

What you can do next:
✅ Set up your seller profile
✅ List your products, food, services, or rentals
✅ Connect with thousands of buyers

Visit your Seller Dashboard: https://1market.ph/seller

Thank you for joining 1Market.ph — where local businesses thrive.

Follow us: Facebook @1MarketPH → https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr
Instagram @1MarketPH → https://www.instagram.com/1marketph?igsh=Mnk4bHdtaXN2N2h1&utm_source=qr

— The 1Market.ph Team
Founded by Kevin Roberto, 2026
      `.trim()
      : `
Hi ${user.full_name || 'there'},

🛍️ Welcome to 1Market.ph!

You're now part of the community — connecting you to the best local businesses, food, travel deals, rentals, and services across Manila and Cavite.

What you can do now:
✅ Browse local food, travel & services
✅ Rate and review businesses
✅ Save your favorite spots
✅ Find great deals near you

Start exploring: https://1market.ph

Follow us:
📘 Facebook @1MarketPH → https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr
📸 Instagram @1MarketPH → https://www.instagram.com/1marketph?igsh=Mnk4bHdtaXN2N2h1&utm_source=qr

We're excited to have you with us!

— The 1Market.ph Team
Founded by Kevin Roberto, 2026
      `.trim();

    await base44.integrations.Core.SendEmail({
      to: user.email,
      from_name: '1Market.ph',
      subject,
      body,
    });

    return Response.json({ success: true, sent_to: user.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});