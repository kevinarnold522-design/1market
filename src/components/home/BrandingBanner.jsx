import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  { main: '1 Community', sub: 'One platform. Every Filipino business. Every Filipino buyer.' },
  { main: '1 Mindset', sub: 'We build together — sellers, buyers, and dreamers as one.' },
  { main: '1 Goal', sub: 'Connect local businesses to the people who need them most.' },
  { main: '1Marketph.com', sub: 'Manila & Cavite\'s marketplace — growing nationwide.' },
];

export default function BrandingBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const msg = MESSAGES[index];

  return (
    <div className="relative overflow-hidden py-5 sm:py-7" style={{ background: 'linear-gradient(135deg, #0033CC 0%, #001a80 100%)' }}>
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"
            style={{ top: `${15 + i * 18}%`, left: 0, right: 0 }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#00D4FF]/15 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#2563EB]/15 blur-2xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mb-3 relative z-10">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${i === index ? 'w-5 h-1.5 bg-[#00D4FF]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      {/* Animated text */}
      <div className="relative z-10 text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p className="font-heading font-bold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              {msg.main.split(' ').map((word, wi) => (
                <span key={wi}>
                  {word === '1' || word === '1Marketph.com' ? (
                    <span className="text-[#00D4FF]">{word}</span>
                  ) : (
                    word
                  )}
                  {wi < msg.main.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
            <p className="font-body text-xs sm:text-sm text-white/60 mt-1.5 max-w-lg mx-auto">{msg.sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)' }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}