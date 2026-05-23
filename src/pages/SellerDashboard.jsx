import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, ArrowLeft, Package, MapPin, Store, Search,
  ExternalLink, ChevronDown, LogOut, Upload, Heart, BadgeCheck,
  FileText, Eye, Settings, CheckCircle, Truck, User, Globe
} from 'lucide-react';
import OrdersTab from '../components/seller/OrdersTab';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const LISTING_TYPES = ['product', 'shoes', 'cars', 'houses', 'electronics', 'clothing', 'furniture', 'food', 'services', 'other'];
const SUBCATEGORIES_MAP = {
  electronics: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories'],
  shoes: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids'],
  clothing: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal', 'Activewear', 'Kids'],
  cars: ['Sedan', 'SUV', 'Van', 'Pickup', 'Motorcycle', 'Truck'],
  houses: ['House & Lot', 'Condominium', 'Townhouse', 'Vacant Lot', 'Commercial'],
  services: ['Home Services', 'Tech & Digital', 'Beauty & Wellness', 'Events', 'Transport', 'Professional'],
  furniture: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen'],
  food: ['Baked Goods', 'Meals', 'Beverages', 'Snacks', 'Ingredients'],
  product: ['General', 'Health & Beauty', 'Sports', 'Toys', 'Books', 'Tools'],
  other: ['Miscellaneous'],
};
const LOCATIONS = ['Manila', 'Cavite', 'Cebu', 'Davao', 'Nationwide'];
const CONDITIONS = ['Brand New', 'Like New', 'Used', 'N/A'];

const EMPTY_FORM = {
  title: '', type: 'product', subcategory: '', location: 'Manila', area: '',
  seller_name: '', phone: '', description: '', image_url: '',
  extra_images: [], price: '', price_label: '', condition: 'Brand New',
  brand: '', model: '', size: '', warranty: '', specs: '', is_active: true,
};

const NAV_TABS = [
  { key: 'listings',   label: 'My Listings',      icon: Package },
  { key: 'drafts',     label: 'Drafts',            icon: FileText },
  { key: 'orders',     label: 'Orders',            icon: Truck },
  { key: 'favourites', label: 'Favourites',        icon: Heart },
  { key: 'sellerpage', label: 'Seller Page',       icon: Globe },
  { key: 'settings',   label: 'Settings',          icon: Settings },
];

function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-20 focus:outline-none focus:border-[#00D4FF] bg-white/5 text-white placeholder-white/20" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF] bg-white/5 placeholder-white/20" />
      )}
    </div>
  );
}

function ImageUploader({ images, onAdd, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onAdd(file_url);
    setUploading(false);
    e.target.value = '';
  };
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">Product Photos</label>
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
            <button onClick={() => onRemove(i)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
        <label className={`w-14 h-14 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-[#00D4FF]/40 transition-colors ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <><Upload className="w-3.5 h-3.5 text-white/25" /><span className="font-body text-[8px] text-white/25 mt-0.5">Add</span></>}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

function ListingForm({ form, setF, onSave, onSaveDraft, onCancel, editing, isElectronics, subcatOptions }) {
  const [showPriceSearch, setShowPriceSearch] = useState(false);
  const [priceResults, setPriceResults] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  const runPriceSearch = async () => {
    if (!form.title) return;
    setPriceLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Find current Philippine prices for: "${form.title}"${form.brand ? ` by ${form.brand}` : ''}. Check Lazada PH, Shopee PH. Return structured data.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object', properties: {
          suggested_price_php: { type: 'string' },
          market_insight: { type: 'string' },
          platforms: { type: 'array', items: { type: 'object', properties: { platform: { type: 'string' }, price_php: { type: 'string' } } } },
        },
      },
    });
    setPriceResults(res);
    setPriceLoading(false);
  };

  const handleAddImage = (url) => {
    const imgs = [...(form.extra_images || []), url];
    setF('extra_images', imgs);
    if (!form.image_url) setF('image_url', url);
  };
  const handleRemoveImage = (idx) => {
    const imgs = (form.extra_images || []).filter((_, i) => i !== idx);
    setF('extra_images', imgs);
    if (form.image_url === (form.extra_images || [])[idx]) setF('image_url', imgs[0] || '');
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="mb-5 rounded-2xl border border-white/10 p-4 space-y-3" style={{ background: 'rgba(13,31,60,0.9)' }}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-white text-sm">{editing ? 'Edit Listing' : 'Add New Listing'}</h3>
        <button onClick={onCancel}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
      </div>

      <ImageUploader images={form.extra_images || (form.image_url ? [form.image_url] : [])} onAdd={handleAddImage} onRemove={handleRemoveImage} />
      <Field label="Or Paste Image URL" value={form.image_url} onChange={v => setF('image_url', v)} placeholder="https://..." />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1"><Field label="Title" value={form.title} onChange={v => setF('title', v)} placeholder="e.g. Samsung S24" required /></div>

        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Category <span className="text-red-400">*</span></label>
          <select value={form.type} onChange={e => { setF('type', e.target.value); setF('subcategory', ''); }}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {LISTING_TYPES.map(t => <option key={t} value={t} className="bg-[#0D1F3C] capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Subcategory</label>
          <select value={form.subcategory} onChange={e => setF('subcategory', e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            <option value="" className="bg-[#0D1F3C]">— Select —</option>
            {subcatOptions.map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Location</label>
          <select value={form.location} onChange={e => setF('location', e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Condition</label>
          <select value={form.condition} onChange={e => setF('condition', e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
            {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
          </select>
        </div>

        <Field label="Area" value={form.area} onChange={v => setF('area', v)} placeholder="e.g. BGC, Bacoor" />
        <Field label="Price (₱)" value={form.price} onChange={v => setF('price', v)} type="number" placeholder="0" />
        <Field label="Price Display" value={form.price_label} onChange={v => setF('price_label', v)} placeholder="₱3,500 neg" />
        <Field label="Brand" value={form.brand} onChange={v => setF('brand', v)} placeholder="e.g. Samsung" />
        <Field label="Model / Size" value={form.model || form.size} onChange={v => { setF('model', v); setF('size', v); }} placeholder="256GB / US10" />
        <Field label="Contact #" value={form.phone} onChange={v => setF('phone', v)} placeholder="+63 9xx" />
      </div>

      {isElectronics && (
        <div className="rounded-xl p-3 space-y-2.5" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="font-body text-[10px] text-[#00D4FF] font-semibold">📱 Electronics — Warranty & Specs Required</p>
          <Field label="Warranty" value={form.warranty} onChange={v => setF('warranty', v)} placeholder="1 Year Samsung PH Warranty" required />
          <Field label="Full Specifications" value={form.specs} onChange={v => setF('specs', v)} type="textarea" placeholder="6.7&quot; AMOLED, Snapdragon 8 Gen 3..." required />
        </div>
      )}

      <Field label="Description" value={form.description} onChange={v => setF('description', v)} type="textarea" placeholder="Describe your item..." />

      <div className="flex items-center gap-2">
        <input type="checkbox" id="item-active" checked={form.is_active} onChange={e => setF('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
        <label htmlFor="item-active" className="font-body text-xs text-white/50">Publish publicly</label>
      </div>

      {/* AI Price results */}
      {priceResults && (
        <div className="rounded-xl p-3 space-y-1.5" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <p className="font-body text-[10px] text-[#00D4FF] font-bold">💡 Suggested: {priceResults.suggested_price_php}</p>
          {priceResults.market_insight && <p className="font-body text-[9px] text-white/40">{priceResults.market_insight}</p>}
          {(priceResults.platforms || []).map((p, i) => (
            <div key={i} className="flex justify-between text-[9px]">
              <span className="text-white/50">{p.platform}</span>
              <span className="text-[#00D4FF] font-bold">{p.price_php}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-semibold text-xs transition-colors">
          <Save className="w-3.5 h-3.5" /> {editing ? 'Update' : 'Publish'}
        </button>
        <button onClick={onSaveDraft} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
          <FileText className="w-3.5 h-3.5" /> Save as Draft
        </button>
        {form.title && (
          <button onClick={runPriceSearch} disabled={priceLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF]/10 transition-colors disabled:opacity-50">
            {priceLoading ? <div className="w-3 h-3 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <Search className="w-3 h-3" />}
            AI Price Check
          </button>
        )}
        <button onClick={onCancel} className="px-4 py-2 border border-white/10 text-white/40 rounded-xl font-body text-xs hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [activeNav, setActiveNav] = useState('listings');
  const [profileOpen, setProfileOpen] = useState(false);
  const [locationSetup, setLocationSetup] = useState({ location: 'Manila', area: '' });
  const [savingSetup, setSavingSetup] = useState(false);
  const [sellerPageForm, setSellerPageForm] = useState({ bio: '', page_enabled: false });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const setF = (field, val) => setForm(f => ({ ...f, [field]: val }));

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        setLocationSetup({ location: me.seller_location || 'Manila', area: me.seller_area || '' });
        setSellerPageForm({ bio: me.seller_bio || '', page_enabled: me.seller_page_enabled || false });
        const [items, draftItems, ords, favs] = await Promise.all([
          base44.entities.Listing.filter({ created_by: me.email }),
          base44.entities.DraftListing.filter({ created_by: me.email }),
          base44.entities.Order.filter({ seller_email: me.email }),
          base44.entities.Favourite.filter({ user_email: me.email }),
        ]);
        setListings(items);
        setDrafts(draftItems);
        setOrders(ords);
        setFavourites(favs);
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, seller_name: user?.full_name || '', area: user?.seller_area || '', location: user?.seller_location || 'Manila' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ ...EMPTY_FORM, ...item, price: String(item.price || ''), year: String(item.year || '') });
    setEditing(item);
    setShowForm(true);
  };

  const isElectronics = form.type === 'electronics';
  const subcatOptions = SUBCATEGORIES_MAP[form.type] || ['General'];

  const save = async () => {
    if (!form.title) return showToast('Please add a title');
    if (isElectronics && (!form.warranty || !form.specs)) return showToast('Electronics require warranty & specs');
    const imgs = form.extra_images || [];
    const mainImage = form.image_url || imgs[0] || '';
    const extras = mainImage && imgs[0] === mainImage ? imgs.slice(1) : imgs;
    const data = { ...form, price: Number(form.price) || 0, image_url: mainImage, extra_images: extras, seller_name: user?.full_name || form.seller_name };
    if (editing) {
      await base44.entities.Listing.update(editing.id, data);
      showToast('Listing updated!');
    } else {
      await base44.entities.Listing.create(data);
      showToast('Listing published!');
    }
    setShowForm(false); setEditing(null);
    const items = await base44.entities.Listing.filter({ created_by: user.email });
    setListings(items);
  };

  const saveDraft = async () => {
    if (!form.title) return showToast('Add a title first');
    const data = { ...form, price: Number(form.price) || 0, seller_name: user?.full_name || form.seller_name };
    await base44.entities.DraftListing.create(data);
    showToast('Saved as draft!');
    setShowForm(false); setEditing(null);
    const draftItems = await base44.entities.DraftListing.filter({ created_by: user.email });
    setDrafts(draftItems);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await base44.entities.Listing.delete(id);
    showToast('Deleted.');
    const items = await base44.entities.Listing.filter({ created_by: user.email });
    setListings(items);
  };

  const deleteDraft = async (id) => {
    await base44.entities.DraftListing.delete(id);
    setDrafts(prev => prev.filter(d => d.id !== id));
    showToast('Draft deleted.');
  };

  const publishDraft = async (draft) => {
    const { id, created_date, updated_date, created_by, ...data } = draft;
    await base44.entities.Listing.create({ ...data, is_active: true });
    await base44.entities.DraftListing.delete(id);
    showToast('Draft published!');
    const [items, draftItems] = await Promise.all([
      base44.entities.Listing.filter({ created_by: user.email }),
      base44.entities.DraftListing.filter({ created_by: user.email }),
    ]);
    setListings(items);
    setDrafts(draftItems);
  };

  const confirmDelivery = async (order) => {
    const updated = await base44.entities.Order.update(order.id, {
      seller_confirmed_delivery: true,
      status: order.buyer_confirmed_received ? 'completed' : 'seller_confirmed',
    });
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...updated } : o));
  };

  const saveLocation = async () => {
    setSavingSetup(true);
    await base44.auth.updateMe({ is_seller: true, seller_location: locationSetup.location, seller_area: locationSetup.area, account_type: 'business_owner' });
    const me = await base44.auth.me();
    setUser(me);
    setSavingSetup(false);
    setShowSetup(false);
    showToast('Location saved!');
  };

  const saveSellerPage = async () => {
    await base44.auth.updateMe({ seller_bio: sellerPageForm.bio, seller_page_enabled: sellerPageForm.page_enabled });
    const me = await base44.auth.me();
    setUser(me);
    showToast('Seller page updated!');
  };

  const submitVerification = async () => {
    await base44.auth.updateMe({ verification_submitted: true });
    const me = await base44.auth.me();
    setUser(me);
    showToast('Verification request submitted! Admin will review.');
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6">
          <Store className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Sign In to Sell</h2>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  const initials = user ? (user.full_name || user.username || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const isVerified = user?.is_verified_seller;
  const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl" style={{ background: 'rgba(7,15,26,0.92)' }}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-white/40 hover:text-white transition-colors font-body text-xs flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
            <div className="h-3 w-px bg-white/15" />
            <span className="font-heading font-bold text-white text-xs">Seller Dashboard</span>
            {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-[#2563EB]" />}
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <Link to={`/seller/${user.username || user.id}`}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] font-body text-[9px] font-semibold hover:bg-[#00D4FF]/20 transition-colors">
                <Globe className="w-2.5 h-2.5" /> View Profile
              </Link>
            )}
            {user?.seller_location ? (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <MapPin className="w-2.5 h-2.5 text-green-400" />
                <span className="font-body text-[9px] text-green-400 font-semibold">{user.seller_location}</span>
              </div>
            ) : (
              <button onClick={() => setShowSetup(true)} className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-body text-[9px] font-semibold">
                <MapPin className="w-2.5 h-2.5" /> Set Location
              </button>
            )}
            <div className="relative">
              <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/8 border border-white/10">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-[9px]">{initials}</div>
                <ChevronDown className="w-2.5 h-2.5 text-white/40" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1.5 w-40 rounded-xl overflow-hidden shadow-2xl z-50"
                    style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <div className="p-1.5">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white font-body text-xs transition-colors">
                        <User className="w-3 h-3 text-[#00D4FF]" /> My Profile
                      </Link>
                      <button onClick={() => { setProfileOpen(false); setShowSetup(true); }} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white font-body text-xs transition-colors">
                        <MapPin className="w-3 h-3 text-amber-400" /> Store Location
                      </button>
                      <button onClick={() => base44.auth.logout('/')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-500/10 text-red-400 font-body text-xs transition-colors">
                        <LogOut className="w-3 h-3" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sub nav */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 flex gap-0.5 pb-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {NAV_TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveNav(key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-[10px] font-semibold transition-all whitespace-nowrap ${activeNav === key ? 'bg-[#00D4FF]/15 text-[#00D4FF]' : 'text-white/35 hover:text-white'}`}>
              <Icon className="w-3 h-3" /> {label}
              {key === 'orders' && pendingOrders.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center ml-0.5">{pendingOrders.length}</span>
              )}
            </button>
          ))}
          <button onClick={openAdd} className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-white text-[#0A192F] font-body text-[10px] font-bold transition-colors whitespace-nowrap">
            <Plus className="w-3 h-3" /> New Listing
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 pt-24 pb-10">
        {/* Seller header card */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 mb-4 flex items-center justify-between gap-3"
            style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0">{initials}</div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-white text-sm flex items-center gap-1">
                  {user.full_name || 'Seller'}
                  {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-[#2563EB]" />}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="font-body text-[9px] text-white/35">{user.email}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20">🏪 Seller</span>
                  {isVerified ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB]/20 text-[#60a5fa] border border-[#2563EB]/20 flex items-center gap-1">
                      <BadgeCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-[8px] text-white/20 font-body">Independent Non-verified Partner</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-heading font-bold text-lg text-white">{listings.length}</p>
              <p className="font-body text-[9px] text-white/35">Listings</p>
            </div>
          </motion.div>
        )}

        {/* LISTINGS TAB */}
        {activeNav === 'listings' && (
          <>
            <AnimatePresence>
              {showForm && (
                <ListingForm
                  form={form} setF={setF}
                  onSave={save} onSaveDraft={saveDraft}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                  editing={editing} isElectronics={isElectronics} subcatOptions={subcatOptions}
                />
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex items-center justify-center py-20"><div className="w-7 h-7 border-4 border-white/10 border-t-[#00D4FF] rounded-full animate-spin" /></div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Package className="w-10 h-10 text-white/15 mx-auto mb-2" />
                <p className="font-heading font-bold text-white/30 text-sm mb-1">No listings yet</p>
                <button onClick={openAdd} className="px-5 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-semibold text-xs hover:bg-white transition-colors mt-2">
                  Add First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {listings.map(item => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/8 p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10" onError={e => e.target.style.display = 'none'} />
                      : <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-white/20" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-heading font-bold text-xs text-white">{item.title}</h4>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB]/20 text-[#00D4FF] capitalize">{item.type}</span>
                        {!item.is_active && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400">Hidden</span>}
                        {item.status === 'sold' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400">SOLD</span>}
                        {!isVerified && <span className="text-[8px] text-white/15 font-body">Non-verified</span>}
                      </div>
                      <p className="font-body text-[9px] text-white/35 mt-0.5">{item.location}{item.area ? ` · ${item.area}` : ''} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-xl bg-white/5 hover:bg-[#2563EB]/20 border border-white/10 transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-[#00D4FF]" />
                      </button>
                      <button onClick={() => remove(item.id)} className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* DRAFTS TAB */}
        {activeNav === 'drafts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-white text-sm">Draft Listings ({drafts.length})</h3>
              <button onClick={openAdd} className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/15 text-white/60 rounded-xl font-body text-xs font-semibold hover:bg-white/10 transition-colors">
                <Plus className="w-3 h-3" /> New Draft
              </button>
            </div>
            {drafts.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <FileText className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="font-body text-sm text-white/30">No drafts. Start creating and save for later.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {drafts.map(draft => (
                  <div key={draft.id} className="rounded-xl border border-white/8 p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-white/25" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs text-white truncate">{draft.title || 'Untitled Draft'}</p>
                      <p className="font-body text-[9px] text-white/35">{draft.type} · {draft.location}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => publishDraft(draft)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body text-[9px] font-bold hover:bg-[#00D4FF]/20 transition-colors">
                        <Eye className="w-2.5 h-2.5" /> Publish
                      </button>
                      <button onClick={() => deleteDraft(draft.id)} className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <AnimatePresence>
              {showForm && (
                <ListingForm form={form} setF={setF} onSave={save} onSaveDraft={saveDraft}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                  editing={editing} isElectronics={isElectronics} subcatOptions={subcatOptions} />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeNav === 'orders' && (
          <OrdersTab
            orders={orders}
            setOrders={setOrders}
            listings={listings}
            user={user}
            confirmDelivery={confirmDelivery}
            showToast={showToast}
          />
        )}

        {/* FAVOURITES TAB */}
        {activeNav === 'favourites' && (
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white text-sm">Saved / Favourites ({favourites.length})</h3>
            {favourites.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Heart className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="font-body text-sm text-white/30">No saved items.</p>
                <Link to="/buysell" className="inline-block mt-3 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs">Browse Listings →</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {favourites.map(fav => (
                  <div key={fav.id} className="rounded-xl border border-white/8 p-3 flex items-center gap-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {fav.image_url && <img src={fav.image_url} alt={fav.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/10" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs text-white truncate">{fav.title}</p>
                      <p className="font-body text-[9px] text-[#00D4FF]">{fav.price_label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SELLER PAGE TAB */}
        {activeNav === 'sellerpage' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-sm">Your Seller Page</h3>

            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-2">
                {isVerified
                  ? <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2563EB]/20 text-[#60a5fa] border border-[#2563EB]/20 font-body text-[10px] font-bold"><BadgeCheck className="w-3 h-3" /> Verified Seller</span>
                  : <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/30 font-body text-[10px] border border-white/10">Unverified · Independent Non-verified Partner</span>
                }
              </div>

              <div>
                <label className="font-body text-[10px] font-semibold text-white/45 uppercase tracking-wider mb-1.5 block">Seller Bio / About</label>
                <textarea
                  value={sellerPageForm.bio}
                  onChange={e => setSellerPageForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell buyers about your business..."
                  className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-24 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div>
                  <p className="font-body text-xs text-white font-semibold">Public Seller Page</p>
                  <p className="font-body text-[9px] text-white/35">Customers can visit your dedicated page</p>
                </div>
                <button onClick={() => setSellerPageForm(f => ({ ...f, page_enabled: !f.page_enabled }))}
                  className={`w-9 h-5 rounded-full relative transition-colors ${sellerPageForm.page_enabled ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${sellerPageForm.page_enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <button onClick={saveSellerPage}
                className="px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors">
                Save Seller Page
              </button>
            </div>

            {/* Verification */}
            {!isVerified && (
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.1),rgba(0,212,255,0.05))', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-8 h-8 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-heading font-bold text-white text-sm">Get Verified</p>
                    <p className="font-body text-[10px] text-white/40 leading-relaxed mb-3">
                      Submit your business documents to get a blue checkmark on your listings and seller page. Admin reviews all submissions.
                    </p>
                    {user?.verification_submitted ? (
                      <div className="flex items-center gap-2 text-amber-400 font-body text-xs">
                        <CheckCircle className="w-3.5 h-3.5" /> Documents submitted — pending admin review
                      </div>
                    ) : (
                      <button onClick={submitVerification}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body font-bold text-xs hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
                        <BadgeCheck className="w-3.5 h-3.5" /> Submit for Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeNav === 'settings' && user && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-heading font-bold text-white text-sm">Store Location</h3>
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Location</label>
                <select value={locationSetup.location} onChange={e => setLocationSetup(l => ({ ...l, location: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF] mb-2">
                  {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                </select>
              </div>
              <Field label="Area / District" value={locationSetup.area} onChange={v => setLocationSetup(l => ({ ...l, area: v }))} placeholder="e.g. Bacoor, BGC" />
              <button onClick={saveLocation} disabled={savingSetup}
                className="px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {savingSetup ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <MapPin className="w-3 h-3" />}
                Save Location
              </button>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="font-heading font-bold text-white text-sm mb-3">Account</h3>
              <div className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="font-body text-xs text-white/50">{user.email}</p>
                <span className="text-[9px] text-[#00D4FF] font-bold px-2 py-0.5 rounded-full bg-[#00D4FF]/10">Verified ✓</span>
              </div>
              <button onClick={() => base44.auth.logout('/')}
                className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-body font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Location Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A192F]/85 backdrop-blur-sm" onClick={() => setShowSetup(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2"><Store className="w-4 h-4 text-[#00D4FF]" /><h3 className="font-heading font-bold text-white text-sm">Store Location</h3></div>
                <button onClick={() => setShowSetup(false)}><X className="w-4 h-4 text-white/40" /></button>
              </div>
              <div className="p-5 space-y-3">
                <select value={locationSetup.location} onChange={e => setLocationSetup(l => ({ ...l, location: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                </select>
                <input value={locationSetup.area} onChange={e => setLocationSetup(l => ({ ...l, area: e.target.value }))} placeholder="Specific area / district"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
                <button onClick={saveLocation} disabled={savingSetup}
                  className="w-full py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {savingSetup ? <div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <MapPin className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-body text-xs shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}