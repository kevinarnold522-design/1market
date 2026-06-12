import React from 'react';

/**
 * Unified rectangular account type badge — used everywhere.
 * No emojis. Royal Blue theme. Professional corporate look.
 */

const BADGE_CONFIGS = {
  admin: {
    label: 'Admin',
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.4)',
    color: '#fbbf24',
  },
  ceo: {
    label: 'CEO & Founder',
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.4)',
    color: '#fbbf24',
  },
  business: {
    label: 'Business Account',
    bg: 'rgba(37,99,235,0.2)',
    border: 'rgba(37,99,235,0.5)',
    color: '#93c5fd',
  },
  seller: {
    label: 'Sales Account',
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.4)',
    color: '#6ee7b7',
  },
  sales: {
    label: 'Sales Account',
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.4)',
    color: '#6ee7b7',
  },
  rider: {
    label: 'Rider Delivery',
    bg: 'rgba(251,191,36,0.15)',
    border: 'rgba(251,191,36,0.4)',
    color: '#fde68a',
  },
  customer: {
    label: 'Customer Account',
    bg: 'rgba(37,99,235,0.15)',
    border: 'rgba(37,99,235,0.35)',
    color: '#60a5fa',
  },
  ghost: {
    label: 'Test Account',
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.4)',
    color: '#c084fc',
  },
};

function resolveType(user, isAdmin, isGhostSession) {
  if (isAdmin) return 'admin';
  if (isGhostSession) return 'ghost';
  if (user?.user_type === 'business' || user?.account_type === 'business_owner') return 'business';
  if (user?.user_type === 'rider') return 'rider';
  if (user?.user_type === 'seller' || user?.is_seller) return 'seller';
  return 'customer';
}

export default function AccountTypeBadge({ user, isAdmin = false, isGhostSession = false, type, label, size = 'sm' }) {
  const resolvedType = type || resolveType(user, isAdmin, isGhostSession);
  const config = BADGE_CONFIGS[resolvedType] || BADGE_CONFIGS.customer;
  const displayLabel = label || config.label;

  const sizeStyles = {
    xs: { fontSize: '9px', padding: '2px 8px', borderRadius: '4px' },
    sm: { fontSize: '10px', padding: '3px 10px', borderRadius: '5px' },
    md: { fontSize: '11px', padding: '4px 12px', borderRadius: '6px' },
  };

  return (
    <span
      className="inline-flex items-center font-body font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        ...sizeStyles[size] || sizeStyles.sm,
      }}
    >
      {displayLabel}
    </span>
  );
}

export { resolveType, BADGE_CONFIGS };