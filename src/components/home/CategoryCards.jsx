import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFireTransition, FireOverlay } from './FireTransition';
import CategoryTransitionOverlay, { getTransitionTypeForHref, getSubtypeForSubcategory } from '../transitions/CategoryTransitionOverlay';
import OceanCategoryBackdrop from './OceanCategoryBackdrop';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import PostListingMenu from '../PostListingMenu';
import { Plane, UtensilsCrossed, ShoppingBag, Home, Wrench, Briefcase, ArrowLeft, X, Hotel, Palmtree, Ship, Car, Bus, Waves, Tent, Mountain, Anchor, Headphones, Laptop, Heart, DollarSign, FolderOpen, HardHat, Palette, ChefHat, Settings, BookOpen, Wifi, ClipboardList, Croissant, Coffee, Candy, ShoppingCart, Salad, Smartphone, CarFront, Shirt, Footprints, Sofa, Building2, Package, MoreHorizontal, BedDouble, Building, TreePine, Warehouse, Sparkles, Zap, CalendarCheck, Camera, GraduationCap, Truck, Search } from 'lucide-react';

// ── Subcategory definitions for each main category ──────────────────────────

const TRAVEL_SUBS = [
  { key: 'hotel',       label: 'Hotels',          Icon: Hotel,    desc: 'Budget to Luxury', href: '/travel' },
  { key: 'resort',      label: 'Resorts',          Icon: Palmtree, desc: 'Beach & Mountain', href: '/travel' },
  { key: 'flights',     label: 'Flights & Tours',  Icon: Plane,    desc: 'Packages & Promos', href: '/travel' },
  { key: 'island',      label: 'Island Hopping',   Icon: Waves,    desc: 'El Nido, Coron…', href: '/travel' },
  { key: 'car_rental',  label: 'Car Rentals',      Icon: Car,      desc: 'With/Without Driver', href: '/travel' },
  { key: 'van_rental',  label: 'Van Rentals',      Icon: Bus,      desc: 'Group Trips', href: '/travel' },
  { key: 'ferry',       label: 'Ferry & Bus',       Icon: Ship,     desc: 'Inter-island', href: '/travel' },
  { key: 'diving',      label: 'Diving',            Icon: Anchor,   desc: 'Scuba & Freedive', href: '/travel' },
  { key: 'surfing',     label: 'Surfing',           Icon: Waves,    desc: 'Lessons & Camps', href: '/travel' },
  { key: 'hiking',      label: 'Hiking',            Icon: Mountain, desc: 'Treks & Expeditions', href: '/travel' },
  { key: 'camping',     label: 'Camping',           Icon: Tent,     desc: 'Beach & Mountain', href: '/travel' },
];

const JOBS_SUBS = [
  { key: 'bpo',         label: 'BPO / Call Center', Icon: Headphones,    desc: 'CSR, TSR, Ops', href: '/jobs' },
  { key: 'tech',        label: 'IT & Tech',          Icon: Laptop,        desc: 'Dev, QA, IT Support', href: '/jobs' },
  { key: 'healthcare',  label: 'Healthcare',         Icon: Heart,         desc: 'Nurses, MedTech', href: '/jobs' },
  { key: 'finance',     label: 'Finance & Acctg',    Icon: DollarSign,    desc: 'CPA, Audit, Banking', href: '/jobs' },
  { key: 'hr',          label: 'HR & Admin',          Icon: FolderOpen,    desc: 'Recruitment, Payroll', href: '/jobs' },
  { key: 'engineering', label: 'Engineering',        Icon: HardHat,       desc: 'Civil, Safety, Logistics', href: '/jobs' },
  { key: 'creative',    label: 'Creative & Marketing',Icon: Palette,      desc: 'Design, Social Media', href: '/jobs' },
  { key: 'food',        label: 'Food & Restaurant',  Icon: ChefHat,       desc: 'Chef, Server, Barista', href: '/jobs' },
  { key: 'bluecolar',   label: 'Blue Collar',         Icon: Settings,      desc: 'Janitor, Guard, Driver', href: '/jobs' },
  { key: 'education',   label: 'Education',           Icon: BookOpen,      desc: 'Teacher, Tutor', href: '/jobs' },
  { key: 'wfh',         label: 'WFH / Remote',        Icon: Wifi,          desc: 'Virtual, Online', href: '/jobs' },
  { key: 'other',       label: 'Other / Not Listed',  Icon: ClipboardList, desc: 'All other roles', href: '/jobs' },
];

const FOOD_SUBS = [
  { key: 'Baked Goods',            label: 'Baked Goods',  Icon: Croissant,    href: '/food' },
  { key: 'Ready-to-Eat Meals',     label: 'Lutong Bahay', Icon: ChefHat,      href: '/food' },
  { key: 'Beverages',              label: 'Beverages',    Icon: Coffee,       href: '/food' },
  { key: 'Snacks',                 label: 'Snacks',       Icon: Package,      href: '/food' },
  { key: 'Desserts',               label: 'Desserts',     Icon: Candy,        href: '/food' },
  { key: 'Karinderya / Turo-turo', label: 'Karinderya',   Icon: UtensilsCrossed, href: '/food' },
  { key: 'Health Food',            label: 'Health Food',  Icon: Salad,        href: '/food' },
  { key: 'Ingredients / Grocery',  label: 'Grocery Items',Icon: ShoppingCart, href: '/food' },
];

const BUYSELL_SUBS = [
  { key: 'electronics',    label: 'Electronics',     Icon: Smartphone,   href: '/buysell' },
  { key: 'cars',           label: 'Cars & Vehicles', Icon: CarFront,     href: '/buysell' },
  { key: 'clothing',       label: 'Clothing',        Icon: Shirt,        href: '/buysell' },
  { key: 'shoes',          label: 'Shoes',           Icon: Footprints,   href: '/buysell' },
  { key: 'furniture',      label: 'Furniture',       Icon: Sofa,         href: '/buysell' },
  { key: 'houses',         label: 'Real Estate',     Icon: Building2,    href: '/buysell' },
  { key: 'homeappliances', label: 'Appliances',      Icon: Zap,          href: '/buysell' },
  { key: 'mods',           label: 'Mods & Customs',  Icon: Settings,     href: '/buysell' },
  { key: 'product',        label: 'General Products', Icon: Package,     href: '/buysell' },
  { key: 'other',          label: 'Other / Misc',    Icon: MoreHorizontal, href: '/buysell' },
];

const RENT_SUBS = [
  { key: 'Room for Rent',       label: 'Room for Rent',     Icon: BedDouble,   href: '/rent' },
  { key: 'Apartment / Condo',   label: 'Apartment / Condo', Icon: Building,    href: '/rent' },
  { key: 'House for Rent',      label: 'House for Rent',    Icon: Home,        href: '/rent' },
  { key: 'Bedspace / Dorm',     label: 'Bedspace / Dorm',   Icon: BedDouble,   href: '/rent' },
  { key: 'Commercial Space',    label: 'Commercial Space',  Icon: Building2,   href: '/rent' },
  { key: 'Office for Rent',     label: 'Office for Rent',   Icon: Briefcase,   href: '/rent' },
  { key: 'Venue / Events Space',label: 'Event Venue',       Icon: CalendarCheck, href: '/rent' },
  { key: 'Land for Lease',      label: 'Land / Lot',        Icon: TreePine,    href: '/rent' },
  { key: 'Warehouse / Storage', label: 'Warehouse',         Icon: Warehouse,   href: '/rent' },
];

const SERVICES_SUBS = [
  { key: 'Home Cleaning',      label: 'Cleaning',       Icon: Sparkles,     href: '/services' },
  { key: 'Plumbing',           label: 'Plumbing',       Icon: Wrench,       href: '/services' },
  { key: 'Electrical',         label: 'Electrical',     Icon: Zap,          href: '/services' },
  { key: 'Aircon Services',    label: 'Aircon',         Icon: Settings,     href: '/services' },
  { key: 'Web Development',    label: 'Web Dev',        Icon: Laptop,       href: '/services' },
  { key: 'Graphic Design',     label: 'Design',         Icon: Palette,      href: '/services' },
  { key: 'Event Planning',     label: 'Events',         Icon: CalendarCheck, href: '/services' },
  { key: 'Photography / Videography', label: 'Photo/Video', Icon: Camera,  href: '/services' },
  { key: 'Tutoring',           label: 'Tutoring',       Icon: GraduationCap, href: '/services' },
  { key: 'Massage / Spa',      label: 'Massage / Spa',  Icon: Heart,        href: '/services' },
  { key: 'Trucking',           label: 'Trucking',       Icon: Truck,        href: '/services' },
  { key: 'Other / Type Manually', label: 'Other',       Icon: MoreHorizontal, href: '/services' },
];

const CATEGORY_SUBS = {
  '/travel':   TRAVEL_SUBS,
  '/food':     FOOD_SUBS,
  '/buysell':  BUYSELL_SUBS,
  '/rent':     RENT_SUBS,
  '/services': SERVICES_SUBS,
  '/jobs':     JOBS_SUBS,
};

const CATEGORY_TITLES = {
  '/travel':   'Where are you going?',
  '/food':     'What are you craving?',
  '/buysell':  'What are you looking for?',
  '/rent':     'What do you need to rent?',
  '/services': 'What service do you need?',
  '/jobs':     'What kind of job?',
};

// ── Casino card for main categories ──────────────────────────────────────────

const CATEGORIES = [
  { label: 'Travel',       href: '/travel',   Icon: Plane,           desc: 'Hotels, Tours & Transport',    accent: '#dbeafe', gradient: 'linear-gradient(135deg,#3E97F1,#60A5FA)' },
  { label: 'Food',         href: '/food',     Icon: UtensilsCrossed, desc: 'Restaurants, Cafes & Home Cooks', accent: '#e0f2fe', gradient: 'linear-gradient(135deg,#3E97F1,#7dd3fc)' },
  { label: 'Buy & Sell',   href: '/buysell',  Icon: ShoppingBag,     desc: 'Shoes, Cars, Gadgets & More',  accent: '#bfdbfe', gradient: 'linear-gradient(135deg,#2563EB,#60A5FA)' },
  { label: 'Rent & Lease', href: '/rent',     Icon: Home,            desc: 'Homes, Vehicles & Equipment',  accent: '#dbeafe', gradient: 'linear-gradient(135deg,#38bdf8,#3E97F1)' },
  { label: 'Services',     href: '/services', Icon: Wrench,          desc: 'Plumbers, Tutors & Freelancers',accent: '#e0f2fe', gradient: 'linear-gradient(135deg,#60A5FA,#93c5fd)' },
  { label: 'Jobs',         href: '/jobs',     Icon: Briefcase,       desc: 'Hiring, Freelance & Remote Work',accent: '#bfdbfe', gradient: 'linear-gradient(135deg,#3E97F1,#BAE6FD)' },
];

const CARD_VALUES = ['A', 'K', 'Q', 'J', '10', '9'];

function CasinoCategoryCard({ cat, index, onClick }) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardIdx, setCardIdx] = useState(index % CARD_VALUES.length);

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % CARD_VALUES.length), 800);
    return () => clearInterval(t);
  }, []);

  const calcTilt = (clientX, clientY) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({ x: ((clientY - cy) / (rect.height / 2)) * -8, y: ((clientX - cx) / (rect.width / 2)) * 8 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });
  const { Icon } = cat;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{ perspective: '700px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => { setFlipped(false); reset(); }}
      onMouseMove={e => calcTilt(e.clientX, e.clientY)}
      onTouchStart={() => setFlipped(true)}
      onTouchEnd={() => { setFlipped(false); reset(); }}
    >
      <button onClick={() => onClick(cat.href)} className="block w-full text-left">
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
            transform: `perspective(700px) rotateY(${flipped ? 180 : tilt.y}deg) rotateX(${tilt.x}deg)`,
            transition: flipped ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.1s ease',
            aspectRatio: '1 / 1.1',
            position: 'relative',
          }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden', background: cat.gradient,
              border: `1.5px solid ${cat.accent}44`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${cat.accent}22`,
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2.5 text-[9px] font-black leading-none" style={{ color: cat.accent }}>
              <div>{CARD_VALUES[cardIdx]}</div>
            </div>
            <div className="absolute bottom-2 right-2.5 text-[9px] font-black leading-none rotate-180" style={{ color: cat.accent }}>
              <div>{CARD_VALUES[cardIdx]}</div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
              <div className="mb-3 p-3 rounded-2xl" style={{ background: `${cat.accent}22` }}>
                <Icon className="w-9 h-9 drop-shadow-lg" style={{ color: cat.accent }} />
              </div>
              <p className="font-heading font-bold text-lg text-white leading-tight">{cat.label}</p>
              <p className="font-body text-xs mt-1.5 text-white/70 leading-snug">{cat.desc}</p>
            </div>
          </div>

          {/* BACK — casino */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg,#3E97F1,#60A5FA)',
              border: `1.5px solid ${cat.accent}88`,
              boxShadow: `0 0 30px 8px ${cat.accent}33`,
            }}>
            <div className="absolute inset-1 rounded-xl border border-white/5"
              style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 2px,transparent 2px,transparent 10px)' }} />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <AnimatePresence mode="wait">
                <motion.div key={cardIdx}
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="text-center">
                  <p className="font-heading font-black text-5xl text-white drop-shadow-lg">{CARD_VALUES[cardIdx]}</p>
                </motion.div>
              </AnimatePresence>
              <p className="font-body text-xs font-bold text-white/60 mt-1">{cat.label}</p>
              <p className="font-body text-[10px] text-white/30">Tap to explore</p>
            </div>
            {['tl', 'br'].map(pos => (
              <div key={pos} className={`absolute ${pos === 'tl' ? 'top-2 left-3' : 'bottom-2 right-3 rotate-180'}`}>
                <p className="font-heading font-black text-xs" style={{ color: cat.accent }}>{CARD_VALUES[cardIdx]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

// ── Subcategory picker overlay ────────────────────────────────────────────────

const VALS_SUB  = ['A', 'K', 'Q', 'J', '10', '9'];
const GRADS_SUB = [
  'linear-gradient(135deg,#3E97F1,#60A5FA)',
  'linear-gradient(135deg,#60A5FA,#93c5fd)',
  'linear-gradient(135deg,#38bdf8,#3E97F1)',
  'linear-gradient(135deg,#2563EB,#60A5FA)',
  'linear-gradient(135deg,#3E97F1,#BAE6FD)',
  'linear-gradient(135deg,#60A5FA,#dbeafe)',
  'linear-gradient(135deg,#0ea5e9,#7dd3fc)',
  'linear-gradient(135deg,#3b82f6,#93c5fd)',
  'linear-gradient(135deg,#2563EB,#BAE6FD)',
];
const ACCENTS_SUB = ['#60a5fa','#f87171','#34d399','#c084fc','#38bdf8','#fbbf24','#fb923c','#4ade80','#e879f9'];

function SubCard({ sc, index, onClick }) {
  const [flipped, setFlipped] = useState(false);
  const accent = ACCENTS_SUB[index % ACCENTS_SUB.length];
  const [vIdx, setVIdx] = useState(index % VALS_SUB.length);

  useEffect(() => {
    const t = setInterval(() => setVIdx(i => (i + 1) % VALS_SUB.length), 850);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 18 }}
      style={{ perspective: '600px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={() => setFlipped(true)}
      onTouchEnd={() => setFlipped(false)}
      onClick={onClick}
      className="cursor-pointer select-none"
    >
      <motion.div style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        aspectRatio: '1/1.1',
        position: 'relative',
      }}>
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', background: GRADS_SUB[index % GRADS_SUB.length],
            border: `1.5px solid ${accent}44`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
          }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent pointer-events-none" />
          <div className="absolute top-1.5 left-2 text-[8px] font-black" style={{ color: accent }}><div>{VALS_SUB[vIdx]}</div></div>
          <div className="absolute bottom-1.5 right-2 text-[8px] font-black rotate-180" style={{ color: accent }}><div>{VALS_SUB[vIdx]}</div></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
            <div className="mb-1 p-1.5 rounded-xl" style={{ background: `${accent}22` }}>
              {sc.Icon && <sc.Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: accent }} />}
            </div>
            <p className="font-heading font-bold text-[10px] sm:text-xs text-white leading-tight text-center">{sc.label}</p>
            {sc.desc && <p className="font-body text-[8px] text-white/50 mt-0.5 text-center hidden sm:block">{sc.desc}</p>}
          </div>
        </div>
        {/* BACK */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg,#3E97F1,#60A5FA)',
            border: `1.5px solid ${accent}88`,
            boxShadow: `0 0 24px 6px ${accent}33`,
          }}>
          <div className="absolute inset-1 rounded-xl"
            style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 2px,transparent 2px,transparent 10px)' }} />
          <div className="relative z-10 text-center">
            <p className="font-heading font-black text-2xl text-white">{VALS_SUB[vIdx]}</p>
            <p className="font-body text-[8px] mt-0.5" style={{ color: accent }}>{sc.label}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SubcategoryPicker({ href, onClose, navigate, setTransition }) {
  const subs = CATEGORY_SUBS[href] || [];
  const title = CATEGORY_TITLES[href] || 'Choose a category';
  const [filter, setFilter] = useState('');
  const { user, isAuthenticated } = useAuth();

  const filtered = subs.filter(s =>
    !filter || s.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (sub) => {
    onClose();
    const type = getTransitionTypeForHref(sub.href);
    const subtype = getSubtypeForSubcategory(type, sub.label);
    if (type) {
      setTransition({ type, subtype });
      setTimeout(() => { navigate(`${sub.href}?type=${sub.key}&sub=${encodeURIComponent(sub.label)}`); setTransition(null); }, 1150);
      return;
    }
    navigate(`${sub.href}?type=${sub.key}&sub=${encodeURIComponent(sub.label)}`);
  };

  const handleBrowseAll = () => {
    onClose();
    navigate(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3E97F1]/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: 'linear-gradient(135deg,#3E97F1,#60A5FA)', border: '1px solid rgba(255,255,255,0.35)' }}
      >
        {/* shimmer bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(255,255,255,0.008) 20px,rgba(255,255,255,0.008) 21px)' }} />

        {/* Back + Close */}
        <button onClick={onClose}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-3.5 h-3.5 text-white/60" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 relative z-10 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Marketph.com</span>
          </div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">{title}</h2>
          <p className="font-body text-[10px] text-white/25 mt-1">Hover to flip • Tap to browse</p>
          {isAuthenticated && user && <div className="mt-3 flex justify-center"><PostListingMenu user={user} compact /></div>}
        </div>

        {/* Filter */}
        <div className="relative mb-4 z-10 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={filter} onChange={e => setFilter(e.target.value)}
          placeholder="Search subcategory..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 pr-1" style={{ scrollbarWidth: 'none' }}>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
            {filtered.map((sc, i) => (
              <SubCard key={sc.key} sc={sc} index={i} onClick={() => handleSelect(sc)} />
            ))}
          </div>
        </div>

        {/* Browse all link */}
        <div className="text-center mt-4 relative z-10 flex-shrink-0">
          <button onClick={handleBrowseAll}
            className="font-body text-xs text-[#00D4FF]/60 hover:text-[#00D4FF] transition-colors underline underline-offset-2">
            Browse all → (no filter)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main CategoryCards ────────────────────────────────────────────────────────

export default function CategoryCards() {
  const { firing, fireNavigate } = useFireTransition();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [transition, setTransition] = useState(null);
  const [pickerHref, setPickerHref] = useState(null);

  const handleCategoryClick = (href) => {
    // Always show subcategory picker first if we have subs defined
    if (CATEGORY_SUBS[href]?.length) {
      setPickerHref(href);
    } else {
      const type = getTransitionTypeForHref(href);
      if (type) {
        setTransition({ type, subtype: null });
        setTimeout(() => { navigate(href); setTransition(null); }, 1100);
      } else {
        fireNavigate(href);
      }
    }
  };

  return (
    <>
      <FireOverlay firing={firing} />
      <CategoryTransitionOverlay type={transition?.type} subtype={transition?.subtype || null} />

      <AnimatePresence>
        {pickerHref && (
          <SubcategoryPicker
          href={pickerHref}
          onClose={() => setPickerHref(null)}
          navigate={navigate}
          setTransition={setTransition}
          />
        )}
      </AnimatePresence>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 overflow-hidden rounded-[2rem] my-4">
        <OceanCategoryBackdrop />
        <div className="relative z-10 mb-6 text-center">
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#BAE6FD] drop-shadow">Explore 1Marketph.com</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-0.5 drop-shadow-lg">Browse by Category</h2>
          <p className="font-body text-[10px] text-white/80 mt-0.5 drop-shadow">Hover to flip • Click to explore</p>
          {isAuthenticated && user && <div className="mt-3 flex justify-center"><PostListingMenu user={user} compact /></div>}
        </div>
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <CasinoCategoryCard key={cat.label} cat={cat} index={i} onClick={handleCategoryClick} />
          ))}
        </div>
      </section>
    </>
  );
}