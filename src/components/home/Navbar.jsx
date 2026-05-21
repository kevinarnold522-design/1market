import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../MemberSignupModal';
import NavUserBadge from './NavUserBadge';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
    {/* Sign Up Banner */}
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#00D4FF] text-[#0A192F] py-2 px-3 text-center flex items-center justify-center flex-wrap gap-x-2">
      <span className="font-body text-[11px] sm:text-xs font-semibold">🎉 Sign Up Now and Be Part of the Community.</span>
      <button onClick={() => setShowSignup(true)} className="px-3 py-0.5 bg-[#0A192F] text-white rounded-full text-[11px] sm:text-xs font-bold hover:bg-[#2563EB] transition-colors whitespace-nowrap">
        Sign Up →
      </button>
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
              scrolled ? 'text-white' : ""}`
              }>
              Market<span className="text-[#00D4FF]">.ph</span>
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
            <button onClick={() => setShowSignup(true)}
              className="px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
              Sign Up Free
            </button>
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
              {links.map((link) =>
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-white/80 hover:text-[#00D4FF] font-body text-sm font-medium py-2 transition-colors">
                
                  {link.label}
                </Link>
              )}
              <button onClick={() => {setMenuOpen(false);setShowSignup(true);}}
              className="w-full mt-2 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
                Sign Up Free
              </button>
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