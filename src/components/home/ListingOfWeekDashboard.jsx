import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Eye, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ListingOfWeekDashboard() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const items = await base44.entities.Listing.filter({ approval_status: 'approved', is_active: true }, '-view_count', 12);
      setListing(items[0] || null);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <section className="max-w-7xl mx-auto px-4 py-6" />;
  if (!listing) return null;

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] overflow-hidden border border-[#FFD700]/35 bg-white/12 shadow-2xl backdrop-blur-xl">
        <div className="grid md:grid-cols-[1fr_1.25fr] gap-0">
          <div className="relative min-h-[260px] bg-white/10">
            {listing.image_url && <img src={listing.image_url} alt={listing.title} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2563EB]/70 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-3 py-1.5 text-[#0A192F] font-body text-xs font-black shadow-lg">
              <Crown className="w-4 h-4" /> Listing of the Week
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-[#FFD700] font-bold mb-2">Featured dashboard</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">{listing.title}</h2>
            <p className="font-body text-sm text-white/70 mt-3 line-clamp-3">{listing.description || 'A standout listing getting attention this week.'}</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85"><Eye className="w-3.5 h-3.5" /> {listing.view_count || 0} views</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85"><Star className="w-3.5 h-3.5 text-[#FFD700]" /> {listing.rating || 0} rating</span>
              {listing.price_label && <span className="rounded-full bg-[#FFD700]/20 px-3 py-1.5 text-xs font-bold text-[#FFD700]">{listing.price_label}</span>}
            </div>
            <Link to={`/listing/${listing.id}`} className="mt-6 w-fit rounded-2xl bg-[#FFD700] px-6 py-3 font-body text-sm font-black text-[#0A192F] shadow-lg hover:bg-white transition-colors">View Listing</Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}