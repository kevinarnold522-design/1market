import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AlfieCharacter from './AlfieCharacter';

// ─── Page-context config ─────────────────────────────────────────────────────
const PAGE_CONFIG = {
  home: {
    messages: [
      { text: "Welcome to 1MarketPH! 🐾", mode: 'wave' },
      { text: "Looking for great deals? I got you! 🛍️", mode: 'point' },
      { text: "What are you looking for today? 🤔", mode: 'think' },
      { text: "Find the best local deals here! ✨", mode: 'search' },
      { text: "Happy shopping, arf arf! 🎉", mode: 'jump' },
      { text: "Double-tap me to see my dance moves! 💃", mode: 'idle' },
    ],
    entryMode: 'wave',
    entryMsg: "Welcome to 1MarketPH! 🐾👋",
    returningMsg: "Hey, you're back! Great to see you! 👋🐾",
  },
  travel: {
    messages: [
      { text: "Book Your Next Adventure! ✈️", mode: 'travel' },
      { text: "Let's find it! 🔍", mode: 'search' },
      { text: "New Opportunities Available! 📣", mode: 'announce' },
    ],
    entryMode: 'travel',
    entryMsg: "Book Your Next Adventure! ✈️🌍",
  },
  food: {
    messages: [
      { text: "Hungry? Let me help! 🍜", mode: 'search' },
      { text: "What are you looking for today? 🤔", mode: 'think' },
      { text: "Great Choice! 👍", mode: 'thumbsup' },
    ],
    entryMode: 'wave',
    entryMsg: "Hungry? Find the best food deals! 🍜",
  },
  buysell: {
    messages: [
      { text: "Great Choice! 👍", mode: 'thumbsup' },
      { text: "List Now! 👉", mode: 'point' },
      { text: "Let's find it! 🔍", mode: 'search' },
      { text: "Cars for Rent & Sale! 🚗", mode: 'idle' },
    ],
    entryMode: 'point',
    entryMsg: "List Now & Reach Thousands! 👉",
  },
  jobs: {
    messages: [
      { text: "Find Your Next Opportunity! 💼", mode: 'thumbsup' },
      { text: "What are you looking for today? 🤔", mode: 'think' },
      { text: "Let's find it! 🔍", mode: 'search' },
    ],
    entryMode: 'thumbsup',
    entryMsg: "Find Your Next Opportunity! 💼",
  },
  rent: {
    messages: [
      { text: "Find Your Perfect Property! 🏠", mode: 'realestate' },
      { text: "Let's find it! 🔍", mode: 'search' },
      { text: "Great Choice! 👍", mode: 'thumbsup' },
    ],
    entryMode: 'realestate',
    entryMsg: "Find Your Perfect Property! 🏠",
  },
  success: {
    messages: [
      { text: "Your Listing is Live! 🎉", mode: 'jump' },
      { text: "Great Choice! 👍", mode: 'thumbsup' },
    ],
    entryMode: 'jump',
    entryMsg: "Your Listing is Live! 🎉🐾",
  },
  listing: {
    messages: [
      { text: "Great find! Want to know more? 🔍", mode: 'search' },
      { text: "Great Choice! 👍", mode: 'thumbsup' },
      { text: "Woof! This looks like a deal! 💰", mode: 'idle' },
    ],
    entryMode: 'wave',
    entryMsg: "Woof! Let me know if you need help! 🏷️",
  },
};

const FIRST_VISIT_KEY = 'alfie_visited';

// Duration per mode
const MODE_DURATION = {
  wave: 3000, thumbsup: 2500, point: 3000, jump: 3200,
  think: 4000, search: 4000, announce: 5000, travel: 4000,
  realestate: 4000, dance: 3600, talk: 2200,
};

export default function MascotDog({ page = 'home' }) {
  const cfg = PAGE_CONFIG[page] || PAGE_CONFIG.home;

  const [mode, setMode] = useState('idle');
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const msgIndexRef = useRef(0);
  const modeTimerRef = useRef(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const setModeFor = (m, msg, duration) => {
    clearTimeout(modeTimerRef.current);
    setMode(m);
    if (msg) { setMessage(msg); setShowBubble(true); }
    const dur = duration || MODE_DURATION[m] || 3000;
    modeTimerRef.current = setTimeout(() => setMode('idle'), dur);
  };

  // Entry animation
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem(FIRST_VISIT_KEY);
    if (page === 'home') sessionStorage.setItem(FIRST_VISIT_KEY, '1');

    const delay = isFirstVisit ? 800 : 500;
    const msg = (isFirstVisit || page !== 'home')
      ? cfg.entryMsg
      : cfg.returningMsg || cfg.entryMsg;

    const t = setTimeout(() => {
      setModeFor(cfg.entryMode || 'wave', msg);
    }, delay);
    return () => clearTimeout(t);
  }, [page]);

  // Rotate messages
  useEffect(() => {
    if (dismissed) return;
    const iv = setInterval(() => {
      if (mode === 'idle') {
        const next = (msgIndexRef.current + 1) % cfg.messages.length;
        msgIndexRef.current = next;
        const item = cfg.messages[next];
        setModeFor(item.mode, item.text);
      }
    }, 7000);
    return () => clearInterval(iv);
  }, [dismissed, mode, cfg.messages]);

  const handleTap = () => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      const count = tapCountRef.current;
      tapCountRef.current = 0;
      if (count >= 2) {
        setModeFor('dance', "Watch me bust a move! 🕺🐾", 3600);
      } else {
        setModeFor('wave', "Arf arf! Hi there! 🐾👋", 2500);
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
            className="relative max-w-[175px]"
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

      {/* Alfie */}
      <motion.div
        initial={{ x: 80, opacity: 0, scale: 0.6 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.3 }}
        onClick={handleTap}
        className="cursor-pointer"
      >
        <AlfieCharacter mode={mode} />
      </motion.div>

      <div className="text-[8px] font-bold text-white/25 -mt-1">tap · double-tap</div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[9px] text-white/20 hover:text-white/50 transition-colors mt-0.5">
        hide Alfie
      </button>
    </div>
  );
}