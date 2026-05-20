import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, MapPin, Tag, Navigation, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const allSuggestions = [
  // Manila
  { title: 'Jollibee – Malate Branch', category: 'Food', tag: 'Near You', location: 'Manila', area: 'Malate', icon: MapPin, link: '/food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { title: 'Jordan 1 Mid – QC Seller', category: 'Buy & Sell', tag: 'Listed Nearby', location: 'Manila', area: 'Quezon City', icon: Tag, link: '/buysell', image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80' },
  { title: '3BR Condo – Taft Ave., Manila', category: 'Real Estate', tag: 'For Sale', location: 'Manila', area: 'Malate', icon: Tag, link: '/buysell', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80' },
  { title: 'Toyota Vios 2019 – Parañaque', category: 'Cars', tag: 'Direct Owner', location: 'Manila', area: 'Parañaque', icon: Tag, link: '/buysell', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80' },
  { title: 'Healthy Meal Delivery – Manila', category: 'Food', tag: 'Delivery', location: 'Manila', area: 'Ermita', icon: Star, link: '/food', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
  { title: 'Freelance Graphic Designer – QC', category: 'Services', tag: 'Available', location: 'Manila', area: 'Quezon City', icon: Star, link: '/buysell', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80' },
  // Cavite
  { title: 'Jollibee – Molino Blvd.', category: 'Food', tag: 'Near You', location: 'Cavite', area: 'Bacoor', icon: MapPin, link: '/food', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { title: 'Tagaytay Kapeng Barako Stand', category: 'Food', tag: 'Local Gem', location: 'Cavite', area: 'Tagaytay', icon: Star, link: '/food', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
  { title: 'Townhouse – Molino, Bacoor', category: 'Real Estate', tag: 'For Sale', location: 'Cavite', area: 'Bacoor', icon: Tag, link: '/buysell', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80' },
  { title: 'Honda Civic 2017 – Dasmariñas', category: 'Cars', tag: 'Direct Owner', location: 'Cavite', area: 'Dasmariñas', icon: Tag, link: '/buysell', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
  { title: 'Kawit Seafood Grill Stall', category: 'Food', tag: 'Fresh Daily', location: 'Cavite', area: 'Kawit', icon: MapPin, link: '/food', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { title: 'Aircon Cleaning – Imus', category: 'Services', tag: 'Available', location: 'Cavite', area: 'Imus', icon: Star, link: '/buysell', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
];

export default function FeaturedFeed({ images }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [locationAsked, setLocationAsked] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleRequestLocation = () => {
    setLoadingLoc(true);
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude } = pos.coords;
        // Rough check: Cavite is roughly lat 14.1–14.5, Manila 14.5–14.7
        const detected = latitude < 14.5 ? 'Cavite' : 'Manila';
        setUserLocation(detected);
        setLocationAsked(true);
        setLoadingLoc(false);
      },
      () => {
        setLocationDenied(true);
        setLocationAsked(true);
        setLoadingLoc(false);
      }
    );
  };

  const items = userLocation
    ? allSuggestions.filter(s => s.location === userLocation)
    : allSuggestions;

  return (
    <section className="py-24 lg:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-[#00D4FF]" />
              <span className="font-body text-xs font-medium tracking-[0.2em] uppercase text-[#0A192F]/40">Featured Now</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-heading font-bold text-3xl sm:text-4xl text-[#0A192F]">
              {userLocation ? `Trending Near You · ${userLocation}` : 'Trending on 1Market'}
            </motion.h2>
          </div>

          {/* Location Button */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {!locationAsked ? (
              <button onClick={handleRequestLocation} disabled={loadingLoc}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#2563EB] transition-colors disabled:opacity-50">
                <Navigation className="w-3.5 h-3.5" />
                {loadingLoc ? 'Detecting...' : 'Show Near Me'}
              </button>
            ) : userLocation ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-body text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" /> Showing {userLocation} listings
                <button onClick={() => { setUserLocation(null); setLocationAsked(false); }} className="ml-1 hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] text-[#0A192F]/40 rounded-xl font-body text-xs border border-[#0A192F]/10">
                Showing all locations
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pl-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-6"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07 }} onClick={() => navigate(item.link)}
            className="flex-shrink-0 w-[280px] sm:w-[300px] group cursor-pointer" style={{ scrollSnapAlign: 'start' }}>
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm shadow-[#0A192F]/5 border border-[#0A192F]/5 hover:shadow-lg hover:shadow-[#0A192F]/10 transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-body font-semibold text-[#0A192F]">
                    <item.icon className="w-3 h-3 text-[#2563EB]" /> {item.tag}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.location === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    📍 {item.area}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#2563EB] font-semibold">{item.category}</p>
                <h3 className="font-heading font-semibold text-base text-[#0A192F] group-hover:text-[#2563EB] transition-colors leading-tight">{item.title}</h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body text-xs text-[#0A192F]/40">{item.location}</span>
                  <div className="w-7 h-7 rounded-full bg-[#0A192F]/5 flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                    <ArrowRight className="w-3 h-3 text-[#0A192F]/40 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}