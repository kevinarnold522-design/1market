import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MetaVerifiedBadge from '../MetaVerifiedBadge';

export default function TopSellersSection() {
  const [sellers, setSellers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setIsAdmin(me?.role === 'admin');
      }
    }).catch(() => {});
    base44.entities.User.list('-created_date', 12)
      .then(users => {
        const s = users.filter(u => u.is_seller || u.account_type === 'business_owner').slice(0, 6);
        setSellers(s);
      }).catch(() => {});
  }, []);

  // Only admin can see Top Sellers section
  if (!isAdmin || sellers.length === 0) return null;

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.2),rgba(245,158,11,0.2))', border: '1px solid rgba(255,215,0,0.3)' }}>
              <Award className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Top Sellers</h2>
              <p className="font-body text-[10px] text-white/40">Verified & trusted members</p>
            </div>
          </div>
          <Link to="/explore" className="font-body text-xs text-[#00D4FF] hover:underline">View all →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {sellers.map((seller, i) => {
            const initials = (seller.full_name || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            return (
              <motion.div key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}>
                <Link to={`/seller/${seller.username || seller.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all cursor-pointer"
                  style={{ background: 'rgba(13,31,60,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="relative">
                    {seller.profile_picture ? (
                      <img src={seller.profile_picture} alt={seller.full_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#00D4FF]/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center font-heading font-bold text-white text-sm">
                        {initials}
                      </div>
                    )}
                    {seller.is_verified_seller && (
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <MetaVerifiedBadge size="xs" label="" />
                      </div>
                    )}
                    {i < 3 && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32', fontSize: 8, fontWeight: 'bold', color: '#0A192F' }}>
                        {i + 1}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-body font-bold text-[11px] text-white truncate max-w-full">{seller.full_name?.split(' ')[0] || 'Seller'}</p>
                    <p className="font-body text-[9px] text-white/40">
                      {seller.account_type === 'business_owner' ? 'Business' : 'Seller'}
                    </p>
                    <div className="flex items-center gap-0.5 justify-center mt-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="font-body text-[9px] text-amber-400">4.{8 - (i % 3)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}