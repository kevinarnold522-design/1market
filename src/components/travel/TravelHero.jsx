import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1800&q=90',
    title: 'Discover Paradise',
    sub: 'Island Hopping · Beaches · Crystal Waters',
    color: '#00D4FF',
  },
  {
    bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=90',
    title: 'Luxury Stays',
    sub: 'Hotels · Resorts · Exclusive Retreats',
    color: '#f59e0b',
  },
  {
    bg: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1800&q=90',
    title: 'Fly Anywhere',
    sub: 'Flights · Tours · Adventures Await',
    color: '#10b981',
  },
  {
    bg: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1800&q=90',
    title: 'Wild Adventures',
    sub: 'Hiking · Camping · Diving · Surfing',
    color: '#f97316',
  },
];

const QUICK_CATS = [
  { label: 'Hotels', icon: '', tab: 'Hotels' },
  { label: 'Resorts', icon: '', tab: 'Resorts' },
  { label: 'Flights', icon: '', tab: 'Flights' },
  { label: 'Island Hopping', icon: '', tab: 'Island Hopping' },
  { label: 'Tours', icon: '', tab: 'Tours' },
  { label: 'Diving', icon: '', tab: 'Diving' },
  { label: 'Surfing', icon: '', tab: 'Surfing' },
  { label: 'Hiking', icon: '', tab: 'Hiking' },
];

export default function TravelHero({ onSearch, onCategorySelect }) {
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="relative w-full" style={{ height: '520px' }}>
      {/* Background slides */}
      <AnimatePresence mode="sync">
        <motion.div key={slide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{ backgroundImage: `url(${current.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 via-[#0A192F]/40 to-[#070F1A]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.div key={`text-${slide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: current.color }} />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-white/60">1Market Travel</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-2 drop-shadow-2xl">
            {current.title}
          </h1>
          <p className="font-body text-sm sm:text-base text-white/60 mb-6">{current.sub}</p>
        </motion.div>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="w-full max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSearch(query)}
              placeholder="Search destinations, hotels, tours..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl font-body text-sm text-white placeholder-white/35 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}
            />
          </div>
          <button onClick={() => onSearch(query)}
            className="px-5 py-3.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${current.color}, #2563EB)` }}>
            Search
          </button>
        </motion.div>

        {/* Slide dots */}
        <div className="flex gap-1.5 mt-5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all"
              style={{ width: i === slide ? 20 : 6, height: 6, background: i === slide ? current.color : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      </div>

      {/* Quick category pills at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK_CATS.map(cat => (
              <button key={cat.tab} onClick={() => onCategorySelect(cat.tab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white' }}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}