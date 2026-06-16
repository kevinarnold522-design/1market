import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const { image_urls = [] } = await req.json();
    if (!Array.isArray(image_urls) || image_urls.length === 0) return Response.json({ error: 'Upload at least one image' }, { status: 400 });
    if (image_urls.length > 10) return Response.json({ error: 'Maximum 10 images allowed' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      file_urls: image_urls,
      prompt: `Analyze these images for a 1MarketPH marketplace listing. Never publish anything. Detect inappropriate, illegal, adult, weapon, drug, or scam content and mark safe_to_list false when needed. Generate editable listing fields compatible with these main categories only: travel, food, buysell, jobs, services, rent. Compatible listing types: product, electronics, shoes, clothing, furniture, homeappliances, cars, houses, services, food, hotel, flights, vehicle_rental, rent_lease, jobs, mods, other. Include vehicle/property/business details when visible. Return concise, buyer-friendly Philippine marketplace copy and PHP suggested price range.`,
      response_json_schema: {
        type: 'object',
        properties: {
          safe_to_list: { type: 'boolean' }, confidence_score: { type: 'number' }, title: { type: 'string' }, description: { type: 'string' }, main_category: { type: 'string' }, type: { type: 'string' }, subcategory: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, keywords: { type: 'array', items: { type: 'string' } }, condition: { type: 'string' }, suggested_price_min: { type: 'number' }, suggested_price_max: { type: 'number' }, brand: { type: 'string' }, model: { type: 'string' }, location: { type: 'string' }, features: { type: 'array', items: { type: 'string' } }, specifications: { type: 'array', items: { type: 'string' } }, detected_category: { type: 'string' }, moderation_notes: { type: 'string' }
        },
        required: ['safe_to_list', 'confidence_score', 'title', 'description', 'main_category', 'type']
      }
    });

    return Response.json({ success: true, draft: result });
  } catch (error) {
    console.error('[AI_LISTING_ANALYSIS_ERROR]', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});