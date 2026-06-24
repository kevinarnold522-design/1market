import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const KEY = '1market_recently_viewed';

export function recordView(listing) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = existing.filter(l => l.id !== listing.id);
    const updated = [{ id: listing.id, title: listing.title, image_url: listing.image_url, price_label: listing.price_label, type: listing.type }, ...filtered].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadValid = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
        const checks = await Promise.all(stored.map(item =>
          base44.entities.Listing.filter({ id: item.id, approval_status: 'approved', is_active: true })
            .then(rows => rows[0] ? item : null)
            .catch(() => null)
        ));
        const valid = checks.filter(Boolean);
        setItems(valid);
        localStorage.setItem(KEY, JSON.stringify(valid));
      } catch {}
    };
    loadValid();
  }, []);

  const remove = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  if (items.length === 0) return null;

  return (
    <div className="py-6 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-white/40" />
          <h3 className="font-heading font-bold text-sm text-white/60 uppercase tracking-wider">Recently Viewed</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {items.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-32 relative group">
              <Link to={`/listing/${item.id}`}>
                <div className="w-32 h-20 rounded-xl overflow-hidden mb-1.5"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                    alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'; }} />
                </div>
                <p className="font-body text-[10px] text-white/70 line-clamp-2 leading-tight">{item.title}</p>
                {item.price_label && <p className="font-heading font-bold text-[10px] text-[#00D4FF] mt-0.5">{item.price_label}</p>}
              </Link>
              <button onClick={() => remove(item.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}