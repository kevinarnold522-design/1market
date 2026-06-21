import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaveTransition({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.25 } }}
        >
          {/* Water-wave layers sweeping right → left */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-y-0"
              style={{
                right: 0,
                width: '130vw',
                background:
                  i === 0 ? 'linear-gradient(160deg,#00D4FF,#0033CC)' :
                  i === 1 ? 'linear-gradient(160deg,#001a80,#0044ee)' :
                  i === 2 ? 'linear-gradient(160deg,#0033CC,#001060)' :
                            'linear-gradient(160deg,#00D4FF18,#0033CC)',
                // Wavy left-edge using border-radius
                borderRadius: i === 0
                  ? '0 0 0 50% / 0 0 30% 70%'
                  : i === 1
                  ? '0 0 0 40% / 0 0 50% 50%'
                  : i === 2
                  ? '0 0 0 70% / 0 0 20% 80%'
                  : '0 0 0 55% / 0 0 40% 60%',
                opacity: i === 3 ? 0.5 : 1,
              }}
              initial={{ x: '105%' }}
              animate={{ x: '-5%' }}
              transition={{
                duration: 0.6,
                delay: i * 0.07,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}

          {/* Ripple rings from the right */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                right: -60,
                width: 300 + i * 120,
                height: 300 + i * 120,
                borderRadius: '50%',
                border: `2px solid rgba(0,212,255,${0.3 - i * 0.08})`,
                marginTop: -(150 + i * 60),
              }}
              initial={{ scale: 0.5, opacity: 0, x: 0 }}
              animate={{ scale: 1.8, opacity: [0, 0.6, 0], x: '-80vw' }}
              transition={{
                duration: 0.75,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Full fill */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg,#001a80,#0033CC)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.15 }}
          />

          {/* Logo flash in center */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.12 }}
          >
            <div className="flex items-center gap-3">
              <img
                src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2214%22 fill=%22%230033CC%22/%3E%3Ctext x=%2232%22 y=%2241%22 font-family=%22Arial%22 font-size=%2224%22 font-weight=%22700%22 text-anchor=%22middle%22 fill=%22white%22%3E1M%3C/text%3E%3C/svg%3E"
                alt="1MarketPH"
                className="w-10 h-10 rounded-xl object-cover"
                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.5)' }}
              />
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                1Market<span style={{ color: '#FFD700' }}>PH</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}