import React from 'react';
import { motion } from 'framer-motion';

const bubbles = Array.from({ length: 54 }, (_, index) => ({
  size: 6 + index,
  left: `${(index * 7) % 98}%`,
  delay: (index % 18) * 0.35,
  duration: 8 + (index % 14),
}));

export default function BubbleBackground() {
  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-white/45 bg-white/12 shadow-[inset_0_1px_8px_rgba(255,255,255,0.55),0_0_18px_rgba(186,230,253,0.25)] backdrop-blur-[1px]"
          style={{ width: bubble.size, height: bubble.size, left: bubble.left, bottom: -bubble.size }}
          animate={{
            y: ['0vh', '-115vh'],
            x: [0, index % 2 === 0 ? 24 : -24, index % 3 === 0 ? -14 : 14, 0],
            opacity: [0, 0.75, 0.55, 0],
            scale: [0.75, 1, 1.15, 0.9],
          }}
          transition={{ duration: bubble.duration, delay: bubble.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}