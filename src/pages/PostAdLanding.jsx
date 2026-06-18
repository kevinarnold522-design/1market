import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import AddListingModal from '../components/AddListingModal';
import MemberSignupModal from '../components/MemberSignupModal';
import StarField from '../components/StarField';

// Matches PostListingMenu categories exactly
const CATEGORIES = [
  {
    key: 'buysell', label: 'Buy & Sell', iconKey: 'buysell', color: '#8b5cf6',
    desc: 'Sell products, electronics, cars, real estate',
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
    key: 'jobs', label: 'Jobs', iconKey: 'jobs', color: '#f59e0b',
    desc: 'Full-time, part-time, freelance & remote jobs',
    subtypes: [
      { label: 'Customer Service / BPO', type: 'jobs', subcategory: 'Customer Service Rep' },
      { label: 'Tech & IT', type: 'jobs', subcategory: 'Software Engineer' },
      { label: 'Healthcare', type: 'jobs', subcategory: 'Staff Nurse (RN)' },
      { label: 'Delivery Rider', type: 'jobs', subcategory: 'Delivery Rider' },
      { label: 'Virtual Assistant', type: 'jobs', subcategory: 'Virtual Assistant (VA)' },
      { label: 'Other Job', type: 'jobs', subcategory: 'Other / Not Listed' },
    ]
  },
  {
    key: 'food', label: 'Food', iconKey: 'food', color: '#f97316',
    desc: 'Home kitchen, bakery, carinderia, restaurant',
    subtypes: [
      { label: 'Home Kitchen', type: 'food', subcategory: 'Homemade Meals' },
      { label: 'Bakery / Pastries', type: 'food', subcategory: 'Home Bakery' },
      { label: 'Restaurant / Fast Food', type: 'food', subcategory: 'Quick Service Restaurant' },
      { label: 'Catering', type: 'food', subcategory: 'Event Catering' },
      { label: 'Drinks / Coffee / Milk Tea', type: 'food', subcategory: 'Beverages & Drinks' },
      { label: 'Other Food', type: 'food', subcategory: 'Other / Type Manually' },
    ]
  },
  {
    key: 'rent', label: 'Rent / For Sale', iconKey: 'rent', color: '#10b981',
    desc: 'Rooms, condos, commercial space, vehicles for rent',
    subtypes: [
      { label: 'Property — Rent / Sale / Lease', type: 'rent_lease' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
    ]
  },
  {
    key: 'services', label: 'Services', iconKey: 'services', color: '#3b82f6',
    desc: 'Home repair, IT, creative, professional services',
    subtypes: [
      { label: 'Home Services', type: 'services', subcategory: 'House Cleaning' },
      { label: 'Tech & Digital', type: 'services', subcategory: 'Website Development' },
      { label: 'Beauty & Wellness', type: 'services', subcategory: 'Massage Services' },
      { label: 'Events & Catering', type: 'services', subcategory: 'Event Planning' },
      { label: 'Professional Services', type: 'services', subcategory: 'Accounting' },
      { label: 'Transport & Delivery', type: 'services', subcategory: 'Delivery Services' },
      { label: 'Other Service', type: 'services', subcategory: 'Other / Type Manually' },
    ]
  },
  {
    key: 'travel', label: 'Travel / Hotel', iconKey: 'travel', color: '#0ea5e9',
    desc: 'Hotels, tours, resorts, flight packages',
    subtypes: [
      { label: 'Hotel / Accommodation', type: 'hotel' },
      { label: 'Flights / Tour Package', type: 'flights' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
    ]
  },
];

export default function PostAdLanding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedKey = searchParams.get('category');
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(user);

  const [selectedCat, setSelectedCat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    setCurrentUser(user);
    if (user) base44.auth.me().then(setCurrentUser).catch(() => {});
  }, [user]);

  const userType = currentUser?.user_type;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isBusinessAccount = userType === 'business' || currentUser?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || currentUser?.is_seller || isBusinessAccount;
  const isBlockedUserType = userType === 'rider' || (userType === 'customer' && !isSellerAccount);
  const canPost = !!currentUser && !isBlockedUserType && (isAdmin || isSellerAccount);

  useEffect(() => {
    if (!canPost || !preselectedKey) return;
    const cat = CATEGORIES.find(c => c.key === preselectedKey);
    if (cat) setSelectedCat(cat);
  }, [canPost, preselectedKey]);

  const handleSelectSubtype = (cat, subtype) => {
    if (!canPost) return;
    setSelectedCat(cat);
    setSelectedType(subtype.type);
    setSelectedSubcategory(subtype.subcategory || '');
    setShowModal(true);
  };

  const handleCatClick = (cat) => {
    if (!canPost) return;
    setSelectedCat(selectedCat?.key === cat.key ? null : cat);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
      <StarField />
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
          <p className="font-body text-sm text-white/40">Choose a category, then pick a subcategory before creating your listing</p>
        </motion.div>

        {!canPost && (
          <div className="mb-8 text-center p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p className="font-body text-sm text-white/65">Post an Ad is available for seller, business, and admin accounts only.</p>
          </div>
        )}

        {/* Category Grid */}
        {canPost && <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cat.color}20` }}>
                    <CategoryIcon name={cat.iconKey} size={18} color={cat.color} />
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
                        <button key={`${sub.type}-${sub.label}`}
                          onClick={() => handleSelectSubtype(cat, sub)}
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
        </div>}

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
        {showModal && selectedCat && canPost && (
          <AddListingModal
            user={currentUser}
            defaultType={selectedType}
            defaultSubcategory={selectedSubcategory}
            onClose={() => { setShowModal(false); setSelectedType(''); setSelectedSubcategory(''); setSelectedCat(null); }}
          />
        )}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}