import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ShoppingBag, UtensilsCrossed, Plane, Home, Wrench, Briefcase, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SUBCATEGORIES } from '../../lib/listingCategories';

const NAV_CATEGORIES = [
  { label: 'Buy & Sell', href: '/buysell', icon: ShoppingBag, types: ['product', 'electronics', 'clothing', 'shoes', 'cars', 'furniture', 'houses', 'mods', 'other'], color: '#3E97F1' },
  { label: 'Food',        href: '/food',    icon: UtensilsCrossed, types: ['food'],                                color: '#f97316' },
  { label: 'Travel',      href: '/travel',  icon: Plane, types: ['hotel', 'resort', 'flights', 'ferry', 'car_rental', 'van_rental', 'island', 'camping', 'hiking', 'diving', 'surfing', 'vehicle_rental'], color: '#22d3ee' },
  { label: 'Rent & Lease', href: '/rent',   icon: Home,  types: ['rent_lease'],                                  color: '#a78bfa' },
  { label: 'Services',    href: '/services',icon: Wrench, types: ['services'],                                   color: '#34d399' },
  { label: 'Jobs',        href: '/jobs',    icon: Briefcase, types: ['jobs'],                                    color: '#fbbf24' },
  { label: 'Explore',    href: '/explore',  icon: Compass, types: [],                                           color: '#00D4FF' },
];

const TYPE_LABELS = {
  product: 'General Products', electronics: 'Electronics', clothing: 'Clothing', shoes: 'Shoes',
  cars: 'Cars & Vehicles', furniture: 'Furniture', houses: 'Real Estate', mods: 'Mods', other: 'Other',
  food: 'Food', hotel: 'Hotels', flights: 'Flights', vehicle_rental: 'Vehicle Rental',
  resort: 'Resorts', ferry: 'Ferry & Bus', car_rental: 'Car Rentals', van_rental: 'Van Rentals',
  island: 'Island Hopping', camping: 'Camping', hiking: 'Hiking', diving: 'Diving', surfing: 'Surfing',
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
        <div className="flex items-center gap-2">
          <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
          <p className="font-heading font-bold text-white text-sm">{cat.label}</p>
        </div>
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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div ref={ref} className="relative flex items-center w-full">
      {/* Left fade indicator */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, rgba(0,13,64,0.95), transparent)' }} />
      )}

      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NAV_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isOpen = open === cat.label;
          return (
            <div key={cat.label} className="relative flex-shrink-0">
              {cat.types.length === 0 ? (
                <Link to={cat.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all whitespace-nowrap border"
                  style={{ color: 'rgba(226,232,240,0.85)', background: 'rgba(71,85,105,0.35)', borderColor: 'rgba(100,116,139,0.45)' }}>
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </Link>
              ) : (
                <>
                  <button
                    onMouseEnter={() => setOpen(cat.label)}
                    onClick={() => setOpen(isOpen ? null : cat.label)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all whitespace-nowrap border"
                    style={isOpen
                      ? { color: '#fff', background: `rgba(100,116,139,0.45)`, borderColor: `rgba(148,163,184,0.7)` }
                      : { color: 'rgba(226,232,240,0.85)', background: 'rgba(71,85,105,0.35)', borderColor: 'rgba(100,116,139,0.45)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: isOpen ? '#fff' : 'rgba(203,213,225,0.7)' }} />
                    {cat.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <CategoryDropdown cat={cat} onClose={() => setOpen(null)} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Right fade + chevron indicator */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none flex items-center justify-end pr-1"
          style={{ background: 'linear-gradient(270deg, rgba(0,13,64,0.95), transparent)' }}>
          <ChevronDown className="w-3 h-3 text-white/40 -rotate-90" />
        </div>
      )}
    </div>
  );
}