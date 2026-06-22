import React from 'react';

/**
 * The "1checkmark" — animated color-cycling verified badge used sitewide.
 * Replaces MetaVerifiedBadge for the Verified Partner context.
 * Pass showGetVerified=true to display a "Get Verified" CTA for unverified sellers.
 */
export default function OneCheckmark({ size = 'md', label = 'Verified Partner', showGetVerified = false, onGetVerified }) {
  const sizes = {
    xs: { outer: 18, inner: 13, font: '8px' },
    sm: { outer: 24, inner: 18, font: '9px' },
    md: { outer: 32, inner: 23, font: '10px' },
    lg: { outer: 42, inner: 30, font: '12px' },
    xl: { outer: 54, inner: 40, font: '14px' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span className="inline-flex items-center gap-1 one-checkmark-badge" title="1MarketPH Verified Partner ">
      <span className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: s.outer, height: s.outer }}>
        {/* Rotating ring */}
        <span className="absolute inset-0 rounded-full" style={{
          background: 'conic-gradient(from 0deg, #ff2d55, #ff9500, #ffcc00, #34c759, #007aff, #5856d6, #ff2d55)',
          animation: 'oneRing 2s linear infinite',
          padding: 2,
          borderRadius: '50%',
        }}>
          <span className="block w-full h-full rounded-full" style={{ background: '#0D1F3C' }} />
        </span>
        {/* Inner badge */}
        <svg viewBox="0 0 24 24" width={s.inner} height={s.inner} className="relative z-10">
          <defs>
            <linearGradient id="oneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2d55">
                <animate attributeName="stopColor" values="#ff2d55;#ff9500;#ffcc00;#34c759;#007aff;#5856d6;#ff2d55" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#007aff">
                <animate attributeName="stopColor" values="#007aff;#5856d6;#ff2d55;#ff9500;#ffcc00;#34c759;#007aff" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          {/* Shield shape */}
          <path d="M12 2L3 7v5c0 5.5 3.9 10.7 9 12 5.1-1.3 9-6.5 9-12V7L12 2z" fill="url(#oneGrad)"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,45,85,0.6))' }} />
          {/* "1" text */}
          <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif">1</text>
        </svg>
      </span>

      {label && (
        <span className="font-body font-bold one-checkmark-label" style={{ fontSize: s.font }}>
          {label}
        </span>
      )}

      {showGetVerified && onGetVerified && (
        <button
          onClick={onGetVerified}
          className="font-body font-bold text-[9px] px-2 py-0.5 rounded-full border transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(0,212,255,0.15))', borderColor: 'rgba(0,212,255,0.4)', color: '#00D4FF', whiteSpace: 'nowrap' }}
        >
          Get Verified
        </button>
      )}

      <style>{`
        @keyframes oneRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes oneLabelShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .one-checkmark-label {
          background: linear-gradient(90deg, #ff2d55, #ff9500, #ffcc00, #34c759, #007aff, #5856d6, #ff2d55);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: oneLabelShift 3s linear infinite;
        }
      `}</style>
    </span>
  );
}