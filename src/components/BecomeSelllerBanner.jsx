import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BecomeSellerBanner({ className = '' }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap ${className}`}
      style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.6),rgba(0,26,128,0.8))', border: '1px solid rgba(0,212,255,0.25)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
          <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
        </div>
        <div>
          <p className="font-heading font-bold text-white text-sm">Want to earn money?</p>
          <p className="font-body text-xs text-white/50">Open a Sales Account and start listing for free.</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/onboarding')}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] flex-shrink-0 transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 16px rgba(0,212,255,0.35)' }}
      >
        <Store className="w-4 h-4" />
        Become a Seller
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}