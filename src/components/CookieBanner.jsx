import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check } from 'lucide-react';

const KEY = '1market_cookie_consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        setTimeout(() => setShow(true), 2000);
      }
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, 'accepted'); } catch {}
    setShow(false);
  };

  const decline = () => {
    try { localStorage.setItem(KEY, 'declined'); } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-[500] rounded-2xl p-4 shadow-2xl"
          style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFD700]/15 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="flex-1">
              <p className="font-heading font-bold text-xs text-white mb-0.5">We use cookies 🍪</p>
              <p className="font-body text-[10px] text-white/50 leading-relaxed">We use cookies to improve your experience, analyze traffic, and personalize content. By continuing, you agree to our Privacy Policy.</p>
              <div className="flex gap-2 mt-3">
                <button onClick={accept}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-[#0A192F] hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  <Check className="w-3 h-3" /> Accept
                </button>
                <button onClick={decline}
                  className="px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  Decline
                </button>
              </div>
            </div>
            <button onClick={decline} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}