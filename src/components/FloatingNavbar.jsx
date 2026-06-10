import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Plane, UtensilsCrossed, ShoppingBag, KeyRound, Wrench, Briefcase, Users, Heart, MessageSquare, Bell, User, LogOut, Ghost, Globe, Package, BarChart2, Shield, Search, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { getImpersonatedUser, clearImpersonation } from '@/pages/ConnectedAccounts';
import MetaVerifiedBadge from './MetaVerifiedBadge';
import PostListingMenu from './PostListingMenu';
import NotificationsBell from './NotificationsBell';

const OWNER_EMAIL = 'Kevinarnold522@gmail.com';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', color: '#00D4FF' },
  { to: '/travel', icon: Plane, label: 'Travel', color: '#0ea5e9' },
  { to: '/food', icon: UtensilsCrossed, label: 'Food', color: '#f97316' },
  { to: '/buysell', icon: ShoppingBag, label: 'Buy & Sell', color: '#8b5cf6' },
  { to: '/rent', icon: KeyRound, label: 'Rent/Sale', color: '#10b981' },
  { to: '/services', icon: Wrench, label: 'Services', color: '#3b82f6' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs', color: '#f59e0b' },
  { to: '/community', icon: Users, label: 'Community', color: '#a855f7' },
];

export default function FloatingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const [ghostUser, setGhostUser] = useState(null);
  const navigate = useNavigate();

  // Check for ghost session on mount
  useEffect(() => {
    const ghost = getImpersonatedUser();
    if (ghost) {
      setGhostUser(ghost);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('[data-navbar]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeUser = ghostUser || user;
  const isAdmin = !ghostUser && (activeUser?.role === 'admin' || activeUser?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
  const isGhostSession = !!ghostUser;
  const isSeller = activeUser?.user_type === 'seller' || activeUser?.is_seller || activeUser?.account_type === 'business_owner';
  const isBusiness = activeUser?.user_type === 'business';
  const isVerified = activeUser?.is_verified_seller;
  const isGhost = activeUser?.is_ghost_account || activeUser?.ghost_id;
  const initials = activeUser ? (activeUser.full_name || activeUser.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

return (
    <>
      {/* Floating Top-Left Navbar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed top-4 left-4 z-[100]"
        data-navbar
      >
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-105"
          style={{
            background: scrolled ? 'rgba(13,31,60,0.95)' : 'rgba(13,31,60,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(0,212,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1)',
          }}
          data-navbar
        >
          <Menu className={`w-5 h-5 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 w-80 rounded-2xl overflow-hidden shadow-2xl mt-2"
              style={{
                background: 'rgba(13,31,60,0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(0,212,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.15)',
              }}
              data-navbar
            >
              {/* Header with Logo */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <img
                  src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
                  alt="1MarketPH"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-heading font-bold text-sm text-white">1Market<span className="text-[#FFD700]">PH</span></p>
                  <p className="font-body text-[9px] text-white/40">Buy, Sell & Connect</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="px-4 py-3 border-b border-white/8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search listings..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 pl-9 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                </div>
              </form>

              {/* Navigation Menu */}
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                {/* Main Navigation */}
                <div className="space-y-0.5 mb-3">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/10 group"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                      <span className="font-body text-sm font-semibold text-white/80 group-hover:text-white">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Auth Section */}
                {isAuthenticated && activeUser ? (
                  <>
                    {/* User Info */}
                    <div className="px-3 py-2 mb-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ${isGhostSession ? 'ring-2 ring-purple-400' : ''}`}>
                          {activeUser?.profile_picture ? (
                            <img src={activeUser.profile_picture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm ${isGhostSession ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-[#2563EB] to-[#00D4FF]'}`}>
                              {initials}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-xs font-bold text-white truncate">{activeUser.full_name?.split(' ')[0] || 'Account'}</p>
                          <p className={`font-body text-[9px] truncate ${isGhostSession ? 'text-purple-400' : 'text-[#00D4FF]/70'}`}>
                            {isGhostSession ? 'Ghost' : activeUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Section */}
                    <div className="space-y-0.5 mb-3">
                      <p className="px-3 py-1 font-body text-[9px] text-white/40 uppercase tracking-wider font-bold">My Account</p>
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70">
                        <User className="w-4 h-4 text-[#00D4FF]" /> My Profile
                      </Link>
                      <Link to="/favourites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-pink-400">
                        <Heart className="w-4 h-4 text-pink-400" /> Saved Favourites
                      </Link>
                      <Link to="/messages" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF]">
                        <MessageSquare className="w-4 h-4 text-[#00D4FF]" /> Messages
                      </Link>
                      <Link to="/profile?tab=orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF]">
                        <Package className="w-4 h-4 text-[#00D4FF]" /> My Orders
                      </Link>
                      <Link to="/profile?tab=cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-green-400">
                        <ShoppingCart className="w-4 h-4 text-green-400" /> My Cart
                      </Link>
                    </div>

                    {/* Seller Section */}
                    {(isSeller || isGhostSession || isAdmin) && (
                      <div className="space-y-0.5 mb-3">
                        <p className="px-3 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller Tools</p>
                        <div className="px-3 py-2">
                          <PostListingMenu user={activeUser} compact />
                        </div>
                        <Link to="/profile?tab=listings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF]">
                          <Package className="w-4 h-4 text-[#00D4FF]" /> My Listings
                        </Link>
                        <Link to="/profile?tab=sellerorders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-green-400">
                          <Package className="w-4 h-4 text-green-400" /> Seller Orders
                        </Link>
                        <Link to="/profile?tab=analytics" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-yellow-400">
                          <BarChart2 className="w-4 h-4 text-yellow-400" /> Statistics Dashboard
                        </Link>
                        <Link to={`/seller/${isGhostSession ? (ghostUser?.username || ghostUser?.id) : (activeUser?.username || activeUser?.id)}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-green-400">
                          <Globe className="w-4 h-4 text-green-400" /> My Seller Profile
                        </Link>
                      </div>
                    )}

                    {/* Admin Section - Admin only, never show to ghost accounts */}
                    {isAdmin && (
                      <div className="space-y-0.5 mb-3">
                        <p className="px-3 py-1 font-body text-[9px] text-amber-400/60 uppercase tracking-wider font-bold">Admin Panel</p>
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-500/10 transition-colors text-amber-400">
                          <Shield className="w-4 h-4" /> CEO Dashboard
                          <MetaVerifiedBadge size="xs" label="" />
                        </Link>
                        <Link to="/connected-accounts" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 transition-colors text-purple-400">
                          <Users className="w-4 h-4" /> Connected Accounts
                        </Link>
                      </div>
                    )}

                    {/* Notifications Bell - authenticated users only */}
                    <div className="px-3 py-2 border-t border-white/8 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-xs text-white/60">Notifications</span>
                        <NotificationsBell user={activeUser} />
                      </div>
                    </div>

                    {/* Sign Out */}
                    {isGhostSession ? (
                      <button onClick={() => { clearImpersonation(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors text-red-300 font-body text-xs font-bold">
                        <LogOut className="w-4 h-4" /> Sign Out of Ghost
                      </button>
                    ) : (
                      <button onClick={() => { logout(true); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 font-body text-xs">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    )}
                  </>
                ) : (
                  /* Not Authenticated */
                  <div className="space-y-2 pt-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full py-2.5 border border-white/20 text-white text-center rounded-xl font-body font-bold text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] transition-all text-center" style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </>
      );
      }