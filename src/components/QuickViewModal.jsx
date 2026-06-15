import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Heart, ExternalLink, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingContactLinks from './ListingContactLinks';

export default function QuickViewModal({ listing, onClose, user }) {
  const [activeImage, setActiveImage] = useState(0);
  const [hearted, setHearted] = useState(false);

  if (!listing) return null;

  const images = [listing.image_url, ...(listing.extra_images || [])].filter(Boolean);

  const share = () => {
    const url = `${window.location.origin}/listing/${listing.id}`;
    if (navigator.share) navigator.share({ title: listing.title, url });
    else navigator.clipboard.writeText(url);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>

          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img src={images[activeImage] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600'}
              alt={listing.title} className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600'; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/80 to-transparent" />
            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <button onClick={() => setHearted(h => !h)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center transition-colors hover:bg-red-500/20">
              <Heart className={`w-4 h-4 ${hearted ? 'fill-red-400 text-red-400' : 'text-white'}`} />
            </button>
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`rounded-full transition-all ${i === activeImage ? 'w-4 h-1.5 bg-[#00D4FF]' : 'w-1.5 h-1.5 bg-white/40'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-heading font-bold text-lg text-white leading-tight">{listing.title}</h2>
              <p className="font-heading font-bold text-xl text-[#00D4FF] flex-shrink-0">
                {listing.price_label || (listing.price ? `₱${Number(listing.price).toLocaleString()}` : 'Price on request')}
              </p>
            </div>

            {listing.location && (
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
                <span className="font-body text-xs text-white/60">{listing.area || listing.location}</span>
              </div>
            )}

            {listing.rating > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${listing.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />
                  ))}
                </div>
                <span className="font-body text-xs text-white/40">{listing.rating} · {listing.rating_count || 0} reviews</span>
              </div>
            )}

            {listing.description && (
              <p className="font-body text-sm text-white/60 leading-relaxed mb-4 line-clamp-3">{listing.description}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {listing.condition && listing.condition !== 'N/A' && (
                <span className="px-2 py-0.5 rounded-full bg-white/8 text-white/50 font-body text-[10px]">{listing.condition}</span>
              )}
              {listing.brand && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-body text-[10px]">{listing.brand}</span>
              )}
              {listing.subcategory && (
                <span className="px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] font-body text-[10px]">{listing.subcategory}</span>
              )}
            </div>

            <div className="space-y-3">
              <ListingContactLinks listing={listing} compact />
              <div className="flex gap-2">
                <Link to={`/listing/${listing.id}`} onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  <ExternalLink className="w-3.5 h-3.5" /> View Full Listing
                </Link>
                <button onClick={share}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}