import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Users, TrendingUp, Star, ShoppingBag } from 'lucide-react';

const COMMUNITY_AVATARS = [
  { initials: 'MA', name: 'Maria A.', role: 'Verified Seller', color: 'from-pink-500 to-rose-600', img: null },
  { initials: 'JD', name: 'Juan D.', role: 'Buyer', color: 'from-blue-500 to-cyan-500', img: null },
  { initials: 'LM', name: 'Liza M.', role: 'Business Owner', color: 'from-purple-500 to-indigo-600', img: null },
  { initials: 'CB', name: 'Carlo B.', role: 'Top Seller', color: 'from-amber-500 to-orange-500', img: null },
  { initials: 'AR', name: 'Ana R.', role: 'Verified Partner', color: 'from-emerald-500 to-teal-600', img: null },
  { initials: 'MV', name: 'Mark V.', role: 'Buyer', color: 'from-sky-500 to-blue-600', img: null },
];

const STATS = [
  { icon: Users, label: 'Active Members', value: '12,400+', color: '#00D4FF' },
  { icon: ShoppingBag, label: 'Live Listings', value: '3,800+', color: '#a855f7' },
  { icon: Star, label: 'Avg Rating', value: '4.9 / 5', color: '#fbbf24' },
  { icon: TrendingUp, label: 'Deals Closed', value: '28,000+', color: '#34d399' },
];

export default function CommunityAnimation() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    base44.entities.User.list('-created_date', 12)
      .then(users => {
        if (users.length > 0) setMembers(users.slice(0, 12));
      })
      .catch(() => {});
  }, []);

  const displayAvatars = members.length > 0
    ? members.map((u, i) => ({
        initials: (u.full_name || u.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        name: u.full_name?.split(' ')[0] || 'Member',
        role: u.account_type === 'business_owner' ? 'Business Owner' : u.is_seller ? 'Seller' : 'Member',
        color: COMMUNITY_AVATARS[i % COMMUNITY_AVATARS.length].color,
        img: u.profile_picture || null,
      }))
    : COMMUNITY_AVATARS;

  return (
    <section className="py-16 overflow-hidden" style={{ background: 'linear-gradient(180deg,#011640 0%,#0033C4 60%,#011640 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">Our Community</span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">
            Real People. Real Deals.
          </h2>
          <p className="font-body text-sm text-white/40 mt-2 max-w-md mx-auto">
            Join thousands of buyers, sellers, and business owners across the Philippines.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
              <p className="font-heading font-bold text-xl text-white">{stat.value}</p>
              <p className="font-body text-[10px] text-white/40 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Member profile grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10">
          {displayAvatars.map((member, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 200, damping: 18 }}
              whileHover={{ y: -6, scale: 1.05 }}
              className="flex flex-col items-center gap-2 group cursor-default"
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg overflow-hidden`}
                  style={{ boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}>
                  {member.img ? (
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading font-bold text-white text-base">{member.initials}</span>
                  )}
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#0D1F3C]" />
              </div>
              <div className="text-center">
                <p className="font-body font-bold text-[10px] text-white truncate w-16">{member.name}</p>
                <p className="font-body text-[8px] text-white/35 truncate w-16">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 30px rgba(0,212,255,0.35)' }}>
            <Users className="w-4 h-4" /> Join the Community
          </button>
        </motion.div>
      </div>
    </section>
  );
}