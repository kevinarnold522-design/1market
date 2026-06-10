import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Plane, UtensilsCrossed, ShoppingBag, KeyRound, Wrench, Briefcase, Users, Heart, MessageSquare, Bell, User, LogOut, Ghost, ChevronDown, Globe, Package, BarChart2, Settings, Shield, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [showProfile, setShowProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const [ghostUser, setGhostUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ghost = getImpersonatedUser();
    if (ghost) setGhostUser(ghost);
  }, []);

  const activeUser = ghostUser || user;
  const isAdmin = activeUser?.role === 'admin' || activeUser?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
  const isGhostSession = !!ghostUser;
  const isSeller = activeUser?.user_type === 'seller' || activeUser?.is_seller || activeUser?.account_type === 'business_owner';
  const isBusiness = activeUser?.user_type === 'business';
  const isVerified = activeUser?.is_verified_seller;
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
      {/* Floating Middle Navbar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] rounded-2xl shadow-2xl"
        style={{
          background: scrolled ? 'rgba(13,31,60,0.95)' : 'rgba(13,31,60,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1)',
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
              alt="1MarketPH"
              className="w-7 h-7 rounded-lg object-cover"
            />
            <span className="font-heading font-bold text-xs text-white hidden sm:block">
              1Market<span className="text-[#FFD700]">PH</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs mx-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 pl-8 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            </div>
          </form>

          {/* Navigation Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all hover:bg-white/10 group"
                title={item.label}
              >
                <item.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated && activeUser ? (
              <>
                {/* Notifications */}
                <div className="hidden sm:block">
                  <NotificationsBell user={activeUser} />
                </div>

                {/* Post Ad */}
                {(isSeller || isAdmin || isGhostSession) && (
                  <div className="hidden sm:block">
                    <PostListingMenu user={activeUser} compact iconOnly />
                  </div>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all"
                  >
                    <div className={`w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 ${isGhostSession ? 'ring-2 ring-purple-400' : ''}`}>
                      {activeUser?.profile_picture ? (
                        <img src={activeUser.profile_picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full rounded-lg flex items-center justify-center text-white font-heading font-bold text-[10px] ${isGhostSession ? 'bg-gradient-to-br from-purple-500 to-cyan-500' : 'bg-gradient-to-br from-[#2563EB] to-[#00D4FF]'}`}>
                          {initials}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </button>

                  <AnimatePresence>
                    {showProfile && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl z-50"
                        style={{ background: '#0D1F3C', border: '1px solid rgba(168,85,247,0.3)' }}
                      >
                        {/* Profile Header */}
                        <div className="p-3 border-b border-white/10">
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
                                {isGhostSession ? 'Ghost Account' : activeUser.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-0.5">
                          <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                            <User className="w-3.5 h-3.5 text-[#00D4FF]" /> My Profile
                          </Link>
                          <Link to="/favourites" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-pink-400 font-body text-xs">
                            <Heart className="w-3.5 h-3.5 text-pink-400" /> Saved
                          </Link>
                          <Link to="/messages" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF] font-body text-xs">
                            <MessageSquare className="w-3.5 h-3.5 text-[#00D4FF]" /> Messages
                          </Link>
                          {(isSeller || isGhostSession) && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <Link to="/profile?tab=listings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF] font-body text-xs">
                                <Package className="w-3.5 h-3.5 text-[#00D4FF]" /> My Listings
                              </Link>
                              <Link to="/profile?tab=analytics" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-yellow-400 font-body text-xs">
                                <BarChart2 className="w-3.5 h-3.5 text-yellow-400" /> Analytics
                              </Link>
                            </>
                          )}
                          {isAdmin && !isGhostSession && (
                            <>
                              <div className="border-t border-white/8 my-1" />
                              <Link to="/admin" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors text-amber-400 font-body text-xs">
                                <Shield className="w-3.5 h-3.5" /> Admin Panel
                              </Link>
                              <Link to="/connected-accounts" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-500/10 transition-colors text-purple-400 font-body text-xs">
                                <Users className="w-3.5 h-3.5" /> Connected Accounts
                              </Link>
                            </>
                          )}
                          <div className="border-t border-white/8 my-1" />
                          {isGhostSession ? (
                            <button onClick={() => { clearImpersonation(); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors text-red-300 font-body text-xs font-bold">
                              <LogOut className="w-3.5 h-3.5" /> Sign Out Ghost
                            </button>
                          ) : (
                            <button onClick={() => { logout(true); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 font-body text-xs">
                              <LogOut className="w-3.5 h-3.5" /> Sign Out
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-3 py-1.5 border border-white/20 text-white/80 rounded-xl font-body font-bold text-xs hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors hidden sm:block">
                  Login
                </button>
                <button onClick={() => navigate('/register')} className="px-3 py-1.5 rounded-xl font-body font-bold text-xs text-[#0A192F] transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Full Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[95vw] max-w-md rounded-2xl overflow-hidden shadow-2xl z-[99] lg:hidden"
            style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/10"
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span className="font-body text-sm font-semibold text-white">{item.label}</span>
                </Link>
              ))}
              {isAuthenticated && activeUser && (
                <>
                  <div className="border-t border-white/8 my-2" />
                  <Link to="/favourites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70">
                    <Heart className="w-4 h-4 text-pink-400" /> Saved Favourites
                  </Link>
                  <Link to="/messages" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70">
                    <MessageSquare className="w-4 h-4 text-[#00D4FF]" /> Messages
                  </Link>
                  {(isSeller || isGhostSession) && (
                    <>
                      <div className="border-t border-white/8 my-2" />
                      <div className="px-3 py-2">
                        <PostListingMenu user={activeUser} compact />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}