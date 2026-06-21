import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Medal, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const categoryLabels = {
  travel: 'Travel',
  food: 'Food',
  buysell: 'Buy & Sell',
  jobs: 'Jobs',
  services: 'Services',
  rent: 'Rent',
};

export default function MonthlyTop10Dashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const items = await base44.entities.Listing.filter({ approval_status: 'approved', is_active: true }, '-view_count', 80);
      const monthly = items.filter(item => item.created_date && new Date(item.created_date) >= startOfMonth);
      setListings((monthly.length ? monthly : items).slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <section className="max-w-7xl mx-auto px-4 py-6" />;
  if (!listings.length) return null;

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] border border-white/18 bg-white/12 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/35 px-3 py-1.5 mb-3">
              <TrendingUp className="w-4 h-4 text-[#FFD700]" />
              <span className="font-body text-xs font-black text-[#FFD700] uppercase tracking-wider">Monthly Top 10</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">Top listings across all categories</h2>
            <p className="font-body text-sm text-white/65 mt-2">The most viewed marketplace listings this month.</p>
          </div>
          <p className="font-body text-xs text-white/50">Updated live from approved listings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-3">
          {listings.map((listing, index) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="group rounded-2xl border border-white/12 bg-white/8 hover:bg-white/14 transition-all overflow-hidden">
              <div className="flex gap-3 p-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                  {listing.image_url ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD700] px-2 py-0.5 text-[10px] font-black text-[#0A192F]"><Medal className="w-3 h-3" /> #{index + 1}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/75">{categoryLabels[listing.main_category] || listing.type || 'Listing'}</span>
                  </div>
                  <p className="font-body text-sm font-bold text-white truncate">{listing.title}</p>
                  <p className="font-body text-xs text-white/50 truncate mt-1">{listing.area || listing.location || 'Philippines'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/70"><Eye className="w-3.5 h-3.5" /> {listing.view_count || 0}</span>
                    {listing.price_label && <span className="text-[11px] font-black text-[#FFD700] truncate">{listing.price_label}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}