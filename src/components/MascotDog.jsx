import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AlfieCharacter from './AlfieCharacter';

const MESSAGES_HOME = [
  "Hi! I'm Alfie, your 1Market PH buddy! 🐾",
  "Looking for great deals? I got you! 🛍️",
  "Mabuhay! Welcome to 1Market PH! 🇵🇭",
  "Tap my paw to say hi! 👋",
  "Double-tap me to see my dance moves! 💃",
  "Find the best local deals here! ✨",
  "Happy shopping, arf arf! 🎉",
];

const MESSAGES_LISTING = [
  "Ooh, nice listing! Check it out! 🏷️",
  "Great find! Want to know more? 🔍",
  "Woof! This looks like a deal! 💰",
];

const FIRST_VISIT_KEY = 'alfie_visited';

export default function MascotDog({ page = 'home' }) {
  const [mode, setMode] = useState('idle');
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const msgIndexRef = useRef(0);
  const modeTimerRef = useRef(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const messages = page === 'listing' ? MESSAGES_LISTING : MESSAGES_HOME;

  const setModeFor = (m, duration, msg) => {
    clearTimeout(modeTimerRef.current);
    setMode(m);
    if (msg) { setMessage(msg); setShowBubble(true); }
    modeTimerRef.current = setTimeout(() => {
      setMode('idle');
    }, duration);
  };

  // Entry wave for first-time and returning users
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem(FIRST_VISIT_KEY);
    sessionStorage.setItem(FIRST_VISIT_KEY, '1');

    const delay = isFirstVisit ? 800 : 400;
    const waveMsg = isFirstVisit
      ? "Hi! I'm Alfie! Welcome to 1Market PH! 🐾👋"
      : "Hey, you're back! Great to see you! 👋🐾";

    const t = setTimeout(() => {
      setModeFor('wave', 2500, waveMsg);
    }, delay);
    return () => clearTimeout(t);
  }, []);

  // Listing page entry — wave with deal message
  useEffect(() => {
    if (page === 'listing') {
      const t = setTimeout(() => {
        setModeFor('wave', 2500, "Woof! Let me know if you need help! 🏷️");
      }, 600);
      return () => clearTimeout(t);
    }
  }, [page]);

  // Rotate talk messages every 6s
  useEffect(() => {
    if (dismissed) return;
    const iv = setInterval(() => {
      if (mode !== 'dance' && mode !== 'wave') {
        msgIndexRef.current = (msgIndexRef.current + 1) % messages.length;
        const msg = messages[msgIndexRef.current];
        setMessage(msg);
        setShowBubble(true);
        setModeFor('talk', 2200);
      }
    }, 6000);
    return () => clearInterval(iv);
  }, [dismissed, mode, messages]);

  const handleTap = () => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      const count = tapCountRef.current;
      tapCountRef.current = 0;
      if (count >= 2) {
        setModeFor('dance', 3600, "Watch me bust a move! 🕺🐾");
      } else {
        setModeFor('wave', 2200, "Arf arf! Hi there! 🐾👋");
      }
    }, 300);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[990] flex flex-col items-center gap-2 select-none">

      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative max-w-[170px]"
          >
            <div
              className="px-3 py-2 rounded-2xl rounded-br-sm text-[11px] font-bold text-[#0A192F] leading-snug shadow-xl"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', border: '2px solid rgba(255,215,0,0.4)' }}>
              {message}
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-1.5 right-4 w-0 h-0"
              style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #FFA500' }} />
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow">
              <X className="w-2.5 h-2.5 text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alfie character — tappable */}
      <motion.div
        initial={{ x: 80, opacity: 0, scale: 0.6 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.3 }}
        onClick={handleTap}
        className="cursor-pointer"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,51,204,0.5))' }}
      >
        <AlfieCharacter mode={mode} />
      </motion.div>

      {/* Hint */}
      <div className="text-[8px] font-bold text-white/25 -mt-1">tap · double-tap</div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="text-[9px] text-white/20 hover:text-white/50 transition-colors mt-0.5">
        hide Alfie
      </button>
    </div>
  );
}