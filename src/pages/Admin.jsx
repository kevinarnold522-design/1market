import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const OWNER_EMAIL = 'Kevinarnold522@gmail.com';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft, Building2, ShoppingBag, Search, Image, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = ['food', 'travel', 'buysell'];
const TYPES = ['chain', 'carinderia', 'home-kitchen', 'home-baker', 'coffee', 'hotel', 'vehicle-rental', 'shop', 'service'];
const LOCATIONS = ['Manila', 'Cavite', 'Nationwide'];

const EMPTY_BIZ = {
  name: '', category: '', type: 'carinderia', section: 'food',
  location: 'Manila', area: '', address: '', hours: '', tag: '',
  logo_url: '', image_url: '', extra_images: [], menu: [],
  phone: '', description: '', is_active: true,
};

const EMPTY_LISTING = {
  title: '', type: 'shoes', location: 'Manila', area: '', seller_name: '',
  phone: '', description: '', image_url: '', extra_images: [],
  price: '', price_label: '', condition: 'Brand New', brand: '', model: '',
  year: '', mileage: '', transmission: '', size: '',
  property_type: '', lot_size: '', bedrooms: '', bathrooms: '',
  status: '', service_area: '', business_id: '', is_active: true,
};

function FieldInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] resize-none h-20" />
      ) : type === 'select' ? null : (
        <input type={type === 'number' ? 'number' : 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] bg-white">
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function ArrayField({ label, value, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => { if (input.trim()) { onChange([...(value || []), input.trim()]); setInput(''); } };
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
        <button onClick={add} className="px-3 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-semibold hover:bg-[#2563EB] transition-colors">Add</button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(value || []).map((item, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#F8FAFC] border border-[#0A192F]/10 rounded-full text-xs text-[#0A192F]/70">
            {item.length > 40 ? item.slice(0, 40) + '…' : item}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}><X className="w-3 h-3 text-red-400 hover:text-red-600" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function BusinessForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_BIZ);
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="bg-white rounded-2xl border border-[#0A192F]/10 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldInput label="Business Name *" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Jollibee – Bacoor" />
        <FieldInput label="Category" value={form.category} onChange={v => set('category', v)} placeholder="e.g. Fast Food" />
        <SelectField label="Section *" value={form.section} onChange={v => set('section', v)} options={SECTIONS} />
        <SelectField label="Type" value={form.type} onChange={v => set('type', v)} options={TYPES} />
        <SelectField label="Location *" value={form.location} onChange={v => set('location', v)} options={LOCATIONS} />
        <FieldInput label="Area / District" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <FieldInput label="Address" value={form.address} onChange={v => set('address', v)} placeholder="Full address" />
        <FieldInput label="Business Hours" value={form.hours} onChange={v => set('hours', v)} placeholder="e.g. 6:00 AM – 10:00 PM" />
        <FieldInput label="Tag / Badge" value={form.tag} onChange={v => set('tag', v)} placeholder="e.g. Open Now" />
        <FieldInput label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldInput label="Logo URL (real company logo)" value={form.logo_url} onChange={v => set('logo_url', v)} placeholder="https://..." />
          {form.logo_url && <img src={form.logo_url} alt="logo" className="mt-2 h-12 rounded-lg object-contain border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />}
        </div>
        <div>
          <FieldInput label="Main Establishment Photo URL" value={form.image_url} onChange={v => set('image_url', v)} placeholder="https://..." />
          {form.image_url && <img src={form.image_url} alt="main" className="mt-2 h-20 rounded-lg object-cover w-full border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />}
        </div>
      </div>

      <ArrayField label="Additional Establishment Photos (URLs)" value={form.extra_images} onChange={v => set('extra_images', v)} placeholder="Paste photo URL and press Add" />
      <ArrayField label="Menu Items / Key Offerings" value={form.menu} onChange={v => set('menu', v)} placeholder="e.g. Chickenjoy" />
      <FieldInput label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" placeholder="Short description of the business..." />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
        <label htmlFor="active" className="font-body text-sm text-[#0A192F]/70">Active / Visible on site</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
          <Save className="w-4 h-4" /> Save Business
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-sm hover:bg-[#F8FAFC] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ListingForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_LISTING);
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="bg-white rounded-2xl border border-[#0A192F]/10 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldInput label="Title *" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Nike Air Force 1 Low" />
        <SelectField label="Type *" value={form.type} onChange={v => set('type', v)}
          options={['shoes', 'cars', 'houses', 'services', 'product']} />
        <SelectField label="Location *" value={form.location} onChange={v => set('location', v)} options={['Manila', 'Cavite']} />
        <FieldInput label="Area" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <FieldInput label="Seller Name" value={form.seller_name} onChange={v => set('seller_name', v)} placeholder="e.g. Direct Owner" />
        <FieldInput label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
        <FieldInput label="Price (number)" value={form.price} onChange={v => set('price', v)} type="number" placeholder="e.g. 3500" />
        <FieldInput label="Price Label (display)" value={form.price_label} onChange={v => set('price_label', v)} placeholder="e.g. ₱3,500 or ₱500/hour" />
      </div>

      {form.type === 'cars' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FieldInput label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="Toyota" />
          <FieldInput label="Model" value={form.model} onChange={v => set('model', v)} placeholder="Vios" />
          <FieldInput label="Year" value={form.year} onChange={v => set('year', v)} type="number" placeholder="2019" />
          <FieldInput label="Mileage" value={form.mileage} onChange={v => set('mileage', v)} placeholder="48,000 KM" />
          <FieldInput label="Transmission" value={form.transmission} onChange={v => set('transmission', v)} placeholder="Automatic" />
        </div>
      )}
      {form.type === 'shoes' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <FieldInput label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="Nike" />
          <FieldInput label="Model" value={form.model} onChange={v => set('model', v)} placeholder="Air Force 1" />
          <FieldInput label="Size" value={form.size} onChange={v => set('size', v)} placeholder="US 10" />
        </div>
      )}
      {form.type === 'houses' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FieldInput label="Property Type" value={form.property_type} onChange={v => set('property_type', v)} placeholder="Townhouse" />
          <FieldInput label="Lot Size" value={form.lot_size} onChange={v => set('lot_size', v)} placeholder="48 sqm" />
          <FieldInput label="Bedrooms" value={form.bedrooms} onChange={v => set('bedrooms', v)} type="number" />
          <FieldInput label="Bathrooms" value={form.bathrooms} onChange={v => set('bathrooms', v)} type="number" />
          <FieldInput label="Status" value={form.status} onChange={v => set('status', v)} placeholder="Ready For Occupancy" />
        </div>
      )}
      {form.type === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldInput label="Service Area" value={form.service_area} onChange={v => set('service_area', v)} placeholder="Both / Manila Only / Cavite Only" />
        </div>
      )}

      <SelectField label="Condition" value={form.condition} onChange={v => set('condition', v)}
        options={['Brand New', 'Like New', 'Used', 'N/A']} />

      <div>
        <FieldInput label="Main Image URL" value={form.image_url} onChange={v => set('image_url', v)} placeholder="https://..." />
        {form.image_url && <img src={form.image_url} alt="listing" className="mt-2 h-24 rounded-lg object-cover border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />}
      </div>
      <ArrayField label="Additional Photos (URLs)" value={form.extra_images} onChange={v => set('extra_images', v)} placeholder="Paste URL and press Add" />
      <FieldInput label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" />

      <div className="flex items-center gap-3">
        <input type="checkbox" id="list-active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
        <label htmlFor="list-active" className="font-body text-sm text-[#0A192F]/70">Active / Visible on site</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
          <Save className="w-4 h-4" /> Save Listing
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('businesses');
  const [authChecked, setAuthChecked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      setIsOwner(user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);
  const [businesses, setBusinesses] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBizForm, setShowBizForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const loadAll = async () => {
    setLoading(true);
    const [bizs, lists] = await Promise.all([
      base44.entities.Business.list('-created_date', 200),
      base44.entities.Listing.list('-created_date', 200),
    ]);
    setBusinesses(bizs);
    setListings(lists);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const saveBiz = async (form) => {
    if (!form.name) return;
    const data = { ...form, menu: form.menu || [], extra_images: form.extra_images || [] };
    if (editingBiz) {
      await base44.entities.Business.update(editingBiz.id, data);
      showToast('Business updated!');
    } else {
      await base44.entities.Business.create(data);
      showToast('Business added!');
    }
    setShowBizForm(false); setEditingBiz(null);
    loadAll();
  };

  const deleteBiz = async (id) => {
    if (!window.confirm('Delete this business?')) return;
    await base44.entities.Business.delete(id);
    showToast('Business deleted.');
    loadAll();
  };

  const saveList = async (form) => {
    if (!form.title) return;
    const data = { ...form, price: Number(form.price) || 0, extra_images: form.extra_images || [] };
    if (editingList) {
      await base44.entities.Listing.update(editingList.id, data);
      showToast('Listing updated!');
    } else {
      await base44.entities.Listing.create(data);
      showToast('Listing added!');
    }
    setShowListForm(false); setEditingList(null);
    loadAll();
  };

  const deleteList = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await base44.entities.Listing.delete(id);
    showToast('Listing deleted.');
    loadAll();
  };

  if (!authChecked) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#0A192F]/10 border-t-[#2563EB] rounded-full animate-spin" />
    </div>
  );

  if (!isOwner) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
        <h2 className="font-heading font-bold text-xl text-[#0A192F] mb-2">Access Restricted</h2>
        <p className="font-body text-sm text-[#0A192F]/50 mb-4">This dashboard is only accessible to the site owner.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-white rounded-xl font-body text-sm font-semibold hover:bg-[#2563EB] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );

  const filteredBiz = businesses.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase()) || b.area?.toLowerCase().includes(search.toLowerCase());
    const matchSection = sectionFilter === 'all' || b.section === sectionFilter;
    return matchSearch && matchSection;
  });

  const filteredList = listings.filter(l =>
    l.title?.toLowerCase().includes(search.toLowerCase()) || l.area?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#0A192F] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-body">
              <ArrowLeft className="w-4 h-4" /> Back to Site
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-xs">1</span>
              </div>
              <span className="font-heading font-bold text-white">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowBizForm(true); setEditingBiz(null); setTab('businesses'); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
              <Plus className="w-4 h-4" /> Add Business
            </button>
            <button onClick={() => { setShowListForm(true); setEditingList(null); setTab('listings'); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-body font-bold text-sm hover:bg-white/20 transition-colors">
              <Plus className="w-4 h-4" /> Add Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Businesses', value: businesses.length, color: 'text-[#2563EB]' },
            { label: 'Food Listings', value: businesses.filter(b => b.section === 'food').length, color: 'text-emerald-600' },
            { label: 'Travel Listings', value: businesses.filter(b => b.section === 'travel').length, color: 'text-amber-600' },
            { label: 'Buy & Sell Items', value: listings.length, color: 'text-rose-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#0A192F]/5 shadow-sm">
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
              <p className="font-body text-xs text-[#0A192F]/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#0A192F]/10 pb-4">
          {[
            { key: 'businesses', label: 'Businesses', icon: Building2 },
            { key: 'listings', label: 'Buy & Sell Listings', icon: ShoppingBag },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all ${tab === t.key ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
          </div>
          {tab === 'businesses' && (
            <div className="flex gap-2 flex-wrap">
              {['all', ...SECTIONS].map(s => (
                <button key={s} onClick={() => setSectionFilter(s)}
                  className={`px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all capitalize ${sectionFilter === s ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Forms */}
        <AnimatePresence>
          {(showBizForm || editingBiz) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
              <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-4">{editingBiz ? 'Edit Business' : 'Add New Business'}</h3>
              <BusinessForm initial={editingBiz || EMPTY_BIZ} onSave={saveBiz} onCancel={() => { setShowBizForm(false); setEditingBiz(null); }} />
            </motion.div>
          )}
          {(showListForm || editingList) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
              <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-4">{editingList ? 'Edit Listing' : 'Add New Listing'}</h3>
              <ListingForm initial={editingList || EMPTY_LISTING} onSave={saveList} onCancel={() => { setShowListForm(false); setEditingList(null); }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#0A192F]/10 border-t-[#2563EB] rounded-full animate-spin" />
          </div>
        ) : tab === 'businesses' ? (
          <div className="space-y-3">
            {filteredBiz.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">
                No businesses yet. Click "Add Business" to get started.
              </div>
            )}
            {filteredBiz.map(biz => (
              <motion.div key={biz.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-[#0A192F]/5 p-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {biz.logo_url ? (
                    <img src={biz.logo_url} alt="logo" className="w-12 h-12 rounded-xl object-contain border border-[#0A192F]/10 bg-[#F8FAFC] flex-shrink-0"
                      onError={e => { e.target.style.display='none'; }} />
                  ) : biz.image_url ? (
                    <img src={biz.image_url} alt={biz.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#0A192F]/20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-bold text-sm text-[#0A192F] truncate">{biz.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${biz.section === 'food' ? 'bg-emerald-100 text-emerald-700' : biz.section === 'travel' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {biz.section}
                      </span>
                      {!biz.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Hidden</span>}
                    </div>
                    <p className="font-body text-xs text-[#0A192F]/40 truncate">{biz.location} · {biz.area} · {biz.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingBiz(biz); setShowBizForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#0A192F]/10 transition-colors">
                    <Pencil className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <button onClick={() => deleteBiz(biz.id)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.length === 0 && (
              <div className="text-center py-16 text-[#0A192F]/40 font-body">
                No listings yet. Click "Add Listing" to get started.
              </div>
            )}
            {filteredList.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-[#0A192F]/5 p-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      onError={e => e.target.style.display='none'} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#0A192F]/20" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-bold text-sm text-[#0A192F] truncate">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 capitalize">{item.type}</span>
                      {!item.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Hidden</span>}
                    </div>
                    <p className="font-body text-xs text-[#0A192F]/40">{item.location} · {item.area} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingList(item); setShowListForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#0A192F]/10 transition-colors">
                    <Pencil className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <button onClick={() => deleteList(item.id)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0A192F] text-white px-6 py-3 rounded-xl font-body text-sm shadow-2xl z-50">
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}