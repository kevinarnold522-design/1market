import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, Plus, Shield, ShoppingBag, Store } from 'lucide-react';

export default function PostListingMenu({ user, compact = false, iconOnly = false, onSelect }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const userType = user?.user_type;
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isBusinessAccount = userType === 'business' || user?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || user?.is_seller || isBusinessAccount;
  const isBlockedUserType = userType === 'rider' || (userType === 'customer' && !isSellerAccount);
  const canPost = !!user && !isBlockedUserType && (isAdmin || isSellerAccount);

  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!canPost) return null;

  const options = [
    ...(isSellerAccount ? [{ label: 'Seller Ad', desc: 'Post items, services, jobs, rent or travel', Icon: ShoppingBag, path: '/post-ad?as=seller' }] : []),
    ...(isBusinessAccount ? [{ label: 'Business Ad', desc: 'Post under your business account', Icon: Building2, path: '/post-ad?as=business' }] : []),
    ...(isAdmin ? [{ label: 'Admin Post', desc: 'Post as marketplace admin', Icon: Shield, path: '/post-ad?as=admin' }] : []),
  ];

  const handleSelect = (path) => {
    setOpen(false);
    onSelect?.();
    navigate(path);
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 font-body font-bold transition-all rounded-xl ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white/8 border border-white/10 text-white/80 hover:text-white hover:border-[#00D4FF]/40'
            : 'px-4 py-2.5 text-xs bg-[#00D4FF] hover:bg-white text-[#0A192F]'
        }`}
        style={!compact ? { boxShadow: '0 0 14px rgba(0,212,255,0.3)' } : undefined}
      >
        {!iconOnly && <Plus className="w-3.5 h-3.5" />}
        {iconOnly ? <Plus className="w-4 h-4" /> : 'Post an Ad'}
        {!iconOnly && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-[9999]" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.96),rgba(37,99,235,0.9))', border: '1px solid rgba(255,255,255,0.24)', backdropFilter: 'blur(24px)' }}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#FFD700]" />
            <p className="font-body text-xs font-bold text-white">Choose Post Type</p>
          </div>
          <div className="p-2 space-y-1">
            {options.map(({ label, desc, Icon, path }) => (
              <button key={label} type="button" onClick={() => handleSelect(path)} className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#FFD700]" />
                </div>
                <div>
                  <p className="font-body text-xs font-bold text-white">{label}</p>
                  <p className="font-body text-[10px] text-white/55 leading-snug">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}