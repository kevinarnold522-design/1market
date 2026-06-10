import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ShoppingCart, Users, TrendingUp, Zap, Globe, CheckCircle } from 'lucide-react';

const CUSTOMER_VISION = {
  icon: Target,
  title: '1 VISION FOR CUSTOMERS',
  subtitle: 'Your One-Stop Filipino Marketplace - Shop Smart, Save Big',
  points: [
    'Browse 10,000+ Local Products',
    'Compare Prices Across Sellers',
    'Secure Payments & Buyer Protection',
    'Free Nationwide Delivery Options',
    '24/7 Customer Support'
  ],
  color: '#00D4FF',
  bg: 'rgba(0,212,255,0.15)'
};

const BUSINESS_VISION = {
  icon: ShoppingCart,
  title: '1 GOAL FOR BUSINESS',
  subtitle: 'Grow Your Reach, Zero Commission Fees',
  points: [
    'Unlimited Free Product Listings',
    'Access 10K+ Daily Active Buyers',
    'Built-in Marketing Tools',
    'Real-time Sales Analytics',
    'Verified Business Badges'
  ],
  color: '#FFD700',
  bg: 'rgba(255,215,0,0.15)'
};

const SELLER_VISION = {
  icon: Users,
  title: '1 PLATFORM FOR SELLERS',
  subtitle: 'List Unlimited, Sell More, Earn Better',
  points: [
    'Zero Listing Fees Forever',
    'Advanced Seller Dashboard',
    'Inventory Management Tools',
    'Direct Buyer Messaging',
    'Performance Insights & Reports'
  ],
  color: '#10b981',
  bg: 'rgba(16,185,129,0.15)'
};

const VISIONS = [CUSTOMER_VISION, BUSINESS_VISION, SELLER_VISION];

export default function CompactOneStopDashboard() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % VISIONS.length);
        setIsTransitioning(false);
      }, 600);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const current = VISIONS[currentIdx];
  const Icon = current.icon;

  return (
    <div className="relative overflow-hidden py-6 sm:py-8" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 50%, #001a80 100%)' }}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-[9px] font-bold text-[#00D4FF] tracking-wider">POWERING FILIPINO COMMERCE</span>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mb-1">
            1MARKETPH<span className="text-[#00D4FF]">.COM</span>
          </p>
          <p className="font-heading font-bold text-sm sm:text-base text-[#00D4FF] tracking-wide">
            THE ALL-IN-ONE FILIPINO MARKETPLACE
          </p>
        </motion.div>

        {/* Animated Vision Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl backdrop-blur-md overflow-hidden shadow-2xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0,26,128,0.95), rgba(0,51,204,0.85))',
            border: `2px solid ${current.color}50`,
            boxShadow: `0 0 40px ${current.color}20, inset 0 0 60px ${current.color}10`
          }}
        >
          <div className="p-4 sm:p-5">
            <AnimatePresence mode="wait">
              {!isTransitioning && (
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col lg:flex-row items-center gap-6"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" 
                    style={{ 
                      background: `linear-gradient(135deg, ${current.bg}, ${current.color}25)`,
                      border: `2px solid ${current.color}`,
                      boxShadow: `0 0 30px ${current.color}40`
                    }}>
                    <Icon className="w-7 h-7" style={{ color: current.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-white mb-1">{current.title}</h3>
                    <p className="font-body text-xs sm:text-sm text-white/80 mb-3 leading-relaxed">{current.subtitle}</p>
                    
                    {/* Points Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {current.points.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl" 
                          style={{ background: current.bg, border: `1px solid ${current.color}30` }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: current.color }}>
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-body text-xs sm:text-sm font-semibold" style={{ color: current.color }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex lg:flex-col gap-2">
                    {VISIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentIdx(idx);
                            setIsTransitioning(false);
                          }, 100);
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentIdx ? 'scale-125 shadow-lg' : 'opacity-40 hover:opacity-70'}`}
                        style={{ 
                          backgroundColor: idx === currentIdx ? current.color : '#ffffff',
                          boxShadow: idx === currentIdx ? `0 0 12px ${current.color}` : 'none'
                        }}
                        aria-label={`Show vision ${idx + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bar */}
          <div className="h-1.5 bg-white/10">
            <motion.div
              key={currentIdx}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ background: `linear-gradient(90deg, ${current.color}, ${current.color}80)` }}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 flex items-center justify-center gap-6 sm:gap-8 flex-wrap"
        >
          {[
            { icon: Zap, label: '100% Free Listings', color: '#10b981' },
            { icon: Globe, label: 'Nationwide Coverage', color: '#00D4FF' },
            { icon: TrendingUp, label: '10K+ Daily Visitors', color: '#FFD700' },
            { icon: CheckCircle, label: 'Verified Sellers', color: '#a855f7' },
          ].map(({ icon: Icon, label, color }, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${color}30` }}>
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
              <span className="font-body text-xs sm:text-sm font-semibold text-white/80">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}