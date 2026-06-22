import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Users, Clock, Check } from 'lucide-react';

function getTransitionVariants(transition) {
  switch (transition) {
    case 'Horizontal Slide':
      return {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
      };
    case 'Zoom':
      return {
        enter: { scale: 1.2, opacity: 0 },
        center: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
      };
    case 'Flip':
      return {
        enter: { rotateY: 90, opacity: 0 },
        center: { rotateY: 0, opacity: 1 },
        exit: { rotateY: -90, opacity: 0 },
      };
    default: // Fade
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

function RoomGallery({ images, transition }) {
  const [[page, dir], setPage] = useState([0, 0]);
  const variants = getTransitionVariants(transition);

  const paginate = (newDir) => setPage([Math.abs((page + newDir + images.length) % images.length), newDir]);

  if (!images || images.length === 0) return (
    <div className="aspect-[16/9] bg-white/5 rounded-xl flex items-center justify-center">
      <span className="text-white/20 text-xs font-body">No images</span>
    </div>
  );

  return (
    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#0A192F]">
      <AnimatePresence custom={dir} mode="wait">
        <motion.img key={page}
          src={images[page]} alt=""
          custom={dir}
          variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button onClick={() => paginate(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => paginate(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => setPage([i, i > page ? 1 : -1])}
                className="rounded-full transition-all"
                style={{ width: i === page ? 14 : 5, height: 5, background: i === page ? '#00D4FF' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 font-body text-[9px] text-white">
            {transition}
          </div>
        </>
      )}
    </div>
  );
}

function VideoPreview({ url }) {
  const [playing, setPlaying] = useState(false);
  if (!url) return null;
  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-pointer" onClick={() => setPlaying(true)}>
      {playing ? (
        <video src={url} autoPlay controls className="w-full h-full object-cover" />
      ) : (
        <>
          <video src={url} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <p className="absolute bottom-2 left-3 font-body text-xs text-white/60">▶ Video Preview</p>
        </>
      )}
    </div>
  );
}

export default function HotelRoomGallery({ rooms, checkIn, checkOut, guests }) {
  const isAvailable = (room) => {
    if (!checkIn || !checkOut) return true;
    const blocked = room.blocked_dates || [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const ds = d.toISOString().split('T')[0];
      if (blocked.includes(ds)) return false;
    }
    if (guests && room.max_guests && Number(guests) > Number(room.max_guests)) return false;
    return true;
  };

  const availableRooms = rooms ? rooms.filter(isAvailable) : [];

  return (
    <div className="space-y-6">
      {checkIn && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Check className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-body text-xs text-[#00D4FF] font-semibold">
            {availableRooms.length} room{availableRooms.length !== 1 ? 's' : ''} available for your dates
          </span>
        </div>
      )}
      {(checkIn ? availableRooms : rooms || []).map((room, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-4 pb-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-bold text-white text-base">{room.name || `Room ${i + 1}`}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-body text-xs text-white/50 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Max {room.max_guests || '?'} guests
                  </span>
                  <span className="font-body text-xs text-white/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Check-in {room.check_in_time || '14:00'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-lg text-[#00D4FF]">
                  {room.price_per_night ? `₱${Number(room.price_per_night).toLocaleString()}` : '—'}
                </p>
                <p className="font-body text-[10px] text-white/30">per night</p>
              </div>
            </div>
            {/* Amenity pills */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {room.amenities.map(a => (
                  <span key={a} className="px-2 py-0.5 rounded-full font-body text-[9px] font-semibold"
                    style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Gallery */}
          <div className="px-4 pb-2">
            <RoomGallery images={room.images || []} transition={room.transition || 'Fade'} />
          </div>
          {/* Video */}
          {room.video_url && (
            <div className="px-4 pb-4">
              <VideoPreview url={room.video_url} />
            </div>
          )}
        </motion.div>
      ))}
      {checkIn && availableRooms.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{ border: '1px dashed rgba(255,255,255,0.15)' }}>
          <p className="font-body text-white/40 text-sm">No rooms available for your selected dates/guests.</p>
          <p className="font-body text-white/25 text-xs mt-1">Try different dates or fewer guests.</p>
        </div>
      )}
    </div>
  );
}