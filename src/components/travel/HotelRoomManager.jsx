import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Calendar, Clock, Image, Video, ChevronDown, ChevronUp, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';

const TRANSITIONS = ['Fade', 'Horizontal Slide', 'Zoom', 'Flip'];
const AMENITIES_LIST = ['AC', 'WiFi', 'TV', 'Hot Water', 'Mini Bar', 'Balcony', 'Sea View', 'Bathtub', 'King Bed', 'Twin Beds', 'Safe Box', 'Hair Dryer', 'Coffee Maker', 'Room Service'];

function AmenityPicker({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {AMENITIES_LIST.map(a => (
        <button key={a} type="button"
          onClick={() => onChange(selected.includes(a) ? selected.filter(x => x !== a) : [...selected, a])}
          className="px-2.5 py-1 rounded-full font-body text-[10px] font-semibold transition-all"
          style={selected.includes(a)
            ? { background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.5)', color: '#00D4FF' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
          {a}
        </button>
      ))}
    </div>
  );
}

function CalendarBlocker({ blockedDates, onToggle }) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div>
      <p className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2">Block Unavailable Dates (next 30 days)</p>
      <div className="flex flex-wrap gap-1.5">
        {days.map(d => {
          const isBlocked = blockedDates.includes(d);
          const label = new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
          return (
            <button key={d} type="button" onClick={() => onToggle(d)}
              className="px-2 py-1 rounded-lg font-body text-[9px] font-bold transition-all"
              style={isBlocked
                ? { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
              {isBlocked ? '' : ''} {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoomCard({ room, index, onChange, onDelete }) {
  const [collapsed, setCollapsed] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (field, val) => onChange({ ...room, [field]: val });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadMediaFileToSupabase(f).then(r => r.file_url)));
      update('images', [...(room.images || []), ...urls]);
    } catch { } finally { setUploading(false); }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadMediaFileToSupabase(file);
      update('video_url', file_url);
    } catch { } finally { setUploading(false); }
  };

  const toggleDate = (d) => {
    const dates = room.blocked_dates || [];
    update('blocked_dates', dates.includes(d) ? dates.filter(x => x !== d) : [...dates, d]);
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.15)' }}>
      {/* Room header */}
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setCollapsed(c => !c)}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#00D4FF]/15 flex items-center justify-center">
            <span className="font-heading font-bold text-xs text-[#00D4FF]">{index + 1}</span>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-white">{room.name || `Room ${index + 1}`}</p>
            <p className="font-body text-[10px] text-white/40">{room.price_per_night ? `₱${Number(room.price_per_night).toLocaleString()}/night` : 'No price set'} · {room.max_guests || '?'} guests</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onDelete(); }}
            className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20">
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
          {collapsed ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronUp className="w-4 h-4 text-white/40" />}
        </div>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Room Name / Type</label>
              <input value={room.name || ''} onChange={e => update('name', e.target.value)}
                placeholder="e.g. Deluxe Suite"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
            </div>
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Price per Night (₱)</label>
              <input type="number" value={room.price_per_night || ''} onChange={e => update('price_per_night', e.target.value)}
                placeholder="e.g. 3500"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
            </div>
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Max Guests</label>
              <input type="number" value={room.max_guests || ''} onChange={e => update('max_guests', e.target.value)}
                placeholder="e.g. 2"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF] placeholder-white/20" />
            </div>
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Gallery Transition</label>
              <select value={room.transition || 'Fade'} onChange={e => update('transition', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                {TRANSITIONS.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Check-in Time</label>
              <input type="time" value={room.check_in_time || '14:00'} onChange={e => update('check_in_time', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
            </div>
            <div>
              <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Check-out Time</label>
              <input type="time" value={room.check_out_time || '12:00'} onChange={e => update('check_out_time', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Amenities</label>
            <AmenityPicker selected={room.amenities || []} onChange={v => update('amenities', v)} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Room Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(room.images || []).map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update('images', (room.images || []).filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#00D4FF]/50 transition-colors">
                <Image className="w-4 h-4 text-white/30" />
                <span className="font-body text-[8px] text-white/30 mt-0.5">Add</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Room Video Preview</label>
            {room.video_url ? (
              <div className="flex items-center gap-2">
                <video src={room.video_url} className="w-24 h-16 rounded-lg object-cover" />
                <button type="button" onClick={() => update('video_url', '')}
                  className="text-red-400 font-body text-xs hover:text-red-300">Remove</button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-[#00D4FF]/50 transition-colors w-fit">
                <Video className="w-4 h-4 text-white/30" />
                <span className="font-body text-xs text-white/40">Upload Video</span>
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </label>
            )}
          </div>

          {/* Calendar blocker */}
          <CalendarBlocker blockedDates={room.blocked_dates || []} onToggle={toggleDate} />

          {uploading && <p className="font-body text-xs text-[#00D4FF] animate-pulse">Uploading...</p>}
        </div>
      )}
    </div>
  );
}

export default function HotelRoomManager({ rooms, onChange }) {
  const addRoom = () => {
    onChange([...rooms, {
      name: '', price_per_night: '', max_guests: 2,
      amenities: [], images: [], video_url: '',
      blocked_dates: [], transition: 'Fade',
      check_in_time: '14:00', check_out_time: '12:00',
    }]);
  };

  const updateRoom = (i, room) => {
    const next = [...rooms];
    next[i] = room;
    onChange(next);
  };

  const deleteRoom = (i) => onChange(rooms.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-heading font-bold text-sm text-white">Hotel Rooms</p>
        <button type="button" onClick={addRoom}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#0033CC,#00D4FF)' }}>
          <Plus className="w-3.5 h-3.5" /> Add Room
        </button>
      </div>
      {rooms.length === 0 && (
        <div className="text-center py-6 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.15)' }}>
          <p className="font-body text-xs text-white/30">No rooms added yet. Click "Add Room" to start.</p>
        </div>
      )}
      <div className="space-y-3">
        {rooms.map((room, i) => (
          <RoomCard key={i} room={room} index={i} onChange={r => updateRoom(i, r)} onDelete={() => deleteRoom(i)} />
        ))}
      </div>
    </div>
  );
}