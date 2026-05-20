import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Filter, X, ChevronRight, UtensilsCrossed, Coffee, ShoppingBag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';

const businesses = [
  // MANILA - Fast Food Chains
  { id: 1, name: 'Jollibee - Malate Branch', category: 'Fast Food', location: 'Manila', area: 'Malate', address: 'Taft Ave., Malate, Manila', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Jolly Spaghetti', 'Yumburger', 'Peach Mango Pie'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 2, name: 'Jollibee - Recto, Manila', category: 'Fast Food', location: 'Manila', area: 'Recto / U-Belt', address: 'Recto Ave., Manila (near PUP)', hours: '6:00 AM – 11:00 PM', menu: ['Chickenjoy', 'Palabok Fiesta', 'Sundae', 'Burger Steak'], type: 'chain', tag: 'Near University', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { id: 3, name: 'Mang Inasal - Sampaloc', category: 'Fast Food', location: 'Manila', area: 'Sampaloc', address: 'España Blvd., Sampaloc, Manila', hours: '10:00 AM – 10:00 PM', menu: ['Chicken Inasal', 'BBQ Pork', 'Halo-Halo', 'Garlic Rice'], type: 'chain', tag: 'Popular', image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80' },

  // MANILA - Local Eateries / Carinderias
  { id: 4, name: "Aling Nena's Carinderia", category: 'Local Eatery', location: 'Manila', area: 'Tondo', address: 'Near Delpan St., Tondo, Manila', hours: '6:00 AM – 3:00 PM', menu: ['Sinigang na Baboy', 'Adobo', 'Pinakbet', 'Dinuguan'], type: 'carinderia', tag: 'Community Fave', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 5, name: 'Inday Lutong Bahay', category: 'Home Kitchen', location: 'Manila', area: 'Sampaloc', address: 'F. Cayco St., Sampaloc, Manila', hours: '7:00 AM – 2:00 PM', menu: ['Bulalo', 'Kare-Kare', 'Nilaga', 'Arroz Caldo'], type: 'home-kitchen', tag: 'Home Cooked', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 6, name: 'Tita Merly Merienda Hub', category: 'Local Eatery', location: 'Manila', area: 'Binondo', address: 'Ongpin St., Binondo, Manila', hours: '5:30 AM – 1:00 PM', menu: ['Goto', 'Lugaw', 'Dim Sum', 'Kikiam'], type: 'carinderia', tag: 'Historic District', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
  { id: 7, name: "Nanay Sosing's Kakanin", category: 'Native Delicacies', location: 'Manila', area: 'Pandacan', address: 'Pandacan, Manila', hours: '6:00 AM – 12:00 NN', menu: ['Puto', 'Kutsinta', 'Bibingka', 'Palitaw'], type: 'home-kitchen', tag: 'Native Sweets', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80' },
  { id: 8, name: 'Lola Nena Bakery – Sampaloc', category: 'Home Baker', location: 'Manila', area: 'Sampaloc', address: 'Near UST, Sampaloc, Manila', hours: '5:00 AM – 8:00 PM', menu: ['Pastillas', 'Ube Halaya', 'Cassava Cake', 'Biko'], type: 'home-baker', tag: 'Home Baker', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80' },
  { id: 9, name: 'U-Belt Lutong Ulam', category: 'Local Eatery', location: 'Manila', area: 'Recto / U-Belt', address: 'Near Far Eastern University, Manila', hours: '7:00 AM – 5:00 PM', menu: ['Menudo', 'Caldereta', 'Mechado', 'Paksiw'], type: 'carinderia', tag: 'Student Fave', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },
  { id: 10, name: 'Roxas Blvd. Seafood Grill', category: 'Local Eatery', location: 'Manila', area: 'Roxas Boulevard', address: 'Roxas Blvd., Manila (near CCP)', hours: '5:00 PM – 2:00 AM', menu: ['Inihaw na Pusit', 'Grilled Liempo', 'Buco Juice', 'Oysters'], type: 'carinderia', tag: 'Night Eats', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 11, name: 'Healthy Meals Manila', category: 'Meal Prep', location: 'Manila', area: 'Ermita', address: 'Delivers across Metro Manila', hours: 'Orders: 8:00 AM – 5:00 PM', menu: ['Grilled Chicken Bowl', 'Veggie Wraps', 'Brown Rice Meals', 'Salad Box'], type: 'home-kitchen', tag: 'Delivery', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
  { id: 12, name: 'QC–Manila Border Lutuan', category: 'Local Eatery', location: 'Manila', area: 'Quezon City Border', address: 'E. Rodriguez Sr. Ave. area', hours: '8:00 AM – 8:00 PM', menu: ['Lechon Kawali', 'Kare-Kare', 'Chopsuey', 'Halo-Halo'], type: 'carinderia', tag: 'Family-Owned', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80' },

  // CAVITE - Fast Food Chains
  { id: 13, name: 'Jollibee - Molino Blvd.', category: 'Fast Food', location: 'Cavite', area: 'Bacoor', address: 'Molino Blvd., Bacoor, Cavite', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Burger Steak', 'Spaghetti', 'Peach Mango Pie'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 14, name: 'Jollibee - Aguinaldo Hwy., Cavite', category: 'Fast Food', location: 'Cavite', area: 'Imus', address: 'Aguinaldo Hwy., Imus, Cavite', hours: '6:00 AM – 11:00 PM', menu: ['Chickenjoy', 'Jolly Hotdog', 'Rice Meal', 'Sundae'], type: 'chain', tag: 'Busy Branch', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { id: 15, name: 'Jollibee - Dasmariñas City', category: 'Fast Food', location: 'Cavite', area: 'Dasmariñas', address: 'Congressional Rd., Dasmariñas, Cavite', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Palabok', 'Yumburger', 'Jolly Crispy Fries'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80' },

  // CAVITE - Local Gems
  { id: 16, name: 'Silang Roadside Coffee Pop-Up', category: 'Specialty Coffee', location: 'Cavite', area: 'Silang', address: 'Aguinaldo Hwy., near Silang public market', hours: '5:00 AM – 10:00 AM', menu: ['Kapeng Barako', 'Brewed Liberica', 'Tablea Hot Choco', 'Pandesal'], type: 'coffee', tag: 'Cavite Gem', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: 17, name: "Tagaytay Kapeng Barako Stand", category: 'Specialty Coffee', location: 'Cavite', area: 'Tagaytay', address: 'Near Peoples Park in the Sky, Tagaytay', hours: '6:00 AM – 6:00 PM', menu: ['Barako Brewed', 'Iced Barako Latte', 'Bibingka', 'Puto Bumbong'], type: 'coffee', tag: 'Must Try', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
  { id: 18, name: 'Kawit Seafood Grill Stall', category: 'Local Eatery', location: 'Cavite', area: 'Kawit', address: 'Near Kawit Fish Port, Kawit, Cavite', hours: '11:00 AM – 9:00 PM', menu: ['Grilled Bangus', 'Sinugbang Pusit', 'Talaba', 'Kinilaw'], type: 'carinderia', tag: 'Fresh Seafood', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 19, name: 'Noveleta Bagnet House', category: 'Local Eatery', location: 'Cavite', area: 'Noveleta', address: 'Noveleta-Rosario Rd., Noveleta, Cavite', hours: '9:00 AM – 8:00 PM', menu: ['Bagnet', 'Crispy Pata', 'Dinengdeng', 'Bagoong Rice'], type: 'carinderia', tag: 'Local Fave', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 20, name: 'Gen. Trias Kakanin Makers', category: 'Native Delicacies', location: 'Cavite', area: 'General Trias', address: 'Gov. D. Mangubat Ave., Gen. Trias', hours: '5:00 AM – 11:00 AM', menu: ['Puto Pao', 'Sapin-Sapin', 'Ube Kalamay', 'Bibingka'], type: 'home-baker', tag: 'Native Delicacies', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80' },
  { id: 21, name: 'Imus Sari-Sari Merienda Hub', category: 'Sari-Sari Store', location: 'Cavite', area: 'Imus', address: 'Bayan Luma, Imus, Cavite', hours: '6:00 AM – 9:00 PM', menu: ['Fish Balls', 'Kikiam', 'Buko Juice', 'Ice Candy'], type: 'carinderia', tag: 'Street Snacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 22, name: "Bacoor Home Kitchen – Aling Fe's", category: 'Home Kitchen', location: 'Cavite', area: 'Bacoor', address: 'Habay, Bacoor, Cavite', hours: '7:00 AM – 3:00 PM', menu: ['Tinolang Manok', 'Menudo', 'Chicken Pochero', 'Sinigang'], type: 'home-kitchen', tag: 'Home Cooked', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },
  { id: 23, name: 'Dasmariñas Lutong Bahay Catering', category: 'Catering', location: 'Cavite', area: 'Dasmariñas', address: 'Dasmariñas City, Cavite', hours: 'By appointment', menu: ['Lechon Baboy', 'Pancit Palabok', 'Kare-Kare', 'Leche Flan'], type: 'home-kitchen', tag: 'Catering', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80' },
];

const categoryTypes = [
  { key: 'chain', label: 'Fast Food Chains', icon: '🍔' },
  { key: 'carinderia', label: 'Local Eateries / Carinderias', icon: '🥘' },
  { key: 'home-baker', label: 'Home Bakers', icon: '🍰' },
  { key: 'coffee', label: 'Specialty Coffee', icon: '☕' },
  { key: 'home-kitchen', label: 'Home Kitchens', icon: '🍲' },
];

function BusinessCard({ biz, onRate }) {
  const locationColor = biz.location === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={biz.image} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${locationColor}`}>
            📍 {biz.location}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#0A192F]">{biz.tag}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-bold text-base text-[#0A192F] leading-tight">{biz.name}</h3>
        </div>
        <p className="font-body text-xs text-[#2563EB] font-semibold mb-1">{biz.category} · {biz.area}</p>
        <p className="font-body text-xs text-[#0A192F]/50 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {biz.address}
        </p>
        <p className="font-body text-xs text-[#0A192F]/40 mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {biz.hours}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {biz.menu.slice(0, 3).map((item, i) => (
            <span key={i} className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/60 text-[10px] rounded-full border border-[#0A192F]/5">{item}</span>
          ))}
          {biz.menu.length > 3 && <span className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/40 text-[10px] rounded-full border border-[#0A192F]/5">+{biz.menu.length - 3} more</span>}
        </div>
        <button
          onClick={() => onRate(biz)}
          className="w-full py-2 rounded-xl bg-[#0A192F]/5 hover:bg-[#2563EB] hover:text-white text-[#0A192F]/60 font-body text-xs font-semibold transition-all duration-200"
        >
          ⭐ Rate this Business
        </button>
      </div>
    </motion.div>
  );
}

function RateModal({ biz, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-1">Thank you!</h3>
            <p className="font-body text-sm text-[#0A192F]/50 mb-4">Your rating has been submitted. Become a member to save your reviews!</p>
            <button onClick={onClose} className="w-full py-2.5 bg-[#0A192F] text-white rounded-xl font-body font-semibold text-sm">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-1">Rate this Business</h3>
            <p className="font-body text-sm text-[#0A192F]/50 mb-4">{biz.name}</p>
            <div className="flex gap-2 mb-4 justify-center">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-3xl transition-transform hover:scale-110 ${s <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="w-full border border-[#0A192F]/10 rounded-xl p-3 text-sm font-body text-[#0A192F] resize-none h-20 focus:outline-none focus:border-[#2563EB] mb-4"
            />
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body font-semibold text-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={rating === 0}
                className="flex-1 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-colors">
                Submit
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Food() {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [activeTypes, setActiveTypes] = useState([]);
  const [ratingBiz, setRatingBiz] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (key) => {
    setActiveTypes(prev => prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]);
  };

  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.area.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    const matchLoc = locationFilter === 'All' || b.location === locationFilter;
    const matchType = activeTypes.length === 0 || activeTypes.includes(b.type);
    return matchSearch && matchLoc && matchType;
  });

  const manilaCount = filtered.filter(b => b.location === 'Manila').length;
  const caviteCount = filtered.filter(b => b.location === 'Cavite').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Food Directory</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">Manila & Cavite Food</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Real local businesses — from fast food chains to hidden carinderias, home kitchens, and barako coffee stands.</p>
          </motion.div>

          {/* Sign Up CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <span className="font-body text-sm text-white/70">Want to rate businesses?</span>
            <button onClick={() => setShowSignup(true)} className="px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
              Join Free →
            </button>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Jollibee, local carinderias, or home bakers in Cavite and Manila..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Location Tabs + Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {['All', 'Manila', 'Cavite'].map(loc => (
              <button key={loc} onClick={() => setLocationFilter(loc)}
                className={`px-5 py-2 rounded-full font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
                {loc === 'Manila' ? `🗺️ Manila (${manilaCount})` : loc === 'Cavite' ? `🏝️ Cavite (${caviteCount})` : `All (${filtered.length})`}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0A192F]/10 rounded-full font-body text-sm text-[#0A192F]/60 hover:border-[#2563EB]/30 transition-all">
            <Filter className="w-3.5 h-3.5" /> Filters {activeTypes.length > 0 && <span className="w-4 h-4 bg-[#2563EB] text-white rounded-full text-[10px] flex items-center justify-center">{activeTypes.length}</span>}
          </button>
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white rounded-2xl border border-[#0A192F]/5 p-4">
              <p className="font-body text-xs uppercase tracking-wider text-[#0A192F]/40 mb-3">Filter by Type</p>
              <div className="flex flex-wrap gap-2">
                {categoryTypes.map(ct => (
                  <button key={ct.key} onClick={() => toggleType(ct.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${activeTypes.includes(ct.key) ? 'bg-[#0A192F] text-white' : 'bg-[#F8FAFC] text-[#0A192F]/60 border border-[#0A192F]/10 hover:border-[#0A192F]/20'}`}>
                    {ct.icon} {ct.label}
                  </button>
                ))}
                {activeTypes.length > 0 && (
                  <button onClick={() => setActiveTypes([])} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body text-red-500 border border-red-100 hover:bg-red-50 transition-all">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((biz, i) => (
              <BusinessCard key={biz.id} biz={biz} onRate={setRatingBiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <UtensilsCrossed className="w-10 h-10 text-[#0A192F]/20 mx-auto mb-3" />
            <p className="font-body text-[#0A192F]/40">No businesses found for "{search}"</p>
          </div>
        )}

        {/* Become a Member CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 bg-[#0A192F] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Rate & Save Your Favorites</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">Become a free member to rate businesses, write reviews, and save your go-to spots across Manila and Cavite.</p>
          <button onClick={() => setShowSignup(true)}
            className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Sign Up Free — It's 100% Free
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {ratingBiz && <RateModal biz={ratingBiz} onClose={() => setRatingBiz(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}