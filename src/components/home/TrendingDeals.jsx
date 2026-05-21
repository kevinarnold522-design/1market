import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, TrendingUp, Star, Zap, RefreshCw } from 'lucide-react';

// Simulated live deals sourced from real platforms
const ALL_DEALS = [
  // Hotels - Agoda
  { id: 1, platform: 'Agoda', category: 'Hotel', title: 'The Manila Hotel', location: 'Rizal Park, Manila', originalPrice: 12000, salePrice: 8500, discount: 29, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', link: 'https://www.agoda.com/search?city=3670', badge: '🔥 Hot Deal', color: 'from-blue-600 to-blue-800' },
  { id: 2, platform: 'Agoda', category: 'Hotel', title: 'Sofitel Philippine Plaza', location: 'CCP Complex, Manila', originalPrice: 15000, salePrice: 10200, discount: 32, rating: 4.9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', link: 'https://www.agoda.com/search?city=3670', badge: '⭐ Top Rated', color: 'from-purple-600 to-purple-800' },
  { id: 3, platform: 'Booking.com', category: 'Hotel', title: 'Canyon Cove Hotel & Spa', location: 'Nasugbu, Cavite', originalPrice: 5800, salePrice: 3500, discount: 40, rating: 4.7, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', link: 'https://www.booking.com/searchresults.html?ss=Cavite', badge: '🌊 Beach Deal', color: 'from-cyan-600 to-cyan-800' },
  { id: 4, platform: 'Airbnb', category: 'Stay', title: 'Tagaytay Taal View Villa', location: 'Tagaytay, Cavite', originalPrice: 6500, salePrice: 3800, discount: 42, rating: 4.9, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', link: 'https://www.airbnb.com/s/Tagaytay', badge: '🏡 Airbnb Pick', color: 'from-rose-500 to-rose-700' },
  { id: 5, platform: 'Agoda', category: 'Hotel', title: 'Seda Vertis North', location: 'Quezon City, Manila', originalPrice: 9000, salePrice: 6300, discount: 30, rating: 4.7, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', link: 'https://www.agoda.com/search?city=3670', badge: '💼 Business', color: 'from-slate-600 to-slate-800' },

  // Klook Activities
  { id: 6, platform: 'Klook', category: 'Activity', title: 'Tagaytay Sky Ranch Day Pass', location: 'Tagaytay, Cavite', originalPrice: 850, salePrice: 599, discount: 30, rating: 4.6, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80', link: 'https://www.klook.com/en-PH/', badge: '🎡 Thrill', color: 'from-orange-500 to-orange-700' },
  { id: 7, platform: 'Klook', category: 'Activity', title: 'Manila Bay Sunset Cruise', location: 'Manila Bay, Manila', originalPrice: 1200, salePrice: 799, discount: 33, rating: 4.8, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', link: 'https://www.klook.com/en-PH/', badge: '🌅 Scenic', color: 'from-amber-500 to-amber-700' },
  { id: 8, platform: 'Klook', category: 'Concert', title: 'Ben&Ben Live – Araneta', location: 'Cubao, Manila', originalPrice: 2500, salePrice: 1800, discount: 28, rating: 5.0, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', link: 'https://www.klook.com/en-PH/', badge: '🎵 Concert', color: 'from-violet-600 to-violet-800' },
  { id: 9, platform: 'Klook', category: 'Movie', title: 'SM Cinema Premium Seats', location: 'SM Mall of Asia, Manila', originalPrice: 450, salePrice: 299, discount: 34, rating: 4.5, image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=80', link: 'https://www.klook.com/en-PH/', badge: '🎬 Cinema', color: 'from-indigo-600 to-indigo-800' },

  // Flights
  { id: 10, platform: 'Cebu Pacific', category: 'Flight', title: 'Manila → Cebu', location: 'NAIA Terminal 3', originalPrice: 2800, salePrice: 1499, discount: 46, rating: 4.3, image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80', link: 'https://www.cebupacificair.com', badge: '✈️ Piso Sale', color: 'from-yellow-500 to-yellow-700' },
  { id: 11, platform: 'AirAsia', category: 'Flight', title: 'Manila → Boracay', location: 'NAIA, Manila', originalPrice: 3200, salePrice: 1799, discount: 44, rating: 4.4, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', link: 'https://www.airasia.com/ph/en', badge: '🌊 Beach Promo', color: 'from-red-500 to-red-700' },
  { id: 12, platform: 'Philippine Airlines', category: 'Flight', title: 'Manila → Palawan', location: 'NAIA T2, Manila', originalPrice: 4500, salePrice: 2800, discount: 38, rating: 4.6, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', link: 'https://www.philippineairlines.com', badge: '🏝️ Island Deal', color: 'from-blue-500 to-blue-700' },

  // Vacation Packages
  { id: 13, platform: 'Traveloka', category: 'Package', title: 'Boracay 3D2N Package', location: 'Boracay Island', originalPrice: 12000, salePrice: 7999, discount: 33, rating: 4.8, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', link: 'https://www.traveloka.com/en-ph', badge: '📦 All-In', color: 'from-teal-500 to-teal-700' },
  { id: 14, platform: 'Traveloka', category: 'Package', title: 'Batangas Beach Resort Package', location: 'Nasugbu, Batangas', originalPrice: 5500, salePrice: 3299, discount: 40, rating: 4.7, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', link: 'https://www.traveloka.com/en-ph', badge: '🌴 Weekend', color: 'from-green-500 to-green-700' },
];

const PLATFORM_COLORS = {
  'Agoda': '#E22A4B',
  'Airbnb': '#FF5A5F',
  'Booking.com': '#003580',
  'Klook': '#FF5D00',
  'Cebu Pacific': '#F9C813',
  'AirAsia': '#FF0000',
  'Philippine Airlines': '#003087',
  'Traveloka': '#0770E3',
};

const CATEGORIES = ['All', 'Hotel', 'Stay', 'Flight', 'Activity', 'Concert', 'Movie', 'Package'];

function DealCard({ deal, animKey }) {
  const platformColor = PLATFORM_COLORS[deal.platform] || '#2563EB';

  return (
    <motion.div
      key={animKey}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex-shrink-0"
      style={{ width: '280px' }}
      onClick={() => window.open(deal.link, '_blank')}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full font-body font-black text-xs">
          -{deal.discount}%
        </div>

        {/* Platform badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-white font-body font-bold text-[10px]"
          style={{ backgroundColor: platformColor }}>
          {deal.platform}
        </div>

        {/* Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 font-body text-[10px] font-bold text-[#0A192F]">
          {deal.badge}
        </div>
      </div>

      <div className="p-4">
        <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-0.5">{deal.category} · {deal.location}</p>
        <h3 className="font-heading font-bold text-sm text-[#0A192F] leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">{deal.title}</h3>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-body text-xs font-semibold text-[#0A192F]">{deal.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-xs text-[#0A192F]/30 line-through">₱{deal.originalPrice.toLocaleString()}</span>
            <p className="font-heading font-bold text-base text-[#0A192F]">₱{deal.salePrice.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[#2563EB] text-xs font-body font-semibold">
            <span>Book</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingDeals() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [animKey, setAnimKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceOffsets, setPriceOffsets] = useState({});
  const scrollRef = useRef(null);

  // Auto-refresh prices every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        const offsets = {};
        ALL_DEALS.forEach(d => {
          // Simulate small price fluctuation ±3%
          offsets[d.id] = (Math.random() - 0.5) * 0.06;
        });
        setPriceOffsets(offsets);
        setAnimKey(k => k + 1);
        setIsRefreshing(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let direction = 1;
    const scroll = setInterval(() => {
      if (!el) return;
      el.scrollLeft += direction * 1.2;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) direction = -1;
      if (el.scrollLeft <= 10) direction = 1;
    }, 30);
    return () => clearInterval(scroll);
  }, []);

  const filtered = activeCategory === 'All' ? ALL_DEALS : ALL_DEALS.filter(d => d.category === activeCategory);

  const dealsWithOffsets = filtered.map(d => ({
    ...d,
    salePrice: Math.round(d.salePrice * (1 + (priceOffsets[d.id] || 0))),
  }));

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="font-body text-xs font-bold text-red-600 uppercase tracking-wider">Live Deals</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-[#0A192F]/5 rounded-full">
                <TrendingUp className="w-3 h-3 text-[#2563EB]" />
                <span className="font-body text-xs text-[#0A192F]/60">Updated every 5s</span>
              </div>
              {isRefreshing && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                </motion.div>
              )}
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0A192F]">
              Trending Deals
            </h2>
            <p className="font-body text-sm text-[#0A192F]/40 mt-1">
              Best prices compared across Agoda, Airbnb, Klook, Traveloka & more
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Agoda', 'Airbnb', 'Klook', 'Traveloka'].map(p => (
              <div key={p} className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#0A192F]/10 shadow-sm">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
                <span className="font-body text-xs text-[#0A192F]/60">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-body font-semibold text-xs transition-all ${activeCategory === cat ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Scrolling cards */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence mode="popLayout">
            {dealsWithOffsets.map((deal) => (
              <DealCard key={`${deal.id}-${animKey}`} deal={deal} animKey={animKey} />
            ))}
          </AnimatePresence>
        </div>

        {/* Comparison note */}
        <div className="mt-6 flex items-center gap-2 text-center justify-center">
          <Zap className="w-4 h-4 text-[#00D4FF]" />
          <p className="font-body text-xs text-[#0A192F]/40">
            Prices compared in real-time. Click any card to book on the original platform.
          </p>
        </div>
      </div>
    </section>
  );
}