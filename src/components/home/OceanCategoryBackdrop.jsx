import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const fish = [
  { label: 'realistic golden trevally', top: '70%', body: '#D6A83E', belly: '#F8E7B0', stripe: '#7C5A1A', fin: '#C7782A', duration: 23, delay: 0, dir: 1, size: 1 },
  { label: 'realistic red snapper', top: '78%', body: '#B94A3A', belly: '#F5C7B8', stripe: '#7A241D', fin: '#D86E4D', duration: 27, delay: 1.2, dir: -1, size: 0.92 },
  { label: 'realistic silver milkfish', top: '86%', body: '#C7D7DD', belly: '#F8FAFC', stripe: '#6C8792', fin: '#A7C0CA', duration: 30, delay: 2.4, dir: 1, size: 1.18 },
  { label: 'realistic blue tang', top: '92%', body: '#2E6FAE', belly: '#8FC6E8', stripe: '#123A66', fin: '#F0C94B', duration: 25, delay: 3.4, dir: -1, size: 0.88 },
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
  return (
    <div className="relative" style={{ width: 116 * item.size, height: 56 * item.size }}>
      <motion.div
        className="absolute left-2 top-2 h-10 w-20 rounded-[55%_45%_48%_52%] shadow-2xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${item.body} 0%, ${item.body} 45%, ${item.belly} 100%)`,
          boxShadow: `0 14px 28px ${item.body}66`,
        }}
        animate={{ rotate: [0, 1.5, -1.5, 0], scaleX: [1, 1.035, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute inset-0 opacity-45" style={{ background: 'repeating-radial-gradient(circle at 28% 50%, rgba(255,255,255,0.36) 0 2px, transparent 2px 9px)' }} />
        <div className="absolute left-4 right-3 top-5 h-1 rounded-full opacity-55" style={{ background: item.stripe }} />
        <motion.span className="absolute right-4 top-2.5 w-2.5 h-2.5 rounded-full bg-[#061326] border border-white/80 shadow-sm"
          animate={{ scaleY: [1, 1, 0.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <span className="absolute right-3 top-3.5 w-1 h-1 rounded-full bg-white" />
      </motion.div>
      <motion.div className="absolute left-10 top-0 w-7 h-5 rounded-t-full origin-bottom"
        style={{ background: `linear-gradient(180deg, ${item.fin}, transparent)` }}
        animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute left-12 bottom-1 w-8 h-5 rounded-b-full origin-top"
        style={{ background: `linear-gradient(0deg, ${item.fin}, transparent)` }}
        animate={{ rotate: [8, -8, 8] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute left-[78px] top-3 w-0 h-0 origin-left"
        style={{ borderTop: `${17 * item.size}px solid transparent`, borderBottom: `${17 * item.size}px solid transparent`, borderLeft: `${31 * item.size}px solid ${item.fin}` }}
        animate={{ rotate: [-13, 13, -13], scaleX: [1, 0.82, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
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