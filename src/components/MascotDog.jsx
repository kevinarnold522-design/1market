import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import AlfieCharacter from './AlfieCharacter';

// Rich page messages by context
const PAGE_CONFIG = {
  home: {
    messages: [
      { text: "Welcome to 1MarketPH!  The #1 Filipino marketplace.", mode: 'wave' },
      { text: "Browse local food, travel, services & more! ️", mode: 'point' },
      { text: "Over 1,000+ listings from sellers across the Philippines! ", mode: 'announce' },
      { text: "Tap 'Signup' to create your free account! ", mode: 'point' },
      { text: "Looking for the best deals near you? I can help! ", mode: 'search' },
      { text: "1MarketPH — Buy, Sell & Connect across the Philippines 🇵🇭", mode: 'thumbsup' },
      { text: "New listings added every day! Don't miss out. ", mode: 'announce' },
      { text: "Sellers: List your products for FREE today! ", mode: 'point' },
    ],
    entryMode: 'wave',
    entryMsg: "Welcome to 1MarketPH!  I'm Alfie, your guide!",
    returningMsg: "Hey, welcome back! Great deals await you today! ",
  },
  travel: {
    messages: [
      { text: "Explore hotels, resorts & tour packages! ️", mode: 'travel' },
      { text: "Book budget hotels in Manila, Cavite & more! ", mode: 'search' },
      { text: "Looking for a vehicle rental for your trip? ", mode: 'point' },
      { text: "Find affordable tour packages for the family! ", mode: 'announce' },
      { text: "Compare hotel prices before booking! ", mode: 'think' },
      { text: "Domestic flights & packages available! ", mode: 'travel' },
      { text: "Click any listing to see full details & book! ", mode: 'point' },
    ],
    entryMode: 'travel',
    entryMsg: "Let's find your next adventure! ️",
  },
  food: {
    messages: [
      { text: "Find home-cooked meals, bakeries & carinderia near you! ", mode: 'search' },
      { text: "Order from trusted home kitchens in your area! ", mode: 'point' },
      { text: "Baked goods, lutong bahay, beverages & more! ", mode: 'announce' },
      { text: "Check allergen info before ordering! ️", mode: 'think' },
      { text: "Support local food businesses today! ️", mode: 'thumbsup' },
      { text: "New food listings updated daily! ️", mode: 'announce' },
    ],
    entryMode: 'wave',
    entryMsg: "Hungry? Find amazing local food here! ",
  },
  buysell: {
    messages: [
      { text: "Browse thousands of items from local sellers! ️", mode: 'search' },
      { text: "Electronics, fashion, furniture & more! ", mode: 'point' },
      { text: "Brand new & pre-loved items available! ", mode: 'announce' },
      { text: "Check item condition before buying! ", mode: 'think' },
      { text: "Message the seller directly for more details! ", mode: 'point' },
      { text: "List your own items for FREE! ", mode: 'thumbsup' },
      { text: "Cars, real estate, appliances & more! ", mode: 'announce' },
    ],
    entryMode: 'point',
    entryMsg: "Find great deals from local sellers! ️",
  },
  jobs: {
    messages: [
      { text: "Find jobs: full-time, part-time & WFH! ", mode: 'thumbsup' },
      { text: "Customer service, tech, healthcare & more! ", mode: 'point' },
      { text: "Check salary range & benefits before applying! ", mode: 'think' },
      { text: "Apply directly via the listing's contact info! ", mode: 'announce' },
      { text: "New job postings added every day! ", mode: 'search' },
      { text: "Hiring? Post a job listing for free! ", mode: 'point' },
    ],
    entryMode: 'thumbsup',
    entryMsg: "Your next job opportunity is here! ",
  },
  rent: {
    messages: [
      { text: "Find rooms, condos & houses for rent! ", mode: 'realestate' },
      { text: "Check furnished vs unfurnished & pet policies! ", mode: 'think' },
      { text: "Properties for rent, sale & lease available! ️", mode: 'announce' },
      { text: "Filter by city & area to find nearby listings! ", mode: 'search' },
      { text: "Contact the landlord directly via the listing! ", mode: 'point' },
      { text: "Pre-selling condos & ready-for-occupancy units! ", mode: 'realestate' },
    ],
    entryMode: 'realestate',
    entryMsg: "Find your perfect home or property! ",
  },
  services: {
    messages: [
      { text: "Find trusted service providers near you! ", mode: 'search' },
      { text: "Plumbing, electrical, cleaning & more! ", mode: 'point' },
      { text: "Check ratings & reviews before hiring! ⭐", mode: 'think' },
      { text: "Web dev, graphic design, VA services & more! ", mode: 'announce' },
      { text: "Ask for a quote directly from the provider! ", mode: 'point' },
      { text: "Verified partners get a blue badge ", mode: 'thumbsup' },
    ],
    entryMode: 'wave',
    entryMsg: "Find skilled service providers near you! ",
  },
  listing: {
    messages: [
      { text: "Check all photos before deciding! ", mode: 'search' },
      { text: "Read the full description carefully! ", mode: 'think' },
      { text: "Message the seller to ask questions! ", mode: 'point' },
      { text: "Check the seller's rating & reviews! ⭐", mode: 'thumbsup' },
      { text: "Save this listing to your favourites! ️", mode: 'wave' },
      { text: "Negotiate price by messaging the seller! ", mode: 'announce' },
    ],
    entryMode: 'wave',
    entryMsg: "Let me help you check this listing! ️",
  },
  profile: {
    messages: [
      { text: "Complete your profile for more trust! ", mode: 'point' },
      { text: "Add a profile photo to look more professional! ", mode: 'announce' },
      { text: "Set your Channel Name for public listings! ", mode: 'think' },
      { text: "Apply for Verified Partner for a blue badge! ", mode: 'thumbsup' },
      { text: "Upload your listings to start selling today! ", mode: 'point' },
    ],
    entryMode: 'wave',
    entryMsg: "Let me help you set up your profile! ",
  },
};

// Walkthrough steps
const WALKTHROUGHS = {
  customer: [
    { step: 1, text: "Step 1: Click 'Signup' & choose 'Customer' account type ️", mode: 'point' },
    { step: 2, text: "Step 2: Sign up with Google or your email ", mode: 'announce' },
    { step: 3, text: "Step 3: Browse categories: Food, Travel, Buy & Sell, Jobs! ️", mode: 'search' },
    { step: 4, text: "Step 4: Click any listing to see full details ", mode: 'think' },
    { step: 5, text: "Step 5: Message a seller directly from the listing! ", mode: 'point' },
    { step: 6, text: "Step 6: Save your favourites with the ️ heart button!", mode: 'thumbsup' },
    { step: 7, text: "You're all set! Happy shopping on 1MarketPH! ", mode: 'jump' },
  ],
  seller: [
    { step: 1, text: "Step 1: Click 'Signup' & choose 'Seller' account type ", mode: 'point' },
    { step: 2, text: "Step 2: Sign up & go to Profile → 'Become a Seller' ", mode: 'announce' },
    { step: 3, text: "Step 3: Set your Channel Name & location in Profile ", mode: 'think' },
    { step: 4, text: "Step 4: Click 'Post a Listing' to add your first item! ", mode: 'point' },
    { step: 5, text: "Step 5: Add photos, price, description & contact info! ", mode: 'search' },
    { step: 6, text: "Step 6: Submit for Admin Review — you'll get an email when approved! ️", mode: 'announce' },
    { step: 7, text: "Step 7: Apply for Verified Partner badge for more trust! ", mode: 'thumbsup' },
    { step: 8, text: "You're ready to sell on 1MarketPH! ", mode: 'jump' },
  ],
  business: [
    { step: 1, text: "Step 1: Click 'Signup' & register your Business Account ", mode: 'point' },
    { step: 2, text: "Step 2: Sign up & go to Profile → 'Register a Business' ", mode: 'announce' },
    { step: 3, text: "Step 3: Submit 3 documents: NBI Clearance, Business Reg. & ITR ", mode: 'think' },
    { step: 4, text: "Step 4: Wait for Admin approval (24-48 hrs) ⏳", mode: 'search' },
    { step: 5, text: "Step 5: Once approved, set your Business Name & profile! ", mode: 'point' },
    { step: 6, text: "Step 6: Post your products & services under your business name! ", mode: 'announce' },
    { step: 7, text: "Step 7: Your Verified  badge appears after document review! ", mode: 'thumbsup' },
    { step: 8, text: "Welcome to 1MarketPH Business! You're now a verified partner! ", mode: 'jump' },
  ],
};

const FIRST_VISIT_KEY = 'alfie_visited';
const ALFIE_POS_KEY = 'alfie_position';

const MODE_DURATION = {
  wave: 3500, thumbsup: 2500, point: 3200, jump: 3200,
  think: 4000, search: 4000, announce: 5000, travel: 4000,
  realestate: 4000, talk: 2200,
};

export default function MascotDog({ page = 'home', onGetStarted }) {
  const cfg = PAGE_CONFIG[page] || PAGE_CONFIG.home;

  const [mode, setMode] = useState('idle');
  const [message, setMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [walkthrough, setWalkthrough] = useState(null); // null | 'choose' | 'customer' | 'seller' | 'business'
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  const getSavedPos = () => {
    try {
      const saved = sessionStorage.getItem(ALFIE_POS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };
  const defaultPos = { x: window.innerWidth - 100, y: window.innerHeight - 220 };
  const [pos, setPos] = useState(() => getSavedPos() || defaultPos);
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const hasDragged = useRef(false);

  const msgIndexRef = useRef(0);
  const modeTimerRef = useRef(null);

  const setModeFor = (m, msg, duration) => {
    clearTimeout(modeTimerRef.current);
    setMode(m);
    if (msg) { setMessage(msg); setShowBubble(true); }
    const dur = duration || MODE_DURATION[m] || 3000;
    modeTimerRef.current = setTimeout(() => setMode('idle'), dur);
  };

  // Listen for "Signup" trigger from navbar
  useEffect(() => {
    const handler = () => {
      setDismissed(false);
      setTimeout(() => {
        setWalkthrough('choose');
        setModeFor('wave', "Great! Let me guide you! Who are you joining as? ", 99999);
      }, 600);
    };
    window.addEventListener('alfie-get-started', handler);
    return () => window.removeEventListener('alfie-get-started', handler);
  }, []);

  // Entry message
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem(FIRST_VISIT_KEY);
    if (page === 'home') sessionStorage.setItem(FIRST_VISIT_KEY, '1');
    const delay = isFirstVisit ? 800 : 500;
    const msg = (isFirstVisit || page !== 'home') ? cfg.entryMsg : cfg.returningMsg || cfg.entryMsg;
    const t = setTimeout(() => setModeFor(cfg.entryMode || 'wave', msg), delay);
    return () => clearTimeout(t);
  }, [page]);

  // Rotating messages
  useEffect(() => {
    if (dismissed || walkthrough) return;
    const iv = setInterval(() => {
      if (mode === 'idle') {
        const next = (msgIndexRef.current + 1) % cfg.messages.length;
        msgIndexRef.current = next;
        const item = cfg.messages[next];
        setModeFor(item.mode, item.text);
      }
    }, 8000);
    return () => clearInterval(iv);
  }, [dismissed, mode, cfg.messages, walkthrough]);

  // Viewport resize
  useEffect(() => {
    const onResize = () => {
      setPos(p => ({
        x: Math.min(p.x, window.innerWidth - 80),
        y: Math.min(p.y, window.innerHeight - 120),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const savePos = useCallback((p) => {
    try { sessionStorage.setItem(ALFIE_POS_KEY, JSON.stringify(p)); } catch {}
  }, []);

  const onPointerDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, elemX: pos.x, elemY: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
    const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStart.current.elemX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 120, dragStart.current.elemY + dy));
    const newPos = { x: newX, y: newY };
    setPos(newPos);
    savePos(newPos);
  };

  const onPointerUp = () => {
    const wasDrag = hasDragged.current;
    isDragging.current = false;
    if (!wasDrag) handleTap();
  };

  const handleTap = () => {
    if (walkthrough === 'choose' || walkthrough === 'customer' || walkthrough === 'seller' || walkthrough === 'business') return;
    // Single tap = helpful tip
    const tips = [
      "Need help? Tap me to start a walkthrough! ️",
      "I can guide you step by step! ",
      "Tap 'Guide Me' below to sign up! ",
    ];
    setModeFor('wave', tips[Math.floor(Math.random() * tips.length)], 3000);
  };

  // Walkthrough navigation
  const startWalkthrough = (type) => {
    setWalkthrough(type);
    setWalkthroughStep(0);
    const steps = WALKTHROUGHS[type];
    setModeFor(steps[0].mode, steps[0].text, 99999);
  };

  const nextStep = () => {
    const steps = WALKTHROUGHS[walkthrough];
    const next = walkthroughStep + 1;
    if (next >= steps.length) {
      setWalkthrough(null);
      setWalkthroughStep(0);
      setModeFor('jump', "You're all set! Enjoy 1MarketPH! ", 4000);
      return;
    }
    setWalkthroughStep(next);
    setModeFor(steps[next].mode, steps[next].text, 99999);
  };

  const prevStep = () => {
    const steps = WALKTHROUGHS[walkthrough];
    const prev = walkthroughStep - 1;
    if (prev < 0) return;
    setWalkthroughStep(prev);
    setModeFor(steps[prev].mode, steps[prev].text, 99999);
  };

  const endWalkthrough = () => {
    setWalkthrough(null);
    setWalkthroughStep(0);
    setModeFor('wave', "Anytime you need help, just tap me! ", 3000);
  };

  if (dismissed) return null;

  const bubbleAbove = pos.y > 200;
  const isInWalkthrough = walkthrough && walkthrough !== 'choose';
  const walkthroughSteps = isInWalkthrough ? WALKTHROUGHS[walkthrough] : [];

  return (
    <div
      className="fixed z-[990] select-none touch-none"
      style={{ left: pos.x, top: pos.y, width: 88 }}
    >
      <div className="flex flex-col items-center gap-1">
        {/* Bubble above */}
        <AnimatePresence>
          {showBubble && message && bubbleAbove && (
            <motion.div
              key={message}
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative -mb-1 pointer-events-auto"
              style={{ maxWidth: 200, marginLeft: -60 }}
            >
              <div className="px-3 py-2 rounded-2xl rounded-br-sm text-[11px] font-bold text-[#0A192F] leading-snug shadow-xl"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', border: '2px solid rgba(255,215,0,0.4)' }}>
                {message}
              </div>
              <div className="absolute -bottom-1.5 right-6 w-0 h-0"
                style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #FFA500' }} />
              <button
                onClick={e => { e.stopPropagation(); setShowBubble(false); }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow">
                <X className="w-2.5 h-2.5 text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Walkthrough type chooser */}
        <AnimatePresence>
          {walkthrough === 'choose' && bubbleAbove && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-auto -mb-1 rounded-2xl p-3 shadow-2xl"
              style={{ background: '#0D1F3C', border: '1.5px solid rgba(0,212,255,0.4)', maxWidth: 200, marginLeft: -70 }}
            >
              <p className="font-body text-[10px] font-bold text-[#00D4FF] mb-2 text-center"> I'll guide you! Who are you?</p>
              <div className="space-y-1.5">
                {[
                  { key: 'customer', label: '️ Customer', color: '#3b82f6' },
                  { key: 'seller', label: ' Seller', color: '#10b981' },
                  { key: 'business', label: ' Business Owner', color: '#8b5cf6' },
                ].map(opt => (
                  <button key={opt.key} onClick={() => startWalkthrough(opt.key)}
                    className="w-full px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white text-left flex items-center justify-between transition-all hover:scale-105"
                    style={{ background: `${opt.color}22`, border: `1px solid ${opt.color}44` }}>
                    {opt.label} <ChevronRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
                <button onClick={() => setWalkthrough(null)} className="w-full text-[9px] text-white/30 hover:text-white/60 mt-1">cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Walkthrough nav controls */}
        <AnimatePresence>
          {isInWalkthrough && bubbleAbove && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto -mb-1 rounded-xl px-2 py-1.5 shadow-xl flex items-center gap-1.5"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.25)', marginLeft: -60 }}
            >
              <span className="font-body text-[9px] text-white/40">{walkthroughStep + 1}/{walkthroughSteps.length}</span>
              <button onClick={prevStep} disabled={walkthroughStep === 0}
                className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-white/50 hover:text-white disabled:opacity-20 transition-colors">←</button>
              <button onClick={nextStep}
                className="px-2 py-0.5 rounded-lg text-[9px] font-bold text-[#0A192F] transition-all hover:scale-105"
                style={{ background: walkthroughStep === walkthroughSteps.length - 1 ? '#10b981' : '#00D4FF' }}>
                {walkthroughStep === walkthroughSteps.length - 1 ? 'Done ' : 'Next →'}
              </button>
              <button onClick={endWalkthrough} className="text-[8px] text-white/20 hover:text-white/50 transition-colors"></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alfie character — draggable */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="absolute -top-1 -right-1 z-20 w-5 h-5 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            title="Hide Alfie"
          >
            <X className="w-3 h-3 text-[#0A192F]" />
          </button>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          >
            <AlfieCharacter mode={mode} />
          </div>
        </div>

        {/* Bubble below when near top */}
        <AnimatePresence>
          {showBubble && message && !bubbleAbove && (
            <motion.div
              key={message + '_below'}
              initial={{ opacity: 0, scale: 0.7, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative pointer-events-auto"
              style={{ maxWidth: 200, marginLeft: -60 }}
            >
              <div className="px-3 py-2 rounded-2xl rounded-tr-sm text-[11px] font-bold text-[#0A192F] leading-snug shadow-xl"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', border: '2px solid rgba(255,215,0,0.4)' }}>
                {message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls row */}
        <div className="flex items-center gap-1.5">
          {!walkthrough && (
            <button
              onClick={() => setWalkthrough('choose')}
              className="font-body text-[8px] font-bold text-[#00D4FF]/60 hover:text-[#00D4FF] transition-colors whitespace-nowrap border border-[#00D4FF]/20 rounded-full px-1.5 py-0.5 hover:border-[#00D4FF]/40"
            >
              Guide Me
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-[8px] text-white/15 hover:text-white/40 transition-colors">
            hide
          </button>
        </div>
      </div>
    </div>
  );
}