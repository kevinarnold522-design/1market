import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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
  const [visibleAds, setVisibleAds] = useState([]);
  const slotRefs = useRef({});
  
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
      if (privileged) return; // admins don't see ads

      // Show HTML ad slots immediately (no blocking)
      setVisibleAds(AD_SLOTS.map(s => s.id));
    };

    init();
  }, []);

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

  const positionClass = (pos) => {
    if (pos === 'bottom-right') return 'bottom-24 right-4 sm:right-6';
    if (pos === 'bottom-left') return 'bottom-24 left-4 sm:left-6';
    return 'bottom-24 left-1/2 -translate-x-1/2';
  };

  return (
    <>
      {/* Individual Ad Slots - HTML Ad Codes */}
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
              >
                <div id={id} className="w-full">
                  <span className="font-body text-xs text-white/15">Advertisement</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}