import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { label: 'Travel', href: '/travel', icon: '✈️', desc: 'Hotels, Tours & Transport', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)', glow: '59,130,246' },
  { label: 'Food', href: '/food', icon: '🍽️', desc: 'Restaurants, Cafes & Home Cooks', gradient: 'linear-gradient(135deg,#f97316,#eab308)', glow: '249,115,22' },
  { label: 'Buy & Sell', href: '/buysell', icon: '🛍️', desc: 'Shoes, Cars, Gadgets & More', gradient: 'linear-gradient(135deg,#a855f7,#ec4899)', glow: '168,85,247' },
  { label: 'For Rent', href: '/rent', icon: '🏠', desc: 'Homes, Vehicles & Equipment', gradient: 'linear-gradient(135deg,#22c55e,#14b8a6)', glow: '34,197,94' },
  { label: 'Services', href: '/services', icon: '🛠️', desc: 'Plumbers, Tutors & Freelancers', gradient: 'linear-gradient(135deg,#ef4444,#f43f5e)', glow: '239,68,68' },
];

function TiltCard({ cat, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowing, setGlowing] = useState(false);

  const calcTilt = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -14, y: dx * 14 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease' : 'transform 0.08s ease',
        willChange: 'transform',
      }}
      onMouseMove={e => calcTilt(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={() => setGlowing(true)}
      onTouchEnd={() => { reset(); setGlowing(false); }}
      onTouchMove={e => {
        setGlowing(true);
        const t = e.touches[0];
        calcTilt(t.clientX, t.clientY);
      }}
    >
      <Link to={cat.href} className="block">
        <div
          className="relative rounded-2xl text-white text-center overflow-hidden"
          style={{
            background: cat.gradient,
            aspectRatio: '1 / 1.1',
            boxShadow: glowing
              ? `0 0 30px 8px rgba(${cat.glow},0.6), 0 8px 32px rgba(${cat.glow},0.3)`
              : `0 4px 20px rgba(${cat.glow},0.25)`,
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl" />

          {/* Glow ring on touch/hover */}
          <motion.div
            animate={{ opacity: glowing ? 1 : 0, scale: glowing ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 40px rgba(255,255,255,0.2)` }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
            <div className="text-5xl mb-3 drop-shadow-lg">{cat.icon}</div>
            <p className="font-heading font-bold text-lg leading-tight">{cat.label}</p>
            <p className="font-body text-xs mt-1.5 text-white/80 leading-snug">{cat.desc}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-[#2563EB]">Explore 1Market</span>
        <h2 className="font-heading font-bold text-3xl text-[#0A192F] mt-1">Browse by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {CATEGORIES.map((cat, i) => (
          <TiltCard key={cat.label} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}