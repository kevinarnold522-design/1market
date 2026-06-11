import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import AddListingModal from './AddListingModal';
import MemberSignupModal from './MemberSignupModal';
import TravelPostModal from './travel/TravelPostModal';
import CategoryIcon from './CategoryIcon';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    key: 'buysell', label: 'Buy & Sell', iconKey: 'buysell', color: '#8b5cf6', modal: 'standard',
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
    key: 'jobs', label: 'Jobs', iconKey: 'jobs', color: '#f59e0b', modal: 'standard',
    subtypes: [
      { label: 'Any Job Posting', type: 'jobs' },
    ]
  },
  {
    key: 'food', label: 'Food', iconKey: 'food', color: '#f97316', modal: 'standard',
    subtypes: [
      { label: 'Food & Beverages', type: 'food' },
    ]
  },
  {
    key: 'rent', label: 'Rent / For Sale', iconKey: 'rent', color: '#10b981', modal: 'standard',
    subtypes: [
      { label: 'Property — Rent / Sale / Lease', type: 'rent_lease' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
    ]
  },
  {
    key: 'services', label: 'Services', iconKey: 'services', color: '#3b82f6', modal: 'standard',
    subtypes: [
      { label: 'Service Listing', type: 'services' },
    ]
  },
  {
    key: 'travel', label: 'Travel / Hotel', iconKey: 'travel', color: '#0ea5e9', modal: 'travel',
    subtypes: [
      { label: 'Hotel / Accommodation', type: 'hotel' },
      { label: 'Flights / Tour Package', type: 'flights' },
      { label: 'Vehicle Rental', type: 'vehicle_rental' },
    ]
  },
];

export default function PostListingMenu({ user, compact = false, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setExpandedCat(null); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CATEGORY_ROUTES = {
    buysell: '/buysell',
    jobs: '/jobs',
    food: '/food',
    rent: '/rent',
    services: '/services',
    travel: '/travel',
  };

  const handleSelectSubtype = (cat, subtype) => {
    setOpen(false);
    setExpandedCat(null);
    if (!user) { setShowSignup(true); return; }
    navigate(`/category/${cat.key}?type=${subtype.type}`);
  };

  const handleSelectCat = (cat) => {
    if (!user) { setOpen(false); setShowSignup(true); return; }
    if (cat.subtypes.length === 1) {
      navigate(`/category/${cat.key}?type=${cat.subtypes[0].type}`);
    } else {
      setExpandedCat(expandedCat === cat.key ? null : cat.key);
    }
  };

  const btnLabel = iconOnly ? null : compact ? '+ Post an Ad' : 'Post an Ad';

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => { setOpen(o => !o); setExpandedCat(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105 whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}
          title="Post a Listing"
        >
          <Plus className="w-3.5 h-3.5 flex-shrink-0" />
          {btnLabel && <span>{btnLabel}</span>}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 top-full mt-2 rounded-2xl overflow-hidden shadow-2xl z-[200]"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)', width: 'min(300px, 96vw)' }}>
              <div className="p-3">
                <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold px-1 pb-2">Post an Ad — Choose Category</p>
                {/* Categories in 2-col grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => handleSelectCat(cat)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors text-left"
                      style={{ background: expandedCat === cat.key ? `${cat.color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${expandedCat === cat.key ? cat.color + '44' : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cat.color}22` }}>
                        <CategoryIcon name={cat.iconKey} size={12} color={cat.color} />
                      </div>
                      <span className="font-body font-semibold text-[10px] text-white leading-tight">{cat.label}</span>
                      {cat.subtypes.length > 1 && <ChevronDown className={`w-3 h-3 ml-auto flex-shrink-0 transition-transform text-white/30 ${expandedCat === cat.key ? 'rotate-180' : ''}`} />}
                    </button>
                  ))}
                </div>
                {/* Subcategories — horizontal scrollable row */}
                <AnimatePresence>
                  {expandedCat && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      {(() => {
                        const cat = CATEGORIES.find(c => c.key === expandedCat);
                        if (!cat) return null;
                        return (
                          <div className="pt-2 border-t border-white/10">
                            <p className="font-body text-[9px] text-white/40 uppercase tracking-wider font-bold mb-2 px-1" style={{ color: cat.color }}>
                              {cat.label} — Pick type:
                            </p>
                            <div className="flex flex-wrap gap-1.5 pb-1">
                              {cat.subtypes.map(sub => (
                                <button key={sub.type} onClick={() => handleSelectSubtype(cat, sub)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/80 hover:text-white transition-all hover:scale-105"
                                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}33` }}>
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                  {sub.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </>
  );
}