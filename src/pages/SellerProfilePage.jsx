import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, MessageSquare, Send, X, UserCheck, UserPlus,
  Facebook, Instagram, Youtube, Globe, Phone,
  Grid, FileText, Heart, Share2, Flag, RotateCcw,
  MessageCircle, ArrowLeft, Package, Camera, Image, UtensilsCrossed, Palette, Save
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TikTokIcon from '../components/icons/TikTokIcon';
import MetaVerifiedBadge from '../components/MetaVerifiedBadge';
import AISellerTips from '../components/seller/AISellerTips';
import MenuManager from '../components/seller/MenuManager';
// Ghost session helpers
const getGhostSession = () => { try { return JSON.parse(sessionStorage.getItem('1m_ghost_session')); } catch { return null; } };
const getStoredTheme = (id) => { try { return JSON.parse(localStorage.getItem(`seller_theme_${id}`) || '{}'); } catch { return {}; } };

const SOCIAL_CONFIGS = {
  facebook: { icon: Facebook, color: '#1877f2', bg: 'rgba(24,119,242,0.15)', label: 'Facebook' },
  instagram: { icon: Instagram, color: '#e1306c', bg: 'rgba(225,48,108,0.15)', label: 'Instagram' },
  youtube: { icon: Youtube, color: '#ff0000', bg: 'rgba(255,0,0,0.15)', label: 'YouTube' },
  tiktok: { icon: TikTokIcon, color: '#69c9d0', bg: 'rgba(105,201,208,0.15)', label: 'TikTok' },
  viber: { icon: Phone, color: '#7360f2', bg: 'rgba(115,96,242,0.15)', label: 'Viber' },
};

function UserTypeBadge({ seller }) {
  // Hide admin & ghost flags from public view - show as regular user
  const isGhost = seller?.is_ghost_account || seller?.ghost_id;
  if (isGhost) return null; // Ghost accounts appear as regular users
  
  const isAdmin = seller?.role === 'admin';
  const isBusiness = seller?.account_type === 'business_owner' || seller?.user_type === 'business';
  const isSeller = seller?.user_type === 'seller' || seller?.is_seller;
  
  if (isAdmin) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.35)', color: '#fbbf24' }}>
      CEO &amp; Founder
    </span>
  );
  if (isBusiness) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(0,212,255,0.12)', borderColor: 'rgba(0,212,255,0.3)', color: '#00D4FF' }}>
      Business Owner
    </span>
  );
  if (isSeller) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-body font-bold text-[10px] border"
      style={{ background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.3)', color: '#c084fc' }}>
      Seller
    </span>
  );
  return null;
}

function MessageModal({ seller, user, onClose }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    await base44.entities.ChatMessage.create({
      listing_id: 'profile_' + seller.id,
      listing_title: 'Chat with ' + (seller.channel_name || seller.full_name || 'Seller'),
      seller_email: seller.email,
      buyer_email: user.email,
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      message: message.trim(),
      chat_type: 'listing',
    });
    setSending(false);
    setSent(true);
    setTimeout(() => { onClose(); navigate('/messages'); }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,10,25,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            {seller.profile_picture
              ? <img src={seller.profile_picture} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-sm">
                  {(seller.channel_name || seller.full_name || 'S')[0]}
                </div>}
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-sm text-white">{seller.channel_name || seller.full_name || 'Seller'}</p>
            <UserTypeBadge seller={seller} />
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl">AI</div>
              <p className="font-heading font-bold text-white">Message Sent!</p>
              <p className="font-body text-xs text-white/40">Redirecting to Messages...</p>
            </div>
          ) : (
            <>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Write your message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50 resize-none" />
              <button onClick={handleSend} disabled={!message.trim() || sending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-[1.02] disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                {sending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Gallery image lightbox
function Lightbox({ images, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
      onClick={onClose}>
      <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/30 transition-colors z-10">
        <X className="w-5 h-5 text-white" />
      </button>
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/30 transition-colors z-10 text-white font-bold text-xl">‹</button>
      )}
      {idx < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/30 transition-colors z-10 text-white font-bold text-xl">›</button>
      )}
      <img src={images[idx]} alt="" className="max-w-[92vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-white/40">{idx + 1} / {images.length}</p>
    </motion.div>
  );
}

// Listing card with engagement buttons
function ListingCard({ item, user }) {
  const [hearted, setHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const borderColor = item.border_color || '#00D4FF';

  const handleHeart = async (e) => {
    e.preventDefault();
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    if (hearted) return;
    setHearted(true);
    setHeartCount(c => c + 1);
    await base44.entities.ListingHeart.create({ listing_id: item.id, user_email: user.email });
  };

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/listing/${item.id}`;
    if (navigator.share) {
      navigator.share({ title: item.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
      style={{ background: 'rgba(13,31,60,0.9)', border: `2px solid ${borderColor}`, boxShadow: `0 4px 20px ${borderColor}40` }}>
      <Link to={`/listing/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.image_url
            ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.06)' }}>
                <Package className="w-10 h-10 text-white/15" />
              </div>}
          {item.condition && item.condition !== 'N/A' && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-body text-[9px] font-bold"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#00D4FF', backdropFilter: 'blur(4px)' }}>
              {item.condition}
            </span>
          )}
        </div>
        <div className="p-3 pb-2">
          <h3 className="font-heading font-semibold text-sm text-white mb-1 line-clamp-2 leading-snug">{item.title}</h3>
          <p className="font-body text-sm font-bold text-[#00D4FF] mb-1">
            {item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : 'Contact for price')}
          </p>
          {item.location && (
            <p className="font-body text-[10px] text-white/35 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> {item.location}
            </p>
          )}
        </div>
      </Link>
      {/* Engagement bar */}
      <div className="flex items-center gap-1 px-3 pb-3 pt-1 border-t border-white/6">
        <button onClick={handleHeart}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold transition-all ${hearted ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
          style={{ background: hearted ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)' }}>
          <Heart className={`w-3.5 h-3.5 ${hearted ? 'fill-red-400' : ''}`} />
          {heartCount > 0 && <span>{heartCount}</span>}
        </button>
        <Link to={`/listing/${item.id}#comments`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/40 hover:text-[#00D4FF] transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <MessageCircle className="w-3.5 h-3.5" />
        </Link>
        <button onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/40 hover:text-green-400 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Share2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/listing/${item.id}`); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/40 hover:text-purple-400 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1" />
        <Link to={`/listing/${item.id}`}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/30 hover:text-red-400 transition-all">
          <Flag className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [showMessage, setShowMessage] = useState(false);
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [error, setError] = useState(null);
  const [galleryTick, setGalleryTick] = useState(0);
  const [landingTheme, setLandingTheme] = useState({ layout: 'classic', effect: 'fade', primary: '#0033CC', secondary: '#001a80' });
  const [themeSaving, setThemeSaving] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setGalleryTick(t => t + 1), 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!seller?.id) return;
    const stored = getStoredTheme(seller.id);
    setLandingTheme({
      layout: seller.landing_layout || stored.layout || 'classic',
      effect: seller.landing_theme_effect || stored.effect || 'fade',
      primary: seller.landing_theme_primary || stored.primary || '#0033CC',
      secondary: seller.landing_theme_secondary || stored.secondary || '#001a80',
    });
  }, [seller?.id]);

  useEffect(() => {
    // Get current user
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    
    if (!sellerId) return;
    
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[PROFILE LOAD] Starting lookup for:', sellerId);
        
        // STEP 0: Check if this is a ghost account (sessionStorage)
        const session = getGhostSession();
        if (session && (session.id === sellerId || session.ghost_id === sellerId || session.username === sellerId)) {
          console.log('[PROFILE LOAD] AI Found active ghost session');
          // Try to load fresh DB data for this ghost
          let ghostData = session;
          try {
            const dbUsers = await base44.entities.User.filter({ ghost_id: session.id || session.ghost_id });
            if (dbUsers.length > 0) ghostData = { ...session, ...dbUsers[0] };
          } catch {}
          setSeller(ghostData);
          const dbId = ghostData.id || sellerId;
          const [listings, posts] = await Promise.all([
            base44.entities.Listing.filter({ created_by_id: dbId, approval_status: 'approved', is_active: true }),
            base44.entities.CommunityPost.filter({ author_email: ghostData.email }),
          ]);
          setListings(listings);
          setPosts(posts);
          setLoading(false);
          return;
        }
        
        // STEP 1: Check localStorage for ghost
        const ghostKey = `1m_ghost_${sellerId}`;
        const ghostRaw = localStorage.getItem(ghostKey);
        
        if (ghostRaw) {
          console.log('[PROFILE LOAD] AI Found ghost account in localStorage');
          const ghost = JSON.parse(ghostRaw);
          setSeller(ghost);
          const [listings, posts] = await Promise.all([
            base44.entities.Listing.filter({ created_by_id: sellerId, approval_status: 'approved', is_active: true }),
            base44.entities.CommunityPost.filter({ author_email: ghost.email }),
          ]);
          setListings(listings);
          setPosts(posts);
          setLoading(false);
          return;
        }
        
        // STEP 1: Look up real user
        let users = [];
        let lookupMethod = '';
        
        // Method 1: Filter by ID
        users = await base44.entities.User.filter({ id: sellerId });
        if (users.length > 0) lookupMethod = 'ID';
        
        // Method 2: Filter by username
        if (users.length === 0) {
          users = await base44.entities.User.filter({ username: sellerId });
          if (users.length > 0) lookupMethod = 'username';
        }
        
        // Method 3: Filter by email
        if (users.length === 0) {
          users = await base44.entities.User.filter({ email: sellerId });
          if (users.length > 0) lookupMethod = 'email';
        }
        
        // Method 4: List all and search
        if (users.length === 0) {
          console.log('[PROFILE LOAD] Primary lookups failed, trying list search...');
          const allUsers = await base44.entities.User.list('-created_date', 500);
          const matched = allUsers.filter(u => 
            u.id === sellerId || 
            u.username === sellerId || 
            u.ghost_id === sellerId ||
            u.channel_name === sellerId
          );
          users = matched;
          if (users.length > 0) lookupMethod = 'list_search';
        }
        
        // STEP 2: Handle not found
        if (users.length === 0) {
          console.error('[PROFILE LOAD] AI FAILED - No user found for:', sellerId);
          setError('Profile not found. This account may not exist or was deleted.');
          setLoading(false);
          return;
        }
        
        const seller = users[0];
        console.log('[PROFILE LOAD] AI Found via', lookupMethod + ':', seller.full_name);
        setSeller(seller);
        
        // STEP 3: Load listings and posts
        const [byEmail, byCreator, byOwner, communityPosts] = await Promise.all([
          base44.entities.Listing.filter({ email_contact: seller.email, approval_status: 'approved', is_active: true }),
          base44.entities.Listing.filter({ created_by_id: seller.id, approval_status: 'approved', is_active: true }),
          base44.entities.Listing.filter({ owner_user_id: seller.id, approval_status: 'approved', is_active: true }),
          base44.entities.CommunityPost.filter({ author_email: seller.email }),
        ]);
        
        const seen = new Set();
        const items = [...byEmail, ...byCreator, ...byOwner].filter(l => {
          if (seen.has(l.id)) return false;
          seen.add(l.id);
          return true;
        });
        
        console.log('[PROFILE LOAD] Loaded', items.length, 'listings and', communityPosts.length, 'posts');
        setListings(items);
        setPosts(communityPosts);
        
      } catch (err) {
        console.error('[PROFILE LOAD] AI Error:', err.message);
        setError('Failed to load profile: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [sellerId]);

  const handleFollow = async () => {
    if (!user || followLoading) return;
    setFollowLoading(true);
    if (following) {
      const follows = await base44.entities.Follow.filter({ follower_email: user.email, following_user_id: sellerId });
      if (follows.length > 0) await base44.entities.Follow.delete(follows[0].id);
      setFollowing(false);
      setFollowerCount(c => c - 1);
    } else {
      await base44.entities.Follow.create({ follower_email: user.email, following_user_id: sellerId, following_email: seller.email });
      setFollowing(true);
      setFollowerCount(c => c + 1);
    }
    setFollowLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!seller && !loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <p className="font-heading font-bold text-xl text-white">Profile Not Found</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#00D4FF] font-body text-sm hover:underline">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const isGhostAccount = seller.is_ghost_account || seller.ghost_id || seller.email?.includes('@1marketph-ghost.internal');
  const isVerified = !isGhostAccount && seller.is_verified_seller;
  const ghostSess = getGhostSession();
  const isOwnProfile = ghostSess
    ? (ghostSess.id === sellerId || ghostSess.ghost_id === sellerId || ghostSess.id === seller.id || ghostSess.username === sellerId)
    : user?.email === seller.email || user?.id === seller.id || user?.username === sellerId;

  const saveLandingTheme = async () => {
    setThemeSaving(true);
    localStorage.setItem(`seller_theme_${seller.id}`, JSON.stringify(landingTheme));
    try {
      if (ghostSess) {
        const next = { ...seller, landing_layout: landingTheme.layout, landing_theme_effect: landingTheme.effect, landing_theme_primary: landingTheme.primary, landing_theme_secondary: landingTheme.secondary };
        localStorage.setItem('1m_ghost_' + (seller.ghost_id || seller.id), JSON.stringify(next));
        setSeller(next);
      } else if (user?.id === seller.id) {
        await base44.auth.updateMe({ landing_layout: landingTheme.layout, landing_theme_effect: landingTheme.effect, landing_theme_primary: landingTheme.primary, landing_theme_secondary: landingTheme.secondary });
      } else {
        await base44.entities.User.update(seller.id, { landing_layout: landingTheme.layout, landing_theme_effect: landingTheme.effect, landing_theme_primary: landingTheme.primary, landing_theme_secondary: landingTheme.secondary });
      }
    } catch {}
    setThemeSaving(false);
  };

  const pageBackground = landingTheme.effect === 'plain'
    ? landingTheme.primary
    : landingTheme.effect === 'mix'
      ? `radial-gradient(circle at top left, ${landingTheme.primary} 0%, ${landingTheme.secondary} 45%, #070F1A 100%)`
      : `linear-gradient(180deg, ${landingTheme.primary} 0%, ${landingTheme.secondary} 100%)`;

  // Display name: prefer channel_name, then full_name, then username
  const displayName = seller.channel_name || seller.full_name || seller.username || 'Seller';
  // Ghost accounts: NEVER show internal email or ghost-specific flags publicly
  // Show contact info only if seller has set it public AND not a ghost account
  const showPhone = !isGhostAccount && seller.show_phone_public && seller.phone;
  const showEmail = !isGhostAccount && seller.show_email_public && seller.email && !seller.email.includes('@1marketph-ghost.internal');
  const coverImages = Array.from(new Set([seller.cover_photo, ...(seller.cover_photo_gallery || [])].filter(Boolean)));
  const profileImages = Array.from(new Set([seller.profile_picture, ...(seller.profile_picture_gallery || [])].filter(Boolean)));
  const activeCoverPhoto = coverImages.length ? coverImages[galleryTick % coverImages.length] : '';
  const activeProfilePicture = profileImages.length ? profileImages[galleryTick % profileImages.length] : '';

  const socials = [
    seller.social_facebook && { key: 'facebook', url: seller.social_facebook },
    seller.social_instagram && { key: 'instagram', url: seller.social_instagram },
    seller.social_youtube && { key: 'youtube', url: seller.social_youtube },
    seller.social_tiktok && { key: 'tiktok', url: seller.social_tiktok },
    seller.social_viber && { key: 'viber', url: seller.social_viber },
  ].filter(Boolean);

  // Collect all gallery images from listings
  const galleryImages = listings.flatMap(item => [
    item.image_url,
    ...(item.extra_images || []),
  ]).filter(Boolean);

  const openLightbox = (images, idx) => { setLightboxImages(images); setLightboxIdx(idx); };

  const memberSince = seller.created_date
    ? new Date(seller.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })
    : '';

  // Determine if this seller has food/hotel/travel listings for Menu tab
  const menuListings = listings.filter(l => ['food','hotel','flights','vehicle_rental'].includes(l.type));
  const hasMenuListings = menuListings.length > 0;

  const TABS = [
    { key: 'gallery', label: 'Gallery', icon: Camera, count: galleryImages.length },
    { key: 'listings', label: 'Listings', icon: Grid, count: listings.length },
    ...(hasMenuListings ? [{ key: 'menu', label: 'Menu / Packages', icon: UtensilsCrossed, count: null }] : []),
    { key: 'posts', label: 'Posts', icon: FileText, count: posts.length },
    { key: 'about', label: 'About', icon: Globe, count: null },
  ];

  return (
    <div className="min-h-screen transition-colors duration-700" style={{ background: pageBackground }}>
      {/* Cover Photo */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeCoverPhoto
            ? <motion.img key={activeCoverPhoto} src={activeCoverPhoto} alt="cover" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
            : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#0033CC 0%,#001a80 50%,#0D1F3C 100%)' }} />}
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(7,15,26,0.97) 100%)' }} />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold text-white/80 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <div className={`${landingTheme.layout === 'wide' ? 'max-w-6xl' : landingTheme.layout === 'compact' ? 'max-w-3xl' : 'max-w-4xl'} mx-auto px-4 -mt-20 relative z-10 pb-16`}>
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-5"
          style={{ background: 'rgba(13,31,60,0.97)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(12px)' }}>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden"
                style={isVerified
                  ? { boxShadow: '0 0 0 2px #a855f7, 0 0 0 4px #38bdf8, 0 0 20px rgba(168,85,247,0.4)' }
                  : { boxShadow: '0 0 0 2px rgba(37,99,235,0.5)' }}>
                {activeProfilePicture
                  ? <AnimatePresence mode="wait"><motion.img key={activeProfilePicture} src={activeProfilePicture} alt={displayName} className="w-full h-full object-cover" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.5 }} /></AnimatePresence>
                  : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-3xl text-white">
                      {displayName[0].toUpperCase()}
                    </div>}
              </div>
              {isVerified && (
                <div className="absolute -bottom-2 -right-2">
                  <MetaVerifiedBadge size="sm" label="" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h1 className="font-heading font-bold text-2xl text-white leading-tight">{displayName}</h1>
                    {isVerified && <MetaVerifiedBadge size="md" label="Verified" />}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <UserTypeBadge seller={seller} />
                    {seller.seller_location && (
                      <span className="flex items-center gap-1 font-body text-[11px] text-white/40">
                        <MapPin className="w-3 h-3 text-[#00D4FF]" />
                        {seller.seller_location}{seller.seller_area ? ` · ${seller.seller_area}` : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {!isOwnProfile && user && (
                    <>
                      <button onClick={handleFollow} disabled={followLoading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs transition-all ${
                          following
                            ? 'bg-white/10 border border-white/20 text-white/60 hover:bg-red-500/15 hover:text-red-400 hover:border-red-400/30'
                            : 'text-[#0A192F]'}`}
                        style={!following ? { background: 'linear-gradient(135deg,#00D4FF,#2563EB)' } : {}}>
                        {following ? <><UserCheck className="w-3.5 h-3.5" /> Following</> : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
                      </button>
                      <button onClick={() => setShowMessage(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition-all">
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </button>
                    </>
                  )}
                  {!isOwnProfile && !user && (
                    <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs text-[#0A192F]"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                      <UserPlus className="w-3.5 h-3.5" /> Follow
                    </button>
                  )}
                  {isOwnProfile && (
                    <Link to="/profile"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs border border-white/20 text-white/60 hover:bg-white/10 transition-all">
                      Edit Profile {ghostSess ? '(Ghost)' : ''}
                    </Link>
                  )}
                </div>
              </div>

              {/* Bio */}
              {seller.bio && (
                <p className="font-body text-sm text-white/60 mb-3 leading-relaxed">{seller.bio}</p>
              )}

              {/* Social Links — always show */}
              {socials.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {socials.map(s => {
                    const cfg = SOCIAL_CONFIGS[s.key];
                    const Icon = cfg.icon;
                    return (
                      <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-[11px] font-semibold transition-all hover:scale-105"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </a>
                    );
                  })}
                  {/* Only show phone/email if seller made it public */}
                  {showPhone && (
                    <a href={`tel:${seller.phone}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-[11px] font-semibold transition-all hover:scale-105"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
                      <Phone className="w-3 h-3" /> {seller.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Row — only public/safe stats */}
          {isOwnProfile && <div className="mt-4"><AISellerTips user={seller} listings={listings} /></div>}
          {isOwnProfile && (
            <div className="mt-4 p-3 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#00D4FF]" />
                <p className="font-body text-[10px] text-white/45 uppercase tracking-wider font-bold">Landing Page Theme</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select value={landingTheme.layout} onChange={e => setLandingTheme(t => ({ ...t, layout: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00D4FF]">
                  <option value="classic" className="bg-[#0D1F3C]">Classic</option>
                  <option value="wide" className="bg-[#0D1F3C]">Wide</option>
                  <option value="compact" className="bg-[#0D1F3C]">Compact</option>
                </select>
                <select value={landingTheme.effect} onChange={e => setLandingTheme(t => ({ ...t, effect: e.target.value }))} className="bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00D4FF]">
                  <option value="fade" className="bg-[#0D1F3C]">Fade Gradient</option>
                  <option value="mix" className="bg-[#0D1F3C]">Mixed Colors</option>
                  <option value="plain" className="bg-[#0D1F3C]">Plain Color</option>
                </select>
                <input type="color" value={landingTheme.primary} onChange={e => setLandingTheme(t => ({ ...t, primary: e.target.value }))} className="h-9 w-full rounded-xl bg-white/5 border border-white/10 p-1" />
                <input type="color" value={landingTheme.secondary} onChange={e => setLandingTheme(t => ({ ...t, secondary: e.target.value }))} className="h-9 w-full rounded-xl bg-white/5 border border-white/10 p-1" />
              </div>
              <button onClick={saveLandingTheme} disabled={themeSaving} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-bold text-[#0A192F] bg-[#00D4FF] hover:bg-white transition-colors disabled:opacity-50">
                <Save className="w-3.5 h-3.5" /> {themeSaving ? 'Saving...' : 'Save Landing Theme'}
              </button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/8">
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-white">{listings.length}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Listings</p>
            </div>
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-[#00D4FF]">{followerCount}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center py-2">
              <p className="font-heading font-bold text-xl text-purple-400">{posts.length}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">Posts</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-2xl overflow-x-auto" style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-body font-bold text-xs transition-all whitespace-nowrap min-w-0"
              style={{
                background: activeTab === tab.key ? 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(37,99,235,0.15))' : 'transparent',
                color: activeTab === tab.key ? '#00D4FF' : 'rgba(255,255,255,0.4)',
                border: activeTab === tab.key ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}>
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0"
                  style={{
                    background: activeTab === tab.key ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)',
                    color: activeTab === tab.key ? '#00D4FF' : 'rgba(255,255,255,0.4)'
                  }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {galleryImages.length === 0 ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Image className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-body text-sm text-white/30">No gallery photos yet</p>
              </div>
            ) : (
              <>
                {/* Hero image */}
                {galleryImages[0] && (
                  <div className="relative rounded-2xl overflow-hidden mb-3 cursor-pointer group"
                    style={{ height: '300px' }}
                    onClick={() => openLightbox(galleryImages, 0)}>
                    <img src={galleryImages[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Masonry-style grid */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.slice(1).map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
                        onClick={() => openLightbox(galleryImages, i + 1)}>
                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="font-body text-[10px] text-white/25 text-center mt-3">{galleryImages.length} photo{galleryImages.length !== 1 ? 's' : ''} · Tap to view full size</p>
              </>
            )}

            {/* Show latest listings below gallery */}
            {listings.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-base text-white">Latest Listings</h2>
                  <button onClick={() => setActiveTab('listings')} className="font-body text-xs text-[#00D4FF] hover:underline">View all →</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {listings.slice(0, 4).map(item => (
                    <ListingCard key={item.id} item={item} user={user} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {listings.length === 0 ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Package className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-body text-sm text-white/30">No active listings yet</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(item => (
                  <ListingCard key={item.id} item={item} user={user} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Menu / Packages Tab */}
        {activeTab === 'menu' && hasMenuListings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="font-body text-sm text-white/50 px-1">
              {menuListings.some(l => l.type === 'food') ? 'Full menu from this seller.' : 'Packages & room types available.'}
            </p>
            {menuListings.map(listing => (
              <div key={listing.id}>
                <Link to={`/listing/${listing.id}`}
                  className="flex items-center gap-2 mb-3 px-1 hover:opacity-80 transition-opacity">
                  {listing.image_url && <img src={listing.image_url} alt={listing.title} className="w-8 h-8 rounded-lg object-cover" />}
                  <p className="font-body font-bold text-sm text-white truncate">{listing.title}</p>
                </Link>
                <MenuManager
                  listingId={listing.id}
                  listingType={listing.type === 'food' ? 'food' : listing.type === 'hotel' ? 'hotel' : 'travel'}
                  ownerId={seller?.id}
                  isAdmin={false}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {posts.length === 0 ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FileText className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="font-body text-sm text-white/30">No community posts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="rounded-2xl p-5" style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                        {seller.profile_picture
                          ? <img src={seller.profile_picture} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-xs">{displayName[0]}</div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-body font-bold text-xs text-white">{displayName}</p>
                          {isVerified && <MetaVerifiedBadge size="xs" label="" />}
                        </div>
                        <p className="font-body text-[10px] text-white/35">
                          {new Date(post.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {post.post_type && (
                        <span className="ml-auto px-2 py-0.5 rounded-full font-body text-[9px] font-bold capitalize"
                          style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}>
                          {post.post_type}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-white/70 leading-relaxed">{post.content}</p>
                    {post.image_url && (
                      <div className="mt-3 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => openLightbox([post.image_url], 0)}>
                        <img src={post.image_url} alt="" className="w-full max-h-80 object-cover hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/6">
                      <span className="font-body text-[11px] text-white/30">{post.likes || 0} likes</span>
                      <span className="font-body text-[11px] text-white/30">{post.comment_count || 0} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-6 space-y-5"
            style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <h3 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wider">Channel / Profile</h3>
              <p className="font-body text-base font-bold text-[#00D4FF]">{displayName}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <UserTypeBadge seller={seller} />
                {isVerified && <MetaVerifiedBadge size="sm" label="Verified Partner" />}
              </div>
            </div>
            {seller.bio && (
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wider">About</h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{seller.bio}</p>
              </div>
            )}
            {seller.seller_location && (
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wider">Location</h3>
                <p className="font-body text-sm text-white/60 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00D4FF]" />
                  {seller.seller_location}{seller.seller_area ? ` · ${seller.seller_area}` : ''}
                </p>
              </div>
            )}
            {memberSince && !isGhostAccount && (
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-1 uppercase tracking-wider">Member Since</h3>
                <p className="font-body text-sm text-white/50">{memberSince}</p>
              </div>
            )}
            {/* Only show contact info if seller made it public */}
            {(showPhone || showEmail) && (
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-2 uppercase tracking-wider">Contact</h3>
                {showPhone && <p className="font-body text-sm text-white/60">{seller.phone}</p>}
                {showEmail && <p className="font-body text-sm text-white/60">{seller.email}</p>}
              </div>
            )}
            {socials.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-sm text-white mb-3 uppercase tracking-wider">Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  {socials.map(s => {
                    const cfg = SOCIAL_CONFIGS[s.key];
                    const Icon = cfg.icon;
                    return (
                      <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
                        <Icon className="w-4 h-4" /> {cfg.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImages && (
          <Lightbox images={lightboxImages} startIdx={lightboxIdx} onClose={() => setLightboxImages(null)} />
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessage && user && (
          <MessageModal seller={seller} user={user} onClose={() => setShowMessage(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}