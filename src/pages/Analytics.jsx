import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Package, Heart, MessageSquare, Star, Users } from 'lucide-react';
import StarField from '../components/StarField';
import Navbar from '../components/home/Navbar';
import { base44 } from '@/api/base44Client';

const COLORS = ['#00D4FF', '#f87171', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl font-body text-xs shadow-xl" style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <p className="text-[#00D4FF] font-bold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white/70">{p.name}: <span className="text-white font-bold">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [listings, setListings] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalListings: 0, totalHearts: 0, totalComments: 0, totalUsers: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [listingsData, heartsData, commentsData, usersData] = await Promise.all([
          base44.entities.Listing.list('-created_date', 500),
          base44.entities.ListingHeart.filter({}),
          base44.entities.ListingComment.filter({}),
          base44.entities.User.filter({}),
        ]);
        setListings(listingsData);
        setHearts(heartsData);
        setComments(commentsData);
        setUsers(usersData);
        
        // Calculate stats
        const typeCounts = {};
        listingsData.forEach(l => { typeCounts[l.type] = (typeCounts[l.type] || 0) + 1; });
        
        setStats({
          totalListings: listingsData.length,
          totalHearts: heartsData.length,
          totalComments: commentsData.length,
          totalUsers: usersData.length,
        });
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  // Prepare chart data
  const typeData = (() => {
    const counts = {};
    listings.forEach(l => { counts[l.type] = (counts[l.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  const locationData = (() => {
    const counts = {};
    listings.forEach(l => { counts[l.location || 'Unknown'] = (counts[l.location || 'Unknown'] || 0) + 1; });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));
  })();

  if (loading) return (
    <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#00D4FF]" />
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">Platform Analytics</h1>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Total Listings', val: stats.totalListings, color: '#00D4FF' },
            { icon: Heart, label: 'Total Hearts', val: stats.totalHearts, color: '#f87171' },
            { icon: MessageSquare, label: 'Comments', val: stats.totalComments, color: '#a78bfa' },
            { icon: Users, label: 'Users', val: stats.totalUsers, color: '#34d399' },
          ].map(({ icon: Icon, label, val, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}33` }}>
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
              <p className="font-heading font-bold text-2xl text-white">{val.toLocaleString()}</p>
              <p className="font-body text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Listings by Type - Pie Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}>
            <h3 className="font-heading font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00D4FF]" /> Listings by Category
            </h3>
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px]">
                <p className="font-body text-xs text-white/30">No data yet</p>
              </div>
            )}
          </motion.div>

          {/* Top Locations - Bar Chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}>
            <h3 className="font-heading font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#00D4FF]" /> Top Locations
            </h3>
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={locationData}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {locationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px]">
                <p className="font-body text-xs text-white/30">No data yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}