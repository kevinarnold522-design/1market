import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useAdDelay } from '@/hooks/useAdDelay';

export default function GetStartedButton() {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const adsReady = useAdDelay();

  useEffect(() => {
    if (!adsReady) return;
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, [adsReady]);

  if (isAuthenticated) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <motion.button
            animate={{ boxShadow: ['0 0 20px rgba(0,212,255,0.4)', '0 0 40px rgba(0,212,255,0.7)', '0 0 20px rgba(0,212,255,0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-body font-bold text-sm text-[#0A192F] transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}
          >
            Signup
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}