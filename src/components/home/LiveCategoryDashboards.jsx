import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { key: 'food',     label: 'Food & Dining',   color: '#f97316', emoji: '🍽️',  route: '/food',     filter: { main_category: 'food' } },
  { key: 'buysell',  label: 'Buy & Sell',       color: '#8b5cf6', emoji: '🛍️',  route: '/buysell',  filter: { main_category: 'buysell' } },
  { key: 'jobs',     label: 'Jobs',             color: '#f59e0b', emoji: '💼',  route: '/jobs',     filter: { type: 'jobs' } },
  { key: 'rent',     label: 'Rent / For Sale',  color: '#10b981', emoji: '🏠',  route: '/rent',     filter: { main_category: 'rent' } },
  { key: 'services', label: 'Services',         color: '#3b82f6', emoji: '🔧',  route: '/services', filter: { type: 'services' } },
  { key: 'travel',   label: 'Travel & Hotel',   color: '#0ea5e9', emoji: '✈️',  route: '/travel',   filter: { main_category: 'travel' } },
];

function MiniCard({ item, color }) {
  const price = item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : null);
  return (
    <Link to={`/listing/${item.id}`}
      className="flex-shrink-0 w-40 rounded-xl overflow-hidden transition-all hover:scale-[1.03] group"
      style={{ background: 'rgba(13,31,60,0.9)', border: `1.5px solid ${color}40` }}>
      <div className="relative h-24 overflow-hidden">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=60'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=60'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/80 to-transparent" />
        {price && (
          <span className="absolute bottom-1.5 left-2 font-heading font-bold text-[11px]" style={{ color }}>
            {price}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="font-body font-semibold text-[11px] text-white leading-tight line-clamp-2">{item.title}</p>
        <p className="font-body text-[9px] text-white/35 mt-0.5 truncate">{item.area || item.location}</p>
      </div>
    </Link>
  );
}

function CategoryPanel({ cat, listings, active }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' });

  return (
    <motion.div
      key={cat.key}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(5,15,40,0.85)', border: `1.5px solid ${cat.color}35` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: `linear-gradient(90deg, ${cat.color}18, transparent)` }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.emoji}</span>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">{cat.label}</h3>
            <p className="font-body text-[9px]" style={{ color: cat.color }}>{listings.length} live listings</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-white/50" />
          </button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          </button>
          <Link to={cat.route}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[10px] font-bold text-white/70 hover:text-white transition-colors"
            style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
            See All <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
      {/* Scrollable listings */}
      <div ref={scrollRef} className="flex gap-3 px-4 py-3 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {listings.length === 0 ? (
          <div className="w-full py-6 text-center">
            <p className="font-body text-xs text-white/25">No live listings yet — be the first to post!</p>
            <Link to={cat.route} className="inline-block mt-2 font-body text-[10px] font-bold px-3 py-1.5 rounded-xl"
              style={{ color: cat.color, background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
              Browse {cat.label}
            </Link>
          </div>
        ) : listings.map(item => (
          <MiniCard key={item.id} item={item} color={cat.color} />
        ))}
      </div>
    </motion.div>
  );
}

export default function LiveCategoryDashboards() {
  const [allListings, setAllListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [view, setView] = useState('grid'); // 'grid' or 'tabs'

  useEffect(() => {
    const load = async () => {
      const items = await base44.entities.Listing.filter({ approval_status: 'approved', is_active: true }, '-created_date', 120);
      const grouped = {};
      CATEGORIES.forEach(cat => { grouped[cat.key] = []; });
      items.forEach(item => {
        const catKey = item.main_category || (item.type === 'jobs' ? 'jobs' : item.type === 'services' ? 'services' : null);
        if (catKey && grouped[catKey] !== undefined) grouped[catKey].push(item);
      });
      setAllListings(grouped);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  // Auto-rotate tabs view — must be before any early return
  useEffect(() => {
    if (view !== 'tabs') return;
    const t = setInterval(() => setActiveIdx(i => (i + 1) % CATEGORIES.length), 5000);
    return () => clearInterval(t);
  }, [view]);

  if (loading) return null;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Real-Time Listings</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Live Marketplace Activity</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('grid')}
            className="px-3 py-1.5 rounded-xl font-body text-xs font-bold transition-all"
            style={{ background: view === 'grid' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${view === 'grid' ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: view === 'grid' ? '#00D4FF' : 'rgba(255,255,255,0.5)' }}>
            Grid
          </button>
          <button onClick={() => setView('tabs')}
            className="px-3 py-1.5 rounded-xl font-body text-xs font-bold transition-all"
            style={{ background: view === 'tabs' ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${view === 'tabs' ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: view === 'tabs' ? '#00D4FF' : 'rgba(255,255,255,0.5)' }}>
            Tabs
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryPanel key={cat.key} cat={cat} listings={allListings[cat.key] || []} active />
          ))}
        </div>
      ) : (
        <div>
          {/* Tab selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, i) => (
              <button key={cat.key} onClick={() => setActiveIdx(i)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-bold flex-shrink-0 transition-all"
                style={{
                  background: activeIdx === i ? `${cat.color}20` : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${activeIdx === i ? cat.color + '60' : 'rgba(255,255,255,0.1)'}`,
                  color: activeIdx === i ? cat.color : 'rgba(255,255,255,0.45)',
                }}>
                <span>{cat.emoji}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <CategoryPanel
              key={CATEGORIES[activeIdx].key}
              cat={CATEGORIES[activeIdx]}
              listings={allListings[CATEGORIES[activeIdx].key] || []}
              active
            />
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}