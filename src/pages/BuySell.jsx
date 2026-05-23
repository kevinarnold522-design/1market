import React, { useState } from 'react';
import StarField from '../components/StarField';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, X, ChevronDown, MapPin, Phone, MessageSquare, AlertCircle, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';

const SUBCATEGORIES = [
  { key: 'shoes', label: 'Shoes', icon: '👟', desc: 'Sneakers, footwear & more' },
  { key: 'cars', label: 'Cars & Vehicles', icon: '🚗', desc: 'Sedans, SUVs, motorcycles' },
  { key: 'houses', label: 'Houses & Real Estate', icon: '🏠', desc: 'Homes, lots, condos' },
  { key: 'services', label: 'Services', icon: '🔧', desc: 'Freelancers, repairs & more' },
];

const listings = [
  // SHOES
  { id: 1, type: 'shoes', title: 'Nike Air Force 1 Low', brand: 'Nike', model: 'Air Force 1 Low', size: 'US 10', condition: 'Like New', price: 2800, location: 'Manila', area: 'Makati', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', description: 'Worn twice only. No creases. Original box included.' },
  { id: 2, type: 'shoes', title: 'Adidas Ultraboost 22', brand: 'Adidas', model: 'Ultraboost 22', size: 'US 9', condition: 'Brand New', price: 5500, location: 'Cavite', area: 'Bacoor', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', description: 'Sealed box, no tag removed. Limited stock.' },
  { id: 3, type: 'shoes', title: 'Jordan 1 Mid', brand: 'Jordan', model: 'AJ1 Mid', size: 'US 8.5', condition: 'Used', price: 3200, location: 'Manila', area: 'Quezon City', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=500&q=80', description: 'Soles still clean. Minor scuff on midsole.' },
  { id: 4, type: 'shoes', title: 'Vans Old Skool Black/White', brand: 'Vans', model: 'Old Skool', size: 'US 9', condition: 'Like New', price: 1800, location: 'Cavite', area: 'Imus', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80', description: 'Classic colorway, barely worn.' },

  // CARS
  { id: 5, type: 'cars', title: '2019 Toyota Vios 1.3E AT', brand: 'Toyota', model: 'Vios 1.3E', year: 2019, mileage: '48,000 KM', transmission: 'Automatic', price: 620000, location: 'Manila', area: 'Parañaque', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&q=80', description: 'First owner. Complete documents. No major accidents. Selling as is.' },
  { id: 6, type: 'cars', title: '2017 Honda Civic RS Turbo', brand: 'Honda', model: 'Civic RS Turbo', year: 2017, mileage: '65,000 KM', transmission: 'Automatic', price: 760000, location: 'Cavite', area: 'Dasmariñas', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80', description: 'All stock. Regularly maintained at Honda dealer.' },
  { id: 7, type: 'cars', title: '2020 Mitsubishi Montero Sport GLS', brand: 'Mitsubishi', model: 'Montero Sport GLS', year: 2020, mileage: '35,000 KM', transmission: 'Automatic', price: 1280000, location: 'Manila', area: 'Taguig', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80', description: 'Second owner. Pristine condition. All accessories complete.' },
  { id: 8, type: 'cars', title: '2018 Toyota Fortuner G 4x2', brand: 'Toyota', model: 'Fortuner G 4x2', year: 2018, mileage: '72,000 KM', transmission: 'Automatic', price: 1050000, location: 'Cavite', area: 'Imus', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&q=80', description: 'Family use only. No flood, no accident.' },

  // HOUSES
  { id: 9, type: 'houses', title: 'Townhouse for Sale – Molino, Bacoor', propertyType: 'Townhouse', lot: '48 sqm', bedrooms: 3, bathrooms: 2, status: 'Ready For Occupancy', price: 2850000, location: 'Cavite', area: 'Bacoor', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80', description: 'Corner lot. 2-storey. Near SM Bacoor. Titlted. Clean documents.' },
  { id: 10, type: 'houses', title: 'Vacant Lot – General Trias, Cavite', propertyType: 'Vacant Lot', lot: '200 sqm', bedrooms: null, bathrooms: null, status: 'Ready For Occupancy', price: 1600000, location: 'Cavite', area: 'General Trias', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', description: 'Residential zone. Near highway. Titled lot with clean docs.' },
  { id: 11, type: 'houses', title: '3BR Condo – Taft Ave., Manila', propertyType: 'Condominium', lot: '65 sqm', bedrooms: 3, bathrooms: 2, status: 'Ready For Occupancy', price: 4200000, location: 'Manila', area: 'Malate', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80', description: 'Mid-floor unit. Furnished. Near LRT. Pets allowed.' },
  { id: 12, type: 'houses', title: 'Pre-Selling House – Tanza, Cavite', propertyType: 'House & Lot', lot: '100 sqm', bedrooms: 4, bathrooms: 3, status: 'Pre-selling', price: 3500000, location: 'Cavite', area: 'Tanza', seller: 'Direct Owner', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80', description: 'Pre-selling. Model unit available for viewing. 10% DP to move in.' },

  // SERVICES
  { id: 13, type: 'services', title: 'Aircon Cleaning & Repair', provider: 'Mang Ernie AC Services', serviceArea: 'Both', rate: '₱500–₱1,200/unit', location: 'Cavite', area: 'Imus', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', description: 'Licensed technician. Cleaning, regas, repair. Free checkup.' },
  { id: 14, type: 'services', title: 'Freelance Graphic Designer', provider: 'John Paulo D.', serviceArea: 'Both', rate: '₱1,500/project', location: 'Manila', area: 'Quezon City', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80', description: 'Social media posts, logos, tarpaulin. Fast turnaround.' },
  { id: 15, type: 'services', title: 'Plumbing & Electrical Works', provider: 'Kuya Romy Repairs', serviceArea: 'Manila Only', rate: '₱800/day', location: 'Manila', area: 'Tondo', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80', description: 'Residential only. Faucet replacement, rewiring, outlets.' },
  { id: 16, type: 'services', title: 'Home Tutoring – Math & Science', provider: 'Ms. Kristine V.', serviceArea: 'Cavite Only', rate: '₱250/hour', location: 'Cavite', area: 'Bacoor', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', description: 'Grade 1–10 levels. Available weekday afternoons.' },
  { id: 17, type: 'services', title: 'Car Detailing & Wrapping', provider: 'AutoClean Cavite', serviceArea: 'Cavite Only', rate: '₱800–₱3,000/session', location: 'Cavite', area: 'Dasmariñas', image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=500&q=80', description: 'Full detail, PPF wrap, tint. Shop-based service.' },
];

const SORT_OPTIONS = ['Latest Listings', 'Price: Low to High', 'Price: High to Low'];
const CONDITIONS = ['Brand New', 'Like New', 'Used'];

function ListingCard({ item, onExpand, onContact }) {
  const formatPrice = (p) => `₱${p.toLocaleString()}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button onClick={() => onExpand(item)} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <ZoomIn className="w-4 h-4 text-[#0A192F]" />
        </button>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.location === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
            📍 {item.area}
          </span>
          {item.status && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Ready For Occupancy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
          )}
          {item.condition && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#0A192F]">{item.condition}</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-base text-[#0A192F] mb-1 leading-tight">{item.title}</h3>

        {/* Type-specific details */}
        {item.type === 'cars' && (
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.year}</span>
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.mileage}</span>
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.transmission}</span>
          </div>
        )}
        {item.type === 'houses' && (
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.propertyType}</span>
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">Lot: {item.lot}</span>
            {item.bedrooms && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.bedrooms}BR · {item.bathrooms}Bath</span>}
          </div>
        )}
        {item.type === 'shoes' && (
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.brand}</span>
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">Size {item.size}</span>
          </div>
        )}
        {item.type === 'services' && (
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.provider}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.serviceArea === 'Both' ? 'bg-purple-100 text-purple-700' : item.serviceArea === 'Manila Only' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.serviceArea}</span>
          </div>
        )}

        <p className="font-body text-xs text-[#0A192F]/50 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-[#0A192F]">
            {item.type === 'services' ? item.rate : formatPrice(item.price)}
          </span>
          <button onClick={() => onContact(item)}
            className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-lg font-body text-xs font-semibold transition-colors">
            Contact Seller
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ContactModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-28 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30">✕</button>
          <p className="absolute bottom-3 left-4 font-heading font-bold text-white text-sm">{item.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#2563EB] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call Seller
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> SMS Text
            </button>
          </div>
          <button className="w-full py-2.5 border border-[#2563EB]/30 text-[#2563EB] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
            💬 Chat via 1Market Member Portal
          </button>
          <div className="flex items-start gap-2 pt-1 bg-amber-50 p-3 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="font-body text-[10px] text-amber-700">Please verify documents directly with the seller before making any payment or transaction.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImageModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={item.image} alt={item.title}
        className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
    </motion.div>
  );
}

export default function BuySell() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest Listings');
  const [search, setSearch] = useState('');
  const [contactItem, setContactItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = listings
    .filter(l => {
      const matchCat = !activeCategory || activeCategory === 'all' || l.type === activeCategory;
      const matchLoc = locationFilter === 'All' || l.location === locationFilter;
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || (l.area && l.area.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchLoc && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'Price: High to Low') return (b.price || 0) - (a.price || 0);
      return b.id - a.id;
    });

  const BUY_SUBCATEGORIES = [
    { key: 'all', label: 'All Listings', icon: '🛒', desc: 'Browse everything' },
    ...SUBCATEGORIES,
  ];

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <SubcategorySplash
        subcategories={BUY_SUBCATEGORIES}
        activeKey={activeCategory}
        onSelect={setActiveCategory}
        title="What are you looking for?"
        subtitle="Select a category to browse listings"
      />
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Buy & Sell</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">Buy & Sell Marketplace</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Shoes, cars, houses, and services — listed by real people in Manila and Cavite.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <span className="font-body text-sm text-white/70">Want to post a listing?</span>
            <button onClick={() => setShowSignup(true)} className="px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
              Join Free →
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Subcategory Filter Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button onClick={() => setActiveCategory('all')}
            className={`p-4 rounded-2xl text-left transition-all border ${activeCategory === 'all' ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-[#0A192F]/5 hover:border-[#0A192F]/20'}`}>
            <div className="text-2xl mb-1">🛒</div>
            <p className={`font-heading font-bold text-sm ${activeCategory === 'all' ? 'text-white' : 'text-[#0A192F]'}`}>All Listings</p>
            <p className={`font-body text-xs ${activeCategory === 'all' ? 'text-white/60' : 'text-[#0A192F]/40'}`}>Browse everything</p>
          </button>
          {SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveCategory(sc.key)}
              className={`p-4 rounded-2xl text-left transition-all border ${activeCategory === sc.key ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-[#0A192F]/5 hover:border-[#0A192F]/20'}`}>
              <div className="text-2xl mb-1">{sc.icon}</div>
              <p className={`font-heading font-bold text-sm ${activeCategory === sc.key ? 'text-white' : 'text-[#0A192F]'}`}>{sc.label}</p>
              <p className={`font-body text-xs ${activeCategory === sc.key ? 'text-white/60' : 'text-[#0A192F]/40'}`}>{sc.desc}</p>
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]/30" />
          </div>
          <div className="flex gap-2">
            {['All', 'Manila', 'Cavite'].map(loc => (
              <button key={loc} onClick={() => setLocationFilter(loc)}
                className={`px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
                {loc}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F]/60 hover:border-[#0A192F]/20 transition-all">
              {sortBy} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-[#0A192F]/10 rounded-xl shadow-lg z-10 overflow-hidden min-w-[200px]">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 font-body text-sm hover:bg-[#F8FAFC] transition-colors ${sortBy === opt ? 'text-[#2563EB] font-semibold' : 'text-[#0A192F]/70'}`}>
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <ListingCard key={item.id} item={item} onExpand={setExpandedItem} onContact={setContactItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-body text-[#0A192F]/40">No listings found.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-amber-700">Please verify all documents and item conditions directly with the seller before making any payment or transaction. 1Market.ph is a listing directory and is not responsible for individual transactions.</p>
        </div>

        {/* Post CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 bg-[#0A192F] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Got Something to Sell?</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">Become a free member and post your listings for shoes, cars, homes, or services — reach buyers across Manila and Cavite.</p>
          <button onClick={() => setShowSignup(true)} className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Sign Up Free & Post a Listing
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {contactItem && <ContactModal item={contactItem} onClose={() => setContactItem(null)} />}
        {expandedItem && <ImageModal item={expandedItem} onClose={() => setExpandedItem(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}