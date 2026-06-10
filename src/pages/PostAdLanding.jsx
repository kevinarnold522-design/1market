import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import AddListingModal from '../components/AddListingModal';
import MemberSignupModal from '../components/MemberSignupModal';
import Navbar from '../components/home/Navbar';
import StarField from '../components/StarField';
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  {
    key: 'buysell', label: 'Buy & Sell', iconKey: 'buysell', color: '#8b5cf6',
    emoji: '🛍️', desc: 'Sell products, electronics, cars, real estate',
    subtypes: [
      { label: 'General Product', type: 'product' },
      { label: 'Electronics', type: 'electronics' },
      { label: 'Shoes & Footwear', type: 'shoes' },
      { label: 'Clothing & Apparel', type: 'clothing' },
      { label: 'Furniture', type: 'furniture' },
      { label: 'Home Appliances', type: 'homeappliances' },
      { label: 'Cars & Vehicles', type: 'cars' },
      { label: 'Real Estate', type: 'houses' },
      { label: 'Mods & Customizations', type: 'mods' },
      { label: 'Other / Miscellaneous', type: 'other' },
    ]
  },
  {
    key: 'food', label: 'Food & Beverages', iconKey: 'food', color: '#f97316',
    emoji: '🍜', desc: 'Home kitchen, bakery, carinderia, restaurant',
    subtypes: [{ label: 'Food & Beverages', type: 'food' }]
  },
  {
    key: 'jobs', label: 'Jobs', iconKey: 'jobs', color: '#f59e0b',
    emoji: '💼', desc: 'Full-time, part-time, freelance & remote jobs',
    subtypes: [{ label: 'Job Posting', type: 'jobs' }]
  },
  {
    key: 'rent', label: 'Rent / For Sale', iconKey: 'rent', color: '#10b981',
    emoji: '🏠', desc: 'Rooms, condos, commercial space, vehicles for rent',
    subtypes: [
      { label: 'Property — Rent / Sale / Lease', type: 'rent_lease' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
    ]
  },
  {
    key: 'services', label: 'Services', iconKey: 'services', color: '#3b82f6',
    emoji: '🔧', desc: 'Home repair, IT, creative, professional services',
    subtypes: [{ label: 'Service Listing', type: 'services' }]
  },
  {
    key: 'travel', label: 'Travel & Hotel', iconKey: 'travel', color: '#0ea5e9',
    emoji: '✈️', desc: 'Hotels, tours, resorts, flight packages',
    subtypes: [
      { label: 'Hotel / Accommodation', type: 'hotel' },
      { label: 'Flights / Tour Package', type: 'flights' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
      { label: 'Other Travel', type: 'other' },
    ]
  },
];

export default function PostAdLanding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedKey = searchParams.get('category');

  const [user, setUser] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => {
        setUser(u);
        // If both category and type pre-selected, open modal directly
        if (preselectedKey && typeParam) {
          const cat = CATEGORIES.find(c => c.key === preselectedKey);
          if (cat) {
            setSelectedCat(cat);
            setSelectedType(typeParam);
            setShowModal(true);
          }
        } else if (preselectedKey) {
          const cat = CATEGORIES.find(c => c.key === preselectedKey);
          if (cat) {
            setSelectedCat(cat);
            if (cat.subtypes.length === 1) {
              setSelectedType(cat.subtypes[0].type);
              setShowModal(true);
            }
          }
        }
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const handleSelectSubtype = (cat, type) => {
    if (!user) { setShowSignup(true); return; }
    setSelectedCat(cat);
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCatClick = (cat) => {
    if (!user) { setShowSignup(true); return; }
    if (cat.subtypes.length === 1) {
      setSelectedType(cat.subtypes[0].type);
      setSelectedCat(cat);
      setShowModal(true);
    } else {
      setSelectedCat(selectedCat?.key === cat.key ? null : cat);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
      <StarField />
      <Navbar />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Plus className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="font-body text-xs text-[#00D4FF] font-semibold">Post a New Ad</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">
            What are you listing?
          </h1>
          <p className="font-body text-sm text-white/40">Choose a category to get started</p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <button
                onClick={() => handleCatClick(cat)}
                className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: selectedCat?.key === cat.key ? `${cat.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${selectedCat?.key === cat.key ? cat.color : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: selectedCat?.key === cat.key ? `0 0 20px ${cat.color}30` : 'none',
                }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `${cat.color}20` }}>
                    {cat.emoji}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-white mb-0.5">{cat.label}</p>
                    <p className="font-body text-[10px] text-white/40 leading-snug">{cat.desc}</p>
                  </div>
                </div>
              </button>

              {/* Subcategories — expand inline below card */}
              <AnimatePresence>
                {selectedCat?.key === cat.key && cat.subtypes.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden rounded-xl"
                    style={{ background: `${cat.color}0C`, border: `1px solid ${cat.color}25` }}>
                    <div className="p-3 space-y-1.5">
                      <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold mb-2"
                        style={{ color: cat.color }}>Choose type:</p>
                      {cat.subtypes.map(sub => (
                        <button key={sub.type}
                          onClick={() => handleSelectSubtype(cat, sub.type)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-body text-xs text-white/80 hover:text-white transition-all hover:scale-[1.01] text-left"
                          style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {!user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-10 text-center p-5 rounded-2xl"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="font-body text-sm text-white/50 mb-3">You need an account to post ads</p>
            <button onClick={() => setShowSignup(true)}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
              Create Free Account
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && selectedCat && (
          <AddListingModal
            user={user}
            defaultType={selectedType}
            onClose={() => { setShowModal(false); setSelectedType(''); setSelectedCat(null); }}
          />
        )}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}