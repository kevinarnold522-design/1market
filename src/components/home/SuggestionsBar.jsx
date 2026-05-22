import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';

const SUGGESTIONS = [
  { emoji: '🍜', label: 'Looking for Food?', sub: 'Carinderias & restaurants', href: '/food', color: '#f97316' },
  { emoji: '🏨', label: 'Looking for a Hotel?', sub: 'Manila & Cavite stays', href: '/travel', color: '#3b82f6' },
  { emoji: '🔥', label: 'Looking for Deals?', sub: 'Best prices today', href: '/#deals', color: '#ef4444' },
  { emoji: '🏠', label: 'Looking for a Place to Rent?', sub: 'Homes & apartments', href: '/rent', color: '#22c55e' },
  { emoji: '✈️', label: 'Looking for Plane Tickets?', sub: 'Domestic flights PH', href: '/travel', color: '#8b5cf6' },
  { emoji: '📱', label: 'Looking for a Phone?', sub: 'Tech & gadget deals', href: '/buysell', color: '#06b6d4' },
  { emoji: '🔧', label: 'Need a Service?', sub: 'Plumbers, tutors & more', href: '/services', color: '#f59e0b' },
  { emoji: '🚗', label: 'Looking for a Car?', sub: 'Sedans, SUVs & more', href: '/buysell', color: '#64748b' },
];

export default function SuggestionsBar() {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full bg-gradient-to-r from-[#112240] to-[#0A192F] border-b border-white/5 py-3 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span className="font-body text-[10px] font-bold text-[#00D4FF] uppercase tracking-[0.15em]">Ask 1Market AI</span>
              <span className="font-body text-[10px] text-white/30">— Popular searches right now</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {SUGGESTIONS.map((s, i) => (
                <Link key={i} to={s.href}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.div
                    animate={hovered === i ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border whitespace-nowrap cursor-pointer transition-all"
                    style={{
                      borderColor: hovered === i ? s.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: hovered === i ? `${s.color}22` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-base leading-none">{s.emoji}</span>
                    <div>
                      <p className="font-body text-[11px] font-semibold text-white leading-tight">{s.label}</p>
                      <p className="font-body text-[9px] text-white/40 leading-tight">{s.sub}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/30 ml-1" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}