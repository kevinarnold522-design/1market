Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const { image_urls = [] } = await req.json();
    if (!Array.isArray(image_urls) || image_urls.length === 0) return Response.json({ error: 'Upload at least one image' }, { status: 400 });
    if (image_urls.length > 10) return Response.json({ error: 'Maximum 10 images allowed' }, { status: 400 });

    return Response.json({
      success: true,
      draft: {
        safe_to_list: true,
        confidence_score: 0.5,
        title: 'New marketplace listing',
        description: 'Please review the uploaded photos and complete the listing details.',
        main_category: 'buysell',
        type: 'product',
        moderation_notes: 'Base44 AI was removed. Connect an external AI provider in Supabase/Vercel to enable automatic image analysis.'
      }
    });
  } catch (error) {
    console.error('[AI_LISTING_ANALYSIS_ERROR]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});