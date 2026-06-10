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

    // STEP 2: Invite user (REQUIRED - User.create() doesn't persist)
    console.log('[GHOST CREATE] Inviting user:', ghostEmail);
    const inviteResult = await base44.users.inviteUser(ghostEmail, 'user');
    console.log('[GHOST CREATE] ✓ Invite sent:', inviteResult);

    // STEP 3: Wait for user creation then fetch
    console.log('[GHOST CREATE] Waiting for user creation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // STEP 4: Fetch the created user
    const users = await base44.entities.User.filter({ email: ghostEmail });
    if (!users || users.length === 0) {
      console.error('[GHOST CREATE] ✗ User not found after invite');
      return Response.json({ 
        error: 'User creation failed - not found after invite',
        debug: { ghost_id: ghostId, email: ghostEmail }
      }, { status: 500 });
    }

    const createdUser = users[0];
    console.log('[GHOST CREATE] ✓ User created via invite:', createdUser.id);

    // STEP 5: Update with ghost account metadata
    const updateData = {
      full_name: full_name.trim(),
      channel_name: channel_name?.trim() || full_name.trim(),
      username: cleanUsername,
      username_set: true,
      user_type: user_type || 'seller',
      is_seller: user_type !== 'customer',
      account_type: user_type === 'business' ? 'business_owner' : 'customer',
      business_name: business_name?.trim() || full_name.trim(),
      seller_location: location || 'Manila',
      location: location || 'Manila',
      seller_area: seller_area || '',
      seller_page_enabled: user_type !== 'customer',
      bio: bio || '',
      seller_bio: bio || '',
      is_ghost_account: true,
      is_connected_account: true,
      ghost_id: ghostId,
      ghost_linked: false,
      is_verified_seller: false,
      verification_submitted: false,
      seller_pending: false,
      business_pending: false,
      seller_products: [],
      business_categories: [],
      facebook_page_id: '',
      facebook_page_name: '',
      facebook_live_enabled: false,
      social_facebook: '',
      social_instagram: '',
      social_tiktok: '',
      social_twitter: '',
      social_youtube: '',
      social_viber: '',
      social_telegram: '',
      phone: '',
      show_phone_public: false,
      show_email_public: false,
      profile_picture: '',
      cover_photo: '',
    };

    console.log('[GHOST CREATE] Updating user with ghost metadata...');
    const updated = await base44.entities.User.update(createdUser.id, updateData);
    console.log('[GHOST CREATE] ✓ User updated:', updated.id);

    // STEP 6: Final verification
    const verified = await base44.entities.User.filter({ id: updated.id });
    if (!verified || verified.length === 0) {
      console.error('[GHOST CREATE] ✗ Final verification failed');
      return Response.json({ error: 'Final verification failed' }, { status: 500 });
    }

    const finalUser = verified[0];
    console.log('[GHOST CREATE] ✓ Final verification successful:', {
      id: finalUser.id,
      name: finalUser.full_name,
      ghost_id: finalUser.ghost_id
    });

    // STEP 7: Return success
    return Response.json({
      success: true,
      user: {
        id: finalUser.id,
        full_name: finalUser.full_name,
        channel_name: finalUser.channel_name,
        email: finalUser.email,
        username: finalUser.username,
        ghost_id: finalUser.ghost_id,
        user_type: finalUser.user_type,
        is_ghost_account: finalUser.is_ghost_account,
        seller_location: finalUser.seller_location,
        created_date: finalUser.created_date
      },
      profile_url: `/seller/${finalUser.id}`,
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