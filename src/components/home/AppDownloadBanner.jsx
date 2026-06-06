import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download } from 'lucide-react';

export default function AppDownloadBanner() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg,#0a1628 0%,#001a80 50%,#0033CC 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FFD700 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-8 h-8 text-[#FFD700]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1">1MarketPH on Mobile</h3>
              <p className="font-body text-sm text-white/60">Shop, sell, and connect on the go. Available on iOS & Android.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg,#FFD700,#f59e0b)' }}>
                <span>🍎</span> App Store
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-body font-bold text-sm hover:bg-white/20 hover:scale-105 transition-all">
                <Download className="w-4 h-4" /> Google Play
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}