import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Star, Facebook, Instagram } from 'lucide-react';

const MESSAGES = [
  { title: '1MarketPH.com', sub: 'Your #1 Filipino Marketplace — Trusted by thousands' },
  { title: 'Buy. Sell. Connect.', sub: 'Bringing local communities together across the Philippines' },
  { title: 'Discover Local Food', sub: 'From carinderias to cloud kitchens near you' },
  { title: 'Plan Your Next Trip', sub: 'Hotels, flights & adventures at unbeatable prices' },
  { title: 'Find Your New Home', sub: 'Rentals, condos & real estate across Manila & Cavite' },
  { title: 'Best Tech Deals', sub: 'Phones, laptops & gadgets at the lowest prices' },
  { title: 'Post for FREE Today', sub: 'List your products & services — zero fees, zero hassle' },
];

const TICKER_ITEMS = [
  'iPhone 16 Pro — ₱89,999', 'Manila Hotel — ₱8,500/night', 'Homemade Halo-Halo', 'Manila to Cebu from ₱1,499',
  'Bacoor Townhouse — ₱2.85M', 'Tagaytay Barako Coffee', 'Toyota Vios 2019 — ₱620K', 'Sony WH-1000XM5 — ₱15,999',
  'Boracay Package — ₱7,999', 'Aling Nena Carinderia', 'ASUS VivoBook — ₱34,999', 'Post Your Listing FREE Today',
  'Cavite Condo — ₱18,000/mo', 'Samsung Galaxy S25 — ₱49,999', 'Palawan Tour Package — ₱9,999', 'Part-time Jobs Near You',
];

export default function MovingWelcomeBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const msg = MESSAGES[idx];

  return (
    <div className="w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 60%, #001a80 100%)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
      {/* Main animated hero message */}
      <div className="relative h-32 flex items-center justify-center overflow-hidden">
        {/* Animated background rings */}
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.06, 0.02, 0.06] }}
            transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
            className="absolute rounded-full border border-[#00D4FF]"
            style={{ width: `${i * 120}px`, height: `${i * 120}px` }}
          />
        ))}

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 z-10 text-center px-4"
          >
            <p className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight">{msg.title}</p>
            <p className="font-body text-xs text-[#00D4FF]/90">{msg.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-3 flex gap-1.5">
          {MESSAGES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-4 bg-[#00D4FF]' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* Stats strip — real/truthful only */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 py-2 border-t border-white/8" style={{ background: 'rgba(0,0,0,0.15)' }}>
        {[
          { icon: Users, label: 'Growing Community', color: '#00D4FF' },
          { icon: ShoppingBag, label: 'New Listings Daily', color: '#FFD700' },
          { icon: TrendingUp, label: 'Free to List', color: '#f472b6' },
          { icon: Star, label: 'Filipino-Made', color: '#10b981' },
        ].map(({ icon: Icon, label, color }, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Icon className="w-3 h-3 flex-shrink-0" style={{ color }} />
            <span className="font-body text-[10px] font-semibold text-white/60 hidden sm:inline">{label}</span>
            <span className="font-body text-[10px] font-semibold text-white/60 sm:hidden">{label.split(' ').slice(-1)[0]}</span>
          </div>
        ))}
      </div>

      {/* Social Media Bar */}
      <div className="flex items-center justify-center gap-3 py-3 border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <span className="font-body text-[10px] text-white/50 font-semibold">Follow us:</span>
        <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-bold text-blue-300 hover:text-blue-100 transition-all hover:scale-105"
          style={{ background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(59,130,246,0.35)' }}>
          <Facebook className="w-3.5 h-3.5" /><span className="hidden sm:inline">@1MarketPH</span>
        </a>
        <a href="https://www.instagram.com/1marketph/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-bold text-pink-300 hover:text-pink-100 transition-all hover:scale-105"
          style={{ background: 'rgba(236,72,153,0.18)', border: '1px solid rgba(236,72,153,0.35)' }}>
          <Instagram className="w-3.5 h-3.5" /><span className="hidden sm:inline">@1MarketPH</span>
        </a>
      </div>

      {/* Marquee ticker */}
      <div className="relative overflow-hidden border-t border-white/10 py-2" style={{ background: 'linear-gradient(90deg,#0033CC,#1a3de8,#0033CC)' }}>
        <motion.div
          animate={{ x: [0, -3200] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-body text-xs text-white/60 flex items-center gap-2">
              <span className="text-[#00D4FF] select-none">›</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}