import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// -style double heart (heart inside heart) in blue, covers image then fades
export default function DoubleHeartAnimation({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ background: 'rgba(30,80,200,0.45)', backdropFilter: 'blur(2px)' }}
        >
          {/* Outer heart */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
            transition={{ duration: 0.7, repeat: 1 }}
            style={{ position: 'relative', width: 90, height: 90 }}
          >
            <svg viewBox="0 0 100 90" width="90" height="90" style={{ filter: 'drop-shadow(0 0 18px #2563ebcc)' }}>
              <path
                d="M50 85 C20 65 5 50 5 30 C5 15 18 5 30 5 C38 5 45 10 50 18 C55 10 62 5 70 5 C82 5 95 15 95 30 C95 50 80 65 50 85Z"
                fill="#1d4ed8"
                stroke="#60a5fa"
                strokeWidth="2.5"
              />
            </svg>
            {/* Inner heart */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <svg viewBox="0 0 100 90" width="44" height="44" style={{ filter: 'drop-shadow(0 0 8px #93c5fdcc)' }}>
                <path
                  d="M50 85 C20 65 5 50 5 30 C5 15 18 5 30 5 C38 5 45 10 50 18 C55 10 62 5 70 5 C82 5 95 15 95 30 C95 50 80 65 50 85Z"
                  fill="#93c5fd"
                  stroke="#dbeafe"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}