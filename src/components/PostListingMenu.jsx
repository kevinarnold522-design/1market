import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, ChevronDown } from 'lucide-react';
import AddListingModal from './AddListingModal';
import MemberSignupModal from './MemberSignupModal';
import TravelPostModal from './travel/TravelPostModal';
import CategoryIcon from './CategoryIcon';

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
  const [showModal, setShowModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setExpandedCat(null); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectSubtype = (cat, subtype) => {
    setOpen(false);
    setExpandedCat(null);
    if (!user) { setShowSignup(true); return; }
    if (cat.modal === 'travel') {
      setShowTravelModal(true);
    } else {
      setSelectedType(subtype.type);
      setShowModal(true);
    }
  };

  const handleSelectCat = (cat) => {
    if (!user) { setOpen(false); setShowSignup(true); return; }
    // If only one subtype, open directly
    if (cat.subtypes.length === 1) {
      setOpen(false);
      setExpandedCat(null);
      if (cat.modal === 'travel') {
        setShowTravelModal(true);
      } else {
        setSelectedType(cat.subtypes[0].type);
        setShowModal(true);
      }
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
              className="absolute left-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-[200]"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="p-2">
                <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold px-2 py-1.5">Post an Ad — Choose Category</p>
                {CATEGORIES.map(cat => (
                  <div key={cat.key}>
                    <button onClick={() => handleSelectCat(cat)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                        <CategoryIcon name={cat.iconKey} size={16} color={cat.color} />
                      </div>
                      <span className="font-body font-semibold text-xs text-white flex-1">{cat.label}</span>
                      {cat.subtypes.length > 1 && (
                        expandedCat === cat.key
                          ? <ChevronDown className="w-3 h-3 text-white/40" />
                          : <ChevronRight className="w-3 h-3 text-white/40" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedCat === cat.key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden ml-4 pl-3 border-l border-white/10">
                          {cat.subtypes.map(sub => (
                            <button key={sub.type} onClick={() => handleSelectSubtype(cat, sub)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors text-left">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                              <span className="font-body text-xs text-white/70 hover:text-white transition-colors">{sub.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddListingModal
            user={user}
            defaultType={selectedType}
            onClose={() => { setShowModal(false); setSelectedType(''); }}
          />
        )}
        {showTravelModal && (
          <TravelPostModal user={user} onClose={() => setShowTravelModal(false)} />
        )}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </>
  );
}