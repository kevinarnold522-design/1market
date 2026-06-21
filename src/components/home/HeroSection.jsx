import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Facebook, Instagram, Youtube } from 'lucide-react';
import AccountTypeModal from '../AccountTypeModal';
import LoginModal from '@/components/LoginModal';
import { base44 } from '@/api/base44Client';
import SmartSearchBar from '../SmartSearchBar';
import PostListingMenu from '../PostListingMenu';
import { ALFIE_CAR, MARKETPH_LOGO } from '@/lib/brandAssets';
import TikTokIcon from '@/components/icons/TikTokIcon';

export default function HeroSection({ heroImage }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async ok => {
      setIsAuth(ok);
      if (ok) setUser(await base44.auth.me());
    }).catch(() => {});
  }, []);

  const canPost = user && (user.role === 'admin' || user.user_type === 'seller' || user.user_type === 'business' || user.is_seller || user.account_type === 'business_owner');

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background gradient — royal blue brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000d40] via-[#0033CC] to-[#001a80]" />

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full bg-[#001a80]/70 border border-white/15 px-2 py-1.5 backdrop-blur-xl shadow-2xl">
        <a href="/about" className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all">
          About Us
        </a>
        <a href="/privacy-policy" className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all">
          Privacy Policy
        </a>
        <a href="https://www.facebook.com/share/17NoRjEgyP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform">
          <Facebook className="w-4 h-4" />
        </a>
        <a href="https://www.instagram.com/1marketph/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)' }}>
          <Instagram className="w-4 h-4" />
        </a>
        <a href="https://www.tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading text-sm font-black hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg,#010101,#25F4EE,#FE2C55)' }}>
          <TikTokIcon className="w-4 h-4 text-white" />
        </a>
        <a href="https://www.youtube.com/@1marketph" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform">
          <Youtube className="w-4 h-4" />
        </a>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center py-12 lg:py-16">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,64,208,0.3)', border: '1px solid rgba(62,151,241,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#3E97F1] animate-pulse" />
                <span className="font-body text-[10px] font-medium tracking-widest uppercase text-[#3E97F1]">1Marketph.com · Est. 2026</span>
              </motion.div>

              {/* Brand Logo */}
              <div className="flex items-center gap-3 -ml-3 sm:ml-0">
                <a href="/" className="inline-flex flex-shrink-0" aria-label="Go to homepage">
                  <img
                    src={MARKETPH_LOGO}
                    alt="1Market Philippines"
                    className="w-20 h-20 sm:w-20 sm:h-20 rounded-xl object-cover shadow-2xl"
                    style={{ boxShadow: '0 0 24px rgba(255,215,0,0.35)' }}
                  />
                </a>
                <h1 className="font-heading font-bold leading-[0.95] tracking-tight">
                  <span className="block text-2xl sm:text-3xl lg:text-4xl" style={{ color: '#3E97F1' }}>Welcome to</span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl mt-0.5" style={{ background: 'linear-gradient(135deg,#0040D0,#3E97F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1Market PH™</span>
                </h1>
              </div>

              <p className="font-body text-xs sm:text-sm text-white/70 max-w-md leading-relaxed font-semibold">
                The Premiere Marketplace — Buy, Sell &amp; Connect Nationwide.
              </p>

              <div className="h-[1px] w-12 bg-[#00D4FF]" />

              {/* Trust badges */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Free to List', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
                  { label: 'Verified Sellers', color: 'rgba(37,99,235,0.15)', border: 'rgba(37,99,235,0.3)', text: '#60a5fa' },
                  { label: 'Proudly Filipino', color: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.25)', text: '#FFD700' },
                ].map(badge => (
                  <span key={badge.label} className="px-2.5 py-0.5 rounded-full font-body text-[9px] font-bold"
                    style={{ background: badge.color, border: `1px solid ${badge.border}`, color: badge.text }}>
                    {badge.label}
                  </span>
                ))}
              </div>

              <div className="mt-5 max-w-xl"><SmartSearchBar placeholder="Search listings, food, services, jobs..." /></div>

              <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                {!isAuth ? (
                  <>
                    <motion.button
                      onClick={() => setShowLogin(true)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-body font-bold text-sm text-white border border-white/25 hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all"
                      whileHover={{ scale: 1.04 }}>
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => { window.dispatchEvent(new CustomEvent('alfie-get-started')); setShowSignup(true); }}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow: '0 0 24px rgba(255,215,0,0.4)' }}
                      whileHover={{ scale: 1.05 }}>
                      Signup Free →
                    </motion.button>
                    <motion.a
                      href="/post-ad"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-body font-bold text-sm text-white border border-[#FFD700]/40 hover:bg-[#FFD700]/10 transition-all"
                      whileHover={{ scale: 1.05 }}>
                      Post an Ad
                    </motion.a>
                  </>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    {canPost && <PostListingMenu user={user} />}
                    <motion.a
                      href="/post-ad"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-bold text-sm text-white border border-[#FFD700]/40 hover:bg-[#FFD700]/10 transition-all"
                      whileHover={{ scale: 1.05 }}>
                      Post an Ad
                    </motion.a>
                    <motion.a
                      href="/explore"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}
                      whileHover={{ scale: 1.05 }}>
                      Explore Now
                    </motion.a>

                  </div>
                )}
                <motion.a
                  href="#categories"
                  className="inline-flex items-center gap-3 group"
                  whileHover={{ y: 2 }}>
                  <span className="font-body text-sm font-medium text-white/70 group-hover:text-[#00D4FF] transition-colors">
                    Browse Categories
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00D4FF] group-hover:bg-[#00D4FF]/5 transition-all">
                    <ArrowDown className="w-4 h-4 text-white/40 group-hover:text-[#00D4FF] transition-colors" />
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Right: Original mascot car image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative order-first lg:order-last flex items-center justify-center lg:justify-end lg:-mr-8">
            <img 
              src={ALFIE_CAR}
              alt="1Market Philippines mascot car"
              className="w-full max-w-[19rem] sm:max-w-[38rem] lg:max-w-[47rem] drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 18px 36px rgba(0,212,255,0.25))' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0033CC] to-transparent" />

      <AnimatePresence>
        {showSignup && <AccountTypeModal onClose={() => setShowSignup(false)} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
    </section>
  );
}