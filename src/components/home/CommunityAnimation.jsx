import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ICONS = [
  { emoji: '🏪', label: 'Business', delay: 0 },
  { emoji: '👤', label: 'Buyer', delay: 0.3 },
  { emoji: '📞', label: 'Connect', delay: 0.6 },
  { emoji: '💵', label: 'Cash In', delay: 0.9 },
  { emoji: '⭐', label: 'Review', delay: 1.2 },
  { emoji: '🎉', label: 'Done!', delay: 1.5 },
];

const FLOW_LABELS = [
  { from: '🏪', to: '👤', label: 'lists on 1Market' },
  { from: '👤', to: '📞', label: 'buyer contacts' },
  { from: '📞', to: '💵', label: 'deal confirmed' },
  { from: '💵', to: '⭐', label: 'payment & rate' },
];

export default function CommunityAnimation() {
  return (
    <section className="py-14 bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">How It Works</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0A192F] mt-1 mb-10">
            From Listing to Done — in 4 Simple Steps
          </h2>
        </motion.div>

        {/* Flow animation */}
        <div className="relative flex items-center justify-center gap-0 flex-wrap sm:flex-nowrap">
          {ICONS.map((icon, i) => (
            <React.Fragment key={icon.emoji}>
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: icon.delay, type: 'spring', stiffness: 200, damping: 15 }}
                className="flex flex-col items-center gap-2 z-10"
              >
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, delay: icon.delay, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg border border-[#0A192F]/5 flex items-center justify-center text-3xl sm:text-4xl"
                  style={{ boxShadow: '0 8px 32px rgba(0,212,255,0.10)' }}
                >
                  {icon.emoji}
                </motion.div>
                <p className="font-body text-[10px] font-semibold text-[#0A192F]/50">{icon.label}</p>
              </motion.div>

              {/* Arrow connector */}
              {i < ICONS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: icon.delay + 0.2, duration: 0.4 }}
                  className="flex-1 hidden sm:flex items-center justify-center origin-left"
                >
                  <div className="h-0.5 w-full bg-gradient-to-r from-[#00D4FF]/40 to-[#2563EB]/40 relative">
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, delay: icon.delay + 0.3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step labels */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FLOW_LABELS.map((fl, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white rounded-xl p-3 border border-[#0A192F]/5 shadow-sm text-left"
            >
              <p className="font-body text-xs font-bold text-[#2563EB] mb-0.5">Step {i + 1}</p>
              <p className="font-body text-xs text-[#0A192F]/70">{fl.from} → {fl.to}</p>
              <p className="font-body text-[10px] text-[#0A192F]/40 mt-0.5">{fl.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Floating cash/call particles */}
        <div className="relative h-16 mt-6 overflow-hidden">
          {['💰', '📲', '🤝', '💳', '📦', '⭐', '💵', '📞'].map((e, i) => (
            <motion.span
              key={i}
              animate={{
                y: [20, -60],
                x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 8)],
                opacity: [0, 1, 0],
                scale: [0.6, 1.1, 0.6],
              }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
              className="absolute text-xl"
              style={{ left: `${10 + i * 10}%` }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}