import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import HeroAnimation3D from './HeroAnimation3D';

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient — light blue */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BAE6FD]" />

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
                <span className="font-body text-xs font-medium tracking-widest uppercase text-[#0A192F]/60">1Marketph.com · Est. 2026</span>
              </motion.div>

              <h1 className="font-heading font-bold leading-[0.95] tracking-tight">
                <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-[#0A192F]">Welcome to</span>
                <span className="block text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-[#2563EB] mt-2">1Marketph.com</span>
              </h1>

              <p className="font-body text-sm sm:text-base lg:text-lg text-[#0A192F]/70 max-w-md leading-relaxed font-semibold">
                Building Dreams under 1Vision, Together.
              </p>

              <div className="h-[1px] w-16 bg-[#00D4FF]" />

              <p className="font-body text-xs sm:text-sm text-[#0A192F]/55 max-w-lg leading-relaxed">
                Founded in 2026 by Kevin Roberto, 1Market was born from a simple vision: to bridge the gap between Filipino consumers and businesses that power our communities. Whether you're searching for your next home, a reliable service, or the best local deals, we provide a seamless, homegrown space where connections happen naturally. Proudly Filipino, built for Filipinos — because when we connect, we grow together.
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
              className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl shadow-[#0A192F]/5 px-4 py-3 border border-white/50">
              <p className="font-heading font-bold text-base sm:text-lg text-[#0A192F]">We bring you!</p>
              <p className="font-body text-[10px] text-[#0A192F]/50 tracking-wide">Local businesses, real connections</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#DBEAFE] to-transparent" />
    </section>
  );
}