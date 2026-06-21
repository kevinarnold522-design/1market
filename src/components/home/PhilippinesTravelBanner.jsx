import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Plane, MapPin } from 'lucide-react';
import { useAdDelay } from '@/hooks/useAdDelay';

const PH_TZ_OFFSET = 8; // UTC+8

function isProbablyOutsidePhilippines() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // Philippines timezone
    if (tz === 'Asia/Manila' || tz === 'Asia/Hong_Kong' || tz === 'Asia/Kuala_Lumpur') return false;
    // Check offset: if local UTC offset != +8, they're outside PH
    const offsetMinutes = new Date().getTimezoneOffset(); // negative for east
    return offsetMinutes !== -PH_TZ_OFFSET * 60;
  } catch {
    return false;
  }
}

const ISLANDS = ['AI️ Boracay', 'AI Mayon Volcano', 'AI Tubbataha Reef', 'AI️ Manila', 'AI El Nido', 'AI Chocolate Hills'];

export default function PhilippinesTravelBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const adsReady = useAdDelay();

  useEffect(() => {
    if (!adsReady) return;
    const alreadyDismissed = sessionStorage.getItem('ph_travel_banner_dismissed');
    if (!alreadyDismissed && isProbablyOutsidePhilippines()) {
      setTimeout(() => setShow(true), 500);
    }
  }, [adsReady]);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('ph_travel_banner_dismissed', '1');
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          style={{ background: 'rgba(7,14,26,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#0a192f,#0d3b8c)', border: '1.5px solid rgba(0,212,255,0.25)' }}
          >
            {/* Sky gradient top */}
            <div className="relative h-40 overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg,#0a1f5e 0%,#1565c0 50%,#26c6da 100%)' }}>
              {/* Stars */}
              {[...Array(18)].map((_, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  className="absolute rounded-full bg-white"
                  style={{ width: 2, height: 2, top: `${Math.random() * 60}%`, left: `${Math.random() * 100}%` }}
                />
              ))}
              {/* Plane swooping */}
              <motion.div
                initial={{ x: '-60vw', y: 10, rotate: -10 }}
                animate={{ x: '20vw', y: -10, rotate: -5 }}
                transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 3 }}
                className="text-5xl absolute"
                style={{ filter: 'drop-shadow(0 0 12px rgba(96,165,250,0.8))' }}
              >AI️</motion.div>
              {/* Sun/glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle,#fbbf24,transparent)', transform: 'translateX(-50%) translateY(50%)' }} />
              {/* Water */}
              <div className="absolute bottom-0 w-full h-10"
                style={{ background: 'linear-gradient(180deg,rgba(38,198,218,0.6),rgba(0,96,125,0.9))' }} />
              {/* Islands */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {['AI️','AI','AI️'].map((e, i) => (
                  <span key={i} className="text-2xl">{e}</span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇵🇭</span>
                <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Welcome, Traveler!</span>
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight mb-2">
                Travelling anywhere<br />in the <span style={{ color: '#00D4FF' }}>Philippines?</span>
              </h2>
              <p className="font-body text-sm text-white/50 mb-4 leading-relaxed">
                Discover hotels, local food, tours, rentals, and deals across the archipelago — all in one place.
              </p>

              {/* Scrolling island tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {ISLANDS.map((place, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="px-3 py-1 rounded-full font-body text-xs text-white/70 border border-white/15"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >{place}</motion.span>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to="/travel" onClick={dismiss}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#0891b2)', color: 'white' }}>
                  <Plane className="w-4 h-4" /> Explore Travel Deals
                </Link>
                <button onClick={dismiss}
                  className="px-4 py-3 rounded-xl border border-white/15 text-white/40 font-body text-sm hover:bg-white/5 transition-colors">
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}