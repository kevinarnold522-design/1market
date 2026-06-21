import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Waves, ShoppingBag, UtensilsCrossed, Home, Wrench, Briefcase, Sparkles } from 'lucide-react';

const configs = {
  travel: { color: '#FFD700', icons: [Plane, Waves, Sparkles], label: 'Travel animation' },
  food: { color: '#FFD700', icons: [UtensilsCrossed, Sparkles, UtensilsCrossed], label: 'Food animation' },
  buysell: { color: '#FFD700', icons: [ShoppingBag, Sparkles, ShoppingBag], label: 'Buy and sell animation' },
  rent: { color: '#FFD700', icons: [Home, Sparkles, Home], label: 'Rent animation' },
  services: { color: '#FFD700', icons: [Wrench, Sparkles, Wrench], label: 'Services animation' },
  jobs: { color: '#FFD700', icons: [Briefcase, Sparkles, Briefcase], label: 'Jobs animation' },
};

export default function CategoryCreationAnimation({ category }) {
  const cfg = configs[category] || configs.buysell;
  const [FirstIcon, SecondIcon, ThirdIcon] = cfg.icons;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-label={cfg.label}>
      <motion.div className="absolute top-20 left-[-80px]" animate={{ x: ['0vw', '115vw'], y: [0, -30, 15, -10] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <FirstIcon className="w-12 h-12 drop-shadow-xl" style={{ color: cfg.color }} />
      </motion.div>
      {category === 'travel' && (
        <motion.div className="absolute bottom-16 left-1/2 text-5xl drop-shadow-xl" animate={{ x: ['-35vw', '35vw'], y: [0, -18, 8, -10, 0], rotate: [-8, 6, -4, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          {'\uD83C\uDFC4\u200D\u2642\uFE0F'}
        </motion.div>
      )}
      <motion.div className="absolute right-10 top-32" animate={{ y: [0, -22, 0], rotate: [0, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <SecondIcon className="w-10 h-10" style={{ color: cfg.color }} />
      </motion.div>
      <motion.div className="absolute left-8 bottom-28" animate={{ scale: [1, 1.18, 1], rotate: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <ThirdIcon className="w-9 h-9" style={{ color: cfg.color }} />
      </motion.div>
    </div>
  );
}