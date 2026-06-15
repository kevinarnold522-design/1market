import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PostListingMenu from './PostListingMenu';
import { base44 } from '@/api/base44Client';
import MemberSignupModal from './MemberSignupModal';

export default function PostListingButton({ className = '', size = 'md' }) {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  // Allow posting for admin, seller, business users
  const canPost = user && (
    user.email?.toLowerCase() === 'kevinarnold522@gmail.com' ||
    user.user_type === 'seller' ||
    user.user_type === 'business' ||
    user.is_seller ||
    user.account_type === 'business_owner'
  );

  if (user && canPost) {
    return (
      <>
        <PostListingMenu user={user} compact={false} />
        <AnimatePresence>
          {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (user) {
            navigate('/post-ad');
          } else {
            setShowSignup(true);
          }
        }}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-bold text-sm text-white transition-all hover:scale-105 ${className}`}
        style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 20px rgba(37,99,235,0.5)' }}
      >
        <Plus className="w-4 h-4" />
        Post an Ad
      </button>
      <AnimatePresence>
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </>
  );
}