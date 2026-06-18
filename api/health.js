export default function handler(req, res) {
  res.status(200).json({ ok: true, service: '1MarketPH Vercel API', timestamp: new Date().toISOString() });
}