import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ghost, LogOut, Globe } from 'lucide-react';
import { clearImpersonation } from '@/pages/ConnectedAccounts';

export default function GhostAccountBanner({ ghostUser, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearImpersonation();
    onSignOut?.();
    navigate('/');
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2" style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.95),rgba(124,58,237,0.95))', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(168,85,247,0.3)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Ghost className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-body text-xs font-bold text-white">
              Signed in as Created User: <span className="text-purple-200">{ghostUser.full_name}</span>
            </p>
            <p className="font-body text-[10px] text-purple-200/70">
              {ghostUser.business_name || ghostUser.channel_name || 'Created User'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/seller/${ghostUser.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-colors">
            <Globe className="w-3.5 h-3.5" /> View Profile
          </Link>
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out Ghost
          </button>
        </div>
      </div>
    </div>
  );
}