import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ShieldOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Ads appear after 4 minutes on every session
const INITIAL_BLOCK_MS = 4 * 60 * 1000;
// After closing an ad, freeze for 4 more minutes
const FREEZE_DURATION_MS = 4 * 60 * 1000;
// Stagger delay between multiple ads (ms)
const STAGGER_MS = 8000;

const STORAGE_KEY = 'ad_freeze_until';
const BLOCK_KEY = 'ad_initial_block_until';

// Sanitize ad slot: remove any anchor tags that route away (fake link ads)
function sanitizeAdSlot(el) {
  if (!el) return;
  const anchors = el.querySelectorAll('a[href]');
  anchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    // Block any external redirect links
    if (href.startsWith('http') || href.startsWith('//')) {
      a.removeAttribute('href');
      a.style.pointerEvents = 'none';
      a.style.cursor = 'default';
    }
  });
  // Also block iframes that try to navigate
  const iframes = el.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  });
}

// Ad slot definitions — staggered, each shown at different times
const AD_SLOTS = [
  { id: 'ad-slot-1', label: 'Sponsored', position: 'bottom-right' },
  { id: 'ad-slot-2', label: 'Sponsored', position: 'bottom-left' },
];

export default function AdManager() {
  const [blocked, setBlocked] = useState(true); // start blocked
  const [frozen, setFrozen] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(0);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [visibleAds, setVisibleAds] = useState([]);
  const [adQueue, setAdQueue] = useState([]);
  const slotRefs = useRef({});
  const staggerRef = useRef(null);

  const isPrivilegedUser = useCallback(async () => {
    try {
      const u = await base44.auth.me();
      // Only admins are permanently exempt from ads
      return u?.role === 'admin' || u?.email === 'Kevinarnold522@gmail.com';
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const privileged = await isPrivilegedUser();
      if (privileged) return; // permanently blocked for admins/sellers

      const now = Date.now();

      // Check if in freeze period (after closing ad)
      const freezeUntil = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
      if (freezeUntil > now) {
        setFrozen(true);
        setFreezeTimeLeft(freezeUntil - now);
        return;
      }

      // Check / set initial 5-minute block
      let blockUntil = parseInt(localStorage.getItem(BLOCK_KEY) || '0');
      if (blockUntil <= now) {
        // Fresh visit — set new 5-min block
        blockUntil = now + INITIAL_BLOCK_MS;
        localStorage.setItem(BLOCK_KEY, blockUntil.toString());
      }

      const remaining = blockUntil - now;
      setBlocked(true);
      setBlockTimeLeft(remaining);

      // Schedule ads to start AFTER block period, staggered
      AD_SLOTS.forEach((slot, i) => {
        staggerRef.current = setTimeout(() => {
          setVisibleAds(prev => [...prev, slot.id]);
        }, remaining + i * STAGGER_MS + 1000);
      });
    };

    init();

    return () => {
      if (staggerRef.current) clearTimeout(staggerRef.current);
    };
  }, []);

  // Block countdown
  useEffect(() => {
    if (!blocked || blockTimeLeft <= 0) {
      if (blockTimeLeft <= 0) setBlocked(false);
      return;
    }
    const t = setTimeout(() => setBlockTimeLeft(v => v - 1000), 1000);
    return () => clearTimeout(t);
  }, [blocked, blockTimeLeft]);

  // Freeze countdown
  useEffect(() => {
    if (!frozen || freezeTimeLeft <= 0) {
      if (frozen && freezeTimeLeft <= 0) {
        setFrozen(false);
        localStorage.removeItem(STORAGE_KEY);
      }
      return;
    }
    const t = setTimeout(() => setFreezeTimeLeft(v => v - 1000), 1000);
    return () => clearTimeout(t);
  }, [frozen, freezeTimeLeft]);

  // Sanitize ad slots after they mount
  useEffect(() => {
    visibleAds.forEach(id => {
      const el = slotRefs.current[id];
      if (el) sanitizeAdSlot(el);
    });
  }, [visibleAds]);

  const closeAd = (id) => {
    setVisibleAds(prev => prev.filter(a => a !== id));
  };

  const closeAllAds = () => {
    setVisibleAds([]);
    // Freeze all ads for 5 minutes
    const freezeUntil = Date.now() + FREEZE_DURATION_MS;
    localStorage.setItem(STORAGE_KEY, freezeUntil.toString());
    setFrozen(true);
    setFreezeTimeLeft(FREEZE_DURATION_MS);
  };

  const formatTime = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const positionClass = (pos) => {
    if (pos === 'bottom-right') return 'bottom-24 right-4 sm:right-6';
    if (pos === 'bottom-left') return 'bottom-24 left-4 sm:left-6';
    return 'bottom-24 left-1/2 -translate-x-1/2';
  };

  // Don't render anything if blocked (initial period) — completely silent
  if (blocked && blockTimeLeft > 0) return null;

  return (
    <>
      {/* Freeze notice */}
      <AnimatePresence>
        {frozen && freezeTimeLeft > 0 && (
          <motion.div
            key="freeze-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2 px-4 py-2 rounded-2xl shadow-xl"
            style={{ background: 'rgba(13,31,60,0.95)', border: '1.5px solid rgba(0,212,255,0.35)', backdropFilter: 'blur(14px)' }}
          >
            <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="font-body text-xs font-bold text-white/80 whitespace-nowrap">
              Ads paused · {formatTime(freezeTimeLeft)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual Ad Slots */}
      <AnimatePresence>
        {visibleAds.map((id) => {
          const slot = AD_SLOTS.find(s => s.id === id);
          if (!slot) return null;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className={`fixed z-[8000] w-[280px] sm:w-[340px] rounded-2xl overflow-hidden shadow-2xl ${positionClass(slot.position)}`}
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.15)' }}
            >
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8">
                <span className="font-body text-[9px] text-white/25 uppercase tracking-wider">Sponsored</span>
                <button
                  onClick={() => closeAd(id)}
                  className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-3 h-3 text-white/50" />
                </button>
              </div>
              <div
                ref={el => { slotRefs.current[id] = el; }}
                className="p-3 min-h-[90px] flex items-center justify-center"
                onClick={e => {
                  // Block any click that tries to navigate away
                  const target = e.target.closest('a');
                  if (target) {
                    const href = target.getAttribute('href') || '';
                    if (href.startsWith('http') || href.startsWith('//')) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }
                }}
              >
                <div id={id} className="w-full">
                  <span className="font-body text-xs text-white/15">Advertisement</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Close All Ads Button — shown when any ad is visible */}
      <AnimatePresence>
        {visibleAds.length > 0 && (
          <motion.button
            key="close-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={closeAllAds}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9001] flex items-center gap-2 px-4 py-2 rounded-2xl font-body font-bold text-xs shadow-2xl transition-all hover:scale-105"
            style={{ background: 'rgba(239,68,68,0.9)', border: '1px solid rgba(239,68,68,0.5)', backdropFilter: 'blur(10px)', color: 'white' }}
          >
            <ShieldOff className="w-3.5 h-3.5" />
            Close All Ads · Pause {formatTime(FREEZE_DURATION_MS)}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}