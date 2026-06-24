import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostListingMenu({ user, compact = false, iconOnly = false, onSelect }) {
  const navigate = useNavigate();
  if (!user) return null;

  const handleSelect = () => {
    onSelect?.();
    navigate('/post-ad');
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`inline-flex items-center gap-1.5 font-body font-bold transition-all rounded-xl ${
        compact
          ? 'px-2.5 py-1.5 text-xs bg-white/8 border border-[#FFD700]/30 text-white/80 hover:text-white hover:border-[#FFD700]/70'
          : 'px-4 py-2.5 text-xs bg-[#FFD700] hover:bg-white text-[#0A192F]'
      }`}
      style={!compact ? { boxShadow: '0 0 16px rgba(255,215,0,0.42)' } : undefined}
    >
      {!iconOnly && <Plus className="w-3.5 h-3.5" />}
      {iconOnly ? <Plus className="w-4 h-4" /> : 'Post an Ad'}
    </button>
  );
}