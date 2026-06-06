import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SUBCATEGORIES } from '../../lib/listingCategories';

const NAV_CATEGORIES = [
  { label: 'Buy & Sell', href: '/buysell', types: ['product', 'electronics', 'clothing', 'shoes', 'cars', 'furniture', 'houses', 'mods', 'other'], color: '#3E97F1' },
  { label: 'Food',        href: '/food',    types: ['food'],                                color: '#f97316' },
  { label: 'Travel',      href: '/travel',  types: ['hotel', 'flights', 'vehicle_rental'], color: '#22d3ee' },
  { label: 'For Rent',    href: '/rent',    types: ['rent_lease'],                          color: '#a78bfa' },
  { label: 'Services',    href: '/services',types: ['services'],                            color: '#34d399' },
  { label: 'Jobs',        href: '/jobs',    types: ['jobs'],                               color: '#fbbf24' },
];

const TYPE_LABELS = {
  product: 'General Products', electronics: 'Electronics', clothing: 'Clothing', shoes: 'Shoes',
  cars: 'Cars & Vehicles', furniture: 'Furniture', houses: 'Real Estate', mods: 'Mods', other: 'Other',
  food: 'Food', hotel: 'Hotels', flights: 'Flights', vehicle_rental: 'Vehicle Rental',
  rent_lease: 'For Rent', services: 'Services', jobs: 'Jobs',
};

function CategoryDropdown({ cat, onClose }) {
  const multiType = cat.types.length > 1;

  return (
    <div
      className="absolute top-full left-0 mt-1 w-72 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
      style={{ background: '#0D1F3C', border: `1px solid ${cat.color}40` }}
    >
      <div className="p-3 border-b border-white/10 flex items-center justify-between" style={{ background: `${cat.color}18` }}>
        <p className="font-heading font-bold text-white text-sm">{cat.label}</p>
        <Link to={cat.href} onClick={onClose}
          className="font-body text-[10px] font-semibold hover:underline" style={{ color: cat.color }}>
          Browse all →
        </Link>
      </div>
      <div className="p-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {multiType
          ? cat.types.map(type =>
              SUBCATEGORIES[type] ? (
                <div key={type} className="mb-2">
                  <p className="px-2 py-1 font-body text-[9px] font-bold uppercase tracking-wider text-white/30">{TYPE_LABELS[type]}</p>
                  {SUBCATEGORIES[type].map(sub => (
                    <Link key={sub}
                      to={`${cat.href}?type=${type}&sub=${encodeURIComponent(sub)}`}
                      onClick={onClose}
                      className="block px-3 py-1.5 rounded-lg font-body text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors">
                      {sub}
                    </Link>
                  ))}
                </div>
              ) : null
            )
          : (SUBCATEGORIES[cat.types[0]] || []).map(sub => (
              <Link key={sub}
                to={`${cat.href}?type=${cat.types[0]}&sub=${encodeURIComponent(sub)}`}
                onClick={onClose}
                className="block px-3 py-1.5 rounded-lg font-body text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors">
                {sub}
              </Link>
            ))
        }
      </div>
    </div>
  );
}

export default function NavCategoryBar() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-0.5 flex-wrap">
      {NAV_CATEGORIES.map(cat => (
        <div key={cat.label} className="relative">
          <button
            onMouseEnter={() => setOpen(cat.label)}
            onClick={() => setOpen(open === cat.label ? null : cat.label)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-body text-xs font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-all whitespace-nowrap"
          >
            {cat.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${open === cat.label ? 'rotate-180' : ''}`} />
          </button>
          {open === cat.label && (
            <CategoryDropdown cat={cat} onClose={() => setOpen(null)} />
          )}
        </div>
      ))}
    </div>
  );
}