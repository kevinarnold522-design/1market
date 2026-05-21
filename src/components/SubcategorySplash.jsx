import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRADIENTS = [
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#a855f7,#ec4899)',
  'linear-gradient(135deg,#22c55e,#14b8a6)',
  'linear-gradient(135deg,#ef4444,#f43f5e)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#2563eb)',
  'linear-gradient(135deg,#d97706,#b45309)',
  'linear-gradient(135deg,#10b981,#059669)',
];

const GLOW_COLORS = [
  '59,130,246','249,115,22','168,85,247','34,197,94',
  '239,68,68','99,102,241','14,165,233','217,119,6','16,185,129',
];

function TiltCard({ sc, index, isActive, onClick }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowing, setGlowing] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const glow = GLOW_COLORS[index % GLOW_COLORS.length];

  const calcTilt = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -14, y: dx * 14 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease' : 'transform 0.08s ease',
        willChange: 'transform',
      }}
      onMouseMove={e => calcTilt(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={() => setGlowing(true)}
      onTouchEnd={() => { reset(); setGlowing(false); }}
      onTouchMove={e => { setGlowing(true); const t = e.touches[0]; calcTilt(t.clientX, t.clientY); }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className="relative rounded-2xl text-white text-center overflow-hidden select-none"
        style={{
          background: isActive ? gradient : 'white',
          aspectRatio: '1 / 1',
          boxShadow: isActive || glowing
            ? `0 0 28px 6px rgba(${glow},0.5), 0 8px 24px rgba(${glow},0.3)`
            : '0 2px 12px rgba(10,25,47,0.08)',
          border: isActive ? 'none' : '2px solid rgba(10,25,47,0.06)',
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
        }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-3">
          <div className="text-3xl sm:text-4xl mb-2 drop-shadow">{sc.icon}</div>
          <p className={`font-heading font-bold text-xs sm:text-sm leading-tight ${isActive ? 'text-white' : 'text-[#0A192F]'}`}>
            {sc.label}
          </p>
          {sc.desc && (
            <p className={`font-body text-[10px] mt-1 leading-snug hidden sm:block ${isActive ? 'text-white/75' : 'text-[#0A192F]/45'}`}>
              {sc.desc}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SubcategorySplash({ subcategories, activeKey, onSelect, title, subtitle }) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after user picks (small delay so they see the selection)
  const handleSelect = (key) => {
    onSelect(key);
    setTimeout(() => setDismissed(true), 400);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            className="w-full max-w-2xl bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">1Market</span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0A192F]">{title}</h2>
              {subtitle && <p className="font-body text-sm text-[#0A192F]/50 mt-1">{subtitle}</p>}
            </div>

            {/* Cards */}
            <div className={`grid gap-3 ${subcategories.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : subcategories.length <= 6 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-4'}`}>
              {subcategories.map((sc, i) => (
                <TiltCard
                  key={sc.key}
                  sc={sc}
                  index={i}
                  isActive={activeKey === sc.key}
                  onClick={() => handleSelect(sc.key)}
                />
              ))}
            </div>

            <p className="text-center font-body text-xs text-[#0A192F]/30 mt-5">
              Tap a category to continue — you can change it anytime
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}