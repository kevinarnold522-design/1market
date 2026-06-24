import React, { useState, useEffect } from 'react';
import MascotDog from '../components/MascotDog';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import MetaVerifiedBadge from '../components/MetaVerifiedBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart, MessageSquare, Phone, Share2, MapPin, Flag, Facebook, Instagram, Youtube, CheckCircle, BedDouble, Calendar, Clock, ShoppingCart, Play, X, ExternalLink, Send, Briefcase, Utensils, Home, Car, Wrench, Plane, Tag, Package, Link2, Store, MessageCircle, Smartphone, Hourglass, Ban } from 'lucide-react';
import TikTokIcon from '../components/icons/TikTokIcon';
import ReportModal from '../components/ReportModal';
import ReceiptModal from '../components/ReceiptModal';
import AIReviewSummary from '../components/listing/AIReviewSummary';
import ScrollToTop from '../components/ScrollToTop';
import { base44 } from '@/api/base44Client';
import StarField from '../components/StarField';
import RoyalBlueWaves from '../components/RoyalBlueWaves';
import SimilarListings from '../components/SimilarListings';
import ListingContactLinks from '../components/ListingContactLinks';
import { recordView } from '../components/home/RecentlyViewed';
import { requireSupabase } from '@/lib/supabaseClient';

function HotelRoomSelector({ listing, user }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [guestName, setGuestName] = useState(user?.full_name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;
  const total = selectedRoom && nights > 0 ? (selectedRoom.price_per_night || 0) * nights : 0;

  const handleBook = async () => {
    if (!selectedRoom || !checkIn || !checkOut || !guestName || !guestEmail) return;
    setBooking(true);
    await base44.entities.Reservation.create({
      listing_id: listing.id,
      listing_title: listing.title,
      hotel_name: listing.title,
      room_type: selectedRoom.room_type || selectedRoom.name,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      check_in_date: checkIn,
      check_out_date: checkOut,
      num_guests: guests,
      num_nights: nights,
      total_price: total,
      price_per_night: selectedRoom.price_per_night || 0,
      status: 'pending',
      payment_status: 'unpaid',
      seller_email: listing.email_contact || '',
    });
    setBooking(false);
    setBooked(true);
  };

  if (booked) return (
    <div className="mb-4 p-4 rounded-2xl text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
      <p className="font-heading font-bold text-white">Booking Request Sent!</p>
      <p className="font-body text-xs text-white/50 mt-1">The hotel will confirm your reservation shortly.</p>
    </div>
  );

  return (
    <div className="mb-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.04)' }}>
      <div className="p-3 border-b border-white/10" style={{ background: 'rgba(0,212,255,0.08)' }}>
        <p className="font-heading font-bold text-white text-sm flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-[#00D4FF]" /> Select a Room
        </p>
      </div>
      <div className="p-3 space-y-2">
        {listing.hotel_rooms.map((room, i) => (
          <button key={i} onClick={() => setSelectedRoom(room)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${selectedRoom === room ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-white/10 bg-white/3 hover:border-white/25'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-bold text-sm text-white">{room.name || room.room_type}</p>
                {room.description && <p className="font-body text-[10px] text-white/40">{room.description}</p>}
                {room.amenities && <p className="font-body text-[9px] text-[#00D4FF]/70 mt-0.5">{room.amenities}</p>}
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-heading font-bold text-[#00D4FF] text-sm">₱{Number(room.price_per_night || 0).toLocaleString()}</p>
                <p className="font-body text-[9px] text-white/30">/night</p>
                {room.available === false && <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-body text-[8px]">Unavailable</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedRoom && (
        <div className="px-3 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Check-in
              </label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
            </div>
            <div>
              <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Check-out
              </label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
            </div>
          </div>
          <div>
            <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Guests</label>
            <input type="number" min={1} max={listing.hotel_max_guests || 10} value={guests} onChange={e => setGuests(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Your Name</label>
              <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
            </div>
            <div>
              <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Email</label>
              <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="email@..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
            </div>
          </div>
          <div>
            <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Phone</label>
            <input value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+63..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white font-body text-xs focus:outline-none focus:border-[#00D4FF]" />
          </div>
          {nights > 0 && (
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="font-body text-xs text-white/50">{nights} night{nights > 1 ? 's' : ''} × ₱{Number(selectedRoom.price_per_night || 0).toLocaleString()}</span>
              <span className="font-heading font-bold text-[#00D4FF]">₱{total.toLocaleString()}</span>
            </div>
          )}
          <button onClick={handleBook} disabled={booking || !checkIn || !checkOut || !guestName || !guestEmail || nights === 0}
            className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
            {booking ? 'Sending Request...' : `Book Now — ₱${total.toLocaleString()}`}
          </button>
        </div>
      )}
    </div>
  );
}

function BlueHeartAnimation({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="bh"
          initial={{ scale: 0, opacity: 1, y: 0 }}
          animate={{ scale: [1.5, 2, 1.2], opacity: [1, 1, 0], y: -60 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-[600]"
        >
          <Heart className="w-20 h-20 text-blue-400 fill-blue-400" style={{ filter: 'drop-shadow(0 0 20px #3b82f6)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s}
          onClick={() => !readonly && onChange && onChange(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star className={`w-5 h-5 ${(hover || value) >= s ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
        </button>
      ))}
    </div>
  );
}

async function addSellerPoints(sellerId, delta) {
  if (!sellerId || !delta) return;
  const users = await base44.entities.User.filter({ id: sellerId }).catch(() => []);
  const seller = users[0];
  if (!seller) return;
  await base44.entities.User.update(seller.id, { seller_points: Math.max(0, Number(seller.seller_points || 0) + delta) }).catch(() => {});
}

async function incrementListingViewCount(listingId, fallbackViewCount = 0) {
  if (!listingId) return null;

  // Preferred path: atomic increment in DB to avoid lost updates under concurrent traffic.
  try {
    const db = requireSupabase();
    const { data, error } = await db.rpc('increment_listing_view', { p_listing_id: listingId });
    if (!error && typeof data === 'number') return data;
  } catch {}

  // Try a few times so transient fetch/update failures do not drop page-view tracking.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const latest = await base44.entities.Listing.get(listingId).catch(() => null);
      const currentCount = Number(latest?.view_count ?? fallbackViewCount ?? 0) || 0;
      const nextCount = currentCount + 1;
      const updated = await base44.entities.Listing.update(listingId, { view_count: nextCount });
      return Number(updated?.view_count ?? nextCount);
    } catch {}
  }

  // Final fallback: try one direct write using the best known count.
  try {
    const nextCount = (Number(fallbackViewCount || 0) || 0) + 1;
    await base44.entities.Listing.update(listingId, { view_count: nextCount });
    return nextCount;
  } catch {
    return null;
  }
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [hearts, setHearts] = useState(0);
  const [userHearted, setUserHearted] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [sellerProfile, setSellerProfile] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [sellerUser, setSellerUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      let currentUser = null;
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch {}

      try {
        const isAdminViewer = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
        const item = await base44.entities.Listing.filter(isAdminViewer ? { id } : { id, approval_status: 'approved', is_active: true });
        const found = item[0] || null;
        setListing(found);

        if (found) {
          // Track recently viewed immediately on access.
          recordView(found);

          // Increment view count per landing-page access, independent from comments/hearts loading.
          const bumpedViews = await incrementListingViewCount(found.id, found.view_count || 0);
          if (typeof bumpedViews === 'number') {
            setListing(prev => prev ? { ...prev, view_count: bumpedViews } : prev);
            addSellerPoints(found.created_by_id, 1);
          }

          // Load comments
          const cmts = await base44.entities.ListingComment.filter({ listing_id: id });
          setComments(cmts);
          // Load hearts
          const hts = await base44.entities.ListingHeart.filter({ listing_id: id });
          setHearts(hts.length);

          // Recompute points using latest known view count.
          const nextViews = Number(bumpedViews ?? found.view_count ?? 0) || 0;
          const nextPoints = nextViews + (hts.length * 2) + (cmts.length * 3);
          setListing({ ...found, view_count: nextViews, heart_count: hts.length, comment_count: cmts.length, point_count: nextPoints });
          base44.entities.Listing.update(found.id, { heart_count: hts.length, comment_count: cmts.length, point_count: nextPoints }).catch(() => {});
          // Load seller's user profile for their social links
          const sellerId = found.created_by_id;
          if (sellerId) {
            try {
              const sellerUsers = await base44.entities.User.filter({ id: sellerId });
              if (sellerUsers[0]) setSellerUser(sellerUsers[0]);
            } catch {}
          }
        }
      } catch {}
      setLoading(false);
    };
    init();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      base44.entities.ListingHeart.filter({ listing_id: id, user_email: user.email })
        .then(r => setUserHearted(r.length > 0))
        .catch(() => {});
    }
  }, [user, id]);

  useEffect(() => {
    const unsubscribe = base44.entities.Listing.subscribe((event) => {
      const updated = event?.data;
      if (updated?.id === id) setListing(prev => prev ? { ...prev, ...updated } : updated);
    });
    return unsubscribe;
  }, [id]);

  const handleHeart = async () => {
    if (!user) return;
    if (userHearted) {
      const existing = await base44.entities.ListingHeart.filter({ listing_id: id, user_email: user.email });
      if (existing[0]) await base44.entities.ListingHeart.delete(existing[0].id);
      setHearts(h => h - 1);
      setListing(prev => prev ? { ...prev, heart_count: Math.max(0, (prev.heart_count || hearts) - 1), point_count: Math.max(0, (prev.point_count || 0) - 2) } : prev);
      base44.entities.Listing.update(id, { heart_count: Math.max(0, hearts - 1), point_count: Math.max(0, (listing?.point_count || 0) - 2) }).catch(() => {});
      addSellerPoints(listing?.created_by_id, -2);
      setUserHearted(false);
    } else {
      await base44.entities.ListingHeart.create({ listing_id: id, user_email: user.email });
      setHearts(h => h + 1);
      setListing(prev => prev ? { ...prev, heart_count: (prev.heart_count || hearts) + 1, point_count: (prev.point_count || 0) + 2 } : prev);
      base44.entities.Listing.update(id, { heart_count: hearts + 1, point_count: (listing?.point_count || 0) + 2 }).catch(() => {});
      addSellerPoints(listing?.created_by_id, 2);
      setUserHearted(true);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1300);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    const created = await base44.entities.ListingComment.create({
      listing_id: id,
      listing_type: 'db',
      user_email: user.email,
      user_name: user.full_name || 'Member',
      comment: newComment.trim(),
      rating: newRating || 0,
    });
    setComments(c => [created, ...c]);
    setListing(prev => prev ? { ...prev, comment_count: (prev.comment_count || comments.length) + 1, point_count: (prev.point_count || 0) + 3 } : prev);
    base44.entities.Listing.update(id, { comment_count: comments.length + 1, point_count: (listing?.point_count || 0) + 3 }).catch(() => {});
    addSellerPoints(listing?.created_by_id, 3);
    setNewComment('');
    setNewRating(0);
    setSubmitting(false);
  };

  const isAdminViewer = user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isOwnerViewer = !!(user && listing && (user.id === listing.created_by_id || user.email === listing.owner_email || user.email === listing.created_by));

  useEffect(() => {
    if (searchParams.get('edit') !== '1') return;
    if (!listing) return;
    if (!(isAdminViewer || isOwnerViewer)) return;
    navigate(`/listing/${listing.id}/edit`, { replace: true });
  }, [searchParams, listing, isAdminViewer, isOwnerViewer, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center">
      <div className="relative z-10 w-10 h-10 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center gap-4 pt-24">
      <p className="font-body text-sky-700 text-lg">Listing not found.</p>
      <Link to="/" className="px-6 py-2.5 bg-sky-500 text-white rounded-xl font-body font-bold text-sm hover:bg-sky-400 transition-colors">← Go Home</Link>
    </div>
  );

  const images = [listing.image_url, ...(listing.extra_images || [])].filter(Boolean);
  const avgRating = comments.length > 0
    ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.filter(c => c.rating > 0).length || 0).toFixed(1)
    : listing.rating || 0;
  const listingPoints = listing.point_count || ((listing.view_count || 0) + (hearts * 2) + (comments.length * 3));

  const themePrimary = listing.landing_theme_color || listing.border_color || '#3E97F1';
  const themeSecondary = listing.landing_secondary_color || '#60A5FA';
  const galleryEffect = listing.transition_effect || listing.slideshow_animation || 'fade';
  const glowOpacity = listing.glow_effect === 'none' ? 0 : listing.glow_effect === 'neon' ? 0.42 : listing.glow_effect === 'strong' ? 0.32 : 0.2;
  const glowBlur = listing.glow_effect === 'neon' ? 80 : listing.glow_effect === 'strong' ? 62 : 44;
  const pageAnimation = listing.animation_style === 'float'
    ? { y: [0, -8, 0] }
    : listing.animation_style === 'pulse'
      ? { scale: [1, 1.006, 1] }
      : listing.animation_style === 'shimmer'
        ? { opacity: [0.72, 1, 0.72] }
        : {};

  const handleChatSeller = async (message) => {
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    if (listing.email_contact) {
      await base44.entities.ChatMessage.create({
        listing_id: listing.id,
        listing_title: listing.title,
        seller_email: listing.email_contact,
        buyer_email: user.email,
        sender_email: user.email,
        sender_name: user.full_name || user.email,
        message,
        chat_type: 'listing'
      });
      window.location.href = '/messages';
    }
  };

  return (
    <div className="listing-blue-white-theme min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #dff3ff 56%, #bfdbfe 100%)' }}>
      <RoyalBlueWaves />
      <div className="fixed inset-0 pointer-events-none z-[1] bg-[radial-gradient(circle_at_18%_10%,rgba(186,230,253,0.55),transparent_32%),radial-gradient(circle_at_84%_20%,rgba(147,197,253,0.35),transparent_28%)]" />
      <BlueHeartAnimation show={showHeartAnim} />

      {showReport && <ReportModal listing={listing} user={user} onClose={() => setShowReport(false)} />}
      <AnimatePresence>
        {showReceipt && <ReceiptModal listing={listing} user={user} onClose={() => setShowReceipt(false)} />}
      </AnimatePresence>
      <div className="listing-book-page relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
            {listing.main_category ? ` to ${listing.main_category === 'buysell' ? 'Buy & Sell' : listing.main_category.charAt(0).toUpperCase() + listing.main_category.slice(1)}` : ''}
            {listing.subcategory ? ` › ${listing.subcategory}` : ''}
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
          {(isAdminViewer || isOwnerViewer) && (
            <Link to={`/listing/${listing.id}/edit`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-body font-bold text-xs text-[#0A192F] bg-[#FFD700] hover:bg-white transition-colors shadow-lg">
              Edit Listing
            </Link>
          )}
          {/* Approval Status Badge */}
          {listing.approval_status === 'pending' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-xs" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' }}>
              <Hourglass className="w-3 h-3" /> Pending Approval
            </span>
          )}
          {listing.approval_status === 'approved' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-xs" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#34d399' }}>
              <CheckCircle className="w-3 h-3" /> Approved & Live
            </span>
          )}
          {listing.approval_status === 'rejected' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-xs" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>
              <Ban className="w-3 h-3" /> Rejected
            </span>
          )}
          </div>
        </div>

        {listing.description && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(13,31,60,0.92)', border: '1px solid rgba(0,212,255,0.18)' }}>
            <p className="font-body text-xs text-[#00D4FF] mb-2 uppercase tracking-wider font-bold">Description</p>
            <p className="font-body text-base text-white/80 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] relative"
            style={{ boxShadow: listing.glow_effect === 'none' ? '0 8px 24px rgba(37,99,235,0.14)' : `0 0 ${listing.glow_effect === 'strong' || listing.glow_effect === 'neon' ? 56 : 34}px ${themePrimary}66`, border: `2px solid ${themePrimary}55` }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={images[activeImage] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800'}
                alt={listing.title}
                initial={
                  galleryEffect === 'slide' ? { opacity: 0, x: 60 } :
                  galleryEffect === 'zoom' ? { opacity: 0, scale: 1.18 } :
                  galleryEffect === 'flip' ? { opacity: 0, rotateY: 90 } :
                  galleryEffect === 'bounce' ? { opacity: 0, y: 40, scale: 0.9 } :
                  galleryEffect === 'glow' ? { opacity: 0, scale: 0.96, filter: 'brightness(1.45) saturate(1.3)' } :
                  { opacity: 0, scale: 1.04 }
                }
                animate={
                  galleryEffect === 'slide' ? { opacity: 1, x: 0 } :
                  galleryEffect === 'zoom' ? { opacity: 1, scale: 1 } :
                  galleryEffect === 'flip' ? { opacity: 1, rotateY: 0 } :
                  galleryEffect === 'bounce' ? { opacity: 1, y: 0, scale: 1 } :
                  galleryEffect === 'glow' ? { opacity: 1, scale: 1, filter: 'brightness(1) saturate(1)' } :
                  { opacity: 1, scale: 1 }
                }
                exit={
                  galleryEffect === 'slide' ? { opacity: 0, x: -60 } :
                  galleryEffect === 'zoom' ? { opacity: 0, scale: 0.85 } :
                  galleryEffect === 'flip' ? { opacity: 0, rotateY: -90 } :
                  galleryEffect === 'bounce' ? { opacity: 0, y: -20, scale: 0.95 } :
                  galleryEffect === 'glow' ? { opacity: 0, scale: 1.05, filter: 'brightness(1.5) saturate(1.35)' } :
                  { opacity: 0, scale: 0.97 }
                }
                transition={
                  galleryEffect === 'bounce'
                    ? { type: 'spring', stiffness: 300, damping: 20 }
                    : { duration: galleryEffect === 'glow' ? 0.52 : 0.38, ease: 'easeInOut' }
                }
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/40 to-transparent pointer-events-none" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:bg-black/70 transition-colors z-10">‹</button>
                  <button onClick={() => setActiveImage(i => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:bg-black/70 transition-colors z-10">›</button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'w-4' : 'bg-white/40'}`} style={i === activeImage ? { background: themePrimary } : {}} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-[#00D4FF] scale-105' : 'border-white/10'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Preview */}
            {listing.video_url && (
              <div className="mt-3">
                {showVideoPreview ? (
                  <div className="rounded-2xl overflow-hidden relative" style={{ border: '1px solid rgba(0,212,255,0.25)' }}>
                    <button onClick={() => setShowVideoPreview(false)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                    <video src={listing.video_url} controls autoPlay className="w-full rounded-2xl" style={{ maxHeight: 320 }} />
                  </div>
                ) : (
                  <button onClick={() => setShowVideoPreview(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.1))', border: '1px solid rgba(239,68,68,0.35)' }}>
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-red-300">Watch Video Preview</span>
                  </button>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div className="rounded-2xl p-5 mt-4" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <h3 className="font-heading font-bold text-white text-base mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00D4FF]" /> Reviews ({comments.length})
              </h3>

              {/* AI Review Summary — shown when 3+ reviews */}
              <AIReviewSummary comments={comments} listing={listing} />

              {user ? (
                <div className="mb-5 space-y-3">
                  <StarRating value={newRating} onChange={setNewRating} />
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your experience with this listing..."
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50 resize-none" />
                  <button onClick={handleComment} disabled={submitting || !newComment.trim()}
                    className="px-5 py-2 rounded-xl font-body font-bold text-sm text-[#0A192F] disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                    {submitting ? 'Posting...' : 'Post Review'}
                  </button>
                </div>
              ) : (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="font-body text-xs text-white/40">
                    <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="text-[#00D4FF] hover:underline">Sign in</button> to leave a review
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-body font-bold text-xs text-white">{c.user_name || 'Member'}</p>
                      {c.rating > 0 && <StarRating value={c.rating} readonly />}
                    </div>
                    <p className="font-body text-xs text-white/60 leading-relaxed">{c.comment}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="font-body text-xs text-white/25 text-center py-4">No reviews yet. Be the first!</p>}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h1 className="font-heading font-bold text-xl text-white leading-tight">{listing.title}</h1>
                <button onClick={handleHeart}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all ${userHearted ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/30 hover:bg-blue-500/10 hover:text-blue-400'}`}>
                  <Heart className={`w-5 h-5 ${userHearted ? 'fill-blue-400' : ''}`} />
                  <span className="text-[8px] font-bold mt-0.5">{hearts}</span>
                </button>
              </div>

              {/* Category / Subcategory breadcrumb — always visible */}
              {(() => {
                const TYPE_TO_MAIN = {
                  hotel: 'Travel', flights: 'Travel', vehicle_rental: 'Travel',
                  food: 'Food',
                  product: 'Buy & Sell', electronics: 'Buy & Sell', shoes: 'Buy & Sell',
                  clothing: 'Buy & Sell', furniture: 'Buy & Sell', homeappliances: 'Buy & Sell',
                  cars: 'Buy & Sell', houses: 'Buy & Sell', mods: 'Buy & Sell', other: 'Buy & Sell',
                  rent_lease: 'Rent & Lease',
                  services: 'Services',
                  jobs: 'Jobs',
                };
                const MAIN_TO_ROUTE = {
                  'travel': '/travel', 'food': '/food', 'buysell': '/buysell',
                  'rent': '/rent', 'services': '/services', 'jobs': '/jobs',
                };
                const mainLabel = listing.main_category
                  ? (listing.main_category === 'buysell' ? 'Buy & Sell' : listing.main_category === 'rent' ? 'Rent & Lease' : listing.main_category.charAt(0).toUpperCase() + listing.main_category.slice(1))
                  : (listing.type ? TYPE_TO_MAIN[listing.type] : null);
                const typeLabel = listing.type ? listing.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;
                const catRoute = MAIN_TO_ROUTE[listing.main_category] || '/buysell';
                const subRoute = listing.main_category === 'buysell' ? `/buysell?type=${listing.type}&sub=${encodeURIComponent(listing.subcategory || '')}` : listing.main_category === 'food' ? `/food?sub=${encodeURIComponent(listing.subcategory || '')}` : listing.main_category === 'travel' ? `/travel?sub=${encodeURIComponent(listing.subcategory || '')}` : listing.main_category === 'rent' ? `/rent?sub=${encodeURIComponent(listing.subcategory || '')}` : listing.main_category === 'services' ? `/services?sub=${encodeURIComponent(listing.subcategory || '')}` : listing.main_category === 'jobs' ? `/jobs?sub=${encodeURIComponent(listing.subcategory || '')}` : '/buysell';
                const CAT_COLORS = {
                  'Buy & Sell': '#c084fc', 'Travel': '#60a5fa', 'Food': '#fb923c',
                  'Rent & Lease': '#4ade80', 'Services': '#38bdf8', 'Jobs': '#fbbf24',
                };
                const color = CAT_COLORS[mainLabel] || '#00D4FF';
                return (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {mainLabel && (
                      <Link to={catRoute} className="px-2.5 py-1 rounded-lg font-body text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
                        style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}>
                        <Tag className="w-3 h-3" /> {mainLabel}
                      </Link>
                    )}
                    {typeLabel && mainLabel && <span className="text-white/25 text-[10px]">›</span>}
                    {typeLabel && (
                      <Link to={catRoute} className="px-2.5 py-1 rounded-lg font-body text-[10px] font-bold hover:scale-105 transition-transform cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}>
                        {typeLabel}
                      </Link>
                    )}
                    {listing.subcategory && (typeLabel || mainLabel) && <span className="text-white/25 text-[10px]">›</span>}
                    {listing.subcategory && (
                      <Link to={subRoute} className="px-2.5 py-1 rounded-lg font-body text-[10px] font-bold hover:scale-105 transition-transform cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                        {listing.subcategory}
                      </Link>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= s ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />)}
                </div>
                <span className="font-body text-xs text-white/40">{avgRating > 0 ? `${avgRating} (${comments.filter(c=>c.rating>0).length} ratings)` : 'No ratings yet'}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-300 font-body text-[10px] font-bold">{listingPoints} pts</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 font-body text-[10px]">{listing.view_count || 0} views</span>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-body text-sm text-white/70">{listing.area ? `${listing.area}, ` : ''}{listing.location}</span>
                  {listing.full_address && listing.full_address !== listing.location && (
                    <p className="font-body text-[10px] text-white/35 mt-0.5">{listing.full_address}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-heading font-bold text-2xl text-[#00D4FF]">
                    {listing.price_label || (listing.price ? `₱${Number(listing.price).toLocaleString()}` : '—')}
                  </span>
                  {listing.original_price && listing.original_price > listing.price && (
                    <>
                      <span className="font-body text-sm text-white/35 line-through">
                        ₱{Number(listing.original_price).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-heading font-bold text-[10px] text-white"
                        style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                        Save {Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {listing.condition && listing.condition !== 'N/A' && (listing.main_category === 'buysell' || ['product','electronics','shoes','clothing','furniture','homeappliances','cars','houses','mods','other'].includes(listing.type)) && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-body text-[10px]">{listing.condition}</span>
                  )}
                  {listing.quantity != null && listing.quantity > 0 && listing.type !== 'jobs' && listing.type !== 'services' && listing.type !== 'rent_lease' && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold ${listing.quantity <= 5 ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' : 'bg-green-500/15 text-green-400 border border-green-500/25'}`}>
                      <Package className="w-3 h-3" /> {listing.quantity <= 5 ? `Only ${listing.quantity} left!` : `${listing.quantity} in stock`}
                    </span>
                  )}
                  {listing.quantity === 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-body text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Flight details */}
              {listing.type === 'flights' && (listing.flight_departure_date || listing.flight_departure_time || listing.flight_return_date) && (
                <div className="mb-4 p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.25)' }}>
                  <p className="font-body text-[10px] text-sky-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Flight / Tour Schedule
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {listing.flight_departure_date && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Departure Date</p><p className="font-body text-xs text-white font-bold">{listing.flight_departure_date}</p></div>}
                    {listing.flight_departure_time && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Departure Time</p><p className="font-body text-xs text-white font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-sky-400" />{listing.flight_departure_time}</p></div>}
                    {listing.flight_return_date && <div className="col-span-2 bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Return Date</p><p className="font-body text-xs text-white font-bold">{listing.flight_return_date}</p></div>}
                  </div>
                </div>
              )}

              {/* Full specs — electronics */}
              {listing.specs && (
                <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <p className="font-body text-[10px] text-[#00D4FF] uppercase tracking-wider mb-1.5">Full Specifications</p>
                  <p className="font-body text-xs text-white/65 leading-relaxed whitespace-pre-line">{listing.specs}</p>
                </div>
              )}
              {listing.warranty && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[9px] text-green-400/60 uppercase tracking-wider">Warranty</p>
                    <p className="font-body text-xs text-white/70">{listing.warranty}</p>
                  </div>
                </div>
              )}

              {/* Extra details grid */}
              {(listing.brand || listing.model || listing.size || listing.condition) && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {listing.brand && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Brand</p><p className="font-body text-xs text-white font-bold">{listing.brand}</p></div>}
                  {listing.model && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Model</p><p className="font-body text-xs text-white font-bold">{listing.model}</p></div>}
                  {listing.size && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Size</p><p className="font-body text-xs text-white font-bold">{listing.size}</p></div>}
                  {listing.condition && listing.condition !== 'N/A' && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Condition</p><p className="font-body text-xs text-white font-bold">{listing.condition}</p></div>}
                </div>
              )}

              {/* Food details */}
              {listing.type === 'food' && (listing.food_serving || listing.food_dietary || listing.food_spice_level || listing.food_allergens) && (
                <div className="mb-4 p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <p className="font-body text-[10px] text-orange-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><Utensils className="w-3 h-3" /> Food Info</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {listing.food_serving && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Serving</p><p className="font-body text-xs text-white">{listing.food_serving}</p></div>}
                    {listing.food_dietary && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Dietary</p><p className="font-body text-xs text-white">{listing.food_dietary}</p></div>}
                    {listing.food_spice_level && listing.food_spice_level !== 'N/A' && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Spice</p><p className="font-body text-xs text-white">{listing.food_spice_level}</p></div>}
                    {listing.food_allergens && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Allergens</p><p className="font-body text-xs text-white">{listing.food_allergens}</p></div>}
                  </div>
                </div>
              )}

              {/* Job details */}
              {listing.type === 'jobs' && (listing.company_hiring || listing.job_employment_type || listing.job_experience || listing.job_salary_min || listing.job_benefits) && (
                <div className="mb-4 p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="font-body text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Job Details</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {listing.company_hiring && <div className="col-span-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2"><p className="font-body text-[9px] text-amber-400/60">Company Hiring</p><p className="font-body text-sm text-amber-300 font-bold">{listing.company_hiring}</p></div>}
                    {listing.job_poster_role && <div className="col-span-2 bg-white/5 rounded-lg p-2 flex items-center gap-2"><p className="font-body text-[9px] text-white/30">Posted by</p><span className="ml-1 px-2 py-0.5 rounded-full font-body font-bold text-[10px]" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>{listing.job_poster_role}</span></div>}
                    {listing.job_employment_type && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Type</p><p className="font-body text-xs text-white">{listing.job_employment_type}</p></div>}
                    {listing.job_experience && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Experience</p><p className="font-body text-xs text-white">{listing.job_experience}</p></div>}
                    {(listing.job_salary_min || listing.job_salary_max) && (
                      <div className="col-span-2 bg-white/5 rounded-lg p-2">
                        <p className="font-body text-[9px] text-white/30">Salary Range</p>
                        <p className="font-body text-xs text-white font-bold">
                          {listing.job_salary_min ? `₱${Number(listing.job_salary_min).toLocaleString()}` : '?'} – {listing.job_salary_max ? `₱${Number(listing.job_salary_max).toLocaleString()}` : '?'}/mo
                        </p>
                      </div>
                    )}
                    {listing.job_benefits && <div className="col-span-2 bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Benefits</p><p className="font-body text-xs text-white">{listing.job_benefits}</p></div>}
                  </div>
                </div>
              )}

              {/* Service details */}
              {listing.type === 'services' && (listing.service_duration || listing.service_rate_type || listing.service_availability) && (
                <div className="mb-4 p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <p className="font-body text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><Wrench className="w-3 h-3" /> Service Details</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {listing.service_duration && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Duration</p><p className="font-body text-xs text-white">{listing.service_duration}</p></div>}
                    {listing.service_rate_type && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Rate</p><p className="font-body text-xs text-white">{listing.service_rate_type}</p></div>}
                    {listing.service_availability && <div className="col-span-2 bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Availability</p><p className="font-body text-xs text-white">{listing.service_availability}</p></div>}
                  </div>
                </div>
              )}

              {/* Rental details */}
              {listing.type === 'rent_lease' && (listing.rent_furnished || listing.rent_pet_policy || listing.rent_deposit || listing.rent_utilities) && (
                <div className="mb-4 p-3 rounded-xl space-y-1.5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="font-body text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1"><Home className="w-3 h-3" /> Rental Details</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {listing.rent_furnished && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Furnished</p><p className="font-body text-xs text-white">{listing.rent_furnished}</p></div>}
                    {listing.rent_pet_policy && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Pets</p><p className="font-body text-xs text-white">{listing.rent_pet_policy}</p></div>}
                    {listing.rent_deposit && <div className="col-span-2 bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Deposit</p><p className="font-body text-xs text-white">{listing.rent_deposit}</p></div>}
                    {listing.rent_utilities && <div className="col-span-2 bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Utilities</p><p className="font-body text-xs text-white">{listing.rent_utilities}</p></div>}
                  </div>
                </div>
              )}

              {/* Car details */}
              {listing.type === 'cars' && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {listing.year && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Year</p><p className="font-body text-xs text-white font-bold">{listing.year}</p></div>}
                  {listing.mileage && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Mileage</p><p className="font-body text-xs text-white font-bold">{listing.mileage}</p></div>}
                  {listing.transmission && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Trans.</p><p className="font-body text-xs text-white font-bold">{listing.transmission}</p></div>}
                  {listing.car_ownership && <div className="bg-white/5 rounded-lg p-2"><p className="font-body text-[9px] text-white/30">Owner</p><p className="font-body text-xs text-white font-bold">{listing.car_ownership}</p></div>}
                </div>
              )}

              <div className="mb-4">
                <ListingContactLinks listing={listing} sellerUser={sellerUser} />
              </div>

              {/* Tailored CTA — based on category & subcategory */}
              {(() => {
                const BUYSELL_TYPES = ['product','electronics','shoes','clothing','furniture','homeappliances','cars','houses','mods','other'];
                const isBuySell = listing.main_category === 'buysell' || BUYSELL_TYPES.includes(listing.type);
                const isFood = listing.main_category === 'food' || listing.type === 'food';
                const isRent = listing.type === 'rent_lease';
                const isTravel = listing.main_category === 'travel' || listing.type === 'hotel' || listing.type === 'flights' || listing.type === 'vehicle_rental';
                const isService = listing.type === 'services';
                const isJob = listing.type === 'jobs';
                const isCar = listing.type === 'cars';
                const isHouse = listing.type === 'houses';
                const isOutOfStock = isBuySell && listing.quantity === 0;

                if (isOutOfStock) {
                  return <div className="w-full mb-3 py-3 rounded-xl text-center font-body font-bold text-sm text-red-400 border border-red-500/30 bg-red-500/5">Out of Stock</div>;
                }

                // Jobs → Apply Now
                if (isJob) {
                  return (
                    <a href={listing.apply_link || (listing.email_contact ? `mailto:${listing.email_contact}` : '#')}
                      target={listing.apply_link ? '_blank' : undefined} rel="noopener noreferrer"
                      className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
                      <Briefcase className="w-4 h-4" /> Apply Now
                    </a>
                  );
                }

                // Food → Order Now
                if (isFood) {
                  return (
                    <button onClick={async () => {
                      if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                      if (listing.email_contact) {
                        await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I'd like to order: ${listing.title}`, chat_type: 'listing' });
                        window.location.href = '/messages';
                      }
                    }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}>
                      <Utensils className="w-4 h-4" /> Order Now
                    </button>
                  );
                }

                // Hotel → Book Now
                if (listing.type === 'hotel') {
                  return (
                    <button onClick={() => { if (!user) { base44.auth.redirectToLogin(window.location.href); return; } document.getElementById('hotel-room-selector')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                      <BedDouble className="w-4 h-4 text-white" /> <span className="text-white">Book a Room</span>
                    </button>
                  );
                }

                // Travel / flights → Book / Inquire
                if (isTravel) {
                  return (
                    <button onClick={async () => {
                      if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                      if (listing.email_contact) {
                        await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I'd like to book: ${listing.title}`, chat_type: 'listing' });
                        window.location.href = '/messages';
                      }
                    }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}>
                      <Plane className="w-4 h-4" /> Book / Inquire
                    </button>
                  );
                }

                // Rent / Lease → Schedule Visit / Inquire
                if (isRent || isHouse) {
                  return (
                    <button onClick={async () => {
                      if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                      if (listing.email_contact) {
                        await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I'd like to schedule a visit for: ${listing.title}`, chat_type: 'listing' });
                        window.location.href = '/messages';
                      }
                    }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#10b981,#0ea5e9)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                      <Home className="w-4 h-4" /> Schedule a Visit
                    </button>
                  );
                }

                // Car → Inquire / Test Drive
                if (isCar) {
                  return (
                    <button onClick={async () => {
                      if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                      if (listing.email_contact) {
                        await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I'm interested in a test drive for: ${listing.title}`, chat_type: 'listing' });
                        window.location.href = '/messages';
                      }
                    }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
                      <Car className="w-4 h-4" /> Inquire / Test Drive
                    </button>
                  );
                }

                // Services → Get a Quote
                if (isService) {
                  return (
                    <button onClick={async () => {
                      if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                      if (listing.email_contact) {
                        await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I'd like to get a quote for: ${listing.title}`, chat_type: 'listing' });
                        window.location.href = '/messages';
                      }
                    }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                      <Wrench className="w-4 h-4" /> Get a Quote
                    </button>
                  );
                }

                // Buy & Sell → Buy/Avail action, with chat as its own button below
                if (isBuySell) {
                  const btnLabel = listing.subcategory?.toLowerCase().includes('electronics') || listing.type === 'electronics' ? 'Buy Now'
                    : listing.subcategory?.toLowerCase().includes('shoes') || listing.type === 'shoes' ? 'Buy Now'
                    : listing.subcategory?.toLowerCase().includes('clothing') || listing.type === 'clothing' ? 'Shop Now'
                    : 'Avail / Buy';
                  return (
                    <button onClick={() => { if (!user) { base44.auth.redirectToLogin(window.location.href); return; } setShowReceipt(true); }}
                      className="listing-avail-cta w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01]"
                      style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)', boxShadow: '0 0 20px rgba(37,99,235,0.28)' }}>
                      <ShoppingCart className="w-4 h-4" /> {btnLabel}
                    </button>
                  );
                }

                // Fallback
                return (
                  <button onClick={async () => {
                    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
                    if (listing.email_contact) {
                      await base44.entities.ChatMessage.create({ listing_id: listing.id, listing_title: listing.title, seller_email: listing.email_contact, buyer_email: user.email, sender_email: user.email, sender_name: user.full_name || user.email, message: `Hi! I am interested in: ${listing.title}`, chat_type: 'listing' });
                      window.location.href = '/messages';
                    }
                  }} className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.01] border border-[#00D4FF]/40"
                    style={{ background: 'rgba(0,212,255,0.12)', boxShadow: '0 0 16px rgba(0,212,255,0.15)' }}>
                    <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
                    <span className="text-[#00D4FF]">Contact Seller</span>
                  </button>
                );
              })()}

              {listing.email_contact && (!user || user.email !== listing.email_contact) && (
                <button onClick={() => handleChatSeller(`Hi! I'm interested in: ${listing.title}. Is it available?`)}
                  className="w-full mb-3 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm text-[#2563EB] bg-white border border-[#2563EB]/30 hover:bg-blue-50 transition-all hover:scale-[1.01]">
                  <MessageSquare className="w-4 h-4" /> Chat Seller
                </button>
              )}

              {/* Hotel Room Selector */}
              {listing.type === 'hotel' && listing.hotel_rooms && listing.hotel_rooms.length > 0 && (
                <div id="hotel-room-selector">
                  <HotelRoomSelector listing={listing} user={user} />
                </div>
              )}

              {/* Share panel */}
              <AnimatePresence>
                {showSharePanel && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <p className="font-body text-[9px] text-white/30 uppercase tracking-wider mb-2">Share this listing</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-bold"
                        style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa' }}>
                        <Facebook className="w-3.5 h-3.5" /> Share on FB
                      </a>
                      <a href={`https://www.facebook.com/marketplace/create/item/?description=${encodeURIComponent(listing.title + '\n' + window.location.href)}`} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-bold"
                       style={{ background: 'rgba(24,119,242,0.2)', border: '1px solid rgba(24,119,242,0.4)', color: '#93c5fd' }}>
                        <Store className="w-3.5 h-3.5" /> FB Marketplace
                      </a>
                      <a href={`https://wa.me/?text=${encodeURIComponent(listing.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-bold"
                            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
                             <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                           </a>
                           <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowSharePanel(false); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-bold"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                             <Link2 className="w-3.5 h-3.5" /> Copy Link
                           </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share + Report row */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowSharePanel(s => !s)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 font-body text-xs hover:border-white/25 hover:text-white/70 transition-all">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <a href={`https://www.facebook.com/marketplace/create/item/?description=${encodeURIComponent(listing.title + '\n' + window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-body text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(24,119,242,0.15)', border: '1px solid rgba(24,119,242,0.35)', color: '#60a5fa' }}>
                  <Store className="w-3.5 h-3.5" /> FB Marketplace
                </a>
                {user && (
                  <button onClick={() => setShowReport(true)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400/70 font-body text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-all">
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Similar Listings */}
            <SimilarListings listing={listing} />

            {/* Seller Profile snippet */}
            {(listing.approved_channel_name || listing.seller_name) && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(13,31,60,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-2">Posted by</p>
                {/* Show admin-approved channel name prominently if set */}
                {listing.approved_channel_name && (
                  <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-lg w-fit"
                    style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <CheckCircle className="w-3 h-3 text-[#00D4FF]" />
                    <span className="font-body text-[10px] text-[#00D4FF] font-bold">Verified Channel Name</span>
                  </div>
                )}
                {listing.created_by_id ? (
                  <Link to={`/seller/${listing.created_by_id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      {(listing.approved_channel_name || listing.seller_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-body font-bold text-sm text-white group-hover:text-[#00D4FF] transition-colors">
                          {listing.approved_channel_name || listing.seller_name}
                        </p>
                        {listing.seller_is_verified && <MetaVerifiedBadge size="xs" label="" />}
                      </div>
                      <p className="font-body text-[10px] text-white/30">View Profile and More Listings</p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0">
                      {(listing.approved_channel_name || listing.seller_name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body font-bold text-sm text-white">{listing.approved_channel_name || listing.seller_name}</p>
                      <p className="font-body text-[10px] text-white/30">Seller on 1MarketPH.com</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      <MascotDog page="listing" />
      <ScrollToTop />
      {/* 1MarketPH Socials Footer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.2),rgba(0,26,128,0.3))', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2214%22 fill=%22%230033CC%22/%3E%3Ctext x=%2232%22 y=%2241%22 font-family=%22Arial%22 font-size=%2224%22 font-weight=%22700%22 text-anchor=%22middle%22 fill=%22white%22%3E1M%3C/text%3E%3C/svg%3E"
              alt="1Market PH" className="w-10 h-10 rounded-xl object-cover" />
            <div className="text-left">
              <p className="font-heading font-bold text-white text-sm">1Market<span style={{ color: '#FFD700' }}>PH</span>.com</p>
              <p className="font-body text-[10px] text-white/40">Philippines' Premier Marketplace</p>
            </div>
          </div>
          <p className="font-body text-xs text-white/50 mb-4">Follow us and stay connected with the latest deals and listings!</p>
          <div className="flex items-center justify-center flex-wrap gap-3">
            <a href="https://facebook.com/1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 font-body text-xs font-bold hover:bg-blue-600/35 transition-colors border border-blue-600/25">
              <Facebook className="w-3.5 h-3.5" /> Facebook
            </a>
            <a href="https://instagram.com/1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 font-body text-xs font-bold hover:bg-pink-500/35 transition-colors border border-pink-500/25">
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <a href="https://tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white font-body text-xs font-bold hover:bg-white/20 transition-colors border border-white/15">
              <TikTokIcon className="w-3.5 h-3.5 text-white" /> TikTok
            </a>
            <a href="https://youtube.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 text-red-400 font-body text-xs font-bold hover:bg-red-600/35 transition-colors border border-red-600/25">
              <Youtube className="w-3.5 h-3.5" /> YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}