import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Tag, Pencil, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

function Countdown({ endTime }) {
  const calc = () => {
    const diff = Math.max(0, endTime - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    const iv = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(iv);
  }, [endTime]);
  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1 text-[#FFD700]">
      <Clock className="w-3 h-3" />
      <span className="font-heading font-bold text-xs tabular-nums">{pad(t.h)}:{pad(t.m)}:{pad(t.s)}</span>
    </div>
  );
}

const FLASH = [
  { id: 'f1', title: 'iPhone 14 Pro 256GB', price_label: '₱42,500', original: '₱48,000', discount: 11, image_url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80', type: 'electronics' },
  { id: 'f2', title: 'Nike Air Max 270', price_label: '₱4,800', original: '₱6,500', discount: 26, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', type: 'shoes' },
  { id: 'f3', title: 'Samsung 55" QLED TV', price_label: '₱38,000', original: '₱52,000', discount: 27, image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80', type: 'electronics' },
  { id: 'f4', title: 'Boracay Hotel 3D2N', price_label: '₱9,800', original: '₱14,000', discount: 30, image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', type: 'hotel' },
];

const FLASH_END = Date.now() + 4 * 3600 * 1000 + 23 * 60 * 1000;

export default function FlashDealsSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deals, setDeals] = useState(FLASH);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setIsAdmin(me?.role === 'admin');
      }
    }).catch(() => {});
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({ title: item.title, price_label: item.price_label, original: item.original, discount: item.discount });
  };

  const saveEdit = (id) => {
    setDeals(d => d.map(item => item.id === id ? { ...item, ...editData, discount: editData.original && editData.price_label ? Math.round(((parseFloat(editData.original.replace(/[₱,]/g,'')) - parseFloat(editData.price_label.replace(/[₱,]/g,''))) / parseFloat(editData.original.replace(/[₱,]/g,''))) * 100) : item.discount } : item));
    setEditingId(null);
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}>
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Flash Deals</h2>
              <p className="font-body text-[10px] text-white/40">Limited time offers — grab before they expire!</p>
            </div>
            <div className="ml-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Countdown endTime={FLASH_END} />
            </div>
          </div>
          <Link to="/buysell" className="font-body text-xs text-[#00D4FF] hover:underline">See all →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {deals.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl overflow-hidden cursor-pointer group relative"
              style={{ background: '#0D1F3C', border: '1px solid rgba(249,115,22,0.2)' }}>
              {/* Admin Edit Button */}
              {isAdmin && editingId !== item.id && (
                <button onClick={(e) => { e.preventDefault(); startEdit(item); }}
                  className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-lg hover:bg-amber-300 transition-colors">
                  <Pencil className="w-3 h-3 text-[#0A192F]" />
                </button>
              )}
              {/* Admin Edit Overlay */}
              {isAdmin && editingId === item.id ? (
                <div className="p-3 space-y-2">
                  <input value={editData.title} onChange={e => setEditData(d => ({...d, title: e.target.value}))}
                    className="w-full bg-white/10 border border-orange-400/40 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" placeholder="Title" />
                  <input value={editData.price_label} onChange={e => setEditData(d => ({...d, price_label: e.target.value}))}
                    className="w-full bg-white/10 border border-orange-400/40 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" placeholder="Sale Price (e.g. ₱4,800)" />
                  <input value={editData.original} onChange={e => setEditData(d => ({...d, original: e.target.value}))}
                    className="w-full bg-white/10 border border-orange-400/40 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" placeholder="Original Price (e.g. ₱6,500)" />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-500 rounded-lg text-white font-bold text-xs hover:bg-green-400 transition-colors">
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/10 rounded-lg text-white/60 font-bold text-xs hover:bg-white/20 transition-colors">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Link to={`/buysell`}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={item.image_url} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C] to-transparent" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-heading font-bold text-[10px] text-white"
                      style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
                      -{item.discount}%
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-body text-[11px] text-white leading-tight line-clamp-2 mb-1.5">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#FFD700]">{item.price_label}</span>
                      <span className="font-body text-[10px] text-white/30 line-through">{item.original}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Tag className="w-2.5 h-2.5 text-orange-400" />
                      <span className="font-body text-[9px] text-orange-400">Flash Price</span>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}