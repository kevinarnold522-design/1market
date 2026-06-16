import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // STEP 1: Verify admin access
    const user = await base44.auth.me();
    if (!user || (user.role !== 'admin' && user.email?.toLowerCase() !== 'kevinarnold522@gmail.com')) {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    console.log('[GHOST CREATE] Admin verified:', user.email);

    const { full_name, channel_name, user_type, business_name, location, bio, seller_area } = await req.json();

    // Validate required fields
    if (!full_name || !full_name.trim()) {
      return Response.json({ error: 'Display name is required' }, { status: 400 });
    }

    // STEP 2: Generate unique identifiers
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ghostId = `ghost_${timestamp}_${randomStr}`;
    const ghostEmail = `${ghostId}@1marketph-ghost.internal`;
    const cleanUsername = `ghost_${timestamp}_${randomStr}`.toLowerCase().replace(/[^a-z0-9_]/g, '');

    console.log('[GHOST CREATE] Generated identifiers:', { ghostId, ghostEmail, username: cleanUsername });

    // STEP 3: Create user with service role (bypasses invite requirement)
    const userData = {
      // Core identity
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      email: ghostEmail,
      role: 'user',
      username: cleanUsername,
      username_set: true,
      
      // Account classification
      user_type: user_type || 'seller',
      is_seller: user_type !== 'customer',
      account_type: user_type === 'business' ? 'business_owner' : 'customer',
      business_name: business_name?.trim() || full_name.trim(),
      
      // Location
      seller_location: location || 'Manila',
      location: location || 'Manila',
      seller_area: seller_area || '',
      seller_page_enabled: user_type !== 'customer',
      
      // Created-user tracking markers
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      ghost_linked: false,
      created_by_admin_id: user.id,
      created_by_admin_email: user.email,
      
      // Profile data
      bio: bio || '',
      seller_bio: bio || '',
      profile_picture: '',
      cover_photo: '',
      is_verified_seller: false,
      verification_submitted: false,
      seller_pending: false,
      business_pending: false,
      seller_products: [],
      business_categories: [],
      
      // Facebook Live
      facebook_page_id: '',
      facebook_page_name: '',
      facebook_live_enabled: false,
      
      // Social media
      social_facebook: '',
      social_instagram: '',
      social_tiktok: '',
      social_twitter: '',
      social_youtube: '',
      social_viber: '',
      social_telegram: '',
      
      // Contact
      phone: '',
      show_phone_public: false,
      show_email_public: false,
    };

    console.log('[GHOST CREATE] Creating user with service role...');
    
    // Use service role to create user (bypasses invite requirement)
    const result = await base44.asServiceRole.entities.User.create(userData);
    console.log('[GHOST CREATE] ✓ User.create() returned ID:', result.id);

    // STEP 4: Verification with retries (database propagation)
    console.log('[GHOST CREATE] Starting verification with retries...');
    
    let verified = null;
    const maxRetries = 10;
    const retryDelayMs = 500;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (attempt > 1) {
        console.log(`[GHOST VERIFY] Retry ${attempt}/${maxRetries} - waiting ${retryDelayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
      
      // Try multiple lookup methods
      const byId = await base44.asServiceRole.entities.User.filter({ id: result.id });
      if (byId && byId.length > 0) {
        verified = byId[0];
        console.log(`[GHOST VERIFY] ✓ Found by ID on attempt ${attempt}`);
        break;
      }
      
      const byUsername = await base44.asServiceRole.entities.User.filter({ username: cleanUsername });
      if (byUsername && byUsername.length > 0) {
        verified = byUsername[0];
        console.log(`[GHOST VERIFY] ✓ Found by username on attempt ${attempt}`);
        break;
      }
      
      const byEmail = await base44.asServiceRole.entities.User.filter({ email: ghostEmail });
      if (byEmail && byEmail.length > 0) {
        verified = byEmail[0];
        console.log(`[GHOST VERIFY] ✓ Found by email on attempt ${attempt}`);
        break;
      }
    }
    
    if (!verified) {
      console.error('[GHOST CREATE] ✗ Verification failed after', maxRetries, 'retries');
      return Response.json({ 
        error: 'User creation verification failed - database propagation delay',
        debug: { attempted_id: result.id, ghost_id: ghostId, retries: maxRetries }
      }, { status: 500 });
    }

    // STEP 5: Validate all critical fields
    console.log('[GHOST CREATE] Validating user data...');
    const validationErrors = [];
    
    if (!verified.id) validationErrors.push('missing id');
    if (!verified.full_name) validationErrors.push('missing full_name');
    if (!verified.email) validationErrors.push('missing email');
    if (!verified.ghost_id) validationErrors.push('missing ghost_id');
    if (!verified.username) validationErrors.push('missing username');
    if (!verified.is_ghost_account) validationErrors.push('missing is_ghost_account flag');

    if (validationErrors.length > 0) {
      console.error('[GHOST CREATE] ✗ Validation errors:', validationErrors);
      return Response.json({ 
        error: 'User validation failed',
        missing_fields: validationErrors,
        user_data: verified
      }, { status: 500 });
    }

    console.log('[GHOST CREATE] ✓ All validations passed');

    // STEP 6: Verify relationships work
    const [listings, posts] = await Promise.all([
      base44.asServiceRole.entities.Listing.filter({ created_by_id: result.id }),
      base44.asServiceRole.entities.CommunityPost.filter({ author_email: verified.email })
    ]);

    console.log('[GHOST CREATE] ✓ Relationships validated:', {
      listings_count: listings.length,
      posts_count: posts.length
    });

    // STEP 7: Return success
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
        is_connected_account: verified.is_connected_account,
        is_seller: verified.is_seller,
        account_type: verified.account_type,
        business_name: verified.business_name,
        seller_location: verified.seller_location,
        location: verified.location,
        seller_area: verified.seller_area,
        seller_page_enabled: verified.seller_page_enabled,
        profile_picture: verified.profile_picture,
        cover_photo: verified.cover_photo,
        bio: verified.bio,
        seller_bio: verified.seller_bio,
        created_by_admin_id: verified.created_by_admin_id,
        created_by_admin_email: verified.created_by_admin_email,
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