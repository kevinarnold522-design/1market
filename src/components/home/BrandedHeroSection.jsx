import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clipboard, RotateCw } from 'lucide-react';

export default function BrandedHeroSection() {
  const pillars = [
    { icon: ShoppingCart, label: 'CUSTOMER', subtext: '1 GOAL', color: '#00D4FF' },
    { icon: Clipboard, label: 'LISTER', subtext: '1 MARKET', color: '#FFD700' },
    { icon: RotateCw, label: 'CYCLE', subtext: '1 MARKET', color: '#10b981' },
  ];

  return (
    <div className="relative overflow-hidden py-12 sm:py-16" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 50%, #001a80 100%)' }}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity }}
            className="absolute rounded-full border border-[#00D4FF]"
            style={{ width: `${i * 200}px`, height: `${i * 200}px`, top: `${20 - i * 5}%`, right: `${10 - i * 3}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16">
          <p className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-2">
            1MARKETPH.COM
          </p>
          <p className="font-heading font-bold text-lg sm:text-2xl text-[#00D4FF] tracking-wide">
            SERVICES: ALL-IN-ONE STOP SHOP
          </p>
        </motion.div>

        {/* Three pillars + Image grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Three pillars */}
          <div className="space-y-4">
            {pillars.map((pillar, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm"
                style={{ background: `rgba(${pillar.color === '#00D4FF' ? '0,212,255' : pillar.color === '#FFD700' ? '255,215,0' : '16,185,129'},0.1)`, border: `1.5px solid ${pillar.color}33` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${pillar.color}20`, border: `2px solid ${pillar.color}` }}>
                  <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm tracking-wider">{pillar.label}</p>
                  <p className="font-body text-xs text-white/60">{pillar.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Mascot car image */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center">
            <img 
              src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/b00d7d6ed_92525A52-5C4B-496A-B9DF-F84AECB255D1.png"
              alt="1Market Philippines mascot"
              className="w-full max-w-sm drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,212,255,0.2))' }}
            />
          </motion.div>
        </div>

        {/* All-in-one stop shop banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center">
          <div className="inline-block px-6 py-3 rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1.5px solid rgba(0,212,255,0.4)' }}>
            <p className="font-heading font-bold text-white text-lg tracking-wide">
              ✨ All-in-One Stop Shop ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}