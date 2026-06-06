import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function AnimatedHeartButton({ liked, onToggle, size = 'md' }) {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleClick = () => {
    if (!liked) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }
    onToggle();
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
          liked
            ? 'bg-blue-500/20 border-2 border-blue-400 text-blue-400'
            : 'bg-white/80 border-2 border-white/30 text-gray-400 hover:border-blue-300 hover:text-blue-400'
        }`}
      >
        <Heart className={`w-1/2 h-1/2 ${liked ? 'fill-current' : ''}`} />
      </motion.button>

      {showAnimation && (
        <motion.div
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -20 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Heart className="w-full h-full text-blue-400 fill-current" />
        </motion.div>
      )}
    </div>
  );
}