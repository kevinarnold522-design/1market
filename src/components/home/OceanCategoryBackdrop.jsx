import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SEA_CREATURES } from './SeaCreatures';

const seaLife = [
  { type: 'fish',      label: 'tropical fish', top: '14%', w: 'w-16', duration: 18, delay: 0,   dir: 1 },
  { type: 'puffer',    label: 'puffer fish',   top: '28%', w: 'w-14', duration: 20, delay: 1.2, dir: -1 },
  { type: 'clownfish', label: 'clownfish',     top: '22%', w: 'w-16', duration: 22, delay: 0.8, dir: 1 },
  { type: 'seahorse',  label: 'seahorse',      top: '38%', w: 'w-12', duration: 24, delay: 1.6, dir: 1 },
  { type: 'jellyfish', label: 'jellyfish',     top: '48%', w: 'w-14', duration: 26, delay: 2.2, dir: -1 },
  { type: 'turtle',    label: 'sea turtle',    top: '34%', w: 'w-24', duration: 30, delay: 2.4, dir: -1 },
  { type: 'fish',      label: 'reef fish',     top: '54%', w: 'w-14', duration: 20, delay: 2.8, dir: 1 },
  { type: 'shark',     label: 'shark',         top: '66%', w: 'w-28', duration: 28, delay: 3.4, dir: -1 },
  { type: 'whale',     label: 'whale',         top: '78%', w: 'w-40', duration: 34, delay: 3.8, dir: 1 },
  { type: 'crab',      label: 'crab',          top: '86%', w: 'w-20', duration: 30, delay: 4.2, dir: 1 },
  { type: 'octopus',   label: 'octopus',       top: '74%', w: 'w-20', duration: 32, delay: 4.8, dir: -1 },
  { type: 'jellyfish', label: 'jelly',         top: '60%', w: 'w-12', duration: 36, delay: 5.4, dir: 1 },
  { type: 'whale',     label: 'whale shark',   top: '18%', w: 'w-48', duration: 42, delay: 5.8, dir: -1 },
];

export default function OceanCategoryBackdrop({ global = false }) {
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse), (max-width: 900px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setShowBubbles(!coarse.matches && !reduceMotion.matches);
    update();
    if (typeof coarse.addEventListener === 'function') coarse.addEventListener('change', update); else coarse.addListener(update);
    if (typeof reduceMotion.addEventListener === 'function') reduceMotion.addEventListener('change', update); else reduceMotion.addListener(update);
    return () => {
      if (typeof coarse.removeEventListener === 'function') coarse.removeEventListener('change', update); else coarse.removeListener(update);
      if (typeof reduceMotion.removeEventListener === 'function') reduceMotion.removeEventListener('change', update); else reduceMotion.removeListener(update);
    };
  }, []);
  const shellClass = global
    ? 'fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#38bdf8] via-[#2563EB] to-[#0ea5e9]'
    : 'absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#38bdf8] via-[#2563EB] to-[#0ea5e9]';

  return (
    <div className={shellClass}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.32),transparent_32%),linear-gradient(115deg,rgba(186,230,253,0.2),transparent_48%)]" />
      <motion.div className="absolute inset-x-0 top-8 h-20 opacity-35" animate={{ x: ['-8%', '8%', '-8%'], scaleY: [1, 1.14, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.58),transparent_64%)]" />
      </motion.div>
      <div className="absolute left-4 sm:left-12 bottom-0 w-48 h-28 opacity-90">
        <div className="absolute bottom-0 left-4 w-36 h-14 rounded-t-full bg-[#fde68a] shadow-2xl" />
        <div className="absolute bottom-12 left-20 w-2.5 h-12 bg-[#8B5A2B] rounded-full -rotate-6" />
        <div className="absolute bottom-21 left-12 w-20 h-8 rounded-full bg-[#22c55e] -rotate-12" />
        <div className="absolute bottom-21 left-20 w-20 h-8 rounded-full bg-[#16a34a] rotate-12" />
        <div className="absolute bottom-12 left-8 w-2 h-9 bg-[#7c4a1f] rounded-full rotate-12" />
        <div className="absolute bottom-18 left-2 w-16 h-7 rounded-full bg-[#65a30d] rotate-12" />
        <div className="absolute bottom-18 left-9 w-16 h-7 rounded-full bg-[#84cc16] -rotate-12" />
      </div>
      <div className="absolute right-4 sm:right-16 bottom-0 w-64 h-36 opacity-95">
        <div className="absolute bottom-0 left-8 w-44 h-20 rounded-t-full bg-[#facc15] shadow-2xl" />
        <div className="absolute bottom-16 left-24 w-3 h-16 bg-[#8B5A2B] rounded-full rotate-6" />
        <div className="absolute bottom-28 left-12 w-28 h-12 rounded-full bg-[#22c55e] -rotate-12" />
        <div className="absolute bottom-25 left-26 w-28 h-12 rounded-full bg-[#16a34a] rotate-12" />
        <div className="absolute bottom-14 left-42 w-2.5 h-14 bg-[#7c4a1f] rounded-full -rotate-12" />
        <div className="absolute bottom-25 left-34 w-24 h-10 rounded-full bg-[#15803d] rotate-24" />
        <div className="absolute bottom-25 left-44 w-24 h-10 rounded-full bg-[#22c55e] -rotate-24" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-56 h-24 opacity-80 hidden md:block">
        <div className="absolute bottom-0 left-8 w-40 h-12 rounded-t-full bg-[#fbbf24] shadow-xl" />
        <div className="absolute bottom-10 left-18 w-2 h-10 bg-[#8B5A2B] rounded-full rotate-3" />
        <div className="absolute bottom-17 left-10 w-20 h-7 rounded-full bg-[#4ade80] -rotate-12" />
        <div className="absolute bottom-17 left-18 w-20 h-7 rounded-full bg-[#16a34a] rotate-12" />
        <div className="absolute bottom-8 left-30 w-8 h-12 rounded-t-full bg-[#166534]" />
        <div className="absolute bottom-14 left-28 w-12 h-6 rounded-full bg-[#22c55e]" />
      </div>
      {seaLife.map(item => {
        const start = item.dir === 1 ? '-18vw' : '112vw';
        const end = item.dir === 1 ? '112vw' : '-18vw';
        const Creature = SEA_CREATURES[item.type] || SEA_CREATURES.fish;
        return (
          <motion.div key={item.label + item.top} className={`absolute ${item.w} drop-shadow-lg pointer-events-auto cursor-pointer`} style={{ top: item.top }} aria-label={item.label}
            initial={{ x: start, scaleX: item.dir }} animate={{ x: [start, '28vw', '62vw', end], y: [0, -18, 14, -8, 0], rotate: [0, -5, 6, -3, 0] }}
            whileHover={{ scale: 1.3, transition: { duration: 0.25 } }}
            transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}>
            <motion.div animate={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <Creature className="w-full h-auto" />
            </motion.div>

            {/* Bubbles that float upward near each creature (CSS-driven for performance) */}
            {showBubbles && [0,1,2].map(i => {
              const size = 6 + (i % 3) * 4; // px
              const delay = item.delay + i * 0.4;
              const dur = Math.max(6, (item.duration * 0.6) - i * 1.5);
              const left = 6 + i * 10;
              return (
                <div key={i}
                  className="absolute rounded-full bg-white/50 animate-bubble-float"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    bottom: -size - 2,
                    animationDelay: `${delay}s`,
                    animationDuration: `${dur}s`,
                    '--bubble-drift': `${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}px`
                  }}
                />
              );
            })}
          </motion.div>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f8bd8]/75 to-transparent" />
    </div>
  );
}