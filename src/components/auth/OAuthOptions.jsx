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
    <svg viewBox="0 0 48 48" className="w-8 h-8" aria-hidden="true">
      <path fill="#EA4335" d="M6 12.5 24 26 42 12.5v23A4.5 4.5 0 0 1 37.5 40h-27A4.5 4.5 0 0 1 6 35.5v-23Z" />
      <path fill="#FBBC04" d="M6 12.5 24 26v8L6 20.5v-8Z" />
      <path fill="#34A853" d="M42 12.5 24 26v8l18-13.5v-8Z" />
      <path fill="#4285F4" d="M10.5 8h27A4.5 4.5 0 0 1 42 12.5L24 26 6 12.5A4.5 4.5 0 0 1 10.5 8Z" />
      <path fill="#FFFFFF" d="M10.5 8h27A4.5 4.5 0 0 1 42 12.5L24 26 6 12.5A4.5 4.5 0 0 1 10.5 8Z" opacity="0.88" />
      <path fill="#EA4335" d="M6 12.5 24 26 42 12.5v5.8L24 31.8 6 18.3v-5.8Z" />
    </svg>
  );
}

export default function OAuthOptions({
  onError,
  redirectTo = '/',
  actionLabel = 'Continue with',
  className = 'space-y-3 mb-6',
  buttonClassName = 'w-full h-11',
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
              <span className={`${provider.key === 'google' ? 'w-14 h-14 text-[15px]' : 'w-10 h-10 text-[12px]'} rounded-full flex items-center justify-center font-bold ${provider.className}`}>
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