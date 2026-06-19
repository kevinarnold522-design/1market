import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
import { getGhostSession, clearGhostSession } from '@/lib/ghostAccounts';

const AuthContext = createContext();

// Session-level cache to avoid redundant fetches on hot reloads / tab switches
let _cachedUser = null;
let _cachedPublicSettings = null;
let _authInitialized = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
    const refreshGhostSession = () => {
      _cachedUser = null;
      _authInitialized = false;
      checkAppState();
    };
    window.addEventListener('ghost-session-changed', refreshGhostSession);
    return () => window.removeEventListener('ghost-session-changed', refreshGhostSession);
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      const activeGhost = getGhostSession();
      // Use cached values for fast subsequent loads, unless a Ghost session is active/changed
      if (_authInitialized && _cachedPublicSettings && !activeGhost) {
        setAppPublicSettings(_cachedPublicSettings);
        if (_cachedUser) {
          setUser(_cachedUser);
          setIsAuthenticated(true);
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
        return;
      }

      let publicSettings = { app_access: 'public', login_required: false };
      let currentUser = null;

      if (import.meta.env.VITE_BACKEND_PROVIDER !== 'base44') {
        currentUser = activeGhost || await base44.auth.me().catch(() => null);
      } else {
        const appClient = createAxiosClient({
          baseURL: `/api/apps/public`,
          headers: { 'X-App-Id': appParams.appId },
          token: appParams.token,
          interceptResponses: true
        });

        const settingsPromise = appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        const authPromise = appParams.token ? base44.auth.me().catch(() => null) : Promise.resolve(null);

        try {
          [publicSettings, currentUser] = await Promise.all([settingsPromise, authPromise]);
          const impersonated = getGhostSession();
          if (impersonated) {
            currentUser = impersonated;
          }
        } catch (appError) {
          console.error('App state check failed:', appError);
          if (appError.status === 403 && appError.data?.extra_data?.reason) {
            const reason = appError.data.extra_data.reason;
            setAuthError({ type: reason, message: appError.message });
          } else {
            setAuthError({ type: 'unknown', message: appError.message || 'Failed to load app' });
          }
          setIsLoadingPublicSettings(false);
          setIsLoadingAuth(false);
          return;
        }
      }

      _cachedPublicSettings = publicSettings;
      _authInitialized = true;
      setAppPublicSettings(publicSettings);

      if (currentUser) {
        _cachedUser = currentUser;
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        _cachedUser = null;
        setIsAuthenticated(false);
      }

      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({ type: 'unknown', message: error.message || 'An unexpected error occurred' });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      _cachedUser = currentUser;
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      _cachedUser = null;
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    clearGhostSession();
    _cachedUser = null;
    _authInitialized = false;
    setUser(null);
    setIsAuthenticated(false);
    base44.auth.logout(shouldRedirect ? '/' : undefined);
  };

  const navigateToLogin = () => {
    const next = encodeURIComponent(window.location.href);
    window.location.href = `/login?next=${next}`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};