import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AlfieCharacter from '@/components/AlfieCharacter';
import { base44 } from '@/api/base44Client';

export default function NewUserAlfieSpotlight() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(isAuth => setShow(!isAuth)).catch(() => setShow(true));
  }, []);

  if (!show) return null;

  return (
    <section className="relative z-20 flex justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl rounded-[2rem] border border-[#FFD700]/40 bg-white/12 p-5 sm:p-7 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="flex justify-center -mt-2 mb-2">
          <AlfieCharacter size={170} />
        </div>
        <p className="font-heading text-2xl font-bold text-white">Hi, I’m Alfie!</p>
        <p className="font-body text-sm text-white/75 mt-2 max-w-md mx-auto">
          I’ll help new users explore listings, post ads, and find the best deals across 1Market PH.
        </p>
      </motion.div>
    </section>
  );
}