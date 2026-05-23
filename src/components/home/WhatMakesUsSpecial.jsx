import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const POINTS = [
  { icon: '🔍', text: 'We compare the best deals across Agoda, Airbnb, Shopee, Lazada, Klook, GrabFood & more' },
  { icon: '📍', text: 'Recommendations tailored to your location — Manila, Cebu, Davao, Boracay & nationwide' },
  { icon: '⭐', text: 'Omni-platform ratings aggregated from Google, TripAdvisor, Foodpanda & all major apps' },
  { icon: '🇵🇭', text: 'Proudly Filipino — built for Filipinos, by a Filipino' },
];

export default function WhatMakesUsSpecial() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="w-full relative overflow-hidden"
      style={{ background: 'rgba(10,25,47,0.7)', borderBottom: '1px solid rgba(0,212,255,0.12)', backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.04),transparent)' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap flex-1 justify-center">
          <span className="font-heading font-bold text-[10px] sm:text-xs text-[#00D4FF] uppercase tracking-widest whitespace-nowrap">✨ What Makes Us Special:</span>
          <div className="hidden md:flex items-center gap-4 flex-wrap">
            {POINTS.map((p, i) => (
              <motion.span key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}
                className="font-body text-[10px] text-white/60 flex items-center gap-1">
                <span>{p.icon}</span> {p.text}
              </motion.span>
            ))}
          </div>
          <div className="md:hidden flex items-center gap-2 overflow-hidden">
            <motion.span
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
              className="font-body text-[10px] text-white/60 whitespace-nowrap"
            >
              {POINTS[0].icon} {POINTS[0].text}
            </motion.span>
          </div>
        </div>
        <button onClick={() => setDismissed(true)}
          className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X className="w-3 h-3 text-white/50" />
        </button>
      </div>
    </motion.div>
  );
}