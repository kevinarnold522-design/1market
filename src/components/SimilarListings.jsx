import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SimilarListings({ listing }) {
  const [similar, setSimilar] = useState([]);
  const [scrollIdx, setScrollIdx] = useState(0);

  useEffect(() => {
    if (!listing) return;
    const fetchSimilar = async () => {
      try {
        // Step 1: Get from same subcategory
        let items = [];
        if (listing.subcategory) {
          items = await base44.entities.Listing.filter(
            { subcategory: listing.subcategory, is_active: true, approval_status: 'approved' },
            '-created_date', 15
          );
        }
        // Filter out current listing
        items = items.filter(i => i.id !== listing.id);

        // Step 2: If not enough, fallback to same type
        if (items.length < 10 && listing.type) {
          const typeItems = await base44.entities.Listing.filter(
            { type: listing.type, is_active: true, approval_status: 'approved' },
            '-created_date', 20
          );
          const more = typeItems.filter(i => i.id !== listing.id && !items.find(s => s.id === i.id));
          items = [...items, ...more];
        }

        // Step 3: If still not enough, fallback to same main_category
        if (items.length < 10 && listing.main_category) {
          const catItems = await base44.entities.Listing.filter(
            { main_category: listing.main_category, is_active: true, approval_status: 'approved' },
            '-created_date', 20
          );
          const more = catItems.filter(i => i.id !== listing.id && !items.find(s => s.id === i.id));
          items = [...items, ...more];
        }

        setSimilar(items.slice(0, 10));
      } catch {
        setSimilar([]);
      }
    };
    fetchSimilar();
  }, [listing]);

  if (similar.length === 0) return null;

  const visible = similar.slice(scrollIdx, scrollIdx + 5);
  const maxIdx = Math.max(0, similar.length - 5);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-white">
          Similar Listings ({similar.length})
        </h3>
        <div className="flex items-center gap-1">
          {scrollIdx > 0 && (
            <button onClick={() => setScrollIdx(i => Math.max(0, i - 5))}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-white/60" />
            </button>
          )}
          {scrollIdx < maxIdx && (
            <button onClick={() => setScrollIdx(i => Math.min(maxIdx, i + 5))}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {visible.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}>
            <Link to={`/listing/${item.id}`}
              className="block rounded-xl overflow-hidden cursor-pointer"
              style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-20 overflow-hidden relative">
                <img src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'}
                  alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/60 to-transparent" />
              </div>
              <div className="p-2">
                <p className="font-body text-[10px] text-white line-clamp-2 leading-tight mb-1">{item.title}</p>
                <p className="font-heading font-bold text-[11px] text-[#00D4FF]">
                  {item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : '—')}
                </p>
                {item.subcategory && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Tag className="w-2 h-2 text-white/20" />
                    <span className="font-body text-[8px] text-white/30 truncate">{item.subcategory}</span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {/* Pagination dots */}
      {similar.length > 5 && (
        <div className="flex items-center justify-center gap-1 mt-3">
          {Array.from({ length: Math.ceil(similar.length / 5) }).map((_, i) => (
            <button key={i}
              onClick={() => setScrollIdx(i * 5)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i * 5 === scrollIdx ? 'bg-[#00D4FF] w-4' : 'bg-white/20'}`} />
          ))}
        </div>
      )}
    </div>
  );
}