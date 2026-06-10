import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clipboard, RotateCw, Target, Users, TrendingUp } from 'lucide-react';

export default function OneStopShopDashboard() {
  const customerVision = {
    icon: Target,
    title: '1 VISION FOR CUSTOMERS',
    subtitle: 'Your One-Stop Shop for Everything Filipino',
    color: '#00D4FF',
    features: ['Shop Local Products', 'Connect with Sellers', 'Best Deals Nationwide']
  };

  const sellerGoals = [
    {
      icon: ShoppingCart,
      title: '1 MARKET',
      subtitle: 'Reach Thousands of Buyers',
      color: '#FFD700',
      metric: '10,000+ Daily Visitors'
    },
    {
      icon: Clipboard,
      title: '1 PLATFORM',
      subtitle: 'Free Listings, Zero Fees',
      color: '#10b981',
      metric: 'Unlimited Posts'
    },
    {
      icon: RotateCw,
      title: '1 COMMUNITY',
      subtitle: 'Grow Your Business Network',
      color: '#a855f7',
      metric: 'Active Marketplace'
    }
  ];

  return (
    <div className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'linear-gradient(180deg, #0040D0 0%, #0033CC 50%, #001a80 100%)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-3">
            1MARKETPH<span className="text-[#00D4FF]">.COM</span>
          </p>
          <p className="font-heading font-bold text-lg sm:text-xl text-[#00D4FF] tracking-wide">
            SERVICES: ALL-IN-ONE STOP SHOP
          </p>
        </motion.div>

        {/* Customer Vision Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12 p-6 sm:p-8 rounded-3xl backdrop-blur-sm"
          style={{ background: 'rgba(0,212,255,0.1)', border: '2px solid rgba(0,212,255,0.3)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.2)', border: '2px solid #00D4FF' }}>
              <customerVision.icon className="w-10 h-10" style={{ color: customerVision.color }} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">{customerVision.title}</h3>
              <p className="font-body text-sm sm:text-base text-white/80 mb-4">{customerVision.subtitle}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {customerVision.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}>
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seller Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {sellerGoals.map((goal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="p-6 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform"
              style={{ background: `rgba(${goal.color === '#FFD700' ? '255,215,0' : goal.color === '#10b981' ? '16,185,129' : '168,85,247'},0.1)`, border: `1.5px solid ${goal.color}40` }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `${goal.color}20`, border: `2px solid ${goal.color}` }}>
                <goal.icon className="w-7 h-7" style={{ color: goal.color }} />
              </div>
              <h4 className="font-heading font-bold text-lg text-white mb-2">{goal.title}</h4>
              <p className="font-body text-sm text-white/70 mb-3">{goal.subtitle}</p>
              <div className="pt-3 border-t border-white/10">
                <p className="font-body text-xs font-bold" style={{ color: goal.color }}>{goal.metric}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}