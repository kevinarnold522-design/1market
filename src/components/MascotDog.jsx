import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MESSAGES = [
  "Hi! I'm Markee, your 1Market PH buddy! 🐾",
  "Looking for great deals? I got you! 🛍️",
  "Welcome to 1Market Philippines! 🇵🇭",
  "Tap my paw to say hi! 👋",
  "Double tap me to see my moves! 💃",
  "Find the best local deals here! ✨",
  "Mabuhay! Happy shopping! 🎉",
];

const DOG_FRONT = "https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/9b708eac3_IMG_1945.jpg";

// CSS keyframes injected once
const STYLE = `
@keyframes mascot-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes mascot-wave {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-20deg); }
  40% { transform: rotate(20deg); }
  60% { transform: rotate(-15deg); }
  80% { transform: rotate(10deg); }
}
@keyframes mascot-dance {
  0%   { transform: rotate(0deg) scale(1) translateX(0); }
  10%  { transform: rotate(-12deg) scale(1.05) translateX(-6px); }
  20%  { transform: rotate(12deg) scale(1.05) translateX(6px); }
  30%  { transform: rotate(-10deg) scale(1.08) translateX(-4px); }
  40%  { transform: rotate(10deg) scale(1.08) translateX(4px); }
  50%  { transform: rotate(-8deg) scale(1.1) translateX(-3px); }
  60%  { transform: rotate(8deg) scale(1.1) translateX(3px); }
  70%  { transform: rotate(-6deg) scale(1.05) translateX(-2px); }
  80%  { transform: rotate(6deg) scale(1.05) translateX(2px); }
  90%  { transform: rotate(-3deg) scale(1) translateX(-1px); }
  100% { transform: rotate(0deg) scale(1) translateX(0); }
}
@keyframes mascot-talk {
  0%, 100% { transform: scaleY(1); }
  25% { transform: scaleY(0.92); }
  75% { transform: scaleY(1.05); }
}
@keyframes paw-wave {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-30deg) translateY(-8px); }
  75% { transform: rotate(20deg) translateY(-4px); }
}
@keyframes tail-wag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(20deg); }
}
@keyframes mascot-enter {
  0% { transform: translateX(120px) scale(0.5); opacity: 0; }
  60% { transform: translateX(-10px) scale(1.05); opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}
@keyframes bounce-in {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
`;

export default function MascotDog({ page = 'home' }) {
  const [animation, setAnimation] = useState('float'); // float | wave | dance | talk
  const [message, setMessage] = useState(MESSAGES[0]);
  const [showBubble, setShowBubble] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [entered, setEntered] = useState(false);
  const [pawWaving, setPawWaving] = useState(false);
  const msgIndexRef = useRef(0);
  const tapTimerRef = useRef(null);
  const tapCountRef = useRef(0);
  const animTimerRef = useRef(null);

  // Inject styles once
  useEffect(() => {
    if (!document.getElementById('mascot-styles')) {
      const el = document.createElement('style');
      el.id = 'mascot-styles';
      el.textContent = STYLE;
      document.head.appendChild(el);
    }
  }, []);

  // Entry animation
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Rotate messages while talking
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % MESSAGES.length;
      setMessage(MESSAGES[msgIndexRef.current]);
      setAnimation('talk');
      setShowBubble(true);
      const reset = setTimeout(() => setAnimation('float'), 2000);
      return () => clearTimeout(reset);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed]);

  // On page = listing, trigger wave entry
  useEffect(() => {
    if (page === 'listing') {
      setAnimation('wave');
      setMessage("Check out this listing! 🏷️");
      setShowBubble(true);
      const t = setTimeout(() => setAnimation('float'), 2500);
      return () => clearTimeout(t);
    }
  }, [page]);

  const triggerAnimation = (anim, duration = 2000) => {
    clearTimeout(animTimerRef.current);
    setAnimation(anim);
    animTimerRef.current = setTimeout(() => setAnimation('float'), duration);
  };

  const handleTap = () => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      if (tapCountRef.current >= 2) {
        // Double tap = dance
        triggerAnimation('dance', 3500);
        setMessage("Watch me dance! 🕺🐾");
        setShowBubble(true);
      } else {
        // Single tap = wave
        triggerAnimation('wave', 2000);
        setPawWaving(true);
        setMessage("Woof woof! Hi there! 🐾👋");
        setShowBubble(true);
        setTimeout(() => setPawWaving(false), 2000);
      }
      tapCountRef.current = 0;
    }, 280);
  };

  const handlePawClick = (e) => {
    e.stopPropagation();
    triggerAnimation('wave', 2000);
    setPawWaving(true);
    setMessage("Hey! You found my paw! 🐾👋");
    setShowBubble(true);
    setTimeout(() => setPawWaving(false), 2000);
  };

  if (dismissed) return null;

  const dogStyle = {
    animation: animation === 'float'
      ? 'mascot-float 3s ease-in-out infinite'
      : animation === 'wave'
      ? 'mascot-wave 0.4s ease-in-out 5'
      : animation === 'dance'
      ? 'mascot-dance 0.5s ease-in-out 7'
      : animation === 'talk'
      ? 'mascot-talk 0.3s ease-in-out 6'
      : 'mascot-float 3s ease-in-out infinite',
  };

  const containerAnim = entered
    ? { animation: 'none' }
    : { animation: 'mascot-enter 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' };

  return (
    <div
      className="fixed bottom-20 right-4 z-[999] flex flex-col items-end gap-2 select-none"
      style={containerAnim}>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative max-w-[180px] sm:max-w-[220px]">
            <div
              className="px-3 py-2 rounded-2xl rounded-br-sm text-xs font-body font-semibold text-[#0A192F] leading-tight shadow-xl"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', border: '2px solid rgba(255,215,0,0.5)' }}>
              {message}
            </div>
            {/* Bubble tail */}
            <div className="absolute bottom-0 right-3 w-0 h-0"
              style={{ borderLeft: '6px solid transparent', borderRight: '0px solid transparent', borderTop: '8px solid #FFA500' }} />
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <X className="w-2.5 h-2.5 text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dog Container */}
      <div className="relative" onClick={handleTap}>

        {/* Paw wave button (top-left of dog) */}
        <button
          onClick={handlePawClick}
          className="absolute -top-1 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-base hover:scale-125 transition-transform"
          title="Tap my paw!"
          style={{
            animation: pawWaving ? 'paw-wave 0.4s ease-in-out 4' : 'paw-wave 2s ease-in-out infinite',
          }}>
          🐾
        </button>

        {/* Dog image */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden cursor-pointer shadow-2xl border-2 border-[#FFD700]"
          style={{
            ...dogStyle,
            boxShadow: '0 8px 32px rgba(0,64,208,0.4), 0 0 0 3px rgba(255,215,0,0.3)',
            background: '#0033CC',
          }}>
          <img
            src={DOG_FRONT}
            alt="Markee - 1Market PH Mascot"
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
        </div>

        {/* Tap hint badge */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-body font-bold text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(90deg,#0033CC,#2563EB)', border: '1px solid rgba(255,255,255,0.2)' }}>
          Tap me! 🐶
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="text-[9px] font-body text-white/30 hover:text-white/60 transition-colors mt-1">
        hide mascot
      </button>
    </div>
  );
}