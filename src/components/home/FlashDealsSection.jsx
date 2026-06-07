import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Tag, Plus, X, Upload, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

function Countdown({ endTime }) {
  const calc = () => {
    const diff = Math.max(0, endTime - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    const iv = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(iv);
  }, [endTime]);
  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1 text-[#FFD700]">
      <Clock className="w-3 h-3" />
      <span className="font-heading font-bold text-xs tabular-nums">{pad(t.h)}:{pad(t.m)}:{pad(t.s)}</span>
    </div>
  );
}

function CreateFlashDealModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', price: '', original_price: '', hours: '4', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.original_price) return;
    setSaving(true);
    const endTime = new Date(Date.now() + Number(form.hours) * 3600 * 1000).toISOString();
    await base44.entities.Listing.create({
      title: form.title,
      type: 'product',
      main_category: 'buysell',
      location: user?.seller_location || 'Philippines',
      price: Number(form.price),
      original_price: Number(form.original_price),
      price_label: `₱${Number(form.price).toLocaleString()}`,
      image_url: form.image_url,
      seller_name: user?.full_name || '',
      email_contact: user?.email || '',
      is_active: true,
      flash_deal_active: true,
      flash_deal_end: endTime,
      approval_status: 'approved',
    });
    setSaving(false);
    onCreated();
    onClose();
  };

  const discount = form.original_price && form.price && Number(form.original_price) > Number(form.price)
    ? Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100)
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(249,115,22,0.3)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <h3 className="font-heading font-bold text-white text-base">Create Flash Deal</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Image */}
          {form.image_url ? (
            <div className="relative h-32 rounded-xl overflow-hidden">
              <img src={form.image_url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center">
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-orange-400/30 cursor-pointer hover:border-orange-400/60 transition-colors">
              {uploading
                ? <div className="w-5 h-5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
                : <><Upload className="w-5 h-5 text-orange-400/50 mb-1" /><span className="font-body text-xs text-orange-400/50">Upload Product Photo</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}

          <div>
            <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Product Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. iPhone 14 Pro 256GB"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-orange-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Sale Price (₱) *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="42500"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Original Price (₱) *</label>
              <input type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="48000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-orange-400" />
            </div>
          </div>

          {discount !== null && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <Tag className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-body text-xs text-orange-300 font-bold">-{discount}% off badge will show on your listing</span>
            </div>
          )}

          <div>
            <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Flash Deal Duration</label>
            <select value={form.hours} onChange={e => set('hours', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-orange-400">
              <option value="1" className="bg-[#0D1F3C]">1 Hour</option>
              <option value="2" className="bg-[#0D1F3C]">2 Hours</option>
              <option value="4" className="bg-[#0D1F3C]">4 Hours</option>
              <option value="8" className="bg-[#0D1F3C]">8 Hours</option>
              <option value="12" className="bg-[#0D1F3C]">12 Hours</option>
              <option value="24" className="bg-[#0D1F3C]">24 Hours</option>
            </select>
          </div>

          <button onClick={handleSave} disabled={!form.title || !form.price || !form.original_price || saving}
            className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', boxShadow: '0 0 20px rgba(249,115,22,0.4)' }}>
            {saving ? 'Creating...' : '⚡ Launch Flash Deal'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FlashDealsSection() {
  const [user, setUser] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const isSellerOrAdmin = user?.role === 'admin' || user?.is_seller || user?.account_type === 'business_owner' || user?.user_type === 'seller' || user?.user_type === 'business';

  const loadDeals = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.Listing.filter({ flash_deal_active: true, is_active: true });
      // Filter only non-expired deals
      const now = Date.now();
      const active = all.filter(d => d.flash_deal_end && new Date(d.flash_deal_end).getTime() > now);
      setDeals(active);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    loadDeals();
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
    }).catch(() => {});
  }, []);

  if (!loading && deals.length === 0 && !isSellerOrAdmin) return null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Flash Deals</h2>
              <p className="font-body text-[10px] text-white/40">Limited time offers — grab before they expire!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSellerOrAdmin && (
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', boxShadow: '0 0 12px rgba(249,115,22,0.35)' }}>
                <Plus className="w-3.5 h-3.5" /> Create Flash Deal
              </button>
            )}
            <Link to="/buysell" className="font-body text-xs text-[#00D4FF] hover:underline">See all →</Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-10 rounded-2xl" style={{ background: 'rgba(249,115,22,0.05)', border: '1px dashed rgba(249,115,22,0.2)' }}>
            <Zap className="w-8 h-8 text-orange-400/30 mx-auto mb-2" />
            <p className="font-body text-sm text-white/30">No active flash deals right now.</p>
            {isSellerOrAdmin && (
              <button onClick={() => setShowCreate(true)}
                className="mt-3 px-4 py-2 rounded-xl font-body font-bold text-xs text-white"
                style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                ⚡ Be the first — Create a Flash Deal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {deals.map((item, i) => {
              const endMs = new Date(item.flash_deal_end).getTime();
              const discount = item.original_price && item.price && item.original_price > item.price
                ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                : null;
              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group relative"
                  style={{ background: '#0D1F3C', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <Link to={`/listing/${item.id}`}>
                    <div className="relative h-32 overflow-hidden">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-orange-500/10 flex items-center justify-center"><Zap className="w-8 h-8 text-orange-400/30" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C] to-transparent" />
                      {discount !== null && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-heading font-bold text-[10px] text-white"
                          style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                          -{discount}%
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(249,115,22,0.4)' }}>
                        <Countdown endTime={endMs} />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-body text-[11px] text-white leading-tight line-clamp-2 mb-1.5">{item.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-sm text-[#FFD700]">
                          ₱{Number(item.price).toLocaleString()}
                        </span>
                        {item.original_price && (
                          <span className="font-body text-[10px] text-white/30 line-through">
                            ₱{Number(item.original_price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Tag className="w-2.5 h-2.5 text-orange-400" />
                        <span className="font-body text-[9px] text-orange-400">Flash Price</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && user && (
          <CreateFlashDealModal user={user} onClose={() => setShowCreate(false)} onCreated={loadDeals} />
        )}
      </AnimatePresence>
    </section>
  );
}