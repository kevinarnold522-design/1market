import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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
    const isSeller = role === 'admin' || role === 'seller';

    const subject = isSeller
      ? `Welcome to 1Market.ph — Your Seller Account is Ready! 🏪`
      : `Welcome to 1Market.ph — You're Now Part of the Community! 🛍️`;

    const body = isSeller
      ? `
Hi ${name},

🏪 Welcome to 1Market.ph as a Seller!

You've successfully joined our growing community of local businesses connecting with buyers across Manila and Cavite.

What you can do next:
✅ Set up your seller profile in your dashboard
✅ List your products, food, services, or rentals
✅ Connect with thousands of buyers

Visit your Seller Dashboard: https://1market.ph/seller

Thank you for joining 1Market.ph — where local businesses thrive.

— The 1Market.ph Team
Founded by Kevin Roberto, 2026
`.trim()
      : `
Hi ${name},

🛍️ Welcome to 1Market.ph!

You're now officially part of the community — connecting you to the best local businesses, food, travel deals, rentals, and services across Manila and Cavite.

What you can do now:
✅ Browse local food, travel & services
✅ Rate and review businesses
✅ Save your favorite spots
✅ Find great deals near you

Start exploring: https://1market.ph

We're so excited to have you with us!

— The 1Market.ph Team
Founded by Kevin Roberto, 2026
`.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: '1Market.ph',
      subject,
      body,
    });

    return Response.json({ success: true, sent_to: email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});