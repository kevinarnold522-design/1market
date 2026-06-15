import React, { useState, useEffect } from 'react';
import PostListingMenu from './PostListingMenu';
import { base44 } from '@/api/base44Client';

export default function PostListingButton({ className = '', size = 'md' }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const userType = user?.user_type;
  const isAdmin = user?.email?.toLowerCase() === 'kevinarnold522@gmail.com' || user?.role === 'admin';
  const isBusinessAccount = userType === 'business' || user?.account_type === 'business_owner';
  const isSellerAccount = userType === 'seller' || user?.is_seller || isBusinessAccount;
  const isBlockedUserType = userType === 'rider' || (userType === 'customer' && !isSellerAccount);
  const canPost = user && !isBlockedUserType && (isAdmin || isSellerAccount);

  if (!canPost) return null;
  return <PostListingMenu user={user} compact={false} />;
}