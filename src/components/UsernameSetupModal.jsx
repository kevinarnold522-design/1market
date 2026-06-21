import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Check, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INTERESTS = [
  { key: 'traveller', label: 'AI️ Traveller', desc: 'Hotels, flights, tours & rentals' },
  { key: 'food', label: 'AI Food Lover', desc: 'Restaurants, carinderias & home kitchens' },
  { key: 'shopper', label: 'AI️ Shopper', desc: 'Electronics, clothing & gadgets' },
  { key: 'services', label: 'AI Services', desc: 'Plumbers, tutors & freelancers' },
  { key: 'rent', label: 'AI Renter', desc: 'Apartments, vehicles & equipment' },
  { key: 'jobs', label: 'AI Job Seeker', desc: 'Part-time, remote & full-time work' },
];

export default function UsernameSetupModal({ user, onComplete }) {
  const [step, setStep] = useState(1); // 1=account type, 2=username, 3=interests
  const [accountType, setAccountType] = useState('');
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState([]);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = (val) => {
    if (val.length < 3) return 'At least 3 characters required';
    if (val.length > 24) return 'Max 24 characters';
    if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return 'Only letters, numbers, _ . - allowed';
    return '';
  };

  const handleUsernameChange = (val) => {
    setUsername(val);
    setError(validate(val));
  };

  const handleCheckUsername = async () => {
    const err = validate(username);
    if (err) { setError(err); return; }
    setChecking(true);
    const existing = await base44.entities.User.filter({ username: username.toLowerCase() });
    if (existing.some(u => u.id !== user.id)) {
      setError('This username is already taken.');
      setChecking(false);
      return;
    }
    setChecking(false);
    setStep(3);
  };

  const toggleInterest = (key) => {
    setInterests(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSave = async () => {
    if (interests.length === 0) return;
    setSaving(true);
    await base44.auth.updateMe({
      username: username.toLowerCase(),
      username_set: true,
      full_name: username,
      account_type: accountType,
      is_seller: accountType === 'business_owner',
      member_type: accountType === 'business_owner' ? 'seller' : 'buyer',
      interests,
    });
    // Send welcome email
    try {
      await base44.functions.invoke('sendWelcomeEmail', { role: accountType === 'business_owner' ? 'seller' : 'buyer' });
    } catch (e) { /* non-blocking */ }
    setSaving(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(7,15,26,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.25)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
              <span className="text-[#0A192F] font-bold text-xs">1</span>
            </div>
            <span className="font-heading font-bold text-white text-sm">Welcome to 1Marketph!</span>
          </div>
          <div className="flex gap-1">
            {[1,2,3].map(s => (
              <div key={s} className={`w-5 h-1 rounded-full transition-colors ${step >= s ? 'bg-[#00D4FF]' : 'bg-white/15'}`}/>
            ))}
          </div>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">

            {/* STEP 1 — Account Type */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-white text-lg mb-0.5">What type of account?</h2>
                  <p className="font-body text-xs text-white/40">Choose how you'll use 1Market.ph</p>
                </div>
                <div className="space-y-2">
                  {[
                    { key: 'customer', label: 'AI️ Customer Account', desc: 'Browse, save, rate & buy products, food, and services.' },
                    { key: 'business_owner', label: 'AI Business Owner Account', desc: 'List your products, food, or services and sell to thousands.' },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setAccountType(t.key)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${accountType === t.key ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-white/10 hover:border-white/25'}`}
                    >
                      <p className="font-body text-sm font-bold text-white">{t.label}</p>
                      <p className="font-body text-[10px] text-white/40 mt-0.5 leading-relaxed">{t.desc}</p>
                      {accountType === t.key && <Check className="w-4 h-4 text-[#00D4FF] mt-1" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => accountType && setStep(2)}
                  disabled={!accountType}
                  className="w-full py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4"/>
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Username */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-white text-lg mb-0.5">Choose Your Username</h2>
                  <p className="font-body text-xs text-white/40">This will be your public handle on 1Market.ph.</p>
                </div>
                <div>
                  <label className="font-body text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-white/30">@</span>
                    <input
                      value={username}
                      onChange={e => handleUsernameChange(e.target.value.replace(/\s/g, ''))}
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
                <button
                  onClick={handleCheckUsername}
                  disabled={checking || !!error || username.length < 3}
                  className="w-full py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {checking ? <><div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"/>Checking...</> : <>Continue <ChevronRight className="w-4 h-4"/></>}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-center font-body text-xs text-white/30 hover:text-white transition-colors">← Back</button>
              </motion.div>
            )}

            {/* STEP 3 — Interests (mandatory) */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-white text-lg mb-0.5">What are you here for?</h2>
                  <p className="font-body text-xs text-white/40">Select all that apply — this helps us personalize your experience.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(item => (
                    <button
                      key={item.key}
                      onClick={() => toggleInterest(item.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${interests.includes(item.key) ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-white/10 hover:border-white/25'}`}
                    >
                      <p className="font-body text-xs font-bold text-white">{item.label}</p>
                      <p className="font-body text-[9px] text-white/40 mt-0.5">{item.desc}</p>
                      {interests.includes(item.key) && <Check className="w-3 h-3 text-[#00D4FF] mt-0.5" />}
                    </button>
                  ))}
                </div>
                {interests.length === 0 && (
                  <p className="font-body text-[10px] text-amber-400 text-center">Please select at least one interest to continue.</p>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || interests.length === 0}
                  className="w-full py-3 bg-[#00D4FF] hover:bg-white text-[#0A192F] rounded-xl font-body font-bold text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"/> Setting up your account...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Finish & Enter 1Market.ph</>
                  )}
                </button>
                <button onClick={() => setStep(2)} className="w-full text-center font-body text-xs text-white/30 hover:text-white transition-colors">← Back</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}