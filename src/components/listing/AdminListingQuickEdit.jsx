import React, { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminListingQuickEdit({ listing, onSaved }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: listing?.title || '',
    price: listing?.price || '',
    price_label: listing?.price_label || '',
    location: listing?.location || '',
    area: listing?.area || '',
    seller_name: listing?.seller_name || '',
    phone: listing?.phone || '',
    email_contact: listing?.email_contact || '',
    description: listing?.description || '',
    approval_status: listing?.approval_status || 'pending',
    is_active: listing?.is_active !== false,
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const patch = { ...form, price: Number(form.price) || 0 };
    const res = await base44.functions.invoke('supabasebase', { entity: 'Listing', action: 'update', id: listing.id, patch });
    const updated = res.data?.data || { ...listing, ...patch };
    onSaved?.(updated);
    setSaving(false);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-body font-bold text-xs text-[#0A192F] bg-[#FFD700] hover:bg-white transition-colors shadow-lg">
        <Pencil className="w-3.5 h-3.5" /> Admin Edit
      </button>
      {open && (
        <div className="fixed inset-0 z-[700] flex items-end sm:items-center justify-center bg-[#070F1A]/85 backdrop-blur-sm sm:p-4" onClick={() => setOpen(false)}>
          <div className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-5 space-y-3" style={{ background: '#0D1F3C', border: '1px solid rgba(255,215,0,0.35)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-bold text-white">Admin Edit Listing</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Title" className="sm:col-span-2 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="Price" type="number" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="Price label" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Location" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="Area" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Seller name" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone" className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <input value={form.email_contact} onChange={e => set('email_contact', e.target.value)} placeholder="Email contact" className="sm:col-span-2 bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm" />
              <select value={form.approval_status} onChange={e => set('approval_status', e.target.value)} className="bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => set('is_active', !form.is_active)} className={`rounded-xl px-3 py-2 font-body text-sm font-bold ${form.is_active ? 'bg-green-500/20 text-green-300 border border-green-500/35' : 'bg-red-500/20 text-red-300 border border-red-500/35'}`}>{form.is_active ? 'Active' : 'Hidden'}</button>
            </div>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description" rows={5} className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white font-body text-sm resize-none" />
            <button onClick={save} disabled={saving || !form.title} className="w-full py-3 rounded-xl bg-[#FFD700] text-[#0A192F] font-body font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Admin Changes'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}