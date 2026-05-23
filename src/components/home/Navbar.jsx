import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../MemberSignupModal';
import NavUserBadge from './NavUserBadge';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
  { label: 'Travel', href: '/travel' },
  { label: 'Food', href: '/food' },
  { label: 'Buy & Sell', href: '/buysell' },
  { label: 'For Rent', href: '/rent' },
  { label: 'Services', href: '/services' }];


  return (
    <>
    {/* Sign Up / Welcome Banner */}
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#00D4FF] text-[#0A192F] py-2 px-3 text-center flex items-center justify-center flex-wrap gap-x-2">
      {isAuthenticated && user ? (
        <>
          <span className="font-body text-[11px] sm:text-xs font-semibold">👋 Welcome back, <strong>{user.full_name?.split(' ')[0] || 'Member'}</strong>! You're signed in.</span>
          <Link to="/profile" className="px-3 py-0.5 bg-[#0A192F] text-white rounded-full text-[11px] sm:text-xs font-bold hover:bg-[#2563EB] transition-colors whitespace-nowrap">
            My Profile →
          </Link>
        </>
      ) : (
        <>
          <span className="font-body text-[11px] sm:text-xs font-semibold">🎉 Sign Up or Sign In to access deals & your account.</span>
          <div className="flex items-center gap-1">
            <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="px-3 py-0.5 bg-white/30 text-[#0A192F] rounded-full text-[11px] sm:text-xs font-bold hover:bg-white/50 transition-colors whitespace-nowrap">
              Sign In
            </button>
            <button onClick={() => setShowSignup(true)} className="px-3 py-0.5 bg-[#0A192F] text-white rounded-full text-[11px] sm:text-xs font-bold hover:bg-[#2563EB] transition-colors whitespace-nowrap">
              Sign Up →
            </button>
          </div>
        </>
      )}
    </div>
    <nav
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ?
        'bg-[#0A192F]/80 backdrop-blur-xl shadow-lg shadow-[#0A192F]/10' :
        'bg-transparent'}`
        }>
        
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00D4FF] flex items-center justify-center">
              <span className="text-[#0A192F] font-heading font-bold text-sm">1</span>
            </div>
            <span className={`font-heading font-bold text-lg tracking-tight transition-colors duration-300 text-gray-50 ${
              scrolled ? 'text-white' : ''}`
              }>
              Marketph<span className="text-[#00D4FF]">.com</span>
            </span>
          </a>
          {/* Animated Buyer/Seller badge */}
          <NavUserBadge />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) =>
              <Link
                key={link.label}
                to={link.href}
                className={`relative font-body text-sm font-medium tracking-wide transition-colors duration-300 group ${
                scrolled ? 'text-white/80 hover:text-[#00D4FF]' : 'text-[#0A192F]/70 hover:text-[#0A192F]'}`
                }>
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
              </Link>
              )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#00D4FF]/40 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-xs">
                    {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-body text-xs text-white font-semibold max-w-[80px] truncate">{user.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl z-50"
                      style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
                      <div className="p-3 border-b border-white/10">
                        <p className="font-body text-xs font-bold text-white truncate">{user.full_name || 'Account'}</p>
                        <p className="font-body text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                          <User className="w-3.5 h-3.5 text-[#00D4FF]" /> My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                            <span className="text-amber-400 text-sm">⚙️</span> Admin Dashboard
                          </Link>
                        )}
                        <Link to="/seller" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white font-body text-xs">
                          <span className="text-sm">🏪</span> Seller Dashboard
                        </Link>
                        <button onClick={() => { logout(true); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-400 font-body text-xs">
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
          <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-white' : 'text-[#0A192F]'}`
              }>
              
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A192F]/95 backdrop-blur-xl border-t border-white/10">
            
            <div className="px-6 py-4 space-y-3">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center text-white font-heading font-bold text-sm">
                    {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-xs font-bold text-white truncate">{user.full_name || 'Account'}</p>
                    <p className="font-body text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              {links.map((link) =>
                <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)}
                  className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                  {link.label}
                </Link>
              )}
              {isAuthenticated && user ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}
                    className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                    👤 My Profile
                  </Link>
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
          }
      </AnimatePresence>
    </nav>
    <AnimatePresence>
      {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
    </AnimatePresence>
    </>);

}