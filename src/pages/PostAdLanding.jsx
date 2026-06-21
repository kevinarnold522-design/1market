import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { getGhostSession } from '@/lib/ghostAccounts';
import { SUBCATEGORIES } from '@/lib/listingCategories';
import AddListingModal from '../components/AddListingModal';
import MemberSignupModal from '../components/MemberSignupModal';
import StarField from '../components/StarField';
import ListingLandingBrandBar from '@/components/listing/ListingLandingBrandBar';

const CATEGORIES = [
  {
    key: 'buysell', label: 'Buy & Sell', iconKey: 'buysell', color: '#8b5cf6',
    desc: 'Products, electronics, cars, homes, appliances and more',
    types: [
      ['product', 'General Product'], ['electronics', 'Electronics'], ['shoes', 'Shoes & Footwear'],
      ['clothing', 'Clothing & Apparel'], ['furniture', 'Furniture'], ['homeappliances', 'Home Appliances'],
      ['cars', 'Cars & Vehicles'], ['houses', 'Real Estate'], ['mods', 'Mods & Customizations'], ['other', 'Other / Miscellaneous'],
    ]
  },
  {
    key: 'food', label: 'Food', iconKey: 'food', color: '#f97316',
    desc: 'Home kitchen, bakery, carinderia, restaurants, drinks and catering',
    types: [['food', 'Food & Beverages']]
  },
  {
    key: 'travel', label: 'Travel / Hotel', iconKey: 'travel', color: '#0ea5e9',
    desc: 'Hotels, flights, tour packages and vehicle rentals',
    types: [['hotel', 'Hotel / Accommodation'], ['flights', 'Flights / Tour Package'], ['vehicle_rental', 'Vehicle Rental']]
  },
  {
    key: 'rent', label: 'Rent / For Sale / Lease', iconKey: 'rent', color: '#10b981',
    desc: 'Rooms, condos, houses, commercial spaces, venues and vehicles',
    types: [['rent_lease', 'Property — Rent / Sale / Lease'], ['vehicle_rental', 'Vehicle Rental']]
  },
  {
    key: 'services', label: 'Services', iconKey: 'services', color: '#3b82f6',
    desc: 'Home, tech, creative, beauty, logistics and professional services',
    types: [['services', 'Service Listing']]
  },
  {
    key: 'jobs', label: 'Jobs', iconKey: 'jobs', color: '#f59e0b',
    desc: 'Full-time, part-time, freelance, remote and local jobs',
    types: [['jobs', 'Job Posting']]
  },
];

export default function PostAdLanding() {
  const [searchParams] = useSearchParams();
  const preselectedKey = searchParams.get('category');
  const { user } = useAuth();
  const [ghostUser, setGhostUser] = useState(getGhostSession());
  const [currentUser, setCurrentUser] = useState(getGhostSession() || user);
  const [selectedCat, setSelectedCat] = useState(null);
  const [openType, setOpenType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const refreshGhost = () => setGhostUser(getGhostSession());
    refreshGhost();
    window.addEventListener('ghost-session-changed', refreshGhost);
    return () => window.removeEventListener('ghost-session-changed', refreshGhost);
  }, []);

  useEffect(() => {
    if (ghostUser) {
      setCurrentUser(ghostUser);
      return;
    }
    setCurrentUser(user);
    if (user) base44.auth.me().then(setCurrentUser).catch(() => {});
  }, [user, ghostUser]);

  const userType = currentUser?.user_type;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isBusinessAccount = userType === 'business' || currentUser?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || currentUser?.is_seller || isBusinessAccount || currentUser?.is_ghost_account;
  const isBlockedUserType = userType === 'rider' || (userType === 'customer' && !isSellerAccount);
  const canPost = !!currentUser && !isBlockedUserType && (isAdmin || isSellerAccount);

  useEffect(() => {
    if (!canPost || !preselectedKey) return;
    const cat = CATEGORIES.find(c => c.key === preselectedKey);
    if (cat) {
      setSelectedCat(cat);
      setOpenType(cat.types[0]?.[0] || '');
    }
  }, [canPost, preselectedKey]);

  const selectCategory = (cat) => {
    if (!canPost) return;
    const next = selectedCat?.key === cat.key ? null : cat;
    setSelectedCat(next);
    setOpenType(next?.types[0]?.[0] || '');
  };

  const openListingModal = (type, subcategory = '') => {
    setSelectedType(type);
    setSelectedSubcategory(subcategory);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001060 100%)' }}>
      <StarField />
      <ListingLandingBrandBar />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Plus className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="font-body text-xs text-[#00D4FF] font-semibold">Post a Listing</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-2">What are you listing?</h1>
          <p className="font-body text-sm text-white/45">Choose a category, then pick from the full list of types and subcategories</p>
        </motion.div>

        {!canPost && (
          <div className="mb-8 text-center p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p className="font-body text-sm text-white/65">Post a Listing is available for seller, business, live user, and admin accounts only.</p>
          </div>
        )}

        {canPost && (
          <div className="grid lg:grid-cols-[330px_1fr] gap-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3 h-fit">
              {CATEGORIES.map((cat, i) => (
                <motion.button key={cat.key}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => selectCategory(cat)}
                  className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: selectedCat?.key === cat.key ? `${cat.color}18` : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${selectedCat?.key === cat.key ? cat.color : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: selectedCat?.key === cat.key ? `0 0 20px ${cat.color}30` : 'none',
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}20` }}>
                      <CategoryIcon name={cat.iconKey} size={20} color={cat.color} />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-white mb-0.5">{cat.label}</p>
                      <p className="font-body text-[10px] text-white/42 leading-snug">{cat.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 min-h-[420px]">
              {selectedCat ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selectedCat.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-wider font-bold" style={{ color: selectedCat.color }}>Full options</p>
                        <h2 className="font-heading text-2xl font-bold text-white">{selectedCat.label}</h2>
                      </div>
                      <button onClick={() => openListingModal(selectedCat.types[0][0], '')} className="px-3 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white font-body text-xs font-bold">
                        Start blank
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedCat.types.map(([type, label]) => {
                        const subcategories = SUBCATEGORIES[type] || [];
                        const isOpen = openType === type;
                        return (
                          <div key={type} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${selectedCat.color}30`, background: `${selectedCat.color}0D` }}>
                            <button onClick={() => setOpenType(isOpen ? '' : type)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
                              <div>
                                <p className="font-body text-sm font-bold text-white">{label}</p>
                                <p className="font-body text-[10px] text-white/38">{subcategories.length ? `${subcategories.length} subcategories` : 'Open listing form'}</p>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
                                    <button onClick={() => openListingModal(type, '')} className="px-3 py-2 rounded-xl font-body text-xs font-bold text-white transition-all hover:scale-[1.02]" style={{ background: selectedCat.color }}>
                                      {subcategories.length ? 'Choose manually in form' : 'Create listing'}
                                    </button>
                                    {subcategories.map(sub => (
                                      <button key={sub} onClick={() => openListingModal(type, sub)} className="px-3 py-2 rounded-xl border font-body text-xs text-white/80 hover:text-white transition-all text-left" style={{ borderColor: `${selectedCat.color}35`, background: `${selectedCat.color}17` }}>
                                        {sub}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="h-full min-h-[390px] flex items-center justify-center text-center">
                  <div>
                    <Plus className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="font-heading text-xl font-bold text-white">Select a category</p>
                    <p className="font-body text-sm text-white/40 mt-1">All listing types and subcategories will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!currentUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-10 text-center p-5 rounded-2xl"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="font-body text-sm text-white/50 mb-3">You need an account to post listings</p>
            <button onClick={() => setShowSignup(true)}
              className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
              Create Free Account
            </button>
          </motion.div>
        )}
      </div>

      <ListingLandingBrandBar />

      <AnimatePresence>
        {showModal && selectedCat && canPost && (
          <AddListingModal
            user={currentUser}
            defaultType={selectedType}
            defaultSubcategory={selectedSubcategory}
            onClose={() => { setShowModal(false); setSelectedType(''); setSelectedSubcategory(''); }}
          />
        )}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}