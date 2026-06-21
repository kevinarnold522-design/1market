import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabaseCompat } from '@/api/supabaseCompatClient';
import { requireSupabase } from '@/lib/supabaseClient';
import { clearGhostSession } from '@/lib/ghostAccounts';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const db = requireSupabase();
        const next = searchParams.get('next') || '/';
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setError(errorDescription || error);
          setLoading(false);
          return;
        }

        clearGhostSession();
        let user = null;

        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken && refreshToken) {
          const { data, error: hashError } = await db.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (hashError) throw hashError;
          user = data?.user || null;
        }

        if (!user && code) {
          const { data, error: sessionError } = await db.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;
          user = data?.user || null;
        }

        if (!user) {
          const { data, error: userError } = await db.auth.getUser();
          if (userError && userError.name !== 'AuthSessionMissingError') throw userError;
          user = data?.user || null;
        }

        if (!user) {
          const { data } = await db.auth.getSession();
          user = data?.session?.user || null;
        }

        if (!user) {
          setError('Authentication callback failed. Please try logging in again.');
          setLoading(false);
          return;
        }

        const profile = await supabaseCompat.auth.ensureProfile(user);
        const selectedType = sessionStorage.getItem('signup_account_type') || '';
        const preferencesRaw = sessionStorage.getItem('signup_preferences') || '';
        if (selectedType) {
          const preferences = preferencesRaw ? JSON.parse(preferencesRaw) : {};
          const userType = selectedType === 'both' ? 'business' : selectedType === 'buyer' ? 'customer' : selectedType;
          try {
            await supabaseCompat.auth.updateMe({
              user_type: userType,
              account_type: userType === 'business' ? 'business_owner' : userType,
              is_seller: userType === 'seller' || userType === 'business',
              seller_page_enabled: userType === 'seller' || userType === 'business',
              location: preferences.location || profile?.location || '',
              seller_location: preferences.location || profile?.seller_location || '',
            });
          } catch {}
          sessionStorage.removeItem('signup_account_type');
          sessionStorage.removeItem('signup_preferences');
        }
        window.dispatchEvent(new Event('supabase-auth-changed'));
        window.location.href = next.startsWith('/') ? next : '/';
      } catch (err) {
        console.error('[v0] Auth callback error:', err);
        setError(err.message || 'An error occurred during authentication');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
          <p className="text-foreground mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return null;
}