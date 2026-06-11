import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wrap your heart button with this component.
 * When the button triggers onHeart(), shows TWO massive blue hearts 
 * that cover the entire listing image and then disappear dramatically.
 */
export default function BlueHeartEffect({ children, onHeart }) {
  const [show, setShow] = useState(false);

  const trigger = useCallback(() => {
    setShow(true);
    if (onHeart) onHeart();
    setTimeout(() => setShow(false), 1600);
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
            key="blue-double-heart"
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ 
                scale: [0, 1.8, 1.3, 0.8], 
                rotate: [0, 12, -6, 0],
                y: [0, -50, -100, -150]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'relative' }}
            >
              {/* Massive glow rings */}
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1 + i * 0.6, opacity: 0 }}
                  transition={{ duration: 1.0, delay: i * 0.08 }}
                  style={{
                    background: `radial-gradient(circle, rgba(0,122,255,${0.35 / i}) 0%, transparent 70%)`,
                  }}
                />
              ))}
              
              {/* Double SVG Hearts - side by side */}
              <div className="relative" style={{ filter: 'drop-shadow(0 0 40px rgba(0,122,255,1)) drop-shadow(0 0 120px rgba(90,200,255,0.9))' }}>
                <svg viewBox="0 0 220 110" width="280" height="252">
                  <defs>
                    <linearGradient id="doubleHeartBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="40%" stopColor="#007aff" />
                      <stop offset="100%" stopColor="#5e5ce6" />
                    </linearGradient>
                    <filter id="doubleHeartGlow">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Left Heart */}
                  <path
                    d="M55 95 C55 95 10 60 10 32 C10 14 22 4 40 4 C48 4 55 9 55 14 C55 9 62 4 70 4 C88 4 100 14 100 32 C100 60 55 95 55 95Z"
                    fill="url(#doubleHeartBlue)"
                    filter="url(#doubleHeartGlow)"
                  />
                  
                  {/* Right Heart */}
                  <path
                    d="M115 95 C115 95 70 60 70 32 C70 14 82 4 100 4 C108 4 115 9 115 14 C115 9 122 4 130 4 C148 4 160 14 160 32 C160 60 115 95 115 95Z"
                    fill="url(#doubleHeartBlue)"
                    filter="url(#doubleHeartGlow)"
                  />
                  
                  {/* Lightning bolts inside both hearts */}
                  <path
                    d="M52 20 L42 50 L54 46 L46 78 L64 42 L54 46 L60 20Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path
                    d="M112 20 L102 50 L114 46 L106 78 L124 42 L114 46 L120 20Z"
                    fill="white"
                    opacity="0.9"
                  />
                  
                  {/* Sparkles around */}
                  <circle cx="20" cy="20" r="3" fill="white" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="25" r="2.5" fill="white" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.1;0.7" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="110" cy="10" r="2" fill="white" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="30" cy="80" r="2" fill="white" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="0.7s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="190" cy="75" r="2.5" fill="white" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}