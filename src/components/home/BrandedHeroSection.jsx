import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clipboard, RotateCw } from 'lucide-react';

const MESSAGES = [
  { main: '1 Community', sub: 'One platform. Every Filipino business. Every Filipino buyer.' },
  { main: '1 Mindset', sub: 'We build together — sellers, buyers, and dreamers as one.' },
  { main: '1 Goal', sub: 'Connect local businesses to the people who need them most.' },
  { main: '1Marketph.com', sub: 'Manila & Cavite\'s marketplace — growing nationwide.' },
];

const ANIMATED_ITEMS = [
  { emoji: 'AI', label: 'Electronics', color: '#00D4FF' },
  { emoji: 'AI', label: 'Real Estate', color: '#FFD700' },
  { emoji: 'AI', label: 'Food', color: '#10b981' },
  { emoji: 'AI️', label: 'Travel', color: '#f472b6' },
  { emoji: 'AI', label: 'Fashion', color: '#a855f7' },
  { emoji: 'AI', label: 'Services', color: '#3E97F1' },
  { emoji: 'AI', label: 'Jobs', color: '#fb7185' },
  { emoji: 'AI', label: 'Vehicles', color: '#f59e0b' },
];

export default function BrandedHeroSection() {
  const [index, setIndex] = useState(0);
  const pillars = [
    { icon: ShoppingCart, label: 'CUSTOMER', subtext: '1 GOAL', color: '#00D4FF' },
    { icon: Clipboard, label: 'LISTER', subtext: '1 MARKET', color: '#FFD700' },
    { icon: RotateCw, label: 'CYCLE', subtext: '1 MARKET', color: '#10b981' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const msg = MESSAGES[index];

  return (
    <div className="relative overflow-hidden py-12 sm:py-16" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 50%, #001a80 100%)' }}>
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
      <div className="relative z-10 text-center px-4 mb-12">
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

      {/* Animated items carousel */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ANIMATED_ITEMS.map((item, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl backdrop-blur-sm"
              style={{ background: `rgba(${item.color === '#00D4FF' ? '0,212,255' : item.color === '#FFD700' ? '255,215,0' : item.color === '#10b981' ? '16,185,129' : item.color === '#f472b6' ? '244,114,182' : item.color === '#a855f7' ? '168,85,247' : item.color === '#3E97F1' ? '62,151,241' : item.color === '#fb7185' ? '251,113,133' : '245,158,11'},0.1)`, border: `1px solid ${item.color}40` }}>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-2xl sm:text-3xl"
              >
                {item.emoji}
              </motion.span>
              <p className="font-body text-[9px] sm:text-xs font-semibold text-white/80 text-center">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Three pillars */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex items-center justify-center gap-3 p-4 rounded-2xl backdrop-blur-sm"
              style={{ background: `rgba(${pillar.color === '#00D4FF' ? '0,212,255' : pillar.color === '#FFD700' ? '255,215,0' : '16,185,129'},0.1)`, border: `1.5px solid ${pillar.color}33` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${pillar.color}20`, border: `2px solid ${pillar.color}` }}>
                <pillar.icon className="w-6 h-6" style={{ color: pillar.color }} />
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-white text-sm tracking-wider">{pillar.label}</p>
                <p className="font-body text-xs text-white/60">{pillar.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>
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