import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShoppingBag, Briefcase, UtensilsCrossed, Home, Wrench, Plane, Package, Smartphone, Shirt, Footprints, Building2, Zap, Settings, MoreHorizontal, Hotel, Car, Building, BedDouble } from 'lucide-react';
import MemberSignupModal from '../components/MemberSignupModal';
import AddListingModal from '../components/AddListingModal';
import CategoryCreationAnimation from '@/components/transitions/CategoryCreationAnimation';
import { base44 } from '@/api/base44Client';

const CATEGORY_CONFIG = {
  buysell: {
    label: 'Buy & Sell',
    color: '#8b5cf6',
    Icon: ShoppingBag,
    desc: 'Sell products, electronics, cars, real estate',
    types: [
      { type: 'product',       label: 'General Product',         Icon: Package },
      { type: 'electronics',   label: 'Electronics',             Icon: Smartphone },
      { type: 'shoes',         label: 'Shoes & Footwear',        Icon: Footprints },
      { type: 'clothing',      label: 'Clothing & Apparel',      Icon: Shirt },
      { type: 'furniture',     label: 'Furniture',               Icon: Home },
      { type: 'homeappliances',label: 'Home Appliances',         Icon: Zap },
      { type: 'cars',          label: 'Cars & Vehicles',         Icon: Car },
      { type: 'houses',        label: 'Real Estate',             Icon: Building2 },
      { type: 'mods',          label: 'Mods & Customizations',   Icon: Settings },
      { type: 'other',         label: 'Other / Miscellaneous',   Icon: MoreHorizontal },
    ]
  },
  jobs: {
    label: 'Jobs',
    color: '#f59e0b',
    Icon: Briefcase,
    desc: 'Full-time, part-time, freelance & remote jobs',
    types: [
      { type: 'jobs', label: 'Job Posting', Icon: Briefcase },
    ]
  },
  food: {
    label: 'Food & Beverages',
    color: '#f97316',
    Icon: UtensilsCrossed,
    desc: 'Home kitchen, bakery, carinderia, restaurant',
    types: [
      { type: 'food', label: 'Food & Beverages', Icon: UtensilsCrossed },
    ]
  },
  rent: {
    label: 'Rent / For Sale',
    color: '#10b981',
    Icon: Home,
    desc: 'Rooms, condos, commercial space, vehicles for rent',
    types: [
      { type: 'rent_lease',     label: 'Property — Rent / Sale / Lease', Icon: Building },
      { type: 'vehicle_rental', label: 'Vehicle Rental',                  Icon: Car },
    ]
  },
  services: {
    label: 'Services',
    color: '#3b82f6',
    Icon: Wrench,
    desc: 'Home repair, IT, creative, professional services',
    types: [
      { type: 'services', label: 'Service Listing', Icon: Wrench },
    ]
  },
  travel: {
    label: 'Travel & Hotel',
    color: '#0ea5e9',
    Icon: Plane,
    desc: 'Hotels, tours, resorts, flight packages',
    types: [
      { type: 'hotel',          label: 'Hotel / Accommodation',   Icon: Hotel },
      { type: 'flights',        label: 'Flights / Tour Package',  Icon: Plane },
      { type: 'vehicle_rental', label: 'Vehicle Rental',          Icon: Car },
    ]
  },
};

export default function CategoryTransitionPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Read ?type= param to auto-open a specific type
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedType = urlParams.get('type');

  const catConfig = CATEGORY_CONFIG[category];

  useEffect(() => {
    // Also check ghost session
    const ghost = (() => { try { return JSON.parse(sessionStorage.getItem('1m_ghost_session')); } catch { return null; } })();
    if (ghost) {
      setUser(ghost);
      setLoading(false);
      if (preselectedType) { setModalType(preselectedType); setShowModal(true); }
      return;
    }
    base44.auth.isAuthenticated().then(ok => {
      if (ok) {
        base44.auth.me().then(u => {
          setUser(u);
          setLoading(false);
          // Auto-open modal immediately when type is preselected — skip the selection screen
          if (preselectedType) {
            setModalType(preselectedType);
            setShowModal(true);
          }
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
    setModalType(type);
    setShowModal(true);
  };

  if (!catConfig) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#38bdf8 0%,#2563EB 100%)' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#38bdf8 0%,#2563EB 100%)' }}>
        <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthorized = !!user;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg,#38bdf8 0%,#2563EB 100%)' }}>
      <CategoryCreationAnimation category={category} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${catConfig.color}15`, border: `1px solid ${catConfig.color}30` }}>
            {catConfig.Icon && <catConfig.Icon className="w-5 h-5" style={{ color: catConfig.color }} />}
            <span className="font-body text-xs font-semibold" style={{ color: catConfig.color }}>{catConfig.label}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">
            {catConfig.desc}
          </h1>
          <p className="font-body text-sm text-white/40">Select a listing type to continue</p>
          <Link to={`/post-ad?category=${category}`} className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-[#FFD700] text-[#2563EB] font-body font-bold text-sm shadow-lg hover:scale-105 transition-transform">
            Post a Listing
          </Link>
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
                <div className="p-3 rounded-xl" style={{ background: `${catConfig.color}18` }}>
                  {item.Icon && <item.Icon className="w-7 h-7" style={{ color: catConfig.color }} />}
                </div>
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
              Create or sign in to any account type to post listings.
            </p>
            <button onClick={() => setShowSignup(true)}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-[#2563EB] transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FFF7CC)' }}>
              Create or Sign In
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
        {showModal && user && (
          <AddListingModal
            user={user}
            defaultType={modalType}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}