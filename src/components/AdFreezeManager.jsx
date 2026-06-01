import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';

const FREEZE_DURATION = 4 * 60 * 1000; // 4 minutes in ms
const STORAGE_KEY = 'ad_freeze_until';

export default function AdFreezeManager() {
  const [frozen, setFrozen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkFreeze = () => {
      const until = localStorage.getItem(STORAGE_KEY);
      if (until) {
        const remaining = parseInt(until) - Date.now();
        if (remaining > 0) {
          setFrozen(true);
          setTimeLeft(remaining);
          setShowBanner(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setFrozen(false);
          setTimeLeft(0);
        }
      }
    };

    checkFreeze();
    const interval = setInterval(checkFreeze, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (frozen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1000), 1000);
      return () => clearTimeout(timer);
    } else if (frozen && timeLeft <= 0) {
      setFrozen(false);
      setShowBanner(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [frozen, timeLeft]);

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const closeBanner = () => setShowBanner(false);

  if (!frozen) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl"
          style={{
            background: 'rgba(13,31,60,0.95)',
            border: '1.5px solid rgba(0,212,255,0.4)',
            backdropFilter: 'blur(14px)'
          }}
        >
          <Clock className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-body text-xs font-bold text-white/90 whitespace-nowrap">
            Ads frozen for {formatTime(timeLeft)}
          </span>
          <button onClick={closeBanner} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <X className="w-3 h-3 text-white/50" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}