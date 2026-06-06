import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATIC_REVIEWS = [
  { reviewer_name: 'Maria Santos', rating: 5, comment: 'Found a great deal on shoes here! The seller was very responsive and delivery was fast. Will definitely buy again.', category: 'Buy & Sell', avatar: 'MS' },
  { reviewer_name: 'Juan dela Cruz', rating: 5, comment: 'Booked a hotel through 1Market and it was seamless. Great rates compared to other platforms. Highly recommend!', category: 'Travel', avatar: 'JC' },
  { reviewer_name: 'Ana Reyes', rating: 5, comment: 'Sold my old laptop in just 2 days! The platform is easy to use and I got a fair price. Love the chat feature.', category: 'Electronics', avatar: 'AR' },
  { reviewer_name: 'Mark Villanueva', rating: 5, comment: 'Best food delivery discovery app in Cavite! Found so many home-based businesses I never knew existed. Sulit!', category: 'Food', avatar: 'MV' },
  { reviewer_name: 'Liza Mendoza', rating: 5, comment: 'Verified Partner badge gave my small business so much more credibility. Orders increased after getting verified!', category: 'Verified Seller', avatar: 'LM' },
  { reviewer_name: 'Carlo Bautista', rating: 4, comment: 'Great marketplace for secondhand cars. Found my Vios here at a much better price than dealerships. Legit sellers!', category: 'Cars', avatar: 'CB' },
];

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
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    base44.entities.Review.list('-created_date', 12)
      .then(dbReviews => {
        if (dbReviews.length > 0) {
          const merged = [...dbReviews.map(r => ({
            ...r,
            avatar: (r.reviewer_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2),
            category: 'Community',
          })), ...STATIC_REVIEWS];
          setReviews(merged);
        }
      })
      .catch(() => {});
  }, []);

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent(c => (c + 1) % reviews.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const review = reviews[current];

  return (
    <section className="py-14 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640 0%,#0040D0 40%,#0033C4 60%,#011640 100%)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Community Reviews</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">What People Are Saying</h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
            <span className="font-body text-sm text-white/40 ml-2">4.9 / 5 average</span>
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl p-8 relative"
              style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#00D4FF]/10" />
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-lg text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                  {review.avatar}
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-base">{review.reviewer_name}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] font-body text-[10px] font-bold border border-[#00D4FF]/20">
                    {review.category}
                  </span>
                  <div className="mt-1"><StarRow rating={review.rating} /></div>
                </div>
              </div>
              <p className="font-body text-white/70 text-base leading-relaxed italic">"{review.comment}"</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#00D4FF' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {STATIC_REVIEWS.slice(0, 3).map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <StarRow rating={r.rating} />
              <p className="font-body text-[10px] text-white/50 mt-2 line-clamp-3 leading-relaxed">"{r.comment}"</p>
              <p className="font-body text-[9px] text-[#00D4FF] mt-2 font-bold">{r.reviewer_name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}