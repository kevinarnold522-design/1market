import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Users, ShoppingBag, Building2 } from 'lucide-react';

export default function CommunityAnimation() {
  const [memberCount, setMemberCount] = useState(null);

  useEffect(() => {
    // Only fetch real count — no fake stats, no user names/avatars
    base44.entities.User.list('-created_date', 1)
      .then(users => {
        // We can't easily get count, so just show "Join our growing community"
        setMemberCount(true);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640 0%,#0033C4 60%,#011640 100%)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#3E97F1]">Our Community</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-2">
            Join the 1Market Philippines Community
          </h2>
          <p className="font-body text-sm text-white/50 mt-3 max-w-lg mx-auto">
            Connect with buyers, sellers, and business owners across the Philippines. 
            List your products, find great deals, and grow your business.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 mb-10">
            {[
              { Icon: ShoppingBag, color: '#3E97F1', title: 'Buy & Sell', desc: 'Find real listings from verified sellers nationwide' },
              { Icon: Building2,   color: '#a855f7', title: 'For Businesses', desc: 'Grow your business reach across Manila & beyond' },
              { Icon: Users,       color: '#10b981', title: 'Trusted Network', desc: 'Verified partners with transparent seller profiles' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${item.color}22` }}>
                  <item.Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <p className="font-heading font-bold text-white text-sm">{item.title}</p>
                <p className="font-body text-xs text-white/50 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => base44.auth.redirectToLogin(window.location.origin + window.location.pathname)}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-body font-bold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#0040D0,#3E97F1)', boxShadow: '0 0 30px rgba(62,151,241,0.4)' }}>
            <Users className="w-4 h-4" /> Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}