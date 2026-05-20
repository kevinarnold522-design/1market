import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Plane, Hotel, Car, Search, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── HOTELS ────────────────────────────────────────────────────────────────
const hotels = [
  {
    id: 'bayleaf-cavite',
    name: 'The Bayleaf Hotel Cavite',
    location: 'Cavite City, Cavite',
    region: 'Cavite',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.6,
    price: '₱4,200/night',
    stars: 4,
    tag: 'Sea View',
    link: 'https://www.thebayleaf.com.ph/cavite/',
  },
  {
    id: 'canyon-cove',
    name: 'Canyon Cove Hotel & Spa',
    location: 'Nasugbu, Cavite',
    region: 'Cavite',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    rating: 4.7,
    price: '₱3,500/night',
    stars: 4,
    tag: 'Beach Resort',
    link: 'https://www.canyon.ph/canyon-cove-hotel-spa/',
  },
  {
    id: 'citystate-tower',
    name: 'Citystate Tower Hotel',
    location: 'Ermita, Manila',
    region: 'Manila',
    image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80',
    rating: 4.3,
    price: '₱2,800/night',
    stars: 4,
    tag: 'City Center',
    link: 'https://www.citystatetowerhotel.com',
  },
  {
    id: 'manila-hotel',
    name: 'The Manila Hotel',
    location: 'Rizal Park, Manila',
    region: 'Manila',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.8,
    price: '₱8,500/night',
    stars: 5,
    tag: 'Heritage Icon',
    link: 'https://www.manila-hotel.com.ph',
  },
  {
    id: 'sofitel-manila',
    name: 'Sofitel Philippine Plaza',
    location: 'CCP Complex, Manila',
    region: 'Manila',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    rating: 4.9,
    price: '₱12,000/night',
    stars: 5,
    tag: 'Luxury Bay View',
    link: 'https://sofitel.accor.com/asia/philippines/manila',
  },
  {
    id: 'pico-sands',
    name: 'Pico Sands Hotel',
    location: 'Nasugbu, Batangas/Cavite',
    region: 'Cavite',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.5,
    price: '₱5,800/night',
    stars: 5,
    tag: 'Beachfront',
    link: 'https://www.picodeoro.com.ph',
  },
];

// ─── FLIGHTS ───────────────────────────────────────────────────────────────
const flights = [
  {
    id: 'mia-cebu',
    route: 'Manila → Cebu',
    airline: 'Cebu Pacific',
    price: 'From ₱1,500',
    duration: '1h 20m',
    tag: 'Daily Flights',
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    link: 'https://www.cebupacificair.com',
  },
  {
    id: 'mia-palawan',
    route: 'Manila → Puerto Princesa',
    airline: 'Philippine Airlines',
    price: 'From ₱1,800',
    duration: '1h 30m',
    tag: 'Island Getaway',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    link: 'https://www.philippineairlines.com',
  },
  {
    id: 'mia-boracay',
    route: 'Manila → Caticlan (Boracay)',
    airline: 'Cebu Pacific',
    price: 'From ₱1,700',
    duration: '1h 10m',
    tag: 'Beach Bound',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    link: 'https://www.cebupacificair.com',
  },
  {
    id: 'mia-davao',
    route: 'Manila → Davao',
    airline: 'AirAsia Philippines',
    price: 'From ₱1,200',
    duration: '2h 05m',
    tag: 'Budget Deal',
    image: 'https://images.unsplash.com/photo-1542296332-3f4a0e8d8f4d?w=800&q=80',
    link: 'https://www.airasia.com/ph/en',
  },
  {
    id: 'mia-elnido',
    route: 'Manila → El Nido',
    airline: 'AirSWIFT',
    price: 'From ₱2,400',
    duration: '1h 45m',
    tag: 'Scenic Flight',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
    link: 'https://www.airswift.com.ph',
  },
  {
    id: 'cavite-bus',
    route: 'Cubao → Tagaytay / Cavite',
    airline: 'Bus (ALPS, Greenstar)',
    price: 'From ₱120',
    duration: '1h 30m',
    tag: 'Land Travel',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    link: 'https://www.traveloka.com/en-ph/bus',
  },
];

// ─── VEHICLES FOR RENT ─────────────────────────────────────────────────────
const vehicles = [
  {
    id: 'v1',
    name: 'Toyota Vios 2022',
    type: 'Sedan',
    location: 'Bacoor, Cavite',
    region: 'Cavite',
    price: '₱1,800/day',
    seats: 5,
    tag: 'Self-Drive',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    link: 'https://www.rentalcars.com',
  },
  {
    id: 'v2',
    name: 'Honda City 2021',
    type: 'Sedan',
    location: 'Dasmariñas, Cavite',
    region: 'Cavite',
    price: '₱1,600/day',
    seats: 5,
    tag: 'With Driver',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    link: 'https://www.grab.com/ph',
  },
  {
    id: 'v3',
    name: 'Toyota Hi-Ace Van',
    type: 'Van',
    location: 'Taguig, Manila',
    region: 'Manila',
    price: '₱3,500/day',
    seats: 12,
    tag: 'Group Travel',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    link: 'https://www.klook.com/en-PH',
  },
  {
    id: 'v4',
    name: 'Mitsubishi Montero Sport',
    type: 'SUV',
    location: 'Makati, Manila',
    region: 'Manila',
    price: '₱2,800/day',
    seats: 7,
    tag: 'Self-Drive',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    link: 'https://www.rentalcars.com',
  },
  {
    id: 'v5',
    name: 'Toyota Land Cruiser',
    type: 'SUV',
    location: 'BGC, Manila',
    region: 'Manila',
    price: '₱5,500/day',
    seats: 8,
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    link: 'https://www.rentalcars.com',
  },
  {
    id: 'v6',
    name: 'Scooter / Motorcycle',
    type: 'Motorcycle',
    location: 'Tagaytay, Cavite',
    region: 'Cavite',
    price: '₱400/day',
    seats: 2,
    tag: 'Budget Ride',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
    link: 'https://www.facebook.com/marketplace',
  },
];

const TAB_ICONS = { Hotels: Hotel, Flights: Plane, Vehicles: Car };
const TABS = ['Hotels', 'Flights', 'Vehicles'];

const REGION_FILTERS = {
  Hotels: ['All', 'Manila', 'Cavite'],
  Flights: ['All'],
  Vehicles: ['All', 'Manila', 'Cavite'],
};

export default function Travel() {
  const [tab, setTab] = useState('Hotels');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  const getItems = () => {
    let items = tab === 'Hotels' ? hotels : tab === 'Flights' ? flights : vehicles;
    if (region !== 'All') {
      items = items.filter(i => i.region === region);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        (i.name || i.route || '').toLowerCase().includes(q) ||
        (i.location || i.airline || '').toLowerCase().includes(q)
      );
    }
    return items;
  };

  const items = getItems();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 sm:mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to 1Market.ph
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Travel</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-white mb-2">
              Discover the Philippines
            </h1>
            <p className="font-body text-sm text-white/50 max-w-xl">
              Hotels, flights, and vehicle rentals — nationwide coverage with Manila & Cavite focus.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text" value={search} onChange={e => { setSearch(e.target.value); }}
              placeholder={`Search ${tab.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all"
            />
          </motion.div>
        </div>
      </div>

      {/* Sub-category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {TABS.map(t => {
            const Icon = TAB_ICONS[t];
            return (
              <button key={t} onClick={() => { setTab(t); setRegion('All'); setSearch(''); }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all border ${
                  tab === t
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-white border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/30'
                }`}>
                <Icon className="w-4 h-4" />
                {t}
              </button>
            );
          })}
        </div>

        {/* Region filter */}
        {REGION_FILTERS[tab].length > 1 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="font-body text-xs text-[#0A192F]/40 uppercase tracking-wider">Area:</span>
            {REGION_FILTERS[tab].map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-1 rounded-full text-xs font-body font-semibold transition-all ${
                  region === r ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'
                }`}>
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="group bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => window.open(item.link, '_blank')}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={item.image} alt={item.name || item.route} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-body font-bold text-[#0A192F]">{item.tag}</span>
                  </div>
                  {item.region && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.region === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        📍 {item.region}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  {tab === 'Hotels' && (
                    <>
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: item.stars }).map((_, s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      </div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</p>
                    </>
                  )}
                  {tab === 'Flights' && (
                    <>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.route}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5">{item.airline} · {item.duration}</p>
                    </>
                  )}
                  {tab === 'Vehicles' && (
                    <>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location} · {item.seats} seats
                      </p>
                    </>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body font-bold text-sm text-[#0A192F]">{item.price}</span>
                    <div className="flex items-center gap-1 text-[#2563EB] text-xs font-body font-semibold group-hover:underline">
                      <span>Book</span><ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-24">
            <p className="font-body text-[#0A192F]/40">No results found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}