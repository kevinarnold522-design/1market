import React, { useState, useEffect } from 'react';
import StarField from '../components/StarField';
import AdminEditOverlay from '../components/AdminEditOverlay';
import SubcategorySplash from '../components/SubcategorySplash';
import ScrollToTop from '../components/ScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, X, ChevronDown, Phone, MessageSquare, AlertCircle, ZoomIn, Heart, ShoppingCart, Pencil, Store, Flag } from 'lucide-react';
import ListingCardActions from '../components/ListingCardActions';
import ReportModal from '../components/ReportModal';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';
import AddListingModal from '../components/AddListingModal.jsx';
import { base44 } from '@/api/base44Client';
import AdminQuickAddFAB from '../components/admin/AdminQuickAddFAB';
import MascotDog from '../components/MascotDog';

const SUBCATEGORIES = [
  { key: 'shoes', label: 'Shoes', icon: '👟', desc: 'Sneakers, footwear & more' },
  { key: 'cars', label: 'Cars & Vehicles', icon: '🚗', desc: 'Sedans, SUVs, motorcycles' },
  { key: 'houses', label: 'Houses & Real Estate', icon: '🏠', desc: 'Homes, lots, condos' },
  { key: 'electronics', label: 'Electronics', icon: '📱', desc: 'Phones, laptops & gadgets' },
  { key: 'homeappliances', label: 'Home Appliances', icon: '🏠', desc: 'Ref, washer, AC & more' },
  { key: 'services', label: 'Services', icon: '🔧', desc: 'Freelancers, repairs & more' },
];

// No static/fake listings — all listings come from the database only

const SORT_OPTIONS = ['Latest Listings', 'Price: Low to High', 'Price: High to Low'];

const LISTING_ADMIN_FIELDS = [
  { key: 'title', label: 'Title' },
  { key: 'image_url', label: 'Main Image', type: 'image' },
  { key: 'extra_images', label: 'Additional Photos', type: 'images' },
  { key: 'type', label: 'Category' },
  { key: 'subcategory', label: 'Subcategory' },
  { key: 'price_label', label: 'Price Display' },
  { key: 'price', label: 'Price (₱)', type: 'number' },
  { key: 'location', label: 'Location' },
  { key: 'area', label: 'Area' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'seller_name', label: 'Seller Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'condition', label: 'Condition' },
  { key: 'is_active', label: 'Active / Visible', type: 'boolean' },
];

function ListingCard({ item, onExpand, onContact, user, onFavourite, favourites, onEdit, isAdmin, onAdminSaved, onReport }) {
  const formatPrice = (p) => p ? `₱${Number(p).toLocaleString()}` : '—';
  const isFav = favourites.includes(String(item.id));
  const isOwner = user && (item.created_by === user.email || item.email_contact === user.email);

  const card = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(37,99,235,0.18), 0 8px 30px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img src={item.image || item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80'; }} />
        <button onClick={() => onExpand(item)} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <ZoomIn className="w-4 h-4 text-[#0A192F]" />
        </button>
        {/* Fav + Edit overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.location === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
            📍 {item.area}
          </span>
          {item.status && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Ready For Occupancy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>}
          {item.condition && item.condition !== 'N/A' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#0A192F]">{item.condition}</span>}
        </div>
        {/* Quick heart on image */}
        <button onClick={() => onFavourite(item)}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-[#0A192F]/50 hover:bg-red-50 hover:text-red-500'}`}>
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>
        {/* Edit button for admin or item owner */}
        {(isAdmin || isOwner) && (
          <button onClick={() => onEdit(item)}
            className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-[#2563EB]/90 text-white flex items-center justify-center hover:bg-[#2563EB] transition-all">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-base text-[#0A192F] mb-1 leading-tight">{item.title}</h3>
        {item.type === 'cars' && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.year && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.year}</span>}
            {item.mileage && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.mileage}</span>}
            {item.transmission && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.transmission}</span>}
          </div>
        )}
        {item.type === 'houses' && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.propertyType && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.propertyType}</span>}
            {item.lot && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">Lot: {item.lot}</span>}
            {item.bedrooms && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.bedrooms}BR</span>}
          </div>
        )}
        {item.type === 'shoes' && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.brand && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.brand}</span>}
            {item.size && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">Size {item.size}</span>}
          </div>
        )}
        {item.type === 'electronics' && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.brand && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.brand}</span>}
            {item.warranty && <span className="text-[10px] bg-green-50 px-2 py-0.5 rounded-full text-green-700 border border-green-100">🛡️ {item.warranty}</span>}
          </div>
        )}
        {item.type === 'services' && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.provider && <span className="text-[10px] bg-[#F8FAFC] px-2 py-0.5 rounded-full text-[#0A192F]/60 border border-[#0A192F]/5">{item.provider}</span>}
          </div>
        )}
        <p className="font-body text-xs text-[#0A192F]/50 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-base text-[#0A192F]">
              {item.type === 'services' ? (item.rate || item.price_label) : (item.price_label || formatPrice(item.price))}
            </span>
            {item.original_price && item.original_price > item.price && (
              <>
                <span className="font-body text-xs text-gray-400 line-through">₱{Number(item.original_price).toLocaleString()}</span>
                <span className="px-1.5 py-0.5 rounded-full text-white font-heading font-bold text-[9px]"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                  -{Math.round(((item.original_price - item.price) / item.original_price) * 100)}%
                </span>
              </>
            )}
          </div>
          <div className="flex gap-1.5">
            {item.id && (
              <a href={`/listing/${item.id}`}
                className="px-2.5 py-1.5 bg-[#EFF6FF] border border-[#2563EB]/15 text-[#2563EB] rounded-lg font-body text-xs font-semibold hover:bg-[#DBEAFE] transition-colors">
                View
              </a>
            )}
            <button onClick={() => onContact(item)}
              className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-lg font-body text-xs font-semibold transition-colors">
              Contact
            </button>
            {user && item.id && (
              <button onClick={() => onReport(item)}
                className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 transition-colors" title="Report listing">
                <Flag className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {/* Heart / Comment / Share / Bookmark row — always visible */}
        <div className="border-t border-[#0A192F]/5 pt-2 -mx-4 px-4">
          <ListingCardActions
            item={item}
            user={user}
            isFav={isFav}
            onFavourite={onFavourite}
          />
        </div>
      </div>
    </motion.div>
  );

  if (isAdmin && item.id && !item._static) {
    return (
      <AdminEditOverlay entity="Listing" record={item} fields={LISTING_ADMIN_FIELDS}
        onSaved={onAdminSaved} onDeleted={onAdminSaved}>
        {card}
      </AdminEditOverlay>
    );
  }
  return card;
}

function ContactModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-28 overflow-hidden">
          <img src={item.image || item.image_url} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✕</button>
          <p className="absolute bottom-3 left-4 font-heading font-bold text-white text-sm">{item.title}</p>
        </div>
        <div className="p-5 space-y-3">
          {item.phone ? (
            <div className="flex gap-2">
              <a href={`tel:${item.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#2563EB] transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call Seller
              </a>
              <a href={`sms:${item.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> SMS
              </a>
            </div>
          ) : (
            <p className="text-center font-body text-xs text-[#0A192F]/50 py-2">Contact info not listed. Chat via portal below.</p>
          )}
          <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="font-body text-[10px] text-amber-700">Verify documents & item condition directly with seller before any payment.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImageModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        src={item.image || item.image_url} alt={item.title}
        className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
    </motion.div>
  );
}

function AdminEditModal({ item, onClose, onSave }) {
  const TYPES = ['shoes', 'cars', 'houses', 'electronics', 'services', 'product', 'clothing', 'furniture', 'food', 'other'];
  const [type, setType] = useState(item.type || 'product');
  const [subcategory, setSubcategory] = useState(item.subcategory || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Listing.update(item.id, { type, subcategory, admin_category_override: type });
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-white">Move to Category</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-white/40" /></button>
        </div>
        <p className="font-body text-xs text-white/50 mb-4 truncate">Listing: <strong className="text-white">{item.title}</strong></p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Category</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-body text-sm focus:outline-none">
              {TYPES.map(t => <option key={t} value={t} className="bg-[#0D1F3C] capitalize">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Subcategory (optional)</label>
            <input value={subcategory} onChange={e => setSubcategory(e.target.value)} placeholder="e.g. Smartphones, Laptops..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function BuySell() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest Listings');
  const [search, setSearch] = useState('');
  const [contactItem, setContactItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [dbListings, setDbListings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [reportItem, setReportItem] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const init = async () => {
      try {
        // Always load listings
        const items = await base44.entities.Listing.list('-created_date', 100);
        setDbListings(items.filter(l => l.is_active));
        // Auth check for favourites
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          setUser(me);
          const favs = await base44.entities.Favourite.filter({ user_email: me.email });
          setFavourites(favs.map(f => f.item_ref || f.listing_id));
        }
      } catch (e) {}
    };
    init();
  }, []);

  const handleFavourite = async (item) => {
    if (!user) { setShowSignup(true); return; }
    const key = String(item.id);
    const existing = await base44.entities.Favourite.filter({ user_email: user.email, item_ref: key });
    if (existing.length > 0) {
      await base44.entities.Favourite.delete(existing[0].id);
      setFavourites(f => f.filter(k => k !== key));
      showToast('Removed from favourites');
    } else {
      await base44.entities.Favourite.create({
        user_email: user.email, item_ref: key,
        title: item.title, image_url: item.image || item.image_url,
        price_label: item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : item.rate || ''),
        category: 'buysell', area: item.area || ''
      });
      setFavourites(f => [...f, key]);
      showToast('Added to favourites ❤️');
    }
  };

  const handleAdminEditSave = async () => {
    setEditItem(null);
    const items = await base44.entities.Listing.list('-created_date', 100);
    setDbListings(items.filter(l => l.is_active));
    showToast('Listing moved to new category!');
  };

  // Only real DB listings
  const allListings = dbListings.map(l => ({ ...l, image: l.image_url }));

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator' || user?.email === 'Kevinarnold522@gmail.com';
  const isSeller = user?.is_seller || user?.account_type === 'business_owner';

  const filtered = allListings
    .filter(l => {
      const matchCat = !activeCategory || activeCategory === 'all' || l.type === activeCategory;
      const matchLoc = locationFilter === 'All' || l.location === locationFilter;
      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || (l.area && l.area.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchLoc && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'Price: High to Low') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const BUY_SUBCATEGORIES = [{ key: 'all', label: 'All Listings', icon: '🛒', desc: 'Browse everything' }, ...SUBCATEGORIES];

  return (
    <div className="min-h-screen bg-[#001060]">
      <StarField />
      <SubcategorySplash
        subcategories={BUY_SUBCATEGORIES}
        activeKey={activeCategory}
        onSelect={setActiveCategory}
        title="What are you looking for?"
        subtitle="Select a category to browse listings"
        category="buysell"
      />
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Buy & Sell</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">Buy & Sell Marketplace</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Shoes, cars, houses, electronics, and services — listed by real people in Manila and Cavite.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 flex flex-wrap gap-3">
            {!user ? (
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <span className="font-body text-sm text-white/70">Want to post a listing?</span>
                <button onClick={() => setShowSignup(true)} className="px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
                  Join Free →
                </button>
              </div>
            ) : isSeller ? (
              <button onClick={() => setShowAddListing(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
                <Store className="w-4 h-4" /> Add New Listing
              </button>
            ) : (
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-[#00D4FF]/30 rounded-xl">
                <span className="font-body text-sm text-white/70">Want to start selling?</span>
                <Link to="/seller" className="px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
                  Start Selling →
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Category Filter Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <button onClick={() => setActiveCategory('all')}
            className={`p-3 rounded-2xl text-left transition-all border ${activeCategory === 'all' ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-[#0A192F]/5 hover:border-[#0A192F]/20'}`}>
            <div className="text-xl mb-1">🛒</div>
            <p className={`font-heading font-bold text-xs ${activeCategory === 'all' ? 'text-white' : 'text-[#0A192F]'}`}>All</p>
          </button>
          {SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveCategory(sc.key)}
              className={`p-3 rounded-2xl text-left transition-all border ${activeCategory === sc.key ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-[#0A192F]/5 hover:border-[#0A192F]/20'}`}>
              <div className="text-xl mb-1">{sc.icon}</div>
              <p className={`font-heading font-bold text-xs ${activeCategory === sc.key ? 'text-white' : 'text-[#0A192F]'}`}>{sc.label}</p>
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]/30" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Metro Manila', 'Cavite', 'Cebu', 'Davao', 'Laguna', 'Batangas', 'Bulacan', 'Iloilo', 'Nationwide'].map(loc => (
              <button key={loc} onClick={() => setLocationFilter(loc)}
                className={`px-3 py-2 rounded-xl font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
                {loc}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F]/60 hover:border-[#0A192F]/20">
              {sortBy} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-[#0A192F]/10 rounded-xl shadow-lg z-10 overflow-hidden min-w-[200px]">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 font-body text-sm hover:bg-[#F8FAFC] transition-colors ${sortBy === opt ? 'text-[#2563EB] font-semibold' : 'text-[#0A192F]/70'}`}>
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <ListingCard key={item.id} item={item} onExpand={setExpandedItem} onContact={setContactItem}
                user={user} onFavourite={handleFavourite} favourites={favourites}
                onEdit={setEditItem} isAdmin={isAdmin} onReport={setReportItem}
                onAdminSaved={async () => {
                  const items = await base44.entities.Listing.list('-created_date', 100);
                  setDbListings(items.filter(l => l.is_active));
                  showToast('Listing updated!');
                }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-body text-white/30">No listings found.</p>
          </div>
        )}

        <div className="mt-10 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-amber-700">Verify all documents and item conditions directly with the seller before any payment. 1Market.ph is a listing directory and is not responsible for individual transactions.</p>
        </div>

        {!isSeller && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 bg-[#0A192F] rounded-2xl p-8 text-center">
            <h2 className="font-heading font-bold text-2xl text-white mb-2">Do You Want to Start Selling?</h2>
            <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">Become a free seller and post your listings for shoes, cars, homes, electronics, or services — reach buyers across Manila and Cavite.</p>
            <Link to="/seller" className="inline-block px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
              Start Selling for Free →
            </Link>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {contactItem && <ContactModal item={contactItem} onClose={() => setContactItem(null)} />}
        {expandedItem && <ImageModal item={expandedItem} onClose={() => setExpandedItem(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
        {editItem && isAdmin && <AdminEditModal item={editItem} onClose={() => setEditItem(null)} onSave={handleAdminEditSave} />}
        {reportItem && user && <ReportModal listing={reportItem} user={user} onClose={() => { setReportItem(null); }} />}
        {showAddListing && (
          <AddListingModal
            user={user}
            defaultType="product"
            onClose={async () => {
              setShowAddListing(false);
              const items = await base44.entities.Listing.list('-created_date', 100);
              setDbListings(items.filter(l => l.is_active));
            }}
          />
        )}
      </AnimatePresence>

      <AdminQuickAddFAB defaultMode="listing" onAdded={async () => {
        const items = await base44.entities.Listing.list('-created_date', 100);
        setDbListings(items.filter(l => l.is_active));
      }} />
      <MascotDog page="buysell" />
      <ScrollToTop />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-body text-sm shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}