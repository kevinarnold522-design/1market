import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative bg-[#0A192F] overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading font-bold text-[12rem] sm:text-[16rem] lg:text-[20rem] text-white/[0.02] whitespace-nowrap">
          1Market
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-heading font-bold text-sm">1</span>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Market<span className="text-[#00D4FF]">.ph</span>
              </span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
              Connecting consumers to products and Businesses to the right people since 2026.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-white/60">
              Categories
            </h4>
            <div className="space-y-3">
              {['Travel', 'Food', 'Buy & Sell'].map((link) =>
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s*&\s*/g, '')}`}
                className="block font-body text-sm text-white/40 hover:text-[#00D4FF] transition-colors">
                
                  {link}
                </a>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-white/60">
              About
            </h4>
            <div className="space-y-3">
              <p className="font-body text-sm text-white/40 leading-relaxed">Founded by Kevin W. Roberto</p>
              <p className="font-body text-sm text-white/40 leading-relaxed">Manila, Philippines</p>
              <Link to="/admin" className="block font-body text-xs text-white/20 hover:text-[#00D4FF] transition-colors hidden">Admin Dashboard →</Link>
              <Link to="/seller" className="block font-body text-xs text-white/20 hover:text-[#00D4FF] transition-colors">Seller Dashboard →</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30">
            © 2026 1Market.ph. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            <span className="font-body text-xs text-white/30">Live</span>
          </div>
        </div>
      </div>
    </footer>);

}