import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import SmartImage from '@/components/media/SmartImage';

// ─── Constants ────────────────────────────────────────────────────────────────
const SECTIONS = ['food', 'travel', 'buysell'];
const BIZ_TYPES = ['chain', 'carinderia', 'home-kitchen', 'home-baker', 'coffee', 'hotel', 'vehicle-rental', 'shop', 'service'];
const LISTING_TYPES = ['shoes', 'cars', 'houses', 'services', 'product', 'electronics', 'clothing', 'furniture', 'food', 'other'];
const SUBCATS = {
  electronics: ['Smartphones','Laptops','Tablets','Cameras','Audio','Gaming','TV & Displays','Accessories'],
  shoes: ['Sneakers','Formal','Sandals','Boots','Sports','Kids'],
  clothing: ["Men's Tops","Women's Tops",'Bottoms','Outerwear','Activewear','Kids'],
  cars: ['Sedan','SUV','Van','Pickup','Motorcycle','Truck'],
  houses: ['House & Lot','Condominium','Townhouse','Vacant Lot','Commercial'],
  services: ['Home Services','Tech & Digital','Beauty & Wellness','Events','Transport','Professional'],
  furniture: ['Living Room','Bedroom','Office','Outdoor','Kitchen'],
  food: ['Baked Goods','Meals','Beverages','Snacks','Ingredients'],
  product: ['General','Health & Beauty','Sports','Toys','Books','Tools'],
  other: ['Miscellaneous'],
};
const LOCATIONS = ['Manila', 'Cavite', 'Cebu', 'Davao', 'Nationwide'];
const CONDITIONS = ['Brand New', 'Like New', 'Used', 'N/A'];

const EMPTY_BIZ = {
  name: '', category: '', type: 'carinderia', section: 'food',
  location: 'Manila', area: '', address: '', hours: '', tag: '',
  logo_url: '', image_url: '', extra_images: [], menu: [],
  phone: '', description: '', is_active: true,
};
const EMPTY_LISTING = {
  title: '', type: 'product', subcategory: '', location: 'Manila', area: '',
  seller_name: '', approved_channel_name: '', phone: '', description: '', image_url: '',
  extra_images: [], price: '', price_label: '', condition: 'Brand New',
  brand: '', model: '', size: '', warranty: '', specs: '', is_active: true,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {type === 'textarea'
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-16 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
        : <input type={type === 'number' ? 'number' : 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
      }
    </div>
  );
}

function Sel({ label, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-[#0D1F3C] focus:outline-none focus:border-[#00D4FF]">
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return <option key={val} value={val} className="bg-[#0D1F3C]">{lbl}</option>;
        })}
      </select>
    </div>
  );
}

function ImgUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadMediaFileToSupabase(file);
      onChange(file_url);
    } catch {
      // Toast is shown by the uploader.
    } finally {
      setUploading(false); e.target.value = '';
    }
  };
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">{label}</label>
      {value && (
        <div className="relative inline-block mb-2">
          <SmartImage src={value} alt={label} className="h-20 w-28 rounded-xl border border-white/10" />
          <button onClick={() => onChange('')} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">AI</button>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
      <button onClick={() => ref.current?.click()} disabled={uploading}
        className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-[#00D4FF]/30 hover:border-[#00D4FF]/70 rounded-xl text-[#00D4FF] font-body text-xs font-semibold transition-colors disabled:opacity-50 w-full justify-center">
        {uploading ? <><div className="w-3 h-3 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> Uploading...</> : <><Upload className="w-3 h-3" /> Upload from Device</>}
      </button>
    </div>
  );
}

function MultiImgUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);
  const handle = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadMediaFileToSupabase(f).then(r => r.file_url)));
      onChange([...(value || []), ...urls]);
    } catch {
      // Toast is shown by the uploader.
    } finally {
      setUploading(false); e.target.value = '';
    }
  };
  return (
    <div>
      <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {(value || []).map((url, i) => (
          <div key={i} className="relative">
            <SmartImage src={url} alt={`Additional photo ${i + 1}`} className="w-14 h-14 rounded-xl border border-white/10" />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">AI</button>
          </div>
        ))}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handle} />
      <button onClick={() => ref.current?.click()} disabled={uploading}
        className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-white/15 hover:border-[#00D4FF]/40 rounded-xl text-white/40 font-body text-xs font-semibold transition-colors disabled:opacity-50 w-full justify-center">
        {uploading ? <><div className="w-3 h-3 border border-white/20 border-t-[#00D4FF] rounded-full animate-spin" /> Uploading...</> : <><Upload className="w-3 h-3" /> Add More Photos</>}
      </button>
    </div>
  );
}

// ─── Business sub-form ────────────────────────────────────────────────────────
function BusinessSubForm({ form, set }) {
  const [menuInput, setMenuInput] = useState('');
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Business Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Jollibee – Bacoor" required /></div>
        <Sel label="Section" value={form.section} onChange={v => set('section', v)} options={SECTIONS} required />
        <Sel label="Type" value={form.type} onChange={v => set('type', v)} options={BIZ_TYPES} />
        <Sel label="Location" value={form.location} onChange={v => set('location', v)} options={LOCATIONS} required />
        <Field label="Area" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <Field label="Category" value={form.category} onChange={v => set('category', v)} placeholder="e.g. Fast Food" />
        <Field label="Hours" value={form.hours} onChange={v => set('hours', v)} placeholder="6:00 AM – 10:00 PM" />
        <Field label="Tag / Badge" value={form.tag} onChange={v => set('tag', v)} placeholder="e.g. Open Now" />
        <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx-xxx-xxxx" />
      </div>
      <Field label="Address" value={form.address} onChange={v => set('address', v)} placeholder="Full address..." />
      <Field label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" placeholder="Short business description..." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ImgUpload label="Logo" value={form.logo_url} onChange={v => set('logo_url', v)} />
        <ImgUpload label="Main Photo" value={form.image_url} onChange={v => set('image_url', v)} />
      </div>
      <MultiImgUpload label="Additional Photos" value={form.extra_images} onChange={v => set('extra_images', v)} />
      <div>
        <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Menu Items</label>
        <div className="flex gap-2 mb-1">
          <input value={menuInput} onChange={e => setMenuInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && menuInput.trim()) { set('menu', [...(form.menu||[]), menuInput.trim()]); setMenuInput(''); } }}
            placeholder="e.g. Chickenjoy"
            className="flex-1 border border-white/10 rounded-xl px-3 py-1.5 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
          <button onClick={() => { if (menuInput.trim()) { set('menu', [...(form.menu||[]), menuInput.trim()]); setMenuInput(''); } }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white/60 font-body text-xs font-semibold transition-colors">Add</button>
        </div>
        <div className="flex flex-wrap gap-1">
          {(form.menu||[]).map((item, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/60">
              {item} <button onClick={() => set('menu', form.menu.filter((_, j) => j !== i))}><X className="w-2.5 h-2.5 text-red-400" /></button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="biz-active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
        <label htmlFor="biz-active" className="font-body text-xs text-white/40">Active / Visible on site</label>
      </div>
    </div>
  );
}

// ─── Listing sub-form ─────────────────────────────────────────────────────────
function ListingSubForm({ form, set }) {
  const subcatOpts = SUBCATS[form.type] || ['General'];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Title" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Nike Air Force 1 Low" required /></div>
        <Sel label="Category" value={form.type} onChange={v => { set('type', v); set('subcategory', ''); }} options={LISTING_TYPES} required />
        <div>
          <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">Subcategory</label>
          <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
            className="w-full border border-white/10 rounded-xl px-2.5 py-2 font-body text-xs text-white bg-[#0D1F3C] focus:outline-none focus:border-[#00D4FF]">
            <option value="" className="bg-[#0D1F3C]">— Select —</option>
            {subcatOpts.map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
          </select>
        </div>
        <Sel label="Location" value={form.location} onChange={v => set('location', v)} options={LOCATIONS} required />
        <Field label="Area" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Bacoor" />
        <Field label="Price (₱)" value={form.price} onChange={v => set('price', v)} type="number" placeholder="0" />
        <Field label="Price Display" value={form.price_label} onChange={v => set('price_label', v)} placeholder="₱3,500 neg" />
        <Sel label="Condition" value={form.condition} onChange={v => set('condition', v)} options={CONDITIONS} />
        <Field label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="e.g. Samsung" />
        <Field label="Model / Size" value={form.model} onChange={v => set('model', v)} placeholder="256GB" />
        <Field label="Contact #" value={form.phone} onChange={v => set('phone', v)} placeholder="+63 9xx" />
        <Field label="Seller Name (internal)" value={form.seller_name} onChange={v => set('seller_name', v)} placeholder="Direct Owner" />
        <div className="col-span-2">
          <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <p className="font-body text-[9px] text-[#00D4FF] font-bold uppercase tracking-wider">AI Admin: Approved Channel Name</p>
            <Field label="Approved Public Channel Name" value={form.approved_channel_name || ''} onChange={v => set('approved_channel_name', v)} placeholder="e.g. Juan's Store PH, CleanPro Services — approved by admin" />
            <p className="font-body text-[9px] text-white/30">This name overrides the seller's self-entered name and is displayed publicly on all listings.</p>
          </div>
        </div>
      </div>
      {form.type === 'electronics' && (
        <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <p className="font-body text-[10px] text-[#00D4FF] font-semibold">AI Electronics — Warranty & Specs Required</p>
          <Field label="Warranty" value={form.warranty} onChange={v => set('warranty', v)} placeholder="1 Year PH Warranty" required />
          <Field label="Full Specifications" value={form.specs} onChange={v => set('specs', v)} type="textarea" placeholder="Specs..." required />
        </div>
      )}
      <Field label="Description" value={form.description} onChange={v => set('description', v)} type="textarea" placeholder="Describe the item..." />
      <ImgUpload label="Main Image" value={form.image_url} onChange={v => set('image_url', v)} />
      <MultiImgUpload label="Additional Photos" value={form.extra_images} onChange={v => set('extra_images', v)} />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="list-active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
        <label htmlFor="list-active" className="font-body text-xs text-white/40">Publish publicly</label>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function QuickAddModal({ onClose, defaultMode = 'business', onAdded, isAdmin = false, isSeller = false, sellerEmail = '', sellerName = '', forceSection, forceSubcategory }) {
  // Sellers can only add listings, not businesses (unless also admin)
  const [mode, setMode] = useState(isAdmin ? defaultMode : 'listing');
  const [bizForm, setBizForm] = useState({ ...EMPTY_BIZ, ...(forceSection ? { section: forceSection } : {}) });
  const [listForm, setListForm] = useState({
    ...EMPTY_LISTING,
    seller_email: sellerEmail || '',
    seller_name: sellerName || '',
    ...(forceSubcategory ? { subcategory: forceSubcategory } : {}),
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const setBiz = (field, val) => setBizForm(f => ({ ...f, [field]: val }));
  const setList = (field, val) => setListForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (mode === 'business') {
      if (!bizForm.name) return setToast('Business name is required');
      setSaving(true);
      await base44.entities.Business.create({ ...bizForm, menu: bizForm.menu || [], extra_images: bizForm.extra_images || [] });
      setSaving(false);
      setToast('Business added!');
      setTimeout(() => { if (onAdded) onAdded('business'); onClose(); }, 900);
    } else {
      if (!listForm.title) return setToast('Listing title is required');
      setSaving(true);
      const payload = {
        ...listForm,
        price: Number(listForm.price) || 0,
        extra_images: listForm.extra_images || [],
        seller_email: sellerEmail || listForm.seller_email || '',
        seller_name: sellerName || listForm.seller_name || '',
      };
      await base44.entities.Listing.create(payload);
      setSaving(false);
      setToast('Listing published!');
      setTimeout(() => { if (onAdded) onAdded('listing'); onClose(); }, 900);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center sm:p-4 bg-[#070F1A]/90 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.25)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-4 border-b border-white/10 flex items-center justify-between" style={{ background: '#0D1F3C' }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00D4FF] flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-[#0A192F]" />
            </span>
            <h3 className="font-heading font-bold text-white text-sm">Quick Add</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-5 pt-4 pb-2 flex gap-2">
          {['business', 'listing'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl font-body font-semibold text-xs capitalize transition-all ${mode === m ? 'bg-[#2563EB] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'}`}>
              {m === 'business' ? 'AI New Business' : 'AI️ New Listing'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-5 py-4">
          {mode === 'business'
            ? <BusinessSubForm form={bizForm} set={setBiz} />
            : <ListingSubForm form={listForm} set={setList} />
          }
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-5 py-4 border-t border-white/10 flex gap-2" style={{ background: '#0D1F3C' }}>
          {toast && <p className="flex-1 font-body text-xs text-[#00D4FF] flex items-center">{toast}</p>}
          {!toast && <div className="flex-1" />}
          <button onClick={onClose} className="px-4 py-2.5 border border-white/10 text-white/40 rounded-xl font-body text-xs hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {mode === 'business' ? 'Save Business' : 'Publish Listing'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}