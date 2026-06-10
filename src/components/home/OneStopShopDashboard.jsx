import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ShoppingCart, Users, TrendingUp, Zap, Globe } from 'lucide-react';

const CUSTOMER_VISION = {
  icon: Target,
  title: '1 VISION FOR CUSTOMERS',
  subtitle: 'Your One-Stop Filipino Marketplace',
  points: ['Shop Local', 'Best Deals', 'Connect Nationwide'],
  color: '#00D4FF',
  bg: 'rgba(0,212,255,0.15)'
};

const BUSINESS_VISION = {
  icon: ShoppingCart,
  title: '1 GOAL FOR BUSINESS',
  subtitle: 'Grow Your Reach, Zero Fees',
  points: ['Free Listings', '10K+ Daily Visitors', 'Active Community'],
  color: '#FFD700',
  bg: 'rgba(255,215,0,0.15)'
};

const SELLER_VISION = {
  icon: Users,
  title: '1 PLATFORM FOR SELLERS',
  subtitle: 'List Unlimited, Sell More',
  points: ['Unlimited Posts', 'Seller Tools', 'Analytics Dashboard'],
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
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const current = VISIONS[currentIdx];
  const Icon = current.icon;

  return (
    <div className="relative overflow-hidden py-8 sm:py-10" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 50%, #001a80 100%)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight mb-1">
            1MARKETPH<span className="text-[#00D4FF]">.COM</span>
          </p>
          <p className="font-heading font-bold text-sm sm:text-base text-[#00D4FF] tracking-wide">
            ALL-IN-ONE STOP SHOP
          </p>
        </motion.div>

        {/* Animated Vision Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl backdrop-blur-sm overflow-hidden"
          style={{ background: 'rgba(0,26,128,0.8)', border: `2px solid ${current.color}40` }}
        >
          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {!isTransitioning && (
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: current.bg, border: `2px solid ${current.color}` }}>
                    <Icon className="w-8 h-8" style={{ color: current.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-1">{current.title}</h3>
                    <p className="font-body text-xs sm:text-sm text-white/80 mb-3">{current.subtitle}</p>
                    
                    {/* Points */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                      {current.points.map((point, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold" style={{ background: current.bg, border: `1px solid ${current.color}40`, color: current.color }}>
                          ✓ {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex sm:flex-col gap-1.5">
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
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIdx ? 'scale-125' : 'opacity-40 hover:opacity-70'}`}
                        style={{ backgroundColor: idx === currentIdx ? current.color : '#ffffff' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bar */}
          <div className="h-1 bg-white/10">
            <motion.div
              key={currentIdx}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              style={{ background: current.color }}
            />
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex items-center justify-center gap-4 sm:gap-6"
        >
          {[
            { icon: Zap, label: 'Free to List', color: '#10b981' },
            { icon: Globe, label: 'Nationwide', color: '#00D4FF' },
            { icon: TrendingUp, label: 'Growing Daily', color: '#FFD700' },
          ].map(({ icon: Icon, label, color }, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <span className="font-body text-[10px] sm:text-xs font-semibold text-white/70">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}