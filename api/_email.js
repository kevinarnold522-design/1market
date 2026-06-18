export async function sendEmail({ to, subject, body }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || '1MarketPH <noreply@1marketph.com>',
      to,
      subject,
      text: body
    })
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}