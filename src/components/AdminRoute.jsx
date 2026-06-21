import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getImpersonatedUser } from '@/pages/ConnectedAccounts';
import { isAdminAccount } from '@/lib/adminAuth';

export default function AdminRoute({ children }) {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) return null;

  const ghost = getImpersonatedUser();
  const hasAdminAccess = isAuthenticated && isAdminAccount(user, ghost);

  if (!hasAdminAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}