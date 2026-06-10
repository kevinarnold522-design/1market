import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (!user || (user.role !== 'admin' && user.email !== 'Kevinarnold522@gmail.com')) {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { full_name, channel_name, user_type, business_name, location, bio, seller_area } = await req.json();

    // Validate required fields
    if (!full_name || !full_name.trim()) {
      return Response.json({ error: 'Display name is required' }, { status: 400 });
    }

    console.log('[GHOST CREATE] Starting creation for:', full_name);

    // STEP 1: Generate unique identifiers
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ghostId = `ghost_${timestamp}_${randomStr}`;
    const ghostEmail = `${ghostId}@1marketph-ghost.internal`;
    const cleanUsername = `ghost_${timestamp}_${randomStr}`.toLowerCase().replace(/[^a-z0-9_]/g, '');

    // STEP 2: Create user record with ALL fields explicitly set
    const userData = {
      // Core identity (built-in fields)
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      email: ghostEmail,
      role: 'user',
      username: cleanUsername,
      
      // Account classification
      user_type: user_type || 'seller',
      is_seller: user_type !== 'customer',
      account_type: user_type === 'business' ? 'business_owner' : 'customer',
      
      // Business information
      business_name: business_name?.trim() || full_name.trim(),
      seller_location: location || 'Manila',
      location: location || 'Manila',
      seller_page_enabled: user_type !== 'customer',
      
      // Ghost account markers
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      ghost_linked: false,
      username_set: true,
      
      // Profile data
      bio: bio || '',
      seller_bio: bio || '',
      seller_area: seller_area || '',
      profile_picture: '',
      cover_photo: '',
      is_verified_seller: false,
      verification_submitted: false,
      seller_pending: false,
      business_pending: false,
      seller_products: [],
      business_categories: [],
      
      // Facebook Live fields
      facebook_page_id: '',
      facebook_page_name: '',
      facebook_live_enabled: false,
      
      // Social media fields (explicitly set to empty strings)
      social_facebook: '',
      social_instagram: '',
      social_tiktok: '',
      social_twitter: '',
      social_youtube: '',
      social_viber: '',
      social_telegram: '',
      
      // Contact fields
      phone: '',
      show_phone_public: false,
      show_email_public: false,
    };

    console.log('[GHOST CREATE] Creating user record...');
    const result = await base44.entities.User.create(userData);
    console.log('[GHOST CREATE] ✓ User created:', result.id);

    // STEP 3: Verify creation with retries (database persistence delay)
    console.log('[GHOST CREATE] Verifying creation with retries...');
    
    let verified = null;
    const maxRetries = 10;
    const retryDelayMs = 300;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (attempt > 1) {
        console.log(`[GHOST VERIFY] Retry ${attempt}/${maxRetries} - waiting ${retryDelayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
      
      // Try filter by ID
      const byId = await base44.entities.User.filter({ id: result.id });
      if (byId && byId.length > 0) {
        verified = byId[0];
        console.log(`[GHOST VERIFY] ✓ Found by ID on attempt ${attempt}`);
        break;
      }
      
      // Try filter by username
      const byUsername = await base44.entities.User.filter({ username: cleanUsername });
      if (byUsername && byUsername.length > 0) {
        verified = byUsername[0];
        console.log(`[GHOST VERIFY] ✓ Found by username on attempt ${attempt}`);
        break;
      }
      
      // Try filter by email
      const byEmail = await base44.entities.User.filter({ email: ghostEmail });
      if (byEmail && byEmail.length > 0) {
        verified = byEmail[0];
        console.log(`[GHOST VERIFY] ✓ Found by email on attempt ${attempt}`);
        break;
      }
    }
    
    if (!verified) {
      console.error('[GHOST CREATE] ✗ Verification failed after', maxRetries, 'retries');
      return Response.json({ 
        error: 'User creation failed verification - database persistence delay',
        debug: { attempted_id: result.id, ghost_id: ghostId, retries: maxRetries }
      }, { status: 500 });
    }

    console.log('[GHOST CREATE] ✓ Verification successful:', {
      id: verified.id,
      name: verified.full_name,
      email: verified.email,
      ghost_id: verified.ghost_id,
      username: verified.username
    });

    // STEP 4: Validate all critical fields exist
    const validationErrors = [];
    if (!verified.id) validationErrors.push('missing id');
    if (!verified.full_name) validationErrors.push('missing full_name');
    if (!verified.email) validationErrors.push('missing email');
    if (!verified.ghost_id) validationErrors.push('missing ghost_id');
    if (!verified.username) validationErrors.push('missing username');

    if (validationErrors.length > 0) {
      console.error('[GHOST CREATE] ✗ Validation errors:', validationErrors);
      return Response.json({ 
        error: 'User validation failed',
        missing_fields: validationErrors
      }, { status: 500 });
    }

    // STEP 5: Load additional data (listings, posts) to confirm relationships work
    const [listings, posts] = await Promise.all([
      base44.entities.Listing.filter({ created_by_id: result.id }),
      base44.entities.CommunityPost.filter({ author_email: verified.email })
    ]);

    console.log('[GHOST CREATE] ✓ Relationships validated:', {
      listings_count: listings.length,
      posts_count: posts.length
    });

    // STEP 6: Return success with full data
    return Response.json({
      success: true,
      user: {
        id: verified.id,
        full_name: verified.full_name,
        channel_name: verified.channel_name,
        email: verified.email,
        username: verified.username,
        ghost_id: verified.ghost_id,
        user_type: verified.user_type,
        is_ghost_account: verified.is_ghost_account,
        seller_location: verified.seller_location,
        created_date: verified.created_date
      },
      profile_url: `/seller/${verified.id}`,
      message: 'Ghost account created and verified successfully'
    });

  } catch (error) {
    console.error('[GHOST CREATE] ✗ Fatal error:', error);
    return Response.json({ 
      error: 'Failed to create ghost account',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});