import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star, MapPin, Clock, Users, Wifi, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToR2 } from '@/lib/r2Upload';
import HotelRoomManager from './HotelRoomManager';

const TRAVEL_TYPES = [
  { value: 'hotel',          label: '🏨 Hotel' },
  { value: 'resort',         label: '🌴 Resort' },
  { value: 'cruise',         label: '🚢 Cruise' },
  { value: 'flight',         label: '✈️ Flight' },
  { value: 'ferry_bus',      label: '⛴️ Ferry & Bus' },
  { value: 'car_rental',     label: '🚗 Car Rental' },
  { value: 'van_rental',     label: '🚐 Van Rental' },
  { value: 'tour',           label: '🗺️ Tour' },
  { value: 'island_hopping', label: '🏝️ Island Hopping' },
  { value: 'camping',        label: '⛺ Camping' },
  { value: 'hiking',         label: '🥾 Hiking' },
  { value: 'diving',         label: '🤿 Diving' },
  { value: 'surfing',        label: '🏄 Surfing' },
];

const ACTIVITY_TYPES = ['camping', 'hiking', 'diving', 'surfing', 'tour', 'island_hopping'];
const VEHICLE_TYPES = ['car_rental', 'van_rental', 'cruise', 'ferry_bus', 'flight'];
const DIFFICULTY = ['Beginner', 'Easy', 'Moderate', 'Challenging', 'Expert'];

const inp = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20';
const lbl = 'font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block';

// ─── Live Hotel Preview ───────────────────────────────────────────────────────
function HotelPreview({ form }) {
  const [activeRoom, setActiveRoom] = useState(0);
  const room = form.hotel_rooms?.[activeRoom];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0A192F', border: '1px solid rgba(0,212,255,0.15)' }}>
      {/* Preview header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/8" style={{ background: '#071326' }}>
        <Eye className="w-3.5 h-3.5 text-[#00D4FF]" />
        <span className="font-body text-[10px] text-[#00D4FF] font-bold uppercase tracking-wider">Live Preview</span>
        <span className="ml-auto font-body text-[9px] text-white/30">As customers will see it</span>
      </div>

      {/* Main image */}
      <div className="relative h-40 bg-white/5 flex items-center justify-center">
        {form.image_url
          ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
          : <div className="text-center"><span className="text-3xl">🏨</span><p className="font-body text-xs text-white/20 mt-1">Upload a thumbnail</p></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-heading font-bold text-white text-sm leading-tight">{form.title || 'Hotel Name'}</h3>
          <div className="flex items-center gap-2 mt-1">
            {form.location && (
              <span className="flex items-center gap-1 font-body text-[10px] text-white/60">
                <MapPin className="w-2.5 h-2.5" />{form.location}{form.area ? `, ${form.area}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1 font-body text-[10px] text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400" />4.8
            </span>
          </div>
        </div>
      </div>

      {/* Price strip */}
      {(form.price || form.price_label) && (
        <div className="px-4 py-2 border-b border-white/8 flex items-center justify-between">
          <span className="font-body text-[10px] text-white/40">Starting from</span>
          <span className="font-heading font-bold text-amber-400 text-sm">{form.price_label || `₱${Number(form.price).toLocaleString()}/night`}</span>
        </div>
      )}

      {/* Rooms */}
      {form.hotel_rooms?.length > 0 && (
        <div className="p-3">
          <p className="font-body text-[9px] text-white/30 uppercase tracking-wider mb-2">Rooms</p>
          {/* Room tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {form.hotel_rooms.map((r, i) => (
              <button key={i} onClick={() => setActiveRoom(i)}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg font-body text-[10px] font-semibold transition-all"
                style={activeRoom === i
                  ? { background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.5)', color: '#00D4FF' }
                  : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                {r.name || `Room ${i + 1}`}
              </button>
            ))}
          </div>

          {room && (
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Room images */}
              {room.images?.length > 0 && (
                <img src={room.images[0]} alt="" className="w-full h-24 object-cover" />
              )}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-heading font-bold text-xs text-white">{room.name || 'Room'}</p>
                  {room.price_per_night && (
                    <p className="font-heading font-bold text-xs text-amber-400">₱{Number(room.price_per_night).toLocaleString()}/night</p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/40 font-body">
                  {room.max_guests && <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{room.max_guests} guests</span>}
                  {room.check_in_time && <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />In {room.check_in_time}</span>}
                  {room.check_out_time && <span>Out {room.check_out_time}</span>}
                </div>
                {room.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 5).map(a => (
                      <span key={a} className="px-1.5 py-0.5 rounded-full font-body text-[9px] text-white/50" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{a}</span>
                    ))}
                    {room.amenities.length > 5 && <span className="font-body text-[9px] text-white/30">+{room.amenities.length - 5} more</span>}
                  </div>
                )}
                {room.blocked_dates?.length > 0 && (
                  <p className="font-body text-[9px] text-red-400">{room.blocked_dates.length} dates blocked</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {(!form.hotel_rooms || form.hotel_rooms.length === 0) && (
        <div className="p-4 text-center">
          <p className="font-body text-[10px] text-white/20">Add rooms to see them previewed here</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function TravelPostModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    type: 'hotel', title: '', description: '', location: '', price: '', price_label: '',
    image_url: '', seller_name: user?.full_name || '', phone: '', email_contact: user?.email || '',
    subcategory: '', area: '',
    difficulty: '', duration: '', equipment: '',
    capacity: '', vehicle_type: '',
    hotel_rooms: [],
    hotel_check_in_time: '14:00',
    hotel_check_out_time: '12:00',
    hotel_min_nights: 1,
    hotel_max_guests: 2,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadMediaFileToR2(file);
      update('image_url', file_url);
    } catch { } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Derive hotel-level check-in/out from first room if set
      const firstRoom = form.hotel_rooms?.[0];
      const checkInTime = firstRoom?.check_in_time || form.hotel_check_in_time || '14:00';
      const checkOutTime = firstRoom?.check_out_time || form.hotel_check_out_time || '12:00';
      const totalRooms = form.hotel_rooms?.length || 0;

      await base44.entities.Listing.create({
        title: form.title,
        type: 'hotel',
        main_category: 'travel',
        subcategory: form.type,
        description: form.description,
        location: form.location,
        area: form.area,
        price: Number(form.price) || 0,
        price_label: form.price_label || (form.price ? `₱${Number(form.price).toLocaleString()}/night` : ''),
        image_url: form.image_url,
        seller_name: form.seller_name,
        phone: form.phone,
        email_contact: form.email_contact,
        is_active: true,
        approval_status: 'approved',
        hotel_rooms: form.hotel_rooms,
        hotel_check_in_time: checkInTime,
        hotel_check_out_time: checkOutTime,
        hotel_total_rooms: totalRooms,
        hotel_available_rooms: totalRooms,
        hotel_min_nights: form.hotel_min_nights || 1,
        hotel_max_guests: form.hotel_max_guests || (firstRoom?.max_guests ? Number(firstRoom.max_guests) : 2),
        // Collect all blocked dates across rooms
        hotel_unavailable_dates: [...new Set((form.hotel_rooms || []).flatMap(r => r.blocked_dates || []))],
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
  const totalSteps = isHotel ? 3 : 2;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 bg-[#070F1A]/90 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#0A192F', border: '1px solid rgba(0,212,255,0.2)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/8" style={{ background: '#0A192F' }}>
          <div>
            <p className="font-heading font-bold text-white">Post Travel Listing</p>
            <p className="font-body text-xs text-white/40">Step {step} of {totalSteps}</p>
          </div>
          <div className="flex items-center gap-2">
            {isHotel && step === 2 && (
              <button onClick={() => setShowPreview(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-semibold transition-all"
                style={showPreview
                  ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00D4FF' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
                <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Hide' : 'Preview'}
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex gap-1 px-6 pt-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: i < step ? '#00D4FF' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        {/* Body */}
        <div className={`p-6 ${isHotel && step === 2 && showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}`}>
          {/* ── STEP 1: Basic info ── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Type selector */}
              <div>
                <label className={lbl}>Category</label>
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

              <div>
                <label className={lbl}>Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g. Bayleaf Hotel Cavite — Sea View Suite" className={inp} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>City / Province *</label>
                  <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Cavite City" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Area / District</label>
                  <input value={form.area} onChange={e => update('area', e.target.value)} placeholder="e.g. Ortigas" className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Base Price (₱)</label>
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Price Label</label>
                  <input value={form.price_label} onChange={e => update('price_label', e.target.value)} placeholder="e.g. From ₱3,500/night" className={inp} />
                </div>
              </div>

              <div>
                <label className={lbl}>Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                  placeholder="Describe the listing..." className={`${inp} resize-none`} />
              </div>

              {/* Thumbnail */}
              <div>
                <label className={lbl}>Main Thumbnail</label>
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
                    <label className={lbl}>Difficulty</label>
                    <select value={form.difficulty} onChange={e => update('difficulty', e.target.value)} className={inp}>
                      <option value="" className="bg-[#0A192F]">Select...</option>
                      {DIFFICULTY.map(d => <option key={d} value={d} className="bg-[#0A192F]">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Duration</label>
                    <input value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="e.g. 4 hours" className={inp} />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Equipment Requirements</label>
                    <input value={form.equipment} onChange={e => update('equipment', e.target.value)} placeholder="e.g. Wetsuit, fins provided" className={inp} />
                  </div>
                </div>
              )}

              {/* Vehicle-specific fields */}
              {isVehicle && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Capacity / Seats</label>
                    <input type="number" value={form.capacity} onChange={e => update('capacity', e.target.value)} placeholder="e.g. 12" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Vehicle / Vessel Type</label>
                    <input value={form.vehicle_type} onChange={e => update('vehicle_type', e.target.value)} placeholder="e.g. Van, Ferry, Banca" className={inp} />
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Contact Name</label>
                  <input value={form.seller_name} onChange={e => update('seller_name', e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)} className={inp} />
                </div>
              </div>

              <div className="flex justify-end">
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
            </div>
          )}

          {/* ── STEP 2: Rooms (hotel) with optional preview ── */}
          {step === 2 && isHotel && (
            <>
              {/* Room manager col */}
              <div className="space-y-4">
                {/* Hotel-level check-in/out & policy */}
                <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <p className="font-body text-[10px] text-[#00D4FF] uppercase tracking-wider font-bold">Hotel Policies</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Default Check-in Time</label>
                      <input type="time" value={form.hotel_check_in_time} onChange={e => update('hotel_check_in_time', e.target.value)}
                        className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Default Check-out Time</label>
                      <input type="time" value={form.hotel_check_out_time} onChange={e => update('hotel_check_out_time', e.target.value)}
                        className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Min Nights Stay</label>
                      <input type="number" min="1" value={form.hotel_min_nights} onChange={e => update('hotel_min_nights', Number(e.target.value))}
                        className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Max Guests (hotel-wide)</label>
                      <input type="number" min="1" value={form.hotel_max_guests} onChange={e => update('hotel_max_guests', Number(e.target.value))}
                        className={inp} />
                    </div>
                  </div>
                </div>
                <HotelRoomManager rooms={form.hotel_rooms} onChange={v => update('hotel_rooms', v)} />
                <div className="flex gap-2 justify-between pt-2">
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
              </div>

              {/* Preview col */}
              {showPreview && (
                <div className="lg:sticky lg:top-4">
                  <HotelPreview form={form} />
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}