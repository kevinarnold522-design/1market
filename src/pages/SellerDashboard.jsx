import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const EMPTY = {
  title: '', type: 'product', location: 'Manila', area: '',
  seller_name: '', phone: '', description: '', image_url: '',
  extra_images: [], price: '', price_label: '', condition: 'Brand New',
  brand: '', model: '', size: '', is_active: true,
};

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm resize-none h-20 focus:outline-none focus:border-[#2563EB]" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB]" />
      )}
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
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder={placeholder}
          className="flex-1 border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm focus:outline-none focus:border-[#2563EB]" />
        <button onClick={add} className="px-3 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-semibold hover:bg-[#2563EB] transition-colors">Add</button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(value || []).map((item, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#F8FAFC] border border-[#0A192F]/10 rounded-full text-xs text-[#0A192F]/70">
            {item.slice(0, 40)}{item.length > 40 && '…'}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}><X className="w-3 h-3 text-red-400" /></button>
          </span>
        ))}
      </div>
    </div>
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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const setF = (field, val) => setForm(f => ({ ...f, [field]: val }));

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me();
      setUser(me);
      const items = await base44.entities.Listing.filter({ created_by: me.email });
      setListings(items);
      setLoading(false);
    };
    init();
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, price: String(item.price || ''), year: String(item.year || '') }); setEditing(item); setShowForm(true); };

  const save = async () => {
    if (!form.title) return;
    const data = { ...form, price: Number(form.price) || 0, extra_images: form.extra_images || [] };
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
    if (!window.confirm('Delete this item?')) return;
    await base44.entities.Listing.delete(id);
    showToast('Item deleted.');
    const items = await base44.entities.Listing.filter({ created_by: user.email });
    setListings(items);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/60 hover:text-white text-sm font-body flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#00D4FF]" />
              <span className="font-heading font-bold text-white">My Products & Listings</span>
            </div>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user.full_name?.[0] || user.email?.[0] || '?'}</span>
            </div>
            <div>
              <p className="font-heading font-bold text-[#0A192F] text-sm">{user.full_name || user.email}</p>
              <p className="font-body text-xs text-[#0A192F]/50">{listings.length} item{listings.length !== 1 ? 's' : ''} listed</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 bg-white rounded-2xl border border-[#0A192F]/10 p-6 space-y-4">
              <h3 className="font-heading font-bold text-lg text-[#0A192F]">{editing ? 'Edit Item' : 'Add New Item'}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title *" value={form.title} onChange={v => setF('title', v)} placeholder="e.g. Nike Air Force 1 Low" />
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Category</label>
                  <select value={form.type} onChange={e => setF('type', e.target.value)}
                    className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] bg-white">
                    {['product', 'shoes', 'cars', 'houses', 'services'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Location</label>
                  <select value={form.location} onChange={e => setF('location', e.target.value)}
                    className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none bg-white">
                    {['Manila', 'Cavite'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <Field label="Area" value={form.area} onChange={v => setF('area', v)} placeholder="e.g. Bacoor" />
                <Field label="Price (₱)" value={form.price} onChange={v => setF('price', v)} type="number" placeholder="e.g. 3500" />
                <Field label="Price Display (optional)" value={form.price_label} onChange={v => setF('price_label', v)} placeholder="e.g. ₱3,500 / ₱500 per hour" />
                <Field label="Brand" value={form.brand} onChange={v => setF('brand', v)} placeholder="e.g. Nike" />
                <Field label="Size / Model" value={form.size || form.model} onChange={v => setF('size', v)} placeholder="e.g. US 10 / Vios" />
                <Field label="Your Phone" value={form.phone} onChange={v => setF('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
                <div>
                  <label className="block font-body text-xs font-semibold text-[#0A192F]/60 mb-1">Condition</label>
                  <select value={form.condition} onChange={e => setF('condition', e.target.value)}
                    className="w-full border border-[#0A192F]/10 rounded-xl px-3 py-2 font-body text-sm text-[#0A192F] focus:outline-none bg-white">
                    {['Brand New', 'Like New', 'Used', 'N/A'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <Field label="Main Photo URL" value={form.image_url} onChange={v => setF('image_url', v)} placeholder="https://..." />
                {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-28 rounded-xl object-cover border border-[#0A192F]/10" onError={e => e.target.style.display='none'} />}
              </div>
              <ArrayField label="More Photos (URLs)" value={form.extra_images} onChange={v => setF('extra_images', v)} placeholder="Paste photo URL and press Add" />
              <Field label="Description" value={form.description} onChange={v => setF('description', v)} type="textarea" placeholder="Describe your item..." />

              <div className="flex items-center gap-3">
                <input type="checkbox" id="item-active" checked={form.is_active} onChange={e => setF('is_active', e.target.checked)} className="w-4 h-4" />
                <label htmlFor="item-active" className="font-body text-sm text-[#0A192F]/70">Show publicly on marketplace</label>
              </div>

              <div className="flex gap-3">
                <button onClick={save}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
                  <Save className="w-4 h-4" /> Save Item
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-5 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body text-sm hover:bg-[#F8FAFC] transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#0A192F]/10 border-t-[#2563EB] rounded-full animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#0A192F]/5">
            <Package className="w-12 h-12 text-[#0A192F]/15 mx-auto mb-3" />
            <p className="font-heading font-bold text-[#0A192F]/40 mb-2">No items yet</p>
            <p className="font-body text-sm text-[#0A192F]/30 mb-5">Add your first product or listing to appear on the marketplace.</p>
            <button onClick={openAdd} className="px-6 py-2.5 bg-[#0A192F] text-white rounded-xl font-body font-semibold text-sm hover:bg-[#2563EB] transition-colors">
              Add First Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#0A192F]/5 p-4 flex items-center gap-4 flex-wrap shadow-sm">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" onError={e => e.target.style.display='none'} />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-[#0A192F]/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-[#0A192F]/20" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-heading font-bold text-sm text-[#0A192F]">{item.title}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 capitalize">{item.type}</span>
                    {!item.is_active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">Hidden</span>}
                  </div>
                  <p className="font-body text-xs text-[#0A192F]/50">{item.location} · {item.area} · {item.price_label || `₱${Number(item.price).toLocaleString()}`}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#0A192F]/10 transition-colors">
                    <Pencil className="w-4 h-4 text-[#2563EB]" />
                  </button>
                  <button onClick={() => remove(item.id)} className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-red-50 border border-[#0A192F]/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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