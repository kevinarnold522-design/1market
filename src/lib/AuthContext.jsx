import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { toAppUser } from '@/lib/user-profile';

const AuthContext = createContext();

// Public settings used to be fetched from Base44. The app only reads
// `appPublicSettings?.public_settings`, so we provide a stable stub.
const APP_PUBLIC_SETTINGS = { public_settings: {} };

export const AuthProvider = ({ children }) => {
  // Neon Auth (Better Auth) is the source of truth for the session.
  const { data: session, isPending, refetch } = authClient.useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  const user = useMemo(
    () => (session?.user ? toAppUser(session.user) : null),
    // refreshKey lets us recompute the overlay profile after updateMe().
    [session, refreshKey]
  );

  const isAuthenticated = !!session?.user;
  const isLoadingAuth = isPending;

  // Re-read the session and the local profile overlay.
  const checkUserAuth = useCallback(async () => {
    try {
      await refetch?.();
    } catch (error) {
      console.error('[auth] refetch failed:', error);
    }
    setRefreshKey((k) => k + 1);
  }, [refetch]);

  // Kept for API compatibility with the previous Base44 implementation.
  const checkAppState = checkUserAuth;
  const refreshUser = () => setRefreshKey((k) => k + 1);

  const login = useCallback(async ({ email, password }) => {
    const res = await authClient.signIn.email({ email, password });
    if (res?.error) throw new Error(res.error.message || 'Sign in failed');
    await refetch?.();
    setRefreshKey((k) => k + 1);
    return res?.data;
  }, [refetch]);

  const signup = useCallback(async ({ email, password, name }) => {
    const res = await authClient.signUp.email({ email, password, name });
    if (res?.error) throw new Error(res.error.message || 'Sign up failed');
    await refetch?.();
    setRefreshKey((k) => k + 1);
    return res?.data;
  }, [refetch]);

  const logout = useCallback(async (shouldRedirect = true) => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('[auth] signOut failed:', error);
    }
    setRefreshKey((k) => k + 1);
    if (shouldRedirect) {
      window.location.assign('/');
    } else {
      await refetch?.();
    }
  }, [refetch]);

  const navigateToLogin = useCallback(() => {
    const redirect = encodeURIComponent(window.location.href);
    window.location.assign(`/login?redirect=${redirect}`);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: APP_PUBLIC_SETTINGS,
        authChecked: !isPending,
        login,
        signup,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
