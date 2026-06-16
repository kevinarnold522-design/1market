import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Save, ChevronDown, ChevronUp, UtensilsCrossed, Hotel, Plane } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToR2 } from '@/lib/r2Upload';

// MenuManager — Food sellers get "Menu Items", Hotels get "Rooms", Travel gets "Packages"

const MENU_CONTEXT = {
  food:    { label: 'Menu',         itemLabel: 'Menu Item',  icon: UtensilsCrossed, color: '#f97316', placeholder: 'e.g. Adobo Meal, Sinigang, Iced Coffee...' },
  hotel:   { label: 'Room Types',   itemLabel: 'Room Type',  icon: Hotel,          color: '#0ea5e9', placeholder: 'e.g. Deluxe Room, Suite, Family Room...' },
  travel:  { label: 'Packages',     itemLabel: 'Package',    icon: Plane,          color: '#0ea5e9', placeholder: 'e.g. 3D2N Bohol Tour, Palawan Package...' },
};

const EMPTY_ITEM = {
  name: '', description: '', price: '', price_label: '',
  image_url: '', category: '', is_available: true, notes: '',
};

function MenuItemForm({ item, onSave, onCancel, context }) {
  const [form, setForm] = useState({ ...EMPTY_ITEM, ...item });
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadImg = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await uploadMediaFileToR2(file);
    set('image_url', file_url);
    setUploading(false); e.target.value = '';
  };

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]';

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="rounded-2xl p-4 space-y-3 mb-3"
      style={{ background: 'rgba(13,31,60,0.95)', border: `1.5px solid ${context.color}40` }}>
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm text-white">{item?.id ? `Edit ${context.itemLabel}` : `Add ${context.itemLabel}`}</h4>
        <button onClick={onCancel}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
      </div>

      {/* Image */}
      <div>
        {form.image_url ? (
          <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2">
            <img src={form.image_url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => set('image_url', '')} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center">
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/40 transition-colors mb-2">
            {uploading ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <><Upload className="w-4 h-4 text-white/30" /><span className="font-body text-xs text-white/30">Upload Photo from device</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={uploadImg} disabled={uploading} />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">{context.itemLabel} Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={context.placeholder} className={inputCls} />
        </div>
        <div>
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Price (₱)</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className={inputCls} />
        </div>
        <div>
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Price Display</label>
          <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="e.g. ₱120 / serving" className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Category / Type</label>
          <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Main Course, Drinks, Dessert..." className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
            placeholder="Describe this item in detail — ingredients, inclusions, size, etc."
            className={`${inputCls} resize-none`} />
        </div>
        <div className="col-span-2">
          <label className="block font-body text-[9px] text-white/40 uppercase tracking-wider mb-1">Notes (optional)</label>
          <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Halal, Spicy, Good for 2-3 pax..." className={inputCls} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => set('is_available', !form.is_available)}
          className={`w-8 h-4 rounded-full relative transition-colors flex-shrink-0 ${form.is_available ? 'bg-green-500' : 'bg-white/15'}`}>
          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${form.is_available ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
        <span className="font-body text-[10px] text-white/50">{form.is_available ? 'Available' : 'Unavailable / Out of Stock'}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onSave(form)} disabled={!form.name}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-colors"
          style={{ background: `${context.color}`, color: '#fff' }}>
          <Save className="w-3.5 h-3.5" /> Save {context.itemLabel}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-white/10 text-white/40 rounded-xl font-body text-xs hover:bg-white/5 transition-colors">Cancel</button>
      </div>
    </motion.div>
  );
}

export default function MenuManager({ listingId, listingType, ownerId, isAdmin = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [toast, setToast] = useState('');

  const context = MENU_CONTEXT[listingType] || MENU_CONTEXT.food;
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = async () => {
    const data = await base44.entities.MenuItem.filter({ listing_id: listingId }, 'category', 100);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { if (listingId) load(); }, [listingId]);

  const handleSave = async (form) => {
    if (!form.name) return;
    const data = {
      listing_id: listingId,
      name: form.name,
      description: form.description || '',
      price: Number(form.price) || 0,
      price_label: form.price_label || (form.price ? `₱${Number(form.price).toLocaleString()}` : ''),
      image_url: form.image_url || '',
      category: form.category || '',
      is_available: form.is_available !== false,
      notes: form.notes || '',
    };
    if (editing?.id) {
      await base44.entities.MenuItem.update(editing.id, data);
      showToast(`${context.itemLabel} updated!`);
    } else {
      await base44.entities.MenuItem.create(data);
      showToast(`${context.itemLabel} added!`);
    }
    setShowForm(false); setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${context.itemLabel}?`)) return;
    await base44.entities.MenuItem.delete(id);
    showToast('Deleted.'); load();
  };

  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const k = item.category || 'General';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

  const Icon = context.icon;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${context.color}25` }}>
      {/* Header */}
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-4 text-left"
        style={{ background: `${context.color}10` }}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: context.color }} />
          <h3 className="font-heading font-bold text-sm text-white">{context.label}</h3>
          <span className="px-2 py-0.5 rounded-full font-body text-[9px] font-bold" style={{ background: `${context.color}20`, color: context.color, border: `1px solid ${context.color}30` }}>
            {items.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); setEditing(null); setShowForm(true); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-body text-[10px] font-bold text-white transition-colors"
            style={{ background: context.color, boxShadow: `0 0 10px ${context.color}40` }}>
            <Plus className="w-3 h-3" /> Add
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="p-4">
              <AnimatePresence>
                {showForm && (
                  <MenuItemForm
                    item={editing}
                    context={context}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                  />
                )}
              </AnimatePresence>

              {loading ? (
                <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" /></div>
              ) : items.length === 0 && !showForm ? (
                <div className="text-center py-8">
                  <Icon className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: context.color }} />
                  <p className="font-body text-sm text-white/25">No {context.label.toLowerCase()} items yet.</p>
                  <button onClick={() => setShowForm(true)} className="mt-3 font-body text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    style={{ background: `${context.color}18`, color: context.color, border: `1px solid ${context.color}30` }}>
                    Add First {context.itemLabel}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([cat, catItems]) => (
                    <div key={cat}>
                      <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold mb-2 px-1">{cat}</p>
                      <div className="space-y-2">
                        {catItems.map(item => (
                          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.is_available ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`, opacity: item.is_available ? 1 : 0.6 }}>
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl" style={{ background: `${context.color}12` }}>
                                <Icon className="w-5 h-5 opacity-40" style={{ color: context.color }} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-body font-bold text-xs text-white truncate">{item.name}</p>
                                {!item.is_available && <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-body text-[8px] font-bold">Unavailable</span>}
                              </div>
                              {item.price_label && <p className="font-body text-[10px] font-bold" style={{ color: context.color }}>{item.price_label}</p>}
                              {item.description && <p className="font-body text-[9px] text-white/35 line-clamp-2 mt-0.5">{item.description}</p>}
                              {item.notes && <p className="font-body text-[9px] text-white/25 mt-0.5 italic">{item.notes}</p>}
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button onClick={() => { setEditing(item); setShowForm(true); }}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors">
                                <Pencil className="w-3.5 h-3.5 text-white/50" />
                              </button>
                              <button onClick={() => handleDelete(item.id)}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 transition-colors">
                                <Trash2 className="w-3 h-3 text-red-400" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-body text-xs text-white z-50"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}