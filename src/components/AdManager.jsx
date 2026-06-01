import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const AD_DELAY_MS = 4 * 60 * 1000; // 4 minutes
const USER_CLOSE_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes re-appear

export default function AdManager() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const closedAtRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role === 'admin' || u?.email === 'Kevinarnold522@gmail.com') {
        setIsAdmin(true);
        return; // admins never see ads
      }
      setIsLoggedIn(!!u);
      // Start the 4-minute delay timer
      timerRef.current = setTimeout(() => {
        setAdReady(true);
        setShowAd(true);
      }, AD_DELAY_MS);
    }).catch(() => {
      // Not logged in — still show ad after 4 min
      timerRef.current = setTimeout(() => {
        setAdReady(true);
        setShowAd(true);
      }, AD_DELAY_MS);
    });

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Re-show ad after 2 minutes for logged-in users
  useEffect(() => {
    if (!showAd && adReady && isLoggedIn && !isAdmin) {
      const t = setTimeout(() => setShowAd(true), USER_CLOSE_COOLDOWN_MS);
      return () => clearTimeout(t);
    }
  }, [showAd, adReady, isLoggedIn, isAdmin]);

  if (isAdmin || !showAd) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9000] w-[320px] sm:w-[400px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="font-body text-[10px] text-white/30 uppercase tracking-wider">Sponsored</span>
          <button
            onClick={() => { setShowAd(false); closedAtRef.current = Date.now(); }}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-3 h-3 text-white/60" />
          </button>
        </div>
        <div className="p-3">
          {/* Monetag ad slot — rendered as a div with the script injected */}
          <div id="monetag-ad-slot" className="w-full min-h-[100px] flex items-center justify-center">
            <span className="font-body text-xs text-white/20">Advertisement</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}