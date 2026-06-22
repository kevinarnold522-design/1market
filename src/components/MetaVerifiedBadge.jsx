import React from 'react';

export default function MetaVerifiedBadge({ size = 'md', label = 'Verified' }) {
  const sizes = {
    xs: { badge: 14, font: '7px', ribbon: 10 },
    sm: { badge: 18, font: '8px', ribbon: 13 },
    md: { badge: 24, font: '9px', ribbon: 17 },
    lg: { badge: 32, font: '11px', ribbon: 22 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span className="inline-flex items-center gap-1 meta-verified-badge" title="Meta Verified ">
      {/* Animated badge icon */}
      <span className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: s.badge, height: s.badge }}>
        {/* Outer rotating ring */}
        <span className="absolute inset-0 rounded-full meta-badge-ring" style={{ background: 'conic-gradient(from 0deg, #a855f7, #818cf8, #38bdf8, #a855f7)', animation: 'metaRing 2.5s linear infinite', padding: 2 }}>
          <span className="block w-full h-full rounded-full" style={{ background: '#0D1F3C' }} />
        </span>
        {/* Inner shield/badge */}
        <svg viewBox="0 0 24 24" width={s.badge - 4} height={s.badge - 4} className="relative z-10" style={{ filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.7))' }}>
          <defs>
            <linearGradient id="mvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" className="meta-stop-1" />
              <stop offset="50%" stopColor="#818cf8" className="meta-stop-2" />
              <stop offset="100%" stopColor="#38bdf8" className="meta-stop-3" />
            </linearGradient>
          </defs>
          <path d="M12 2L3 7v5c0 5.5 3.9 10.7 9 12 5.1-1.3 9-6.5 9-12V7L12 2z" fill="url(#mvGrad)" />
          <polyline points="9,12 11,14 15,10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-check" />
        </svg>
      </span>

      {/* Label */}
      {label && (
        <span className="font-body font-bold meta-badge-label" style={{ fontSize: s.font }}>
          {label}
        </span>
      )}



      <style>{`
        @keyframes metaRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes metaCheckPulse {
          0%, 100% { stroke: white; }
          33% { stroke: #e879f9; }
          66% { stroke: #67e8f9; }
        }
        @keyframes metaLabelShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .meta-check {
          animation: metaCheckPulse 3s ease-in-out infinite;
        }
        .meta-badge-label {
          background: linear-gradient(90deg, #a855f7, #818cf8, #38bdf8, #c084fc, #a855f7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: metaLabelShift 3s linear infinite;
        }
        .meta-ribbon {
          animation: metaRing 4s linear infinite reverse;
          display: inline-block;
        }
        .meta-badge-ring {
          border-radius: 50%;
        }
      `}</style>
    </span>
  );
}