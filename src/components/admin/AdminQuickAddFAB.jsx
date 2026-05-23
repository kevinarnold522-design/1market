import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import QuickAddModal from './QuickAddModal';

/**
 * Floating "+" button shown to admins and moderators on any page.
 * defaultMode: 'business' | 'listing'
 * onAdded: optional callback after save
 */
export default function AdminQuickAddFAB({ defaultMode = 'business', onAdded, forceSection, forceSubcategory }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        setIsAdmin(u?.role === 'admin' || u?.role === 'moderator' || u?.email === 'Kevinarnold522@gmail.com');
        setIsSeller(u?.is_seller || u?.account_type === 'business_owner');
      })
      .catch(() => {});
  }, []);

  if (!isAdmin && !isSeller) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)', boxShadow: '0 0 24px rgba(0,212,255,0.4)' }}
        title="Add new business or listing"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <QuickAddModal
            defaultMode={defaultMode}
            onClose={() => setOpen(false)}
            onAdded={(type) => { if (onAdded) onAdded(type); }}
            isAdmin={isAdmin}
            isSeller={isSeller}
            sellerEmail={user?.email}
            sellerName={user?.full_name}
            forceSection={forceSection}
            forceSubcategory={forceSubcategory}
          />
        )}
      </AnimatePresence>
    </>
  );
}