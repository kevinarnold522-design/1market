import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Plane, UtensilsCrossed, ShoppingBag, KeyRound, Wrench, Briefcase, Users, Heart, MessageSquare, Bell, User, LogOut, Ghost, Globe, Package, BarChart2, Shield, ShoppingCart, Facebook, Instagram, Youtube, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getGhostSession, clearGhostSession } from '@/lib/ghostAccounts';
import MetaVerifiedBadge from './MetaVerifiedBadge';
import PostListingMenu from './PostListingMenu';
import { MARKETPH_LOGO } from '@/lib/brandAssets';
import TikTokIcon from '@/components/icons/TikTokIcon';
const OWNER_EMAIL = 'kevinarnold522@gmail.com';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', color: '#00D4FF' },
  { to: '/post-ad', icon: Plus, label: 'Post an Ad', color: '#FFD700' },
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
  const { user, isAuthenticated, logout } = useAuth();
  const [ghostUser, setGhostUser] = useState(null);
  const navigate = useNavigate();

  // Keep navbar synced with created-user sessions
  useEffect(() => {
    const refreshGhost = () => setGhostUser(getGhostSession() || null);
    refreshGhost();
    window.addEventListener('ghost-session-changed', refreshGhost);
    window.addEventListener('active-user-changed', refreshGhost);
    window.addEventListener('storage', refreshGhost);
    return () => {
      window.removeEventListener('ghost-session-changed', refreshGhost);
      window.removeEventListener('active-user-changed', refreshGhost);
      window.removeEventListener('storage', refreshGhost);
    };
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
  const isAdmin = !ghostUser && activeUser?.email?.toLowerCase() === OWNER_EMAIL;
  const isGhostSession = !!ghostUser;
  const isBusiness = activeUser?.user_type === 'business';
  const isSeller = activeUser?.user_type === 'seller' || isBusiness || activeUser?.is_seller || activeUser?.account_type === 'business_owner';
  const isVerified = activeUser?.is_verified_seller;
  const initials = activeUser ? (activeUser.full_name || activeUser.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const accountTypeLabel = isAdmin ? 'CEO & Founder' : isBusiness ? 'Business' : activeUser?.user_type === 'rider' ? 'Rider Delivery' : isSeller ? 'Sales Account' : isGhostSession ? 'Live Test' : 'Customer';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            background: scrolled ? 'linear-gradient(135deg,rgba(0,51,204,0.9),rgba(37,99,235,0.72))' : 'linear-gradient(135deg,rgba(0,51,204,0.76),rgba(37,99,235,0.58))',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.24)',
            boxShadow: '0 16px 40px rgba(0,51,204,0.38), inset 0 1px 0 rgba(255,255,255,0.2)',
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
                background: 'linear-gradient(145deg,rgba(0,51,204,0.92),rgba(37,99,235,0.82))',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: '0 24px 60px rgba(0,51,204,0.42), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
              data-navbar
            >
              {/* Header with Logo */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 flex-1 min-w-0" aria-label="Go to homepage">
                  <img
                    src={MARKETPH_LOGO}
                    alt="1MarketPH"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-extrabold tracking-tight text-base text-white">1Market<span className="text-[#FFD700]">PH</span></p>
                    <p className="font-body text-[9px] text-white/55 font-semibold tracking-wide">Buy, Sell & Connect</p>
                  </div>
                </Link>
                {isAuthenticated && activeUser && (
                  <Link to="/notifications" onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/25 flex items-center justify-center hover:bg-[#00D4FF]/25 transition-colors" aria-label="Open notifications">
                    <Bell className="w-3.5 h-3.5 text-[#00D4FF]" />
                  </Link>
                )}
                <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Navigation Menu */}
              <div className="p-3 max-h-[60vh] overflow-y-scroll" data-navbar-menu style={{ scrollbarGutter: 'stable', minHeight: '420px' }}>
                {/* Auth Section */}
                {(isAuthenticated || isGhostSession) && activeUser ? (
                  <>
                    {/* User Info */}
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 mb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
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
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#00D4FF]/25 bg-[#00D4FF]/10 font-body text-[8px] font-bold uppercase tracking-wider text-[#00D4FF] mb-0.5">
                            {accountTypeLabel}
                          </span>
                          <p className="font-body text-xs font-bold text-white truncate">{activeUser.full_name?.split(' ')[0] || 'Account'}</p>
                        </div>
                      </div>
                    </Link>

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
                      <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF]">
                        <Package className="w-4 h-4 text-[#00D4FF]" /> My Orders
                      </Link>
                      <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-green-400">
                        <ShoppingCart className="w-4 h-4 text-green-400" /> My Cart
                      </Link>
                    </div>

                    {/* Seller Section */}
                    {(isAdmin || (isSeller && activeUser?.user_type !== 'rider' && !(activeUser?.user_type === 'customer' && !isSeller))) && (
                      <div className="space-y-0.5 mb-3">
                        <p className="px-3 py-1 font-body text-[9px] text-[#00D4FF]/50 uppercase tracking-wider font-bold">Seller Tools</p>
                        <div className="px-3 py-2">
                          <PostListingMenu user={activeUser} compact />
                        </div>
                        <Link to="/my-listings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-[#00D4FF]">
                          <Package className="w-4 h-4 text-[#00D4FF]" /> My Listings
                        </Link>
                        <Link to="/seller-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-green-400">
                          <Package className="w-4 h-4 text-green-400" /> Seller Orders
                        </Link>
                        <Link to="/my-analytics" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-yellow-400">
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

                    {/* Main Navigation at bottom */}
                    <div className="space-y-0.5 mb-3 border-t border-white/8 pt-2">
                      <p className="px-3 py-1 font-body text-[9px] text-white/40 uppercase tracking-wider font-bold">Browse</p>
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

                    {/* Sign Out */}
                    {isGhostSession ? (
                      <button onClick={() => { clearGhostSession(); setGhostUser(null); setIsOpen(false); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors text-red-300 font-body text-xs font-bold">
                        <LogOut className="w-4 h-4" /> Sign Out of Created User
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
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-center font-body font-bold text-sm hover:bg-white/15 transition-colors">
                      Create account
                    </Link>
                    <div className="space-y-0.5 border-t border-white/8 pt-2 mt-2">
                      {NAV_ITEMS.map((item) => (
                        <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/10 group">
                          <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                          <span className="font-body text-sm font-semibold text-white/80 group-hover:text-white">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2 border-t border-white/8 pt-3 mt-3">
                  <p className="px-3 py-1 font-body text-[9px] text-white/40 uppercase tracking-wider font-bold">1MarketPH</p>
                  <div className="grid grid-cols-2 gap-2 px-3">
                    <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 text-xs font-body font-semibold">
                      <Globe className="w-3.5 h-3.5 text-[#00D4FF]" /> About Us
                    </Link>
                    <Link to="/privacy-policy" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 text-xs font-body font-semibold">
                      <Shield className="w-3.5 h-3.5 text-purple-400" /> Privacy
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <a href="https://www.facebook.com/share/18Neew76Yo/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-body font-bold"><Facebook className="w-3.5 h-3.5" /> FB</a>
                    <a href="https://instagram.com/1marketph" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-body font-bold"><Instagram className="w-3.5 h-3.5" /> IG</a>
                    <a href="https://tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-body font-bold"><TikTokIcon className="w-3.5 h-3.5 text-white" /> TikTok</a>
                    <a href="https://youtube.com/@1marketph" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-body font-bold"><Youtube className="w-3.5 h-3.5" /> YT</a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </>
      );
      }