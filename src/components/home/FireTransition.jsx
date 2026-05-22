import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function useFireTransition() {
  const [firing, setFiring] = useState(false);
  const [target, setTarget] = useState('');
  const navigate = useNavigate();

  const fireNavigate = (href) => {
    if (firing) return;
    setTarget(href);
    setFiring(true);
    setTimeout(() => {
      navigate(href);
      setFiring(false);
    }, 900);
  };

  return { firing, fireNavigate };
}

const PAINT_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF',
  '#5856D6', '#AF52DE', '#FF2D55', '#00D4FF', '#30D158',
  '#FF6B35', '#A259FF', '#0AC8B9', '#FF6EB4',
];

function PaintDrop({ color, x, delay, size, angle }) {
  return (
    <motion.div
      initial={{ y: -80, x, scale: 0, opacity: 1 }}
      animate={{
        y: ['-10vh', '110vh'],
        x: [x, x + (Math.random() - 0.5) * 200],
        scale: [0, size, size * 0.7],
        opacity: [1, 1, 0],
        rotate: [0, angle],
      }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className="fixed pointer-events-none z-[999]"
      style={{ top: 0, left: 0 }}
    >
      {/* Paint blob */}
      <div
        style={{
          width: `${40 + size * 30}px`,
          height: `${50 + size * 40}px`,
          background: color,
          borderRadius: '50% 50% 60% 40% / 60% 40% 60% 40%',
          filter: 'blur(0.5px)',
          boxShadow: `0 0 20px ${color}88`,
        }}
      />
      {/* Splatter drips */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: delay + 0.1 + i * 0.05, duration: 0.3 }}
          style={{
            position: 'absolute',
            bottom: `-${15 + i * 8}px`,
            left: `${8 + i * 10}px`,
            width: `${4 + i * 2}px`,
            height: `${12 + i * 8}px`,
            background: color,
            borderRadius: '0 0 50% 50%',
          }}
        />
      ))}
    </motion.div>
  );
}

function SplatBurst({ x, y, color, delay }) {
  return (
    <>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 60 + Math.random() * 80;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={i}
            initial={{ x, y, scale: 0, opacity: 1 }}
            animate={{
              x: x + Math.cos(rad) * dist,
              y: y + Math.sin(rad) * dist,
              scale: [0, 1.2, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className="fixed pointer-events-none z-[1000]"
            style={{
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              background: color,
              borderRadius: '50%',
              filter: `blur(1px)`,
            }}
          />
        );
      })}
    </>
  );
}

export function FireOverlay({ firing }) {
  const drops = firing ? [...Array(28)].map((_, i) => ({
    id: i,
    color: PAINT_COLORS[i % PAINT_COLORS.length],
    x: (i / 28) * window.innerWidth - window.innerWidth / 2 + (Math.random() - 0.5) * 120,
    delay: i * 0.022,
    size: 0.8 + Math.random() * 1.2,
    angle: (Math.random() - 0.5) * 60,
  })) : [];

  const bursts = firing ? [...Array(8)].map((_, i) => ({
    id: i,
    color: PAINT_COLORS[(i * 2) % PAINT_COLORS.length],
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
    delay: i * 0.07,
  })) : [];

  return (
    <AnimatePresence>
      {firing && (
        <>
          {/* White flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.4, times: [0, 0.2, 1] }}
            className="fixed inset-0 z-[998] pointer-events-none bg-white"
          />
          {/* Paint drops falling */}
          {drops.map(d => <PaintDrop key={d.id} {...d} />)}
          {/* Splat bursts */}
          {bursts.map(b => <SplatBurst key={b.id} {...b} />)}
        </>
      )}
    </AnimatePresence>
  );
}