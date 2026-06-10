import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/home/Navbar';
import MemberSignupModal from '../components/MemberSignupModal';
import { base44 } from '@/api/base44Client';

const CATEGORY_CONFIG = {
  buysell: {
    label: 'Buy & Sell',
    color: '#8b5cf6',
    emoji: '🛍️',
    desc: 'Sell products, electronics, cars, real estate',
    types: [
      { type: 'product', label: 'General Product', icon: '📦' },
      { type: 'electronics', label: 'Electronics', icon: '📱' },
      { type: 'shoes', label: 'Shoes & Footwear', icon: '👟' },
      { type: 'clothing', label: 'Clothing & Apparel', icon: '👕' },
      { type: 'furniture', label: 'Furniture', icon: '🪑' },
      { type: 'homeappliances', label: 'Home Appliances', icon: '🏠' },
      { type: 'cars', label: 'Cars & Vehicles', icon: '🚗' },
      { type: 'houses', label: 'Real Estate', icon: '🏡' },
      { type: 'mods', label: 'Mods & Customizations', icon: '🔧' },
      { type: 'other', label: 'Other / Miscellaneous', icon: '📋' },
    ]
  },
  jobs: {
    label: 'Jobs',
    color: '#f59e0b',
    emoji: '💼',
    desc: 'Full-time, part-time, freelance & remote jobs',
    types: [
      { type: 'jobs', label: 'Job Posting', icon: '📝' },
    ]
  },
  food: {
    label: 'Food & Beverages',
    color: '#f97316',
    emoji: '🍜',
    desc: 'Home kitchen, bakery, carinderia, restaurant',
    types: [
      { type: 'food', label: 'Food & Beverages', icon: '🍽️' },
    ]
  },
  rent: {
    label: 'Rent / For Sale',
    color: '#10b981',
    emoji: '🏠',
    desc: 'Rooms, condos, commercial space, vehicles for rent',
    types: [
      { type: 'rent_lease', label: 'Property — Rent / Sale / Lease', icon: '🏢' },
      { type: 'vehicle_rental', label: 'Vehicle Rental', icon: '🚙' },
    ]
  },
  services: {
    label: 'Services',
    color: '#3b82f6',
    emoji: '🔧',
    desc: 'Home repair, IT, creative, professional services',
    types: [
      { type: 'services', label: 'Service Listing', icon: '🛠️' },
    ]
  },
  travel: {
    label: 'Travel & Hotel',
    color: '#0ea5e9',
    emoji: '✈️',
    desc: 'Hotels, tours, resorts, flight packages',
    types: [
      { type: 'hotel', label: 'Hotel / Accommodation', icon: '🏨' },
      { type: 'flights', label: 'Flights / Tour Package', icon: '✈️' },
      { type: 'vehicle_rental', label: 'Vehicle Rental', icon: '🚗' },
    ]
  },
};

export default function CategoryTransitionPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  const catConfig = CATEGORY_CONFIG[category];

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) {
        base44.auth.me().then(u => {
          setUser(u);
          setLoading(false);
        }).catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  const handleSelectType = (type) => {
    if (!user) {
      setShowSignup(true);
      return;
    }
    navigate(`/post-ad?category=${category}&type=${type}`);
  };

  if (!catConfig) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Category not found</h1>
            <Link to="/" className="text-[#00D4FF] hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
        <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthorized = user && (user.role === 'admin' || user.user_type === 'seller' || user.user_type === 'business' || user.account_type === 'business_owner');

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${catConfig.color}15`, border: `1px solid ${catConfig.color}30` }}>
            <span className="text-2xl">{catConfig.emoji}</span>
            <span className="font-body text-xs font-semibold" style={{ color: catConfig.color }}>{catConfig.label}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">
            {catConfig.desc}
          </h1>
          <p className="font-body text-sm text-white/40">Select a listing type to continue</p>
        </motion.div>

        {/* Type Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catConfig.types.map((item, i) => (
            <motion.button
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelectType(item.type)}
              className="w-full text-left rounded-2xl p-5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${catConfig.color}30`,
              }}>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-base text-white mb-1">{item.label}</p>
                  <p className="font-body text-xs text-white/40">Click to create this listing</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {!isAuthorized && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-10 p-5 rounded-2xl"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              <p className="font-body text-sm text-amber-200 font-semibold">Account Required</p>
            </div>
            <p className="font-body text-sm text-white/60 mb-4">
              You need a Seller or Business account to post listings. Upgrade your account to continue.
            </p>
            <button onClick={() => setShowSignup(true)}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)' }}>
              Upgrade to Seller Account
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}