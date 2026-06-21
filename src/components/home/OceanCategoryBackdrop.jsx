import React from 'react';
import { motion } from 'framer-motion';

const seaLife = [
  { icon: '🐟', label: 'fish', top: '24%', size: 'text-2xl', duration: 15, delay: 0 },
  { icon: '🐠', label: 'fish', top: '62%', size: 'text-xl', duration: 18, delay: 2 },
  { icon: '🐬', label: 'dolphin', top: '34%', size: 'text-4xl', duration: 20, delay: 1 },
  { icon: '🦈', label: 'shark', top: '72%', size: 'text-4xl', duration: 24, delay: 3 },
  { icon: '🐙', label: 'octopus', top: '50%', size: 'text-3xl', duration: 22, delay: 5 },
  { icon: '🐋', label: 'whale shark', top: '82%', size: 'text-5xl', duration: 28, delay: 4 },
];

export default function OceanCategoryBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#38bdf8] via-[#2563EB] to-[#0ea5e9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.28),transparent_34%),linear-gradient(115deg,rgba(186,230,253,0.18),transparent_45%)]" />
      <motion.div className="absolute inset-x-0 top-5 h-16 opacity-35" animate={{ x: ['-10%', '10%', '-10%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_62%)]" />
      </motion.div>
      <div className="absolute right-4 sm:right-16 bottom-0 w-64 h-36">
        <div className="absolute bottom-0 left-8 w-44 h-20 rounded-t-full bg-[#facc15] shadow-2xl" />
        <div className="absolute bottom-16 left-24 w-3 h-16 bg-[#8B5A2B] rounded-full rotate-6" />
        <div className="absolute bottom-28 left-12 w-28 h-12 rounded-full bg-[#22c55e] -rotate-12" />
        <div className="absolute bottom-25 left-26 w-28 h-12 rounded-full bg-[#16a34a] rotate-12" />
      </div>
      {seaLife.map(item => (
        <motion.div key={item.label + item.top} className={`absolute ${item.size} drop-shadow-lg`} style={{ top: item.top }} aria-label={item.label}
          initial={{ x: '-15vw', scaleX: 1 }} animate={{ x: '110vw', y: [0, -12, 10, 0], rotate: [0, 4, -3, 0] }}
          transition={{ duration: item.duration, repeat: Infinity, ease: 'linear', delay: item.delay }}>
          {item.icon}
        </motion.div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0f8bd8]/70 to-transparent" />
    </div>
  );
}