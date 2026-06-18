import { sendEmail } from './_email.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email is required' });
    await sendEmail({
      to: email,
      subject: 'Your 1MarketPH Sales Account is ready',
      body: `Hi ${name || 'seller'},\n\nYour Sales Account is ready. You can now post listings, manage products, and track seller activity.\n\n— The 1MarketPH Team`
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}