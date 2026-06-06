import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Hotel, MapPin } from 'lucide-react';

const HOTELS = [
  {
    id: 1, name: 'The Manila Hotel', location: 'Rizal Park, Manila', stars: 5, tag: '🏛️ Heritage Icon',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=70',
    platforms: [
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 9500, bestPrice: 8200, link: 'https://www.agoda.com/the-manila-hotel' },
      { name: 'Booking.com', logo: 'https://www.google.com/s2/favicons?domain=booking.com&sz=128', avgPrice: 9800, bestPrice: 8500, link: 'https://www.booking.com' },
      { name: 'Klook', logo: 'https://www.google.com/s2/favicons?domain=klook.com&sz=128', avgPrice: 9200, bestPrice: 8000, link: 'https://www.klook.com/en-PH/' },
    ],
  },
  {
    id: 2, name: 'Sofitel Philippine Plaza', location: 'CCP Complex, Manila', stars: 5, tag: '🌊 Bay View',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70',
    platforms: [
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 13000, bestPrice: 11500, link: 'https://www.agoda.com' },
      { name: 'Booking.com', logo: 'https://www.google.com/s2/favicons?domain=booking.com&sz=128', avgPrice: 13500, bestPrice: 12000, link: 'https://www.booking.com' },
    ],
  },
  {
    id: 3, name: 'Canyon Cove Hotel & Spa', location: 'Nasugbu, Cavite', stars: 4, tag: '🏖️ Beach Resort',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=70',
    platforms: [
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 4000, bestPrice: 3200, link: 'https://www.agoda.com' },
      { name: 'Airbnb', logo: 'https://www.google.com/s2/favicons?domain=airbnb.com&sz=128', avgPrice: 4500, bestPrice: 3800, link: 'https://www.airbnb.com' },
      { name: 'Klook', logo: 'https://www.google.com/s2/favicons?domain=klook.com&sz=128', avgPrice: 3800, bestPrice: 3100, link: 'https://www.klook.com/en-PH/' },
    ],
  },
  {
    id: 4, name: 'Taal Vista Hotel', location: 'Tagaytay, Cavite', stars: 4, tag: '🌋 Volcano View',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=70',
    platforms: [
      { name: 'Booking.com', logo: 'https://www.google.com/s2/favicons?domain=booking.com&sz=128', avgPrice: 6200, bestPrice: 5500, link: 'https://www.booking.com' },
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 6000, bestPrice: 5200, link: 'https://www.agoda.com' },
    ],
  },
  {
    id: 5, name: 'Pico Sands Hotel', location: 'Nasugbu, Batangas', stars: 5, tag: '🌴 Beachfront',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=70',
    platforms: [
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 6500, bestPrice: 5800, link: 'https://www.agoda.com' },
      { name: 'Klook', logo: 'https://www.google.com/s2/favicons?domain=klook.com&sz=128', avgPrice: 6800, bestPrice: 6000, link: 'https://www.klook.com/en-PH/' },
    ],
  },
  {
    id: 6, name: 'Citystate Tower Hotel', location: 'Ermita, Manila', stars: 4, tag: '🏙️ City Center',
    image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=70',
    platforms: [
      { name: 'Booking.com', logo: 'https://www.google.com/s2/favicons?domain=booking.com&sz=128', avgPrice: 3200, bestPrice: 2700, link: 'https://www.booking.com' },
      { name: 'Agoda', logo: 'https://www.google.com/s2/favicons?domain=agoda.com&sz=128', avgPrice: 3000, bestPrice: 2500, link: 'https://www.agoda.com' },
    ],
  },
];

function HotelCard({ hotel }) {
  const bestDeal = [...hotel.platforms].sort((a, b) => a.bestPrice - b.bestPrice)[0];
  const avgAll = Math.round(hotel.platforms.reduce((a, b) => a + b.avgPrice, 0) / hotel.platforms.length);
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
        width: '290px',
        border: touched ? '1.5px solid #00D4FF' : '1.5px solid rgba(255,255,255,0.06)',
        boxShadow: touched ? '0 0 30px rgba(0,212,255,0.35), 0 12px 40px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-[#0A192F]/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-body font-bold text-[10px]">{hotel.tag}</div>
        <div className="absolute top-3 right-3 flex gap-0.5">
          {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
        </div>
        <div className="absolute bottom-3 left-3">
          <h3 className="font-heading font-bold text-white text-base leading-tight">{hotel.name}</h3>
          <p className="font-body text-[10px] text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{hotel.location}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1.5 mb-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between">
            <span className="font-body text-[9px] text-white/40 uppercase tracking-wider">Average Price/night</span>
            <span className="font-heading font-bold text-sm text-white/70">₱{avgAll.toLocaleString()}</span>
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

        <p className="font-body text-[9px] text-white/30 uppercase tracking-wider mb-2">Compare Platforms</p>
        <div className="space-y-1.5">
          {hotel.platforms.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00D4FF]/30 rounded-xl px-3 py-2 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                  <img src={p.logo} alt={p.name} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <span className="font-body text-[10px] text-white/70">{p.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[9px] text-white/30">from</span>
                <span className="font-heading font-bold text-xs text-white">₱{p.bestPrice.toLocaleString()}</span>
                <ExternalLink className="w-3 h-3 text-[#00D4FF]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PhHotelDeals() {
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
    <section className="py-12 sm:py-16 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640,#0040D0,#0033C4,#011640)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00D4FF]/10 rounded-full">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#00D4FF]" />
                <Hotel className="w-3 h-3 text-[#00D4FF]" />
                <span className="font-body text-xs font-bold text-[#00D4FF] uppercase tracking-wider">Best Hotels</span>
              </div>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Top Hotels in the Philippines</h2>
            <p className="font-body text-sm text-white/40 mt-1">Compare Agoda, Booking.com, Klook & Airbnb in one place</p>
          </div>
          <a href="/travel" className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/60 font-body text-xs hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] hover:border-[#00D4FF]/40 transition-all">
            All Hotels →
          </a>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {HOTELS.map(h => <HotelCard key={h.id} hotel={h} />)}
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-xs text-white/25">Prices per night. Click each platform to check live availability.</p>
        </div>
      </div>
    </section>
  );
}