import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Search, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SavedListingsFilter({ onSelect }) {
  const [savedListings, setSavedListings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedListings();
  }, []);

  const loadSavedListings = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load from localStorage (for non-authenticated users or additional saved items)
      const localSaved = JSON.parse(localStorage.getItem('saved_listings_filters') || '[]');
      
      // Load from database (Favourites entity)
      const dbFavourites = await base44.entities.Favourite.filter({ user_email: user.email });
      
      // Combine both sources
      const combined = [
        ...localSaved.map(item => ({ ...item, source: 'local' })),
        ...dbFavourites.map(fav => ({
          id: fav.id,
          title: fav.title,
          category: fav.category,
          area: fav.area,
          image_url: fav.image_url,
          price_label: fav.price_label,
          listing_id: fav.listing_id,
          source: 'db'
        }))
      ];

      setSavedListings(combined);
    } catch (err) {
      console.error('Failed to load saved listings:', err);
      // Fallback to localStorage only
      const localSaved = JSON.parse(localStorage.getItem('saved_listings_filters') || '[]');
      setSavedListings(localSaved.map(item => ({ ...item, source: 'local' })));
    }
    setLoading(false);
  };

  const filteredListings = savedListings.filter(listing =>
    !filter || listing.title?.toLowerCase().includes(filter.toLowerCase()) ||
    listing.category?.toLowerCase().includes(filter.toLowerCase()) ||
    listing.area?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (listing) => {
    if (onSelect) {
      onSelect(listing);
    }
  };

  const removeSaved = async (listing, e) => {
    e.stopPropagation();
    try {
      if (listing.source === 'db' && listing.id) {
        await base44.entities.Favourite.delete(listing.id);
      } else if (listing.source === 'local') {
        const localSaved = JSON.parse(localStorage.getItem('saved_listings_filters') || '[]');
        const updated = localSaved.filter(item => item.listing_id !== listing.listing_id);
        localStorage.setItem('saved_listings_filters', JSON.stringify(updated));
      }
      loadSavedListings();
    } catch (err) {
      console.error('Failed to remove saved listing:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5 text-[#00D4FF]" />
          <h3 className="font-heading font-bold text-white text-lg">Saved Listings Filters</h3>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search saved filters..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#00D4FF] rounded-full animate-spin" />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <Save className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="font-body text-sm text-white/40">No saved listing filters yet</p>
          <p className="font-body text-xs text-white/25 mt-1">Save your favorite listing searches to access them quickly</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredListings.map((listing, idx) => (
            <motion.button
              key={listing.id || listing.listing_id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleSelect(listing)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
            >
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Save className="w-5 h-5 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-white truncate">{listing.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-body text-xs text-white/40">{listing.category}</span>
                  {listing.area && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="font-body text-xs text-white/40">{listing.area}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => removeSaved(listing, e)}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 transition-all"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}