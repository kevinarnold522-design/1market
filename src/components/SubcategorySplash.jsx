import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', 'K', 'Q', 'J', '10', '9'];

const GRADIENTS = [
  'linear-gradient(135deg,#1a1a2e,#16213e)',
  'linear-gradient(135deg,#1a1a2e,#0f3460)',
  'linear-gradient(135deg,#0d1b2a,#1b4332)',
  'linear-gradient(135deg,#1a0030,#3b0764)',
  'linear-gradient(135deg,#1a1a2e,#3a0ca3)',
  'linear-gradient(135deg,#0a1628,#1d4ed8)',
  'linear-gradient(135deg,#1a0a00,#78350f)',
  'linear-gradient(135deg,#0f2027,#203a43)',
  'linear-gradient(135deg,#1a1a2e,#2d6a4f)',
];

const ACCENT_COLORS = [
  '#60a5fa', '#f87171', '#34d399', '#c084fc',
  '#38bdf8', '#fbbf24', '#fb923c', '#4ade80', '#e879f9',
];

function CasinoCard({ sc, index, isActive, onClick }) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardIdx, setCardIdx] = useState(index % VALUES.length);

  const gradient = GRADIENTS[index % GRADIENTS.length];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const suit = SUITS[index % SUITS.length];
  const val = VALUES[cardIdx % VALUES.length];
  const isRed = suit === '♥' || suit === '♦';

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % VALUES.length), 900);
    return () => clearInterval(t);
  }, []);

  const calcTilt = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  const reset = () => { setTilt({ x: 0, y: 0 }); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200, damping: 18 }}
      style={{ perspective: '700px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => { setFlipped(false); reset(); }}
      onMouseMove={e => calcTilt(e.clientX, e.clientY)}
      onTouchStart={() => setFlipped(true)}
      onTouchEnd={() => { setFlipped(false); reset(); }}
      onClick={onClick}
      className="cursor-pointer select-none"
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(700px) rotateY(${flipped ? 180 : tilt.y}deg) rotateX(${tilt.x}deg)`,
          transition: flipped ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.1s ease',
          aspectRatio: '1/1.1',
          position: 'relative',
        }}
      >
        {/* FRONT — category face */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', background: isActive ? 'linear-gradient(135deg,#1d4ed8,#0891b2)' : gradient,
            border: `1.5px solid ${accent}44`,
            boxShadow: isActive ? `0 0 28px 6px ${accent}66` : `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Card filigree corners */}
          <div className="absolute top-1.5 left-2 text-[9px] font-black" style={{ color: accent }}>
            <div>{val}</div>
            <div>{suit}</div>
          </div>
          <div className="absolute bottom-1.5 right-2 text-[9px] font-black rotate-180" style={{ color: accent }}>
            <div>{val}</div>
            <div>{suit}</div>
          </div>
          {/* Shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
            <div className="text-2xl sm:text-3xl mb-1.5 drop-shadow-lg">{sc.icon}</div>
            <p className="font-heading font-bold text-xs sm:text-sm text-white leading-tight text-center">{sc.label}</p>
            {sc.desc && <p className="font-body text-[9px] mt-0.5 text-white/60 leading-snug hidden sm:block text-center">{sc.desc}</p>}
          </div>
        </div>

        {/* BACK — casino card */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg,#0f172a,#1e1b4b)',
            border: `1.5px solid ${accent}88`,
            boxShadow: `0 0 30px 8px ${accent}44`,
          }}
        >
          {/* Diamond pattern */}
          <div className="absolute inset-1 rounded-xl border border-white/5"
            style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 2px,transparent 2px,transparent 10px)' }} />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.div key={cardIdx}
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="font-heading font-black text-3xl text-white drop-shadow">{VALUES[cardIdx]}</p>
                <p className="text-xl" style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</p>
              </motion.div>
            </AnimatePresence>
            <p className="font-body text-[9px] font-bold mt-0.5" style={{ color: accent }}>{sc.label}</p>
          </div>
          <div className="absolute top-1.5 left-2 text-[9px] font-black" style={{ color: accent }}>
            <div>{VALUES[cardIdx]}</div><div style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</div>
          </div>
          <div className="absolute bottom-1.5 right-2 text-[9px] font-black rotate-180" style={{ color: accent }}>
            <div>{VALUES[cardIdx]}</div><div style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SubcategorySplash({ subcategories, activeKey, onSelect, title, subtitle }) {
  const [dismissed, setDismissed] = useState(false);

  const handleSelect = (key) => {
    onSelect(key);
    setTimeout(() => setDismissed(true), 400);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#070E1A]/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', border: '1px solid rgba(96,165,250,0.15)' }}
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(255,255,255,0.01) 20px,rgba(255,255,255,0.01) 21px)' }} />

          <div className="text-center mb-6 relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Marketph.com</span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">{title}</h2>
            {subtitle && <p className="font-body text-sm text-white/40 mt-1">{subtitle}</p>}
            <p className="font-body text-[10px] text-white/25 mt-1">Hover to flip • Tap to select</p>
          </div>

          <div className={`grid gap-3 relative z-10 ${subcategories.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : subcategories.length <= 6 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-4'}`}>
            {subcategories.map((sc, i) => (
              <CasinoCard
                key={sc.key}
                sc={sc}
                index={i}
                isActive={activeKey === sc.key}
                onClick={() => handleSelect(sc.key)}
              />
            ))}
          </div>

          <p className="text-center font-body text-[10px] text-white/20 mt-5 relative z-10">
            Tap a category to continue — you can change it anytime
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}