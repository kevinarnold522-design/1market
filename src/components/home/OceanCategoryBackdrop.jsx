import React from 'react';
import { motion } from 'framer-motion';

const seaLife = [
  { icon: '🐟', label: 'fish', top: '23%', size: 'text-2xl', duration: 18, delay: 0, dir: 1 },
  { icon: '🐠', label: 'fish', top: '58%', size: 'text-xl', duration: 21, delay: 2, dir: -1 },
  { icon: '🐬', label: 'dolphin', top: '35%', size: 'text-4xl', duration: 24, delay: 1, dir: 1 },
  { icon: '🦈', label: 'shark', top: '68%', size: 'text-4xl', duration: 29, delay: 4, dir: -1 },
  { icon: '🐙', label: 'octopus', top: '76%', size: 'text-3xl', duration: 26, delay: 6, dir: 1 },
  { icon: '🐋', label: 'whale shark', top: '84%', size: 'text-5xl', duration: 34, delay: 3, dir: -1 },
];

export default function OceanCategoryBackdrop({ global = false }) {
  const shellClass = global
    ? 'fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#38bdf8] via-[#2563EB] to-[#0ea5e9]'
    : 'absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#38bdf8] via-[#2563EB] to-[#0ea5e9]';

  return (
    <div className={shellClass}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.32),transparent_32%),linear-gradient(115deg,rgba(186,230,253,0.2),transparent_48%)]" />
      <motion.div className="absolute inset-x-0 top-8 h-20 opacity-35" animate={{ x: ['-8%', '8%', '-8%'], scaleY: [1, 1.14, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.58),transparent_64%)]" />
      </motion.div>
      <div className="absolute right-4 sm:right-16 bottom-0 w-64 h-36 opacity-95">
        <div className="absolute bottom-0 left-8 w-44 h-20 rounded-t-full bg-[#facc15] shadow-2xl" />
        <div className="absolute bottom-16 left-24 w-3 h-16 bg-[#8B5A2B] rounded-full rotate-6" />
        <div className="absolute bottom-28 left-12 w-28 h-12 rounded-full bg-[#22c55e] -rotate-12" />
        <div className="absolute bottom-25 left-26 w-28 h-12 rounded-full bg-[#16a34a] rotate-12" />
      </div>
      {seaLife.map(item => {
        const start = item.dir === 1 ? '-18vw' : '112vw';
        const end = item.dir === 1 ? '112vw' : '-18vw';
        return (
          <motion.div key={item.label + item.top} className={`absolute ${item.size} drop-shadow-lg`} style={{ top: item.top }} aria-label={item.label}
            initial={{ x: start, scaleX: item.dir }} animate={{ x: [start, '28vw', '62vw', end], y: [0, -18, 14, -8, 0], rotate: [0, -5, 6, -3, 0] }}
            transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}>
            {item.icon}
          </motion.div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f8bd8]/75 to-transparent" />
    </div>
  );
}