import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Search } from 'lucide-react';

export default function BookingWidget({ onFilter }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [arrivalTime, setArrivalTime] = useState('');

  const handleSearch = () => {
    onFilter && onFilter({ checkIn, checkOut, guests, arrivalTime });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 sm:p-5 mb-6"
      style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.2)', backdropFilter: 'blur(12px)' }}>
      <p className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#00D4FF]" />
        Check Availability
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Check In</label>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Check Out</label>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block flex items-center gap-1">
            <Users className="w-3 h-3" /> Guests
          </label>
          <input type="number" value={guests} min={1} max={20} onChange={e => setGuests(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block flex items-center gap-1">
            <Clock className="w-3 h-3" /> Arrival Time
          </label>
          <input type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
      </div>
      <button onClick={handleSearch}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.02]"
        style={{ background: 'linear-gradient(135deg,#0033CC,#00D4FF)' }}>
        <Search className="w-4 h-4" /> Check Available Rooms
      </button>
    </motion.div>
  );
}