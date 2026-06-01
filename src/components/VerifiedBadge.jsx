import React, { useState } from 'react';

/**
 * VerifiedBadge
 * variant="purple" (default) — for admins & business owners
 * variant="yellow" — for regular users (includes fire effect)
 */
export default function VerifiedBadge({ size = 'sm', showLabel = false, variant = 'purple' }) {
  const [hovered, setHovered] = useState(false);
  const sz = size === 'lg' ? 28 : size === 'md' ? 22 : 16;
  const cx = sz / 2;
  const cy = sz / 2;

  const isYellow = variant === 'yellow';

  const gradStart = isYellow ? '#fbbf24' : '#a855f7';
  const gradEnd   = isYellow ? '#f97316' : '#ec4899';
  const glowColor = isYellow ? 'rgba(251,191,36,0.7)' : 'rgba(168,85,247,0.9)';
  const glowBlur  = isYellow ? '2' : '3.5';
  const dotColor  = isYellow ? 'linear-gradient(135deg,#fbbf24,#f97316)' : 'linear-gradient(135deg,#a855f7,#ec4899)';
  const dotGlow   = isYellow ? '#fbbf24' : '#a855f7';
  const labelGrad = isYellow ? 'linear-gradient(90deg,#fbbf24,#f97316)' : 'linear-gradient(90deg,#a855f7,#ec4899)';

  return (
    <span
      className="inline-flex items-center gap-1 select-none cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isYellow ? 'Verified Member' : 'Verified Partner'}
      style={{ position: 'relative' }}
    >
      <span className="relative inline-block" style={{ width: sz, height: sz }}>
        {/* Purple outer glow ring */}
        {!isYellow && (
          <span className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: `0 0 ${hovered ? 20 : 10}px 4px rgba(168,85,247,0.85), 0 0 ${hovered ? 40 : 22}px 10px rgba(168,85,247,0.45), 0 0 ${hovered ? 60 : 35}px 18px rgba(168,85,247,0.2)`,
              borderRadius: '50%',
              transition: 'box-shadow 0.3s',
            }}
          />
        )}

        {/* Yellow fire particles */}
        {isYellow && hovered && (
          <>
            {[0,1,2,3,4].map(i => (
              <span key={i} className="absolute pointer-events-none"
                style={{
                  width: sz * 0.18,
                  height: sz * 0.26,
                  borderRadius: '50% 50% 40% 40%',
                  background: i % 2 === 0 ? '#fbbf24' : '#f97316',
                  left: `${15 + i * 14}%`,
                  bottom: '90%',
                  opacity: 0.85,
                  animation: `fireRise${i % 3} 0.6s ease-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  filter: 'blur(0.5px)',
                }}
              />
            ))}
          </>
        )}

        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`vbg_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
            <filter id={`vglow_${variant}`}>
              <feGaussianBlur stdDeviation={glowBlur} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <polygon
            points={Array.from({length:16},(_,i)=>{
              const angle = (i * 22.5 - 90) * Math.PI / 180;
              const r = i % 2 === 0 ? sz*0.48 : sz*0.36;
              return `${cx+r*Math.cos(angle)},${cy+r*Math.sin(angle)}`;
            }).join(' ')}
            fill={`url(#vbg_${variant})`}
            filter={`url(#vglow_${variant})`}
          />
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
              background: dotColor,
              boxShadow: `0 0 6px ${dotGlow}`,
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
        <span className="font-body font-bold text-[10px]"
          style={{ background: labelGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isYellow ? 'Verified Member' : 'Verified Partner'}
        </span>
      )}

      <style>{`
        @keyframes revolve {
          0%   { transform: rotate(0deg) translateX(${sz * 0.52}px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(${sz * 0.52}px) rotate(-360deg); }
        }
        @keyframes fireRise0 { 0%{transform:translateY(0) scale(1);opacity:0.9} 100%{transform:translateY(-${sz*0.5}px) scale(0.4);opacity:0} }
        @keyframes fireRise1 { 0%{transform:translateY(0) scale(1) rotate(-10deg);opacity:0.85} 100%{transform:translateY(-${sz*0.6}px) scale(0.3) rotate(10deg);opacity:0} }
        @keyframes fireRise2 { 0%{transform:translateY(0) scale(1) rotate(8deg);opacity:0.8} 100%{transform:translateY(-${sz*0.4}px) scale(0.5) rotate(-8deg);opacity:0} }
      `}</style>
    </span>
  );
}