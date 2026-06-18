import { sendEmail } from './_email.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required' });
    await sendEmail({
      to: email,
      subject: 'Welcome to 1MarketPH',
      body: `Hi ${name || 'there'},\n\nWelcome to 1MarketPH. You can now browse, save, message, and list across the marketplace.\n\n— The 1MarketPH Team`
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}