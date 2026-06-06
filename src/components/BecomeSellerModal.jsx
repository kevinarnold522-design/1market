import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Store, ChevronRight, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SELLER_CATEGORIES = [
  { value: 'electronics', label: '📱 Electronics & Gadgets', desc: 'Phones, laptops, accessories, smart devices', subcats: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'Accessories'] },
  { value: 'shoes', label: '👟 Shoes & Footwear', desc: 'Sneakers, formal, sandals, boots, sports', subcats: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids Shoes'] },
  { value: 'clothing', label: '👗 Clothing & Fashion', desc: "Men's, women's, kids wear, activewear", subcats: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing'] },
  { value: 'bags', label: '👜 Bags & Accessories', desc: 'Handbags, backpacks, wallets, belts', subcats: ['Handbags', 'Backpacks', 'Wallets', 'Belts', 'Jewelry', 'Watches'] },
  { value: 'food', label: '🍔 Food & Beverages', desc: 'Baked goods, meals, snacks, drinks', subcats: ['Baked Goods', 'Home-cooked Meals', 'Beverages', 'Snacks', 'Ingredients'] },
  { value: 'furniture', label: '🛋️ Furniture & Home', desc: 'Living room, bedroom, office, kitchen', subcats: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen & Dining'] },
  { value: 'cars', label: '🚗 Vehicles & Parts', desc: 'Cars, motorcycles, trucks, parts', subcats: ['Sedan', 'SUV', 'Van', 'Pickup', 'Motorcycle', 'Parts & Accessories'] },
  { value: 'services', label: '🔧 Services', desc: 'Home, tech, beauty, events, professional', subcats: ['Home Services', 'Tech Support', 'Beauty & Wellness', 'Events', 'Transport', 'Professional Services'] },
  { value: 'product', label: '🛒 General Products', desc: 'Health, sports, toys, books, tools', subcats: ['Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books', 'Tools & Hardware'] },
  { value: 'homeappliances', label: '🏠 Home Appliances', desc: 'Kitchen, laundry, air conditioning, small appliances', subcats: ['Kitchen Appliances', 'Laundry', 'Air Conditioning', 'Refrigerators', 'Small Appliances'] },
  { value: 'houses', label: '🏡 Real Estate', desc: 'Houses, condos, lots, commercial', subcats: ['House & Lot', 'Condominium', 'Townhouse', 'Vacant Lot', 'Commercial'] },
  { value: 'rent', label: '🔑 For Rent / Lease', desc: 'Rooms, apartments, spaces for rent', subcats: ['Rooms', 'Apartments', 'Commercial Spaces', 'Event Venues', 'Parking'] },
];

const MIN_PICKS = 2;
const MAX_PICKS = 5;

export default function BecomeSellerModal({ user, onClose, onSuccess }) {
  const [step, setStep] = useState(0); // 0=pick categories, 1=confirm
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = (val) => {
    setError('');
    if (selected.includes(val)) {
      setSelected(s => s.filter(v => v !== val));
    } else {
      if (selected.length >= MAX_PICKS) {
        setError(`You can pick at most ${MAX_PICKS} categories.`);
        return;
      }
      setSelected(s => [...s, val]);
    }
  };

  const handleNext = () => {
    if (selected.length < MIN_PICKS) {
      setError(`Please pick at least ${MIN_PICKS} categories.`);
      return;
    }
    setError('');
    setStep(1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      user_type: 'seller',
      is_seller: true,
      account_type: 'business_owner',
      member_type: 'seller',
      seller_products: selected,
      seller_pending: false,
    });
    // Send seller welcome email
    try {
      await base44.functions.invoke('sendSellerWelcomeEmail', { email: user.email, name: user.full_name });
    } catch (e) {}
    setSaving(false);
    onSuccess?.();
    onClose();
  };

  const selectedCats = SELLER_CATEGORIES.filter(c => selected.includes(c.value));

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)', border: '1px solid rgba(0,212,255,0.2)' }}>

          {/* Progress */}
          <div className="h-1 bg-white/10 flex-shrink-0">
            <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-[#00D4FF]"
              animate={{ width: step === 0 ? '50%' : '100%' }} transition={{ duration: 0.4 }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-sm">Become a Seller</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <h2 className="font-heading font-bold text-xl text-white mb-1">What do you sell? 🛍️</h2>
                  <p className="font-body text-sm text-white/45 mb-1">
                    Pick <span className="text-emerald-400 font-bold">2–{MAX_PICKS} categories</span> that best describe your products or services.
                  </p>
                  <p className="font-body text-[10px] text-white/30 mb-4">Selected: {selected.length}/{MAX_PICKS}</p>

                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 mb-5">
                    {SELLER_CATEGORIES.map(cat => {
                      const isSelected = selected.includes(cat.value);
                      return (
                        <motion.button key={cat.value} whileTap={{ scale: 0.98 }}
                          onClick={() => toggle(cat.value)}
                          className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-400/60 bg-emerald-500/12' : 'border-white/10 hover:border-white/20 bg-white/4'}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg transition-all ${isSelected ? 'bg-emerald-500/25' : 'bg-white/8'}`}>
                            {cat.label.split(' ')[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-bold text-xs text-white">{cat.label.split(' ').slice(1).join(' ')}</p>
                            <p className="font-body text-[10px] text-white/35 mt-0.5">{cat.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {cat.subcats.slice(0, 4).map(s => (
                                <span key={s} className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${isSelected ? 'bg-emerald-400/15 border-emerald-400/30 text-emerald-300' : 'bg-white/5 border-white/10 text-white/30'}`}>{s}</span>
                              ))}
                              {cat.subcats.length > 4 && <span className="text-[9px] text-white/20">+{cat.subcats.length - 4} more</span>}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="sticky bottom-0 pt-2 pb-1" style={{ background: 'linear-gradient(to top, #0D1F3C, transparent)' }}>
                    <button onClick={handleNext}
                      className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                      style={selected.length >= MIN_PICKS ? { background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' } : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <button onClick={() => setStep(0)} className="flex items-center gap-1 text-white/30 hover:text-white font-body text-xs mb-4 transition-colors">← Back</button>

                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🏪</div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-1">Ready to Start Selling!</h2>
                    <p className="font-body text-sm text-white/45">You'll be set up as a <span className="text-emerald-400 font-bold">Seller</span> with access to post listings in all categories.</p>
                  </div>

                  <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="font-body text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">Your selected categories</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCats.map(c => (
                        <span key={c.value} className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-body text-xs font-semibold">
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mb-5 space-y-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <p className="font-body text-xs text-white font-semibold mb-2">✅ What you get as a Seller:</p>
                    {[
                      'Post listings in ALL categories — products, services, rent, jobs, travel & more',
                      'Manage your own seller profile page visible to all buyers',
                      'Receive & track orders from buyers',
                      'Apply later for Verified Partner badge (blue checkmark)',
                    ].map((perk, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="font-body text-[11px] text-white/60">{perk}</span>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-white/8">
                      <p className="font-body text-[10px] text-white/35">
                        <strong className="text-amber-400">Note:</strong> As a Seller, your name appears as your personal name, not a business name. To list under a business name, upgrade to a Business account later.
                      </p>
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={saving}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#10b981,#00D4FF)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Store className="w-4 h-4" />}
                    {saving ? 'Activating seller account...' : 'Activate My Seller Account →'}
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