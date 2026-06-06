import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 sm:right-6 z-[400] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.5)' }}>
          <ArrowUp className="w-4 h-4 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}