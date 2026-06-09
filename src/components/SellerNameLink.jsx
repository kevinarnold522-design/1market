import React from 'react';
import { Link } from 'react-router-dom';
import MetaVerifiedBadge from './MetaVerifiedBadge';

/**
 * SellerNameLink — Renders seller name + optional avatar as a clickable link
 * to the seller's profile/channel page.
 * 
 * Props:
 *   sellerId      — user id or username (used in URL)
 *   sellerName    — display name
 *   profilePicture — optional avatar URL
 *   isVerified    — show animated verified badge (MetaVerifiedBadge only)
 *   size          — 'sm' | 'md' (default 'sm')
 *   className     — extra classes
 */
export default function SellerNameLink({
  sellerId,
  sellerName,
  profilePicture,
  isVerified,
  size = 'sm',
  className = '',
}) {
  if (!sellerId && !sellerName) return null;

  const href = sellerId ? `/seller/${sellerId}` : null;
  const initials = (sellerName || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarSize = size === 'md' ? 'w-9 h-9 text-sm' : 'w-6 h-6 text-[10px]';
  const nameSize = size === 'md' ? 'text-sm' : 'text-xs';

  const inner = (
    <span className={`inline-flex items-center gap-1.5 group ${className}`}>
      {/* Avatar */}
      <span className={`${avatarSize} rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white`}
        style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
        {profilePicture
          ? <img src={profilePicture} alt={sellerName} className="w-full h-full object-cover" />
          : initials}
      </span>
      {/* Name */}
      <span className={`font-body font-semibold ${nameSize} text-white/70 group-hover:text-white transition-colors`}>
        {sellerName || 'Seller'}
      </span>
      {/* Only show animated MetaVerifiedBadge — no plain checkmarks */}
      {isVerified && <MetaVerifiedBadge size="xs" label="" />}
    </span>
  );

  if (!href) return inner;

  return (
    <Link to={href} onClick={e => e.stopPropagation()} className="hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  );
}