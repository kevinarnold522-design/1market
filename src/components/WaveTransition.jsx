import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaveTransition({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.2 } }}
        >
          {/* Wave layers sweeping right-to-left */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-y-0 right-0"
              style={{
                width: '120vw',
                background: i === 0
                  ? 'linear-gradient(135deg, #0033CC, #1a3de8)'
                  : i === 1
                  ? 'linear-gradient(135deg, #001a80, #0033CC)'
                  : 'linear-gradient(135deg, #00D4FF22, #0033CC)',
                borderRadius: i === 0 ? '0 0 0 60%' : i === 1 ? '0 0 0 40%' : '0 0 0 80%',
              }}
              initial={{ x: '100%' }}
              animate={{ x: '-20%' }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
          {/* Royal blue full fill */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#0033CC' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.15 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}