import React, { useState, useEffect, useRef } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ExternalLink, Phone, MessageSquare, AlertCircle, Plus, Home, Building2, Car, Wrench, CalendarDays, Grid3X3, Pencil, Trash2, X, Laptop, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';
import AddListingModal from '../components/AddListingModal.jsx';
import { base44 } from '@/api/base44Client';
import AdminQuickAddFAB from '../components/admin/AdminQuickAddFAB';
import MascotDog from '../components/MascotDog';
import PostListingMenu from '../components/PostListingMenu';
import BecomeSellerBanner from '../components/BecomeSelllerBanner';

// Multi-icon renderer for the section header
function MultiIcon({ color }) {
  return (
    <div className="flex items-center gap-0.5">
      <Home className="w-4 h-4" style={{ color }} />
      <Car className="w-3.5 h-3.5" style={{ color }} />
      <Laptop className="w-3 h-3" style={{ color }} />
    </div>
  );
}

const SUBCATEGORIES = [
  { key: 'all', label: 'All Rentals', Icon: Grid3X3, color: '#3E97F1', desc: 'Browse everything' },
  { key: 'residential', label: 'Properties', Icon: Home, color: '#10b981', desc: 'Houses, condos, lots' },
  { key: 'commercial', label: 'Commercial', Icon: Building2, color: '#3E97F1', desc: 'Offices, retail, warehouses' },
  { key: 'vehicles', label: 'Vehicles', Icon: Car, color: '#f59e0b', desc: 'Cars, vans, motorcycles', ExtraIcon: Bike },
  { key: 'equipment', label: 'Gadgets & Equipment', Icon: Laptop, color: '#8b5cf6', desc: 'Gadgets, tools, cameras' },
  { key: 'events', label: 'Event Venues', Icon: CalendarDays, color: '#ec4899', desc: 'Halls, function rooms' },
];

const SPACE_TYPES = ['All Types', 'Room', 'House', 'Bungalow', 'Dorm', 'Condo', '2 Stories', '3 Stories', 'Land', 'Lot for Lease', 'Commercial Lot'];

// No static/fake listings — only real DB listings shown

function AdminListingEditModal({ item, isAdmin, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(item.title || '');
  const [priceLabel, setPriceLabel] = useState(item.price_label || '');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Listing.update(item.id, { title, price_label: priceLabel });
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070F1A]/85 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-white text-sm">Edit Listing</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-white/40" /></button>
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Price Label</label>
          <input value={priceLabel} onChange={e => setPriceLabel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-sm hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {isAdmin && (
          confirming ? (
            <div className="flex gap-2">
              <button onClick={onDelete} className="flex-1 py-2 bg-red-500 text-white rounded-xl font-body font-bold text-xs">Confirm Delete</button>
              <button onClick={() => setConfirming(false)} className="flex-1 py-2 bg-white/10 text-white/60 rounded-xl font-body text-xs">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/30 text-red-400 rounded-xl font-body text-xs font-bold hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete Listing
            </button>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

function RentalCard({ item, onContact, user, isAdmin, onEdit }) {
  const isOwner = user && (item.created_by_id === user.id || item.email_contact === user.email);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
      style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.25), 0 8px 30px rgba(0,0,0,0.5)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.location === 'Manila' ? 'bg-blue-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>{item.area}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-sm">{item.sub}</span>
        </div>
        {item.link && (
          <button onClick={() => window.open(item.link, '_blank')} className="absolute top-3 right-3 w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>
      <div className="p-4">
      <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1">{item.title}</h3>
      <p className="font-body text-xs text-white/40 mb-3 line-clamp-2">{item.desc || item.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-heading font-bold text-base text-[#00D4FF]">{item.price || item.price_label}</span>
        <div className="flex items-center gap-1.5">
          {(isAdmin || isOwner) && item.id && (
            <button onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#00D4FF] hover:bg-[#2563EB]/40 transition-colors">
              <Pencil className="w-3 h-3" />
            </button>
          )}
          <button onClick={() => onContact(item)}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-lg font-body text-xs font-semibold transition-colors">
            Inquire
          </button>
        </div>
      </div>
      </div>
      </motion.div>
      );
      }

function ContactModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070F1A]/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="relative h-24 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/90 to-transparent" />
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white text-xs hover:bg-white/25">✕</button>
          <p className="absolute bottom-2 left-4 font-heading font-bold text-white text-sm">{item.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <a href={`tel:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a href={`sms:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 border border-white/15 text-white rounded-xl font-body text-xs font-semibold hover:bg-white/20 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> SMS
            </a>
          </div>
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="font-body text-[10px] text-amber-300">Verify all agreements and documents directly with the owner before any payment.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ForRent() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlType = urlParams.get('type');
  const urlSub = urlParams.get('sub');

  const [activeCategory, setActiveCategory] = useState(urlType || null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [spaceType, setSpaceType] = useState('All Types');
  const [search, setSearch] = useState(urlSub || '');
  const [contactItem, setContactItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [addDefaultSub, setAddDefaultSub] = useState(urlSub || '');
  const [editItem, setEditItem] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [dbListings, setDbListings] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsAdmin(u?.role === 'admin' || u?.role === 'moderator' || u?.email?.toLowerCase() === 'kevinarnold522@gmail.com');
      setIsSeller(u?.is_seller || u?.user_type === 'seller' || u?.user_type === 'business' || u?.account_type === 'business_owner');
    }).catch(() => {});
    Promise.all([
      base44.entities.Listing.filter({ type: 'rent_lease', is_active: true }, '-created_date', 50),
      base44.entities.Listing.filter({ type: 'vehicle_rental', is_active: true }, '-created_date', 30),
    ]).then(([rentals, vehicles]) => setDbListings([...rentals, ...vehicles])).catch(() => {});
  }, []);

  const allRentals = dbListings.map(l => ({
    ...l,
    sub: l.subcategory || '',
    price: l.price_label || (l.price ? `₱${Number(l.price).toLocaleString()}` : ''),
    type: l.type === 'vehicle_rental' ? 'vehicles' : 'residential',
    image: l.image_url || '',
    desc: l.description || '',
    contact: l.phone || l.email_contact || '',
  }));

  const filtered = allRentals.filter(l => {
    const matchCat = !activeCategory || activeCategory === 'all' || l.type === activeCategory;
    const matchLoc = locationFilter === 'All' || l.location === locationFilter;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || (l.area||'').toLowerCase().includes(search.toLowerCase()) || (l.sub||'').toLowerCase().includes(search.toLowerCase());
    const matchSpace = spaceType === 'All Types' || (l.sub||'').toLowerCase().includes(spaceType.toLowerCase()) || l.title.toLowerCase().includes(spaceType.toLowerCase());
    return matchCat && matchLoc && matchSearch && matchSpace;
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      <ParticleBackground />
      <SubcategorySplash
        subcategories={SUBCATEGORIES}
        activeKey={activeCategory}
        onSelect={setActiveCategory}
        title="What are you looking to rent?"
        subtitle="Choose a category to browse listings"
        onBack={() => window.history.back()}
      />
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm hover:text-[#00D4FF]">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Rentals</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">For Rent / For Sale / Lease</h1>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-emerald-400" />
              <Car className="w-5 h-5 text-amber-400" />
              <Bike className="w-4 h-4 text-amber-300" />
              <Laptop className="w-5 h-5 text-purple-400" />
              <span className="font-body text-sm text-white/50">Properties · Vehicles · Gadgets & Equipment</span>
            </div>
            <p className="font-body text-base text-white/50 max-w-xl">Houses, lots, vehicles, gadgets & equipment — find the perfect rental, sale, or lease across the Philippines.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search condos, cars, event venues..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {SUBCATEGORIES.map(sc => {
            const Icon = sc.Icon;
            const isActive = activeCategory === sc.key;
            return (
              <button key={sc.key} onClick={() => setActiveCategory(sc.key)}
                className="p-3 rounded-2xl text-left transition-all border"
                style={isActive
                  ? { background: `${sc.color}22`, borderColor: sc.color, boxShadow: `0 0 10px ${sc.color}33` }
                  : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-0.5 mb-1.5">
                  <Icon className="w-5 h-5" style={{ color: isActive ? sc.color : 'rgba(255,255,255,0.4)' }} />
                  {sc.ExtraIcon && <sc.ExtraIcon className="w-3.5 h-3.5" style={{ color: isActive ? sc.color : 'rgba(255,255,255,0.3)' }} />}
                </div>
                <p className="font-heading font-bold text-xs text-white">{sc.label}</p>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {['All', 'Metro Manila', 'Cavite', 'Cebu', 'Davao', 'Laguna', 'Batangas', 'Bulacan', 'Pampanga', 'Rizal', 'Iloilo', 'Cagayan de Oro', 'Palawan', 'Boracay', 'Baguio City', 'Nationwide'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className={`px-3 py-1.5 rounded-xl font-body font-semibold text-xs transition-all ${locationFilter === loc ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/5 border border-white/15 text-white/60 hover:border-white/30'}`}>
              {loc}
            </button>
          ))}
        </div>

        {/* Space type filter */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          <span className="font-body text-xs text-white/30 uppercase tracking-wider">Space Type:</span>
          {SPACE_TYPES.map(t => (
            <button key={t} onClick={() => setSpaceType(t)}
              className={`px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all ${spaceType === t ? 'bg-purple-500/80 text-white border-purple-500' : 'bg-white/5 border border-white/10 text-white/50 hover:border-white/25'}`}>
              {t}
            </button>
          ))}
        </div>

        {(isAdmin || isSeller) && (
          <div className="mb-6">
            <PostListingMenu user={user} compact={false} />
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => <RentalCard key={item.id} item={item} onContact={setContactItem} user={user} isAdmin={isAdmin} onEdit={setEditItem} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <Home className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-body text-white/30 text-lg mb-1">
              {dbListings.length === 0 ? 'No rental listings yet.' : 'No rentals found.'}
            </p>
            <p className="font-body text-white/20 text-sm">
              {dbListings.length === 0 ? 'Be the first to post a property, vehicle, or equipment for rent.' : 'Try adjusting your filters or search term.'}
            </p>
          </div>
        )}

        {!user && <BecomeSellerBanner className="mt-8 mb-4" />}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Have a Property or Item to Rent Out?</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">List your property, vehicle, or equipment for free and reach renters across Manila and Cavite.</p>
          {user ? (
            <div className="flex justify-center"><PostListingMenu user={user} compact={false} /></div>
          ) : (
            <button onClick={() => setShowSignup(true)} className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
              Sign Up Free & Post a Rental
            </button>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {contactItem && <ContactModal item={contactItem} onClose={() => setContactItem(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
        {showAddListing && <AddListingModal onClose={async () => { setShowAddListing(false); const [r, v] = await Promise.all([base44.entities.Listing.filter({ type: 'rent_lease', is_active: true }, '-created_date', 50), base44.entities.Listing.filter({ type: 'vehicle_rental', is_active: true }, '-created_date', 30)]); setDbListings([...r, ...v]); }} defaultType="rent_lease" defaultSubcategory={addDefaultSub} user={user} />}
        {editItem && editItem.id && (
          <AdminListingEditModal item={editItem} isAdmin={isAdmin} onClose={() => setEditItem(null)}
            onSave={async () => { setEditItem(null); showToast('Updated!'); const items = await base44.entities.Listing.filter({ type: 'rent_lease', is_active: true }, '-created_date', 50); setDbListings(items); }}
            onDelete={async () => { await base44.entities.Listing.delete(editItem.id); setEditItem(null); showToast('Deleted.'); setDbListings(prev => prev.filter(l => l.id !== editItem.id)); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-body text-xs shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AdminQuickAddFAB defaultMode="listing" forceSubcategory="residential" />
      <MascotDog page="rent" />
    </div>
  );
}