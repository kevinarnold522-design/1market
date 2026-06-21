import React from 'react';
import { motion } from 'framer-motion';

const CATS = [
  { key: 'Hotels',         icon: 'AI', label: 'Hotels',        color: '#f59e0b' },
  { key: 'Resorts',        icon: 'AI', label: 'Resorts',       color: '#10b981' },
  { key: 'Cruise',         icon: 'AI', label: 'Cruise',        color: '#3b82f6' },
  { key: 'Flights',        icon: 'AI️', label: 'Flights',       color: '#0ea5e9' },
  { key: 'Ferry & Bus',    icon: 'AI️', label: 'Ferry & Bus',  color: '#8b5cf6' },
  { key: 'Car Rentals',    icon: 'AI', label: 'Car Rentals',   color: '#ec4899' },
  { key: 'Van Rentals',    icon: 'AI', label: 'Van Rentals',   color: '#f97316' },
  { key: 'Tours',          icon: 'AI️', label: 'Tours',         color: '#22c55e' },
  { key: 'Island Hopping', icon: 'AI️', label: 'Islands',       color: '#06b6d4' },
  { key: 'Camping',        icon: 'AI', label: 'Camping',       color: '#84cc16' },
  { key: 'Hiking',         icon: 'AI', label: 'Hiking',        color: '#a78bfa' },
  { key: 'Diving',         icon: 'AI', label: 'Diving',        color: '#38bdf8' },
  { key: 'Surfing',        icon: 'AI', label: 'Surfing',       color: '#fb923c' },
];

export default function TravelCategoryBar({ active, onSelect }) {
  return (
    <div className="sticky top-0 z-30 bg-[#070F1A]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
          {CATS.map((cat, i) => {
            const isActive = active === cat.key;
            return (
              <motion.button key={cat.key}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => onSelect(cat.key)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl font-body text-xs whitespace-nowrap transition-all flex-shrink-0"
                style={isActive
                  ? { background: `${cat.color}22`, border: `1px solid ${cat.color}66`, color: cat.color }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                <span className="text-lg leading-none">{cat.icon}</span>
                <span className="font-semibold text-[10px]">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { CATS };