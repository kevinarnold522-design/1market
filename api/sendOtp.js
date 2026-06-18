const otpStore = new Map();

async function sendEmail({ to, subject, body }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.FROM_EMAIL || '1MarketPH <noreply@1marketph.com>', to, subject, text: body })
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { action, email, otp: submittedOtp } = req.body || {};
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });

    if (action === 'send') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000;
      otpStore.set(email, { code, expires });
      await sendEmail({
        to: email,
        subject: `Your 1Marketph.com Verification Code: ${code}`,
        body: `Hi there,\n\nYour one-time verification code for 1Marketph.com is:\n\n${code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n— The 1Marketph.com Team`
      });
      return res.status(200).json({ success: true, message: 'OTP sent to ' + email });
    }

    if (action === 'verify') {
      const record = otpStore.get(email);
      if (!record) return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
      }
      if (record.code !== submittedOtp) return res.status(400).json({ error: 'Incorrect code. Please try again.' });
      otpStore.delete(email);
      return res.status(200).json({ success: true, verified: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}