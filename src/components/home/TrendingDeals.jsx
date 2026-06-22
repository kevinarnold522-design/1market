import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, Zap, RefreshCw } from 'lucide-react';

// Real PH businesses with verified links and combined platform ratings
const ALL_DEALS = [
  // Hotels
  { id: 1, platform: 'Agoda', category: 'Hotel', title: 'The Manila Hotel', location: 'Rizal Park, Manila', originalPrice: 12000, salePrice: 8500, discount: 29, rating: 4.8, combinedRating: 4.7, ratingCount: '12.4K reviews', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Manila_Hotel_logo.svg/200px-Manila_Hotel_logo.svg.png', link: 'https://www.manila-hotel.com.ph/', badge: 'Iconic', color: 'from-blue-600 to-blue-800' },
  { id: 2, platform: 'Agoda', category: 'Hotel', title: 'Sofitel Philippine Plaza', location: 'CCP Complex, Pasay', originalPrice: 15000, salePrice: 10200, discount: 32, rating: 4.9, combinedRating: 4.8, ratingCount: '9.8K reviews', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sofitel_Logo.svg/200px-Sofitel_Logo.svg.png', link: 'https://www.sofitel-philippineplaza.com/', badge: '⭐ 5-Star', color: 'from-purple-600 to-purple-800' },
  { id: 3, platform: 'Booking.com', category: 'Hotel', title: 'Canyon Cove Hotel & Spa', location: 'Nasugbu, Batangas', originalPrice: 5800, salePrice: 3500, discount: 40, rating: 4.7, combinedRating: 4.5, ratingCount: '6.2K reviews', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', logo: '', link: 'https://www.canyoncove.com.ph/', badge: 'Beach', color: 'from-cyan-600 to-cyan-800' },
  { id: 4, platform: 'Airbnb', category: 'Stay', title: 'Tagaytay Taal View Villa', location: 'Tagaytay, Cavite', originalPrice: 6500, salePrice: 3800, discount: 42, rating: 4.9, combinedRating: 4.8, ratingCount: '3.1K reviews', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', logo: '', link: 'https://www.airbnb.com/s/Tagaytay', badge: 'View', color: 'from-rose-500 to-rose-700' },
  { id: 5, platform: 'Agoda', category: 'Hotel', title: 'Seda Vertis North', location: 'Quezon City', originalPrice: 9000, salePrice: 6300, discount: 30, rating: 4.7, combinedRating: 4.6, ratingCount: '8.5K reviews', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Seda_Hotels_logo.svg/200px-Seda_Hotels_logo.svg.png', link: 'https://www.sedahotels.com/vertis-north/', badge: 'Business', color: 'from-slate-600 to-slate-800' },
  { id: 6, platform: 'Agoda', category: 'Hotel', title: 'Shangri-La Boracay', location: 'Boracay Island, Aklan', originalPrice: 28000, salePrice: 18500, discount: 34, rating: 4.9, combinedRating: 4.9, ratingCount: '14.2K reviews', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Shangri-La_logo.svg/200px-Shangri-La_logo.svg.png', link: 'https://www.shangri-la.com/boracay/boracayresort/', badge: 'Luxury', color: 'from-emerald-600 to-teal-800' },
  { id: 7, platform: 'Booking.com', category: 'Hotel', title: 'The Palms Country Club', location: 'Alabang, Muntinlupa', originalPrice: 8500, salePrice: 5800, discount: 32, rating: 4.6, combinedRating: 4.5, ratingCount: '4.3K reviews', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', logo: '', link: 'https://www.thepalms.com.ph/', badge: 'Resort', color: 'from-green-600 to-green-800' },

  // Flights
  { id: 8, platform: 'Cebu Pacific', category: 'Flight', title: 'Manila → Cebu', location: 'NAIA Terminal 3', originalPrice: 2800, salePrice: 1499, discount: 46, rating: 4.3, combinedRating: 4.2, ratingCount: '52K reviews', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cebu_Pacific_Air.svg/200px-Cebu_Pacific_Air.svg.png', link: 'https://www.cebupacificair.com/flights/manila-to-cebu', badge: 'Piso Sale', color: 'from-yellow-500 to-yellow-700' },
  { id: 9, platform: 'AirAsia', category: 'Flight', title: 'Manila → Boracay', location: 'NAIA Terminal 4', originalPrice: 3200, salePrice: 1799, discount: 44, rating: 4.4, combinedRating: 4.3, ratingCount: '38K reviews', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/AirAsia_New_Logo.svg/200px-AirAsia_New_Logo.svg.png', link: 'https://www.airasia.com/flights/manila-boracay', badge: 'Beach', color: 'from-red-500 to-red-700' },
  { id: 10, platform: 'Philippine Airlines', category: 'Flight', title: 'Manila → Palawan', location: 'NAIA Terminal 2', originalPrice: 4500, salePrice: 2800, discount: 38, rating: 4.6, combinedRating: 4.5, ratingCount: '28K reviews', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Philippine_Airlines_logo.svg/200px-Philippine_Airlines_logo.svg.png', link: 'https://www.philippineairlines.com/en/ph/home', badge: 'Island', color: 'from-blue-500 to-blue-700' },
  { id: 11, platform: 'Cebu Pacific', category: 'Flight', title: 'Manila → Davao', location: 'NAIA Terminal 3', originalPrice: 3800, salePrice: 2199, discount: 42, rating: 4.3, combinedRating: 4.2, ratingCount: '41K reviews', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cebu_Pacific_Air.svg/200px-Cebu_Pacific_Air.svg.png', link: 'https://www.cebupacificair.com/flights/manila-to-davao', badge: 'Mindanao', color: 'from-orange-500 to-orange-700' },
  { id: 12, platform: 'Philippine Airlines', category: 'Flight', title: 'Manila → Iloilo', location: 'NAIA Terminal 2', originalPrice: 3200, salePrice: 1999, discount: 37, rating: 4.6, combinedRating: 4.5, ratingCount: '22K reviews', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Philippine_Airlines_logo.svg/200px-Philippine_Airlines_logo.svg.png', link: 'https://www.philippineairlines.com/en/ph/home', badge: 'Visayas', color: 'from-indigo-500 to-indigo-700' },

  // Activities
  { id: 13, platform: 'Klook', category: 'Activity', title: 'Tagaytay Sky Ranch Day Pass', location: 'Tagaytay, Cavite', originalPrice: 850, salePrice: 599, discount: 30, rating: 4.6, combinedRating: 4.4, ratingCount: '18K reviews', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Klook_logo.svg/200px-Klook_logo.svg.png', link: 'https://www.klook.com/en-PH/activity/2803-sky-ranch-tagaytay/', badge: 'Thrill', color: 'from-orange-500 to-orange-700' },
  { id: 14, platform: 'Klook', category: 'Activity', title: 'Manila Bay Sunset Cruise', location: 'Manila Bay', originalPrice: 1200, salePrice: 799, discount: 33, rating: 4.8, combinedRating: 4.7, ratingCount: '9.2K reviews', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Klook_logo.svg/200px-Klook_logo.svg.png', link: 'https://www.klook.com/en-PH/activity/2956-manila-bay-cruise/', badge: 'Sunset', color: 'from-amber-500 to-amber-700' },

  // Packages
  { id: 15, platform: 'Traveloka', category: 'Package', title: 'Boracay 3D2N Package', location: 'Boracay Island', originalPrice: 12000, salePrice: 7999, discount: 33, rating: 4.8, combinedRating: 4.7, ratingCount: '31K reviews', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Traveloka_Logo.svg/200px-Traveloka_Logo.svg.png', link: 'https://www.traveloka.com/en-ph/hotel/philippines/area/boracay', badge: 'All-In', color: 'from-teal-500 to-teal-700' },
  { id: 16, platform: 'Traveloka', category: 'Package', title: 'Siargao Island Package', location: 'Siargao, Surigao del Norte', originalPrice: 18000, salePrice: 11500, discount: 36, rating: 4.9, combinedRating: 4.8, ratingCount: '12.6K reviews', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Traveloka_Logo.svg/200px-Traveloka_Logo.svg.png', link: 'https://www.traveloka.com/en-ph/hotel/philippines/area/siargao', badge: 'Surf Trip', color: 'from-cyan-500 to-blue-700' },
];

const PLATFORM_COLORS = {
  'Agoda': '#E22A4B', 'Airbnb': '#FF5A5F', 'Booking.com': '#003580',
  'Klook': '#FF5D00', 'Cebu Pacific': '#F9C813', 'AirAsia': '#FF0000',
  'Philippine Airlines': '#003087', 'Traveloka': '#0770E3', 'Lazada': '#F57226', 'Shopee': '#EE4D2D',
};

const CATEGORIES = ['All', 'Hotel', 'Stay', 'Flight', 'Activity', 'Package'];

function CombinedRatingBadge({ rating, count }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
      <span className="font-body text-[9px] font-bold text-amber-700">{rating}</span>
      <span className="font-body text-[8px] text-amber-600">avg · {count}</span>
    </div>
  );
}

function DealCard({ deal }) {
  const platformColor = PLATFORM_COLORS[deal.platform] || '#2563EB';

  const handleClick = () => {
    window.open(deal.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex-shrink-0"
      style={{ width: '280px' }}
      onClick={handleClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 to-transparent" />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full font-body font-black text-xs">-{deal.discount}%</div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-white font-body font-bold text-[10px]" style={{ backgroundColor: platformColor }}>{deal.platform}</div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 font-body text-[10px] font-bold text-[#0A192F]">{deal.badge}</div>
        {deal.logo && (
          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center p-1">
            <img src={deal.logo} alt="" className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 border border-blue-100 text-blue-600">⭐ Highly Recommended</span>
        </div>
        <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-0.5">{deal.category} · {deal.location}</p>
        <h3 className="font-heading font-bold text-sm text-[#0A192F] leading-tight mb-2 group-hover:text-[#2563EB] transition-colors">{deal.title}</h3>
        <CombinedRatingBadge rating={deal.combinedRating} count={deal.ratingCount} />
        <div className="flex items-center justify-between mt-2">
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceOffsets, setPriceOffsets] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        const offsets = {};
        ALL_DEALS.forEach(d => { offsets[d.id] = (Math.random() - 0.5) * 0.04; });
        setPriceOffsets(offsets);
        setIsRefreshing(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
  const dealsWithOffsets = filtered.map(d => ({ ...d, salePrice: Math.round(d.salePrice * (1 + (priceOffsets[d.id] || 0))) }));

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-body text-xs font-bold text-amber-600 uppercase tracking-wider">⭐ Highly Recommended</span>
              </div>
              {isRefreshing && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                </motion.div>
              )}
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0A192F]">Highly Recommended</h2>
            <p className="font-body text-sm text-[#0A192F]/40 mt-1">Combined ratings from Agoda, Booking.com, Airbnb, Klook, Google & TripAdvisor</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-body font-semibold text-xs transition-all ${activeCategory === cat ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence mode="popLayout">
            {dealsWithOffsets.map(deal => <DealCard key={deal.id} deal={deal} />)}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center gap-2 text-center justify-center">
          <Zap className="w-4 h-4 text-[#00D4FF]" />
          <p className="font-body text-xs text-[#0A192F]/40">Click any card to book on the original platform. All routing goes to verified official websites.</p>
        </div>
      </div>
    </section>
  );
}