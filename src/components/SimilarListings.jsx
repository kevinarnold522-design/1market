import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SimilarListings({ listing }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (!listing) return;
    base44.entities.Listing.filter({ type: listing.type, is_active: true }, '-created_date', 8)
      .then(items => {
        setSimilar(items.filter(i => i.id !== listing.id).slice(0, 4));
      }).catch(() => {});
  }, [listing]);

  if (similar.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-white">Similar Listings</h3>
        <Link to={`/${listing.type === 'hotel' ? 'travel' : 'buysell'}`}
          className="flex items-center gap-1 font-body text-xs text-[#00D4FF] hover:underline">
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {similar.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}>
            <Link to={`/listing/${item.id}`}
              className="block rounded-xl overflow-hidden cursor-pointer"
              style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-24 overflow-hidden relative">
                <img src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'}
                  alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 to-transparent" />
              </div>
              <div className="p-2.5">
                <p className="font-body text-[11px] text-white line-clamp-2 leading-tight mb-1">{item.title}</p>
                <p className="font-heading font-bold text-xs text-[#00D4FF]">
                  {item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : '—')}
                </p>
                {item.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-2.5 h-2.5 text-white/30" />
                    <span className="font-body text-[9px] text-white/30">{item.area || item.location}</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}