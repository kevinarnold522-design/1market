import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Heart, MessageSquare, Share2, Flag, X, Bookmark, Star, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '../components/StarField';
import Navbar from '../components/home/Navbar';
import ReportModal from '../components/ReportModal';
import { base44 } from '@/api/base44Client';

const TYPES = [
  { key: 'all', label: 'All', icon: '🛒' },
  { key: 'shoes', label: 'Shoes', icon: '👟' },
  { key: 'cars', label: 'Cars', icon: '🚗' },
  { key: 'houses', label: 'Houses', icon: '🏠' },
  { key: 'electronics', label: 'Electronics', icon: '📱' },
  { key: 'services', label: 'Services', icon: '🔧' },
  { key: 'hotel', label: 'Hotels', icon: '🏨' },
  { key: 'food', label: 'Food', icon: '🍜' },
  { key: 'jobs', label: 'Jobs', icon: '💼' },
  { key: 'mods', label: 'Mods', icon: '🎮' },
];

function HeartButton({ listingId, user }) {
  const [hearted, setHearted] = useState(false);
  const [count, setCount] = useState(0);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    base44.entities.ListingHeart.filter({ listing_id: listingId }).then(r => setCount(r.length));
    if (user) {
      base44.entities.ListingHeart.filter({ listing_id: listingId, user_email: user.email }).then(r => setHearted(r.length > 0));
    }
  }, [listingId, user]);

  const toggle = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    if (hearted) {
      const ex = await base44.entities.ListingHeart.filter({ listing_id: listingId, user_email: user.email });
      if (ex[0]) await base44.entities.ListingHeart.delete(ex[0].id);
      setHearted(false); setCount(c => c - 1);
    } else {
      await base44.entities.ListingHeart.create({ listing_id: listingId, user_email: user.email });
      setHearted(true); setCount(c => c + 1);
      setAnim(true); setTimeout(() => setAnim(false), 700);
    }
  };

  return (
    <button onClick={toggle} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/15 transition-all relative">
      <AnimatePresence>
        {anim && <motion.span initial={{ scale: 1, opacity: 1, y: 0 }} animate={{ scale: 1.8, opacity: 0, y: -18 }}
          transition={{ duration: 0.6 }} className="absolute -top-2 left-1/2 -translate-x-1/2 text-base pointer-events-none">❤️</motion.span>}
      </AnimatePresence>
      <Heart className={`w-3.5 h-3.5 ${hearted ? 'text-red-400 fill-red-400' : 'text-white/40'}`} />
      <span className="font-body text-[10px] text-white/50">{count}</span>
    </button>
  );
}

function ListingCard({ item, user, onReport }) {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    base44.entities.ListingComment.filter({ listing_id: item.id }).then(r => setCommentCount(r.length));
  }, [item.id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    if (!newComment.trim()) return;
    await base44.entities.ListingComment.create({
      listing_id: item.id, listing_type: 'db',
      user_email: user.email, user_name: user.full_name || 'Member',
      comment: newComment.trim()
    });
    setCommentCount(c => c + 1);
    setNewComment('');
    setShowCommentBox(false);
  };

  const handleShare = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/listing/${item.id}`;
    if (navigator.share) navigator.share({ title: item.title, url });
    else { navigator.clipboard.writeText(url); }
  };

  const handleBookmark = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    const existing = await base44.entities.Favourite.filter({ user_email: user.email, listing_id: item.id });
    if (existing.length === 0) {
      await base44.entities.Favourite.create({
        user_email: user.email, listing_id: item.id,
        title: item.title, image_url: item.image_url,
        price_label: item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : ''),
        category: item.type, area: item.area || item.location
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
      style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)', boxShadow: '0 0 0 rgba(0,212,255,0)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 rgba(0,212,255,0)'}>
      <Link to={`/listing/${item.id}`}>
        <div className="aspect-[4/3] overflow-hidden relative">
          <img src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500'}
            alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/60 to-transparent pointer-events-none" />
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/80 text-white text-[9px] font-bold capitalize">{item.type}</span>
          </div>
          {item.location && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/70">
              <MapPin className="w-2.5 h-2.5" />
              <span className="font-body text-[9px]">{item.area || item.location}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/listing/${item.id}`}>
          <h3 className="font-heading font-bold text-sm text-white leading-tight mb-0.5 truncate hover:text-[#00D4FF] transition-colors">{item.title}</h3>
          <p className="font-body text-xs text-[#00D4FF] mb-2">{item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : '—')}</p>
        </Link>
        {/* Action Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <HeartButton listingId={item.id} user={user} />
          <button onClick={(e) => { e.preventDefault(); if (!user) { base44.auth.redirectToLogin(window.location.href); return; } setShowCommentBox(s => !s); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-[#00D4FF]/15 transition-all">
            <MessageSquare className="w-3.5 h-3.5 text-white/40" />
            <span className="font-body text-[10px] text-white/50">{commentCount}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-[#2563EB]/15 transition-all">
            <Share2 className="w-3.5 h-3.5 text-white/40" />
          </button>
          <button onClick={handleBookmark} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-pink-500/15 transition-all">
            <Bookmark className="w-3.5 h-3.5 text-white/40 hover:text-pink-400" />
          </button>
          {user && (
            <button onClick={(e) => { e.preventDefault(); onReport(item); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/15 transition-all ml-auto">
              <Flag className="w-3.5 h-3.5 text-red-400/60" />
            </button>
          )}
        </div>
        {showCommentBox && (
          <form onSubmit={handleComment} className="mt-2 flex gap-1.5">
            <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/40 min-w-0" />
            <button type="submit" className="px-2 py-1 rounded-lg bg-[#00D4FF] text-[#0A192F] font-body font-bold text-[10px] hover:bg-white transition-colors flex-shrink-0">Post</button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default function ExplorePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [reportItem, setReportItem] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) { const me = await base44.auth.me(); setUser(me); }
      } catch {}
      const items = await base44.entities.Listing.list('-created_date', 200);
      setListings(items.filter(l => l.is_active !== false));
      setLoading(false);
    };
    init();
  }, []);

  const filtered = listings.filter(l => {
    const matchType = activeType === 'all' || l.type === activeType;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || (l.area || '').toLowerCase().includes(search.toLowerCase());
    const matchPrice = !maxPrice || !l.price || Number(l.price) <= Number(maxPrice);
    const matchRating = minRating === 0 || (l.rating || 0) >= minRating;
    return matchType && matchSearch && matchPrice && matchRating;
  });

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-10 px-4 sm:px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-heading font-bold text-3xl sm:text-5xl text-white mb-3">
          Explore All <span className="text-[#00D4FF]">Listings</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="font-body text-white/50 text-sm max-w-md mx-auto mb-6">
          Browse everything on 1Marketph.com — homes, cars, electronics, services and more.
        </motion.p>
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings, areas..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-body text-sm placeholder-white/30 focus:outline-none focus:border-[#00D4FF]/50" />
        </div>
        {/* Not signed in CTA */}
        {!user && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 24px rgba(0,212,255,0.45), 0 0 50px rgba(0,212,255,0.2)' }}>
            ✨ Get Started — Sign In or Sign Up
          </motion.button>
        )}
      </div>

      {/* Type filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
          {TYPES.map(t => (
            <button key={t.key} onClick={() => setActiveType(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all ${activeType === t.key ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/8 text-white/60 hover:bg-white/15 border border-white/10'}`}>
              {t.label}
            </button>
          ))}
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all ml-1 ${showFilters ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-white/8 text-white/60 hover:bg-white/15 border border-white/10'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {/* Advanced filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-2xl flex flex-wrap gap-4 items-end"
              style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Max Price (₱)</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 5000"
                  className="w-36 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Min Rating</label>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-body text-xs font-bold transition-all ${minRating === r ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                      {r === 0 ? 'All' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setMaxPrice(''); setMinRating(0); }}
                className="px-3 py-2 rounded-xl bg-white/5 text-white/40 font-body text-xs hover:text-white hover:bg-white/10 transition-all border border-white/10">
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-white/30">No listings found.</p>
          </div>
        ) : (
          <>
            <p className="font-body text-xs text-white/30 mb-4">{filtered.length} listings found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(item => (
                <ListingCard key={item.id} item={item} user={user} onReport={setReportItem} />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {reportItem && user && <ReportModal listing={reportItem} user={user} onClose={() => setReportItem(null)} />}
      </AnimatePresence>
    </div>
  );
}