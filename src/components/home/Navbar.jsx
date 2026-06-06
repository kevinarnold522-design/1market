import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, ChevronDown, Store, Shield, MapPin, Mail, Edit2, Check, User, History, Heart, ShoppingCart, Globe, Truck, Pencil, EyeOff, Package, Settings, Gift, MessageSquare, Bookmark, Plus, Camera, BarChart2 } from 'lucide-react';
import RewardDashboard from '../RewardDashboard';
import MetaVerifiedBadge from '../MetaVerifiedBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AccountTypeModal from '../AccountTypeModal';
import NavUserBadge from './NavUserBadge';
import NavCategoryBar from './NavCategoryBar';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

// Global edit mode state
let _editModeListeners = [];
let _editModeValue = false;
export function getAdminEditMode() { return _editModeValue; }
export function setAdminEditMode(val) {
  _editModeValue = val;
  _editModeListeners.forEach(fn => fn(val));
}
export function useAdminEditMode() {
  const [editMode, setEditMode] = useState(_editModeValue);
  useEffect(() => {
    const handler = (v) => setEditMode(v);
    _editModeListeners.push(handler);
    return () => { _editModeListeners = _editModeListeners.filter(fn => fn !== handler); };
  }, []);
  return editMode;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditModeLocal] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'Kevinarnold522@gmail.com';
  const isSeller = user?.is_seller || user?.account_type === 'business_owner';
  const isVerified = user?.is_verified_seller;
  const [uploadingPfp, setUploadingPfp] = useState(false);

  const handleNavPfpUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploadingPfp(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_picture: file_url });
      window.location.reload();
    } catch (err) {}
    setUploadingPfp(false);
    e.target.value = '';
  };

  const toggleEditMode = () => {
    const next = !editMode;
    setEditModeLocal(next);
    setAdminEditMode(next);
  };

  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) setNameVal(user.full_name || '');
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSaveName = async () => {
    const clean = nameVal.trim().toLowerCase().replace(/\s/g, '');
    if (clean.length < 3) { setNameError('At least 3 characters required.'); return; }
    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) { setNameError('Letters, numbers, _ . - only.'); return; }
    setNameSaving(true);
    setNameError('');
    try {
      const existing = await base44.entities.User.filter({ username: clean });
      const conflict = existing.find(u => u.id !== user.id);
      if (conflict) { setNameError('This username is already taken.'); setNameSaving(false); return; }
      await base44.auth.updateMe({ username: clean, username_set: true });
      setNameSaved(true);
      setEditingName(false);
      setTimeout(() => setNameSaved(false), 2000);
      window.location.reload();
    } catch (e) {
      setNameError('Could not save. Try again.');
    }
    setNameSaving(false);
  };

  const initials = user ? (user.full_name || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const memberSince = user?.created_date ? new Date(user.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';
  const accountTypeLabel = isAdmin ? 'CEO & Founder' : user?.account_type === 'business_owner' ? 'Business Owner' : isSeller ? 'Seller' : 'Customer';
  const accountTypeBadge = user?.account_type === 'business_owner'
    ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/25'
    : isSeller
    ? 'bg-purple-500/15 text-purple-400 border-purple-500/25'
    : 'bg-[#2563EB]/15 text-[#60a5fa] border-[#2563EB]/20';

  return (
    <>
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 text-white py-3 px-4"
        style={{ background: 'linear-gradient(90deg,#0033CC,#1a3de8,#0033CC)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        {isAuthenticated && user ? (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="font-body text-xs sm:text-sm font-semibold">
              Welcome back, <strong>{user.full_name?.split(' ')[0] || 'Member'}</strong>!
            </span>
            <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-bold border border-white/20">{accountTypeLabel}</span>
            {(isAdmin || isVerified) && <MetaVerifiedBadge size="sm" label={isAdmin ? 'CEO & Founder' : 'Verified Partner'} />}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="font-body text-xs sm:text-sm font-semibold text-white/90 text-center">
              🇵🇭 Join <strong>1Market Philippines</strong> — Buy, Sell & Connect!
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="px-5 py-2 bg-white/20 border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/30 transition-all whitespace-nowrap">
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-6 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 whitespace-nowrap"
                style={{ background: '#FFD700', color: '#0033CC', boxShadow: '0 0 14px rgba(255,215,0,0.5)' }}>
                Get Started →
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className={`fixed top-12 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#001a80]/90 backdrop-blur-xl shadow-lg shadow-[#0033CC]/20' : 'bg-transparent'}`}>
        {/* Category Bar */}
        <div className="hidden md:block border-b border-white/8 bg-[#000d40]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-2 h-9">
              <NavCategoryBar />
              {isAuthenticated && user && isSeller && (
                <Link to="/profile?tab=listings"
                  className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg font-body text-xs font-bold text-[#0A192F] transition-all"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  <Plus className="w-3 h-3" /> Add Listing
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16 gap-3">
            {/* Logo — LEFT */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
                alt="1Market Philippines"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-heading font-bold text-base tracking-tight text-white hidden sm:block">
                1Market<span className="text-[#FFD700]">PH</span><span className="text-white/60">.com</span>
              </span>
            </a>

            <NavUserBadge />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Messages button */}
            <Link to="/messages" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/10 transition-all text-white/70 hover:text-[#00D4FF]">
              <MessageSquare className="w-4 h-4" />
              <span className="font-body text-xs font-semibold">Messages</span>
            </Link>

            {/* Favourites */}
            {isAuthenticated && user && (
              <Link to="/favourites" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 hover:border-pink-400/40 hover:bg-pink-500/10 transition-all text-white/70 hover:text-pink-400">
                <Bookmark className="w-4 h-4" />
                <span className="font-body text-xs font-semibold">Saved</span>
              </Link>
            )}

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all">
                    <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="pfp" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-xs">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="flex items-center gap-1">
                        <p className="font-body text-xs text-white font-semibold leading-tight max-w-[80px] truncate">{user.full_name?.split(' ')[0] || 'Account'}</p>
                        {(isAdmin || isVerified) && <MetaVerifiedBadge size="xs" label="" />}
                      </div>
                      <p className="font-body text-[9px] text-[#00D4FF] leading-tight">{isAdmin ? 'CEO & Founder' : user.account_type === 'business_owner' ? 'Business Owner' : isSeller ? 'Seller' : 'Customer'}</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

                        {/* Profile Header */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <label className="relative w-12 h-12 rounded-xl flex-shrink-0 cursor-pointer group">
                              {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="pfp" className="w-full h-full rounded-xl object-cover border border-white/20" />
                              ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-lg">
                                  {initials}
                                </div>
                              )}
                              <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                {uploadingPfp ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                              </div>
                              <input type="file" accept="image/*" className="hidden" onChange={handleNavPfpUpload} disabled={uploadingPfp} />
                            </label>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-1 flex-wrap">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${accountTypeBadge}`}>
                                  {accountTypeLabel}
                                </span>
                                {(isVerified || isAdmin) && (
                                  <MetaVerifiedBadge size="sm" label="Verified Partner" />
                                )}
                              </div>
                              {editingName ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    value={nameVal}
                                    onChange={e => { setNameVal(e.target.value); setNameError(''); }}
                                    className="flex-1 bg-white/10 border border-[#00D4FF]/40 rounded-lg px-2 py-1 text-white font-body text-xs focus:outline-none min-w-0"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') { setEditingName(false); setNameError(''); } }}
                                  />
                                  <button onClick={handleSaveName} disabled={nameSaving}
                                    className="w-6 h-6 rounded-full bg-[#00D4FF] flex items-center justify-center flex-shrink-0">
                                    {nameSaving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Check className="w-3 h-3 text-[#0A192F]" />}
                                  </button>
                                  <button onClick={() => { setEditingName(false); setNameError(''); }} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <X className="w-3 h-3 text-white/50" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <p className="font-body font-bold text-sm text-white truncate">{user.full_name || 'Set Username'}</p>
                                  <button onClick={() => setEditingName(true)}
                                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <Edit2 className="w-2.5 h-2.5 text-white/50" />
                                  </button>
                                  {nameSaved && <span className="text-[9px] text-green-400">Saved</span>}
                                </div>
                              )}
                              {nameError && <p className="font-body text-[9px] text-red-400 mt-0.5">{nameError}</p>}
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[10px] font-body">
                            <div className="flex items-center gap-2 text-white/50">
                              <Mail className="w-3 h-3 text-[#00D4FF] flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            {user.seller_location && (
                              <div className="flex items-center gap-2 text-white/50">
                                <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span>{user.seller_location}{user.seller_area ? ` · ${user.seller_area}` : ''}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white/40">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span>Member since {memberSince}</span>
                              {user.role === 'admin' && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[9px] border border-amber-500/25">
                                  <Shield className="w-2.5 h-2.5 inline mr-0.5" />Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                          {/* Buyer links */}
                          <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <History className="w-3.5 h-3.5 text-[#00D4FF]" /> My Orders
                          </Link>
                          <Link to="/profile?tab=favourites" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <Heart className="w-3.5 h-3.5 text-pink-400" /> Saved Favourites
                          </Link>
                          <Link to="/profile?tab=cart" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <ShoppingCart className="w-3.5 h-3.5 text-green-400" /> My Cart
                          </Link>
                          <button onClick={() => { setShowRewards(true); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-500/10 transition-colors text-purple-300 font-body text-xs">
                            <Gift className="w-3.5 h-3.5" /> Daily Rewards
                          </button>

                          {/* Seller links */}
                          {isSeller && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <p className="px-3 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller Tools</p>
                              <Link to="/profile?tab=listings" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <Package className="w-3.5 h-3.5 text-[#00D4FF]" /> My Listings
                              </Link>
                              <Link to="/profile?tab=sellerorders" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <Truck className="w-3.5 h-3.5 text-green-400" /> Seller Orders
                              </Link>
                              <Link to="/profile?tab=analytics" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <BarChart2 className="w-3.5 h-3.5 text-yellow-400" /> Statistics Dashboard
                              </Link>
                              <Link to={`/seller/${user.username || user.id}`} onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                                <Globe className="w-3.5 h-3.5 text-green-400" /> My Seller Profile
                              </Link>
                              {isVerified && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl mt-1" style={{ background: 'linear-gradient(90deg,rgba(168,85,247,0.12),rgba(56,189,248,0.08))', border: '1px solid rgba(168,85,247,0.25)' }}>
                                  <MetaVerifiedBadge size="sm" label="Verified Partner" />
                                </div>
                              )}
                            </>
                          )}

                          {/* Become Verified Partner section — for non-verified sellers & business owners */}
                          {isSeller && !isVerified && !isAdmin && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <Link to="/profile?tab=verification" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-body text-xs font-bold"
                                style={{ background: 'linear-gradient(90deg,rgba(168,85,247,0.12),rgba(56,189,248,0.08))', border: '1px solid rgba(168,85,247,0.2)' }}>
                                <MetaVerifiedBadge size="xs" label="" />
                                <span className="text-purple-300">Become a Verified Partner</span>
                              </Link>
                            </>
                          )}

                          {!isSeller && (
                            <Link to="/profile?tab=profile" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-[#00D4FF] font-body text-xs font-semibold">
                              <Store className="w-3.5 h-3.5" /> Become a Seller →
                            </Link>
                          )}

                          {/* Admin links */}
                          {isAdmin && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <p className="px-3 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin Panel</p>
                              <Link to="/admin" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors text-amber-400 font-body text-xs">
                                <Settings className="w-3.5 h-3.5" /> Admin Dashboard
                                <MetaVerifiedBadge size="xs" label="" />
                              </Link>
                              <button
                                onClick={() => { toggleEditMode(); setProfileOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-body text-xs font-bold ${editMode ? 'bg-[#00D4FF]/15 text-[#00D4FF]' : 'hover:bg-white/10 text-amber-300'}`}>
                                {editMode ? <><EyeOff className="w-3.5 h-3.5" /> Exit Edit Mode</> : <><Pencil className="w-3.5 h-3.5" /> Enable Edit Mode</>}
                              </button>
                            </>
                          )}

                          <div className="border-t border-white/8 my-1" />
                          <Link to="/profile" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <User className="w-3.5 h-3.5 text-[#00D4FF]" /> My Profile
                          </Link>
                          <button onClick={() => { logout(true); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 font-body text-xs">
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    className="px-4 py-2 border border-white/20 text-white/80 rounded-lg font-body font-bold text-xs hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                    Login
                  </button>
                  <button onClick={() => setShowSignup(true)}
                    className="px-4 py-2 rounded-lg font-body font-bold text-xs text-[#0A192F] transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}>
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A192F]/95 backdrop-blur-xl border-t border-white/10">
              <div className="px-6 py-4 space-y-3">
                {isAuthenticated && user && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${accountTypeBadge}`}>{accountTypeLabel}</span>
                          {(isAdmin || isVerified) && <MetaVerifiedBadge size="xs" label="" />}
                        </div>
                        <p className="font-body text-xs font-bold text-white truncate">{user.full_name || 'Account'}</p>
                        <p className="font-body text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                {isAuthenticated && user ? (
                  <>
                    <Link to="/messages" onClick={() => setMenuOpen(false)}
                      className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                      Messages
                    </Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}
                      className="block text-[#00D4FF] font-body text-sm font-semibold py-2">
                      My Profile
                    </Link>
                    {isSeller && (
                      <>
                        <Link to="/profile?tab=listings" onClick={() => setMenuOpen(false)}
                          className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                          My Listings
                        </Link>
                        <Link to="/profile?tab=analytics" onClick={() => setMenuOpen(false)}
                          className="block text-yellow-300 font-body text-sm font-medium py-2 transition-colors">
                          Statistics Dashboard
                        </Link>
                      </>
                    )}
                    {isSeller && !isVerified && !isAdmin && (
                      <Link to="/profile?tab=verification" onClick={() => setMenuOpen(false)}
                        className="block text-purple-300 font-body text-sm font-medium py-2 transition-colors">
                        Become a Verified Partner
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}
                        className="block text-amber-400 font-body text-sm font-semibold py-2">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/favourites" onClick={() => setMenuOpen(false)}
                      className="block text-pink-300 font-body text-sm font-medium py-2 transition-colors">
                      Saved Favourites
                    </Link>
                    {isSeller && (
                      <Link to="/profile?tab=listings" onClick={() => setMenuOpen(false)}
                        className="block font-body text-sm font-bold py-2 transition-colors"
                        style={{ color: '#00D4FF' }}>
                        + Add New Listing
                      </Link>
                    )}
                    <button onClick={() => { logout(true); setMenuOpen(false); }}
                      className="w-full mt-2 py-2.5 border border-red-500/30 text-red-400 rounded-xl font-body font-bold text-sm hover:bg-red-500/10 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/messages" onClick={() => setMenuOpen(false)}
                      className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                      Messages
                    </Link>
                    <Link to="/explore" onClick={() => setMenuOpen(false)}
                      className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                      Explore Listings
                    </Link>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { setMenuOpen(false); base44.auth.redirectToLogin(window.location.href); }}
                        className="flex-1 py-2.5 border border-white/20 text-white rounded-xl font-body font-bold text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                        Login
                      </button>
                      <button onClick={() => { setMenuOpen(false); setShowSignup(true); }}
                        className="flex-1 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all"
                        style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 14px rgba(0,212,255,0.35)' }}>
                        Get Started
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {showSignup && <AccountTypeModal onClose={() => setShowSignup(false)} />}
        {showRewards && user && <RewardDashboard user={user} onClose={() => setShowRewards(false)} />}
      </AnimatePresence>

      {/* Floating Admin Edit Mode Bar */}
      <AnimatePresence>
        {isAdmin && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl pointer-events-auto"
            style={{
              background: editMode ? 'rgba(0,212,255,0.95)' : 'rgba(13,31,60,0.97)',
              border: `1.5px solid ${editMode ? 'rgba(0,212,255,0.5)' : 'rgba(245,158,11,0.4)'}`,
              backdropFilter: 'blur(14px)'
            }}>
            <Shield className={`w-4 h-4 ${editMode ? 'text-[#0A192F]' : 'text-amber-400'}`} />
            <span className={`font-body text-xs font-bold whitespace-nowrap ${editMode ? 'text-[#0A192F]' : 'text-amber-300'}`}>
              {editMode ? 'Edit Mode ON — Hover any item to edit' : 'Admin Mode'}
            </span>
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs transition-all ${editMode ? 'bg-[#0A192F] text-[#00D4FF] hover:bg-[#0A192F]/80' : 'bg-amber-500 text-white hover:bg-amber-400'}`}>
              {editMode ? <><EyeOff className="w-3 h-3" /> Exit Edit</> : <><Pencil className="w-3 h-3" /> Edit Mode</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}