import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, Plus, Shield, ShoppingBag, Store } from 'lucide-react';
import AddListingModal from './AddListingModal';

export default function PostListingMenu({ user, compact = false, iconOnly = false, onSelect }) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const userType = user?.user_type;
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isBusinessAccount = userType === 'business' || user?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || user?.is_seller || isBusinessAccount;
  const canPost = !!user;

  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!canPost) return null;

  const options = [
    { label: isSellerAccount ? 'Seller Ad' : 'Post a Listing', desc: 'Post items, services, jobs, rent or travel', Icon: ShoppingBag },
    ...(isBusinessAccount ? [{ label: 'Business Ad', desc: 'Post under your business account', Icon: Building2 }] : []),
    ...(isAdmin ? [{ label: 'Admin Post', desc: 'Post as marketplace admin', Icon: Shield }] : []),
  ];

  const handleSelect = () => {
    setOpen(false);
    onSelect?.();
    setShowListingModal(true);
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 font-body font-bold transition-all rounded-xl ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white/8 border border-[#FFD700]/30 text-white/80 hover:text-white hover:border-[#FFD700]/70'
            : 'px-4 py-2.5 text-xs bg-[#FFD700] hover:bg-white text-[#0A192F]'
        }`}
        style={!compact ? { boxShadow: '0 0 16px rgba(255,215,0,0.42)' } : undefined}
      >
        {!iconOnly && <Plus className="w-3.5 h-3.5" />}
        {iconOnly ? <Plus className="w-4 h-4" /> : 'Post an Ad'}
        {!iconOnly && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-[9999] p-2" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.96),rgba(37,99,235,0.9))', border: '1px solid rgba(255,255,255,0.24)', backdropFilter: 'blur(24px)' }}>
          {options.map(({ label, desc, Icon }) => (
            <button key={label} type="button" onClick={handleSelect} className="w-full flex items-start gap-3 p-3 rounded-xl text-left hover:bg-white/10 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div>
                <p className="font-body text-sm font-bold text-white">{label}</p>
                <p className="font-body text-[10px] text-white/55 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <AnimatePresence>
        {showListingModal && <AddListingModal user={user} onClose={() => setShowListingModal(false)} />}
      </AnimatePresence>
    </div>
  );
}