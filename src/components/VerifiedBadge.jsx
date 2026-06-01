import React, { useState } from 'react';

/**
 * Purple/Pink ribbon verified badge — no Meta branding, just "Verified Partner"
 * Has a revolving dot on hover.
 */
export default function VerifiedBadge({ size = 'sm', showLabel = false }) {
  const [hovered, setHovered] = useState(false);
  const sz = size === 'lg' ? 28 : size === 'md' ? 22 : 16;
  const radius = sz * 0.42;
  const cx = sz / 2;
  const cy = sz / 2;

  return (
    <span
      className="inline-flex items-center gap-1 select-none cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Verified Partner"
    >
      <span className="relative inline-block" style={{ width: sz, height: sz }}>
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vbg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="vglow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Ribbon star shape */}
          {[0,1,2,3,4,5,6,7].map(i => {
            const angle = (i * 45) * Math.PI / 180;
            const outerR = sz * 0.48;
            const innerR = sz * 0.38;
            return null; // built via polygon below
          })}
          <polygon
            points={Array.from({length:16},(_,i)=>{
              const angle = (i * 22.5 - 90) * Math.PI / 180;
              const r = i % 2 === 0 ? sz*0.48 : sz*0.36;
              return `${cx+r*Math.cos(angle)},${cy+r*Math.sin(angle)}`;
            }).join(' ')}
            fill="url(#vbg)"
            filter="url(#vglow)"
          />
          {/* Checkmark */}
          <path
            d={`M${cx-sz*0.18} ${cy} l${sz*0.12} ${sz*0.12} l${sz*0.22} -${sz*0.22}`}
            stroke="white"
            strokeWidth={sz * 0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* Revolving dot on hover */}
        {hovered && (
          <span
            className="absolute rounded-full"
            style={{
              width: sz * 0.18,
              height: sz * 0.18,
              background: 'linear-gradient(135deg,#a855f7,#ec4899)',
              boxShadow: '0 0 6px #a855f7',
              top: '50%',
              left: '50%',
              transformOrigin: `0 0`,
              animation: 'revolve 1s linear infinite',
              marginLeft: -sz*0.09,
              marginTop: -sz*0.09,
            }}
          />
        )}
      </span>
      {showLabel && (
        <span className="font-body font-bold text-[10px]" style={{ background: 'linear-gradient(90deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Verified Partner
        </span>
      )}
      <style>{`
        @keyframes revolve {
          0%   { transform: rotate(0deg) translateX(${sz * 0.52}px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(${sz * 0.52}px) rotate(-360deg); }
        }
      `}</style>
    </span>
  );
}