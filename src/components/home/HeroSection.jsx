import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const WARM_HERO = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=85';

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#E0F2FE]" />

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
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0A192F]/5 rounded-full">
                
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="font-body text-xs font-medium tracking-widest uppercase text-[#0A192F]/60">ESTABLISHED SINCE 2026

                </span>
              </motion.div>

              <h1 className="font-heading font-bold leading-[0.95] tracking-tight">
                <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-[#0A192F]">
                  Welcome to
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-[#2563EB] mt-2">
                  1 Market
                </span>
              </h1>

              <p className="font-body text-sm sm:text-base lg:text-lg text-[#0A192F]/60 max-w-md leading-relaxed">
                We connect consumers to products and businesses to the right people — across Manila & Cavite.
              </p>

              <div className="h-[1px] w-16 bg-[#00D4FF]" />

              <p className="font-body text-xs sm:text-sm text-[#0A192F]/40 max-w-sm leading-relaxed">Founded by Kevin Roberto in 2026 as a  business that helps consumers and Business owners connect— a growing community thanks to you.

              </p>

              <motion.a
                href="#categories"
                className="inline-flex items-center gap-3 mt-4 group"
                whileHover={{ y: 2 }}>
                
                <span className="font-body text-sm font-medium text-[#0A192F]/70 group-hover:text-[#2563EB] transition-colors">
                  Explore Categories
                </span>
                <div className="w-10 h-10 rounded-full border border-[#0A192F]/10 flex items-center justify-center group-hover:border-[#2563EB] group-hover:bg-[#2563EB]/5 transition-all">
                  <ArrowDown className="w-4 h-4 text-[#0A192F]/40 group-hover:text-[#2563EB] transition-colors" />
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Warm hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative order-first lg:order-last">
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#0A192F]/10">
              


              
              
              
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl shadow-[#0A192F]/5 px-4 sm:px-6 py-3 sm:py-4 border border-white/50">
              
              <p className="font-heading font-bold text-xl sm:text-2xl text-[#0A192F]">All Acro</p>
              <p className="font-body text-xs text-[#0A192F]/50 tracking-wide">Local businesses, real connections</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </section>);

}