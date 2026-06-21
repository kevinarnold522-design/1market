import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostListingMenu({ user, compact = false, iconOnly = false }) {
  const navigate = useNavigate();
  const userType = user?.user_type;
  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';
  const isBusinessAccount = userType === 'business' || user?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || user?.is_seller || isBusinessAccount;
  const isBlockedUserType = userType === 'rider' || (userType === 'customer' && !isSellerAccount);
  const canPost = !!user && !isBlockedUserType && (isAdmin || isSellerAccount);

  if (!canPost) return null;

  return (
    <button
      onClick={() => navigate('/post-ad')}
      className={`flex items-center gap-1.5 font-body font-bold transition-all rounded-xl ${
        compact
          ? 'px-2.5 py-1.5 text-xs bg-white/8 border border-white/10 text-white/70 hover:text-white hover:border-[#00D4FF]/40'
          : 'px-4 py-2 text-xs bg-[#00D4FF] hover:bg-white text-[#0A192F]'
      }`}
      style={!compact ? { boxShadow: '0 0 14px rgba(0,212,255,0.3)' } : undefined}
    >
      {iconOnly ? null : 'Post a Listing'}
    </button>
  );
}