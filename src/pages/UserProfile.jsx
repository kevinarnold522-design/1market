import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, LogOut, Edit2, Check, Star, ShoppingBag, Package, Heart, Settings, Store, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import StarField from '../components/StarField';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'activity', label: 'Activity', icon: Star },
  { key: 'saved', label: 'Saved', icon: Heart },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setName(user.full_name || '');
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#00D4FF]" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white mb-2">Sign In Required</h2>
          <p className="font-body text-sm text-white/40 mb-6">Please sign in to view your profile.</p>
          <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="px-6 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ full_name: name });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = (user.full_name || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user.created_date ? new Date(user.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' }) : 'Recently';

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
        </Link>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-heading font-bold text-2xl text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0D1F3C] border-2 border-[#00D4FF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2 mb-1">
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="bg-white/10 border border-[#00D4FF]/40 rounded-xl px-3 py-1.5 text-white font-heading font-bold text-xl focus:outline-none w-full max-w-xs"
                    autoFocus />
                  <button onClick={handleSave} disabled={saving}
                    className="w-8 h-8 rounded-full bg-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    {saving ? <div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Check className="w-4 h-4 text-[#0A192F]" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-heading font-bold text-2xl text-white truncate">{user.full_name || 'Your Name'}</h1>
                  <button onClick={() => setEditing(true)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
                    <Edit2 className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  {saved && <span className="text-[10px] text-green-400 font-body">✓ Saved</span>}
                </div>
              )}
              <p className="font-body text-sm text-white/50 flex items-center gap-1.5 mb-2">
                <Mail className="w-3.5 h-3.5 text-[#00D4FF]" /> {user.email}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full font-body text-[10px] font-bold border ${user.account_type === 'business_owner' ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/25' : 'bg-[#2563EB]/20 text-[#00D4FF] border-[#2563EB]/30'}`}>
                  {user.account_type === 'business_owner' ? '🏪 Business Owner' : '🛍️ Customer'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/40 font-body text-[10px] border border-white/10">
                  Since {memberSince}
                </span>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-body text-[10px] font-bold border border-amber-500/30">
                    <Shield className="w-3 h-3 inline mr-1" />Admin
                  </span>
                )}
              </div>
            </div>

            <button onClick={() => logout(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30 font-body text-sm transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Star, label: 'Reviews', val: '0' },
            { icon: Heart, label: 'Saved', val: '0' },
            { icon: ShoppingBag, label: 'Orders', val: '0' },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Icon className="w-5 h-5 text-[#00D4FF] mx-auto mb-2" />
              <p className="font-heading font-bold text-xl text-white">{val}</p>
              <p className="font-body text-[10px] text-white/40">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-body text-xs font-semibold transition-all ${activeTab === key ? 'bg-[#2563EB] text-white' : 'text-white/40 hover:text-white'}`}>
              <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-heading font-bold text-white text-lg">Account Information</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Full Name', value: user.full_name || '—' },
                      { label: 'Email Address', value: user.email },
                      { label: 'User Type', value: user.account_type === 'business_owner' ? '🏪 Business Owner / Seller' : '🛍️ Customer' },
                      { label: 'Account Role', value: user.role === 'admin' ? '⚙️ Admin' : 'User' },
                      { label: 'Member Since', value: memberSince },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <span className="font-body text-xs text-white/40 uppercase tracking-wider">{label}</span>
                        <span className="font-body text-sm text-white font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller CTA */}
                {!user.is_seller ? (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5"
                    style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.15),rgba(0,212,255,0.08))', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center flex-shrink-0">
                        <Store className="w-5 h-5 text-[#00D4FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-white text-sm mb-0.5">Do You Want to Start Selling?</h3>
                        <p className="font-body text-xs text-white/50 leading-relaxed mb-3">List your products, services, or business for free. Reach thousands of buyers across the Philippines.</p>
                        <Link to="/seller"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors">
                          <Store className="w-3.5 h-3.5" /> Start Selling for Free →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-5"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                          <Store className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-heading font-bold text-white text-sm">Active Seller Account</p>
                          <p className="font-body text-xs text-white/50 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-green-400" />
                            {user.seller_location || 'Location not set'}{user.seller_area ? ` · ${user.seller_area}` : ''}
                          </p>
                        </div>
                      </div>
                      <Link to="/seller"
                        className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl font-body text-xs font-semibold hover:bg-green-500/20 transition-colors">
                        Dashboard →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Star className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-white mb-1">No Activity Yet</h3>
                <p className="font-body text-sm text-white/40 mb-4">Start rating businesses and your reviews will appear here.</p>
                <Link to="/food" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm">
                  Explore Food →
                </Link>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Heart className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-white mb-1">No Saved Items</h3>
                <p className="font-body text-sm text-white/40 mb-4">Save your favorite businesses and listings to find them quickly.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-sm">
                  Browse Now →
                </Link>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="font-heading font-bold text-white text-lg">Account Settings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="font-body text-sm text-white font-semibold">Email Notifications</p>
                      <p className="font-body text-[10px] text-white/40">Deals, updates & community news</p>
                    </div>
                    <div className="w-10 h-6 rounded-full bg-[#2563EB] relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="font-body text-sm text-white font-semibold">Account Email</p>
                      <p className="font-body text-[10px] text-white/40">{user.email}</p>
                    </div>
                    <span className="font-body text-[10px] text-[#00D4FF] font-bold px-2 py-1 rounded-full bg-[#00D4FF]/10">Verified ✓</span>
                  </div>
                  <button onClick={() => logout(true)}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-body font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out of Account
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}