import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FIRE_PARTICLES = 24;

export function useFireTransition() {
  const [firing, setFiring] = useState(false);
  const [target, setTarget] = useState(null);
  const navigate = useNavigate();

  const fireNavigate = useCallback((href) => {
    setTarget(href);
    setFiring(true);
  }, []);

  useEffect(() => {
    if (firing && target) {
      const t = setTimeout(() => {
        navigate(target);
        setFiring(false);
        setTarget(null);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [firing, target, navigate]);

  return { firing, fireNavigate };
}

export function FireOverlay({ firing }) {
  return (
    <AnimatePresence>
      {firing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, rgba(10,25,47,0.85) 100%)' }}
        >
          {/* Splash rings */}
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: i * 4, opacity: 0 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                width: '80px', height: '80px',
                background: `radial-gradient(circle, rgba(255,${200 - i*40},0,0.6) 0%, transparent 70%)`,
              }}
            />
          ))}

          {/* Fire particles */}
          {Array.from({ length: FIRE_PARTICLES }).map((_, i) => {
            const angle = (i / FIRE_PARTICLES) * 360;
            const dist = 80 + Math.random() * 120;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(rad) * dist,
                  y: Math.sin(rad) * dist,
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{ duration: 0.65, delay: Math.random() * 0.1, ease: 'easeOut' }}
                className="absolute text-lg"
                style={{ fontSize: `${10 + Math.random() * 14}px` }}
              >
                {['🔥', '✨', '💥', '⚡'][i % 4]}
              </motion.div>
            );
          })}

          {/* Center flash */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,220,0,0.9) 0%, rgba(255,100,0,0.5) 50%, transparent 70%)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}