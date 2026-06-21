const otpStore = new Map();

Deno.serve(async (req) => {
  try {
    const { action, email, otp: submittedOtp } = await req.json();
    if (!email || !email.includes('@')) return Response.json({ error: 'Valid email required' }, { status: 400 });

    if (action === 'send') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
      console.log(`[OTP] ${email}: ${code}`);
      return Response.json({ success: true, message: 'OTP generated', development_code: code });
    }

    if (action === 'verify') {
      const record = otpStore.get(email);
      if (!record) return Response.json({ error: 'No OTP found for this email. Please request a new one.' }, { status: 400 });
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return Response.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
      }
      if (record.code !== submittedOtp) return Response.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
      otpStore.delete(email);
      return Response.json({ success: true, verified: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});