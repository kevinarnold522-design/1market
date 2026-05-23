import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Airplane transition for Travel
function AirplaneTransition() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(135deg,#0a192f,#1d4ed8)' }}>
      {/* Sky streaks */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          initial={{ x: '-100vw', opacity: 0.6 }}
          animate={{ x: '120vw', opacity: 0 }}
          transition={{ duration: 0.8 + i * 0.05, delay: i * 0.04, ease: 'easeIn' }}
          className="absolute h-0.5 rounded-full"
          style={{
            top: `${15 + i * 10}%`,
            width: `${60 + i * 10}px`,
            background: 'rgba(255,255,255,0.3)',
          }}
        />
      ))}

      {/* Cloud puffs */}
      {[
        { top: '20%', size: 80, delay: 0.1 },
        { top: '60%', size: 60, delay: 0.25 },
        { top: '40%', size: 100, delay: 0.05 },
      ].map((c, i) => (
        <motion.div key={i}
          initial={{ x: '120vw' }}
          animate={{ x: '-20vw' }}
          transition={{ duration: 1.2, delay: c.delay, ease: 'linear' }}
          className="absolute rounded-full bg-white/15"
          style={{ top: c.top, width: c.size, height: c.size * 0.5 }}
        />
      ))}

      {/* Airplane emoji soaring across */}
      <motion.div
        initial={{ x: '-15vw', y: '8vh', rotate: 0 }}
        animate={{ x: '110vw', y: '-8vh', rotate: -8 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="text-7xl drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 20px rgba(96,165,250,0.8))' }}
      >
        ✈️
      </motion.div>

      {/* Destination label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.3, 0.7, 1] }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-heading font-bold text-2xl text-white drop-shadow-lg">Discover the Philippines ✈️</p>
        <p className="font-body text-sm text-white/60 mt-1">Loading travel...</p>
      </motion.div>
    </div>
  );
}

// Food icons transition
const FOOD_ICONS = ['🍗', '🍔', '🍕', '🌮', '🍜', '🥘', '🍱', '🧋', '🍦', '🦞', '☕', '🎂'];

function FoodTransition() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(135deg,#3b0000,#7f1d1d)' }}>
      {/* Flying food icons */}
      {FOOD_ICONS.map((icon, i) => (
        <motion.div key={i}
          initial={{
            x: `${(i % 4) * 25}vw`,
            y: '110vh',
            rotate: Math.random() * 40 - 20,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            y: '-20vh',
            rotate: Math.random() * 60 - 30,
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.0,
            delay: i * 0.06,
            ease: 'easeOut',
          }}
          className="absolute text-5xl"
          style={{ left: `${(i % 6) * 17 + 2}%` }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Center label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.05, 1, 0.9] }}
        transition={{ duration: 1.1, times: [0, 0.25, 0.7, 1] }}
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-heading font-bold text-2xl text-white drop-shadow-lg">What are you craving? 🍽️</p>
        <p className="font-body text-sm text-white/60 mt-1">Loading food directory...</p>
      </motion.div>
    </div>
  );
}

export default function CategoryTransitionOverlay({ type }) {
  return (
    <AnimatePresence>
      {type === 'travel' && (
        <motion.div key="travel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <AirplaneTransition />
        </motion.div>
      )}
      {type === 'food' && (
        <motion.div key="food" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <FoodTransition />
        </motion.div>
      )}
    </AnimatePresence>
  );
}