import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft, Package, MapPin, Store, Search, ExternalLink, ChevronDown, User, LogOut, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarField from '../components/StarField';

const EMPTY = {
  title: '', type: 'product', location: 'Manila', area: '',
  seller_name: '', phone: '', description: '', image_url: '',
  extra_images: [], price: '', price_label: '', condition: 'Brand New',
  brand: '', model: '', size: '', is_active: true,
};

const LOCATIONS = ['Manila', 'Cavite', 'Cebu', 'Davao', 'Nationwide'];

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-white/50 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-sm resize-none h-20 focus:outline-none focus:border-[#00D4FF] bg-white/5 text-white placeholder-white/25" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] bg-white/5 placeholder-white/25" />
      )}
    </div>
  );
}

function AIPriceSearch({ title, brand, onClose }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Search the web and find the current selling prices for: "${title}"${brand ? ` by ${brand}` : ''}. 
Look across Lazada Philippines, Shopee Philippines, Amazon, eBay, and any other relevant platforms.
Return structured price comparison data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            product_name: { type: 'string' },
            platforms: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  platform: { type: 'string' },
                  price_php: { type: 'string' },
                  url: { type: 'string' },
                  condition: { type: 'string' },
                  notes: { type: 'string' },
                },
              },
            },
            suggested_price_php: { type: 'string' },
            market_insight: { type: 'string' },
          },
        },
      });
      setResults(res);
    } catch (e) {
      setResults({ error: 'Could not fetch price data. Please try again.' });
    }
    setLoading(false);
  };

  useEffect(() => { search(); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A192F]/85 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#00D4FF]" />
            <h3 className="font-heading font-bold text-white text-sm">AI Price Comparison</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="p-5">
          <p className="font-body text-xs text-white/50 mb-4">Searching web prices for: <strong className="text-white">{title}</strong></p>

          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-8 h-8 border-3 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
              <p className="font-body text-xs text-white/40">Searching Lazada, Shopee, Amazon, eBay...</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-3">
              {results.error ? (
                <p className="text-red-400 font-body text-sm">{results.error}</p>
              ) : (
                <>
                  {results.suggested_price_php && (
                    <div className="p-3 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                      <p className="font-body text-[10px] text-[#00D4FF] uppercase tracking-wider mb-0.5">Suggested Selling Price</p>
                      <p className="font-heading font-bold text-xl text-white">{results.suggested_price_php}</p>
                      {results.market_insight && <p className="font-body text-[10px] text-white/50 mt-1">{results.market_insight}</p>}
                    </div>
                  )}
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(results.platforms || []).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/8">
                        <div>
                          <p className="font-body text-xs font-semibold text-white">{p.platform}</p>
                          {p.condition && <p className="font-body text-[9px] text-white/40">{p.condition}</p>}
                          {p.notes && <p className="font-body text-[9px] text-white/30">{p.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-heading font-bold text-sm text-[#00D4FF]">{p.price_php}</p>
                          {p.url && p.url !== 'N/A' && (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-body text-[9px] text-[#2563EB] flex items-center gap-0.5 justify-end mt-0.5">
                              View <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={search} className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-body text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Search className="w-3 h-3" /> Refresh Search
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SellerSetupModal({ user, onSave, onClose }) {
  const [location, setLocation] = useState(user?.seller_location || 'Manila');
  const [area, setArea] = useState(user?.seller_area || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ is_seller: true, seller_location: location, seller_area: area, member_type: 'seller' });
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A192F]/85 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#00D4FF]" />
            <h3 className="font-heading font-bold text-white">Set Up Your Store</h3>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="font-body text-xs text-white/50">Tell buyers where you're located to appear in local search results.</p>
          <div>
            <label className="font-body text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">Your Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
              {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">Specific Area / District</label>
            <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Bacoor, Dasmariñas, BGC..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <MapPin className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save & Activate Seller Account'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState('');
  const [showPriceSearch, setShowPriceSearch] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('listings');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const setF = (field, val) => setForm(f => ({ ...f, [field]: val }));

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const items = await base44.entities.Listing.filter({ created_by: me.email });
        setListings(items);
      } catch (e) {
        // not signed in
      }
      setLoading(false);
    };
    init();
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, price: String(item.price || ''), year: String(item.year || '') }); setEditing(item); setShowForm(true); };

  const save = async () => {
    if (!form.title) return;
    const data = { ...form, price: Number(form.price) || 0, extra_images: form.extra_images || [], seller_name: user?.full_name || form.seller_name };
    if (editing) {
      await base44.entities.Listing.update(editing.id, data);
      showToast('Item updated!');
    } else {
      await base44.entities.Listing.create(data);
      showToast('Item added!');
    }
    setShowForm(false); setEditing(null);
    const items = await base44.entities.Listing.filter({ created_by: user.email });
    setListings(items);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await base44.entities.Listing.delete(id);
    showToast('Listing deleted.');
    const items = await base44.entities.Listing.filter({ created_by: user.email });
    setListings(items);
  };

  const refreshUser = async () => {
    const me = await base44.auth.me();
    setUser(me);
    setShowSetup(false);
    showToast('Seller profile saved!');
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-center p-6">
          <Store className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Sign In to Sell</h2>
          <p className="font-body text-sm text-white/40 mb-6">Create an account or sign in to manage your listings.</p>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">Sign In / Sign Up</button>
        </div>
      </div>
    );
  }

  const initials = user ? (user.full_name || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl"
        style={{ background: 'rgba(7,15,26,0.92)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors font-body text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="h-4 w-px bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-[10px]">1</span>
              </div>
              <span className="font-heading font-bold text-white text-sm">Seller Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.seller_location ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <MapPin className="w-3 h-3 text-green-400" />
                <span className="font-body text-[10px] text-green-400 font-semibold">{user.seller_location}{user.seller_area ? ` · ${user.seller_area}` : ''}</span>
              </div>
            ) : (
              <button onClick={() => setShowSetup(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-body text-[10px] font-semibold hover:bg-amber-500/20 transition-colors">
                <MapPin className="w-3 h-3" /> Set Location
              </button>
            )}

            <div className="relative">
              <button onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/8 border border-white/10 hover:border-[#00D4FF]/40 transition-all">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold text-[10px]">{initials}</div>
                <span className="font-body text-xs text-white hidden sm:inline">{user?.full_name?.split(' ')[0] || 'Me'}</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden shadow-2xl z-50"
                    style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <div className="p-2">
                      <Link to="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white font-body text-xs transition-colors">
                        <User className="w-3.5 h-3.5 text-[#00D4FF]" /> My Profile
                      </Link>
                      <button onClick={() => { setProfileOpen(false); setShowSetup(true); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white font-body text-xs transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" /> Store Location
                      </button>
                      <button onClick={() => base44.auth.logout('/')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 font-body text-xs transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sub nav tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 pb-2">
          {[
            { key: 'listings', label: 'My Listings', icon: Package },
            { key: 'analytics', label: 'Analytics', icon: BarChart2 },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveNav(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-semibold transition-all ${activeNav === key ? 'bg-[#00D4FF]/15 text-[#00D4FF]' : 'text-white/40 hover:text-white'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
          <button onClick={openAdd}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-white text-[#0A192F] font-body text-xs font-bold transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Listing
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-12">
        {/* Welcome / stats */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.12)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-base">{initials}</div>
              <div>
                <p className="font-heading font-bold text-white text-base">{user.full_name || 'Seller'}</p>
                <p className="font-body text-xs text-white/40">{user.email} · {listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            {!user.seller_location && (
              <button onClick={() => setShowSetup(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-body text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Set Store Location to appear in search
              </button>
            )}
          </motion.div>
        )}

        {activeNav === 'analytics' && (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <BarChart2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-white text-lg mb-1">Analytics Coming Soon</h3>
            <p className="font-body text-sm text-white/40">View who's viewing your listings, clicks, and more.</p>
          </div>
        )}

        {activeNav === 'listings' && (
          <>
            {/* Add/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-6 rounded-2xl border border-white/10 p-5 space-y-4"
                  style={{ background: 'rgba(13,31,60,0.9)' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg text-white">{editing ? 'Edit Listing' : 'Add New Listing'}</h3>
                    <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-white/40 hover:text-white" /></button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Title *" value={form.title} onChange={v => setF('title', v)} placeholder="e.g. Nike Air Force 1 Low" />
                    <div>
                      <label className="block font-body text-xs font-semibold text-white/50 mb-1">Category</label>
                      <select value={form.type} onChange={e => setF('type', e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
                        {['product', 'shoes', 'cars', 'houses', 'services'].map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-body text-xs font-semibold text-white/50 mb-1">Location</label>
                      <select value={form.location} onChange={e => setF('location', e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
                        {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                      </select>
                    </div>
                    <Field label="Area / District" value={form.area} onChange={v => setF('area', v)} placeholder={user?.seller_area || 'e.g. Bacoor'} />
                    <Field label="Price (₱)" value={form.price} onChange={v => setF('price', v)} type="number" placeholder="e.g. 3500" />
                    <Field label="Price Display (optional)" value={form.price_label} onChange={v => setF('price_label', v)} placeholder="e.g. ₱3,500 / neg" />
                    <Field label="Brand" value={form.brand} onChange={v => setF('brand', v)} placeholder="e.g. Nike" />
                    <div>
                      <label className="block font-body text-xs font-semibold text-white/50 mb-1">Condition</label>
                      <select value={form.condition} onChange={e => setF('condition', e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]">
                        {['Brand New', 'Like New', 'Used', 'N/A'].map(c => <option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
                      </select>
                    </div>
                    <Field label="Your Phone" value={form.phone} onChange={v => setF('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
                    <Field label="Size / Model" value={form.size || form.model} onChange={v => setF('size', v)} placeholder="e.g. US 10 / Vios" />
                  </div>

                  <Field label="Main Photo URL" value={form.image_url} onChange={v => setF('image_url', v)} placeholder="https://..." />
                  {form.image_url && <img src={form.image_url} alt="preview" className="h-28 rounded-xl object-cover border border-white/10 mt-2" onError={e => e.target.style.display='none'} />}
                  <Field label="Description" value={form.description} onChange={v => setF('description', v)} type="textarea" placeholder="Describe your item..." />

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="item-active" checked={form.is_active} onChange={e => setF('is_active', e.target.checked)} className="w-4 h-4 accent-[#00D4FF]" />
                    <label htmlFor="item-active" className="font-body text-sm text-white/60">Show publicly on marketplace</label>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button onClick={save}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-semibold text-sm transition-colors">
                      <Save className="w-4 h-4" /> Save Listing
                    </button>
                    {form.title && (
                      <button onClick={() => setShowPriceSearch(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-[#00D4FF]/30 text-[#00D4FF] rounded-xl font-body text-sm font-semibold hover:bg-[#00D4FF]/10 transition-colors">
                        <Search className="w-4 h-4" /> AI Price Check
                      </button>
                    )}
                    <button onClick={() => { setShowForm(false); setEditing(null); }}
                      className="px-5 py-2.5 border border-white/10 text-white/50 rounded-xl font-body text-sm hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Listings list */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-white/10 border-t-[#00D4FF] rounded-full animate-spin" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Package className="w-12 h-12 text-white/15 mx-auto mb-3" />
                <p className="font-heading font-bold text-white/40 mb-2">No listings yet</p>
                <p className="font-body text-sm text-white/30 mb-5">Add your first product or service to appear on the marketplace.</p>
                <button onClick={openAdd} className="px-6 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-semibold text-sm hover:bg-white transition-colors">
                  Add First Listing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {listings.map(item => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/8 p-4 flex items-center gap-4 flex-wrap"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white/10" onError={e => e.target.style.display='none'} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-bold text-sm text-white">{item.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB]/20 text-[#00D4FF] capitalize">{item.type}</span>
                        {!item.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">Hidden</span>}
                      </div>
                      <p className="font-body text-xs text-white/40 mt-0.5">{item.location}{item.area ? ` · ${item.area}` : ''} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { openEdit(item); }} className="p-2 rounded-xl bg-white/5 hover:bg-[#2563EB]/20 border border-white/10 transition-colors">
                        <Pencil className="w-4 h-4 text-[#00D4FF]" />
                      </button>
                      <button onClick={() => remove(item.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPriceSearch && <AIPriceSearch title={form.title} brand={form.brand} onClose={() => setShowPriceSearch(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSetup && <SellerSetupModal user={user} onSave={refreshUser} onClose={() => setShowSetup(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-body text-sm shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}