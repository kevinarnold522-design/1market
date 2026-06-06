import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFireTransition, FireOverlay } from './FireTransition';
import CategoryTransitionOverlay, { getTransitionTypeForHref } from '../transitions/CategoryTransitionOverlay';
import { useNavigate } from 'react-router-dom';
import { Plane, UtensilsCrossed, ShoppingBag, Home, Wrench, Briefcase } from 'lucide-react';

const CATEGORIES = [
  { label: 'Travel', href: '/travel', Icon: Plane, desc: 'Hotels, Tours & Transport', accent: '#60a5fa', suit: '♠', gradient: 'linear-gradient(135deg,#0f2050,#1d4ed8)' },
  { label: 'Food', href: '/food', Icon: UtensilsCrossed, desc: 'Restaurants, Cafes & Home Cooks', accent: '#f87171', suit: '♥', gradient: 'linear-gradient(135deg,#3b0000,#b91c1c)' },
  { label: 'Buy & Sell', href: '/buysell', Icon: ShoppingBag, desc: 'Shoes, Cars, Gadgets & More', accent: '#c084fc', suit: '♦', gradient: 'linear-gradient(135deg,#1e0050,#7e22ce)' },
  { label: 'Rent & Lease', href: '/rent', Icon: Home, desc: 'Homes, Vehicles & Equipment', accent: '#4ade80', suit: '♣', gradient: 'linear-gradient(135deg,#002a00,#15803d)' },
  { label: 'Services', href: '/services', Icon: Wrench, desc: 'Plumbers, Tutors & Freelancers', accent: '#fb923c', suit: '♠', gradient: 'linear-gradient(135deg,#2a1000,#c2410c)' },
  { label: 'Jobs', href: '/jobs', Icon: Briefcase, desc: 'Hiring, Freelance & Remote Work', accent: '#fbbf24', suit: '♦', gradient: 'linear-gradient(135deg,#1a1000,#b45309)' },
];

const CARD_VALUES = ['A', 'K', 'Q', 'J', '10', '9'];

function CasinoCategoryCard({ cat, index, onFire }) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardIdx, setCardIdx] = useState(index % CARD_VALUES.length);
  const isRed = cat.suit === '♥' || cat.suit === '♦';

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % CARD_VALUES.length), 800);
    return () => clearInterval(t);
  }, []);

  const calcTilt = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({ x: ((clientY - cy) / (rect.height / 2)) * -8, y: ((clientX - cx) / (rect.width / 2)) * 8 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });
  const { Icon } = cat;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{ perspective: '700px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => { setFlipped(false); reset(); }}
      onMouseMove={e => calcTilt(e.clientX, e.clientY)}
      onTouchStart={() => setFlipped(true)}
      onTouchEnd={() => { setFlipped(false); reset(); }}
    >
      <button onClick={() => onFire(cat.href)} className="block w-full text-left">
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            transform: `perspective(700px) rotateY(${flipped ? 180 : tilt.y}deg) rotateX(${tilt.x}deg)`,
            transition: flipped ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.1s ease',
            aspectRatio: '1 / 1.1',
            position: 'relative',
          }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', background: cat.gradient,
              border: `1.5px solid ${cat.accent}44`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${cat.accent}22`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2.5 text-[9px] font-black leading-none" style={{ color: cat.accent }}>
              <div>{CARD_VALUES[cardIdx]}</div>
              <div>{cat.suit}</div>
            </div>
            <div className="absolute bottom-2 right-2.5 text-[9px] font-black leading-none rotate-180" style={{ color: cat.accent }}>
              <div>{CARD_VALUES[cardIdx]}</div>
              <div>{cat.suit}</div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
              <div className="mb-3 p-3 rounded-2xl" style={{ background: `${cat.accent}22` }}>
                <Icon className="w-9 h-9 drop-shadow-lg" style={{ color: cat.accent }} />
              </div>
              <p className="font-heading font-bold text-lg text-white leading-tight">{cat.label}</p>
              <p className="font-body text-xs mt-1.5 text-white/70 leading-snug">{cat.desc}</p>
            </div>
          </div>

          {/* BACK — casino */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg,#0f172a,#1e1b4b)',
              border: `1.5px solid ${cat.accent}88`,
              boxShadow: `0 0 30px 8px ${cat.accent}33`,
            }}
          >
            <div className="absolute inset-1 rounded-xl border border-white/5"
              style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 2px,transparent 2px,transparent 10px)' }} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <AnimatePresence mode="wait">
                <motion.div key={cardIdx}
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="text-center"
                >
                  <p className="font-heading font-black text-5xl text-white drop-shadow-lg">{CARD_VALUES[cardIdx]}</p>
                  <p className="text-2xl" style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{cat.suit}</p>
                </motion.div>
              </AnimatePresence>
              <p className="font-body text-xs font-bold text-white/60 mt-1">{cat.label}</p>
              <p className="font-body text-[10px] text-white/30">Tap to explore</p>
            </div>
            {['tl', 'br'].map(pos => (
              <div key={pos} className={`absolute ${pos === 'tl' ? 'top-2 left-3' : 'bottom-2 right-3 rotate-180'}`}>
                <p className="font-heading font-black text-xs" style={{ color: cat.accent }}>{CARD_VALUES[cardIdx]}</p>
                <p className="text-xs" style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{cat.suit}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

export default function CategoryCards() {
  const { firing, fireNavigate } = useFireTransition();
  const navigate = useNavigate();
  const [transition, setTransition] = useState(null);

  const handleCategoryClick = (href) => {
    const type = getTransitionTypeForHref(href);
    if (type) {
      setTransition(type);
      setTimeout(() => { navigate(href); setTransition(null); }, 1100);
    } else {
      fireNavigate(href);
    }
  };

  return (
    <>
      <FireOverlay firing={firing} />
      <CategoryTransitionOverlay type={transition} subtype={null} />
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">Explore 1Marketph.com</span>
          <h2 className="font-heading font-bold text-3xl text-[#0A192F] mt-1">Browse by Category</h2>
          <p className="font-body text-xs text-[#0A192F]/40 mt-1">Hover to flip • Click to explore</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map((cat, i) => (
            <CasinoCategoryCard key={cat.label} cat={cat} index={i} onFire={handleCategoryClick} />
          ))}
        </div>
      </section>
    </>
  );
}