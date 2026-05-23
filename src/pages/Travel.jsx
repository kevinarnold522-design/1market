import React, { useState } from 'react';
import StarField from '../components/StarField';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Plane, Hotel, Car, Search, ExternalLink, Building, Anchor, Mountain, Tent, Globe, Navigation, Ship, Bike, Camera } from 'lucide-react';
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

const TAB_ICONS = {
  Hotels: Hotel, Resorts: Building, Flights: Plane, 'Ferry & Bus': Anchor, 'Car Rentals': Car,
  'Van Rentals': Car, Tours: Globe, 'Island Hopping': Anchor, Camping: Tent, Diving: Anchor,
  Surfing: Navigation, Hiking: Mountain, Cruise: Ship, 'Bike Rentals': Bike, Photography: Camera,
};

const TABS = [
  'Hotels', 'Resorts', 'Flights', 'Ferry & Bus', 'Car Rentals', 'Van Rentals',
  'Tours', 'Island Hopping', 'Camping', 'Diving', 'Surfing', 'Hiking', 'Cruise',
];

const REGION_FILTERS = {
  Hotels: ['All', 'Manila', 'Cavite'],
  Resorts: ['All', 'Manila', 'Cavite'],
  Flights: ['All'],
  'Ferry & Bus': ['All'],
  'Car Rentals': ['All', 'Manila', 'Cavite'],
  'Van Rentals': ['All', 'Manila', 'Cavite'],
  Tours: ['All'],
  'Island Hopping': ['All'],
  Camping: ['All'],
  Diving: ['All'],
  Surfing: ['All'],
  Hiking: ['All'],
  Cruise: ['All'],
};

const TRAVEL_SUBCATEGORIES = [
  { key: 'Hotels', label: 'Hotels', icon: '🏨', desc: 'Book stays' },
  { key: 'Resorts', label: 'Resorts', icon: '🌴', desc: 'Beach & spa' },
  { key: 'Flights', label: 'Flights', icon: '✈️', desc: 'Air travel' },
  { key: 'Ferry & Bus', label: 'Ferry & Bus', icon: '⛴️', desc: 'Land & sea' },
  { key: 'Car Rentals', label: 'Car Rentals', icon: '🚗', desc: 'Self drive' },
  { key: 'Van Rentals', label: 'Van Rentals', icon: '🚐', desc: 'Group rides' },
  { key: 'Tours', label: 'Tours', icon: '🗺️', desc: 'Guided trips' },
  { key: 'Island Hopping', label: 'Island Hopping', icon: '🏝️', desc: 'Boat tours' },
  { key: 'Camping', label: 'Camping', icon: '⛺', desc: 'Outdoors' },
  { key: 'Diving', label: 'Diving', icon: '🤿', desc: 'Scuba' },
  { key: 'Surfing', label: 'Surfing', icon: '🏄', desc: 'Waves' },
  { key: 'Hiking', label: 'Hiking', icon: '🥾', desc: 'Trails' },
  { key: 'Cruise', label: 'Cruise', icon: '🚢', desc: 'Cruises' },
];

export default function Travel() {
  const [tab, setTab] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const activeTab = tab || 'Hotels';

  const resorts = [
    { id: 'r1', name: 'Anvaya Cove Beach & Nature Club', location: 'Morong, Bataan', region: 'Manila', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', rating: 4.8, price: '₱6,500/night', stars: 5, tag: 'Beach Resort', link: 'https://www.anvayacove.com' },
    { id: 'r2', name: 'La Luz Beach Resort & Spa', location: 'San Juan, Batangas', region: 'Manila', image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80', rating: 4.7, price: '₱4,200/night', stars: 4, tag: 'Beach Spa', link: 'https://www.laluzresort.com' },
    { id: 'r3', name: 'Taal Vista Hotel & Resort', location: 'Tagaytay, Cavite', region: 'Cavite', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80', rating: 4.6, price: '₱5,800/night', stars: 4, tag: 'Volcano View', link: 'https://www.taalvistahotelandresort.com' },
    { id: 'r4', name: 'Estancia Resort Hotel', location: 'Tagaytay, Cavite', region: 'Cavite', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', rating: 4.5, price: '₱3,800/night', stars: 4, tag: 'Tagaytay', link: 'https://www.agoda.com/search?city=3667' },
  ];

  const tours = [
    { id: 't1', name: 'Intramuros Heritage Walking Tour', location: 'Intramuros, Manila', region: 'Manila', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', rating: 4.9, price: '₱600/person', tag: 'Historical', link: 'https://www.klook.com/en-PH/' },
    { id: 't2', name: 'Tagaytay Food & Taal Volcano Tour', location: 'Tagaytay, Cavite', region: 'Cavite', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80', rating: 4.8, price: '₱1,500/person', tag: 'Day Tour', link: 'https://www.klook.com/en-PH/' },
    { id: 't3', name: 'Manila Bay Sunset Cruise', location: 'Manila Bay', region: 'Manila', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', rating: 4.7, price: '₱850/person', tag: 'Scenic', link: 'https://www.klook.com/en-PH/' },
    { id: 't4', name: 'Corregidor Island Day Tour', location: 'Manila Bay', region: 'Manila', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', rating: 4.6, price: '₱1,200/person', tag: 'Historical', link: 'https://www.klook.com/en-PH/' },
  ];

  const islandHopping = [
    { id: 'ih1', name: 'Batangas Island Hopping Package', location: 'Anilao, Batangas', region: 'Cavite', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', rating: 4.9, price: '₱1,800/person', tag: 'Island Hop', link: 'https://www.klook.com/en-PH/' },
    { id: 'ih2', name: 'Fortune Island Day Tour', location: 'Nasugbu, Batangas', region: 'Cavite', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', rating: 4.8, price: '₱2,200/person', tag: 'Day Tour', link: 'https://www.klook.com/en-PH/' },
  ];

  const getItems = () => {
    if (activeTab === 'Car Rentals' || activeTab === 'Van Rentals') {
      let items = vehicles;
      if (region !== 'All') items = items.filter(i => i.region === region);
      if (search) { const q = search.toLowerCase(); items = items.filter(i => (i.name || '').toLowerCase().includes(q) || (i.location || '').toLowerCase().includes(q)); }
      return items;
    }
    if (activeTab === 'Resorts') return resorts;
    if (activeTab === 'Tours') return tours;
    if (activeTab === 'Island Hopping') return islandHopping;
    if (activeTab === 'Camping') return [{ id: 'c1', name: 'Mt. Pico de Loro Campsite', location: 'Ternate, Cavite', region: 'Cavite', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', rating: 4.7, price: '₱500/person', tag: 'Camping', link: 'https://www.klook.com/en-PH/' }];
    if (activeTab === 'Diving') return [{ id: 'd1', name: 'Anilao Dive Package', location: 'Anilao, Batangas', region: 'Cavite', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', rating: 4.9, price: '₱3,500/person', tag: 'Scuba', link: 'https://www.klook.com/en-PH/' }];
    if (activeTab === 'Surfing') return [{ id: 's1', name: 'La Union Surf Lesson', location: 'La Union', region: 'Manila', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80', rating: 4.8, price: '₱1,200/session', tag: 'Beginner', link: 'https://www.klook.com/en-PH/' }];
    if (activeTab === 'Hiking') return [{ id: 'h1', name: 'Mt. Batulao Day Hike', location: 'Nasugbu, Cavite', region: 'Cavite', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80', rating: 4.7, price: '₱600/person', tag: 'Day Hike', link: 'https://www.klook.com/en-PH/' }];
    if (activeTab === 'Cruise') return [{ id: 'cr1', name: 'Manila Bay Cruise – Dinner', location: 'Manila Bay', region: 'Manila', image: 'https://images.unsplash.com/photo-1580019542155-247062e19ce4?w=800&q=80', rating: 4.6, price: '₱2,500/person', tag: 'Dinner Cruise', link: 'https://www.klook.com/en-PH/' }];
    if (activeTab === 'Ferry & Bus') return flights.filter(f => f.id === 'cavite-bus').concat([{ id: 'fy1', route: 'Batangas → Puerto Galera', airline: 'Montenegro Shipping', price: 'From ₱450', duration: '1h 30m', tag: 'Ferry', image: 'https://images.unsplash.com/photo-1580019542155-247062e19ce4?w=800&q=80', link: 'https://www.traveloka.com/en-ph' }]);
    let items = activeTab === 'Hotels' ? hotels : activeTab === 'Flights' ? flights : hotels;
    if (region !== 'All') items = items.filter(i => i.region === region);
    if (search) { const q = search.toLowerCase(); items = items.filter(i => (i.name || i.route || '').toLowerCase().includes(q) || (i.location || i.airline || '').toLowerCase().includes(q)); }
    return items;
  };

  const items = getItems() || [];

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <SubcategorySplash
        subcategories={TRAVEL_SUBCATEGORIES}
        activeKey={tab}
        onSelect={setTab}
        title="Where do you want to go?"
        subtitle="Pick a travel category to explore"
      />
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
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all"
            />
          </motion.div>
        </div>
      </div>

      {/* Sub-category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {TABS.map(t => {
            const Icon = TAB_ICONS[t] || Plane;
            return (
              <button key={t} onClick={() => { setTab(t); setRegion('All'); setSearch(''); }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-body font-semibold text-xs sm:text-sm transition-all border ${
                  activeTab === t
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-white border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/30'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {t}
              </button>
            );
          })}
        </div>

        {/* Region filter */}
        {REGION_FILTERS[activeTab] && REGION_FILTERS[activeTab].length > 1 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="font-body text-xs text-[#0A192F]/40 uppercase tracking-wider">Area:</span>
            {(REGION_FILTERS[activeTab] || []).map(r => (
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
          <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
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
                  {(activeTab === 'Hotels' || activeTab === 'Resorts') && (
                    <>
                      {item.stars && (
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: item.stars }).map((_, s) => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                        </div>
                      )}
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</p>
                    </>
                  )}
                  {(activeTab === 'Flights' || activeTab === 'Ferry & Bus') && (
                    <>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.route || item.name}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5">{item.airline || item.type} {item.duration ? `· ${item.duration}` : ''}</p>
                    </>
                  )}
                  {(activeTab === 'Car Rentals' || activeTab === 'Van Rentals') && (
                    <>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.name}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location} {item.seats ? `· ${item.seats} seats` : ''}
                      </p>
                    </>
                  )}
                  {!['Hotels', 'Resorts', 'Flights', 'Ferry & Bus', 'Car Rentals', 'Van Rentals'].includes(activeTab) && (
                    <>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#0A192F] group-hover:text-[#2563EB] transition-colors">{item.name || item.route}</h3>
                      <p className="font-body text-xs text-[#0A192F]/50 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</p>
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