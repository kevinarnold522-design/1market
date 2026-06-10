import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ExternalLink, Share2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ShareListingModal from './ShareListingModal';

export default function TravelListingCard({ item, activeTab, index, onClick }) {
  const [showShare, setShowShare] = useState(false);

  const title = item.name || item.route || item.title || '';
  const sub = item.location || item.airline || item.area || '';
  const price = item.price || item.price_label || '';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
        whileHover={{ y: -4, boxShadow: '0 0 25px rgba(37,99,235,0.3)' }}
        className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer"
        style={{ 
          border: '1px solid rgba(37,99,235,0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
        onClick={() => onClick && onClick(item)}>

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={item.image} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/80 via-transparent to-transparent" />
          {/* Tag */}
          {item.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-body font-bold text-[#0A192F] bg-white/95">
              {item.tag}
            </span>
          )}
          {/* Region badge */}
          {item.region && (
            <span className={`absolute top-3 right-10 px-2 py-0.5 rounded-full text-[9px] font-bold ${item.region === 'Manila' ? 'bg-blue-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
              📍 {item.region}
            </span>
          )}
          {/* Share button */}
          <button
            onClick={e => { e.stopPropagation(); setShowShare(true); }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <Share2 className="w-3 h-3 text-white" />
          </button>
          {/* Stars (Hotels/Resorts) */}
          {item.stars && (
            <div className="absolute bottom-3 left-3 flex gap-0.5">
              {Array.from({ length: item.stars }).map((_, s) => (
                <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          )}
          {/* Rating */}
          {item.rating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="font-body text-[10px] font-bold text-white">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1 line-clamp-2 group-hover:text-[#00D4FF] transition-colors">
            {title}
          </h3>
          <p className="font-body text-xs text-white/40 mb-3 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {sub}
            {item.duration ? ` · ${item.duration}` : ''}
            {item.seats ? ` · ${item.seats} seats` : ''}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm text-[#00D4FF]">{price}</span>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-body text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(37,99,235,0.4)' }}>
                Book <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showShare && <ShareListingModal listing={item} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </>
  );
}