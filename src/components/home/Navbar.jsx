import React, { useState, useEffect, useRef } from 'react';
import { redirectToLogin } from '@/lib/loginRedirect';
import { Menu, X, LogOut, ChevronDown, Store, Shield, MapPin, Mail, Edit2, Check, User, History, Heart, ShoppingCart, Globe, Truck, Pencil, EyeOff, Package, Settings, Gift, MessageSquare, Plus, Camera, BarChart2, Building2, Users, Bell, Facebook, Instagram, Youtube, Ghost, ShoppingBag, Hourglass } from 'lucide-react';
import GhostAccountBanner from '../GhostAccountBanner';
import BecomeSellerModal from '../BecomeSellerModal';
import BecomeBusinessModal from '../BecomeBusinessModal';
import NotificationsBell from '../NotificationsBell';
import PostListingMenu from '../PostListingMenu';

import RewardDashboard from '../RewardDashboard';
import MetaVerifiedBadge from '../MetaVerifiedBadge';
import OneCheckmark from '../OneCheckmark';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AccountTypeModal from '../AccountTypeModal';
import NavUserBadge from './NavUserBadge';
import NavCategoryBar from './NavCategoryBar';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { uploadProfilePicture } from '@/lib/supabaseStorage';
import { getGhostSession, clearGhostSession } from '@/lib/ghostAccounts';
import { supabaseCompat } from '@/api/supabaseCompatClient';
import GhostAccountMenu from '@/components/GhostAccountMenu';
import { MARKETPH_LOGO } from '@/lib/brandAssets';

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

// Admin access is determined centrally via lib/adminAuth.js

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditModeLocal] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const { user, isAuthenticated, logout, checkUserAuth } = useAuth();
  const [ghostUser, setGhostUser] = useState(null);
  
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };
  
  // Check for ghost session on mount — re-read on every render by checking sessionStorage directly
  useEffect(() => {
    const ghost = getGhostSession();
    setGhostUser(ghost || null);
  }, []);

  // Also re-read ghost session whenever the window gains focus (after refresh)
  useEffect(() => {
    const handler = (event) => {
      const ghost = getGhostSession();
      setGhostUser(ghost || null);
      if (!ghost && event?.detail) checkUserAuth?.();
    };
    window.addEventListener('ghost-session-changed', handler);
    window.addEventListener('active-user-changed', handler);
    return () => {
      window.removeEventListener('ghost-session-changed', handler);
      window.removeEventListener('active-user-changed', handler);
    };
  }, []);
  
  // Use ghost user if in ghost session, otherwise use regular user
  const isGhostSession = !!ghostUser;
  // isAdmin: STRICTLY NEVER true in any ghost session — ghost completely overrides admin state
  const isAdmin = !isGhostSession && !!(user?.email?.toLowerCase() === 'kevinarnold522@gmail.com');
  const activeUser = isGhostSession ? ghostUser : user;
  // ALL type flags derived exclusively from activeUser (ghost data takes absolute precedence)
  const isSeller = !!(activeUser?.user_type === 'seller' || activeUser?.user_type === 'business' || activeUser?.is_seller || activeUser?.account_type === 'business_owner');
  const isBusiness = !!(activeUser?.user_type === 'business');
  const isRider = !!(activeUser?.user_type === 'rider');
  const isCustomer = !isSeller && !isBusiness && !isRider;
  // Verified: never show ghost accounts as verified
  const isVerified = !isGhostSession && !!(activeUser?.is_verified_seller);
  // adminLabel: derive purely from activeUser data, never ghost as admin
  const adminLabel = isAdmin ? 'CEO & Founder'
    : isGhostSession
      ? (ghostUser?.user_type === 'business' ? (ghostUser?.business_name || 'Business Account')
        : ghostUser?.user_type === 'seller' ? 'Sales Account'
        : ghostUser?.user_type === 'rider' ? 'Rider Delivery'
        : 'Customer Account')
    : isBusiness ? (activeUser?.business_name || 'Business Account')
    : isRider ? 'Rider Delivery'
    : isSeller ? 'Sales Account'
    : 'Customer Account';
  const [uploadingPfp, setUploadingPfp] = useState(false);

  const handleNavPfpUpload = async (e) => {
    if (isGhostSession) { showToast('Created users manage profile photos from their own profile.'); return; }
    const file = e.target.files[0]; if (!file) return;
    setUploadingPfp(true);
    try {
      const { file_url } = await uploadProfilePicture(file);
      await base44.auth.updateMe({ profile_picture: file_url });
      await checkUserAuth?.();
      showToast('Profile photo saved');
    } catch (err) { 
      console.error('[v0] Profile picture upload error:', err);
      showToast(err.message || 'Upload failed'); 
    } finally {
      setUploadingPfp(false);
      e.target.value = '';
    }
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
    if (activeUser) setNameVal(activeUser.full_name || '');
  }, [activeUser]);

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
    if (isGhostSession) { showToast('Created user profile names are edited on the profile page'); return; }
    const clean = nameVal.trim().toLowerCase().replace(/\s/g, '');
    if (clean.length < 3) { setNameError('At least 3 characters required.'); return; }
    if (!/^[a-zA-Z0-9_.-]+$/.test(clean)) { setNameError('Letters, numbers, _ . - only.'); return; }
    setNameSaving(true);
    setNameError('');
    try {
      const existing = await base44.entities.User.filter({ username: clean });
      const conflict = existing.find(u => u.id !== user?.id);
      if (conflict) { setNameError('This username is already taken.'); setNameSaving(false); return; }
      await base44.auth.updateMe({ username: clean, username_set: true });
      await checkUserAuth?.();
      setNameSaved(true);
      setEditingName(false);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (e) {
      setNameError('Could not save. Try again.');
    }
    setNameSaving(false);
  };

  const initials = activeUser ? (activeUser.full_name || activeUser.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const memberSince = activeUser?.created_date ? new Date(activeUser.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';
  const accountTypeBadge = activeUser?.account_type === 'business_owner'
    ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/25'
    : isSeller
    ? 'bg-purple-500/15 text-purple-400 border-purple-500/25'
    : isAdmin
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/25'
    : 'bg-[#2563EB]/15 text-[#60a5fa] border-[#2563EB]/20';

  return (
    <>
      {/* Top Banner - Social Media Links - PERMANENTLY VISIBLE FOR ALL USERS */}
      <div className={`fixed top-0 left-0 right-0 z-[60] text-white py-2 px-4 backdrop-blur-2xl`}
        style={{ background: 'linear-gradient(90deg,rgba(0,51,204,0.82),rgba(37,99,235,0.72),rgba(0,51,204,0.82))', borderBottom: '1px solid rgba(255,255,255,0.22)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 28px rgba(0,51,204,0.28)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: welcome or tagline */}
          <div className="flex-1 min-w-0">
            {isAuthenticated && (activeUser || user) ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body text-xs font-semibold truncate">
                  Welcome, <strong>{activeUser?.full_name?.split(' ')[0] || 'Member'}</strong>!
                </span>
                {isAdmin && !isGhostSession && <MetaVerifiedBadge size="sm" label="CEO" />}
                {isVerified && !isAdmin && !isGhostSession && <MetaVerifiedBadge size="sm" label="Verified" />}
              </div>
            ) : (
              <span className="font-body text-xs font-semibold text-white/90 hidden sm:block">
                Join <strong>1MarketPH</strong> — Buy, Sell &amp; Connect!
              </span>
            )}
          </div>
          <div className="flex-shrink-0" />
        </div>
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-2xl ${scrolled ? 'shadow-2xl shadow-[#0033CC]/35' : 'shadow-lg shadow-[#0033CC]/20'}`} style={{ background: scrolled ? 'linear-gradient(135deg,rgba(0,51,204,0.86),rgba(37,99,235,0.72))' : 'linear-gradient(135deg,rgba(0,51,204,0.72),rgba(37,99,235,0.56))', borderBottom: '1px solid rgba(255,255,255,0.2)', WebkitBackdropFilter: 'blur(28px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' }}>
        {/* Category Bar — LEFT aligned */}
        <div className="hidden md:block border-b border-white/15 backdrop-blur-2xl" style={{ overflow: 'visible', background: 'linear-gradient(90deg,rgba(0,51,204,0.7),rgba(37,99,235,0.45),rgba(0,51,204,0.7))' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8" style={{ paddingLeft: 240, overflow: 'visible' }}>
            <div className="flex items-center gap-2 h-9" style={{ overflow: 'visible' }}>
              <NavCategoryBar />
              <Link to="/community" className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-body text-xs font-semibold text-purple-400 hover:bg-white/8 transition-all whitespace-nowrap ml-1">
                <Users className="w-3 h-3" /> Community
              </Link>
              {isAuthenticated && activeUser && (isAdmin || (isSeller && !isRider && !isCustomer)) && (
                <div className="ml-auto flex-shrink-0">
                  <PostListingMenu user={activeUser} compact />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-14 lg:h-16 gap-3">
            {/* Logo — LEFT */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src={MARKETPH_LOGO}
                alt="1Market Philippines"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-heading font-bold text-base tracking-tight text-white hidden lg:block">
                1Market<span className="text-[#FFD700]">PH</span><span className="text-white/60">.com</span>
              </span>
            </a>

            <NavUserBadge />

            {/* Spacer */}
            <div className="flex-shrink-0" />

            {isAuthenticated && activeUser && (isAdmin || (isSeller && !isRider && !isCustomer)) && (
              <div className="hidden md:block">
                <PostListingMenu user={activeUser} compact />
              </div>
            )}

            {isAdmin && !isGhostSession && (
              <div className="hidden md:block">
                <GhostAccountMenu compact />
              </div>
            )}

            {/* Messages button — signed-in only */}
            {isAuthenticated && activeUser && (
              <Link to="/messages" className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all group"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.18)' }}>
                  <MessageSquare className="w-3 h-3 text-[#00D4FF]" />
                </div>
                <span className="font-body text-xs font-semibold text-[#00D4FF]/80 group-hover:text-[#00D4FF]">Messages</span>
              </Link>
            )}

            {/* Favourites */}
            {isAuthenticated && activeUser && (
              <Link to="/favourites" className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all group"
                style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,72,153,0.18)' }}>
                  <Heart className="w-3 h-3 text-pink-400" />
                </div>
                <span className="font-body text-xs font-semibold text-pink-400/80 group-hover:text-pink-400">Saved</span>
              </Link>
            )}

            {/* Community */}
            <Link to="/community" className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all group"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.18)' }}>
                <Users className="w-3 h-3 text-purple-400" />
              </div>
              <span className="font-body text-xs font-semibold text-purple-400/80 group-hover:text-purple-400">Community</span>
            </Link>

            {/* Notifications */}
            {isAuthenticated && activeUser ? (
              <div className="hidden md:flex items-center gap-1">
                <NotificationsBell user={activeUser} />
                <Link to="/notifications" className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00D4FF]/40 transition-all text-white/50 hover:text-[#00D4FF] font-body text-[10px] font-semibold">
                  All
                </Link>
              </div>
            ) : (
              <Link to="/notifications" className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.18)' }}>
                  <Bell className="w-3 h-3 text-amber-400" />
                </div>
              </Link>
            )}

            {/* Desktop Right - Categories for signed-in, Login/Get Started for guests */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && activeUser ? (
                <>
                  {/* Categories dropdown for signed-in users */}
                  <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all text-white font-body text-xs font-bold">
                      <ShoppingBag className="w-4 h-4" /> Categories
                    </button>
                  </div>
                  {/* Account dropdown */}
                  <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center gap-1">
                    <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-all"
                      title="Go to my profile">
                      <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                        {activeUser?.profile_picture ? (
                          <img src={activeUser.profile_picture} alt="pfp" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full rounded-lg flex items-center justify-center text-white font-heading font-bold text-xs ${isGhostSession ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-[#2563EB] to-[#00D4FF]'}`}>
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="flex items-center gap-1">
                          <p className="font-body text-xs text-white font-semibold leading-tight max-w-[80px] truncate">{activeUser.full_name?.split(' ')[0] || 'Account'}</p>
                          {(isAdmin || isVerified) && isSeller && !isGhostSession && <MetaVerifiedBadge size="xs" label="" />}

                        </div>
                        <p className={`font-body text-[9px] leading-tight ${isGhostSession ? 'text-purple-400' : 'text-[#00D4FF]'}`}>{adminLabel}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => setProfileOpen(p => !p)}
                      title="Open account menu"
                      className="flex items-center px-1 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all">
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.92),rgba(37,99,235,0.82))', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', boxShadow: '0 24px 60px rgba(0,51,204,0.38), inset 0 1px 0 rgba(255,255,255,0.18)' }}>

                        {/* Profile Header */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <label className="relative w-12 h-12 rounded-xl flex-shrink-0 cursor-pointer group">
                              {activeUser?.profile_picture ? (
                                <img src={activeUser.profile_picture} alt="pfp" className="w-full h-full rounded-xl object-cover border border-white/20" />
                              ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-lg">
                                  {initials}
                                </div>
                              )}
                              {!isGhostSession && (
                                <>
                                  <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {uploadingPfp ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                                  </div>
                                  <input type="file" accept="image/*" className="hidden" onChange={handleNavPfpUpload} disabled={uploadingPfp} />
                                </>
                              )}
                            </label>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-1 flex-wrap">
                                <span className="inline-flex items-center font-body font-bold uppercase tracking-wider"
                                  style={{ fontSize: '9px', padding: '3px 10px', borderRadius: '5px', background: isAdmin ? 'rgba(245,158,11,0.2)' : isBusiness ? 'rgba(37,99,235,0.2)' : isRider ? 'rgba(245,158,11,0.15)' : isSeller ? 'rgba(16,185,129,0.15)' : isGhostSession ? 'rgba(168,85,247,0.15)' : 'rgba(37,99,235,0.15)', border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.5)' : isBusiness ? 'rgba(37,99,235,0.5)' : isRider ? 'rgba(245,158,11,0.45)' : isSeller ? 'rgba(16,185,129,0.45)' : isGhostSession ? 'rgba(168,85,247,0.4)' : 'rgba(37,99,235,0.4)'}`, color: isAdmin ? '#fbbf24' : isBusiness ? '#93c5fd' : isRider ? '#fde68a' : isSeller ? '#6ee7b7' : isGhostSession ? '#d8b4fe' : '#60a5fa' }}>
                                  {adminLabel}
                                </span>
                                {isAdmin && !isGhostSession && <MetaVerifiedBadge size="sm" label="CEO" />}
                                {isVerified && !isAdmin && isSeller && !isGhostSession && <MetaVerifiedBadge size="sm" label="Verified Partner" />}
                              </div>
                              {editingName && !isGhostSession ? (
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
                                  <p className="font-body font-bold text-sm text-white truncate">{activeUser.full_name || activeUser.channel_name || 'Account'}</p>
                                  {!isGhostSession && (
                                    <button onClick={() => setEditingName(true)}
                                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                                      <Edit2 className="w-2.5 h-2.5 text-white/50" />
                                    </button>
                                  )}
                                  {nameSaved && <span className="text-[9px] text-green-400">Saved</span>}
                                </div>
                              )}
                              {nameError && <p className="font-body text-[9px] text-red-400 mt-0.5">{nameError}</p>}
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[10px] font-body">
                            <div className="flex items-center gap-2 text-white/50">
                              <Mail className="w-3 h-3 text-[#00D4FF] flex-shrink-0" />
                              {/* Ghost: show channel/business name, never internal ghost email */}
                              <span className="truncate">
                                {isGhostSession
                                  ? (ghostUser?.channel_name || ghostUser?.business_name || ghostUser?.full_name || 'Test Account')
                                  : activeUser.email}
                              </span>
                            </div>
                            {activeUser.seller_location && (
                              <div className="flex items-center gap-2 text-white/50">
                                <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span>{activeUser.seller_location}{activeUser.seller_area ? ` · ${activeUser.seller_area}` : ''}</span>
                              </div>
                            )}
                            {isGhostSession && ghostUser?.user_type && (
                              <div className="flex items-center gap-2 text-white/40">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span>{adminLabel}</span>
                              </div>
                            )}
                            {!isGhostSession && (
                              <div className="flex items-center gap-2 text-white/40">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span>Member since {memberSince}</span>
                                {isAdmin && (
                                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[9px] border border-amber-500/25">
                                    <Shield className="w-2.5 h-2.5 inline mr-0.5" />CEO
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                          {/* View Public Profile - for both regular and ghost */}
                          <Link to={`/seller/${isGhostSession ? (ghostUser?.username || ghostUser?.id) : (user?.username || user?.id)}`} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00D4FF]/8 border border-[#00D4FF]/15 hover:bg-[#00D4FF]/15 transition-colors text-[#00D4FF] font-body text-xs font-bold mb-1">
                            <Globe className="w-3.5 h-3.5" /> View My Public Profile
                          </Link>
                          
                          {/* Buyer links - for both */}
                          <Link to="/orders" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <History className="w-3.5 h-3.5 text-[#00D4FF]" /> My Orders
                          </Link>
                          <Link to="/favourites" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <Heart className="w-3.5 h-3.5 text-pink-400" /> Saved Favourites
                          </Link>
                          <Link to="/cart" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                            <ShoppingCart className="w-3.5 h-3.5 text-green-400" /> My Cart
                          </Link>
                          <button onClick={() => { setShowRewards(true); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-500/10 transition-colors text-purple-300 font-body text-xs">
                            <Gift className="w-3.5 h-3.5" /> Daily Rewards
                          </button>

                          {/* Seller links - for both regular and ghost sellers */}
                          {(isSeller || (isGhostSession && ghostUser?.user_type === 'seller')) && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <p className="px-3 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller Tools</p>
                              <div className="px-3 py-1.5">
                                <PostListingMenu user={activeUser} compact={false} />
                              </div>
                              {/* Admin-only: Connected Accounts — never in ghost session */}
                              {isAdmin && !isGhostSession && (
                                <Link to="/connected-accounts" onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-body text-xs font-bold mb-1"
                                  style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.15),rgba(124,58,237,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
                                  <Ghost className="w-3.5 h-3.5 text-purple-400" /> <span className="text-purple-300">Connected Accounts</span>
                                </Link>
                              )}
                              {/* Never show Connected Accounts to non-admin */}
                              <Link to="/my-listings" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <Package className="w-3.5 h-3.5 text-[#00D4FF]" /> My Listings
                              </Link>
                              <Link to="/seller-orders" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <Truck className="w-3.5 h-3.5 text-green-400" /> Seller Orders
                              </Link>
                              <Link to="/my-analytics" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                                <BarChart2 className="w-3.5 h-3.5 text-yellow-400" /> Statistics Dashboard
                              </Link>
                              <Link to={`/seller/${isGhostSession ? (ghostUser?.username || ghostUser?.id) : (user?.username || user?.id)}`} onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                                <Globe className="w-3.5 h-3.5 text-green-400" /> My Seller Profile
                              </Link>
                            </>
                          )}

                          {/* Admin links — real owner only, never ghost session */}
                          {isAdmin && !isGhostSession && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <p className="px-3 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin Panel</p>
                              <Link to="/admin" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors text-amber-400 font-body text-xs">
                                <Settings className="w-3.5 h-3.5" /> CEO Dashboard
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
                          <button onClick={() => {
                            if (isGhostSession) {
                              clearGhostSession();
                              setProfileOpen(false);
                              window.location.href = '/';
                            } else {
                              logout(true); setProfileOpen(false);
                            }
                          }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 font-body text-xs">
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="px-4 py-2 border border-white/20 text-white/80 rounded-lg font-body font-bold text-xs hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                    Login
                  </Link>
                  <button onClick={() => { setShowSignup(true); window.dispatchEvent(new CustomEvent('alfie-get-started')); }}
                    className="px-4 py-2 rounded-lg font-body font-bold text-xs text-[#0A192F] transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}>
                    Signup
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
              className="md:hidden backdrop-blur-2xl border-t border-white/15" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.94),rgba(37,99,235,0.84))' }}>
              <div className="px-6 py-4 space-y-3">
                {isAdmin && !isGhostSession && (
                  <div className="mb-2">
                    <GhostAccountMenu onAction={() => setMenuOpen(false)} />
                  </div>
                )}
                {isAuthenticated && activeUser && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm bg-gradient-to-br from-[#2563EB] to-[#00D4FF]">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                          <span className="inline-flex items-center font-body font-bold uppercase tracking-wider"
                            style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '4px', background: isAdmin ? 'rgba(245,158,11,0.2)' : isBusiness ? 'rgba(37,99,235,0.2)' : isSeller ? 'rgba(16,185,129,0.15)' : 'rgba(37,99,235,0.15)', border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.4)' : isBusiness ? 'rgba(37,99,235,0.4)' : isSeller ? 'rgba(16,185,129,0.35)' : 'rgba(37,99,235,0.3)'}`, color: isAdmin ? '#fbbf24' : isBusiness ? '#93c5fd' : isSeller ? '#6ee7b7' : '#60a5fa' }}>
                            {adminLabel}
                          </span>
                          {isAdmin && !isGhostSession && <MetaVerifiedBadge size="xs" label="" />}
                        </div>
                        <p className="font-body text-xs font-bold text-white truncate">{activeUser.full_name || activeUser.channel_name || 'Account'}</p>
                        {/* Ghost: never show internal email */}
                        <p className="font-body text-[10px] truncate text-white/40">
                          {isGhostSession
                            ? (ghostUser?.channel_name || ghostUser?.business_name || ghostUser?.full_name || 'Test Account')
                            : activeUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {isAuthenticated && activeUser ? (
                  <>
                    <Link to="/messages" onClick={() => setMenuOpen(false)}
                      className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                      Messages
                    </Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}
                      className="block text-[#00D4FF] font-body text-sm font-semibold py-2">
                      My Profile
                    </Link>
                    {(isAdmin || (isSeller && !isRider && !isCustomer)) && (
                      <>
                        <div className="py-1">
                          <PostListingMenu user={activeUser} compact={true} onSelect={() => setMenuOpen(false)} />
                        </div>
                        <Link to="/my-listings" onClick={() => setMenuOpen(false)}
                          className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                          My Listings
                        </Link>
                        <Link to="/my-analytics" onClick={() => setMenuOpen(false)}
                          className="block text-yellow-300 font-body text-sm font-medium py-2 transition-colors">
                          Statistics Dashboard
                        </Link>
                      </>
                    )}
                    {isSeller && !isVerified && !isAdmin && !user?.verification_submitted && (
                      <Link to="/profile?tab=sellerpage" onClick={() => setMenuOpen(false)}
                        className="block text-purple-300 font-body text-sm font-medium py-2 transition-colors">
                        <Check className="w-3.5 h-3.5 inline mr-1" /> Apply for Verified Partner
                      </Link>
                    )}
                    {isSeller && !isVerified && !isAdmin && user?.verification_submitted && (
                      <span className="block text-amber-400 font-body text-sm py-2"><Hourglass className="w-3.5 h-3.5 inline mr-1" /> Verification Pending</span>
                    )}
                    {isCustomer && !isSeller && !isBusiness && !isGhostSession && (
                      <>
                        <button onClick={() => { setMenuOpen(false); navigate('/onboarding'); }}
                          className="block w-full text-left text-emerald-400 font-body text-sm font-semibold py-2 transition-colors">
                          Become a Seller
                        </button>
                        <button onClick={() => { setMenuOpen(false); navigate('/onboarding'); }}
                         className="block w-full text-left text-[#3E97F1] font-body text-sm font-semibold py-2 transition-colors">
                         Convert To Business Account
                        </button>
                      </>
                    )}
                    {isAdmin && !isGhostSession && (
                      <>
                        <Link to="/admin" onClick={() => setMenuOpen(false)}
                          className="block text-amber-400 font-body text-sm font-semibold py-2">
                          Admin Dashboard
                        </Link>
                        <Link to="/connected-accounts" onClick={() => setMenuOpen(false)}
                          className="block text-purple-400 font-body text-sm font-semibold py-2">
                          Connected Accounts
                        </Link>
                      </>
                    )}
                    <Link to="/favourites" onClick={() => setMenuOpen(false)}
                      className="block text-pink-300 font-body text-sm font-medium py-2 transition-colors">
                      Saved Favourites
                    </Link>

                    <button onClick={() => {
                      if (isGhostSession) {
                        clearGhostSession();
                        setMenuOpen(false);
                        window.location.href = '/';
                      } else {
                        logout(true); setMenuOpen(false);
                      }
                    }}
                      className="w-full mt-2 py-2.5 border border-red-500/30 text-red-400 rounded-xl font-body font-bold text-sm hover:bg-red-500/10 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/post-ad" onClick={() => setMenuOpen(false)}
                      className="block text-[#FFD700] font-body text-sm font-bold py-2 transition-colors">
                      <Plus className="w-3.5 h-3.5 inline mr-1" /> Post a Listing
                    </Link>
                    <Link to="/explore" onClick={() => setMenuOpen(false)}
                      className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                      Explore Listings
                    </Link>
                    <div className="flex gap-2 mt-2">
                      <Link to="/login" onClick={() => setMenuOpen(false)}
                        className="flex-1 py-2.5 border border-white/20 text-white text-center rounded-xl font-body font-bold text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                        Login
                      </Link>
                      <button onClick={() => { setMenuOpen(false); setShowSignup(true); }}
                        className="flex-1 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all text-center"
                        style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 14px rgba(0,212,255,0.35)' }}>
                        Signup
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
        {showSellerModal && user && (
          <BecomeSellerModal user={user} onClose={() => setShowSellerModal(false)} onSuccess={() => { checkUserAuth?.(); setShowSellerModal(false); }} />
        )}
        {showBusinessModal && user && (
          <BecomeBusinessModal user={user} onClose={() => setShowBusinessModal(false)} onSuccess={() => { checkUserAuth?.(); setShowBusinessModal(false); }} />
        )}
      </AnimatePresence>

      {/* Floating Admin Edit Mode Bar */}
      <AnimatePresence>
        {isAdmin && isAuthenticated && !isGhostSession && (
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