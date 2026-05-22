import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// In-memory OTP store (resets on cold start, fine for short TTL)
const otpStore = new Map();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, email, otp: submittedOtp } = await req.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 });
    }

    // SEND OTP
    if (action === 'send') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
      otpStore.set(email, { code, expires });

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        from_name: '1Marketph.com',
        subject: `Your 1Marketph.com Verification Code: ${code}`,
        body: `Hi there,\n\nYour one-time verification code for 1Marketph.com is:\n\n${code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n— The 1Marketph.com Team`,
      });

      return Response.json({ success: true, message: 'OTP sent to ' + email });
    }

    // VERIFY OTP
    if (action === 'verify') {
      const record = otpStore.get(email);
      if (!record) {
        return Response.json({ error: 'No OTP found for this email. Please request a new one.' }, { status: 400 });
      }
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return Response.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
      }
      if (record.code !== submittedOtp) {
        return Response.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
      }
      otpStore.delete(email);
      return Response.json({ success: true, verified: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});