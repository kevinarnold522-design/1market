import React, { useState, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BadgeCheck, MapPin, Package, Store, Globe, Edit2, Save, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Edit mode (only for owner)
  const [editing, setEditing] = useState(false);
  const [bioVal, setBioVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setCurrentUser(me);

        // Fetch seller — by ID or by username
        let sellerData = null;
        if (sellerId) {
          const results = await base44.entities.User.filter({ username: sellerId });
          if (results.length > 0) sellerData = results[0];
          else {
            const byId = await base44.entities.User.filter({ id: sellerId });
            if (byId.length > 0) sellerData = byId[0];
          }
        }
        if (sellerData) {
          setSeller(sellerData);
          setBioVal(sellerData.seller_bio || '');
          setIsOwner(me.email === sellerData.email);
          const items = await base44.entities.Listing.filter({ created_by: sellerData.email, is_active: true });
          setListings(items);
        }
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, [sellerId]);

  const handleSaveBio = async () => {
    setSaving(true);
    await base44.auth.updateMe({ seller_bio: bioVal });
    const me = await base44.auth.me();
    setSeller(me);
    setSaving(false);
    setEditing(false);
    showToast('Profile updated!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="w-8 h-8 border-4 border-white/10 border-t-[#00D4FF] rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6">
          <Store className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-white mb-2">Seller Not Found</h2>
          <Link to="/" className="text-[#00D4FF] font-body text-sm hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const initials = (seller.full_name || seller.username || seller.email || 'S').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isVerified = seller.is_verified_seller;
  const memberSince = seller.created_date ? new Date(seller.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Link to="/buysell" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white transition-colors mb-5 font-body text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>

        {/* Seller Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-5"
          style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.18)' }}>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-heading font-bold text-2xl text-white"
                style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                {initials}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center border-2 border-[#070F1A]">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-heading font-bold text-xl text-white">
                  {seller.username ? `@${seller.username}` : seller.full_name || 'Seller'}
                </h1>
                {isVerified && <BadgeCheck className="w-5 h-5 text-[#2563EB]" />}
                {isOwner && (
                  <button onClick={() => setEditing(e => !e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white/50 font-body text-[10px] transition-colors">
                    <Edit2 className="w-2.5 h-2.5" /> {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {isVerified ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#60a5fa] border border-[#2563EB]/20 font-body text-[9px] font-bold flex items-center gap-1">
                    <BadgeCheck className="w-2.5 h-2.5" /> Verified Seller
                  </span>
                ) : (
                  <span className="text-[8px] text-white/20 font-body">Independent Non-verified Partner</span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20 font-body text-[9px] font-bold">🏪 Seller</span>
                {seller.seller_location && (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 font-body text-[9px] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{seller.seller_location}{seller.seller_area ? ` · ${seller.seller_area}` : ''}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-body text-[9px] border border-white/8">
                  Since {memberSince}
                </span>
              </div>

              {/* Bio — editable for owner */}
              {editing ? (
                <div className="space-y-2">
                  <textarea value={bioVal} onChange={e => setBioVal(e.target.value)}
                    placeholder="Tell customers about your business..."
                    className="w-full border border-[#00D4FF]/30 rounded-xl px-3 py-2 font-body text-xs bg-white/5 text-white placeholder-white/25 focus:outline-none resize-none h-20" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBio} disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50">
                      {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
                      Save Bio
                    </button>
                    <button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 rounded-xl font-body text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-xs text-white/50 leading-relaxed">
                  {seller.seller_bio || (isOwner ? <span className="text-white/20 italic">No bio yet. Click Edit Profile to add one.</span> : 'No bio provided.')}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="font-heading font-bold text-2xl text-white">{listings.length}</p>
              <p className="font-body text-[9px] text-white/35 uppercase tracking-wider">Listings</p>
            </div>
          </div>
        </motion.div>

        {/* Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-white text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00D4FF]" /> Active Listings ({listings.length})
            </h2>
            {isOwner && (
              <Link to="/seller" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF]/20 transition-colors">
                <Store className="w-3 h-3" /> Manage Listings →
              </Link>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Package className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="font-body text-sm text-white/30">No active listings yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
                  style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.1)' }}>
                  {item.image_url ? (
                    <div className="aspect-video overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-white/5 flex items-center justify-center">
                      <Package className="w-8 h-8 text-white/15" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB]/20 text-[#00D4FF] capitalize">{item.type}</span>
                      {item.status === 'sold' && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400">SOLD</span>}
                      {!isVerified && <span className="text-[7px] text-white/15 font-body">Non-verified</span>}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-white leading-tight truncate">{item.title}</h3>
                    <p className="font-body text-[10px] text-[#00D4FF] mt-0.5">{item.price_label || `₱${Number(item.price || 0).toLocaleString()}`}</p>
                    {item.location && <p className="font-body text-[9px] text-white/30 mt-0.5 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{item.area || item.location}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-body text-xs shadow-2xl z-50 text-white"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}