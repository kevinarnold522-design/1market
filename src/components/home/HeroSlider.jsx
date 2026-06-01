import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    headline: 'Building Dreams',
    subline: 'Under 1Vision, Together.',
    tagline: 'Welcome to 1MarketPH',
    desc: 'Founded in 2026 by Kevin Roberto — bridging Filipino consumers and the businesses that power our communities.',
    bg: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=85',
    accent: '#00D4FF',
  },
  {
    id: 2,
    headline: 'Buy & Sell',
    subline: 'The Smart Filipino Way',
    tagline: 'Shoes · Cars · Electronics · More',
    desc: 'Find the best deals from real sellers across Manila and Cavite. Safe, simple, and homegrown.',
    bg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=85',
    accent: '#2563EB',
  },
  {
    id: 3,
    headline: 'Discover',
    subline: 'Local Food & Travel',
    tagline: 'Hotels · Flights · Restaurants',
    desc: 'From Tagaytay views to Manila eats — explore the Philippines without leaving our platform.',
    bg: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=85',
    accent: '#f59e0b',
  },
  {
    id: 4,
    headline: 'Proudly Filipino',
    subline: 'Built for Filipinos',
    tagline: 'When We Connect, We Grow',
    desc: 'A seamless, homegrown space where connections happen naturally. Join thousands of members today.',
    bg: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1400&q=85',
    accent: '#a855f7',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  const prev = () => { setAuto(false); setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length); };
  const next = () => { setAuto(false); setCurrent(c => (c + 1) % SLIDES.length); };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '92vh' }}>
      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img src={slide.bg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(7,15,26,0.85) 0%, rgba(10,25,47,0.7) 60%, rgba(7,15,26,0.4) 100%)` }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center min-h-[92vh] py-28">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: `${slide.accent}20`, border: `1px solid ${slide.accent}40` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.accent }} />
              <span className="font-body text-xs font-bold uppercase tracking-widest" style={{ color: slide.accent }}>{slide.tagline}</span>
            </div>

            <h1 className="font-heading font-bold leading-tight mb-2">
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-white">{slide.headline}</span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl mt-1" style={{ color: slide.accent }}>{slide.subline}</span>
            </h1>

            <p className="font-body text-base sm:text-lg text-white/60 mt-4 max-w-lg leading-relaxed">{slide.desc}</p>

            <div className="flex gap-3 mt-8">
              <a href="#categories" className="px-6 py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${slide.accent}, #2563EB)` }}>
                Explore Now →
              </a>
              <a href="/buysell" className="px-6 py-3 rounded-xl font-body font-bold text-sm text-white border border-white/20 hover:border-white/50 transition-all">
                Browse Listings
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { setAuto(false); setCurrent(i); }}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? slide.accent : 'rgba(255,255,255,0.3)' }} />
        ))}
      </div>
    </div>
  );
}