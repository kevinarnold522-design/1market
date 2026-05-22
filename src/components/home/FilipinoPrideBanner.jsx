import React from 'react';
import { motion } from 'framer-motion';

export default function FilipinoPrideBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full bg-gradient-to-r from-[#0038A8] via-[#CE1126] to-[#FCD116] relative overflow-hidden"
      style={{ minHeight: '36px' }}
    >
      {/* Philippine sun rays subtle overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2 flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lg"
        >🇵🇭</motion.span>
        <p className="font-body text-xs sm:text-sm font-bold text-white text-center drop-shadow">
          Proud Filipino Business · Humbly Growing Thanks to You, Kabayan!
        </p>
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="text-lg"
        >🇵🇭</motion.span>
      </div>
    </motion.div>
  );
}