import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated SVG sea creatures.
 * Every creature has a blinking eye, a moving head/tail/fin and reacts on hover.
 * They are intended to be placed inside the swimming wrapper in OceanCategoryBackdrop.
 */

const fb = { transformBox: 'fill-box', transformOrigin: 'center' };

// Reusable blinking eye (white sclera + pupil + highlight). The pupil group blinks.
function Eye({ cx, cy, r = 4, look = 0 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
      <motion.g
        style={{ ...fb, transformOrigin: `${cx}px ${cy}px` }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 4.5, times: [0, 0.86, 0.91, 0.96, 1], repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx={cx + look} cy={cy} r={r * 0.55} fill="#0b1f3a" />
        <circle cx={cx + look - r * 0.2} cy={cy - r * 0.2} r={r * 0.18} fill="#ffffff" />
      </motion.g>
    </g>
  );
}

// generic fin/tail flutter wrapper
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
  return (
    <svg viewBox="0 0 80 50" className={className}>
      <Flutter origin="left center" dur={0.7} deg={12}>
        <path d="M8 25 L24 12 L24 38 Z" fill="#f59e0b" />
      </Flutter>
      <ellipse cx="48" cy="25" rx="26" ry="16" fill="#fbbf24" />
      <path d="M48 9 q10 -8 18 -2 q-6 6 -10 8 Z" fill="#f59e0b" />
      <path d="M30 25 h28 M34 17 h22 M34 33 h22" stroke="#f59e0b" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <Eye cx="62" cy="22" r="5" look={1} />
      <path d="M70 30 q4 1 5 4" stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Clownfish({ className }) {
  return (
    <svg viewBox="0 0 80 50" className={className}>
      <Flutter origin="left center" dur={0.6} deg={14}>
        <path d="M8 25 L24 14 L24 36 Z" fill="#ea580c" />
      </Flutter>
      <ellipse cx="48" cy="25" rx="26" ry="15" fill="#fb7185" />
      <ellipse cx="48" cy="25" rx="26" ry="15" fill="none" />
      <path d="M40 11 q3 14 0 28 q6 1 8 0 q-3 -14 0 -28 q-5 -1 -8 0" fill="#ffffff" />
      <path d="M60 13 q3 12 0 24 q5 0 7 -2 q-3 -10 0 -20 q-4 -2 -7 -2" fill="#ffffff" />
      <Eye cx="64" cy="22" r="4.5" look={1} />
    </svg>
  );
}

export function Puffer({ className }) {
  return (
    <svg viewBox="0 0 70 60" className={className}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 35 + Math.cos(a) * 24;
        const y = 30 + Math.sin(a) * 24;
        const x2 = 35 + Math.cos(a) * 30;
        const y2 = 30 + Math.sin(a) * 30;
        return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <circle cx="35" cy="30" r="23" fill="#4ade80" />
      <Eye cx="26" cy="26" r="5" look={-1} />
      <Eye cx="44" cy="26" r="5" look={1} />
      <path d="M28 42 q7 5 14 0" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Turtle({ className }) {
  return (
    <svg viewBox="0 0 90 60" className={className}>
      <Flutter origin="20px 46px" dur={1} deg={10}>
        <ellipse cx="18" cy="46" rx="9" ry="5" fill="#15803d" />
      </Flutter>
      <Flutter origin="62px 46px" dur={1.1} deg={10}>
        <ellipse cx="62" cy="46" rx="9" ry="5" fill="#15803d" />
      </Flutter>
      {/* head pokes in and out */}
      <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <ellipse cx="74" cy="28" rx="11" ry="9" fill="#22c55e" />
        <Eye cx="79" cy="25" r="3.5" look={1} />
      </motion.g>
      <ellipse cx="40" cy="30" rx="30" ry="22" fill="#166534" />
      <path d="M40 8 v44 M12 30 h56 M20 14 l40 32 M60 14 l-40 32" stroke="#14532d" strokeWidth="2.5" opacity="0.6" />
      <ellipse cx="40" cy="30" rx="22" ry="15" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function Jellyfish({ className }) {
  return (
    <svg viewBox="0 0 60 80" className={className}>
      <path d="M6 30 a24 24 0 0 1 48 0 q0 6 -6 6 H12 q-6 0 -6 -6" fill="#c084fc" opacity="0.92" />
      <ellipse cx="30" cy="30" rx="24" ry="22" fill="#a855f7" opacity="0.35" />
      <Eye cx="22" cy="28" r="4" look={-1} />
      <Eye cx="38" cy="28" r="4" look={1} />
      {[12, 22, 30, 38, 48].map((x, i) => (
        <motion.path key={i}
          d={`M${x} 36 q-4 14 0 28 q4 -14 0 -28`}
          fill="#d8b4fe"
          style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
          animate={{ rotate: [-6, 6, -6], scaleY: [1, 1.12, 1] }}
          transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

export function Octopus({ className }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      {[14, 26, 40, 54, 66].map((x, i) => (
        <motion.path key={i}
          d={`M${x} 44 q${i % 2 ? -8 : 8} 16 ${i % 2 ? -4 : 4} 32`}
          stroke="#fb7185" strokeWidth="7" fill="none" strokeLinecap="round"
          style={{ transformBox: 'fill-box', transformOrigin: 'top center' }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.4 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <ellipse cx="40" cy="30" rx="26" ry="24" fill="#f43f5e" />
      <Eye cx="31" cy="26" r="5.5" look={-1} />
      <Eye cx="49" cy="26" r="5.5" look={1} />
      <path d="M33 40 q7 5 14 0" stroke="#9f1239" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Crab({ className }) {
  return (
    <svg viewBox="0 0 90 60" className={className}>
      {[-1, 1].map((s, i) => (
        <Flutter key={i} origin={`${45 + s * 30}px 40px`} dur={0.9} deg={16}>
          <g>
            <line x1={45 + s * 18} y1="34" x2={45 + s * 34} y2="28" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
            <path d={`M${45 + s * 34} 22 q${s * 10} 2 ${s * 8} 12 q${-s * 6} -2 ${-s * 4} -6`} fill="#ef4444" />
          </g>
        </Flutter>
      ))}
      {[-1, 1].map((s) => [0, 1, 2].map((j) => (
        <line key={`${s}-${j}`} x1={45 + s * 16} y1={44 + j * 4} x2={45 + s * 30} y2={48 + j * 5} stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
      )))}
      <ellipse cx="45" cy="40" rx="24" ry="16" fill="#ef4444" />
      <line x1="38" y1="26" x2="36" y2="16" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="26" x2="54" y2="16" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <Eye cx="36" cy="14" r="4.5" look={0} />
      <Eye cx="54" cy="14" r="4.5" look={0} />
      <path d="M38 44 q7 4 14 0" stroke="#7f1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Seahorse({ className }) {
  return (
    <svg viewBox="0 0 50 80" className={className}>
      <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M30 8 q14 6 8 22 q-4 12 -14 16 q-12 5 -8 18 q2 8 10 8" fill="none" stroke="#f59e0b" strokeWidth="11" strokeLinecap="round" />
        <path d="M30 6 q8 0 9 8 q-7 -4 -12 0 q1 -8 3 -8" fill="#fbbf24" />
        <path d="M34 14 h12 q-4 4 -10 4" fill="#f59e0b" />
      </motion.g>
      <Eye cx="33" cy="16" r="3.6" look={1} />
      <Flutter origin="22px 40px" dur={0.5} deg={18}>
        <path d="M22 36 q12 4 0 8 Z" fill="#fcd34d" />
      </Flutter>
    </svg>
  );
}

export function Whale({ className }) {
  return (
    <svg viewBox="0 0 110 60" className={className}>
      <motion.g style={fb} animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        {[0, 1, 2].map(i => (
          <motion.circle key={i} cx={20} cy={10 - i * 3} r={2.5} fill="#bae6fd"
            animate={{ y: [-2, -10, -2], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }} />
        ))}
      </motion.g>
      <Flutter origin="left center" dur={1.1} deg={12}>
        <path d="M6 30 L26 18 L26 42 Z" fill="#1d4ed8" />
      </Flutter>
      <path d="M22 30 q26 -26 62 -6 q14 8 18 12 q-30 16 -62 8 q-14 -4 -18 -14" fill="#2563eb" />
      <path d="M22 32 q24 14 60 8 q12 -2 20 -4 q-30 12 -62 6 q-12 -3 -18 -10" fill="#bfdbfe" opacity="0.85" />
      <Eye cx="78" cy="26" r="5" look={1} />
      <path d="M86 36 q6 0 9 3" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Shark({ className }) {
  return (
    <svg viewBox="0 0 110 56" className={className}>
      <Flutter origin="left center" dur={0.9} deg={14}>
        <path d="M6 28 L26 12 L24 28 L26 44 Z" fill="#475569" />
      </Flutter>
      <path d="M55 8 L70 26 L48 26 Z" fill="#64748b" />
      <path d="M24 28 q30 -22 70 -2 q10 5 12 6 q-26 14 -58 10 q-16 -2 -24 -14" fill="#94a3b8" />
      <path d="M24 30 q28 12 64 8 q14 -1 18 -4 q-24 12 -56 8 q-16 -2 -26 -12" fill="#e2e8f0" opacity="0.9" />
      <path d="M40 24 l8 -8 l4 10 Z" fill="#64748b" opacity="0.6" />
      <path d="M86 32 q8 1 16 -1 q-6 4 -12 5 q-3 0 -4 -4" fill="#cbd5e1" />
      <path d="M80 33 l5 2 l-5 2 l5 2" stroke="#475569" strokeWidth="1.4" fill="none" />
      <Eye cx="82" cy="24" r="4.5" look={1} />
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
