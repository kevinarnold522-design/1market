import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { icon: '🛒', label: 'CUSTOMER', sub: '1 GOAL', color: '#00D4FF' },
  { icon: '👨‍💼', label: 'SELLER', sub: '1 VISION', color: '#2563EB' },
  { icon: '📋', label: 'LISTER', sub: '1 MARKET', color: '#7C3AED' },
];

const SERVICES = [
  'eCommerce Site Builder',
  'Inventory & Fulfillment',
  'Integrated Payments',
  'Marketing & Analytics',
  'Customer Support Portal',
];

const SERVICE_POSITIONS = [
  { top: '8%', left: '2%' },
  { top: '8%', right: '2%' },
  { bottom: '8%', left: '2%' },
  { bottom: '8%', right: '2%' },
  { top: '50%', right: '0%', transform: 'translateY(-50%)' },
];

function WaterRipple() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-[#00D4FF]/20"
          style={{ width: `${40 + i * 30}%`, height: `${40 + i * 30}%`, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.05, 0.3] }}
          transition={{ duration: 3 + i, delay: i * 1, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
      <motion.div className="absolute inset-0"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(0,212,255,0.04) 50%, transparent 60%)', backgroundSize: '200% 100%' }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
    </div>
  );
}

function FlowArrow({ delay }) {
  return (
    <div className="flex-1 hidden sm:flex items-center justify-center relative mx-1">
      <div className="w-full h-0.5 bg-gradient-to-r from-[#00D4FF]/30 to-[#2563EB]/30 relative overflow-hidden rounded-full">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'linear' }} />
      </div>
    </div>
  );
}

export default function HeroAnimation3D() {
  const [activeRoleIdx, setActiveRoleIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Cycle through roles: appear, stay, disappear, next
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveRoleIdx(i => (i + 1) % ROLES.length);
        setVisible(true);
      }, 600);
    }, 3000);
    return () => clearInterval(cycleInterval);
  }, []);

  const role = ROLES[activeRoleIdx];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #070E1A 0%, #0A192F 50%, #0D2145 100%)', minHeight: '340px' }}>
      <WaterRipple />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative z-10 pt-6 pb-2 text-center px-4">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="h-px w-8 bg-[#00D4FF]/40" />
          <span className="font-body text-[9px] tracking-[0.25em] uppercase text-[#00D4FF]/70">1Marketph.com</span>
          <div className="h-px w-8 bg-[#00D4FF]/40" />
        </div>
        <h2 className="font-heading font-black text-white text-base sm:text-xl lg:text-2xl tracking-tight leading-tight">
          SERVICES: ALL-IN-ONE STOP SHOP
        </h2>
      </motion.div>

      {/* Floating service tags */}
      {SERVICES.map((s, i) => (
        <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.15 }}
          className="absolute z-20 hidden lg:block" style={SERVICE_POSITIONS[i]}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            className="px-2.5 py-1 rounded-full text-[9px] font-body font-semibold whitespace-nowrap"
            style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#a5f3fc' }}>
            {s}
          </motion.div>
        </motion.div>
      ))}

      {/* 3 Nodes with animated center role */}
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 px-6 pb-6 pt-4">
        {/* Left: Static Customer */}
        <div className="flex flex-col items-center gap-2 z-10">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 14 }}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0A192F, #112240)', border: '2px solid #00D4FF', boxShadow: '0 0 14px 2px rgba(0,212,255,0.33)' }}>
              <span className="text-2xl sm:text-3xl">🛒</span>
              <motion.div className="absolute inset-0 rounded-full" animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{ border: '1px solid #00D4FF' }} />
            </div>
          </motion.div>
          <p className="font-heading font-bold text-white text-xs">CUSTOMER</p>
          <p className="font-body text-[9px] text-[#00D4FF] tracking-wider uppercase">1 GOAL</p>
        </div>

        <FlowArrow delay={0.3} />

        {/* Center: Animated role cycling (Customer / Seller / Lister) */}
        <div className="flex flex-col items-center gap-2 z-10">
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div key={activeRoleIdx}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 18 }}>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0A192F, #112240)', border: `2px solid ${role.color}`, boxShadow: `0 0 24px 6px ${role.color}55` }}>
                  <span className="text-3xl sm:text-4xl">{role.icon}</span>
                  <motion.div className="absolute inset-0 rounded-full" animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ border: `1px solid ${role.color}` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div key={`label-${activeRoleIdx}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }} className="text-center">
                <p className="font-heading font-bold text-white text-sm sm:text-base">{role.label}</p>
                <p className="font-body text-[10px] tracking-wider uppercase mt-0.5" style={{ color: role.color }}>{role.sub}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <FlowArrow delay={0.5} />

        {/* Right: CYCLE node with rotating ring */}
        <div className="flex flex-col items-center gap-2 z-10">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 180, damping: 14 }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
              <svg viewBox="0 0 96 96" className="w-full h-full absolute inset-0" fill="none">
                <circle cx="48" cy="48" r="44" stroke="url(#cycleGrad)" strokeWidth="1.5" strokeDasharray="8 4" />
                <defs>
                  <linearGradient id="cycleGrad" x1="0" y1="0" x2="96" y2="96">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0A192F, #112240)', border: '2px solid #2563EB', boxShadow: '0 0 20px 4px rgba(37,99,235,0.35)' }}>
              <span className="text-2xl sm:text-3xl">🔄</span>
            </div>
          </motion.div>
          <p className="font-heading font-bold text-white text-xs sm:text-sm">CYCLE</p>
          <p className="font-body text-[9px] text-[#00D4FF] tracking-wider uppercase">1 MARKET</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,212,255,0.04), transparent)' }} />
    </div>
  );
}