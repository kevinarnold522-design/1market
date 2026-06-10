import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Share2, Flag, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  shoes: 'bg-orange-500/20 text-orange-300',
  cars: 'bg-blue-500/20 text-blue-300',
  houses: 'bg-green-500/20 text-green-300',
  electronics: 'bg-purple-500/20 text-purple-300',
  services: 'bg-yellow-500/20 text-yellow-300',
  clothing: 'bg-pink-500/20 text-pink-300',
  furniture: 'bg-amber-500/20 text-amber-300',
  food: 'bg-red-500/20 text-red-300',
  jobs: 'bg-cyan-500/20 text-cyan-300',
  other: 'bg-gray-500/20 text-gray-300',
  product: 'bg-indigo-500/20 text-indigo-300',
};

const CATEGORY_ICONS = {
  shoes: '👟', cars: '🚗', houses: '🏠', electronics: '📱',
  services: '🔧', clothing: '👕', furniture: '🛋️', food: '🍽️',
  jobs: '💼', other: '📦', product: '🛒', hotel: '🏨',
  flights: '✈️', vehicle_rental: '🚙', space_rent: '🏢', mods: '⚙️',
};

function MiniHeartBtn({ listingId, user }) {
  const [hearted, setHearted] = useState(false);
  const [count, setCount] = useState(0);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    base44.entities.ListingHeart.filter({ listing_id: listingId }).then(r => setCount(r.length));
    if (user) base44.entities.ListingHeart.filter({ listing_id: listingId, user_email: user.email }).then(r => setHearted(r.length > 0));
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
    <button onClick={toggle} className="relative flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/15 transition-all">
      <AnimatePresence>
        {anim && <motion.span initial={{ scale: 1, opacity: 1, y: 0 }} animate={{ scale: 2, opacity: 0, y: -14 }}
          transition={{ duration: 0.6 }} className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">❤️</motion.span>}
      </AnimatePresence>
      <Heart className={`w-3 h-3 ${hearted ? 'text-red-400 fill-red-400' : 'text-white/40'}`} />
      <span className="font-body text-[9px] text-white/40">{count > 0 ? count : ''}</span>
    </button>
  );
}

function ListingCard({ item, user }) {
  const price = item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : null);
  const colorClass = CATEGORY_COLORS[item.type] || 'bg-gray-500/20 text-gray-300';
  const icon = CATEGORY_ICONS[item.type] || '📦';

  const handleShare = (e) => {
    e.preventDefault(); e.stopPropagation();
    const url = `${window.location.origin}/listing/${item.id}`;
    if (navigator.share) navigator.share({ title: item.title, url });
    else navigator.clipboard.writeText(url);
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
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}
      className="flex-shrink-0 w-52 rounded-2xl overflow-hidden transition-all duration-300 group relative"
      style={{ 
        background: 'rgba(13,31,60,0.9)', 
        border: '1px solid rgba(37,99,235,0.3)',
        boxShadow: '0 0 20px rgba(37,99,235,0.2), inset 0 0 20px rgba(37,99,235,0.05)'
      }}
    >
      {/* Circulating glow bar */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div className="absolute inset-0 rounded-2xl" style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(37,99,235,0.4) 60deg, rgba(59,130,246,0.6) 120deg, rgba(37,99,235,0.4) 180deg, transparent 240deg, rgba(37,99,235,0.3) 300deg, transparent 360deg)',
          animation: 'spin 3s linear infinite',
          filter: 'blur(8px)',
          opacity: 0.6
        }} />
      </div>
      {/* Inner border glow */}
      <div className="absolute inset-[1px] rounded-2xl pointer-events-none" style={{
        background: 'rgba(13,31,60,0.95)',
        boxShadow: 'inset 0 0 30px rgba(37,99,235,0.15)'
      }} />
      <Link to={`/listing/${item.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=70'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=70'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/70 to-transparent pointer-events-none" />
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${colorClass}`}>
            {icon} {item.type}
          </span>
        </div>
        <div className="p-3 pb-1">
          <p className="font-heading font-bold text-sm text-white leading-tight line-clamp-2 mb-1">{item.title}</p>
          <p className="font-body text-[10px] text-white/40 mb-1">{item.area || item.location}</p>
          {price && <p className="font-heading font-bold text-base text-[#00D4FF]">{price}</p>}
        </div>
      </Link>
      {/* Action bar */}
      <div className="px-3 pb-2.5 flex items-center gap-1">
        <MiniHeartBtn listingId={item.id} user={user} />
        <button onClick={handleShare} className="flex items-center px-1.5 py-1 rounded-lg bg-white/5 hover:bg-[#2563EB]/15 transition-all">
          <Share2 className="w-3 h-3 text-white/40" />
        </button>
        <button onClick={handleBookmark} className="flex items-center px-1.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/15 transition-all">
          <Bookmark className="w-3 h-3 text-white/40 hover:text-pink-400" />
        </button>
        <Link to={`/listing/${item.id}`} onClick={(e) => e.stopPropagation()}
          className="ml-auto flex items-center px-1.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/15 transition-all">
          <Flag className="w-3 h-3 text-red-400/50" />
        </Link>
      </div>
    </motion.div>
  );
}

// Add CSS animation for circulating glow
const style = document.createElement('style');
if (!document.getElementById('glow-animation-style')) {
  style.id = 'glow-animation-style';
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => setUser(u)).catch(() => {});
    }).catch(() => {});
    base44.entities.Listing.filter({ is_active: true }, '-created_date', 20)
      .then(items => {
        setListings(items.filter(l => l.is_active !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  };

  if (loading) return null;
  if (!listings.length) return null;

  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Live Marketplace</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Featured Listings</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link to="/buysell"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body font-bold text-xs hover:bg-[#00D4FF]/20 transition-colors">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {listings.map(item => (
          <ListingCard key={item.id} item={item} user={user} />
        ))}
      </div>

      <div className="mt-4 sm:hidden text-center">
        <Link to="/buysell" className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body font-bold text-xs">
          View All Listings <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}