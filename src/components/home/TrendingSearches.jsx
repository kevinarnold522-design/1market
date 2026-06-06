import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const TRENDING = [
  { label: 'iPhone 15', link: '/buysell?q=iphone' },
  { label: 'Honda Civic', link: '/buysell?q=honda+civic' },
  { label: 'Room for Rent Manila', link: '/rent?q=manila' },
  { label: 'Hotel Tagaytay', link: '/travel?q=tagaytay' },
  { label: 'Palawan Tour', link: '/travel?q=palawan' },
  { label: 'Web Developer', link: '/jobs?q=developer' },
  { label: 'Samsung TV', link: '/buysell?q=samsung+tv' },
  { label: 'Boracay Resort', link: '/travel?q=boracay' },
];

export default function TrendingSearches() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsAuthenticated).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/explore?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="relative z-20 py-6 px-4"
      style={{ background: 'rgba(0,10,40,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings, products, hotels, jobs..."
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl text-white placeholder-white/25 font-body text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 20px rgba(0,212,255,0.05)' }}
          />
          <button type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)' }}>
            Search
          </button>
        </form>

        {/* Trending — only for signed-in users */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-white/30 flex-shrink-0">
              <TrendingUp className="w-3 h-3" />
              <span className="font-body text-[10px] uppercase tracking-wider">Trending:</span>
            </div>
            {TRENDING.map((t, i) => (
              <motion.a key={i} href={t.link}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[11px] text-white/60 hover:text-white transition-all cursor-pointer hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t.label}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}