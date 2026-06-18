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
    const { name, message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const to = process.env.FEEDBACK_EMAIL || 'kevin@1marketph.com';
    await sendEmail({
      to,
      subject: `New Suggestion from ${name || 'Anonymous'} — 1Marketph.com`,
      body: `New suggestion received:\n\nFrom: ${name || 'Anonymous'}\n\nMessage:\n${message}\n\n---\nSent via 1Marketph.com Suggestion Box`
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}