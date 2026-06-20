import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { redirectToLogin } from '@/lib/loginRedirect';
import OAuthOptions from '@/components/auth/OAuthOptions';

export default function LoginModal({ onClose }) {
  const [error, setError] = useState('');

  const handleLogin = () => {
    redirectToLogin();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A192F]/85 backdrop-blur-md"
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)', border: '1px solid rgba(0,212,255,0.2)' }}>

          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-sm">1</span>
              </div>
              <span className="font-heading font-bold text-white text-sm">Marketph.com</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          <div className="px-5 pb-8 text-center">
            <div className="text-5xl mb-3">👋</div>
            <h2 className="font-heading font-bold text-2xl text-white mb-1">Welcome back!</h2>
            <p className="font-body text-sm text-white/50 mb-6">Sign in to your 1Market Philippines account.</p>

            <OAuthOptions
              onError={setError}
              actionLabel="Log in with"
              className="space-y-3 mb-4"
              buttonClassName="w-full h-11 bg-white text-[#0A192F] border-white/20 hover:bg-white/90"
              separatorLineClassName="w-full border-t border-white/10"
              separatorTextClassName="bg-[#0D1F3C] px-3 text-white/40"
            />

            {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-200 text-xs">{error}</div>}

            <button
              onClick={handleLogin}
              className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#00D4FF] text-white rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
              <Shield className="w-4 h-4" /> Continue with Email →
            </button>

            <p className="font-body text-[9px] text-white/20 leading-relaxed mt-4">
              DPA 2012 compliant. Your data is safe with us.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}