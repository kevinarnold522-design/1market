import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Plane, Users, MapPin } from 'lucide-react';

const FLIGHTS = [
  {
    id: 1, route: 'Manila → Cebu', code: 'MNL–CEB', duration: '1h 20m', tag: '🔥 Most Popular',
    airlines: [
      { name: 'Cebu Pacific', logo: 'https://www.google.com/s2/favicons?domain=cebupacificair.com&sz=128', avgPrice: 1500, bestPrice: 999, link: 'https://www.cebupacificair.com', color: '#FFFF00', bg: '#0033A0' },
      { name: 'Philippine Airlines', logo: 'https://www.google.com/s2/favicons?domain=philippineairlines.com&sz=128', avgPrice: 2200, bestPrice: 1800, link: 'https://www.philippineairlines.com', color: '#003087', bg: '#fff' },
      { name: 'AirAsia', logo: 'https://www.google.com/s2/favicons?domain=airasia.com&sz=128', avgPrice: 1700, bestPrice: 1099, link: 'https://www.airasia.com/ph/en', color: '#fff', bg: '#E21B22' },
    ],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=70',
  },
  {
    id: 2, route: 'Manila → Davao', code: 'MNL–DVO', duration: '2h 05m', tag: '⚡ Budget Deal',
    airlines: [
      { name: 'AirAsia', logo: 'https://www.google.com/s2/favicons?domain=airasia.com&sz=128', avgPrice: 1600, bestPrice: 1099, link: 'https://www.airasia.com/ph/en', color: '#fff', bg: '#E21B22' },
      { name: 'Cebu Pacific', logo: 'https://www.google.com/s2/favicons?domain=cebupacificair.com&sz=128', avgPrice: 1900, bestPrice: 1299, link: 'https://www.cebupacificair.com', color: '#FFFF00', bg: '#0033A0' },
      { name: 'Philippine Airlines', logo: 'https://www.google.com/s2/favicons?domain=philippineairlines.com&sz=128', avgPrice: 2500, bestPrice: 2100, link: 'https://www.philippineairlines.com', color: '#003087', bg: '#fff' },
    ],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70',
  },
  {
    id: 3, route: 'Manila → Caticlan', code: 'MNL–MPH', duration: '1h 10m', tag: '🏖️ Boracay',
    airlines: [
      { name: 'Cebu Pacific', logo: 'https://www.google.com/s2/favicons?domain=cebupacificair.com&sz=128', avgPrice: 1800, bestPrice: 1399, link: 'https://www.cebupacificair.com', color: '#FFFF00', bg: '#0033A0' },
      { name: 'Philippine Airlines', logo: 'https://www.google.com/s2/favicons?domain=philippineairlines.com&sz=128', avgPrice: 2300, bestPrice: 1999, link: 'https://www.philippineairlines.com', color: '#003087', bg: '#fff' },
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=70',
  },
  {
    id: 4, route: 'Manila → Puerto Princesa', code: 'MNL–PPS', duration: '1h 30m', tag: '🌿 Palawan',
    airlines: [
      { name: 'Philippine Airlines', logo: 'https://www.google.com/s2/favicons?domain=philippineairlines.com&sz=128', avgPrice: 2000, bestPrice: 1699, link: 'https://www.philippineairlines.com', color: '#003087', bg: '#fff' },
      { name: 'Cebu Pacific', logo: 'https://www.google.com/s2/favicons?domain=cebupacificair.com&sz=128', avgPrice: 1750, bestPrice: 1299, link: 'https://www.cebupacificair.com', color: '#FFFF00', bg: '#0033A0' },
      { name: 'AirAsia', logo: 'https://www.google.com/s2/favicons?domain=airasia.com&sz=128', avgPrice: 1900, bestPrice: 1399, link: 'https://www.airasia.com/ph/en', color: '#fff', bg: '#E21B22' },
    ],
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=70',
  },
  {
    id: 5, route: 'Manila → El Nido', code: 'MNL–ENI', duration: '1h 45m', tag: '✈️ Scenic',
    airlines: [
      { name: 'AirSWIFT', logo: 'https://www.google.com/s2/favicons?domain=airswift.com.ph&sz=128', avgPrice: 3500, bestPrice: 2400, link: 'https://www.airswift.com.ph', color: '#fff', bg: '#003366' },
    ],
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=70',
  },
  {
    id: 6, route: 'Manila → Iloilo', code: 'MNL–ILO', duration: '1h 20m', tag: '🌺 Visayas',
    airlines: [
      { name: 'Cebu Pacific', logo: 'https://www.google.com/s2/favicons?domain=cebupacificair.com&sz=128', avgPrice: 1600, bestPrice: 1099, link: 'https://www.cebupacificair.com', color: '#FFFF00', bg: '#0033A0' },
      { name: 'Philippine Airlines', logo: 'https://www.google.com/s2/favicons?domain=philippineairlines.com&sz=128', avgPrice: 2100, bestPrice: 1800, link: 'https://www.philippineairlines.com', color: '#003087', bg: '#fff' },
    ],
    image: 'https://images.unsplash.com/photo-1542296332-3f4a0e8d8f4d?w=600&q=70',
  },
];

function FlightCard({ flight }) {
  const bestDeal = [...flight.airlines].sort((a, b) => a.bestPrice - b.bestPrice)[0];
  const [touched, setTouched] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTimeout(() => setTouched(false), 800)}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group bg-[#0D1F3C] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer relative"
      style={{
        width: '300px',
        border: touched ? '1.5px solid #00D4FF' : '1.5px solid rgba(255,255,255,0.06)',
        boxShadow: touched ? '0 0 30px rgba(0,212,255,0.35), 0 12px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Image header */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={flight.image} alt={flight.route} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-[#0A192F]/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-body font-bold text-[10px]">{flight.tag}</div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-body text-[10px]">
          <Plane className="w-3 h-3" /> {flight.duration}
        </div>
        <div className="absolute bottom-3 left-3">
          <h3 className="font-heading font-bold text-white text-lg leading-tight">{flight.route}</h3>
          <p className="font-body text-[10px] text-white/50">{flight.code}</p>
        </div>
      </div>

      <div className="p-4">
        {/* 3-tier pricing */}
        <div className="space-y-1.5 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <span className="font-body text-[9px] text-white/40 uppercase tracking-wider">Average Price</span>
            <span className="font-heading font-bold text-sm text-white/70">₱{Math.round(flight.airlines.reduce((a, b) => a + b.avgPrice, 0) / flight.airlines.length).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-[9px] text-white/40 uppercase tracking-wider">Best Deal</span>
            <span className="font-heading font-bold text-sm text-green-400">₱{bestDeal.bestPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-[9px] text-white/40 uppercase tracking-wider">Best Platform</span>
            <span className="font-body text-[9px] text-[#00D4FF] font-semibold">{bestDeal.name}</span>
          </div>
        </div>

        {/* Airline comparison */}
        <p className="font-body text-[9px] text-white/30 uppercase tracking-wider mb-2">Compare Airlines</p>
        <div className="space-y-1.5">
          {flight.airlines.map((a, i) => (
            <a key={i} href={a.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00D4FF]/30 rounded-xl px-3 py-2 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                  <img src={a.logo} alt={a.name} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <span className="font-body text-[10px] text-white/70">{a.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[9px] text-white/30">from</span>
                <span className="font-heading font-bold text-xs text-white">₱{a.bestPrice.toLocaleString()}</span>
                <ExternalLink className="w-3 h-3 text-[#00D4FF]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PhFlightDeals() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let dir = 1;
    const scroll = setInterval(() => {
      if (!el || isPaused) return;
      el.scrollLeft += dir * 0.8;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) dir = -1;
      if (el.scrollLeft <= 10) dir = 1;
    }, 25);
    return () => clearInterval(scroll);
  }, [isPaused]);

  return (
    <section className="py-12 sm:py-16 bg-[#070F1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00D4FF]/10 rounded-full">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                <Plane className="w-3 h-3 text-[#00D4FF]" />
                <span className="font-body text-xs font-bold text-[#00D4FF] uppercase tracking-wider">Philippines Flights</span>
              </div>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Best Domestic Flight Deals</h2>
            <p className="font-body text-sm text-white/40 mt-1">Cebu Pacific, PAL, AirAsia — compare all carriers in one place</p>
          </div>
          <a href="/travel" className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/60 font-body text-xs hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] hover:border-[#00D4FF]/40 transition-all">
            All Travel Options →
          </a>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
        >
          {FLIGHTS.map(f => <FlightCard key={f.id} flight={f} />)}
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-xs text-white/25">Prices are indicative. Click each airline to book directly on their official site.</p>
        </div>
      </div>
    </section>
  );
}