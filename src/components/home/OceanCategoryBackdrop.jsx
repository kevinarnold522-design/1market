import React from 'react';
import { motion } from 'framer-motion';

const fish = [
  '#ef4444', '#f97316', '#f59e0b', '#facc15', '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#38bdf8', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#fb7185', '#ffffff', '#fde68a', '#bbf7d0', '#bae6fd', '#c4b5fd', '#f9a8d4', '#ffedd5'
].map((color, i) => ({
  color,
  top: `${54 + (i % 9) * 4.6}%`,
  delay: (i % 8) * 0.22,
  duration: 8 + (i % 7) * 0.7,
  dir: i % 2 === 0 ? 1 : -1,
  size: 0.16 + (i % 4) * 0.03,
}));

function TinyFish({ item, index }) {
  const start = item.dir === 1 ? '-8vw' : '108vw';
  const end = item.dir === 1 ? '108vw' : '-8vw';
  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ top: item.top }}
      initial={{ x: start, scaleX: item.dir, opacity: 0.85 }}
      animate={{ x: end, y: [0, -3, 2, 0] }}
      transition={{ duration: item.duration, repeat: Infinity, ease: 'linear', delay: item.delay }}
      aria-hidden="true"
    >
      <div className="relative" style={{ width: 64 * item.size, height: 28 * item.size }}>
        <div
          className="absolute rounded-full"
          style={{
            left: 12 * item.size,
            top: 5 * item.size,
            width: 36 * item.size,
            height: 17 * item.size,
            background: `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.82))`,
            boxShadow: `0 0 ${8 * item.size}px ${item.color}66`,
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
        <div
          className="absolute rounded-full bg-sky-950"
          style={{ right: 12 * item.size, top: 9 * item.size, width: 3 * item.size, height: 3 * item.size }}
        />
        <div
          className="absolute rounded-full bg-white/60"
          style={{ left: 27 * item.size, top: 8 * item.size, width: 12 * item.size, height: 3 * item.size }}
        />
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