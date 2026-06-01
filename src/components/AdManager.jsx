import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const AD_DELAY_MS = 4 * 60 * 1000; // 4 minutes
const FREEZE_DURATION_MS = 4 * 60 * 1000; // 4 minutes freeze
const STORAGE_KEY = 'ad_freeze_until';

export default function AdManager() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check if ads are frozen
    const until = localStorage.getItem(STORAGE_KEY);
    if (until) {
      const remaining = parseInt(until) - Date.now();
      if (remaining > 0) {
        setFrozen(true);
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    base44.auth.me().then(u => {
      if (u?.role === 'admin' || u?.email === 'Kevinarnold522@gmail.com') {
        setIsAdmin(true);
        return;
      }
      // Start the 4-minute delay timer
      timerRef.current = setTimeout(() => {
        setShowAd(true);
      }, AD_DELAY_MS);
    }).catch(() => {
      timerRef.current = setTimeout(() => {
        setShowAd(true);
      }, AD_DELAY_MS);
    });

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Countdown timer for freeze
  useEffect(() => {
    if (frozen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1000), 1000);
      return () => clearTimeout(timer);
    } else if (frozen && timeLeft <= 0) {
      setFrozen(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [frozen, timeLeft]);

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const closeAd = () => {
    setShowAd(false);
    // Freeze ads for 4 minutes
    const freezeUntil = Date.now() + FREEZE_DURATION_MS;
    localStorage.setItem(STORAGE_KEY, freezeUntil.toString());
    setFrozen(true);
    setTimeLeft(FREEZE_DURATION_MS);
  };

  if (isAdmin) return null;
  if (!showAd && !frozen) return null;

  return (
    <>
      {/* Freeze Banner */}
      <AnimatePresence>
        {frozen && timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Banner */}
      <AnimatePresence>
        {showAd && !frozen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9000] w-[320px] sm:w-[400px] rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <span className="font-body text-[10px] text-white/30 uppercase tracking-wider">Sponsored</span>
              <button onClick={closeAd} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X className="w-3 h-3 text-white/60" />
              </button>
            </div>
            <div className="p-3">
              <div id="monetag-ad-slot" className="w-full min-h-[100px] flex items-center justify-center">
                <span className="font-body text-xs text-white/20">Advertisement</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}