import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Heart, Share2, Plus, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ParticleBackground from '../components/ParticleBackground';
import PostListingMenu from '../components/PostListingMenu';

const TRAVEL_CATEGORIES = [
  { key: 'all',         label: 'All',           icon: '🌏', color: '#0ea5e9' },
  { key: 'hotel',       label: 'Hotels',        icon: '🏨', color: '#6366f1' },
  { key: 'resort',      label: 'Resorts',       icon: '🌴', color: '#10b981' },
  { key: 'flights',     label: 'Flights',       icon: '✈️', color: '#3b82f6' },
  { key: 'ferry',       label: 'Ferry & Bus',   icon: '⛴️', color: '#0891b2' },
  { key: 'car_rental',  label: 'Car Rentals',   icon: '🚗', color: '#f59e0b' },
  { key: 'van_rental',  label: 'Van Rentals',   icon: '🚐', color: '#f97316' },
  { key: 'tours',       label: 'Tours',         icon: '🗺️', color: '#8b5cf6' },
  { key: 'island',      label: 'Island Hopping',icon: '🏝️', color: '#06b6d4' },
  { key: 'camping',     label: 'Camping',       icon: '⛺', color: '#84cc16' },
  { key: 'hiking',      label: 'Hiking',        icon: '🥾', color: '#78716c' },
  { key: 'diving',      label: 'Diving',        icon: '🤿', color: '#0284c7' },
  { key: 'surfing',     label: 'Surfing',       icon: '🏄', color: '#0d9488' },
];

const STATIC_LISTINGS = [
  { id: 's1', type: 'hotel', title: 'The Pen Manila — Deluxe Room', location: 'Makati', area: 'Manila', price: 8500, price_label: '₱8,500/night', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', rating: 4.9, subcategory: 'Luxury Hotel', description: 'Premier luxury hotel in the heart of Makati CBD. World-class amenities.' },
  { id: 's2', type: 'resort', title: 'Crimson Resort & Spa Boracay', location: 'Boracay', area: 'Aklan', price: 12000, price_label: '₱12,000/night', image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', rating: 4.8, subcategory: 'Beach Resort', description: 'Luxury beachfront resort on Boracay\'s white sand beach.' },
  { id: 's3', type: 'island', title: 'El Nido Island Hopping Tour A', location: 'El Nido', area: 'Palawan', price: 1200, price_label: '₱1,200/person', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', rating: 4.9, subcategory: 'Island Hopping', description: 'Visit the Big Lagoon, Small Lagoon, Secret Lagoon & Shimizu Island.' },
  { id: 's4', type: 'diving', title: 'Tubbataha Reef Dive Expedition', location: 'Sulu Sea', area: 'Palawan', price: 45000, price_label: '₱45,000/package', image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', rating: 5.0, subcategory: 'Scuba Diving', description: 'UNESCO World Heritage dive site. 5-day liveaboard expedition.' },
  { id: 's5', type: 'surfing', title: 'Siargao Surfing Lessons', location: 'Siargao', area: 'Surigao del Norte', price: 800, price_label: '₱800/session', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', rating: 4.7, subcategory: 'Surf Lesson', description: 'Professional surf instructors at Cloud 9. All levels welcome.' },
  { id: 's6', type: 'tours', title: 'Batanes Heritage & Culture Tour', location: 'Batanes', area: 'Batan Island', price: 3500, price_label: '₱3,500/person', image_url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80', rating: 4.8, subcategory: 'Cultural Tour', description: 'Explore the stone houses, rolling hills and lighthouse of Batanes.' },
  { id: 's7', type: 'car_rental', title: 'Toyota Innova — Cavite / Manila', location: 'Bacoor', area: 'Cavite', price: 2500, price_label: '₱2,500/day', image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', rating: 4.6, subcategory: 'Car Rental', description: 'Well-maintained Innova with driver. Airport transfers available.' },
  { id: 's8', type: 'hiking', title: 'Mt. Pulag Summit Trek', location: 'Kabayan', area: 'Benguet', price: 2800, price_label: '₱2,800/person', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', rating: 4.9, subcategory: 'Mountain Trek', description: 'Highest peak in Luzon. Sea of clouds experience. 2-day trek.' },
  { id: 's9', type: 'camping', title: 'Masungi Georeserve Camping', location: 'Rizal', area: 'Baras', price: 1800, price_label: '₱1,800/night', image_url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=600&q=80', rating: 4.8, subcategory: 'Glamping', description: 'Eco-camping in a protected forest. Guided trek included.' },
  { id: 's10', type: 'hotel', title: 'Seda BGC — Superior Room', location: 'BGC', area: 'Taguig', price: 5500, price_label: '₱5,500/night', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', rating: 4.7, subcategory: 'Business Hotel', description: 'Modern business hotel in the heart of BGC. Infinity pool.' },
  { id: 's11', type: 'ferry', title: 'Manila–Coron Fast Ferry', location: 'Manila', area: 'Batangas Port', price: 1800, price_label: '₱1,800/person', image_url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', rating: 4.5, subcategory: 'Ferry Package', description: 'Comfortable fast craft from Batangas to Coron, Palawan.' },
  { id: 's12', type: 'van_rental', title: '10-Seater Van — Tagaytay Day Tour', location: 'Tagaytay', area: 'Cavite', price: 3800, price_label: '₱3,800/day', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', rating: 4.6, subcategory: 'Van Rental', description: 'Air-conditioned van with driver. Perfect for family/group trips.' },
];

function TravelCard({ listing, onShare }) {
  const [hearted, setHearted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ background: 'linear-gradient(160deg,#0f172a,#1e293b)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
        <button
          onClick={e => { e.stopPropagation(); setHearted(h => !h); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${hearted ? 'fill-red-400 text-red-400' : 'text-white'}`} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onShare(listing); }}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />{listing.area || listing.location}
        </span>
      </div>
      <div className="p-4">
        <p className="font-body text-[10px] text-sky-400 font-semibold mb-1 uppercase tracking-wider">{listing.subcategory}</p>
        <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1 line-clamp-2">{listing.title}</h3>
        <p className="font-body text-xs text-white/40 mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-bold text-base text-amber-400">{listing.price_label}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-body text-xs text-white/60">{listing.rating?.toFixed(1) || '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShareModal({ listing, onClose }) {
  const url = `${window.location.origin}/listing/${listing.id}`;
  const text = encodeURIComponent(`Check out: ${listing.title}`);
  const encodedUrl = encodeURIComponent(url);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl p-5 shadow-2xl"
        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)' }}>
        <h3 className="font-heading font-bold text-white mb-4">Share this listing</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
            <span className="text-xl">📘</span>
            <span className="font-body text-[10px] text-white/70">Facebook</span>
          </a>
          <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-600/20 hover:bg-green-600/30 transition-colors">
            <span className="text-xl">💬</span>
            <span className="font-body text-[10px] text-white/70">WhatsApp</span>
          </a>
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${text}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 transition-colors">
            <span className="text-xl">✈️</span>
            <span className="font-body text-[10px] text-white/70">Telegram</span>
          </a>
        </div>
        <button onClick={copy}
          className="w-full py-2 rounded-xl font-body text-sm text-white transition-all"
          style={{ background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Travel() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [dbListings, setDbListings] = useState([]);
  const [shareTarget, setShareTarget] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => setCurrentUser(u)).catch(() => {});
    }).catch(() => {});

    base44.entities.Listing.filter({ main_category: 'travel', is_active: true }, '-created_date', 100)
      .then(res => setDbListings(res))
      .catch(() => {});
  }, []);

  const SUBTYPE_MAP = {
    hotel:       ['hotel'],
    resort:      ['resort'],
    flights:     ['flights'],
    ferry:       ['ferry'],
    car_rental:  ['vehicle_rental', 'car_rental'],
    van_rental:  ['vehicle_rental', 'van_rental'],
    tours:       ['tours', 'other'],
    island:      ['island'],
    camping:     ['camping'],
    hiking:      ['hiking'],
    diving:      ['diving'],
    surfing:     ['surfing'],
  };

  const allListings = [
    ...STATIC_LISTINGS,
    ...dbListings.map(l => ({
      id: l.id,
      type: l.subcategory?.toLowerCase().replace(/\s+/g, '_') || l.type,
      title: l.title,
      location: l.location,
      area: l.area || l.location,
      price: l.price,
      price_label: l.price_label || `₱${Number(l.price || 0).toLocaleString()}`,
      image_url: l.image_url,
      rating: l.rating || 0,
      subcategory: l.subcategory || '',
      description: l.description || '',
    }))
  ];

  const filtered = allListings.filter(l => {
    const typeMatch = activeCategory === 'all' ||
      l.type === activeCategory ||
      (SUBTYPE_MAP[activeCategory] || []).some(t => l.type?.includes(t));

    const searchLower = search.toLowerCase();
    const searchMatch = !search ||
      l.title.toLowerCase().includes(searchLower) ||
      l.location.toLowerCase().includes(searchLower) ||
      (l.area || '').toLowerCase().includes(searchLower) ||
      (l.subcategory || '').toLowerCase().includes(searchLower);

    return typeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen" style={{ background: '#070F1A' }}>
      <ParticleBackground />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 50%,#0284c7 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-sky-200">Travel & Experiences</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">Explore the Philippines</h1>
              <PostListingMenu user={currentUser} compact={false} />
            </div>
            <p className="font-body text-sm text-white/60 max-w-xl">Hotels, resorts, tours, island hopping, diving, surfing and more — all in one place.</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, activities, hotels..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Category Bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {TRAVEL_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0"
              style={activeCategory === cat.key
                ? { background: cat.color, color: '#fff', borderColor: cat.color, boxShadow: `0 0 14px ${cat.color}66` }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="font-body text-sm text-white/40 mb-5">{filtered.length} listings found</p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(listing => (
              <TravelCard key={listing.id} listing={listing} onShare={setShareTarget} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🌏</p>
            <p className="font-body text-white/30">No listings found. Try a different category or search.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-14 rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg,#0c4a6e,#0284c7)', border: '1px solid rgba(14,165,233,0.3)' }}>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">List Your Travel Business</h2>
          <p className="font-body text-sm text-white/60 mb-5 max-w-md mx-auto">Hotels, tours, rentals, activities — reach thousands of Filipino travelers.</p>
          <div className="flex justify-center">
            <PostListingMenu user={currentUser} compact={false} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {shareTarget && <ShareModal listing={shareTarget} onClose={() => setShareTarget(null)} />}
      </AnimatePresence>
    </div>
  );
}