import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Store, Users, Check, ArrowRight, Shield, Star, Package, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ACCOUNT_TYPES = [
  {
    key: 'buyer',
    icon: ShoppingBag,
    label: 'Buyer / Customer',
    tagline: 'Shop, save & discover deals',
    perks: ['Browse all listings for free', 'Save favorites & wishlist', 'Track your orders', 'Rate businesses & sellers'],
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    iconColor: '#60a5fa',
  },
  {
    key: 'seller',
    icon: Store,
    label: 'Sales Account',
    tagline: 'List & sell to thousands of buyers',
    perks: ['List products in any category', 'Manage your own store page', 'Receive & track orders', 'Apply for Verified Partner badge'],
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    iconColor: '#34d399',
  },
  {
    key: 'both',
    icon: Users,
    label: 'Both — Buy & Sell',
    tagline: 'The full 1Market experience',
    perks: ['Everything in Buyer & Seller', 'Switch roles anytime', 'Priority support access', 'Exclusive member deals'],
    color: 'from-purple-500 to-pink-500',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    iconColor: '#c084fc',
  },
];

const QUESTIONS = [
  {
    key: 'location',
    question: 'Where are you based?',
    subtitle: 'We\'ll show you the most relevant listings first.',
    options: [
      { value: 'Manila', label: 'Manila / Metro Manila', desc: 'NCR and nearby cities' },
      { value: 'Cavite', label: 'Cavite', desc: 'Bacoor, Imus, Dasmariñas, etc.' },
      { value: 'Cebu', label: 'Cebu', desc: 'Cebu City and province' },
      { value: 'Davao', label: 'Davao', desc: 'Davao City and region' },
      { value: 'Nationwide', label: 'Other / Nationwide', desc: 'Rest of the Philippines' },
    ]
  },
  {
    key: 'interest',
    question: 'What are you most interested in?',
    subtitle: 'Help us personalize your experience.',
    options: [
      { value: 'food', label: 'Food & Dining', desc: 'Restaurants, carinderias, delivery' },
      { value: 'electronics', label: 'Electronics & Gadgets', desc: 'Phones, laptops, accessories' },
      { value: 'travel', label: 'Travel & Hotels', desc: 'Bookings, rentals, tours' },
      { value: 'services', label: 'Services', desc: 'Home, tech, beauty, events' },
      { value: 'general', label: 'General Shopping', desc: 'All categories' },
    ]
  }
];

export default function AccountTypeModal({ onClose }) {
  const [step, setStep] = useState(0); // 0=type, 1=q1, 2=q2, 3=final
  const [selectedType, setSelectedType] = useState('');
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[step - 1];

  const handleTypeSelect = (key) => {
    setSelectedType(key);
    setTimeout(() => setStep(1), 300);
  };

  const handleAnswer = (questionKey, value) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      // All done — go to signup
      setStep(QUESTIONS.length + 1);
    }
  };

  const handleContinueToSignup = async () => {
    sessionStorage.setItem('signup_account_type', selectedType);
    sessionStorage.setItem('signup_preferences', JSON.stringify(answers));
    const cleanUrl = window.location.origin + window.location.pathname;
    const loginUrl = `/login?next=${encodeURIComponent(cleanUrl)}`;
    const popup = window.open(loginUrl, 'base44_login', 'width=500,height=650,left=200,top=100');
    if (!popup) { window.open(loginUrl, '_blank'); return; }
    const timer = setInterval(() => {
      if (!popup || popup.closed) { clearInterval(timer); window.location.reload(); }
    }, 600);
  };

  const totalSteps = QUESTIONS.length + 2; // type + questions + confirm
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A192F]/85 backdrop-blur-md"
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
          style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)', border: '1px solid rgba(0,212,255,0.2)' }}>

          {/* Progress bar */}
          <div className="h-1 bg-white/10">
            <motion.div className="h-full bg-gradient-to-r from-[#2563EB] to-[#00D4FF]"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-sm">1</span>
              </div>
              <span className="font-heading font-bold text-white text-sm">Marketph.com</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Account Type */}
            {step === 0 && (
              <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                <h2 className="font-heading font-bold text-2xl text-white mb-1">Welcome to 1MarketPH</h2>
                <p className="font-body text-sm text-white/40 mb-5">First, tell us what you're here for.</p>
                <div className="space-y-3">
                  {ACCOUNT_TYPES.map(type => (
                    <motion.button key={type.key} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => handleTypeSelect(type.key)}
                      className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${selectedType === type.key ? `${type.border} ${type.bg}` : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-body font-bold text-sm text-white">{type.label}</p>
                          {selectedType === type.key && <Check className={`w-4 h-4 ${type.textColor}`} />}
                        </div>
                        <p className={`font-body text-xs mt-0.5 ${type.textColor}`}>{type.tagline}</p>
                        <div className="mt-2 space-y-0.5">
                          {type.perks.map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className={`w-1 h-1 rounded-full ${type.textColor.replace('text', 'bg')}`} />
                              <span className="font-body text-[10px] text-white/40">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Steps 1+: Questions */}
            {step >= 1 && step <= QUESTIONS.length && currentQuestion && (
              <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-white/30 hover:text-white font-body text-xs mb-4 transition-colors">
                  ← Back
                </button>
                <h2 className="font-heading font-bold text-xl text-white mb-1">{currentQuestion.question}</h2>
                <p className="font-body text-sm text-white/40 mb-5">{currentQuestion.subtitle}</p>
                <div className="space-y-2">
                  {currentQuestion.options.map(opt => (
                    <motion.button key={opt.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswer(currentQuestion.key, opt.value)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${answers[currentQuestion.key] === opt.value ? 'border-[#00D4FF]/60 bg-[#00D4FF]/10' : 'border-white/10 hover:border-white/25 bg-white/5'}`}>
                      <div className="flex-1">
                        <p className="font-body font-semibold text-sm text-white">{opt.label}</p>
                        <p className="font-body text-[10px] text-white/40 mt-0.5">{opt.desc}</p>
                      </div>
                      {answers[currentQuestion.key] === opt.value && <Check className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />}
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
                <p className="text-center font-body text-[10px] text-white/20 mt-4">Question {step} of {QUESTIONS.length}</p>
              </motion.div>
            )}

            {/* Final step */}
            {step === QUESTIONS.length + 1 && (
              <motion.div key="final" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pb-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00D4FF] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">You're all set!</h2>
                <p className="font-body text-sm text-white/50 mb-2">
                  You're joining as a <strong className="text-[#00D4FF]">{ACCOUNT_TYPES.find(t => t.key === selectedType)?.label}</strong>
                  {answers.location ? ` from ${answers.location}` : ''}.
                </p>
                <p className="font-body text-xs text-white/30 mb-6">Create your free account to get started. No credit card needed.</p>

                <div className="space-y-2.5 mb-4">
                  <button onClick={handleContinueToSignup}
                    className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#00D4FF] text-white rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                    <Shield className="w-4 h-4" /> Continue with Google / Email →
                  </button>
                  <button onClick={handleContinueToSignup}
                    className="w-full py-2.5 bg-white/10 border border-white/15 text-white/70 rounded-xl font-body text-sm hover:bg-white/15 transition-colors">
                    Sign in to existing account
                  </button>
                </div>

                <p className="font-body text-[9px] text-white/20 leading-relaxed">
                  By signing up you agree to our Privacy Policy. DPA 2012 compliant. Free forever.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}