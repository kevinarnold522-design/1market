import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Eye, TrendingUp, Package, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SellerAnalytics({ listings, user }) {
  const [heartCounts, setHeartCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [avgRatings, setAvgRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listings.length) { setLoading(false); return; }
    const load = async () => {
      const [allHearts, allComments] = await Promise.all([
        base44.entities.ListingHeart.filter({}),
        base44.entities.ListingComment.filter({}),
      ]);
      const hMap = {};
      const cMap = {};
      const rMap = {};
      listings.forEach(l => {
        hMap[l.id] = allHearts.filter(h => h.listing_id === l.id).length;
        const lc = allComments.filter(c => c.listing_id === l.id);
        cMap[l.id] = lc.length;
        const rated = lc.filter(c => c.rating > 0);
        rMap[l.id] = rated.length > 0 ? (rated.reduce((s,c)=>s+c.rating,0)/rated.length).toFixed(1) : null;
      });
      setHeartCounts(hMap);
      setCommentCounts(cMap);
      setAvgRatings(rMap);
      setLoading(false);
    };
    load();
  }, [listings]);

  const totalHearts = Object.values(heartCounts).reduce((s,v)=>s+v,0);
  const totalComments = Object.values(commentCounts).reduce((s,v)=>s+v,0);
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.is_active).length;

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-white text-sm">Seller Analytics</h3>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Package, label: 'Total Listings', val: totalListings, color: '#00D4FF' },
          { icon: Eye, label: 'Active', val: activeListings, color: '#34d399' },
          { icon: Heart, label: 'Total Hearts', val: totalHearts, color: '#f87171' },
          { icon: MessageSquare, label: 'Reviews', val: totalComments, color: '#a78bfa' },
        ].map(({ icon: Icon, label, val, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-3 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22` }}>
            <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
            <p className="font-heading font-bold text-lg text-white">{val}</p>
            <p className="font-body text-[9px] text-white/35">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-listing breakdown */}
      <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h4 className="font-heading font-bold text-white text-xs mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#00D4FF]" /> Per Listing Performance
        </h4>
        {listings.length === 0 ? (
          <p className="font-body text-xs text-white/25 text-center py-6">No listings yet.</p>
        ) : (
          listings.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-9 h-9 rounded-xl object-cover border border-white/10 flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-3.5 h-3.5 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body font-bold text-xs text-white truncate">{item.title}</p>
                <p className="font-body text-[9px] text-white/35 capitalize">{item.type}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="font-body text-[10px] text-white/60">{heartCounts[item.id] || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-purple-400" />
                  <span className="font-body text-[10px] text-white/60">{commentCounts[item.id] || 0}</span>
                </div>
                {avgRatings[item.id] && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-body text-[10px] text-amber-400">{avgRatings[item.id]}</span>
                  </div>
                )}
                {!item.is_active && <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[8px] font-bold">Hidden</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}