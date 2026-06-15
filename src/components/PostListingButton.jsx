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
  const canPost = user && (isAdmin || (userType !== 'customer' && userType !== 'rider' && (
    userType === 'seller' ||
    userType === 'business' ||
    user.is_seller ||
    user.account_type === 'business_owner'
  )));

  if (!canPost) return null;
  return <PostListingMenu user={user} compact={false} />;
}