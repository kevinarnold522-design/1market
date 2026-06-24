import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Store, ChevronRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CategoryIcon from './CategoryIcon';

const SELLER_TYPES = [
  { value: 'products',  label: 'Products & Goods',      desc: 'I sell physical items — new or used',                  icon: 'buysell',  color: '#8b5cf6' },
  { value: 'services',  label: 'Services Provider',     desc: 'I offer a skill, trade, or professional service',      icon: 'services', color: '#3b82f6' },
  { value: 'jobs',      label: 'Job Postings',          desc: 'I post job openings or hiring opportunities',          icon: 'jobs',     color: '#f59e0b' },
  { value: 'rent',      label: 'Rooms & Spaces',        desc: 'I rent/sell/lease rooms, properties or commercial spaces', icon: 'rent', color: '#10b981' },
  { value: 'travel',    label: 'Travel & Hospitality',  desc: 'I list hotels, tours, vehicle rentals, or flights',    icon: 'travel',   color: '#0ea5e9' },
  { value: 'food',      label: 'Food & Beverages',      desc: 'I sell home-cooked meals, baked goods, or drinks',     icon: 'food',     color: '#f97316' },
];

const FOOD_BUSINESS_TYPES = [
  { value: 'Home Kitchen',              label: 'AI Home Kitchen',              desc: 'Cooking & selling from home' },
  { value: 'Karinderia / Carinderia',   label: 'AI Karinderia / Carinderia',   desc: 'Local Filipino eatery / canteen' },
  { value: 'Bakery / Pastry Shop',      label: 'AI Bakery / Pastry Shop',      desc: 'Bread, cakes, pastries' },
  { value: 'Fast Food Chain',           label: 'AI Fast Food Chain',           desc: 'Quick service restaurant' },
  { value: 'Restaurant / Resto Bar',    label: 'AI️ Restaurant / Resto Bar',   desc: 'Sit-down dining establishment' },
  { value: 'Food Stall / Kiosk',        label: 'AI Food Stall / Kiosk',        desc: 'Market stall or kiosk' },
  { value: 'Catering Service',          label: 'AI Catering Service',          desc: 'Events and bulk food orders' },
  { value: 'Corporation / Franchise',   label: 'AI Corporation / Franchise',   desc: 'Registered company or franchisee' },
  { value: 'Cloud Kitchen / Online',    label: 'AI Cloud Kitchen / Online',    desc: 'Delivery-only, no dine-in' },
  { value: 'Other',                     label: 'AI Other',                     desc: 'Something else' },
];

const FOOD_TYPES = [
  'Lutong Bahay / Home-cooked', 'Baked Goods & Pastries', 'Karinderia Meals', 'Grilled / BBQ',
  'Seafood', 'Noodles & Pasta', 'Rice Meals', 'Snacks & Merienda', 'Beverages & Drinks',
  'Desserts & Sweets', 'Vegan / Healthy Food', 'International Cuisine', 'Street Food',
  'Sari-sari / Grocery Items', 'Other',
];

const CATS_BY_TYPE = {
  products: [
    { value: 'electronics',  label: 'Electronics & Gadgets',  icon: 'electronics',  subcats: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'Accessories'] },
    { value: 'shoes',        label: 'Shoes & Footwear',       icon: 'shoes',        subcats: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids Shoes'] },
    { value: 'clothing',     label: 'Clothing & Fashion',     icon: 'clothing',     subcats: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Activewear'] },
    { value: 'furniture',    label: 'Furniture & Home',       icon: 'furniture',    subcats: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen'] },
    { value: 'homeappliances', label: 'Home Appliances',      icon: 'homeappliances', subcats: ['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'TV'] },
    { value: 'cars',         label: 'Vehicles & Parts',       icon: 'cars',         subcats: ['Sedan', 'SUV', 'Van', 'Motorcycle', 'Parts & Accessories'] },
    { value: 'houses',       label: 'Real Estate / Properties / Houses / Condo',            icon: 'houses',       subcats: ['House & Lot', 'Condominium', 'Townhouse', 'Vacant Lot', 'Commercial'] },
    { value: 'mods',         label: 'Mods & Customizations',  icon: 'mods',         subcats: ['Car Mods', 'Motorcycle Mods', 'PC Builds', 'Console Mods'] },
    { value: 'product',      label: 'General Products',       icon: 'product',      subcats: ['Health & Beauty', 'Sports', 'Toys', 'Books', 'Tools'] },
  ],
  services: [
    { value: 'services',         label: 'Home Services',          icon: 'services',       subcats: ['Cleaning', 'Plumbing', 'Electrical', 'Aircon', 'Pest Control'] },
    { value: 'services_tech',    label: 'Tech & Digital',         icon: 'electronics',    subcats: ['Web Dev', 'Graphic Design', 'IT Support', 'CCTV', 'Social Media'] },
    { value: 'services_beauty',  label: 'Beauty & Wellness',      icon: 'health',         subcats: ['Massage', 'Nails', 'Hair', 'Makeup'] },
    { value: 'services_events',  label: 'Events & Entertainment', icon: 'buysell',        subcats: ['Event Planning', 'Catering', 'DJ', 'Photography'] },
    { value: 'services_transport', label: 'Transport & Logistics', icon: 'vehicle_rental', subcats: ['Trucking', 'Courier', 'Airport Transfer'] },
  ],
  jobs: [
    { value: 'jobs', label: 'All Job Postings', icon: 'jobs', subcats: ['Full-time', 'Part-time', 'Freelance', 'WFH / Remote', 'Internship'] },
  ],
  rent: [
    { value: 'rent_lease',      label: 'Rooms & Apartments',   icon: 'rent_lease', subcats: ['Room for Rent', 'Apartment / Condo', 'Bedspace / Dorm', 'House for Rent', 'For Sale', 'For Lease'] },
    { value: 'rent_commercial', label: 'Commercial Spaces',    icon: 'houses',     subcats: ['Office Space', 'Commercial Unit', 'Warehouse / Bodega', 'Stall / Kiosk'] },
    { value: 'rent_event',      label: 'Venue / Events',       icon: 'hotel',      subcats: ['Event Hall', 'Studio', 'Sports Facility'] },
  ],
  travel: [
    { value: 'hotel',          label: 'Hotels & Accommodation', icon: 'hotel',          subcats: ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Airbnb / Homestay'] },
    { value: 'flights',        label: 'Flights & Tour Packages', icon: 'flights',       subcats: ['Domestic Flight', 'International Flight', 'Tour Package'] },
    { value: 'vehicle_rental', label: 'Vehicle Rental',          icon: 'vehicle_rental', subcats: ['Car Rental', 'Van Rental', 'Motorcycle Rental', 'Bus / Shuttle'] },
  ],
  food: [
    { value: 'food', label: 'Food & Beverages', icon: 'food', subcats: ['Baked Goods', 'Home-cooked Meals', 'Beverages', 'Snacks', 'Ingredients', 'Desserts'] },
  ],
};

const MIN_PICKS = 1;
const MAX_PICKS = 5;

export default function BecomeSellerModal({ user, onClose, onSuccess }) {
  // Steps: 0=seller type, 1a=food questions (if food), 1b=pick categories, 2=confirm
  const [step, setStep] = useState(0);
  const [sellerType, setSellerType] = useState('');
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Food-specific state
  const [foodBusinessType, setFoodBusinessType] = useState('');
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodStep, setFoodStep] = useState(0); // 0=business type, 1=food types

  const availableCats = CATS_BY_TYPE[sellerType] || [];

  const toggle = (val) => {
    setError('');
    if (selected.includes(val)) { setSelected(s => s.filter(v => v !== val)); }
    else {
      if (selected.length >= MAX_PICKS) { setError(`Max ${MAX_PICKS} categories.`); return; }
      setSelected(s => [...s, val]);
    }
  };

  const toggleFoodType = (val) => {
    setFoodTypes(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleSellerTypeSelect = (type) => {
    setSellerType(type);
    setSelected([]);
    setError('');
    if (type === 'food') {
      setFoodStep(0);
      setStep('food_questions');
    } else {
      setStep(1);
    }
  };

  const handleFoodNext = () => {
    if (foodStep === 0) {
      if (!foodBusinessType) { setError('Please select your food business type.'); return; }
      setError('');
      setFoodStep(1);
    } else {
      if (foodTypes.length === 0) { setError('Please select at least one food type.'); return; }
      setError('');
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      user_type: 'seller',
      is_seller: true,
      account_type: 'business_owner',
      member_type: 'seller',
      seller_type: sellerType,
      seller_products: selected,
      seller_pending: false,
      ...(sellerType === 'food' ? {
        food_business_type: foodBusinessType,
        food_types: foodTypes,
      } : {}),
    });
    try {
      await base44.functions.invoke('sendSellerWelcomeEmail', { email: user.email, name: user.full_name });
    } catch (e) {}
    setSaving(false);
    onSuccess?.();
    onClose();
  };

  const selectedCats = availableCats.filter(c => selected.includes(c.value));
  const stepNum = step === 0 ? 1 : step === 'food_questions' ? 2 : step === 1 ? (sellerType === 'food' ? 3 : 2) : (sellerType === 'food' ? 4 : 3);
  const totalSteps = sellerType === 'food' ? 4 : 3;
  const progress = `${(stepNum / totalSteps) * 100}%`;

  const goBack = () => {
    if (step === 1) {
      if (sellerType === 'food') { setStep('food_questions'); setFoodStep(1); }
      else setStep(0);
    } else if (step === 'food_questions') {
      if (foodStep === 1) setFoodStep(0);
      else setStep(0);
    } else if (step === 2) setStep(1);
    else setStep(s => Math.max(0, s - 1));
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)', border: '1px solid rgba(0,212,255,0.2)' }}>

          {/* Progress */}
          <div className="h-1 bg-white/10 flex-shrink-0">
            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-[#00D4FF]"
              animate={{ width: progress }} transition={{ duration: 0.4 }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {(step !== 0) && (
                <button onClick={goBack} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors mr-1">
                  <ChevronLeft className="w-4 h-4 text-white/70" />
                </button>
              )}
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white text-sm">Become a Seller</span>
                <p className="font-body text-[9px] text-white/35">Step {stepNum} of {totalSteps}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* STEP 0 — Seller type */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                  <h2 className="font-heading font-bold text-xl text-white mb-1">What do you sell or offer?</h2>
                  <p className="font-body text-sm text-white/45 mb-5">Choose the option that best describes you.</p>
                  <div className="space-y-2">
                    {SELLER_TYPES.map(st => (
                      <motion.button key={st.value} whileTap={{ scale: 0.98 }}
                        onClick={() => handleSellerTypeSelect(st.value)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all hover:scale-[1.01]"
                        style={{
                          borderColor: sellerType === st.value ? st.color : 'rgba(255,255,255,0.1)',
                          background: sellerType === st.value ? `${st.color}18` : 'rgba(255,255,255,0.04)',
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${st.color}22` }}>
                          <CategoryIcon name={st.icon} size={20} color={st.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-sm text-white">{st.label}</p>
                          <p className="font-body text-[10px] text-white/40 mt-0.5">{st.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/25 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FOOD QUESTIONS */}
              {step === 'food_questions' && (
                <motion.div key="food" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                  {foodStep === 0 ? (
                    <>
                      <h2 className="font-heading font-bold text-xl text-white mb-1">AI Food Business Type</h2>
                      <p className="font-body text-sm text-white/45 mb-4">What best describes your food business?</p>
                      {error && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3"><AlertCircle className="w-3.5 h-3.5" />{error}</div>}
                      <div className="grid grid-cols-1 gap-2 mb-5">
                        {FOOD_BUSINESS_TYPES.map(bt => (
                          <motion.button key={bt.value} whileTap={{ scale: 0.98 }}
                            onClick={() => { setFoodBusinessType(bt.value); setError(''); }}
                            className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${foodBusinessType === bt.value ? 'border-orange-400/60 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${foodBusinessType === bt.value ? 'bg-orange-500/25' : 'bg-white/8'}`}>
                              {bt.label.split(' ')[0]}
                            </div>
                            <div className="flex-1">
                              <p className="font-body font-bold text-xs text-white">{bt.label.split(' ').slice(1).join(' ')}</p>
                              <p className="font-body text-[10px] text-white/40">{bt.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${foodBusinessType === bt.value ? 'border-orange-400 bg-orange-400' : 'border-white/20'}`}>
                              {foodBusinessType === bt.value && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-heading font-bold text-xl text-white mb-1">AI️ What food do you sell?</h2>
                      <p className="font-body text-sm text-white/45 mb-4">Select all that apply — you can pick multiple.</p>
                      {error && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3"><AlertCircle className="w-3.5 h-3.5" />{error}</div>}
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {FOOD_TYPES.map(ft => {
                          const isSel = foodTypes.includes(ft);
                          return (
                            <button key={ft} type="button" onClick={() => toggleFoodType(ft)}
                              className={`py-2.5 px-3 rounded-xl border-2 font-body text-xs text-left transition-all ${isSel ? 'border-orange-400/60 bg-orange-500/15 text-orange-300' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
                              {isSel && <Check className="w-3 h-3 inline mr-1 text-orange-400" />}{ft}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <div className="sticky bottom-0 pt-2 pb-1" style={{ background: 'linear-gradient(to top,#0D1F3C,transparent)' }}>
                    <button onClick={handleFoodNext}
                      className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                      style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Pick categories */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                  <h2 className="font-heading font-bold text-xl text-white mb-1">Select your categories</h2>
                  <p className="font-body text-sm text-white/45 mb-1">Pick <span className="text-emerald-400 font-bold">1–{MAX_PICKS}</span> that match what you list.</p>
                  <p className="font-body text-[10px] text-white/30 mb-4">Selected: {selected.length}/{MAX_PICKS}</p>

                  {error && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}</div>}

                  <div className="grid grid-cols-1 gap-2 mb-5">
                    {availableCats.map(cat => {
                      const isSel = selected.includes(cat.value);
                      return (
                        <motion.button key={cat.value} whileTap={{ scale: 0.98 }} onClick={() => toggle(cat.value)}
                          className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${isSel ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-white/10 hover:border-white/20 bg-white/4'}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isSel ? 'bg-emerald-500/25' : 'bg-white/8'}`}>
                            <CategoryIcon name={cat.icon} size={18} color={isSel ? '#34d399' : 'rgba(255,255,255,0.5)'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-bold text-xs text-white">{cat.label}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {cat.subcats.slice(0, 4).map(s => (
                                <span key={s} className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${isSel ? 'bg-emerald-400/15 border-emerald-400/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/30'}`}>{s}</span>
                              ))}
                              {cat.subcats.length > 4 && <span className="text-[9px] text-white/20">+{cat.subcats.length - 4} more</span>}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSel ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                            {isSel && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="sticky bottom-0 pt-2 pb-1" style={{ background: 'linear-gradient(to top,#0D1F3C,transparent)' }}>
                    <button onClick={() => { if (selected.length < MIN_PICKS) { setError('Please pick at least 1 category.'); return; } setError(''); setStep(2); }}
                      className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                      style={selected.length >= MIN_PICKS ? { background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' } : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Confirm */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                  <div className="text-center mb-6 pt-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-3">
                      <Store className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-1">Ready to Start Selling!</h2>
                    <p className="font-body text-sm text-white/45">You'll be set up as a <span className="text-emerald-400 font-bold">Seller</span> instantly.</p>
                  </div>

                  {sellerType === 'food' && (foodBusinessType || foodTypes.length > 0) && (
                    <div className="rounded-2xl p-3 mb-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                      <p className="font-body text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-2">Your Food Business</p>
                      {foodBusinessType && <p className="font-body text-xs text-white/70 mb-1">AI <strong className="text-white">{foodBusinessType}</strong></p>}
                      {foodTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {foodTypes.map(ft => <span key={ft} className="px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/25 text-orange-300 font-body text-[10px]">{ft}</span>)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="font-body text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">Your selected categories</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCats.map(c => (
                        <span key={c.value} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-body text-xs font-semibold">
                          <CategoryIcon name={c.icon} size={12} color="#34d399" />{c.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mb-5 space-y-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <p className="font-body text-xs text-white font-semibold mb-2">What you get as a Seller:</p>
                    {['Post listings in all selected categories immediately', 'Your own public seller profile page', 'Receive and track orders from buyers', 'Apply for Verified Partner badge any time'].map((perk, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="font-body text-[11px] text-white/60">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSubmit} disabled={saving}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Store className="w-4 h-4" />}
                    {saving ? 'Activating...' : 'Activate My Seller Account'}
                  </button>
                  <p className="text-center font-body text-[10px] text-white/25 mt-3">Free forever · No listing fees · DPA 2012 compliant</p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}