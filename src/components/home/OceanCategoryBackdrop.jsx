import React from 'react';
import { motion } from 'framer-motion';

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#facc15', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#38bdf8', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#fb7185', '#ffffff', '#fde68a', '#bbf7d0', '#bae6fd', '#c4b5fd', '#f9a8d4', '#ffedd5'
];

const fish = colors.map((color, i) => {
  const swimModes = ['cruiser', 'zigzag', 'floater', 'dart'];
  return {
    color,
    mode: swimModes[i % swimModes.length],
    top: `${20 + (i * 13) % 72}%`,
    left: `${(i * 17) % 95}%`,
    delay: (i % 10) * 0.32,
    duration: 7 + (i % 8) * 0.9,
    dir: i % 3 === 0 ? -1 : 1,
    vertical: i % 5 === 0,
    size: 0.17 + (i % 5) * 0.035,
    bubbleCount: 2 + (i % 3),
  };
});

function BubbleTrail({ item }) {
  return Array.from({ length: item.bubbleCount }).map((_, idx) => (
    <motion.span
      key={idx}
      className="absolute rounded-full border border-white/55 bg-white/20"
      style={{ width: 5 * item.size, height: 5 * item.size, left: -10 * item.size - idx * 8 * item.size, top: 8 * item.size + idx * 2 * item.size }}
      animate={{ y: [-2, -18, -30], x: [0, -4, -9], opacity: [0, 0.65, 0] }}
      transition={{ duration: 2.4 + idx * 0.3, repeat: Infinity, delay: item.delay + idx * 0.28, ease: 'easeOut' }}
    />
  ));
}

function TinyFish({ item, index }) {
  const horizontalStart = item.dir === 1 ? '-10vw' : '110vw';
  const horizontalEnd = item.dir === 1 ? '110vw' : '-10vw';
  const verticalStart = item.dir === 1 ? '110vh' : '-10vh';
  const verticalEnd = item.dir === 1 ? '-10vh' : '110vh';
  const yPath = item.mode === 'zigzag' ? [0, -18, 14, -8, 0] : item.mode === 'dart' ? [0, 5, -5, 0] : [0, -4, 3, 0];

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ top: item.vertical ? undefined : item.top, left: item.vertical ? item.left : undefined }}
      initial={item.vertical ? { y: verticalStart, scaleX: item.dir, rotate: item.dir === 1 ? -82 : 82, opacity: 0.85 } : { x: horizontalStart, scaleX: item.dir, opacity: 0.85 }}
      animate={item.vertical ? { y: verticalEnd, x: yPath } : { x: horizontalEnd, y: yPath }}
      transition={{ duration: item.duration, repeat: Infinity, ease: item.mode === 'dart' ? 'easeInOut' : 'linear', delay: item.delay }}
      aria-hidden="true"
    >
      <div className="relative" style={{ width: 64 * item.size, height: 28 * item.size }}>
        <BubbleTrail item={item} />
        <div
          className="absolute rounded-full"
          style={{
            left: 12 * item.size,
            top: 5 * item.size,
            width: 36 * item.size,
            height: 17 * item.size,
            borderRadius: item.mode === 'dart' ? '45% 60% 50% 45%' : '999px',
            background: `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.82))`,
            boxShadow: `0 0 ${10 * item.size}px ${item.color}77`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: 0,
            top: 7 * item.size,
            width: 0,
            height: 0,
            borderTop: `${7 * item.size}px solid transparent`,
            borderBottom: `${7 * item.size}px solid transparent`,
            borderRight: `${15 * item.size}px solid ${item.color}`,
          }}
        />
        <div className="absolute rounded-full bg-sky-950" style={{ right: 12 * item.size, top: 9 * item.size, width: 3 * item.size, height: 3 * item.size }} />
        <div className="absolute rounded-full bg-white/60" style={{ left: 27 * item.size, top: 8 * item.size, width: item.mode === 'floater' ? 16 * item.size : 12 * item.size, height: 3 * item.size }} />
        {index % 4 === 0 && <div className="absolute rounded-full bg-white/70" style={{ left: 22 * item.size, top: 15 * item.size, width: 5 * item.size, height: 2 * item.size }} />}
      </div>
    </motion.div>
  );
}

export default function OceanCategoryBackdrop({ global = false }) {
  return (
    <div className={global ? 'fixed inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800' : 'absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800'}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(96,165,250,0.58)_0%,rgba(37,99,235,0.62)_45%,rgba(29,78,216,0.78)_100%)]" />
      <div className="absolute top-8 right-10 w-20 h-20 rounded-full bg-yellow-200/70 blur-[1px] shadow-[0_0_38px_rgba(253,224,71,0.36)]" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-blue-900/70 via-blue-700/30 to-transparent" />
      <div className="absolute inset-x-[-8%] bottom-[12%] h-16 rounded-[50%] bg-white/22" />
      {fish.map((item, index) => <TinyFish key={index} item={item} index={index} />)}
    </div>
  );
}