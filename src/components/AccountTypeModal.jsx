import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Store, Users, Check, ArrowRight, Shield, Package, Briefcase, Bike } from 'lucide-react';

const ACCOUNT_TYPES = [
  {
    key: 'buyer',
    icon: ShoppingBag,
    label: 'Customer Account',
    tagline: 'Shop, save, post & discover deals',
    perks: ['Browse all listings for free', 'Post an ad from your account', 'Save favorites & wishlist', 'Track your orders'], 
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    textColor: 'text-blue-400',
  },
  {
    key: 'seller',
    icon: Store,
    label: 'Sales Account',
    tagline: 'List & sell to thousands of buyers',
    perks: ['List products in any category', 'Manage your own store page', 'Receive & track orders', 'Apply for Verified Partner badge'],
    color: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400/60',
    bg: 'bg-yellow-400/10',
    textColor: 'text-yellow-300',
  },
  {
    key: 'both',
    icon: Users,
    label: 'Business Account',
    tagline: 'The full 1Market business experience',
    perks: ['Business profile & branding', 'Multiple staff listings', 'Priority support access', 'Exclusive Verified Partner badge'],
    color: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400/60',
    bg: 'bg-yellow-400/10',
    textColor: 'text-yellow-300',
  },
  {
    key: 'rider',
    icon: Bike,
    label: 'Rider Delivery Account',
    tagline: 'Deliver for sellers in your community',
    perks: ['Earn from deliveries', 'Get matched with nearby sellers', 'Flexible hours', 'Verified rider badge after ID check'],
    color: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    textColor: 'text-amber-400',
  },
];

const QUESTIONS = [
  {
    key: 'purpose',
    question: 'What do you want to use 1MarketPH for?',
    subtitle: 'Help us personalize your experience from day one.',
    options: [
      { value: 'buying', label: 'Buying products & services', desc: 'Find deals, compare prices, order online' },
      { value: 'selling', label: 'Selling my products or services', desc: 'Reach thousands of local buyers' },
      { value: 'both', label: 'Both buying and selling', desc: 'The full marketplace experience' },
      { value: 'delivery', label: 'Delivering orders for income', desc: 'Earn money as a rider' },
    ]
  },
  {
    key: 'interest',
    question: 'Which categories interest you most?',
    subtitle: 'We\'ll show you the most relevant listings first.',
    options: [
      { value: 'food', label: 'Food & Dining', desc: 'Restaurants, home cooking, delivery' },
      { value: 'electronics', label: 'Electronics & Gadgets', desc: 'Phones, laptops, accessories' },
      { value: 'travel', label: 'Travel & Hotels', desc: 'Bookings, rentals, tours' },
      { value: 'services', label: 'Services & Jobs', desc: 'Home, tech, beauty, hiring' },
    ]
  },
  {
    key: 'location',
    question: 'Where are you primarily based?',
    subtitle: 'We\'ll prioritize listings closest to you.',
    options: [
      { value: 'Manila', label: 'Manila / Metro Manila', desc: 'NCR and nearby cities' },
      { value: 'Cavite', label: 'Cavite', desc: 'Bacoor, Imus, Dasmariñas, etc.' },
      { value: 'Cebu', label: 'Cebu', desc: 'Cebu City and province' },
      { value: 'Davao', label: 'Davao', desc: 'Davao City and region' },
      { value: 'Nationwide', label: 'Other / Nationwide', desc: 'Rest of the Philippines' },
    ]
  },
  {
    key: 'individual_or_business',
    question: 'Are you an individual or a business?',
    subtitle: 'This helps us tailor your account features.',
    options: [
      { value: 'individual', label: 'Individual / Personal', desc: 'Acting on my own behalf' },
      { value: 'small_business', label: 'Small Business / SME', desc: 'Small to medium enterprise' },
      { value: 'corporation', label: 'Corporation / Large Business', desc: 'Registered company or franchise' },
      { value: 'ngo', label: 'NGO / Government / Non-profit', desc: 'Public service or advocacy org' },
    ]
  },
  {
    key: 'frequency',
    question: 'How often do you plan to buy or sell?',
    subtitle: 'Helps us match you with the right tools.',
    options: [
      { value: 'daily', label: 'Every day', desc: 'Very active user' },
      { value: 'weekly', label: 'A few times a week', desc: 'Regular user' },
      { value: 'monthly', label: 'Occasionally', desc: 'Casual user' },
      { value: 'just_looking', label: 'Just browsing for now', desc: 'Exploring the platform' },
    ]
  },
  {
    key: 'best_fit',
    question: 'Which account type best fits your needs?',
    subtitle: 'You can always change this later from your profile.',
    options: [
      { value: 'customer', label: 'Customer Account', desc: 'Buy & discover products' },
      { value: 'seller', label: 'Sales Account', desc: 'Sell products & services' },
      { value: 'business', label: 'Business Account', desc: 'Business listings & branding' },
      { value: 'rider', label: 'Rider Delivery Account', desc: 'Earn income from deliveries' },
    ]
  },
];

export default function AccountTypeModal({ onClose }) {
  const [step, setStep] = useState(0); // 0=type, 1-6=questions, 7=final
  const [selectedType, setSelectedType] = useState('');
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[step - 1];
  const totalSteps = QUESTIONS.length + 2;
  const progress = ((step + 1) / totalSteps) * 100;

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
      setStep(QUESTIONS.length + 1);
    }
  };

  const handleContinueToSignup = async () => {
    sessionStorage.setItem('signup_account_type', selectedType);
    sessionStorage.setItem('signup_preferences', JSON.stringify(answers));
    window.location.href = '/register';
  };

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
          <div className="h-1.5 bg-white/10">
            <motion.div className="h-full" style={{ background: 'linear-gradient(90deg,#2563EB,#00D4FF)' }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0A192F] font-bold text-sm">1</span>
              </div>
              <span className="font-heading font-bold text-white text-sm">1MarketPH.com</span>
            </div>
            <div className="flex items-center gap-3">
              {step > 0 && step <= QUESTIONS.length && (
                <span className="font-body text-[10px] text-white/30">Step {step} of {QUESTIONS.length}</span>
              )}
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Account Type */}
            {step === 0 && (
              <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-6">
                <h2 className="font-heading font-bold text-2xl text-white mb-1">Welcome to 1MarketPH</h2>
                <p className="font-body text-sm text-white/40 mb-5">First, what kind of account do you need?</p>
                <div className="space-y-3">
                  {ACCOUNT_TYPES.map(type => (
                    <motion.button key={type.key} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => handleTypeSelect(type.key)}
                      className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${selectedType === type.key ? `${type.border} ${type.bg}` : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-body font-bold text-sm text-white">{type.label}</p>
                          {selectedType === type.key && <Check className={`w-4 h-4 ${type.textColor}`} />}
                        </div>
                        <p className={`font-body text-xs mt-0.5 ${type.textColor}`}>{type.tagline}</p>
                        <div className="mt-1.5 space-y-0.5">
                          {type.perks.map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-white/30" />
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

            {/* Steps 1-6: Questions */}
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
                      {answers[currentQuestion.key] === opt.value
                        ? <Check className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                        : <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />}
                    </motion.button>
                  ))}
                </div>
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
                  Joining as a <strong className="text-[#00D4FF]">{ACCOUNT_TYPES.find(t => t.key === selectedType)?.label}</strong>
                  {answers.location ? ` from ${answers.location}` : ''}.
                </p>

                {/* Summary of answers */}
                <div className="text-left mb-5 space-y-1.5 rounded-xl p-3" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <p className="font-body text-[9px] text-[#00D4FF]/60 uppercase tracking-wider font-bold mb-2">Your Preferences (saved to profile)</p>
                  {Object.entries(answers).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#00D4FF] flex-shrink-0" />
                      <span className="font-body text-[10px] text-white/60 capitalize">{k.replace(/_/g, ' ')}: <strong className="text-white/80">{v}</strong></span>
                    </div>
                  ))}
                </div>

                <p className="font-body text-xs text-white/30 mb-6">Create your free account with Gmail or Yahoo. No username or password needed.</p>
                <div className="space-y-2.5 mb-4">
                  <button onClick={handleContinueToSignup}
                    className="w-full py-3.5 text-white rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)', boxShadow: '0 0 20px rgba(0,212,255,0.25)' }}>
                    <Shield className="w-4 h-4" /> Continue to Connect Account
                  </button>
                  <button onClick={() => { window.location.href = '/login'; }}
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