import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Building2, ChevronRight, AlertCircle, Upload, BadgeCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BUSINESS_TYPES = [
  { value: 'food', label: '🍔 Food & Dining', desc: 'Restaurants, carinderias, home kitchens, bakeries, cafes' },
  { value: 'retail', label: '🛒 Retail Shop', desc: 'Physical or online store selling products' },
  { value: 'services', label: '🔧 Services Provider', desc: 'Home, tech, beauty, events, logistics, professional services' },
  { value: 'travel', label: '✈️ Travel & Hospitality', desc: 'Hotels, resorts, vehicle rentals, tours' },
  { value: 'electronics', label: '📱 Electronics Store', desc: 'Gadgets, phones, computers, accessories' },
  { value: 'fashion', label: '👗 Fashion & Apparel', desc: 'Clothing, shoes, bags, accessories' },
  { value: 'realestate', label: '🏠 Real Estate', desc: 'Property sales, rentals, property management' },
  { value: 'automotive', label: '🚗 Automotive', desc: 'Car sales, parts, repair, rental' },
  { value: 'health', label: '💊 Health & Wellness', desc: 'Pharmacy, clinic, beauty salon, gym, spa' },
  { value: 'other', label: '📦 Other Business', desc: 'Other types of business not listed above' },
];

const BUSINESS_CATEGORIES = [
  { value: 'electronics', label: '📱 Electronics & Gadgets' },
  { value: 'shoes', label: '👟 Shoes & Footwear' },
  { value: 'clothing', label: '👗 Clothing & Fashion' },
  { value: 'bags', label: '👜 Bags & Accessories' },
  { value: 'food', label: '🍔 Food & Beverages' },
  { value: 'furniture', label: '🛋️ Furniture & Home' },
  { value: 'cars', label: '🚗 Vehicles & Parts' },
  { value: 'services', label: '🔧 Services' },
  { value: 'product', label: '🛒 General Products' },
  { value: 'homeappliances', label: '🏠 Home Appliances' },
  { value: 'houses', label: '🏡 Real Estate' },
  { value: 'rent', label: '🔑 For Rent / Lease' },
  { value: 'travel', label: '✈️ Travel & Hotels' },
  { value: 'jobs', label: '💼 Jobs & Employment' },
];

const MIN_PICKS = 2;
const MAX_PICKS = 6;

export default function BecomeBusinessModal({ user, onClose, onSuccess }) {
  const [step, setStep] = useState(0); // 0=biz type, 1=categories, 2=biz name, 3=documents, 4=done
  const [bizType, setBizType] = useState('');
  const [selected, setSelected] = useState([]);
  const [bizName, setBizName] = useState('');
  const [docs, setDocs] = useState([null, null, null]); // 3 docs
  const [docLabels, setDocLabels] = useState(['Business Permit / DTI', 'BIR Certificate', 'Valid ID / Photo']);
  const [uploading, setUploading] = useState([false, false, false]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleCat = (val) => {
    setError('');
    if (selected.includes(val)) {
      setSelected(s => s.filter(v => v !== val));
    } else {
      if (selected.length >= MAX_PICKS) { setError(`Max ${MAX_PICKS} categories.`); return; }
      setSelected(s => [...s, val]);
    }
  };

  const uploadDoc = async (idx, file) => {
    if (!file) return;
    const next = [...uploading]; next[idx] = true; setUploading(next);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const nextDocs = [...docs]; nextDocs[idx] = file_url;
    setDocs(nextDocs);
    const nextUp = [...uploading]; nextUp[idx] = false; setUploading(nextUp);
  };

  const handleSubmit = async () => {
    if (!docs[0] || !docs[1] || !docs[2]) { setError('Please upload all 3 documents.'); return; }
    if (!bizName.trim()) { setError('Please enter your business name.'); return; }
    setSaving(true);

    // Create verification application
    await base44.entities.VerificationApplication.create({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name || user.username || user.email,
      account_type: 'business_owner',
      doc1_url: docs[0],
      doc1_label: docLabels[0],
      doc2_url: docs[1],
      doc2_label: docLabels[1],
      doc3_url: docs[2],
      doc3_label: docLabels[2],
      status: 'pending',
    });

    // Update user with pending business status
    await base44.auth.updateMe({
      business_name: bizName.trim(),
      business_type: bizType,
      business_categories: selected,
      business_pending: true,
      verification_submitted: true,
      // Don't change user_type yet — admin must approve
    });

    setSaving(false);
    setStep(4);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
        onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)', border: '1px solid rgba(0,212,255,0.2)' }}>

          {/* Progress */}
          <div className="h-1 bg-white/10 flex-shrink-0">
            <motion.div className="h-full bg-gradient-to-r from-[#2563EB] to-[#00D4FF]"
              animate={{ width: `${((step + 1) / 5) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-sm">Register a Business</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Step 0: Business Type */}
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <h2 className="font-heading font-bold text-xl text-white mb-1">What type of business? 🏢</h2>
                  <p className="font-body text-sm text-white/45 mb-4">Select the category that best describes your business.</p>
                  <div className="space-y-2 mb-5">
                    {BUSINESS_TYPES.map(bt => (
                      <motion.button key={bt.value} whileTap={{ scale: 0.98 }}
                        onClick={() => { setBizType(bt.value); setTimeout(() => setStep(1), 200); }}
                        className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${bizType === bt.value ? 'border-[#00D4FF]/60 bg-[#00D4FF]/8' : 'border-white/10 hover:border-white/20 bg-white/4'}`}>
                        <div className="text-2xl flex-shrink-0">{bt.label.split(' ')[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-bold text-xs text-white">{bt.label.split(' ').slice(1).join(' ')}</p>
                          <p className="font-body text-[10px] text-white/35 mt-0.5">{bt.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 mt-1" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Categories */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <button onClick={() => setStep(0)} className="flex items-center gap-1 text-white/30 hover:text-white font-body text-xs mb-4 transition-colors">← Back</button>
                  <h2 className="font-heading font-bold text-xl text-white mb-1">What do you offer? 📦</h2>
                  <p className="font-body text-sm text-white/45 mb-1">Pick <span className="text-[#00D4FF] font-bold">2–{MAX_PICKS} listing categories</span> for your business.</p>
                  <p className="font-body text-[10px] text-white/30 mb-4">Selected: {selected.length}/{MAX_PICKS}</p>

                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {BUSINESS_CATEGORIES.map(cat => {
                      const isSelected = selected.includes(cat.value);
                      return (
                        <motion.button key={cat.value} whileTap={{ scale: 0.97 }}
                          onClick={() => toggleCat(cat.value)}
                          className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-[#00D4FF]/60 bg-[#00D4FF]/10' : 'border-white/10 hover:border-white/20 bg-white/4'}`}>
                          <span className="text-lg">{cat.label.split(' ')[0]}</span>
                          <span className="font-body text-[10px] text-white font-semibold flex-1">{cat.label.split(' ').slice(1).join(' ')}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-[#00D4FF] bg-[#00D4FF]' : 'border-white/20'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-[#0A192F]" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <button onClick={() => { if (selected.length < MIN_PICKS) { setError(`Pick at least ${MIN_PICKS}.`); return; } setError(''); setStep(2); }}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2"
                    style={selected.length >= MIN_PICKS ? { background: 'linear-gradient(135deg,#2563EB,#00D4FF)' } : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Business Name */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-white/30 hover:text-white font-body text-xs mb-4 transition-colors">← Back</button>
                  <h2 className="font-heading font-bold text-xl text-white mb-1">Your Business Name 🏷️</h2>
                  <p className="font-body text-sm text-white/45 mb-5">
                    This is the name customers will see on your listings, profile, and search results.
                  </p>
                  <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.18)' }}>
                    <label className="font-body text-[10px] text-white/45 uppercase tracking-wider mb-2 block">Business Name <span className="text-red-400">*</span></label>
                    <input
                      value={bizName}
                      onChange={e => { setBizName(e.target.value); setError(''); }}
                      placeholder="e.g. Maria's Bakehouse, TechZone PH, Juan's Auto Parts"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]"
                    />
                    {bizName.trim() && (
                      <p className="font-body text-[10px] text-white/35 mt-2">
                        Customers will see: <strong className="text-[#00D4FF]">{bizName.trim()}</strong> — not your personal name.
                      </p>
                    )}
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                    </div>
                  )}
                  <button onClick={() => { if (!bizName.trim()) { setError('Please enter your business name.'); return; } setError(''); setStep(3); }}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 pb-5">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-white/30 hover:text-white font-body text-xs mb-4 transition-colors">← Back</button>
                  <h2 className="font-heading font-bold text-xl text-white mb-1">Business Documents 📄</h2>
                  <p className="font-body text-sm text-white/45 mb-2">
                    Upload <strong className="text-white">3 business documents</strong> for verification.
                    Upon approval you'll get the <BadgeCheck className="w-3.5 h-3.5 text-[#2563EB] inline" /> <strong className="text-[#2563EB]">Verified Partner</strong> badge.
                  </p>
                  <div className="rounded-2xl p-3 mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="font-body text-[10px] text-amber-400 font-bold">⏳ Admin Approval Required</p>
                    <p className="font-body text-[10px] text-white/40 mt-0.5">Your account will be reviewed within 24–48 hours. You'll be notified once approved and your business account will be activated.</p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 font-body text-xs mb-3">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                    </div>
                  )}

                  <div className="space-y-3 mb-5">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${docs[idx] ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${docs[idx] ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                            {docs[idx] ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <input
                            value={docLabels[idx]}
                            onChange={e => { const l = [...docLabels]; l[idx] = e.target.value; setDocLabels(l); }}
                            className="flex-1 bg-transparent font-body text-xs text-white focus:outline-none placeholder-white/25 border-b border-white/10 pb-0.5"
                            placeholder={`Document ${idx + 1} name`}
                          />
                        </div>
                        {docs[idx] ? (
                          <div className="flex items-center gap-2">
                            <img src={docs[idx]} alt="doc" className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30" />
                            <div>
                              <p className="font-body text-[10px] text-emerald-400 font-semibold">✓ Uploaded</p>
                              <button onClick={() => { const d = [...docs]; d[idx] = null; setDocs(d); }}
                                className="font-body text-[9px] text-red-400 hover:text-red-300 transition-colors">Remove</button>
                            </div>
                          </div>
                        ) : (
                          <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/20 cursor-pointer hover:border-[#00D4FF]/40 transition-colors ${uploading[idx] ? 'opacity-60' : ''}`}>
                            {uploading[idx] ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5 text-white/30" />}
                            <span className="font-body text-xs text-white/40">{uploading[idx] ? 'Uploading...' : 'Upload document / photo'}</span>
                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => uploadDoc(idx, e.target.files[0])} disabled={uploading[idx]} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSubmit} disabled={saving || docs.some(d => !d)}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Building2 className="w-4 h-4" />}
                    {saving ? 'Submitting...' : 'Submit for Review →'}
                  </button>
                </motion.div>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-5 pb-8 text-center">
                  <div className="text-6xl mb-4 mt-4">🎉</div>
                  <h2 className="font-heading font-bold text-2xl text-white mb-2">Application Submitted!</h2>
                  <p className="font-body text-sm text-white/50 mb-4">
                    Your business account application for <strong className="text-[#00D4FF]">{bizName}</strong> has been submitted and is under review.
                  </p>
                  <div className="rounded-2xl p-4 mb-5 text-left space-y-2" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.18)' }}>
                    <p className="font-body text-xs text-white font-semibold">What happens next?</p>
                    {[
                      'Admin reviews your business documents (24–48 hours)',
                      'You\'ll receive an email notification when approved',
                      'Your account transitions to Business type and your name shows as your business name',
                      'You\'ll receive the Verified Partner badge ✅',
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <p className="font-body text-[11px] text-white/50">{s}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { onSuccess?.(); onClose(); }}
                    className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#00D4FF)' }}>
                    Got it, take me back! →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}