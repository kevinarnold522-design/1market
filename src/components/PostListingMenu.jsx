import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import AddListingModal from './AddListingModal';
import MemberSignupModal from './MemberSignupModal';
import TravelPostModal from './travel/TravelPostModal';
import CategoryIcon from './CategoryIcon';

const CATEGORIES = [
  { key: 'jobs',     label: 'Jobs',                    iconKey: 'jobs',     color: '#f59e0b', defaultType: 'jobs',       modal: 'standard' },
  { key: 'rent',     label: 'Rent / For Sale / Lease', iconKey: 'rent',     color: '#10b981', defaultType: 'rent_lease', modal: 'standard' },
  { key: 'buysell',  label: 'Buy & Sell',              iconKey: 'buysell',  color: '#8b5cf6', defaultType: 'product',    modal: 'standard' },
  { key: 'food',     label: 'Food',                    iconKey: 'food',     color: '#f97316', defaultType: 'food',       modal: 'standard' },
  { key: 'services', label: 'Services',                iconKey: 'services', color: '#3b82f6', defaultType: 'services',   modal: 'standard' },
  { key: 'travel',   label: 'Travel / Hotel',          iconKey: 'travel',   color: '#0ea5e9', defaultType: 'hotel',      modal: 'travel'   },
];

export default function PostListingMenu({ user, compact = false, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (cat) => {
    setOpen(false);
    if (!user) { setShowSignup(true); return; }
    if (cat.modal === 'travel') {
      setShowTravelModal(true);
    } else {
      setSelectedType(cat.defaultType);
      setShowModal(true);
    }
  };

  const btnLabel = iconOnly ? null : 'Post & Add';

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105 whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}
          title="Post and Add Listing"
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
              className="absolute left-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl z-[200]"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="p-2">
                <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold px-2 py-1.5">Post in a category</p>
                {CATEGORIES.map(cat => (
                  <button key={cat.key} onClick={() => handleSelect(cat)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                      <CategoryIcon name={cat.iconKey} size={16} color={cat.color} />
                    </div>
                    <span className="font-body font-semibold text-xs text-white">{cat.label}</span>
                  </button>
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