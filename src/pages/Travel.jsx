import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Star, Heart, Share2, ChevronRight, MapPin, Hotel, Palmtree, Plane, Ship, Car, Tent, Waves, Mountain, Anchor, Bus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ParticleBackground from '../components/ParticleBackground';
import { AnimatePresence } from 'framer-motion';
import TravelPostModal from '../components/travel/TravelPostModal';
import MemberSignupModal from '../components/MemberSignupModal';
import ScrollToTop from '../components/ScrollToTop';
import MascotDog from '../components/MascotDog';
import BecomeSellerBanner from '../components/BecomeSelllerBanner';
import SmartFilterChips from '../components/SmartFilterChips';
import ListingLandingBrandBar from '@/components/listing/ListingLandingBrandBar';

const TRAVEL_CATEGORIES = [
  { key: 'hotel',       label: 'Hotels',         icon: <Hotel className="w-4 h-4" />, color: '#6366f1' },
  { key: 'resort',      label: 'Resorts',         icon: <Palmtree className="w-4 h-4" />, color: '#10b981' },
  { key: 'flights',     label: 'Flights & Tours', icon: <Plane className="w-4 h-4" />, color: '#3b82f6' },
  { key: 'ferry',       label: 'Ferry & Bus',      icon: <Ship className="w-4 h-4" />, color: '#0891b2' },
  { key: 'car_rental',  label: 'Car Rentals',      icon: <Car className="w-4 h-4" />, color: '#f59e0b' },
  { key: 'van_rental',  label: 'Van Rentals',      icon: <Bus className="w-4 h-4" />, color: '#f97316' },
  { key: 'island',      label: 'Island Hopping',   icon: <Waves className="w-4 h-4" />, color: '#06b6d4' },
  { key: 'camping',     label: 'Camping',          icon: <Tent className="w-4 h-4" />, color: '#84cc16' },
  { key: 'hiking',      label: 'Hiking',           icon: <Mountain className="w-4 h-4" />, color: '#78716c' },
  { key: 'diving',      label: 'Diving',           icon: <Anchor className="w-4 h-4" />, color: '#0284c7' },
  { key: 'surfing',     label: 'Surfing',          icon: <Waves className="w-4 h-4" />, color: '#0d9488' },
];

const STATIC_LISTINGS = [
  { id: 's1',  type: 'hotel',      title: 'The Peninsula Manila — Deluxe Suite',   location: 'Makati',   area: 'Ayala Ave',      price: 8500,  price_label: '₱8,500/night',   image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',  rating: 4.9, subcategory: 'Luxury Hotel',    description: 'Premier luxury hotel in the heart of Makati CBD.' },
  { id: 's10', type: 'hotel',      title: 'Seda BGC — Superior Room',              location: 'Taguig',   area: 'BGC',            price: 5500,  price_label: '₱5,500/night',   image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',  rating: 4.7, subcategory: 'Business Hotel',  description: 'Modern business hotel in the heart of BGC. Infinity pool.' },
  { id: 's13', type: 'hotel',      title: 'Microtel by Wyndham Cavite',            location: 'Cavite',   area: 'Gen. Trias',     price: 2800,  price_label: '₱2,800/night',   image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',  rating: 4.4, subcategory: 'Budget Hotel',    description: 'Comfortable stay near Imus and Bacoor.' },
  { id: 's14', type: 'hotel',      title: 'Acacia Hotel Manila — Deluxe Room',    location: 'Alabang',  area: 'Muntinlupa',     price: 4200,  price_label: '₱4,200/night',   image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',  rating: 4.6, subcategory: 'Boutique Hotel',  description: 'Tropical-themed hotel in Alabang. Great for families.' },

  { id: 's2',  type: 'resort',     title: 'Crimson Resort & Spa Boracay',         location: 'Boracay',  area: 'White Beach',    price: 12000, price_label: '₱12,000/night',  image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',  rating: 4.8, subcategory: 'Beach Resort',    description: 'Luxury beachfront resort on Boracay\'s white sand beach.' },
  { id: 's15', type: 'resort',     title: 'Club Paradise Palawan',                location: 'Palawan',  area: 'Coron',          price: 9500,  price_label: '₱9,500/night',   image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',  rating: 4.9, subcategory: 'Island Resort',   description: 'Eco-island resort with pristine coral reefs.' },
  { id: 's16', type: 'resort',     title: 'Plantation Bay Resort Mactan',         location: 'Cebu',     area: 'Mactan',         price: 7800,  price_label: '₱7,800/night',   image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',  rating: 4.7, subcategory: 'Lagoon Resort',   description: 'Largest saltwater lagoon resort in Southeast Asia.' },

  { id: 's3',  type: 'island',     title: 'El Nido Island Hopping Tour A',        location: 'Palawan',  area: 'El Nido',        price: 1200,  price_label: '₱1,200/person',  image_url: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',  rating: 4.9, subcategory: 'Island Hopping', description: 'Big Lagoon, Small Lagoon, Secret Lagoon & Shimizu Island.' },
  { id: 's17', type: 'island',     title: 'Coron Ultimate Island Hopping',        location: 'Palawan',  area: 'Coron',          price: 1500,  price_label: '₱1,500/person',  image_url: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=600&q=80',  rating: 4.8, subcategory: 'Island Hopping', description: 'Kayangan Lake, Twin Lagoon, Barracuda Lake.' },

  { id: 's4',  type: 'diving',     title: 'Tubbataha Reef Dive Expedition',       location: 'Palawan',  area: 'Sulu Sea',       price: 45000, price_label: '₱45,000/pkg',    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',  rating: 5.0, subcategory: 'Scuba Diving',   description: 'UNESCO World Heritage dive site. 5-day liveaboard.' },
  { id: 's18', type: 'diving',     title: 'Anilao Diving Package — Batangas',     location: 'Batangas', area: 'Anilao',         price: 3500,  price_label: '₱3,500/person',  image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',  rating: 4.7, subcategory: 'Scuba Diving',   description: 'Macro diving capital of the world. Day trip from Manila.' },

  { id: 's5',  type: 'surfing',    title: 'Siargao Surfing Lessons',              location: 'Siargao',  area: 'Cloud 9',        price: 800,   price_label: '₱800/session',   image_url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&q=80',  rating: 4.7, subcategory: 'Surf Lesson',    description: 'Professional instructors at Cloud 9. All levels welcome.' },
  { id: 's19', type: 'surfing',    title: 'La Union Surf Camp',                   location: 'La Union', area: 'San Juan',       price: 600,   price_label: '₱600/session',   image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',  rating: 4.5, subcategory: 'Surf Lesson',    description: 'Weekend surf getaway 5 hours from Manila.' },

  { id: 's6',  type: 'flights',    title: 'Batanes Heritage & Culture Tour',      location: 'Batanes',  area: 'Batan Island',   price: 3500,  price_label: '₱3,500/person',  image_url: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=600&q=80',  rating: 4.8, subcategory: 'Cultural Tour',  description: 'Stone houses, rolling hills and lighthouse of Batanes.' },
  { id: 's20', type: 'flights',    title: 'Cebu–Palawan Package Tour 5D4N',       location: 'Cebu',     area: 'Cebu & Palawan', price: 18000, price_label: '₱18,000/person', image_url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=600&q=80',  rating: 4.6, subcategory: 'Tour Package',   description: 'Island-hopping, canyoneering, freediving. Flights incl.' },

  { id: 's7',  type: 'car_rental', title: 'Toyota Innova — Cavite / Manila',      location: 'Cavite',   area: 'Bacoor',         price: 2500,  price_label: '₱2,500/day',     image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',  rating: 4.6, subcategory: 'Car Rental',    description: 'Well-maintained Innova with driver. Airport transfers.' },
  { id: 's21', type: 'car_rental', title: 'Toyota Fortuner 4x4 — Baguio',        location: 'Baguio',   area: 'Session Road',   price: 3200,  price_label: '₱3,200/day',     image_url: 'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=600&q=80',  rating: 4.5, subcategory: 'Car Rental',    description: '4x4 SUV perfect for Cordillera mountain routes.' },

  { id: 's12', type: 'van_rental', title: '10-Seater Van — Tagaytay Day Tour',    location: 'Tagaytay', area: 'Cavite',         price: 3800,  price_label: '₱3,800/day',     image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',  rating: 4.6, subcategory: 'Van Rental',    description: 'Air-conditioned van with driver for group trips.' },
  { id: 's22', type: 'van_rental', title: '15-Seater L300 — Batangas Day Trip',   location: 'Batangas', area: 'Batangas Port',  price: 4500,  price_label: '₱4,500/day',     image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80',  rating: 4.4, subcategory: 'Van Rental',    description: 'Large L300 van. Perfect for beach and island trips.' },

  { id: 's11', type: 'ferry',      title: 'Manila–Coron Fast Ferry',              location: 'Manila',   area: 'Batangas Port',  price: 1800,  price_label: '₱1,800/person',  image_url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80',  rating: 4.5, subcategory: 'Ferry Package', description: 'Fast craft from Batangas to Coron, Palawan.' },
  { id: 's23', type: 'ferry',      title: 'Cebu–Bohol Super Cat Ferry',           location: 'Cebu',     area: 'Pier 1',         price: 750,   price_label: '₱750/person',    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',  rating: 4.3, subcategory: 'Ferry',         description: 'Fast ferry to Bohol. 2-hour scenic trip.' },

  { id: 's8',  type: 'hiking',     title: 'Mt. Pulag Summit Trek',                location: 'Benguet',  area: 'Kabayan',        price: 2800,  price_label: '₱2,800/person',  image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',  rating: 4.9, subcategory: 'Mountain Trek', description: 'Highest peak in Luzon. Sea of clouds experience.' },
  { id: 's24', type: 'hiking',     title: 'Mt. Apo Expedition — 3D2N',           location: 'Davao',    area: 'Kapatagan',      price: 5500,  price_label: '₱5,500/person',  image_url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80',  rating: 4.8, subcategory: 'Mountain Trek', description: 'Highest peak in the Philippines. Guided expedition.' },

  { id: 's9',  type: 'camping',    title: 'Masungi Georeserve Camping',           location: 'Rizal',    area: 'Baras',          price: 1800,  price_label: '₱1,800/night',   image_url: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=600&q=80',  rating: 4.8, subcategory: 'Glamping',      description: 'Eco-camping in a protected forest. Guided trek included.' },
  { id: 's25', type: 'camping',    title: 'Cagbalete Island Camping — Quezon',    location: 'Quezon',   area: 'Cagbalete',      price: 900,   price_label: '₱900/person',    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',  rating: 4.6, subcategory: 'Beach Camping', description: 'Camp under the stars on a pristine white sand island.' },
];

function TravelCard({ listing, onShare }) {
  const [hearted, setHearted] = useState(false);
  const cat = TRAVEL_CATEGORIES.find(c => c.key === listing.type);
  const color = cat?.color || '#0ea5e9';

  return (
    <div className="flex-shrink-0 w-56 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'linear-gradient(160deg,#0f172a,#1e293b)', border: `1px solid ${color}22` }}>
      <div className="relative h-36 overflow-hidden">
        <img src={listing.image_url} alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        <button onClick={e => { e.stopPropagation(); setHearted(h => !h); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Heart className={`w-3.5 h-3.5 ${hearted ? 'fill-red-400 text-red-400' : 'text-white'}`} />
        </button>
        <button onClick={e => { e.stopPropagation(); onShare(listing); }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Share2 className="w-3.5 h-3.5 text-white" />
        </button>
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-black/50 flex items-center gap-1">
          <MapPin className="w-2 h-2" />{listing.area}
        </span>
      </div>
      <div className="p-3">
        <p className="font-body text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{listing.subcategory}</p>
        <h3 className="font-heading font-bold text-xs text-white leading-snug mb-1 line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between">
          <p className="font-heading font-bold text-sm text-amber-400">{listing.price_label}</p>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-body text-[10px] text-white/60">{listing.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalRow({ category, listings, onShare }) {
  const rowRef = useRef(null);
  const scroll = (dir) => { rowRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' }); };

  if (listings.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-white">{category.icon}</span>
          <h2 className="font-heading font-bold text-lg text-white">{category.label}</h2>
          <span className="px-2 py-0.5 rounded-full font-body text-[10px] font-bold text-white/60"
            style={{ background: `${category.color}22`, border: `1px solid ${category.color}33` }}>
            {listings.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => scroll(-1)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 rotate-180" />
          </button>
          <button onClick={() => scroll(1)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>
      <div ref={rowRef} className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {listings.map(l => <TravelCard key={l.id} listing={l} onShare={onShare} />)}
      </div>
    </div>
  );
}

function ShareModal({ listing, onClose }) {
  const url = `${window.location.origin}/listing/${listing.id}`;
  const text = encodeURIComponent(`Check out: ${listing.title}`);
  const encodedUrl = encodeURIComponent(url);
  const [copied, setCopied] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl p-5 shadow-2xl"
        style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)' }}>
        <h3 className="font-heading font-bold text-white mb-4">Share this listing</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
            <span className="font-body text-xs font-bold text-blue-300">FB</span>
            <span className="font-body text-[10px] text-white/70">Facebook</span>
          </a>
          <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-600/20 hover:bg-green-600/30 transition-colors">
            <span className="font-body text-xs font-bold text-green-300">WA</span>
            <span className="font-body text-[10px] text-white/70">WhatsApp</span>
          </a>
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${text}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 transition-colors">
            <span className="font-body text-xs font-bold text-sky-300">TG</span>
            <span className="font-body text-[10px] text-white/70">Telegram</span>
          </a>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="w-full py-2 rounded-xl font-body text-sm text-white transition-all"
          style={{ background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Travel() {
  const urlParams = new URLSearchParams(window.location.search);
  const shouldPost = urlParams.get('post') === '1';
  const urlSub = urlParams.get('sub');

  const [search, setSearch] = useState(urlSub || '');
  const [dbListings, setDbListings] = useState([]);
  const [shareTarget, setShareTarget] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showTravelPost, setShowTravelPost] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleAddListing = () => {
    if (!currentUser) { setShowSignup(true); return; }
    setShowTravelPost(true);
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => {
        setCurrentUser(u);
        if (shouldPost) setShowTravelPost(true);
      }).catch(() => {});
    }).catch(() => {});
    base44.entities.Listing.filter({ main_category: 'travel', is_active: true }, '-created_date', 100)
      .then(res => setDbListings(res)).catch(() => {});
  }, []);

  const normalizeType = (l) => {
    const sub = (l.subcategory || '').toLowerCase();
    const t = (l.type || '').toLowerCase();
    if (sub.includes('hotel') || t === 'hotel') return 'hotel';
    if (sub.includes('resort') || t === 'resort') return 'resort';
    if (sub.includes('flight') || sub.includes('tour') || t === 'flights') return 'flights';
    if (sub.includes('ferry') || sub.includes('bus') || t === 'ferry') return 'ferry';
    if (sub.includes('car') && sub.includes('rent')) return 'car_rental';
    if (sub.includes('van') && sub.includes('rent')) return 'van_rental';
    if (sub.includes('island')) return 'island';
    if (sub.includes('camp')) return 'camping';
    if (sub.includes('hik') || sub.includes('trek')) return 'hiking';
    if (sub.includes('div') || sub.includes('snorkel')) return 'diving';
    if (sub.includes('surf')) return 'surfing';
    return t;
  };

  const allListings = [
    ...STATIC_LISTINGS,
    ...dbListings.map(l => ({
      id: l.id,
      type: normalizeType(l),
      title: l.title,
      location: l.location,
      area: l.area || l.location,
      price: l.price,
      price_label: l.price_label || `₱${Number(l.price || 0).toLocaleString()}`,
      image_url: l.image_url,
      rating: l.rating || 4.5,
      subcategory: l.subcategory || '',
      description: l.description || '',
    }))
  ];

  const searchLower = search.toLowerCase();
  const filtered = search
    ? allListings.filter(l =>
        l.title.toLowerCase().includes(searchLower) ||
        l.location.toLowerCase().includes(searchLower) ||
        (l.area || '').toLowerCase().includes(searchLower) ||
        (l.subcategory || '').toLowerCase().includes(searchLower)
      )
    : allListings;

  const byCategory = (key) => filtered.filter(l => l.type === key);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      <ParticleBackground />
      <ListingLandingBrandBar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0033CC 0%,#1a4de8 60%,#0044cc 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-14">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-sky-200">Travel & Experiences</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">Explore the Philippines</h1>

            </div>
            <p className="font-body text-sm text-white/60 max-w-xl">Hotels, resorts, tours, island hopping, diving, surfing and more.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, hotels, activities..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} />
          </motion.div>
        </div>
      </div>

      {/* Category pill scroll */}
      <div className="sticky top-[88px] z-30 backdrop-blur-md border-b border-white/8" style={{ background: 'rgba(0,13,64,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TRAVEL_CATEGORIES.map(cat => (
              <a key={cat.key} href={`#${cat.key}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 hover:scale-105"
                style={{ background: `${cat.color}18`, color: cat.color, borderColor: `${cat.color}44` }}>
                <span className="text-white">{cat.icon}</span> {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Feeds */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <SmartFilterChips options={[
          { label: 'Hotels', onClick: () => setSearch('hotel') },
          { label: 'Flights & tours', onClick: () => setSearch('tour') },
          { label: 'Vehicle rentals', onClick: () => setSearch('rental') },
          { label: 'Clear search', onClick: () => setSearch('') },
        ]} />
        {search ? (
          <>
            <p className="font-body text-sm text-white/40 mb-6">{filtered.length} results for "{search}"</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(l => (
                <div key={l.id} className="w-full"><TravelCard listing={l} onShare={setShareTarget} /></div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-body text-white/30">No listings found for "{search}"</p>
              </div>
            )}
          </>
        ) : (
          TRAVEL_CATEGORIES.map(cat => (
            <div key={cat.key} id={cat.key}>
              <HorizontalRow category={cat} listings={byCategory(cat.key)} onShare={setShareTarget} />
            </div>
          ))
        )}

      </div>

      <ListingLandingBrandBar />

      {!currentUser && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-4">
          <BecomeSellerBanner />
        </div>
      )}

      <AnimatePresence>
        {shareTarget && <ShareModal listing={shareTarget} onClose={() => setShareTarget(null)} />}
        {showTravelPost && <TravelPostModal user={currentUser} onClose={() => setShowTravelPost(false)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
      <MascotDog page="travel" />
      <ScrollToTop />
    </div>
  );
}