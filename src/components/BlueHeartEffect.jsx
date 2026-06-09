import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wrap your heart button with this component.
 * When the button triggers onHeart(), shows a massive AI-style
 * blue lightning heart that fades out dramatically.
 */
export default function BlueHeartEffect({ children, onHeart }) {
  const [show, setShow] = useState(false);

  const trigger = useCallback(() => {
    setShow(true);
    if (onHeart) onHeart();
    setTimeout(() => setShow(false), 1400);
  }, [onHeart]);

  return (
    <>
      {/* Clone child with our trigger */}
      {React.cloneElement(React.Children.only(children), {
        onClick: (e) => {
          trigger();
          if (children.props.onClick) children.props.onClick(e);
        },
      })}

      <AnimatePresence>
        {show && (
          <motion.div
            key="blue-heart"
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.4, 1.1, 0.9], rotate: [0, 8, -4, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{ position: 'relative' }}
            >
              {/* Glow rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1 + i * 0.5, opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{
                    background: `radial-gradient(circle, rgba(0,122,255,${0.4 / i}) 0%, transparent 70%)`,
                  }}
                />
              ))}
              {/* SVG Heart with lightning blue gradient */}
              <svg viewBox="0 0 100 90" width="180" height="162" style={{ filter: 'drop-shadow(0 0 24px rgba(0,122,255,0.9)) drop-shadow(0 0 60px rgba(90,200,255,0.7))' }}>
                <defs>
                  <linearGradient id="heartBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="40%" stopColor="#007aff" />
                    <stop offset="100%" stopColor="#5e5ce6" />
                  </linearGradient>
                  <filter id="heartGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path
                  d="M50 85 C50 85 10 55 10 30 C10 16 20 6 35 6 C42 6 48 10 50 14 C52 10 58 6 65 6 C80 6 90 16 90 30 C90 55 50 85 50 85Z"
                  fill="url(#heartBlue)"
                  filter="url(#heartGlow)"
                />
                {/* Lightning bolt inside */}
                <path
                  d="M48 22 L40 45 L50 42 L44 68 L60 38 L50 41 L56 22Z"
                  fill="white"
                  opacity="0.85"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}