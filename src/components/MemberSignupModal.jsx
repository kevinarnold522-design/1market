import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ShoppingBag, Star, Check, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const MEMBER_TYPES = [
  { key: 'buyer', icon: ShoppingBag, label: 'Buyer / Customer', desc: 'Browse, save, and rate products & food' },
  { key: 'seller', icon: Star, label: 'Seller / Business Owner', desc: 'List items, food businesses, or services' },
  { key: 'both', icon: User, label: 'Both', desc: 'Buy, sell, and rate everything on 1Market' },
];

const PRIVACY_POINTS = [
  { icon: '🔒', title: '100% Secure', desc: 'Your information is encrypted and stored safely.' },
  { icon: '🚫', title: 'Zero Misuse', desc: 'We do not sell, rent, or share your personal data with ad networks.' },
  { icon: '📦', title: 'Operations Only', desc: 'Your details are only accessed to process your login and ship your orders.' },
  { icon: '📋', title: 'DPA Compliant', desc: 'Fully aligned with the Data Privacy Act of 2012. You can request data deletion anytime.' },
];

function PrivacyTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 hover:bg-[#00D4FF]/20 transition-colors"
      >
        <Shield className="w-3 h-3 text-[#00D4FF]" />
        <span className="font-body text-[10px] text-[#2563EB] font-semibold">Your Data is Safe With Us</span>
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{ background: '#0A192F', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            <div className="p-3 border-b border-white/10">
              <p className="font-body text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider">Privacy Guarantee</p>
            </div>
            <div className="p-3 space-y-2.5">
              {PRIVACY_POINTS.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">{p.icon}</span>
                  <div>
                    <p className="font-body text-[10px] font-bold text-white">{p.title}</p>
                    <p className="font-body text-[9px] text-white/50 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: '🔒', title: 'Encrypted Storage', desc: 'Your password and personal details are fully protected using industry-standard cloud encryption.' },
  { icon: '🙅', title: 'No Data Selling', desc: 'We hate spam too. Your personal information will never be used for third-party marketing or tracking.' },
  { icon: '🚀', title: 'Instant Deletion Control', desc: 'You own your data. If you ever want to close your account, email us and we will purge your data completely within 5 business days.' },
];

export default function MemberSignupModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !memberType || password.length < 8 || !agreed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    window.location.href = `/login?email=${encodeURIComponent(email)}&next=/`;
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#0A192F]/80 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
        style={{ maxWidth: '760px', boxShadow: '0 0 0 1px rgba(0,212,255,0.1), 0 32px 80px rgba(10,25,47,0.35)' }}>

        {submitted ? (
          <div className="p-8 text-center w-full">
            <div className="w-16 h-16 bg-[#00D4FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-[#0A192F] mb-2">Welcome to the Community!</h2>
            <p className="font-body text-sm text-[#0A192F]/50 mb-6">A verification email has been sent to <strong>{email}</strong>. Check your inbox to activate your account.</p>
            <button onClick={onClose} className="w-full max-w-xs mx-auto block py-3 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold transition-colors">Done</button>
          </div>
        ) : (
          <>
            {/* LEFT PANEL — Form */}
            <div className="flex-shrink-0 lg:w-[40%] flex flex-col">
              {/* Header */}
              <div className="bg-[#0A192F] px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded bg-[#00D4FF] flex items-center justify-center">
                      <span className="text-[#0A192F] font-bold text-[10px]">1</span>
                    </div>
                    <span className="font-heading font-bold text-white text-sm">Marketph.com</span>
                  </div>
                  <PrivacyTooltip />
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="p-5 flex-1">
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="font-heading font-bold text-lg text-[#0A192F] mb-0.5">Join the Community</h2>
                    <p className="font-body text-xs text-[#0A192F]/40 mb-4">Who are you?</p>
                    <div className="space-y-2 mb-4">
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
                      className="w-full py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-colors">
                      Continue →
                    </button>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    <button onClick={() => setStep(1)} className="font-body text-xs text-[#0A192F]/30 hover:text-[#0A192F] mb-3 flex items-center gap-1">← Back</button>
                    <h2 className="font-heading font-bold text-lg text-[#0A192F] mb-0.5">Create Your Account</h2>
                    <p className="font-body text-xs text-[#0A192F]/40 mb-4">Free forever. No credit card needed.</p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="font-body text-[10px] font-semibold text-[#0A192F]/50 mb-1 block uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A192F]/25" />
                          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"
                            className="w-full pl-8 pr-3 py-2 border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#00D4FF] transition-colors hover:border-[#0A192F]/20" />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-[10px] font-semibold text-[#0A192F]/50 mb-1 block uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A192F]/25" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="yourname@gmail.com"
                            className="w-full pl-8 pr-3 py-2 border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#00D4FF] transition-colors hover:border-[#0A192F]/20" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                          <Lock className="w-2.5 h-2.5 text-[#2563EB] flex-shrink-0" />
                          <p className="font-body text-[9px] text-[#0A192F]/35">We only use your email for account security and order updates. No spam, ever.</p>
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-[10px] font-semibold text-[#0A192F]/50 mb-1 block uppercase tracking-wider">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0A192F]/25" />
                          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters"
                            className="w-full pl-8 pr-9 py-2 border border-[#0A192F]/10 rounded-xl font-body text-sm text-[#0A192F] focus:outline-none focus:border-[#00D4FF] transition-colors hover:border-[#0A192F]/20" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A192F]/25 hover:text-[#0A192F]/60">
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {password.length > 0 && password.length < 8 && <p className="font-body text-[9px] text-red-400 mt-1">At least 8 characters required</p>}
                      </div>

                      {/* Consent checkbox */}
                      <label className="flex items-start gap-2 p-2.5 rounded-xl border border-[#0A192F]/8 bg-[#F8FAFC] cursor-pointer hover:border-[#2563EB]/30 transition-colors">
                        <div className="flex-shrink-0 mt-0.5">
                          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-3 h-3 accent-[#2563EB]" />
                        </div>
                        <p className="font-body text-[9px] text-[#0A192F]/50 leading-relaxed">
                          I agree to the <Link to="/privacy-policy" onClick={onClose} className="text-[#2563EB] underline">Privacy Policy</Link>. I understand my data is processed strictly under the Philippine Data Privacy Act of 2012 and will not be shared with third-party advertisers.
                        </p>
                      </label>

                      <button type="submit" disabled={password.length < 8 || !agreed || loading}
                        className="w-full py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                            Creating Account...
                          </>
                        ) : 'Create Account →'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL — Trust summary */}
            <div className="hidden lg:flex lg:w-[60%] flex-col justify-center p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #E0F2FE 100%)' }}>
              {/* Decorative bg circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #2563EB, transparent)', transform: 'translate(30%, -30%)' }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #00D4FF, transparent)', transform: 'translate(-30%, 30%)' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-[#2563EB]" />
                  <p className="font-heading font-bold text-sm text-[#0A192F]">Your Trust & Privacy</p>
                </div>

                <div className="space-y-5">
                  {TRUST_ITEMS.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-sm text-[#0A192F]">{item.title}</p>
                        <p className="font-body text-xs text-[#0A192F]/55 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-xl border border-[#2563EB]/15 bg-white/60">
                  <p className="font-body text-[10px] text-[#0A192F]/50 leading-relaxed">
                    🇵🇭 Compliant with the <strong>Philippine Data Privacy Act of 2012 (RA 10173)</strong>. You may request data deletion anytime by emailing <span className="text-[#2563EB]">privacy@1marketph.com</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}