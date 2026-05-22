import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeSplash() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('1market_welcome_seen');
    if (!seen) {
      setVisible(true);
      sessionStorage.setItem('1market_welcome_seen', '1');
      const timer = setTimeout(() => setDismissed(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0A192F]"
          onClick={() => setDismissed(true)}
        >
          {/* Animated background rings */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#00D4FF]/10"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: `${(i + 1) * 20}vw`, height: `${(i + 1) * 20}vw`, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 1.2, ease: 'easeOut' }}
            />
          ))}

          {/* Glow blob */}
          <motion.div
            className="absolute w-[40vw] h-[40vw] rounded-full bg-[#2563EB]/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[20vw] h-[20vw] rounded-full bg-[#00D4FF]/20 blur-2xl"
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.6, 0.3, 0.6], x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 rounded-2xl bg-[#00D4FF] flex items-center justify-center shadow-2xl shadow-[#00D4FF]/40"
            >
              <span className="font-heading font-black text-[#0A192F] text-4xl sm:text-5xl">1</span>
            </motion.div>

            {/* Main text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <p className="font-body text-sm sm:text-base tracking-[0.3em] uppercase text-[#00D4FF] mb-2">
                Welcome to
              </p>
              <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-8xl text-white leading-none mb-2">
                1Marketph
              </h1>
              <span className="font-heading font-bold text-2xl sm:text-4xl text-[#00D4FF]">.com</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="font-body text-sm sm:text-lg text-white/50 mt-4 max-w-sm mx-auto"
            >
              1 Community · 1 Mindset · 1 Goal
            </motion.p>

            {/* Animated lines */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="h-[2px] bg-gradient-to-r from-[#00D4FF] to-[#2563EB] mx-auto mt-6"
            />

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="font-body text-xs text-white/20 mt-8"
            >
              Tap anywhere to continue
            </motion.p>
          </div>

          {/* Particle dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`p${i}`}
              className="absolute w-1 h-1 rounded-full bg-[#00D4FF]"
              initial={{ x: '50vw', y: '50vh', opacity: 0 }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: [0, 1, 0],
              }}
              transition={{ delay: 0.5 + Math.random(), duration: 2 + Math.random() * 2, repeat: Infinity, repeatDelay: Math.random() * 2 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}