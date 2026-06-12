import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Upload, Camera, Check, AlertCircle, Bike, FileText, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DOC_FIELDS = [
  { key: 'rider_id1_url', label: 'Valid ID #1', desc: 'Government-issued ID (front)' },
  { key: 'rider_id2_url', label: 'Valid ID #2', desc: 'Government-issued ID (back or second ID)' },
  { key: 'rider_id3_url', label: 'Valid ID #3', desc: 'Any other valid government ID' },
  { key: 'rider_billing_url', label: 'Proof of Billing', desc: 'Recent utility bill or bank statement' },
  { key: 'rider_barangay_url', label: 'Barangay Clearance', desc: 'Issued within the last 6 months' },
];

const VEHICLE_TYPES = [
  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚲' },
  { value: 'e-bike', label: 'E-Bike', icon: '⚡' },
  { value: 'car', label: 'Car', icon: '🚗' },
];

export default function RiderOnboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // 0=intro, 1=docs, 2=vehicle, 3=done
  const [docs, setDocs] = useState({});
  const [uploading, setUploading] = useState({});
  const [vehicleType, setVehicleType] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.auth.me()
      .then(u => { setUser(u); setPhone(u?.phone || ''); setLoading(false); })
      .catch(() => navigate('/'));
  }, []);

  const uploadDoc = async (field, file) => {
    setUploading(u => ({ ...u, [field]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setDocs(d => ({ ...d, [field]: file_url }));
    setUploading(u => ({ ...u, [field]: false }));
  };

  const allDocsUploaded = DOC_FIELDS.every(f => docs[f.key]);

  const handleSubmit = async () => {
    if (!vehicleType) { setError('Please select your vehicle type.'); return; }
    setSaving(true);
    await base44.auth.updateMe({
      user_type: 'rider',
      account_type: 'rider',
      is_seller: false,
      phone,
      seller_area: area,
      rider_id1_url: docs.rider_id1_url || '',
      rider_id2_url: docs.rider_id2_url || '',
      rider_id3_url: docs.rider_id3_url || '',
      rider_billing_url: docs.rider_billing_url || '',
      rider_barangay_url: docs.rider_barangay_url || '',
      rider_vehicle_type: vehicleType,
      rider_verification_status: 'pending',
      onboarding_completed: true,
    });
    setSaving(false);
    setStep(3);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0A192F,#0D1F3C)' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/20 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  const progress = step === 0 ? 5 : step === 1 ? 40 : step === 2 ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg,#070F1A,#0D1F3C,#0A192F)' }}>
      <div className="px-6 py-4 border-b border-white/8 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors font-body text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} />
        </div>
        <span className="font-body text-xs text-white/40">{progress}%</span>
      </div>

      <div className="flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Intro */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl"
                  style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(251,191,36,0.1))', border: '2px solid rgba(245,158,11,0.4)' }}>
                  <Bike className="w-10 h-10 text-amber-400" />
                </div>
                <h1 className="font-heading font-black text-3xl text-white mb-3">Become a Rider</h1>
                <p className="font-body text-sm text-white/50 mb-8 max-w-xs mx-auto leading-relaxed">
                  Earn income by delivering orders for sellers in your area. We require identity verification to keep our platform safe.
                </p>
                <div className="space-y-3 text-left mb-8">
                  {[
                    { icon: '🪪', title: '3 Valid Government IDs', desc: 'Any government-issued ID' },
                    { icon: '🧾', title: 'Proof of Billing', desc: 'Utility bill or bank statement' },
                    { icon: '📋', title: 'Barangay Clearance', desc: 'Recent certificate from your barangay' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-body font-bold text-sm text-white">{item.title}</p>
                        <p className="font-body text-[10px] text-white/40">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(1)}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow: '0 0 24px rgba(245,158,11,0.3)', color: '#1a0a00' }}>
                  Start Verification <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 1 — Upload Documents */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-white/50 hover:text-white font-body text-sm mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">Upload Your Documents</h2>
                <p className="font-body text-sm text-white/50 mb-6">Accepted: JPG, PNG, PDF, WEBP. All uploads are secure.</p>

                <div className="space-y-3 mb-6">
                  {DOC_FIELDS.map(field => {
                    const uploaded = !!docs[field.key];
                    const isUploading = uploading[field.key];
                    return (
                      <label key={field.key} className="block cursor-pointer">
                        <input type="file" accept="image/*,.pdf" className="hidden"
                          onChange={e => { const f = e.target.files[0]; if (f) uploadDoc(field.key, f); e.target.value = ''; }} />
                        <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${uploaded ? 'border-green-500/50 bg-green-500/8' : 'border-white/10 hover:border-amber-400/40 bg-white/4'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${uploaded ? 'bg-green-500/20' : 'bg-white/8'}`}>
                            {isUploading
                              ? <div className="w-4 h-4 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
                              : uploaded
                              ? <Check className="w-5 h-5 text-green-400" />
                              : <Upload className="w-5 h-5 text-white/30" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-body font-bold text-sm ${uploaded ? 'text-green-300' : 'text-white'}`}>{field.label}</p>
                            <p className="font-body text-[10px] text-white/35">{uploaded ? 'Uploaded successfully' : field.desc}</p>
                          </div>
                          {!uploaded && <span className="font-body text-[10px] text-amber-400 font-bold px-2 py-1 rounded-lg border border-amber-400/30 bg-amber-400/8 flex-shrink-0">Upload</span>}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {!allDocsUploaded && (
                  <p className="text-center font-body text-[10px] text-white/25 mb-4">
                    {DOC_FIELDS.filter(f => docs[f.key]).length} of {DOC_FIELDS.length} documents uploaded
                  </p>
                )}

                <button onClick={() => setStep(2)} disabled={!allDocsUploaded}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                  style={{ background: allDocsUploaded ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : 'rgba(255,255,255,0.1)', color: allDocsUploaded ? '#1a0a00' : 'rgba(255,255,255,0.4)' }}>
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Vehicle & Details */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-white/50 hover:text-white font-body text-sm mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">Almost Done!</h2>
                <p className="font-body text-sm text-white/50 mb-6">Tell us about your delivery setup.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Vehicle Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {VEHICLE_TYPES.map(v => (
                        <button key={v.value} onClick={() => setVehicleType(v.value)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${vehicleType === v.value ? 'border-amber-400/60 bg-amber-400/10' : 'border-white/10 hover:border-white/25 bg-white/5'}`}>
                          <span className="text-xl">{v.icon}</span>
                          <span className="font-body font-bold text-sm text-white">{v.label}</span>
                          {vehicleType === v.value && <Check className="w-4 h-4 text-amber-400 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 9xx-xxx-xxxx"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  </div>

                  <div>
                    <label className="block font-body text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Service Area / Barangay</label>
                    <input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Bacoor, Imus, Dasmariñas"
                      className="w-full px-4 py-3 rounded-xl font-body text-sm text-white focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  </div>
                </div>

                {error && <p className="text-red-400 font-body text-xs mt-3 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}

                <button onClick={handleSubmit} disabled={saving}
                  className="w-full py-3.5 rounded-2xl font-body font-bold text-sm text-white flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#1a0a00', boxShadow: '0 0 24px rgba(245,158,11,0.25)' }}>
                  {saving ? <div className="w-4 h-4 border-2 border-[#1a0a00]/30 border-t-[#1a0a00] rounded-full animate-spin" /> : <Bike className="w-4 h-4" />}
                  {saving ? 'Submitting...' : 'Submit for Verification'}
                </button>
                <p className="text-center font-body text-[10px] text-white/25 mt-2">Admin will review within 24–48 hours</p>
              </motion.div>
            )}

            {/* STEP 3 — Done */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(251,191,36,0.1))', border: '2px solid rgba(245,158,11,0.4)' }}>
                  <Shield className="w-10 h-10 text-amber-400" />
                </motion.div>
                <h2 className="font-heading font-black text-3xl text-white mb-2">Application Submitted!</h2>
                <p className="font-body text-sm text-white/60 mb-6 max-w-xs mx-auto leading-relaxed">
                  Your rider verification is under review. You'll be notified once an admin approves your documents (24–48 hrs).
                </p>
                <div className="space-y-1.5 mb-6 text-left max-w-xs mx-auto">
                  {['3 Valid IDs', 'Proof of Billing', 'Barangay Clearance'].map((doc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="font-body text-sm text-white/60">{doc} — Submitted</span>
                    </div>
                  ))}
                </div>
                <Link to="/" className="inline-block px-8 py-3 rounded-2xl font-body font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', color: '#1a0a00' }}>
                  Back to Homepage
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}