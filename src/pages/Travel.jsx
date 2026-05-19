import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Plane, Hotel, Calendar, Users, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    id: 'cavite',
    name: 'Cavite',
    tagline: 'Heritage Shores & Island Escapes',
    region: 'Luzon',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/12b041927_generated_image.png',
    highlight: 'Featured',
    rating: 4.7,
    options: [
      { type: 'Hotel', name: 'Crimson Hotel Cavite', price: '₱3,200/night', stars: 4 },
      { type: 'Hotel', name: 'Bellevue Resort Cavite', price: '₱4,500/night', stars: 5 },
      { type: 'Flight', name: 'Manila → Cavite Ferry', price: '₱350', stars: null },
      { type: 'Hotel', name: 'La Carmela de Boracay', price: '₱2,800/night', stars: 3 },
    ],
  },
  {
    id: 'palawan',
    name: 'Palawan',
    tagline: "The World's Best Island",
    region: 'Luzon',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/5fea9f629_generated_image.png',
    highlight: 'Top Rated',
    rating: 4.9,
    options: [
      { type: 'Hotel', name: 'El Nido Resorts Lagen', price: '₱18,000/night', stars: 5 },
      { type: 'Hotel', name: 'Two Seasons Coron', price: '₱6,500/night', stars: 4 },
      { type: 'Flight', name: 'Manila → Puerto Princesa', price: '₱1,800', stars: null },
      { type: 'Flight', name: 'Manila → El Nido', price: '₱2,400', stars: null },
    ],
  },
  {
    id: 'boracay',
    name: 'Boracay',
    tagline: 'World-Class White Beach',
    region: 'Visayas',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/cfcfbf6bd_generated_image.png',
    highlight: 'Popular',
    rating: 4.8,
    options: [
      { type: 'Hotel', name: 'Shangri-La Boracay', price: '₱12,000/night', stars: 5 },
      { type: 'Hotel', name: 'Discovery Shores', price: '₱8,500/night', stars: 5 },
      { type: 'Flight', name: 'Manila → Kalibo', price: '₱1,200', stars: null },
      { type: 'Hotel', name: 'Henann Palm Beach', price: '₱4,200/night', stars: 4 },
    ],
  },
  {
    id: 'batangas',
    name: 'Batangas',
    tagline: 'Dive Sites & Beach Coves',
    region: 'Luzon',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/a5f852c18_generated_image.png',
    highlight: 'Trending',
    rating: 4.6,
    options: [
      { type: 'Hotel', name: 'Acuatico Beach Resort', price: '₱5,500/night', stars: 5 },
      { type: 'Hotel', name: 'Laiya Beach Club', price: '₱3,800/night', stars: 4 },
      { type: 'Flight', name: 'Bus: Manila → Batangas', price: '₱250', stars: null },
      { type: 'Hotel', name: 'La Luz Beach Resort', price: '₱4,000/night', stars: 4 },
    ],
  },
  {
    id: 'cebu',
    name: 'Cebu',
    tagline: 'Whale Sharks & Waterfalls',
    region: 'Visayas',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/12b041927_generated_image.png',
    highlight: 'Must Visit',
    rating: 4.8,
    options: [
      { type: 'Hotel', name: 'Shangri-La Mactan', price: '₱9,000/night', stars: 5 },
      { type: 'Hotel', name: 'Crimson Resort Mactan', price: '₱6,800/night', stars: 5 },
      { type: 'Flight', name: 'Manila → Cebu', price: '₱1,500', stars: null },
      { type: 'Hotel', name: 'Radisson Blu Cebu', price: '₱5,200/night', stars: 5 },
    ],
  },
  {
    id: 'bohol',
    name: 'Bohol',
    tagline: 'Chocolate Hills & Tarsiers',
    region: 'Visayas',
    image: 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/5fea9f629_generated_image.png',
    highlight: 'Scenic',
    rating: 4.7,
    options: [
      { type: 'Hotel', name: 'Eskaya Beach Resort', price: '₱7,200/night', stars: 5 },
      { type: 'Hotel', name: 'Henann Alona Beach', price: '₱4,500/night', stars: 4 },
      { type: 'Flight', name: 'Manila → Tagbilaran', price: '₱1,600', stars: null },
      { type: 'Hotel', name: 'Bohol Beach Club', price: '₱3,800/night', stars: 4 },
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
          <button className="w-full py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white font-body font-semibold text-sm rounded-xl transition-colors duration-300">
            Book Now
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
          style={{ backgroundImage: `url(https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/cfcfbf6bd_generated_image.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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