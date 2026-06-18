export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { image_urls = [] } = req.body || {};
    if (!Array.isArray(image_urls) || image_urls.length === 0) return res.status(400).json({ error: 'Upload at least one image' });
    if (!process.env.OPENAI_API_KEY) return res.status(501).json({ error: 'OPENAI_API_KEY is not configured. Replace Base44 InvokeLLM with your AI provider.' });

    return res.status(501).json({
      error: 'AI image analysis migration placeholder',
      recommendation: 'Implement this route with OpenAI vision, Google Gemini, or another provider using OPENAI_API_KEY/GEMINI_API_KEY.'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}