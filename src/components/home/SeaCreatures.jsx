import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated, 3D-styled SVG sea creatures.
 * Depth is created with radial/linear gradients (volume), soft specular
 * highlights, and shaded undersides. Each creature also has a blinking eye and
 * moving head/tail/fins, and reacts on hover (handled by the parent wrapper).
 */

const fb = { transformBox: 'fill-box', transformOrigin: 'center' };

// Reusable blinking eye with a glossy 3D look.
function Eye({ id, cx, cy, r = 4, look = 0 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.15} rx={r} ry={r} fill={`url(#${id}-eye)`} stroke="rgba(0,0,0,0.18)" strokeWidth="0.5" />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: `${cx}px ${cy}px` }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 4.5, times: [0, 0.86, 0.91, 0.96, 1], repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx={cx + look} cy={cy} r={r * 0.55} fill="#0b1f3a" />
        <circle cx={cx + look + r * 0.18} cy={cy + r * 0.18} r={r * 0.16} fill="#163a63" />
        <circle cx={cx + look - r * 0.22} cy={cy - r * 0.24} r={r * 0.2} fill="#ffffff" />
      </motion.g>
    </g>
  );
}

// Shared gradient defs used by every creature for the glossy eye + soft shadow.
function CommonDefs({ id }) {
  return (
    <defs>
      <radialGradient id={`${id}-eye`} cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#dbe7f5" />
      </radialGradient>
      <radialGradient id={`${id}-shine`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#0a1f3a" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

function bodyGrad(id, key, c1, c2, c3) {
  return (
    <radialGradient id={`${id}-${key}`} cx="34%" cy="28%" r="85%">
      <stop offset="0%" stopColor={c1} />
      <stop offset="55%" stopColor={c2} />
      <stop offset="100%" stopColor={c3} />
    </radialGradient>
  );
}

function Flutter({ children, origin, dur = 0.8, deg = 8 }) {
  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: origin }}
      animate={{ rotate: [-deg, deg, -deg] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.g>
  );
}

export function Fish({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 50" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#fef3c7', '#fbbf24', '#b45309')}</defs>
      <Flutter origin="left center" dur={0.7} deg={12}>
        <path d="M8 25 L24 12 L24 38 Z" fill="#d97706" />
        <path d="M10 25 L23 16 L23 34 Z" fill="#f59e0b" opacity="0.8" />
      </Flutter>
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx="48" cy="25" rx="26" ry="16" fill={`url(#${id}-b)`} />
      </g>
      <path d="M48 9 q10 -8 18 -2 q-6 6 -10 8 Z" fill="#d97706" />
      <path d="M30 25 h28 M34 17 h22 M34 33 h22" stroke="#b45309" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
      <ellipse cx="42" cy="17" rx="14" ry="5" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="62" cy="22" r="5" look={1} />
      <path d="M70 30 q4 1 5 4" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Clownfish({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 50" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#fda4af', '#fb7185', '#be123c')}</defs>
      <Flutter origin="left center" dur={0.6} deg={14}>
        <path d="M8 25 L24 14 L24 36 Z" fill="#c2410c" />
      </Flutter>
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx="48" cy="25" rx="26" ry="15" fill={`url(#${id}-b)`} />
      </g>
      <path d="M40 11 q3 14 0 28 q6 1 8 0 q-3 -14 0 -28 q-5 -1 -8 0" fill="#fff7ed" />
      <path d="M60 13 q3 12 0 24 q5 0 7 -2 q-3 -10 0 -20 q-4 -2 -7 -2" fill="#fff7ed" />
      <path d="M40 11 q3 14 0 28" stroke="#9f1239" strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="44" cy="18" rx="13" ry="4.5" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="64" cy="22" r="4.5" look={1} />
    </svg>
  );
}

export function Puffer({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 70 60" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#bbf7d0', '#4ade80', '#15803d')}</defs>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 35 + Math.cos(a) * 23, y = 30 + Math.sin(a) * 23;
        const x2 = 35 + Math.cos(a) * 31, y2 = 30 + Math.sin(a) * 31;
        return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <g filter={`url(#${id}-soft)`}>
        <circle cx="35" cy="30" r="23" fill={`url(#${id}-b)`} />
      </g>
      <ellipse cx="28" cy="20" rx="13" ry="8" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="26" cy="26" r="5" look={-1} />
      <Eye id={id} cx="44" cy="26" r="5" look={1} />
      <path d="M28 42 q7 5 14 0" stroke="#14532d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Turtle({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 90 60" className={className}>
      <CommonDefs id={id} />
      <defs>
        {bodyGrad(id, 'sh', '#86efac', '#16a34a', '#14532d')}
        {bodyGrad(id, 'hd', '#bbf7d0', '#22c55e', '#15803d')}
      </defs>
      <Flutter origin="20px 46px" dur={1} deg={10}><ellipse cx="18" cy="46" rx="9" ry="5" fill="#15803d" /></Flutter>
      <Flutter origin="62px 46px" dur={1.1} deg={10}><ellipse cx="62" cy="46" rx="9" ry="5" fill="#15803d" /></Flutter>
      <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <ellipse cx="74" cy="28" rx="11" ry="9" fill={`url(#${id}-hd)`} />
        <Eye id={id} cx="79" cy="25" r="3.5" look={1} />
      </motion.g>
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx="40" cy="30" rx="30" ry="22" fill={`url(#${id}-sh)`} />
      </g>
      <path d="M40 8 v44 M12 30 h56 M20 14 l40 32 M60 14 l-40 32" stroke="#14532d" strokeWidth="2.5" opacity="0.55" />
      <ellipse cx="40" cy="30" rx="22" ry="15" fill="none" stroke="#bbf7d0" strokeWidth="2" opacity="0.5" />
      <ellipse cx="30" cy="20" rx="13" ry="6" fill={`url(#${id}-shine)`} />
    </svg>
  );
}

export function Jellyfish({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 80" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#f5d0fe', '#c084fc', '#7e22ce')}</defs>
      <g filter={`url(#${id}-soft)`}>
        <path d="M6 30 a24 24 0 0 1 48 0 q0 6 -6 6 H12 q-6 0 -6 -6" fill={`url(#${id}-b)`} opacity="0.95" />
      </g>
      <ellipse cx="24" cy="20" rx="15" ry="8" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="22" cy="28" r="4" look={-1} />
      <Eye id={id} cx="38" cy="28" r="4" look={1} />
      {[12, 22, 30, 38, 48].map((x, i) => (
        <motion.path key={i}
          d={`M${x} 36 q-4 14 0 28 q4 -14 0 -28`}
          fill="#e9d5ff"
          style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
          animate={{ rotate: [-6, 6, -6], scaleY: [1, 1.12, 1] }}
          transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

export function Octopus({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#fecdd3', '#fb7185', '#9f1239')}</defs>
      {[14, 26, 40, 54, 66].map((x, i) => (
        <motion.path key={i}
          d={`M${x} 44 q${i % 2 ? -8 : 8} 16 ${i % 2 ? -4 : 4} 32`}
          stroke={`url(#${id}-b)`} strokeWidth="7.5" fill="none" strokeLinecap="round"
          style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.4 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx="40" cy="30" rx="26" ry="24" fill={`url(#${id}-b)`} />
      </g>
      <ellipse cx="31" cy="19" rx="14" ry="8" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="31" cy="26" r="5.5" look={-1} />
      <Eye id={id} cx="49" cy="26" r="5.5" look={1} />
      <path d="M33 40 q7 5 14 0" stroke="#881337" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Crab({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 90 60" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#fecaca', '#ef4444', '#991b1b')}</defs>
      {[-1, 1].map((sgn, i) => (
        <Flutter key={i} origin={`${45 + sgn * 30}px 40px`} dur={0.9} deg={16}>
          <g>
            <line x1={45 + sgn * 18} y1="34" x2={45 + sgn * 34} y2="28" stroke="#dc2626" strokeWidth="5.5" strokeLinecap="round" />
            <path d={`M${45 + sgn * 34} 22 q${sgn * 10} 2 ${sgn * 8} 12 q${-sgn * 6} -2 ${-sgn * 4} -6`} fill={`url(#${id}-b)`} />
          </g>
        </Flutter>
      ))}
      {[-1, 1].map((sgn) => [0, 1, 2].map((j) => (
        <line key={`${sgn}-${j}`} x1={45 + sgn * 16} y1={44 + j * 4} x2={45 + sgn * 30} y2={48 + j * 5} stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
      )))}
      <g filter={`url(#${id}-soft)`}>
        <ellipse cx="45" cy="40" rx="24" ry="16" fill={`url(#${id}-b)`} />
      </g>
      <ellipse cx="38" cy="33" rx="13" ry="6" fill={`url(#${id}-shine)`} />
      <line x1="38" y1="26" x2="36" y2="16" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="26" x2="54" y2="16" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <Eye id={id} cx="36" cy="14" r="4.5" look={0} />
      <Eye id={id} cx="54" cy="14" r="4.5" look={0} />
      <path d="M38 44 q7 4 14 0" stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Seahorse({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 50 80" className={className}>
      <CommonDefs id={id} />
      <defs>
        <linearGradient id={`${id}-b`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <motion.g style={fb} animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <g filter={`url(#${id}-soft)`}>
          <path d="M30 8 q14 6 8 22 q-4 12 -14 16 q-12 5 -8 18 q2 8 10 8" fill="none" stroke={`url(#${id}-b)`} strokeWidth="11" strokeLinecap="round" />
        </g>
        <path d="M30 6 q8 0 9 8 q-7 -4 -12 0 q1 -8 3 -8" fill="#fcd34d" />
        <path d="M34 14 h12 q-4 4 -10 4" fill="#d97706" />
        <path d="M30 12 q9 4 6 16" stroke="#ffffff" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
      </motion.g>
      <Eye id={id} cx="33" cy="16" r="3.6" look={1} />
      <Flutter origin="22px 40px" dur={0.5} deg={18}>
        <path d="M22 36 q12 4 0 8 Z" fill="#fcd34d" />
      </Flutter>
    </svg>
  );
}

export function Whale({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 110 60" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#bfdbfe', '#2563eb', '#1e3a8a')}</defs>
      <motion.g style={fb} animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        {[0, 1, 2].map(i => (
          <motion.circle key={i} cx={20} cy={10 - i * 3} r={2.5} fill="#bae6fd"
            animate={{ y: [-2, -10, -2], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }} />
        ))}
      </motion.g>
      <Flutter origin="left center" dur={1.1} deg={12}>
        <path d="M6 30 L26 18 L26 42 Z" fill="#1e3a8a" />
      </Flutter>
      <g filter={`url(#${id}-soft)`}>
        <path d="M22 30 q26 -26 62 -6 q14 8 18 12 q-30 16 -62 8 q-14 -4 -18 -14" fill={`url(#${id}-b)`} />
      </g>
      <path d="M22 32 q24 14 60 8 q12 -2 20 -4 q-30 12 -62 6 q-12 -3 -18 -10" fill="#dbeafe" opacity="0.9" />
      <ellipse cx="50" cy="20" rx="22" ry="7" fill={`url(#${id}-shine)`} />
      <Eye id={id} cx="78" cy="26" r="5" look={1} />
      <path d="M86 36 q6 0 9 3" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Shark({ className }) {
  const id = useId();
  return (
    <svg viewBox="0 0 110 56" className={className}>
      <CommonDefs id={id} />
      <defs>{bodyGrad(id, 'b', '#e2e8f0', '#94a3b8', '#475569')}</defs>
      <Flutter origin="left center" dur={0.9} deg={14}>
        <path d="M6 28 L26 12 L24 28 L26 44 Z" fill="#475569" />
      </Flutter>
      <path d="M55 8 L70 26 L48 26 Z" fill="#64748b" />
      <g filter={`url(#${id}-soft)`}>
        <path d="M24 28 q30 -22 70 -2 q10 5 12 6 q-26 14 -58 10 q-16 -2 -24 -14" fill={`url(#${id}-b)`} />
      </g>
      <path d="M24 30 q28 12 64 8 q14 -1 18 -4 q-24 12 -56 8 q-16 -2 -26 -12" fill="#f1f5f9" opacity="0.92" />
      <ellipse cx="54" cy="18" rx="22" ry="6" fill={`url(#${id}-shine)`} />
      <path d="M40 24 l8 -8 l4 10 Z" fill="#64748b" opacity="0.6" />
      <path d="M86 32 q8 1 16 -1 q-6 4 -12 5 q-3 0 -4 -4" fill="#e2e8f0" />
      <path d="M80 33 l5 2 l-5 2 l5 2" stroke="#475569" strokeWidth="1.4" fill="none" />
      <Eye id={id} cx="82" cy="24" r="4.5" look={1} />
    </svg>
  );
}

export const SEA_CREATURES = {
  fish: Fish,
  clownfish: Clownfish,
  puffer: Puffer,
  turtle: Turtle,
  jellyfish: Jellyfish,
  octopus: Octopus,
  crab: Crab,
  seahorse: Seahorse,
  whale: Whale,
  shark: Shark,
};

export default SEA_CREATURES;
