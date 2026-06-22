import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GmailIcon from '@/components/GmailIcon';
import { supabaseCompat } from '@/api/supabaseCompatClient';
import { clearGhostSession } from '@/lib/ghostAccounts';

const providers = [
  { key: 'google', label: 'Gmail', Icon: GmailIcon },
  { key: 'yahoo', label: 'Yahoo', mark: 'Y!', className: 'text-white bg-[#6001D2]' },
];

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
            ) : provider.Icon ? (
              <provider.Icon className="w-5 h-5" />
            ) : (
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${provider.className}`}>{provider.mark}</span>
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
