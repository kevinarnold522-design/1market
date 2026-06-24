import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabaseCompat } from '@/api/supabaseCompatClient';
import { clearGhostSession } from '@/lib/ghostAccounts';

const providers = [
  { key: 'google', label: 'Gmail', mark: 'gmail', className: 'bg-white border border-yellow-300 shadow-sm' },
  { key: 'yahoo', label: 'Yahoo', mark: 'Y!', className: 'text-[#FFD700] bg-[#6001D2]' },
];

function GmailLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" aria-hidden="true">
      <rect x="6" y="10" width="36" height="28" rx="6" fill="#FFFFFF" />
      <path fill="#EA4335" d="M12 16.75v14.5l7.95-5.96V20.2L12 16.75Z" />
      <path fill="#4285F4" d="M36 16.75v14.5l-7.95-5.96V20.2L36 16.75Z" />
      <path fill="#34A853" d="M36 31.25V20.4l-7.95 5.96v7.39H32a4 4 0 0 0 4-4.5Z" />
      <path fill="#FBBC04" d="M12 31.25V20.4l7.95 5.96v7.39H16a4 4 0 0 1-4-4.5Z" />
      <path fill="#EA4335" d="M12.85 14h22.3c.97 0 1.88.34 2.6.92L24 25.62 10.25 14.92A4 4 0 0 1 12.85 14Z" />
      <path fill="#C5221F" d="M12 16.75 24 26.1l12-9.35v-1.18c0-.22-.02-.43-.06-.65L24 23.75 12.06 14.92c-.04.22-.06.43-.06.65v1.18Z" />
    </svg>
  );
}

export default function OAuthOptions({
  onError,
  redirectTo = '/',
  actionLabel = 'Continue with',
  className = 'space-y-3 mb-6',
  buttonClassName = 'w-full min-h-24 py-4',
  separatorLineClassName = 'w-full border-t border-border',
  separatorTextClassName = 'bg-card px-3 text-muted-foreground',
  showSeparator = true
}) {
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleProvider = async (provider) => {
    setLoadingProvider(provider.key);
    onError?.('');
    try {
      clearGhostSession();
      await supabaseCompat.auth.loginWithProvider(provider.key, redirectTo);
    } catch (error) {
      setLoadingProvider('');
      onError?.(error.message || `${provider.label} sign-in failed`);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-2">
        {providers.map((provider) => (
          <Button key={provider.key} type="button" variant="outline" className={buttonClassName} onClick={() => handleProvider(provider)} disabled={!!loadingProvider}>
            {loadingProvider === provider.key ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className={`${provider.key === 'google' ? 'w-16 h-16' : 'w-10 h-10 text-[12px]'} rounded-full flex items-center justify-center font-bold ${provider.className}`}>
                {provider.mark === 'gmail' ? <GmailLogo /> : provider.mark}
              </span>
            )}
            {actionLabel} {provider.label}
          </Button>
        ))}
      </div>
      {showSeparator && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className={separatorLineClassName} /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className={separatorTextClassName}>or continue another way</span></div>
        </div>
      )}
    </div>
  );
}
