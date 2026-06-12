import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getImpersonatedUser } from '@/pages/ConnectedAccounts';

const OWNER_EMAIL = 'kevinarnold522@gmail.com';

export default function AdminRoute({ children }) {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) return null;

  const ghost = getImpersonatedUser();
  // Never allow ghost sessions or non-owner emails
  const isOwner = !ghost && isAuthenticated && user?.email?.toLowerCase() === OWNER_EMAIL;

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
}