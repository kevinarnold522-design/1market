import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Maria Santos', role: 'Online Seller · Cavite', avatar: 'AI', stars: 5, text: 'I sold my old iPhone in just 2 hours! 1MarketPH is the fastest way to sell anything in the Philippines. The buyers here are serious and legit.' },
  { name: 'Juan dela Cruz', role: 'Property Owner · Manila', avatar: 'AI', stars: 5, text: 'Listed my condo for rent and got 3 inquiries the same day! Amazing platform for landlords. Very easy to use and free to post.' },
  { name: 'Ana Reyes', role: 'Traveler · Cebu', avatar: 'AI‍AI', stars: 5, text: 'Booked a hotel in Boracay through 1MarketPH and the price was unbeatable! The listings are detailed and the booking process was smooth.' },
  { name: 'Carlo Mendoza', role: 'Freelancer · Taguig', avatar: 'AI‍AI', stars: 5, text: 'Found my current job through the Jobs section. The platform is clean, easy to navigate, and the employers post real opportunities.' },
  { name: 'Liza Garcia', role: 'Food Business Owner · QC', avatar: 'AI‍AI', stars: 5, text: 'My catering business got so many clients after posting on 1MarketPH. The reach is incredible — customers from all over Metro Manila!' },
  { name: 'Ronnie Bautista', role: 'Car Dealer · Batangas', avatar: 'AI', stars: 5, text: 'Selling cars used to be hard. With 1MarketPH, I reach buyers faster than any other platform. Sold 5 cars this month alone!' },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!auto) return;
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [auto]);

  const go = (dir) => {
    clearInterval(timerRef.current);
    setAuto(false);
    setIdx(i => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
    setTimeout(() => setAuto(true), 8000);
  };

  const t = TESTIMONIALS[idx];

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(0,51,204,0.15),transparent 70%)' }} />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
            <span className="font-body text-xs text-white/60">What Our Members Say</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Trusted by Thousands</h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <Quote className="w-8 h-8 text-[#00D4FF]/30 mx-auto mb-4" />
              <p className="font-body text-sm sm:text-base text-white/75 leading-relaxed mb-6 max-w-xl mx-auto">"{t.text}"</p>
              <div className="flex justify-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div className="text-left">
                  <p className="font-heading font-bold text-sm text-white">{t.name}</p>
                  <p className="font-body text-[11px] text-[#00D4FF]/70">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => go(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => go(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 mt-5">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setAuto(false); }}
              className={`rounded-full transition-all ${i === idx ? 'w-6 h-1.5 bg-[#00D4FF]' : 'w-1.5 h-1.5 bg-white/20'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}