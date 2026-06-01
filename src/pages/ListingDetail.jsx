import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart, MessageSquare, Phone, Share2, MapPin, Flag } from 'lucide-react';
import ReportModal from '../components/ReportModal';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/home/Navbar';
import StarField from '../components/StarField';

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
          style={{ fontSize: 80 }}
        >
          💙
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

export default function ListingDetail() {
  const { id } = useParams();
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

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          setUser(me);
        }
      } catch {}

      try {
        const item = await base44.entities.Listing.filter({ id });
        const found = item[0] || null;
        setListing(found);

        if (found) {
          // Load comments
          const cmts = await base44.entities.ListingComment.filter({ listing_id: id });
          setComments(cmts);
          // Load hearts
          const hts = await base44.entities.ListingHeart.filter({ listing_id: id });
          setHearts(hts.length);
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

  const handleHeart = async () => {
    if (!user) return;
    if (userHearted) {
      const existing = await base44.entities.ListingHeart.filter({ listing_id: id, user_email: user.email });
      if (existing[0]) await base44.entities.ListingHeart.delete(existing[0].id);
      setHearts(h => h - 1);
      setUserHearted(false);
    } else {
      await base44.entities.ListingHeart.create({ listing_id: id, user_email: user.email });
      setHearts(h => h + 1);
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
    setNewComment('');
    setNewRating(0);
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-[#070F1A] flex flex-col items-center justify-center gap-4 pt-24">
      <StarField />
      <Navbar />
      <p className="font-body text-white/50 text-lg">Listing not found.</p>
      <Link to="/" className="px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-sm hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">← Go Home</Link>
    </div>
  );

  const images = [listing.image_url, ...(listing.extra_images || [])].filter(Boolean);
  const avgRating = comments.length > 0
    ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.filter(c => c.rating > 0).length || 0).toFixed(1)
    : listing.rating || 0;

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <Navbar />
      <BlueHeartAnimation show={showHeartAnim} />

      {showReport && <ReportModal listing={listing} user={user} onClose={() => setShowReport(false)} />}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 lg:py-28">
        <Link to={`/${listing.type === 'cars' || listing.type === 'shoes' || listing.type === 'electronics' ? 'buysell' : listing.type === 'hotel' ? 'travel' : 'buysell'}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Images */}
          <div className="lg:col-span-3 space-y-3">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative"
              style={{ boxShadow: '0 0 40px rgba(0,212,255,0.08)' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800'}
                  alt={listing.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
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
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-[#00D4FF] w-4' : 'bg-white/40'}`} />
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

            {/* Comments Section */}
            <div className="rounded-2xl p-5 mt-4" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <h3 className="font-heading font-bold text-white text-base mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00D4FF]" /> Reviews & Comments ({comments.length})
              </h3>

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

              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= s ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />)}
                </div>
                <span className="font-body text-xs text-white/40">{avgRating > 0 ? `${avgRating} (${comments.filter(c=>c.rating>0).length} ratings)` : 'No ratings yet'}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
                <span className="font-body text-sm text-white/60">{listing.area || listing.location}</span>
              </div>

              <div className="mb-4">
                <span className="font-heading font-bold text-2xl text-[#00D4FF]">
                  {listing.price_label || (listing.price ? `₱${Number(listing.price).toLocaleString()}` : '—')}
                </span>
                {listing.condition && listing.condition !== 'N/A' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-body text-[10px]">{listing.condition}</span>
                )}
              </div>

              {listing.description && (
                <div className="mb-4">
                  <p className="font-body text-xs text-white/50 mb-1">Description</p>
                  <p className="font-body text-sm text-white/75 leading-relaxed">{listing.description}</p>
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

              {/* Contact */}
              {listing.phone && (
                <div className="flex gap-2 mb-4">
                  <a href={`tel:${listing.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-body font-bold text-xs transition-all"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    <Phone className="w-3.5 h-3.5" /> Call Seller
                  </a>
                  <a href={`sms:${listing.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 border border-white/15 text-white rounded-xl font-body font-bold text-xs hover:bg-white/20 transition-colors">
                    💬 SMS
                  </a>
                </div>
              )}

              {/* Social media */}
              {(listing.social_facebook || listing.social_instagram || listing.social_tiktok || listing.social_twitter) && (
                <div className="border-t border-white/8 pt-4">
                  <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-2">Seller's Social Media</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.social_facebook && <a href={listing.social_facebook} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 font-body text-[11px] font-bold hover:bg-blue-600/30 transition-colors">Facebook</a>}
                    {listing.social_instagram && <a href={listing.social_instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-400 font-body text-[11px] font-bold hover:bg-pink-500/30 transition-colors">Instagram</a>}
                    {listing.social_tiktok && <a href={listing.social_tiktok} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-body text-[11px] font-bold hover:bg-white/20 transition-colors">TikTok</a>}
                    {listing.social_twitter && <a href={listing.social_twitter} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 font-body text-[11px] font-bold hover:bg-sky-500/30 transition-colors">X/Twitter</a>}
                    {listing.social_viber && <a href={`viber://chat?number=${listing.social_viber}`} className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 font-body text-[11px] font-bold hover:bg-purple-500/30 transition-colors">Viber</a>}
                  </div>
                </div>
              )}

              {/* Share + Report row */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => { if (navigator.share) { navigator.share({ title: listing.title, url: window.location.href }); } else { navigator.clipboard.writeText(window.location.href); }}}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 font-body text-xs hover:border-white/25 hover:text-white/70 transition-all">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                {user && (
                  <button onClick={() => setShowReport(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400/70 font-body text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-all">
                    <Flag className="w-3.5 h-3.5" /> Report
                  </button>
                )}
              </div>
            </div>

            {/* Seller Profile snippet */}
            {listing.seller_name && (
              <div className="rounded-2xl p-4" style={{ background: 'rgba(13,31,60,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-2">Posted by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-sm">
                    {(listing.seller_name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body font-bold text-sm text-white">{listing.seller_name}</p>
                    <p className="font-body text-[10px] text-white/30">Seller on 1Marketph.com</p>
                  </div>
                </div>
                {listing.created_by_id && (
                  <Link to={`/seller/${listing.created_by_id}`}
                    className="mt-3 block w-full text-center py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-body text-xs hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all">
                    View Seller Profile →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}