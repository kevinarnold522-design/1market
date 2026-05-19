import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Plane, Hotel, Calendar, Users, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    id: 'cavite',
    name: 'Cavite',
    tagline: 'Heritage Shores & Beach Resorts',
    region: 'Luzon',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    highlight: 'Featured',
    rating: 4.7,
    options: [
      { type: 'Hotel', name: 'Canyon Cove Hotel & Spa', price: '₱3,500/night', stars: 4, link: 'https://www.canyon.ph/canyon-cove-hotel-spa/' },
      { type: 'Hotel', name: 'The Bayleaf Hotel Cavite', price: '₱4,200/night', stars: 4, link: 'https://www.thebayleaf.com.ph/cavite/' },
      { type: 'Hotel', name: 'Pico Sands Hotel', price: '₱5,800/night', stars: 5, link: 'https://www.expedia.com/Nasugbu-Hotels-Pico-Sands-Hotel.h6316376.Hotel-Information' },
      { type: 'Flight', name: 'Bus: Cubao → Tagaytay/Cavite', price: 'From ₱120', stars: null, link: 'https://www.traveloka.com/en-ph' },
    ],
  },
  {
    id: 'palawan',
    name: 'Palawan',
    tagline: "The World's Best Island",
    region: 'Luzon',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
    highlight: 'Top Rated',
    rating: 4.9,
    options: [
      { type: 'Hotel', name: 'Amanpulo Resort', price: '₱70,000+/night', stars: 5, link: 'https://www.aman.com/resorts/amanpulo' },
      { type: 'Hotel', name: 'Sea Cocoon Hotel El Nido', price: '₱6,500/night', stars: 4, link: 'https://www.agoda.com/sea-cocoon-hotel/hotel/default-city-km.html' },
      { type: 'Flight', name: 'Manila → Puerto Princesa (PAL)', price: 'From ₱1,800', stars: null, link: 'https://www.philippineairlines.com' },
      { type: 'Flight', name: 'Manila → El Nido (AirSWIFT)', price: 'From ₱2,400', stars: null, link: 'https://www.airswift.com.ph' },
    ],
  },
  {
    id: 'boracay',
    name: 'Boracay',
    tagline: 'World-Famous White Beach',
    region: 'Visayas',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    highlight: 'Popular',
    rating: 4.8,
    options: [
      { type: 'Hotel', name: "Shangri-La Boracay", price: '₱20,000+/night', stars: 5, link: 'https://www.shangri-la.com/boracay/boracayresort/' },
      { type: 'Hotel', name: 'Discovery Shores Boracay', price: '₱12,000+/night', stars: 5, link: 'https://www.discoveryboracay.com' },
      { type: 'Hotel', name: 'Henann Palm Beach Resort', price: '₱4,800/night', stars: 4, link: 'https://www.henannresorts.com/henann-palm-beach-resort/' },
      { type: 'Flight', name: 'Manila → Caticlan (Cebu Pacific)', price: 'From ₱1,700', stars: null, link: 'https://www.cebupacificair.com' },
    ],
  },
  {
    id: 'batangas',
    name: 'Batangas',
    tagline: 'Dive Sites & Beach Coves',
    region: 'Luzon',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    highlight: 'Trending',
    rating: 4.6,
    options: [
      { type: 'Hotel', name: 'Acuatico Beach Resort', price: '₱10,800+/night', stars: 5, link: 'https://acuaticoresort.com.ph' },
      { type: 'Hotel', name: 'Canyon Cove Hotel & Spa', price: '₱3,500/night', stars: 4, link: 'https://www.canyon.ph/canyon-cove-hotel-spa/' },
      { type: 'Hotel', name: 'Camp Netanya Resort & Spa', price: '₱6,000/night', stars: 4, link: 'https://www.agoda.com/city/batangas-ph.html' },
      { type: 'Flight', name: 'Bus: Buendia → Batangas (ALPS)', price: 'From ₱200', stars: null, link: 'https://www.traveloka.com/en-ph/bus' },
    ],
  },
  {
    id: 'cebu',
    name: 'Cebu',
    tagline: 'Whale Sharks, Waterfalls & Culture',
    region: 'Visayas',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80',
    highlight: 'Must Visit',
    rating: 4.8,
    options: [
      { type: 'Hotel', name: 'Shangri-La Mactan, Cebu', price: '₱12,000+/night', stars: 5, link: 'https://www.shangri-la.com/cebu/mactanresort/' },
      { type: 'Hotel', name: 'Crimson Resort & Spa Mactan', price: '₱9,500/night', stars: 5, link: 'https://www.crimsonhotel.com/mactan/' },
      { type: 'Hotel', name: 'Radisson Blu Cebu', price: '₱7,000/night', stars: 5, link: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-cebu' },
      { type: 'Flight', name: 'Manila → Cebu (Cebu Pacific)', price: 'From ₱1,500', stars: null, link: 'https://www.cebupacificair.com' },
    ],
  },
  {
    id: 'bohol',
    name: 'Bohol',
    tagline: 'Chocolate Hills & Tarsiers',
    region: 'Visayas',
    image: 'https://images.unsplash.com/photo-1591223493216-f8a538fbb3a6?w=800&q=80',
    highlight: 'Scenic',
    rating: 4.7,
    options: [
      { type: 'Hotel', name: 'Eskaya Beach Resort & Spa', price: '₱24,000+/night', stars: 5, link: 'https://eskayaresort.com' },
      { type: 'Hotel', name: 'Henann Alona Beach Resort', price: '₱5,500/night', stars: 4, link: 'https://www.henannresorts.com/alona-beach/' },
      { type: 'Hotel', name: 'Bohol Beach Club', price: '₱4,800/night', stars: 4, link: 'https://www.boholbeachclub.com.ph' },
      { type: 'Flight', name: 'Manila → Tagbilaran (PAL)', price: 'From ₱1,600', stars: null, link: 'https://www.philippineairlines.com' },
    ],
  },
];

const highlightColors = {
  Featured: 'bg-[#00D4FF] text-[#0A192F]',
  'Top Rated': 'bg-amber-400 text-[#0A192F]',
  Popular: 'bg-rose-400 text-white',
  Trending: 'bg-emerald-400 text-[#0A192F]',
  'Must Visit': 'bg-violet-400 text-white',
  Scenic: 'bg-orange-400 text-white',
};

function BookingModal({ destination, onClose }) {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? destination.options : destination.options.filter(o => o.type === tab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Modal Hero */}
        <div className="relative h-40 overflow-hidden">
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-5">
            <h3 className="font-heading font-bold text-2xl text-white">{destination.name}</h3>
            <p className="font-body text-xs text-white/70">{destination.tagline}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 pb-0">
          {['all', 'Hotel', 'Flight'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                tab === t
                  ? 'bg-[#0A192F] text-white'
                  : 'bg-[#F8FAFC] text-[#0A192F]/60 hover:bg-[#0A192F]/5'
              }`}
            >
              {t === 'all' ? 'All Options' : t === 'Hotel' ? '🏨 Hotels' : '✈️ Flights'}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
          {filtered.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-transparent hover:border-[#2563EB]/20 transition-all cursor-pointer group"
              onClick={() => window.open(opt.link, '_blank')}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  {opt.type === 'Hotel' ? <Hotel className="w-4 h-4 text-[#2563EB]" /> : <Plane className="w-4 h-4 text-[#00D4FF]" />}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-[#0A192F]">{opt.name}</p>
                  {opt.stars && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: opt.stars }).map((_, s) => (
                        <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-bold text-[#0A192F]">{opt.price}</span>
                <ChevronRight className="w-4 h-4 text-[#0A192F]/20 group-hover:text-[#2563EB] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={() => window.open(destination.options[0].link, '_blank')}
            className="w-full py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white font-body font-semibold text-sm rounded-xl transition-colors duration-300"
          >
            View All Options →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Travel() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [regionFilter, setRegionFilter] = useState('All');

  const regions = ['All', 'Luzon', 'Visayas', 'Mindanao'];

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'All' || d.region === regionFilter;
    return matchSearch && matchRegion;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to 1Market.ph
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Travel</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-3">
              Discover the Philippines
            </h1>
            <p className="font-body text-base text-white/50 max-w-xl">
              From historic Cavite to pristine Palawan — find hotels and flights across every island.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 relative max-w-md"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50 focus:bg-white/15 transition-all"
            />
          </motion.div>
        </div>
      </div>

      {/* Region Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-xs text-[#0A192F]/40 uppercase tracking-wider">Region:</span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                regionFilter === r
                  ? 'bg-[#0A192F] text-white'
                  : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(dest)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl shadow-[#0A192F]/5 hover:shadow-[#0A192F]/10 border border-[#0A192F]/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold tracking-wide ${highlightColors[dest.highlight]}`}>
                    {dest.highlight}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-body text-xs font-semibold text-white">{dest.rating}</span>
                </div>

                {/* Location */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span className="font-body text-xs text-white font-medium">{dest.region}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading font-bold text-xl text-[#0A192F] group-hover:text-[#2563EB] transition-colors">
                  {dest.name}
                </h3>
                <p className="font-body text-xs text-[#0A192F]/50 mt-1">{dest.tagline}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-[#0A192F]/40 font-body">
                      <Hotel className="w-3 h-3" />
                      <span>{dest.options.filter(o => o.type === 'Hotel').length} Hotels</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#0A192F]/40 font-body">
                      <Plane className="w-3 h-3" />
                      <span>{dest.options.filter(o => o.type === 'Flight').length} Flights</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0A192F]/5 flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#0A192F]/30 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-body text-[#0A192F]/40">No destinations found for "{search}"</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selected && <BookingModal destination={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}