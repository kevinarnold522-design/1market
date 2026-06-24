import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fish = [
  { label: 'golden trevally 1', top: '66%', body: '#D6A83E', belly: '#F8E7B0', stripe: '#7C5A1A', fin: '#C7782A', duration: 23, delay: 0, dir: 1, size: 0.95 },
  { label: 'red snapper 1', top: '72%', body: '#B94A3A', belly: '#F5C7B8', stripe: '#7A241D', fin: '#D86E4D', duration: 27, delay: 0.7, dir: -1, size: 0.9 },
  { label: 'silver milkfish 1', top: '78%', body: '#C7D7DD', belly: '#F8FAFC', stripe: '#6C8792', fin: '#A7C0CA', duration: 30, delay: 1.4, dir: 1, size: 1.12 },
  { label: 'blue tang 1', top: '84%', body: '#2E6FAE', belly: '#8FC6E8', stripe: '#123A66', fin: '#F0C94B', duration: 25, delay: 2.1, dir: -1, size: 0.82 },
  { label: 'clownfish 1', top: '90%', body: '#F97316', belly: '#FFE1B8', stripe: '#FFFFFF', fin: '#EF4444', duration: 21, delay: 2.8, dir: 1, size: 0.72 },
  { label: 'parrotfish 1', top: '69%', body: '#18A999', belly: '#BFF7EA', stripe: '#146C94', fin: '#FACC15', duration: 29, delay: 3.5, dir: -1, size: 0.86 },
  { label: 'yellowfin tuna 1', top: '76%', body: '#426B8A', belly: '#EDF7FA', stripe: '#1E3A5F', fin: '#FACC15', duration: 20, delay: 4.2, dir: 1, size: 0.78 },
  { label: 'reef fish 1', top: '88%', body: '#7C3AED', belly: '#DDD6FE', stripe: '#FBBF24', fin: '#FB7185', duration: 24, delay: 4.9, dir: -1, size: 0.68 },
  { label: 'golden trevally 2', top: '81%', body: '#D6A83E', belly: '#F8E7B0', stripe: '#7C5A1A', fin: '#C7782A', duration: 31, delay: 5.6, dir: 1, size: 0.64 },
  { label: 'silver milkfish 2', top: '93%', body: '#C7D7DD', belly: '#F8FAFC', stripe: '#6C8792', fin: '#A7C0CA', duration: 26, delay: 6.3, dir: -1, size: 0.74 },
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

function Boat({ className, delay = 0 }) {
  return (
    <motion.div className={`absolute pointer-events-none ${className}`} animate={{ x: [0, 14, 0], y: [0, -3, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay, ease: 'easeInOut' }}>
      <div className="relative w-28 h-20">
        <div className="absolute bottom-3 left-2 w-24 h-8 rounded-b-full bg-[#8B5A2B] shadow-xl" />
        <div className="absolute bottom-11 left-14 w-1 h-11 bg-[#6B3F1D]" />
        <div className="absolute bottom-13 left-15 w-0 h-0 border-y-[20px] border-y-transparent border-l-[28px] border-l-white/90" />
        <div className="absolute bottom-4 left-6 w-14 h-2 rounded-full bg-white/40" />
      </div>
    </motion.div>
  );
}

function OceanWaves() {
  const layers = [
    { bottom: '0%', height: 96, color: 'rgba(29,78,216,0.52)', duration: 8 },
    { bottom: '13%', height: 86, color: 'rgba(14,165,233,0.36)', duration: 10 },
    { bottom: '26%', height: 72, color: 'rgba(255,255,255,0.18)', duration: 12 },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 h-[48%] overflow-hidden pointer-events-none">
      {layers.map((wave, i) => (
        <motion.div
          key={i}
          className="absolute left-[-25%] w-[150%] rounded-[50%]"
          style={{ bottom: wave.bottom, height: wave.height, background: wave.color, filter: 'blur(1px)' }}
          animate={{ x: ['0%', '-10%', '0%'], y: [0, -10, 4, 0], scaleY: [1, 1.08, 0.96, 1] }}
          transition={{ duration: wave.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 0.55 }}
        />
      ))}
      <motion.div
        className="absolute left-[-10%] bottom-[31%] h-8 w-[120%] opacity-70"
        style={{ background: 'repeating-linear-gradient(90deg, transparent 0 44px, rgba(255,255,255,0.32) 44px 88px)', borderRadius: '999px', filter: 'blur(8px)' }}
        animate={{ x: ['0%', '8%', '0%'], opacity: [0.35, 0.78, 0.35] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function BubbleColumn({ className, delay = 0 }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {[0, 1, 2].map(i => <span key={i} className="absolute rounded-full bg-white/55 animate-bubble-float" style={{ width: 10 + i * 5, height: 10 + i * 5, left: i * 16, bottom: i * 18, animationDuration: `${7 + i}s`, animationDelay: `${delay + i * 0.6}s`, '--bubble-drift': `${18 - i * 4}px` }} />)}
    </div>
  );
}

function FishBody({ item, showBubbles }) {
  const id = item.label.replace(/\s+/g, '-');

  return (
    <div className="relative" style={{ width: 132 * item.size, height: 66 * item.size }}>
      <motion.svg
        viewBox="0 0 132 66"
        className="absolute inset-0 drop-shadow-2xl"
        aria-hidden="true"
        animate={{ rotate: [0, 1.3, -1.3, 0], scaleX: [1, 1.025, 1] }}
        transition={{ duration: 1.65, repeat: Infinity, ease: 'easeInOut' }}>
        <defs>
          <linearGradient id={`body-${id}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={item.body} />
            <stop offset="58%" stopColor={item.body} />
            <stop offset="100%" stopColor={item.belly} />
          </linearGradient>
          <radialGradient id={`shine-${id}`} cx="70%" cy="28%" r="52%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.78)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <motion.path d="M24 33 L5 14 C16 19 23 24 27 31 C23 39 16 47 5 52 Z" fill={item.fin} opacity="0.9" animate={{ rotate: [-4, 6, -4] }} style={{ transformOrigin: '24px 33px' }} transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }} />
        <path d="M24 33 C34 9 80 5 113 28 C121 34 121 38 113 42 C80 61 34 57 24 33 Z" fill={`url(#body-${id})`} />
        <path d="M24 33 C44 42 79 45 112 38 C90 57 43 58 24 33 Z" fill={item.belly} opacity="0.55" />
        <path d="M43 15 C57 5 79 7 91 18 C73 16 58 18 43 15 Z" fill={item.fin} opacity="0.82" />
        <path d="M55 48 C67 58 86 56 98 45 C79 47 66 46 55 48 Z" fill={item.fin} opacity="0.72" />
        <path d="M40 34 C58 29 82 29 105 34" stroke={item.stripe} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        {[44, 55, 66, 77, 88].map((x, i) => <path key={x} d={`M${x} 20 C${x - 5} 28 ${x - 5} 38 ${x} 46`} stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" fill="none" opacity={0.85 - i * 0.08} />)}
        <ellipse cx="94" cy="25" rx="3.8" ry="4.2" fill="#071326" />
        <circle cx="95.5" cy="23.5" r="1.1" fill="#ffffff" />
        <path d="M111 35 C116 34 119 32 122 30" stroke="rgba(7,19,38,0.45)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M24 33 C34 9 80 5 113 28 C121 34 121 38 113 42 C80 61 34 57 24 33 Z" fill={`url(#shine-${id})`} opacity="0.45" />
      </motion.svg>
      {showBubbles && [0, 1, 2].map(i => (
        <span key={i} className="absolute rounded-full bg-white/60 animate-bubble-float" style={{ width: 6 + i * 3, height: 6 + i * 3, left: -8 - i * 6, bottom: 8 + i * 5, animationDelay: `${item.delay + i * 0.35}s`, animationDuration: `${6 + i}s`, '--bubble-drift': `${8 + i * 3}px` }} />
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
    ? 'fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#7DD3FC] via-[#3E97F1] to-[#2563EB]'
    : 'absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#7DD3FC] via-[#3E97F1] to-[#2563EB]';

  return (
    <div className={shellClass}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.06)_34%,rgba(14,165,233,0.2)_100%)]" />
      <motion.div className="absolute top-8 right-14 w-28 h-28 rounded-full bg-[#FFD700] shadow-[0_0_70px_rgba(255,215,0,0.7)]" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      <Cloud className="top-14 left-8 opacity-90" />
      <Cloud className="top-24 right-36 opacity-80 scale-125" delay={1.4} />
      <Cloud className="top-36 left-1/2 opacity-70 scale-90" delay={2.2} />

      <OceanWaves />
      <Island className="left-6 sm:left-16 top-[58%] w-52 h-40 opacity-95" />
      <Island className="right-10 sm:right-24 top-[62%] w-56 h-44 opacity-90 scale-110" />
      <Island className="left-1/2 top-[68%] w-48 h-40 opacity-75 hidden md:block" />
      <Boat className="left-44 sm:left-64 top-[66%] opacity-95" />
      <Boat className="right-36 sm:right-72 top-[70%] opacity-85 scale-75" delay={1.5} />
      <BubbleColumn className="left-[18%] bottom-[8%]" />
      <BubbleColumn className="left-[50%] bottom-[5%]" delay={1.1} />
      <BubbleColumn className="right-[20%] bottom-[9%]" delay={2.1} />

      {fish.map(item => {
        const start = item.dir === 1 ? '-18vw' : '112vw';
        const end = item.dir === 1 ? '112vw' : '-18vw';
        return (
          <motion.div key={item.label} className="absolute drop-shadow-2xl" style={{ top: item.top }} aria-label={item.label}
            initial={{ x: start, scaleX: item.dir }} animate={{ x: [start, '28vw', '62vw', end], y: [0, -10, 8, -6, 0], rotate: [0, -1.5, 2, -1, 0] }}
            transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}>
            <FishBody item={item} showBubbles={showBubbles} />
          </motion.div>
        );
      })}

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0284C7]/80 to-transparent" />
    </div>
  );
}