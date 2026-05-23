import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Check, AlertCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function UsernameSetupModal({ user, onComplete }) {
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState('customer');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = (val) => {
    if (val.length < 3) return 'At least 3 characters required';
    if (val.length > 24) return 'Max 24 characters';
    if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return 'Only letters, numbers, _ . - allowed';
    return '';
  };

  const handleChange = (val) => {
    setUsername(val);
    setError(validate(val));
  };

  const handleSave = async () => {
    const err = validate(username);
    if (err) { setError(err); return; }
    setChecking(true);
    // Check uniqueness
    const existing = await base44.entities.User.filter({ username: username.toLowerCase() });
    if (existing.some(u => u.id !== user.id)) {
      setError('This username is already taken.');
      setChecking(false);
      return;
    }
    setChecking(false);
    setSaving(true);
    await base44.auth.updateMe({
      username: username.toLowerCase(),
      username_set: true,
      full_name: username,
      account_type: accountType,
      is_seller: accountType === 'business_owner',
      member_type: accountType === 'business_owner' ? 'seller' : 'buyer',
    });
    setSaving(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,15,26,0.92)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.25)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
            <span className="text-[#0A192F] font-bold text-xs">1</span>
          </div>
          <span className="font-heading font-bold text-white text-sm">Welcome to 1Marketph!</span>
          <Sparkles className="w-3.5 h-3.5 text-[#00D4FF] ml-auto" />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h2 className="font-heading font-bold text-white text-lg mb-0.5">Set Your Username</h2>
            <p className="font-body text-xs text-white/40">This is permanent and unique — choose carefully.</p>
          </div>

          {/* Username input */}
          <div>
            <label className="font-body text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-white/30">@</span>
              <input
                value={username}
                onChange={e => handleChange(e.target.value.replace(/\s/g, ''))}
                placeholder="yourname123"
                maxLength={24}
                className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                <p className="font-body text-[10px] text-red-400">{error}</p>
              </div>
            )}
            {!error && username.length >= 3 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                <p className="font-body text-[10px] text-green-400">@{username.toLowerCase()} looks good!</p>
              </div>
            )}
          </div>

          {/* Account type */}
          <div>
            <label className="font-body text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">I am joining as</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'customer', label: '🛍️ Customer', desc: 'Browse & buy' },
                { key: 'business_owner', label: '🏪 Seller', desc: 'List & sell' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setAccountType(t.key)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${accountType === t.key ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
                >
                  <p className="font-body text-xs font-bold text-white">{t.label}</p>
                  <p className="font-body text-[9px] text-white/40 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || checking || !!error || username.length < 3}
            className="w-full py-3 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-bold text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {(saving || checking) ? (
              <><div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> Setting up...</>
            ) : (
              <><User className="w-4 h-4" /> Create My Account</>
            )}
          </button>
          <p className="font-body text-[9px] text-white/25 text-center">You can update your username anytime from Settings.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}