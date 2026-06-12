import React from 'react';

/**
 * Standardized account type badge — rectangular pill with consistent styling.
 * Usage: <AccountTypeBadge type="seller" label="Sales Account" size="sm" />
 */

const TYPE_STYLES = {
  admin:    { bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.45)', color: '#fbbf24' },
  business: { bg: 'rgba(37,99,235,0.18)',  border: 'rgba(37,99,235,0.45)',  color: '#93c5fd' },
  seller:   { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)',  color: '#6ee7b7' },
  rider:    { bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.38)', color: '#fde68a' },
  customer: { bg: 'rgba(37,99,235,0.13)', border: 'rgba(37,99,235,0.35)',  color: '#60a5fa' },
  ghost:    { bg: 'rgba(168,85,247,0.13)', border: 'rgba(168,85,247,0.35)', color: '#d8b4fe' },
};

const SIZE_STYLES = {
  xs: { fontSize: '8px',  padding: '2px 6px',  borderRadius: '4px', letterSpacing: '0.06em' },
  sm: { fontSize: '9px',  padding: '3px 10px', borderRadius: '5px', letterSpacing: '0.07em' },
  md: { fontSize: '10px', padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.08em' },
};

export default function AccountTypeBadge({ type = 'customer', label, size = 'sm', className = '' }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.customer;
  const sz = SIZE_STYLES[size] || SIZE_STYLES.sm;

  const displayLabel = label || {
    admin:    'CEO & Founder',
    business: 'Business Account',
    seller:   'Sales Account',
    rider:    'Rider Delivery',
    customer: 'Customer Account',
    ghost:    'Live Test Account',
  }[type] || 'Account';

  return (
    <span
      className={`inline-flex items-center font-body font-bold uppercase tracking-wider flex-shrink-0 ${className}`}
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        ...sz,
      }}>
      {displayLabel}
    </span>
  );
}