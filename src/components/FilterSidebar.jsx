import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  // category filter
  categories = [],
  activeCategory,
  onCategoryChange,
  // location filter
  locations = [],
  activeLocation,
  onLocationChange,
  // price range
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  // condition filter
  conditions = [],
  activeConditions = [],
  onConditionToggle,
  // delivery filter
  deliveryOptions = [],
  activeDelivery = [],
  onDeliveryToggle,
  // sort
  sortOptions = [],
  sortBy,
  onSortChange,
  // misc
  onReset,
  filterCount = 0,
}) {
  return (
    <aside className="w-full rounded-2xl overflow-hidden flex flex-col gap-3"
      style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(0,212,255,0.15)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-heading font-bold text-white text-sm">Filters</span>
          {filterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#00D4FF] text-[#0A192F] font-bold text-[10px] flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </div>
        {filterCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 font-body text-[10px] text-white/40 hover:text-red-400 transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-260px)]">

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Category</p>
            <div className="flex flex-col gap-1">
              {categories.map(cat => (
                <button key={cat.key} onClick={() => onCategoryChange(cat.key)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left group"
                  style={{
                    background: activeCategory === cat.key ? `${cat.color || '#00D4FF'}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeCategory === cat.key ? (cat.color || '#00D4FF') + '44' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  {cat.Icon && (
                    <cat.Icon className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: activeCategory === cat.key ? (cat.color || '#00D4FF') : 'rgba(255,255,255,0.35)' }} />
                  )}
                  <span className="font-body text-xs font-semibold truncate"
                    style={{ color: activeCategory === cat.key ? 'white' : 'rgba(255,255,255,0.5)' }}>
                    {cat.label}
                  </span>
                  {activeCategory === cat.key && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: cat.color || '#00D4FF' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {locations.length > 0 && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Location</p>
            <div className="flex flex-wrap gap-1.5">
              {locations.map(loc => (
                <button key={loc} onClick={() => onLocationChange(loc)}
                  className="px-2.5 py-1 rounded-lg font-body font-semibold text-[11px] transition-all"
                  style={{
                    background: activeLocation === loc ? 'rgba(0,212,255,0.18)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${activeLocation === loc ? '#00D4FF44' : 'rgba(255,255,255,0.08)'}`,
                    color: activeLocation === loc ? '#00D4FF' : 'rgba(255,255,255,0.45)',
                  }}>
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        {(onPriceMinChange || onPriceMaxChange) && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Price Range (₱)</p>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" value={priceMin || ''} onChange={e => onPriceMinChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              <span className="text-white/30 font-body text-xs flex-shrink-0">–</span>
              <input type="number" placeholder="Max" value={priceMax || ''} onChange={e => onPriceMaxChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
            </div>
          </div>
        )}

        {/* Condition */}
        {conditions.length > 0 && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Condition</p>
            <div className="flex flex-col gap-1">
              {conditions.map(cond => (
                <label key={cond} className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div onClick={() => onConditionToggle(cond)}
                    className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                    style={{
                      background: activeConditions.includes(cond) ? '#00D4FF' : 'rgba(255,255,255,0.05)',
                      borderColor: activeConditions.includes(cond) ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                    }}>
                    {activeConditions.includes(cond) && (
                      <svg className="w-2.5 h-2.5 text-[#0A192F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-body text-xs text-white/60">{cond}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Options */}
        {deliveryOptions.length > 0 && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Delivery / Pickup</p>
            <div className="flex flex-col gap-1">
              {deliveryOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div onClick={() => onDeliveryToggle(opt)}
                    className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                    style={{
                      background: activeDelivery.includes(opt) ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                      borderColor: activeDelivery.includes(opt) ? '#8b5cf6' : 'rgba(255,255,255,0.15)',
                    }}>
                    {activeDelivery.includes(opt) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-body text-xs text-white/60">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        {sortOptions.length > 0 && (
          <div>
            <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Sort By</p>
            <div className="flex flex-col gap-1">
              {sortOptions.map(opt => (
                <button key={opt} onClick={() => onSortChange(opt)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left"
                  style={{
                    background: sortBy === opt ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sortBy === opt ? '#00D4FF44' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <span className="font-body text-xs font-semibold"
                    style={{ color: sortBy === opt ? '#00D4FF' : 'rgba(255,255,255,0.5)' }}>
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}