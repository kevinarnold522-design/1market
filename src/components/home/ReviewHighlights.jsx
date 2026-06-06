import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${rating >= s ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />
      ))}
    </div>
  );
}

export default function ReviewHighlights() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load real reviews from ListingComment with a rating
    base44.entities.ListingComment.filter({}, '-created_date', 20)
      .then(dbReviews => {
        const withRating = dbReviews.filter(r => r.rating && r.comment);
        setReviews(withRating);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="py-14 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640 0%,#0040D0 40%,#0033C4 60%,#011640 100%)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#3E97F1]">Community Reviews</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">Real Reviews from Real Buyers</h2>
          <p className="font-body text-sm text-white/40 mt-1">Verified reviews left by actual customers on listings</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.slice(0, 6).map((r, i) => (
            <motion.div key={r.id || i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <StarRow rating={r.rating} />
              <p className="font-body text-sm text-white/70 mt-3 leading-relaxed line-clamp-4">"{r.comment}"</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0040D0] to-[#3E97F1] flex items-center justify-center text-white font-bold text-[10px]">
                  {(r.user_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <p className="font-body text-[11px] text-[#3E97F1] font-bold">{r.user_name || 'Verified Buyer'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}