import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SmartFilterChips({ title = 'Smart filters', options = [] }) {
  if (!options.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap rounded-2xl p-3 mb-4" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.14)' }}>
      <span className="inline-flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-wider text-[#00D4FF] mr-1">
        <Sparkles className="w-3.5 h-3.5" /> {title}
      </span>
      {options.map(option => (
        <button key={option.label} onClick={option.onClick} className="px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white/70 hover:text-white transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {option.label}
        </button>
      ))}
    </div>
  );
}