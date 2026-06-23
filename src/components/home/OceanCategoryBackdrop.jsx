import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fish = [
  { label: 'gold reef fish', top: '58%', color: '#FFD700', accent: '#EF4444', duration: 19, delay: 0, dir: 1, size: 1 },
  { label: 'red island fish', top: '67%', color: '#EF4444', accent: '#FFFFFF', duration: 22, delay: 1.1, dir: -1, size: 0.9 },
  { label: 'white reef fish', top: '75%', color: '#FFFFFF', accent: '#FFD700', duration: 24, delay: 2, dir: 1, size: 1.15 },
  { label: 'blue lagoon fish', top: '84%', color: '#60A5FA', accent: '#FFD700', duration: 28, delay: 2.8, dir: -1, size: 1.25 },
];

function Cloud({ className, delay = 0 }) {
  return (
    <motion.div className={`absolute ${className}`} animate={{ x: [0, 18, 0], y: [0, -4, 0] }} transition={{ duration: 10, repeat: Infinity, delay, ease: 'easeInOut' }}>
      <div className="relative w-36 h-12">
        <div className="absolute bottom-0 left-0 w-24 h-9 rounded-full bg-white/85 blur-[0.2px]" />
        <div className="absolute bottom-2 left-8 w-20 h-12 rounded-full bg-white/90" />
        <div className="absolute bottom-0 left-18 w-24 h-8 rounded-full bg-white/80" />
      </div>
    </motion.div>
  );
}

function Island({ className }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="absolute bottom-0 left-0 w-48 h-14 rounded-t-full bg-[#FACC15] shadow-2xl" />
      <div className="absolute bottom-12 left-24 w-3 h-16 rounded-full bg-[#8B5A2B] rotate-6" />
      <div className="absolute bottom-24 left-10 w-28 h-11 rounded-full bg-[#22C55E] -rotate-12" />
      <div className="absolute bottom-22 left-24 w-28 h-11 rounded-full bg-[#16A34A] rotate-12" />
      <div className="absolute bottom-9 left-8 w-16 h-9 rounded-t-full bg-white/45" />
    </div>
  );
}

function FishBody({ item, showBubbles }) {
  return (
    <div className="relative" style={{ width: 86 * item.size, height: 44 * item.size }}>
      <motion.div className="absolute inset-y-2 left-0 w-[72%] rounded-[999px] shadow-2xl"
        style={{ background: `radial-gradient(circle at 30% 30%, #fff 0 10%, ${item.color} 22%, ${item.accent} 100%)`, boxShadow: `0 12px 22px ${item.color}55` }}
        animate={{ rotate: [0, 3, -3, 0], scaleX: [1, 1.04, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.span className="absolute right-4 top-2 w-2.5 h-2.5 rounded-full bg-[#0A192F] border border-white"
          animate={{ scaleY: [1, 1, 0.12, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div className="absolute right-1 top-1/2 -translate-y-1/2 w-0 h-0"
        style={{ borderTop: `${16 * item.size}px solid transparent`, borderBottom: `${16 * item.size}px solid transparent`, borderLeft: `${28 * item.size}px solid ${item.accent}` }}
        animate={{ rotate: [-8, 10, -8] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }} />
      {showBubbles && [0, 1, 2, 3].map(i => (
        <span key={i} className="absolute rounded-full bg-white/60 animate-bubble-float" style={{ width: 6 + i * 3, height: 6 + i * 3, left: -8 - i * 6, bottom: 4 + i * 4, animationDelay: `${item.delay + i * 0.35}s`, animationDuration: `${6 + i}s`, '--bubble-drift': `${8 + i * 3}px` }} />
      ))}
    </div>
  );
}

export default function OceanCategoryBackdrop({ global = false }) {
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse), (max-width: 900px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setShowBubbles(!coarse.matches && !reduceMotion.matches);
    update();
    coarse.addEventListener?.('change', update);
    reduceMotion.addEventListener?.('change', update);
    return () => {
      coarse.removeEventListener?.('change', update);
      reduceMotion.removeEventListener?.('change', update);
    };
  }, []);

  const shellClass = global
    ? 'fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#7DD3FC] via-[#3E97F1] to-[#0EA5E9]'
    : 'absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#7DD3FC] via-[#3E97F1] to-[#0EA5E9]';

  return (
    <div className={shellClass}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.06)_34%,rgba(14,165,233,0.2)_100%)]" />
      <motion.div className="absolute top-8 right-14 w-28 h-28 rounded-full bg-[#FFD700] shadow-[0_0_70px_rgba(255,215,0,0.7)]" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <Cloud className="top-14 left-8 opacity-90" />
      <Cloud className="top-24 right-36 opacity-80 scale-125" delay={1.4} />
      <Cloud className="top-36 left-1/2 opacity-70 scale-90" delay={2.2} />

      <Island className="left-6 sm:left-16 top-[45%] w-52 h-40 opacity-95" />
      <Island className="right-10 sm:right-24 top-[50%] w-56 h-44 opacity-90 scale-110" />
      <Island className="left-1/2 top-[56%] w-48 h-40 opacity-75 hidden md:block" />

      {fish.map(item => {
        const start = item.dir === 1 ? '-18vw' : '112vw';
        const end = item.dir === 1 ? '112vw' : '-18vw';
        return (
          <motion.div key={item.label} className="absolute drop-shadow-2xl" style={{ top: item.top }} aria-label={item.label}
            initial={{ x: start, scaleX: item.dir }} animate={{ x: [start, '34vw', '66vw', end], y: [0, -14, 12, -8, 0], rotate: [0, -3, 4, -2, 0] }}
            transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}>
            <FishBody item={item} showBubbles={showBubbles} />
          </motion.div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0284C7]/80 to-transparent" />
    </div>
  );
}