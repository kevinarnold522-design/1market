import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, MapPin, Star, Heart, MessageSquare, Truck, SlidersHorizontal, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FilterSidebar from '@/components/FilterSidebar';
import { useAuth } from '@/lib/AuthContext';
import AddListingModal from '@/components/AddListingModal';
import BecomeSellerBanner from '@/components/BecomeSelllerBanner';
import SmartFilterChips from '@/components/SmartFilterChips';
import ListingContactLinks from '@/components/ListingContactLinks';
import ListingLandingBrandBar from '@/components/listing/ListingLandingBrandBar';

const CONDITIONS = ['Brand New', 'Like New', 'Good as New', 'Lightly Used', 'Used', 'Heavily Used'];
const DELIVERY_OPTS = ['LBC', 'J&T Express', 'Shopee Express', 'Lalamove', 'GrabExpress', 'Flash Express', 'Meetup at Location', 'Pickup at My Address', 'Cash on Delivery (COD)'];
const SORT_OPTIONS = ['Newest First', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];
const LOCATIONS = ['All', 'Manila', 'Quezon City', 'Makati', 'Cavite', 'Laguna', 'Cebu', 'Davao', 'Nationwide'];

const CATEGORIES = [
  { key: 'all', label: 'All Items', color: '#00D4FF' },
  { key: 'electronics', label: 'Electronics', color: '#3b82f6' },
  { key: 'clothing', label: 'Clothing', color: '#ec4899' },
  { key: 'shoes', label: 'Shoes', color: '#f97316' },
  { key: 'furniture', label: 'Furniture', color: '#10b981' },
  { key: 'homeappliances', label: 'Appliances', color: '#8b5cf6' },
  { key: 'cars', label: 'Cars', color: '#ef4444' },
  { key: 'houses', label: 'Real Estate', color: '#14b8a6' },
  { key: 'product', label: 'General', color: '#f59e0b' },
  { key: 'mods', label: 'Mods', color: '#a78bfa' },
  { key: 'other', label: 'Other', color: '#6b7280' },
];

function ListingCard({ listing, idx }) {
  const [hearted, setHearted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Link to={`/listing/${listing.id}`} className="relative block overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0D1F3C] to-[#1a3060] flex items-center justify-center">
            <Tag className="w-10 h-10 text-white/10" />
          </div>
        )}
        {listing.condition && listing.condition !== 'N/A' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-body font-bold text-[10px]"
            style={{ background: listing.condition === 'Brand New' ? 'rgba(16,185,129,0.9)' : 'rgba(0,0,0,0.7)', color: 'white' }}>
            {listing.condition}
          </span>
        )}
        {listing.flash_deal_active && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500/90 font-body font-bold text-[10px] text-white">
          Flash Deal
        </span>
        )}
        <button onClick={e => { e.preventDefault(); setHearted(h => !h); setShowHeartBurst(true); setTimeout(() => setShowHeartBurst(false), 900); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: hearted ? 'rgba(0,212,255,0.9)' : 'rgba(0,0,0,0.6)' }}>
          <Heart className="w-3.5 h-3.5 text-white" fill={hearted ? 'white' : 'none'} />
        </button>
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.35 }} transition={{ duration: 0.7 }}>
              <Heart className="absolute w-28 h-28 text-[#00D4FF] drop-shadow-[0_0_24px_rgba(0,212,255,0.9)]" fill="rgba(0,212,255,0.22)" strokeWidth={1.6} />
              <Heart className="absolute w-20 h-20 text-[#3E97F1] translate-x-5 -translate-y-3 drop-shadow-[0_0_18px_rgba(62,151,241,0.85)]" fill="rgba(62,151,241,0.24)" strokeWidth={1.8} />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {/* Category + Subcategory */}
        <div className="flex flex-wrap items-center gap-1 mb-0.5">
          {listing.type && (
            <span className="px-1.5 py-0.5 rounded-md font-body text-[9px] font-bold"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.25)' }}>
              {listing.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          )}
          {listing.subcategory && (
            <span className="px-1.5 py-0.5 rounded-md font-body text-[9px] text-white/45"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {listing.subcategory}
            </span>
          )}
        </div>
        <Link to={`/listing/${listing.id}`}>
          <h3 className="font-body font-semibold text-sm text-white leading-tight line-clamp-2 hover:text-[#00D4FF] transition-colors">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-white/40">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="font-body text-[10px] truncate">{listing.location || listing.area || 'Philippines'}</span>
        </div>

        {listing.delivery_options && listing.delivery_options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {listing.delivery_options.slice(0, 2).map(opt => (
              <span key={opt} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-body text-[9px] font-bold"
                style={{ background: 'rgba(139,92,246,0.18)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)' }}>
                <Truck className="w-2.5 h-2.5" /> {opt.length > 12 ? opt.slice(0, 12) + '…' : opt}
              </span>
            ))}
            {listing.delivery_options.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-full font-body text-[9px] text-white/30">+{listing.delivery_options.length - 2}</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              {listing.original_price && listing.original_price > listing.price && (
                <p className="font-body text-[10px] text-white/30 line-through">₱{listing.original_price.toLocaleString()}</p>
              )}
              <p className="font-heading font-bold text-base text-[#00D4FF]">
                {listing.price_label || (listing.price ? `₱${Number(listing.price).toLocaleString()}` : 'Price on request')}
              </p>
            </div>
            <Link to={`/listing/${listing.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body font-bold text-[11px] transition-all hover:scale-105"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)' }}>
              <MessageSquare className="w-3 h-3" /> Details
            </Link>
          </div>
          <ListingContactLinks listing={listing} compact />
        </div>
      </div>
    </motion.div>
  );
}

export default function BuySell() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlType = params.get('type');
  const urlSub = params.get('sub');
  const shouldPost = params.get('post') === '1';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSub || '');
  const [activeCategory, setActiveCategory] = useState(urlType || 'all');
  const [activeLocation, setActiveLocation] = useState('All');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activeConditions, setActiveConditions] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState([]);
  const [sortBy, setSortBy] = useState('Newest First');
  const [showAddModal, setShowAddModal] = useState(shouldPost && !!user);
  const [defaultType, setDefaultType] = useState(urlType || 'product');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(params.get('page')) || 1);
  const ITEMS_PER_PAGE = 10;

  const isSeller = user?.user_type === 'seller' || user?.user_type === 'business' || user?.is_seller || user?.account_type === 'business_owner' || user?.role === 'admin' || user?.email?.toLowerCase() === 'kevinarnold522@gmail.com';

  useEffect(() => {
    base44.entities.Listing.filter({ approval_status: 'approved', is_active: true })
      .then(data => {
        const buysell = data.filter(l => l.main_category === 'buysell' ||
          ['product', 'electronics', 'shoes', 'clothing', 'furniture', 'homeappliances', 'cars', 'houses', 'mods', 'other'].includes(l.type));
        setListings(buysell);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterCount = [
    activeCategory !== 'all' ? 1 : 0,
    activeLocation !== 'All' ? 1 : 0,
    priceMin ? 1 : 0,
    priceMax ? 1 : 0,
    activeConditions.length,
    activeDelivery.length,
    sortBy !== 'Newest First' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleReset = () => {
    setActiveCategory('all'); setActiveLocation('All');
    setPriceMin(''); setPriceMax('');
    setActiveConditions([]); setActiveDelivery([]);
    setSortBy('Newest First');
  };

  const filtered = listings
    .filter(l => {
      if (search && !l.title?.toLowerCase().includes(search.toLowerCase()) &&
        !l.description?.toLowerCase().includes(search.toLowerCase()) &&
        !l.subcategory?.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategory !== 'all' && l.type !== activeCategory) return false;
      if (activeLocation !== 'All' && !l.location?.includes(activeLocation)) return false;
      if (priceMin && l.price < Number(priceMin)) return false;
      if (priceMax && l.price > Number(priceMax)) return false;
      if (activeConditions.length && !activeConditions.includes(l.condition)) return false;
      if (activeDelivery.length && !activeDelivery.some(d => (l.delivery_options || []).includes(d))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'Price: High to Low') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'Most Popular') return (b.rating_count || 0) - (a.rating_count || 0);
      return new Date(b.created_date) - new Date(a.created_date);
    });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const goToPage = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      <ListingLandingBrandBar />
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/8 px-4 py-3"
        style={{ background: 'rgba(0,13,64,0.9)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Buy & Sell listings..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/6 border border-white/10 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50"
            />
          </div>
          <button onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white/60 relative"
            style={{ border: filterCount > 0 ? '1px solid rgba(0,212,255,0.4)' : undefined }}>
            <SlidersHorizontal className="w-4 h-4" />
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#00D4FF] text-[#0A192F] font-bold text-[9px] flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0 sticky top-20 self-start">
          <FilterSidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            locations={LOCATIONS}
            activeLocation={activeLocation}
            onLocationChange={setActiveLocation}
            priceMin={priceMin} priceMax={priceMax}
            onPriceMinChange={setPriceMin} onPriceMaxChange={setPriceMax}
            conditions={CONDITIONS}
            activeConditions={activeConditions}
            onConditionToggle={c => setActiveConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
            deliveryOptions={DELIVERY_OPTS}
            activeDelivery={activeDelivery}
            onDeliveryToggle={d => setActiveDelivery(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleReset}
            filterCount={filterCount}
          />
        </div>

        {/* Listings Grid */}
        <div className="flex-1 min-w-0">
          <SmartFilterChips options={[
            { label: 'Best deals', onClick: () => setSortBy('Price: Low to High') },
            { label: 'Popular picks', onClick: () => setSortBy('Most Popular') },
            { label: 'Nationwide', onClick: () => setActiveLocation('Nationwide') },
            { label: 'Clear filters', onClick: handleReset },
          ]} />
          <div className="flex items-center justify-between mb-4">
            <div>
              {urlSub && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full font-body text-xs font-bold"
                    style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00D4FF' }}>
                    {urlType?.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} › {urlSub}
                  </span>
                  <button onClick={() => { setSearch(''); window.history.replaceState({}, '', '/buysell'); }}
                    className="text-white/30 hover:text-white/60 text-xs font-body">Clear</button>
                </div>
              )}
              <p className="font-body text-sm text-white/40">
                {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>

            {!isAuthenticated && (
            <div className="mb-4">
              <BecomeSellerBanner />
            </div>
          )}

        {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: 'rgba(13,31,60,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                    <div className="h-4 bg-white/5 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="font-heading font-bold text-white/30 text-lg">No listings found</p>
              <p className="font-body text-sm text-white/20 mt-1">Try adjusting your filters</p>
              {filterCount > 0 && (
                <button onClick={handleReset} className="mt-4 px-4 py-2 rounded-xl bg-[#00D4FF]/15 text-[#00D4FF] font-body font-bold text-sm border border-[#00D4FF]/30">
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
           <>
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {paginatedItems.map((listing, idx) => (
                 <ListingCard key={listing.id} listing={listing} idx={idx} />
               ))}
             </div>
             {/* Pagination */}
             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-1.5 mt-6">
                 <button onClick={() => goToPage(safePage - 1)} disabled={safePage <= 1}
                   className="px-3 py-1.5 rounded-lg font-body text-xs font-bold bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-25 transition-all">
                   ‹ Prev
                 </button>
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                   <button key={p} onClick={() => goToPage(p)}
                     className={`w-8 h-8 rounded-lg font-body text-xs font-bold transition-all ${p === safePage ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                     {p}
                   </button>
                 ))}
                 <button onClick={() => goToPage(safePage + 1)} disabled={safePage >= totalPages}
                   className="px-3 py-1.5 rounded-lg font-body text-xs font-bold bg-white/5 border border-white/10 text-white/50 hover:text-white disabled:opacity-25 transition-all">
                   Next ›
                 </button>
               </div>
             )}
           </>
          )}
        </div>
      </div>

      <ListingLandingBrandBar />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowMobileFilters(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full rounded-t-3xl overflow-hidden max-h-[85vh]"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <span className="font-heading font-bold text-white">Filters</span>
                <button onClick={() => setShowMobileFilters(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
                <FilterSidebar
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  onCategoryChange={c => { setActiveCategory(c); setShowMobileFilters(false); }}
                  locations={LOCATIONS}
                  activeLocation={activeLocation}
                  onLocationChange={l => { setActiveLocation(l); }}
                  priceMin={priceMin} priceMax={priceMax}
                  onPriceMinChange={setPriceMin} onPriceMaxChange={setPriceMax}
                  conditions={CONDITIONS}
                  activeConditions={activeConditions}
                  onConditionToggle={c => setActiveConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                  deliveryOptions={DELIVERY_OPTS}
                  activeDelivery={activeDelivery}
                  onDeliveryToggle={d => setActiveDelivery(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                  sortOptions={SORT_OPTIONS}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onReset={handleReset}
                  filterCount={filterCount}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {showAddModal && user && (
          <AddListingModal
            onClose={() => setShowAddModal(false)}
            defaultType={defaultType}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
}