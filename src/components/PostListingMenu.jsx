import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
  { label: 'Other / Miscellaneous', type: 'other' }]

},
{
  key: 'jobs', label: 'Jobs', iconKey: 'jobs', color: '#f59e0b', modal: 'standard',
  subtypes: [
  { label: 'Customer Service / BPO', type: 'jobs', subcategory: 'Customer Service Rep' },
  { label: 'Tech & IT', type: 'jobs', subcategory: 'Software Engineer' },
  { label: 'Healthcare', type: 'jobs', subcategory: 'Staff Nurse (RN)' },
  { label: 'Delivery Rider', type: 'jobs', subcategory: 'Delivery Rider' },
  { label: 'Virtual Assistant', type: 'jobs', subcategory: 'Virtual Assistant (VA)' },
  { label: 'Other Job', type: 'jobs', subcategory: 'Other / Not Listed' }]

},
{
  key: 'food', label: 'Food', iconKey: 'food', color: '#f97316', modal: 'standard',
  subtypes: [
  { label: 'Home Kitchen', type: 'food', subcategory: 'Homemade Meals' },
  { label: 'Bakery / Pastries', type: 'food', subcategory: 'Home Bakery' },
  { label: 'Restaurant / Fast Food', type: 'food', subcategory: 'Quick Service Restaurant' },
  { label: 'Catering', type: 'food', subcategory: 'Event Catering' },
  { label: 'Drinks / Coffee / Milk Tea', type: 'food', subcategory: 'Beverages & Drinks' },
  { label: 'Other Food', type: 'food', subcategory: 'Other / Type Manually' }]

},
{
  key: 'rent', label: 'Rent / For Sale', iconKey: 'rent', color: '#10b981', modal: 'standard',
  subtypes: [
  { label: 'Property — Rent / Sale / Lease', type: 'rent_lease' },
  { label: 'Vehicle Rental', type: 'vehicle_rental' }]

},
{
  key: 'services', label: 'Services', iconKey: 'services', color: '#3b82f6', modal: 'standard',
  subtypes: [
  { label: 'Home Services', type: 'services', subcategory: 'House Cleaning' },
  { label: 'Tech & Digital', type: 'services', subcategory: 'Website Development' },
  { label: 'Beauty & Wellness', type: 'services', subcategory: 'Massage Services' },
  { label: 'Events & Catering', type: 'services', subcategory: 'Event Planning' },
  { label: 'Professional Services', type: 'services', subcategory: 'Accounting' },
  { label: 'Transport & Delivery', type: 'services', subcategory: 'Delivery Services' },
  { label: 'Other Service', type: 'services', subcategory: 'Other / Type Manually' }]

},
{
  key: 'travel', label: 'Travel / Hotel', iconKey: 'travel', color: '#0ea5e9', modal: 'travel',
  subtypes: [
  { label: 'Hotel / Accommodation', type: 'hotel' },
  { label: 'Flights / Tour Package', type: 'flights' },
  { label: 'Vehicle Rental', type: 'vehicle_rental' }]

}];


export default function PostListingMenu({ user, compact = false, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {if (ref.current && !ref.current.contains(e.target) && !btnRef.current?.contains(e.target)) {setOpen(false);setExpandedCat(null);}};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((o) => !o);
    setExpandedCat(null);
  };

  const canPost = !!user && (user.role === 'admin' || user.user_type === 'seller' || user.user_type === 'business' || user.is_seller || user.account_type === 'business_owner');
  if (!canPost) return null;
  const visibleCategories = CATEGORIES;

  const handleSelectSubtype = (cat, subtype) => {
    setOpen(false);
    setExpandedCat(null);
    if (!user) {setShowSignup(true);return;}
    const sub = subtype.subcategory ? `&sub=${encodeURIComponent(subtype.subcategory)}` : '';
    navigate(`/post-ad?category=${cat.key}&type=${subtype.type}${sub}`);
  };

  const handleSelectCat = (cat) => {
    if (!user) {setOpen(false);setShowSignup(true);return;}
    setExpandedCat(expandedCat === cat.key ? null : cat.key);
  };

  const btnLabel = iconOnly ? null : 'Post an Ad';

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        className={`flex items-center gap-1.5 font-body font-bold transition-all rounded-xl ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white/8 border border-white/10 text-white/70 hover:text-white hover:border-[#00D4FF]/40'
            : 'px-4 py-2 text-xs bg-[#00D4FF] hover:bg-white text-[#0A192F]'
        }`}
        style={!compact ? { boxShadow: '0 0 14px rgba(0,212,255,0.3)' } : undefined}
      >
        {btnLabel}
      </button>

      {/* Dropdown (portal) */}
      <div className="relative" ref={ref}>
        








        

        <AnimatePresence>
          {open && createPortal(
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="rounded-2xl shadow-2xl z-[99999]"
              style={{ position: 'fixed', top: dropdownPos.top, left: Math.min(dropdownPos.left, window.innerWidth - 370), background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)', width: 'min(360px, 96vw)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <div className="p-3">
                <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold px-1 pb-2">Post an Ad — Choose Category</p>
                {/* Categories in 2-col grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {visibleCategories.map((cat) =>
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
                  )}
                </div>
                {/* Subcategories — horizontal scrollable row */}
                <AnimatePresence>
                  {expandedCat &&
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                      {(() => {
                      const cat = visibleCategories.find((c) => c.key === expandedCat);
                      if (!cat) return null;
                      return (
                        <div className="pt-2 border-t border-white/10">
                            <p className="font-body text-[9px] text-white/40 uppercase tracking-wider font-bold mb-2 px-1" style={{ color: cat.color }}>
                              {cat.label} — Pick type:
                            </p>
                            <div className="flex flex-wrap gap-1.5 pb-1">
                              {cat.subtypes.map((sub) =>
                            <button key={`${sub.type}-${sub.label}`} onClick={() => handleSelectSubtype(cat, sub)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[11px] font-semibold text-white/80 hover:text-white transition-all hover:scale-105"
                            style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}33` }}>
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                  {sub.label}
                                </button>
                            )}
                            </div>
                          </div>);

                    })()}
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </motion.div>,
            document.body)
          }
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </>
  );
}