import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, ChevronDown, Store, Shield, MapPin, Mail, Edit2, Check, User, BadgeCheck, History, Heart, ShoppingCart, Globe, Truck, Pencil, EyeOff, Star, Package, Settings, Gift } from 'lucide-react';
import RewardDashboard from '../RewardDashboard';
import VerifiedBadge from '../VerifiedBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AccountTypeModal from '../AccountTypeModal';
import NavUserBadge from './NavUserBadge';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

// Global edit mode state (simple module-level so any component can read it)
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

  const toggleEditMode = () => {
    const next = !editMode;
    setEditModeLocal(next);
    setAdminEditMode(next);
  };

  // Inline edit states
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

  // Close dropdown on outside click
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
      if (conflict) {
        setNameError('This username is already taken.');
        setNameSaving(false);
        return;
      }
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

  const links = [];

  const initials = user ? (user.full_name || user.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const memberSince = user?.created_date ? new Date(user.created_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' }) : '';
  const accountTypeLabel = isAdmin ? '🛡️ Administrator' : user?.account_type === 'business_owner' ? '🏪 Business Owner' : '🛍️ Customer';
  const accountTypeBadge = user?.account_type === 'business_owner'
    ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/25'
    : 'bg-[#2563EB]/15 text-[#60a5fa] border-[#2563EB]/20';

  return (
    <>
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#00D4FF] text-[#0A192F] py-2 px-3 text-center flex items-center justify-center flex-wrap gap-x-2">
        {isAuthenticated && user ? (
          <>
            <span className="font-body text-[11px] sm:text-xs font-semibold">👋 Welcome back, <strong>{user.full_name?.split(' ')[0] || 'Member'}</strong>! You're signed in.</span>
            <span className="px-2 py-0.5 bg-[#0A192F]/15 rounded-full text-[10px] font-bold">{accountTypeLabel}</span>
          </>
        ) : (
          <>
            <span className="font-body text-[11px] sm:text-xs font-semibold">🎉 Sign Up or Sign In to access deals & your account.</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="px-3 py-0.5 bg-white/30 text-[#0A192F] rounded-full text-[11px] sm:text-xs font-bold hover:bg-white/50 transition-colors whitespace-nowrap">
                Sign In
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-3 py-0.5 bg-[#0A192F] text-white rounded-full text-[11px] sm:text-xs font-bold hover:bg-[#2563EB] transition-colors whitespace-nowrap">
                Sign Up →
              </button>
            </div>
          </>
        )}
      </div>

      <nav className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A192F]/80 backdrop-blur-xl shadow-lg shadow-[#0A192F]/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-heading font-bold text-sm">1</span>
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-gray-50">
                Marketph<span className="text-[#00D4FF]">.com</span>
              </span>
            </a>

            <NavUserBadge />

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link key={link.label} to={link.href}
                  className="relative font-body text-sm font-medium tracking-wide transition-colors duration-300 group text-white/80 hover:text-[#00D4FF]">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-xs">
                      {initials}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="font-body text-xs text-white font-semibold leading-tight max-w-[80px] truncate">{user.full_name?.split(' ')[0] || 'Account'}</p>
                      <p className="font-body text-[9px] text-[#00D4FF] leading-tight">{isAdmin ? 'Administrator' : user.account_type === 'business_owner' ? 'Business Owner' : 'Customer'}</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

                        {/* Profile Header */}
                        <div className="p-4 border-b border-white/10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              {/* Account type badge */}
                              <div className="flex items-center gap-1 mb-1">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${accountTypeBadge}`}>
                                  {accountTypeLabel}
                                </span>
                                {user?.is_verified_seller && !isAdmin && !isSeller && <VerifiedBadge size="sm" variant="yellow" />}
                              {user?.is_verified_seller && (isAdmin || isSeller) && <VerifiedBadge size="sm" variant="purple" />}
                              {isAdmin && <BadgeCheck className="w-3.5 h-3.5 text-amber-400" title="Admin — Verified" />}
                              </div>
                              {/* Editable username */}
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
                                  {nameSaved && <span className="text-[9px] text-green-400">✓ Saved</span>}
                                </div>
                              )}
                              {nameError && <p className="font-body text-[9px] text-red-400 mt-0.5">{nameError}</p>}
                            </div>
                          </div>

                          {/* User details */}
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
                          <Gift className="w-3.5 h-3.5" /> Daily Rewards 🎁
                        </button>

                        {/* Seller links */}
                        {isSeller && (
                          <>
                            <div className="border-t border-white/8 my-1" />
                            <p className="px-3 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller Tools</p>
                            <Link to="/profile?tab=listings" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                              <Package className="w-3.5 h-3.5 text-[#00D4FF]"/> My Listings
                            </Link>
                            <Link to="/profile?tab=sellerorders" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                              <Truck className="w-3.5 h-3.5 text-green-400"/> Seller Orders
                            </Link>
                            <Link to={`/seller/${user.username || user.id}`} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                              <Globe className="w-3.5 h-3.5 text-green-400"/> My Seller Profile
                            </Link>
                                        {user?.is_verified_seller && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: isAdmin ? 'linear-gradient(90deg,rgba(168,85,247,0.15),rgba(236,72,153,0.1))' : 'linear-gradient(90deg,rgba(251,191,36,0.15),rgba(249,115,22,0.1))', border: isAdmin ? '1px solid rgba(168,85,247,0.2)' : '1px solid rgba(251,191,36,0.25)' }}>
                                <VerifiedBadge size="sm" variant={isAdmin ? 'purple' : 'yellow'} />
                                <span className="font-body text-[10px] font-bold" style={{ background: isAdmin ? 'linear-gradient(90deg,#a855f7,#ec4899)' : 'linear-gradient(90deg,#fbbf24,#f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>✓ {isAdmin ? 'Verified Partner' : 'Verified Member'}</span>
                              </div>
                            )}
                          </>
                        )}

                        {!isSeller && (
                          <Link to="/profile?tab=profile" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-[#00D4FF] font-body text-xs font-semibold">
                            <Store className="w-3.5 h-3.5"/> Become a Seller →
                          </Link>
                        )}

                        {/* Admin links */}
                        {isAdmin && (
                          <>
                            <div className="border-t border-white/8 my-1" />
                            <p className="px-3 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin Panel</p>
                            <Link to="/admin" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors text-amber-400 font-body text-xs">
                              <Settings className="w-3.5 h-3.5"/> Admin Dashboard
                            </Link>
                            <button
                              onClick={() => { toggleEditMode(); setProfileOpen(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-body text-xs font-bold ${editMode ? 'bg-[#00D4FF]/15 text-[#00D4FF]' : 'hover:bg-white/10 text-amber-300'}`}
                            >
                              {editMode ? <><EyeOff className="w-3.5 h-3.5"/> Exit Edit Mode</> : <><Pencil className="w-3.5 h-3.5"/> Enable Edit Mode</>}
                            </button>
                          </>
                        )}

                        <div className="border-t border-white/8 my-1" />
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white font-body text-xs">
                          <User className="w-3.5 h-3.5 text-[#00D4FF]"/> Account Settings
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
                    Sign In
                  </button>
                  <button onClick={() => setShowSignup(true)}
                    className="px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
                    Sign Up Free
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
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border mb-0.5 ${accountTypeBadge}`}>{accountTypeLabel}</span>
                        <p className="font-body text-xs font-bold text-white truncate">{user.full_name || 'Account'}</p>
                        <p className="font-body text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                {links.map((link) => (
                  <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)}
                    className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)}
                      className="block text-[#00D4FF] font-body text-sm font-semibold py-2">
                      🏠 My Dashboard
                    </Link>
                    {(user.is_seller || user.account_type === 'business_owner') && (
                      <Link to="/profile?tab=listings" onClick={() => setMenuOpen(false)}
                        className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                        🏪 My Listings
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}
                        className="block text-amber-400 font-body text-sm font-semibold py-2">
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { logout(true); setMenuOpen(false); }}
                      className="w-full mt-2 py-2.5 border border-red-500/30 text-red-400 rounded-xl font-body font-bold text-sm hover:bg-red-500/10 transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setMenuOpen(false); base44.auth.redirectToLogin(window.location.href); }}
                      className="flex-1 py-2.5 border border-white/20 text-white rounded-xl font-body font-bold text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => { setMenuOpen(false); setShowSignup(true); }}
                      className="flex-1 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
                      Sign Up
                    </button>
                  </div>
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
            }}
          >
            <Shield className={`w-4 h-4 ${editMode ? 'text-[#0A192F]' : 'text-amber-400'}`} />
            <span className={`font-body text-xs font-bold whitespace-nowrap ${editMode ? 'text-[#0A192F]' : 'text-amber-300'}`}>
              {editMode ? '✏️ Edit Mode ON — Hover any item to edit' : '🛡️ Admin Mode'}
            </span>
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs transition-all ${editMode ? 'bg-[#0A192F] text-[#00D4FF] hover:bg-[#0A192F]/80' : 'bg-amber-500 text-white hover:bg-amber-400'}`}
            >
              {editMode ? <><EyeOff className="w-3 h-3"/> Exit Edit</> : <><Pencil className="w-3 h-3"/> Edit Mode</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}