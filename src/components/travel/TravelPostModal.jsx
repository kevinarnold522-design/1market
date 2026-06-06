import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import HotelRoomManager from './HotelRoomManager';

const TRAVEL_TYPES = [
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'resort', label: '🌴 Resort' },
  { value: 'cruise', label: '🚢 Cruise' },
  { value: 'flight', label: '✈️ Flight' },
  { value: 'ferry_bus', label: '⛴️ Ferry & Bus' },
  { value: 'car_rental', label: '🚗 Car Rental' },
  { value: 'van_rental', label: '🚐 Van Rental' },
  { value: 'tour', label: '🗺️ Tour' },
  { value: 'island_hopping', label: '🏝️ Island Hopping' },
  { value: 'camping', label: '⛺ Camping' },
  { value: 'hiking', label: '🥾 Hiking' },
  { value: 'diving', label: '🤿 Diving' },
  { value: 'surfing', label: '🏄 Surfing' },
];

const ACTIVITY_TYPES = ['camping', 'hiking', 'diving', 'surfing', 'tour', 'island_hopping'];
const VEHICLE_TYPES = ['car_rental', 'van_rental', 'cruise', 'ferry_bus', 'flight'];

const DIFFICULTY = ['Beginner', 'Easy', 'Moderate', 'Challenging', 'Expert'];

export default function TravelPostModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: 'hotel', title: '', description: '', location: '', price: '', price_label: '',
    image_url: '', seller_name: user?.full_name || '', phone: '', email_contact: user?.email || '',
    subcategory: '', area: '',
    // Activity fields
    difficulty: '', duration: '', equipment: '',
    // Vehicle fields
    capacity: '', vehicle_type: '',
    // Hotel rooms
    hotel_rooms: [],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      update('image_url', file_url);
    } catch { } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await base44.entities.Listing.create({
        title: form.title,
        type: 'hotel',
        main_category: 'travel',
        subcategory: form.type,
        description: form.description,
        location: form.location,
        area: form.area,
        price: Number(form.price) || 0,
        price_label: form.price_label || (form.price ? `₱${Number(form.price).toLocaleString()}` : ''),
        image_url: form.image_url,
        seller_name: form.seller_name,
        phone: form.phone,
        email_contact: form.email_contact,
        is_active: true,
        approval_status: 'approved',
        hotel_rooms: form.hotel_rooms,
        // extras stored in description prefix
        specs: JSON.stringify({
          difficulty: form.difficulty,
          duration: form.duration,
          equipment: form.equipment,
          capacity: form.capacity,
          vehicle_type: form.vehicle_type,
        }),
      });
      onSuccess && onSuccess();
      onClose();
    } catch (e) {
      alert('Error saving listing: ' + e.message);
    } finally { setSaving(false); }
  };

  const isHotel = form.type === 'hotel' || form.type === 'resort';
  const isActivity = ACTIVITY_TYPES.includes(form.type);
  const isVehicle = VEHICLE_TYPES.includes(form.type);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#070F1A]/90 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#0A192F', border: '1px solid rgba(0,212,255,0.2)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/8"
          style={{ background: '#0A192F' }}>
          <div>
            <p className="font-heading font-bold text-white">Post Travel Listing</p>
            <p className="font-body text-xs text-white/40">Step {step} of {isHotel ? 3 : 2}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {step === 1 && (
            <>
              {/* Type selector */}
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Category</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TRAVEL_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => update('type', t.value)}
                      className="py-2.5 px-2 rounded-xl font-body text-xs font-semibold transition-all text-center"
                      style={form.type === t.value
                        ? { background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.5)', color: '#00D4FF' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic fields */}
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Bayleaf Hotel Cavite — Sea View Suite"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">City / Province *</label>
                  <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Cavite City"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                </div>
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Area / District</label>
                  <input value={form.area} onChange={e => update('area', e.target.value)} placeholder="e.g. Ortigas"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Base Price (₱)</label>
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                </div>
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Price Label</label>
                  <input value={form.price_label} onChange={e => update('price_label', e.target.value)} placeholder="e.g. From ₱3,500/night"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                  placeholder="Describe the listing..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20 resize-none" />
              </div>

              {/* Main thumbnail */}
              <div>
                <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Main Thumbnail</label>
                {form.image_url ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden">
                    <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => update('image_url', '')} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-[#00D4FF]/50 transition-colors">
                    <Upload className="w-5 h-5 text-white/30 mb-1" />
                    <span className="font-body text-xs text-white/30">{uploading ? 'Uploading...' : 'Upload thumbnail'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Activity-specific fields */}
              {isActivity && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Difficulty</label>
                    <select value={form.difficulty} onChange={e => update('difficulty', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                      <option value="" className="bg-[#0A192F]">Select...</option>
                      {DIFFICULTY.map(d => <option key={d} value={d} className="bg-[#0A192F]">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Duration</label>
                    <input value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="e.g. 4 hours"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Equipment Requirements</label>
                    <input value={form.equipment} onChange={e => update('equipment', e.target.value)} placeholder="e.g. Wetsuit, fins provided"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                  </div>
                </div>
              )}

              {/* Vehicle-specific fields */}
              {isVehicle && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Capacity / Seats</label>
                    <input type="number" value={form.capacity} onChange={e => update('capacity', e.target.value)} placeholder="e.g. 12"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                  </div>
                  <div>
                    <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Vehicle / Vessel Type</label>
                    <input value={form.vehicle_type} onChange={e => update('vehicle_type', e.target.value)} placeholder="e.g. Van, Ferry, Banca"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Contact Name</label>
                  <input value={form.seller_name} onChange={e => update('seller_name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Phone</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {isHotel ? (
                  <button type="button" onClick={() => setStep(2)} disabled={!form.title || !form.location}
                    className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105 disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#0033CC,#00D4FF)' }}>
                    Next: Add Rooms →
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={saving || !form.title || !form.location}
                    className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105 disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg,#0033CC,#00D4FF)' }}>
                    {saving ? 'Posting...' : 'Post Listing ✓'}
                  </button>
                )}
              </div>
            </>
          )}

          {step === 2 && isHotel && (
            <>
              <HotelRoomManager rooms={form.hotel_rooms} onChange={v => update('hotel_rooms', v)} />
              <div className="flex gap-2 justify-between">
                <button type="button" onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl font-body font-semibold text-sm text-white/60 border border-white/15 hover:border-white/30 transition-colors">
                  ← Back
                </button>
                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#00D4FF)' }}>
                  {saving ? 'Posting...' : 'Post Listing ✓'}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}