import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import HeroAnimation3D from './HeroAnimation3D';
import AccountTypeModal from '../AccountTypeModal';
import LoginModal from '@/components/LoginModal';
import PostListingButton from '../PostListingButton';
import { base44 } from '@/api/base44Client';

export default function HeroSection({ heroImage }) {
  const [isAuth, setIsAuth] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsAuth).catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient — royal blue brand */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000d40] via-[#0033CC] to-[#001a80]" />

      {/* Kinetic line decoration — hidden on mobile */}
      <motion.div
        className="absolute left-12 top-0 w-[1px] bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent hidden lg:block"
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 2, ease: 'easeOut' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-24 lg:py-28">
          {/* Left: Typography */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(0,64,208,0.3)', border: '1px solid rgba(62,151,241,0.3)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#3E97F1] animate-pulse" />
                <span className="font-body text-xs font-medium tracking-widest uppercase text-[#3E97F1]">1Marketph.com · Est. 2026</span>
              </motion.div>

              {/* Brand Logo */}
              <div className="flex items-center gap-4">
                <img
                  src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
                  alt="1Market Philippines"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-2xl"
                  style={{ boxShadow: '0 0 32px rgba(255,215,0,0.4)' }}
                />
                <h1 className="font-heading font-bold leading-[0.95] tracking-tight">
                  <span className="block text-3xl sm:text-4xl lg:text-5xl" style={{ color: '#3E97F1' }}>Welcome to</span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl mt-1" style={{ background: 'linear-gradient(135deg,#0040D0,#3E97F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1Market PH™</span>
                </h1>
              </div>

              <p className="font-body text-sm sm:text-base lg:text-lg text-white/70 max-w-md leading-relaxed font-semibold">
                Building Dreams under 1Vision, Together.
              </p>

              <div className="h-[1px] w-16 bg-[#00D4FF]" />

              <p className="font-body text-xs sm:text-sm text-white/55 max-w-lg leading-relaxed">
                Founded in 2026 by Kevin Roberto, 1Market was born from a simple vision: to bridge the gap between Filipino consumers and businesses that power our communities. Whether you're searching for your next home, a reliable service, or the best local deals, we provide a seamless, homegrown space where connections happen naturally. Proudly Filipino, built for Filipinos — because when we connect, we grow together.
              </p>

              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {!isAuth ? (
                  <>
                    <motion.button
                      onClick={() => setShowLogin(true)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-body font-bold text-sm text-white border border-white/25 hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all"
                      whileHover={{ scale: 1.04 }}>
                      Login
                    </motion.button>
                    <motion.button
                      onClick={() => setShowSignup(true)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#FFD700,#FFA500)', boxShadow: '0 0 24px rgba(255,215,0,0.4)' }}
                      whileHover={{ scale: 1.05 }}>
                      Get Started Free →
                    </motion.button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <motion.a
                      href="/explore"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}
                      whileHover={{ scale: 1.05 }}>
                      Explore Now →
                    </motion.a>
                    <PostListingButton />
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

          {/* Right: 3D Animated Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative order-first lg:order-last">
            <HeroAnimation3D />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#0D1F3C]/90 backdrop-blur-xl rounded-xl shadow-xl shadow-black/30 px-4 py-3 border border-white/10">
              <p className="font-heading font-bold text-base sm:text-lg text-white">We bring you!</p>
              <p className="font-body text-[10px] text-[#00D4FF]/70 tracking-wide">Local businesses, real connections</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070F1A] to-transparent" />

      <AnimatePresence>
        {showSignup && <AccountTypeModal onClose={() => setShowSignup(false)} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
    </section>
  );
}