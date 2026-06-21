import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Package, Star } from 'lucide-react';
import MetaVerifiedBadge from '@/components/MetaVerifiedBadge';

export default function SellerLeaderboardCard({ seller, rank }) {
  const initials = (seller.name || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const href = `/seller/${seller.username || seller.id}`;
  const medalClass = rank === 1 ? 'from-yellow-300 to-amber-500' : rank === 2 ? 'from-slate-200 to-slate-400' : rank === 3 ? 'from-orange-300 to-orange-600' : 'from-blue-400 to-cyan-400';

  return (
    <Link to={href} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 hover:bg-white/12 transition-all">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${medalClass} flex items-center justify-center text-white font-heading font-black shadow-lg`}>
        {rank <= 3 ? <Award className="w-5 h-5" /> : rank}
      </div>
      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-bold flex-shrink-0">
        {seller.avatar ? <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" /> : initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="font-body text-sm font-bold text-white truncate group-hover:text-[#00D4FF] transition-colors">{seller.name}</p>
          {seller.verified && <MetaVerifiedBadge size="xs" label="" />}
        </div>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-white/45 font-body">
          <span className="inline-flex items-center gap-1"><Package className="w-3 h-3" /> {seller.listings} listings</span>
          <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[#FFD700]" /> {seller.score}</span>
        </div>
      </div>
    </Link>
  );
}