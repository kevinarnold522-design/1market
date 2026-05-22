import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  { emoji: '🛍️', title: '1Market.ph', sub: 'Your One-Stop Philippine Marketplace' },
  { emoji: '🤝', title: 'Buy. Sell. Connect.', sub: 'Bringing local communities together' },
  { emoji: '🍜', title: 'Discover Local Food', sub: 'From carinderias to fine dining near you' },
  { emoji: '✈️', title: 'Plan Your Next Trip', sub: 'Hotels, flights & adventures await' },
  { emoji: '🏠', title: 'Find Your New Home', sub: 'Rentals & real estate across Manila & Cavite' },
  { emoji: '📱', title: 'Best Tech Deals', sub: 'Phones, laptops & gadgets at lowest prices' },
];

const TICKER_ITEMS = [
  '📱 iPhone 16 Pro — ₱89,999', '🏨 Manila Hotel — ₱8,500/night', '🍔 Jollibee Chickenjoy', '✈️ Manila→Cebu from ₱1,499',
  '🏠 Bacoor Townhouse — ₱2.85M', '☕ Tagaytay Barako Coffee', '🚗 Toyota Vios 2019 — ₱620K', '🎧 Sony XM5 — ₱15,999',
  '🌴 Boracay Package — ₱7,999', '🥘 Aling Nena Carinderia', '💻 ASUS VivoBook — ₱34,999', '🛍️ Sign Up Free — Be Part of the Community',
];

export default function MovingWelcomeBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const msg = MESSAGES[idx];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-[#0A192F] via-[#112240] to-[#0A192F] border-b border-white/5">
      {/* Main animated hero message */}
      <div className="relative h-28 flex items-center justify-center overflow-hidden">
        {/* Animated background rings */}
        {[1,2,3].map(i => (
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
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6 }}
              className="text-4xl leading-none"
            >
              {msg.emoji}
            </motion.span>
            <p className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight">{msg.title}</p>
            <p className="font-body text-xs text-[#00D4FF]/80">{msg.sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-3 flex gap-1.5">
          {MESSAGES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-[#00D4FF] w-4' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="relative overflow-hidden bg-[#00D4FF]/10 border-t border-[#00D4FF]/10 py-2">
        <motion.div
          animate={{ x: [0, -2400] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-body text-xs text-white/60 flex items-center gap-2">
              {item}
              <span className="text-[#00D4FF]/30 select-none">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}