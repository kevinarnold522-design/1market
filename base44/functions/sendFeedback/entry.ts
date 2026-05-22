import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, message } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const FEEDBACK_EMAIL = Deno.env.get('FEEDBACK_EMAIL') || 'kevinarnold522@gmail.com';

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: FEEDBACK_EMAIL,
      from_name: '1Marketph.com Feedback',
      subject: `New Suggestion from ${name || 'Anonymous'} — 1Marketph.com`,
      body: `New suggestion received:\n\nFrom: ${name || 'Anonymous'}\n\nMessage:\n${message}\n\n---\nSent via 1Marketph.com Suggestion Box`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});