import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseCompat } from '@/api/supabaseCompatClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract the code from the URL (Supabase OAuth/Magic Link flow)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setError(errorDescription || error);
          setLoading(false);
          return;
        }

        if (code) {
          // Exchange the code for a session
          const { supabaseCompat: compat } = await import('@/api/supabaseCompatClient');
          const db = (await import('@/lib/supabaseClient')).requireSupabase();
          
          const { data, error: sessionError } = await db.auth.exchangeCodeForSession(code);
          
          if (sessionError) {
            console.error('[v0] Session exchange error:', sessionError);
            setError(sessionError.message || 'Authentication failed');
            setLoading(false);
            return;
          }

          if (data?.user) {
            // Profile should auto-create via trigger, but ensure it exists
            await compat.auth.ensureProfile(data.user);
            
            // Redirect to homepage after authentication
            window.location.href = '/';
            return;
          }
        }

        // If we get here, something went wrong
        setError('Authentication callback failed. Please try again.');
        setLoading(false);
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