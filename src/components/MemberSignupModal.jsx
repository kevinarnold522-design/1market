import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ShoppingBag, UtensilsCrossed, Star, Check } from 'lucide-react';

const MEMBER_TYPES = [
  { key: 'buyer', icon: ShoppingBag, label: 'Buyer / Customer', desc: 'Browse, save, and rate products & food' },
  { key: 'seller', icon: Star, label: 'Seller / Business Owner', desc: 'List items, food businesses, or services' },
  { key: 'both', icon: User, label: 'Both', desc: 'Buy, sell, and rate everything on 1Market' },
];

const EMAIL_TYPES = [
  'Gmail (google.com)', 'Yahoo Mail (yahoo.com)', 'Outlook / Hotmail (outlook.com / hotmail.com)',
  'iCloud (icloud.com)', 'AOL Mail (aol.com)', 'ProtonMail (protonmail.com)', 'Zoho Mail (zoho.com)',
  'Work / School Email (.edu, .gov, .org, .com)', 'Other email address',
];

export default function MemberSignupModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !name || !memberType) return;
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#00D4FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-[#0A192F] mb-2">Welcome to 1Market!</h2>
            <p className="font-body text-sm text-[#0A192F]/50 mb-2">We've sent a confirmation to <strong>{email}</strong></p>
            <p className="font-body text-xs text-[#0A192F]/40 mb-6">Check your inbox to complete your free membership setup.</p>
            <button onClick={onClose} className="w-full py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-[#0A192F] px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded bg-[#00D4FF] flex items-center justify-center">
                    <span className="text-[#0A192F] font-bold text-xs">1</span>
                  </div>
                  <span className="font-heading font-bold text-white text-sm">Market.ph</span>
                </div>
                <p className="font-body text-xs text-white/50">Free membership — no credit card needed</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Member Type */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-heading font-bold text-xl text-[#0A192F] mb-1">Join 1Market — It's Free!</h2>
                  <p className="font-body text-sm text-[#0A192F]/50 mb-5">What best describes you?</p>
                  <div className="space-y-3 mb-6">
                    {MEMBER_TYPES.map(mt => (
                      <button key={mt.key} onClick={() => setMemberType(mt.key)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${memberType === mt.key ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#0A192F]/10 hover:border-[#0A192F]/20'}`}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${memberType === mt.key ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-[#0A192F]/40'}`}>
                          <mt.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm text-[#0A192F]">{mt.label}</p>
                          <p className="font-body text-xs text-[#0A192F]/50">{mt.desc}</p>
                        </div>
                        {memberType === mt.key && <Check className="w-4 h-4 text-[#2563EB] ml-auto flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => memberType && setStep(2)} disabled={!memberType}
                    className="w-full py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-colors">
                    Continue →
                  </button>
                </motion.div>
              )}

              {/* Step 2: Account Details */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <button onClick={() => setStep(1)} className="font-body text-xs text-[#0A192F]/40 hover:text-[#0A192F] mb-4 flex items-center gap-1">← Back</button>
                  <h2 className="font-heading font-bold text-xl text-[#0A192F] mb-1">Create Your Free Account</h2>
                  <p className="font-body text-sm text-[#0A192F]/50 mb-5">All major email addresses are accepted.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="font-body text-xs font-semibold text-[#0A192F]/60 mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
                        <input value={name} onChange={e => setName(e.target.value)} required
                          placeholder="Your full name"
                          className="w-full pl-9 pr-4 py-2.5 border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs font-semibold text-[#0A192F]/60 mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/30" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                          placeholder="yourname@gmail.com"
                          className="w-full pl-9 pr-4 py-2.5 border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['Gmail', 'Yahoo', 'Outlook', 'iCloud', 'ProtonMail', 'Work/School', 'AOL', 'Zoho'].map(t => (
                          <span key={t} className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/40 text-[10px] rounded-full border border-[#0A192F]/5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <button type="submit"
                      className="w-full py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors">
                      Sign Up Free — Join 1Market
                    </button>
                  </form>
                  <p className="font-body text-[10px] text-[#0A192F]/30 mt-4 text-center">By signing up, you agree to our Terms of Service. Your data is kept private.</p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}