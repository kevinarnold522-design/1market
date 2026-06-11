import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ShoppingBag, Star, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const MEMBER_TYPES = [
  { key: 'buyer', icon: ShoppingBag, label: 'Buyer / Customer', desc: 'Browse, save, and rate products & food' },
  { key: 'seller', icon: Star, label: 'Seller / Business Owner', desc: 'List items, food businesses, or services' },
  { key: 'both', icon: User, label: 'Both', desc: 'Buy, sell, and rate everything on 1Market' },
];

const OAUTH_PROVIDERS = [
  {
    key: 'google',
    label: 'Continue with Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 48 48" className="flex-shrink-0">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
    bg: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  },
  {
    key: 'microsoft',
    label: 'Continue with Microsoft',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
        <path fill="#F25022" d="M1 1h10v10H1z"/>
        <path fill="#00A4EF" d="M13 1h10v10H13z"/>
        <path fill="#7FBA00" d="M1 13h10v10H1z"/>
        <path fill="#FFB900" d="M13 13h10v10H13z"/>
      </svg>
    ),
    bg: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  },
];

export default function MemberSignupModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState('');

  const handleOAuth = () => {
    // Redirect to Base44 login which supports Google, Microsoft, etc.
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleEmailSignup = () => {
    // Redirect to Base44 login/signup page
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A192F]/80 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        style={{ maxWidth: '680px', boxShadow: '0 0 0 1px rgba(0,212,255,0.1), 0 32px 80px rgba(10,25,47,0.35)' }}>

        {/* LEFT — Form */}
        <div className="flex-shrink-0 lg:w-[55%] flex flex-col">
          {/* Header */}
          <div className="bg-[#0A192F] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-[10px]">1</span>
              </div>
              <span className="font-heading font-bold text-white text-sm">Marketph.com</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-heading font-bold text-xl text-[#0A192F] mb-0.5">Join the Community</h2>
                <p className="font-body text-xs text-[#0A192F]/40 mb-5">Who are you joining as?</p>

                <div className="space-y-2 mb-5">
                  {MEMBER_TYPES.map(mt => (
                    <button key={mt.key} onClick={() => setMemberType(mt.key)}
                      className={`w-full flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${memberType === mt.key ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#0A192F]/8 hover:border-[#0A192F]/15'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${memberType === mt.key ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFC] text-[#0A192F]/30'}`}>
                        <mt.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-xs text-[#0A192F]">{mt.label}</p>
                        <p className="font-body text-[9px] text-[#0A192F]/40">{mt.desc}</p>
                      </div>
                      {memberType === mt.key && <Check className="w-3.5 h-3.5 text-[#2563EB] ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                <button onClick={() => memberType && setStep(2)} disabled={!memberType}
                  className="w-full py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-colors mb-3">
                  Continue →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setStep(1)} className="font-body text-xs text-[#0A192F]/30 hover:text-[#0A192F] mb-4 flex items-center gap-1">← Back</button>
                <h2 className="font-heading font-bold text-xl text-[#0A192F] mb-1">Create Your Account</h2>
                <p className="font-body text-xs text-[#0A192F]/40 mb-5">Free forever. No credit card needed.</p>

                {/* OAuth Buttons */}
                <div className="space-y-2.5 mb-4">
                  {OAUTH_PROVIDERS.map(provider => (
                    <button key={provider.key} onClick={handleOAuth}
                      className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl font-body font-semibold text-sm transition-all ${provider.bg}`}>
                      {provider.icon}
                      {provider.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-[#0A192F]/10" />
                  <span className="font-body text-[10px] text-[#0A192F]/30">or use email</span>
                  <div className="flex-1 h-px bg-[#0A192F]/10" />
                </div>

                {/* Email button */}
                <button onClick={handleEmailSignup}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm transition-colors mb-4">
                  <Mail className="w-4 h-4" /> Sign Up with Email
                </button>

                <p className="font-body text-[9px] text-[#0A192F]/40 text-center leading-relaxed">
                  By signing up you agree to our{' '}
                  <Link to="/privacy-policy" onClick={onClose} className="text-[#2563EB] underline">Privacy Policy</Link>.
                  Compliant with Philippine Data Privacy Act of 2012.
                </p>

                <div className="mt-4 pt-4 border-t border-[#0A192F]/8 text-center">
                  <p className="font-body text-xs text-[#0A192F]/50">Already have an account?{' '}
                    <button onClick={handleOAuth} className="text-[#2563EB] font-semibold hover:underline">Sign In</button>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT — Trust panel */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-center p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 50%,#E0F2FE 100%)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#2563EB,transparent)', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#00D4FF,transparent)', transform: 'translate(-30%,30%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-5 h-5 text-[#2563EB]" />
              <p className="font-heading font-bold text-sm text-[#0A192F]">Why Join 1Marketph?</p>
            </div>
            <div className="space-y-4">
              {[
                { IconComp: ShoppingBag, iconColor: '#2563EB', title: 'Browse & Buy Deals', desc: 'Access exclusive deals on electronics, food, travel, and more.' },
                { IconComp: Star, iconColor: '#f59e0b', title: 'Sell Anything', desc: 'List products, services, or businesses — reach buyers nationwide.' },
                { IconComp: Shield, iconColor: '#10b981', title: 'Secure & Private', desc: 'Your data is encrypted. DPA 2012 compliant. No spam ever.' },
                { IconComp: User, iconColor: '#a855f7', title: 'Built for Filipinos', desc: 'Serving Manila, Cavite, and the entire Philippines.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <item.IconComp className="w-4 h-4" style={{ color: item.iconColor }} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-[#0A192F]">{item.title}</p>
                    <p className="font-body text-[10px] text-[#0A192F]/50 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}