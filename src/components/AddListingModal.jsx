import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOCATIONS = ['Manila', 'Cavite', 'Cebu', 'Davao', 'Nationwide'];

const TYPE_OPTIONS = [
  { value: 'services', label: 'Service' },
  { value: 'rent_lease', label: 'For Rent / Lease' },
  { value: 'product', label: 'Product' },
  { value: 'jobs', label: 'Job Posting' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'cars', label: 'Cars / Vehicles' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' },
];

export default function AddListingModal({ onClose, defaultType = 'product', user }) {
  const [form, setForm] = useState({
    title: '',
    type: defaultType,
    subcategory: '',
    location: 'Manila',
    area: '',
    price: '',
    price_label: '',
    description: '',
    image_url: '',
    phone: user?.phone || '',
    seller_name: user?.full_name || '',
    email_contact: user?.email || '',
    apply_link: '',
    condition: 'Brand New',
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    setSubmitting(true);
    await base44.entities.Listing.create({
      ...form,
      price: Number(form.price) || 0,
      approval_status: form.type === 'jobs' ? 'pending' : 'approved',
      main_category: form.type === 'jobs' ? 'jobs' : form.type === 'rent_lease' ? 'rent' : form.type === 'services' ? 'services' : 'buysell',
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070F1A]/85 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <h2 className="font-heading font-bold text-white text-base">Add New Listing</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {done ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <p className="font-heading font-bold text-white text-lg mb-1">Listing Submitted!</p>
              <p className="font-body text-sm text-white/50">{form.type === 'jobs' ? 'Pending admin approval.' : 'Your listing is now live.'}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-5 space-y-4">
            {/* Image */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Photo</label>
              {form.image_url ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/40 transition-colors">
                  {uploading ? <div className="w-5 h-5 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <><Upload className="w-5 h-5 text-white/25 mb-1" /><span className="font-body text-xs text-white/25">Upload Image</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. AC Cleaning Service" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
            </div>

            {/* Type & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Category</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value} className="bg-[#0D1F3C]">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Location</label>
                <select value={form.location} onChange={e => set('location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                </select>
              </div>
            </div>

            {/* Area & Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Area / District</label>
                <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. BGC, Bacoor" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Subcategory</label>
                <input value={form.subcategory} onChange={e => set('subcategory', e.target.value)} placeholder="e.g. Cleaning, SEO" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Price (₱)</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Price Display</label>
                <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="₱500/hr" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe your listing..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none" />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Contact #</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+63 9xx" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Your Name</label>
                <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Name / Business" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            </div>

            {/* Apply link for jobs */}
            {form.type === 'jobs' && (
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Application Link (optional)</label>
                <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={!form.title || submitting}
              className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              {submitting ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span> : 'Submit Listing'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}