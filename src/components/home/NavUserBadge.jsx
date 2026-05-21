import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BADGES = [
  {
    label: 'Buyer',
    icon: '🛍️',
    color: 'from-[#2563EB] to-[#00D4FF]',
    textColor: 'text-white',
    desc: 'Smart Shopper',
  },
  {
    label: 'Seller',
    icon: '🏪',
    color: 'from-[#0A192F] to-[#2563EB]',
    textColor: 'text-white',
    desc: 'Local Business',
  },
];

export default function NavUserBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % BADGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const badge = BADGES[index];

  return (
    <div className="relative w-[110px] h-8 overflow-hidden flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.92 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`absolute flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} shadow-md`}
        >
          <span className="text-sm leading-none">{badge.icon}</span>
          <div>
            <p className={`font-heading font-bold text-[10px] leading-none ${badge.textColor}`}>{badge.label}</p>
            <p className={`font-body text-[8px] leading-none opacity-80 ${badge.textColor}`}>{badge.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}