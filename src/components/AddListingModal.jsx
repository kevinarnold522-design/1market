import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { SUBCATEGORIES, JOBS_SUBCATEGORIES, RENT_SUBCATEGORIES, MAIN_CATEGORIES } from '../lib/listingCategories';

const LOCATIONS = [
  'Metro Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong',
  'Marikina', 'Caloocan', 'Manila', 'Cavite', 'Bacoor', 'Dasmariñas',
  'Laguna', 'Calamba', 'Sta. Rosa', 'Batangas', 'Batangas City',
  'Bulacan', 'Malolos', 'Pampanga', 'Angeles City', 'Rizal', 'Antipolo',
  'Cebu City', 'Davao City', 'Iloilo City', 'Cagayan de Oro',
  'General Santos', 'Baguio City', 'Tagaytay', 'Boracay', 'El Nido', 'Nationwide',
];

const TYPE_OPTIONS = [
  { value: 'jobs', label: 'Jobs', main: 'jobs' },
  { value: 'services', label: 'Services', main: 'services' },
  { value: 'rent_lease', label: 'For Rent / Lease', main: 'rent' },
  { value: 'hotel', label: 'Hotel / Accommodation', main: 'travel' },
  { value: 'flights', label: 'Flights', main: 'travel' },
  { value: 'vehicle_rental', label: 'Vehicle Rental', main: 'travel' },
  { value: 'food', label: 'Food', main: 'food' },
  { value: 'shoes', label: 'Shoes', main: 'buysell' },
  { value: 'cars', label: 'Cars & Vehicles', main: 'buysell' },
  { value: 'electronics', label: 'Electronics', main: 'buysell' },
  { value: 'clothing', label: 'Clothing & Fashion', main: 'buysell' },
  { value: 'furniture', label: 'Furniture', main: 'buysell' },
  { value: 'houses', label: 'Real Estate / Houses', main: 'buysell' },
  { value: 'product', label: 'General Products', main: 'buysell' },
  { value: 'mods', label: 'Mods & Customization', main: 'buysell' },
  { value: 'other', label: 'Other', main: 'buysell' },
];

const CONDITIONS = ['Brand New', 'Like New', 'Good as New', 'Lightly Used', 'Used', 'Heavily Used', 'N/A'];
const SPACE_TYPES = ['Condo', 'Dorm / Bedspace', 'Residential House', 'Commercial Space', 'Venue / Events', 'Office Space', 'Room for Rent', 'Apartment', 'Vehicle', 'Land', 'Other'];

export default function AddListingModal({ onClose, defaultType = '', user }) {
  const [form, setForm] = useState({
    title: '',
    type: defaultType,
    main_category: '',
    subcategory: '',
    price: '',
    price_label: '',
    location: '',
    area: '',
    description: '',
    image_url: '',
    phone: '',
    email_contact: '',
    apply_link: '',
    condition: 'N/A',
    seller_name: user?.full_name || '',
    space_type: '',
    hotel_rooms: [],
    is_active: true,
  });
  const [newRoom, setNewRoom] = useState({ name: '', price_per_night: '', description: '', amenities: '', available: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Auto-set main_category from type
    const found = TYPE_OPTIONS.find(t => t.value === form.type);
    if (found) setForm(f => ({ ...f, main_category: found.main, subcategory: '' }));
  }, [form.type]);

  const subcats = SUBCATEGORIES[form.type] || [];

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.type || !form.location) return;
    setSaving(true);
    await base44.entities.Listing.create({
      ...form,
      price: form.price ? Number(form.price) : undefined,
      price_label: form.price_label || (form.price ? `₱${Number(form.price).toLocaleString()}` : ''),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const isJobs = form.type === 'jobs';
  const isRent = form.type === 'rent_lease' || form.type === 'space_rent';
  const isServices = form.type === 'services';
  const isHotel = form.type === 'hotel';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[8000] flex items-start justify-center p-4 pt-8 overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl mb-8"
          style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10"
            style={{ background: 'linear-gradient(90deg,rgba(0,51,204,0.3),rgba(0,26,128,0.3))' }}>
            <div>
              <h2 className="font-heading font-bold text-white text-lg">Add New Listing</h2>
              <p className="font-body text-xs text-white/40">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {saved ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-green-400 rotate-45" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl">Listing Published!</h3>
              <p className="font-body text-white/50 text-sm mt-2">Your listing is now live.</p>
            </div>
          ) : (
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Listing Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. iPhone 15 Pro Max, 2BR Condo for Rent..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
              </div>

              {/* Category Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Category *</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#00D4FF]/50">
                    <option value="">Select category...</option>
                    {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                {subcats.length > 0 && (
                  <div>
                    <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Subcategory</label>
                    <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#00D4FF]/50">
                      <option value="">Select subcategory...</option>
                      {subcats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Space type for rent */}
              {isRent && (
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Space Type</label>
                  <select value={form.space_type} onChange={e => set('space_type', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#00D4FF]/50">
                    <option value="">Select space type...</option>
                    {SPACE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe your listing in detail..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50 resize-none" />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Price (₱)</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Price Label</label>
                  <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="e.g. ₱500/night, Negotiable"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Location *</label>
                  <select value={form.location} onChange={e => set('location', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#00D4FF]/50">
                    <option value="">Select location...</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Area / Barangay</label>
                  <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. BGC, Ortigas"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
              </div>

              {/* Condition (for buysell) */}
              {!isJobs && !isRent && !isServices && !isHotel && (
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Condition</label>
                  <select value={form.condition} onChange={e => set('condition', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#00D4FF]/50">
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {/* Jobs-specific */}
              {isJobs && (
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Apply Link (optional)</label>
                  <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
              )}

              {/* Hotel room management */}
              {isHotel && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.04)' }}>
                  <div className="px-4 py-3 border-b border-white/10" style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <p className="font-body font-bold text-white text-sm">🛏️ Room Types & Availability</p>
                    <p className="font-body text-[10px] text-white/40">Add the different rooms guests can choose from.</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {(form.hotel_rooms || []).map((room, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <p className="font-body font-bold text-xs text-white">{room.name}</p>
                          <p className="font-body text-[9px] text-[#00D4FF]">₱{Number(room.price_per_night).toLocaleString()}/night</p>
                          {room.amenities && <p className="font-body text-[9px] text-white/35">{room.amenities}</p>}
                        </div>
                        <button onClick={() => set('hotel_rooms', form.hotel_rooms.filter((_, j) => j !== i))}
                          className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-colors text-xs">✕</button>
                      </div>
                    ))}
                    <div className="space-y-2 pt-2 border-t border-white/8">
                      <p className="font-body text-[10px] text-white/40 font-bold uppercase tracking-wider">Add Room Type</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={newRoom.name} onChange={e => setNewRoom(r => ({ ...r, name: e.target.value }))} placeholder="Room name (e.g. Deluxe Suite)"
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                        <input type="number" value={newRoom.price_per_night} onChange={e => setNewRoom(r => ({ ...r, price_per_night: e.target.value }))} placeholder="₱ per night"
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                      </div>
                      <input value={newRoom.description} onChange={e => setNewRoom(r => ({ ...r, description: e.target.value }))} placeholder="Short description (optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                      <input value={newRoom.amenities} onChange={e => setNewRoom(r => ({ ...r, amenities: e.target.value }))} placeholder="Amenities (e.g. AC, WiFi, TV)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-body text-xs placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 font-body text-xs text-white/50">
                          <input type="checkbox" checked={newRoom.available} onChange={e => setNewRoom(r => ({ ...r, available: e.target.checked }))} className="accent-[#00D4FF]" />
                          Mark as Available
                        </label>
                        <button
                          onClick={() => {
                            if (!newRoom.name || !newRoom.price_per_night) return;
                            set('hotel_rooms', [...(form.hotel_rooms || []), { ...newRoom, price_per_night: Number(newRoom.price_per_night) }]);
                            setNewRoom({ name: '', price_per_night: '', description: '', amenities: '', available: true });
                          }}
                          className="px-3 py-1.5 rounded-lg font-body text-xs font-bold text-[#0A192F] transition-all"
                          style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                          + Add Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Phone / Viber</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+63..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Email</label>
                  <input value={form.email_contact} onChange={e => set('email_contact', e.target.value)} placeholder="contact@..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
                </div>
              </div>

              {/* Seller name */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Seller / Business Name</label>
                <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Your name or business"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#00D4FF]/50" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Listing Photo</label>
                {form.image_url ? (
                  <div className="relative">
                    <img src={form.image_url} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                    <button onClick={() => set('image_url', '')}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ border: '2px dashed rgba(255,255,255,0.12)' }}>
                    {uploading ? (
                      <div className="w-6 h-6 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-white/25" />
                    )}
                    <span className="font-body text-xs text-white/30">
                      {uploading ? 'Uploading...' : 'Upload photo'}
                    </span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleUpload} />
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm text-white/50 border border-white/10 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.title || !form.type || !form.location || saving}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                  {saving ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}