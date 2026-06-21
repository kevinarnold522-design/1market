import React from 'react';
import { motion } from 'framer-motion';

const bubbles = [
  { size: 10, left: '5%', delay: 0, duration: 9 },
  { size: 18, left: '14%', delay: 1.2, duration: 12 },
  { size: 7, left: '22%', delay: 2.4, duration: 8 },
  { size: 28, left: '31%', delay: 0.8, duration: 14 },
  { size: 13, left: '39%', delay: 3.1, duration: 10 },
  { size: 36, left: '48%', delay: 1.7, duration: 16 },
  { size: 9, left: '57%', delay: 2.9, duration: 9 },
  { size: 22, left: '66%', delay: 0.4, duration: 13 },
  { size: 15, left: '74%', delay: 3.6, duration: 11 },
  { size: 42, left: '82%', delay: 1.1, duration: 18 },
  { size: 11, left: '91%', delay: 2.2, duration: 10 },
  { size: 31, left: '96%', delay: 4, duration: 15 },
  { size: 20, left: '9%', delay: 4.5, duration: 13 },
  { size: 6, left: '52%', delay: 5.2, duration: 8 },
  { size: 25, left: '70%', delay: 5.8, duration: 14 },
];

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