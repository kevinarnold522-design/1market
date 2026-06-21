import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Upload, AlertCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import OneCheckmark from './OneCheckmark';

// Document requirements differ by account type
const SELLER_DOCS = [
  {
    label: 'NBI Clearance (Required)',
    hint: 'Must be recent (within 6 months). NBI Clearance is the ONLY accepted valid ID.',
    required: true,
  },
  {
    label: 'Proof of Business',
    hint: 'DTI Certificate, Business Permit, or any official proof that you operate a business.',
    required: true,
  },
  {
    label: 'Supporting Document (Optional)',
    hint: 'Any additional document — e.g. a selfie with your ID, receipts, product photos, etc.',
    required: false,
  },
];

const BUSINESS_DOCS = [
  {
    label: 'NBI Clearance (Required)',
    hint: 'Must be recent (within 6 months). NBI Clearance is the ONLY accepted valid ID.',
    required: true,
  },
  {
    label: 'Business Registration (Required)',
    hint: 'SEC Certificate of Incorporation, DTI Business Name Registration, or Mayor\'s Permit.',
    required: true,
  },
  {
    label: 'Income Tax Return / ITR (Required)',
    hint: 'Latest ITR (BIR Form 1701 or 1702) showing your business income. Must be stamped received by BIR.',
    required: true,
  },
];

function DocUpload({ doc: docInfo, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await uploadMediaFileToSupabase(file);
    onChange({ url: file_url, label: docInfo.label });
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className="rounded-xl p-3" style={{
      background: 'rgba(255,255,255,0.04)',
      border: value?.url ? '1px solid rgba(0,212,255,0.35)' : docInfo.required ? '1px solid rgba(255,255,255,0.12)' : '1px dashed rgba(255,255,255,0.08)'
    }}>
      <div className="flex items-start gap-2 mb-1.5">
        <p className="font-body text-xs font-bold text-white flex-1">{docInfo.label}</p>
        {docInfo.required && <span className="text-[9px] text-red-400 font-bold flex-shrink-0">Required</span>}
      </div>
      <p className="font-body text-[10px] text-white/35 mb-2 leading-relaxed">{docInfo.hint}</p>
      {value?.url ? (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#00D4FF] font-body font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> Uploaded AI
          </span>
          <button onClick={() => onChange(null)} className="text-[9px] text-white/25 hover:text-red-400 transition-colors">Remove</button>
        </div>
      ) : (
        <label className="flex items-center gap-2 cursor-pointer group">
          {uploading
            ? <div className="w-4 h-4 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
            : <Upload className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00D4FF] transition-colors" />}
          <span className="font-body text-[10px] text-white/35 group-hover:text-white/60 transition-colors">
            {uploading ? 'Uploading...' : 'Upload file (image or PDF)'}
          </span>
          <input type="file" className="hidden" accept="image/*,.pdf" onChange={handle} disabled={uploading} />
        </label>
      )}
    </div>
  );
}

export default function VerifiedPartnerBanner({ user, onClose, onSubmit }) {
  const isBusiness = user?.user_type === 'business' || user?.account_type === 'business_owner';
  const DOC_LIST = isBusiness ? BUSINESS_DOCS : SELLER_DOCS;
  const requiredCount = DOC_LIST.filter(d => d.required).length;

  // Skip straight to requirements (step 2)
  const [step, setStep] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [docs, setDocs] = useState(DOC_LIST.map(() => null));

  const uploadedRequired = DOC_LIST.filter((d, i) => d.required && docs[i]?.url).length;
  const canSubmit = uploadedRequired === requiredCount;

  const shareLink = `https://1marketph.com/seller/${user?.username || user?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    if (onSubmit) await onSubmit(docs.filter(d => d?.url));
    setSubmitting(false);
    setStep(3);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[350] flex items-end sm:items-center justify-center sm:p-4 bg-[#070F1A]/85 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#0D1F3C,#0A192F)', border: '1px solid rgba(0,212,255,0.25)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg,rgba(37,99,235,0.2),rgba(0,212,255,0.1))' }}>
          <div className="flex items-center gap-2.5">
            <OneCheckmark size="md" label="" />
            <div>
              <h3 className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                Apply for <OneCheckmark size="sm" label="1Checkmark" />
              </h3>
              <p className="font-body text-[10px] text-[#00D4FF]">{isBusiness ? 'Business Account' : 'Seller Account'} — Documents Required</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>

        <div className="p-5 max-h-[78vh] overflow-y-auto">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="rounded-xl p-3 bg-[#2563EB]/10 border border-[#2563EB]/20">
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  As a <strong className="text-white">Verified Partner</strong>, your profile gets the official blue AI badge,
                  boosted search placement, and full buyer trust — completely free.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2.5">
                {[
                   { label: 'Official 1Checkmark Badge', desc: 'Displayed on your profile & all listings' },
                   { label: 'Boosted Visibility', desc: 'Your listings appear higher in search results' },
                   { label: 'Trusted Partner Status', desc: 'Listed in 1MarketPH Verified Partners directory' },
                   { label: 'Buyer Confidence', desc: 'Buyers know your identity is confirmed' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <OneCheckmark size="xs" label="" />
                     <div>
                       <p className="font-body font-bold text-xs text-white">{item.label}</p>
                       <p className="font-body text-[10px] text-white/40">{item.desc}</p>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Documents needed */}
              <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <p className="font-body text-[10px] font-bold text-amber-400 uppercase tracking-wider">Documents Required</p>
                </div>
                {DOC_LIST.map((doc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-body text-[10px] font-bold text-amber-400 flex-shrink-0">{i + 1}.</span>
                    <div>
                      <span className="font-body text-[10px] font-bold text-white">{doc.label}</span>
                      {doc.label.includes('NBI') && (
                        <p className="font-body text-[9px] text-amber-300 mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3 flex-shrink-0" /> NBI Clearance is the ONLY accepted valid ID</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(2)}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-xl font-body font-bold text-sm transition-all">
                Start Application →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-white text-base mb-1">Upload Your Documents</h4>
                <p className="font-body text-[10px] text-white/40">Upload all {requiredCount} required documents to submit.</p>
              </div>

              <div className="space-y-2">
                {DOC_LIST.map((docInfo, i) => (
                  <DocUpload
                    key={i}
                    doc={docInfo}
                    value={docs[i]}
                    onChange={(val) => setDocs(prev => prev.map((d, idx) => idx === i ? val : d))}
                  />
                ))}
              </div>

              <div className="rounded-xl p-2.5 flex items-start gap-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)' }}>
                <AlertCircle className="w-3 h-3 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                <p className="font-body text-[9px] text-white/40 leading-relaxed">
                  Your documents are private and only reviewed by the 1MarketPH admin team. They will never be shared publicly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[#00D4FF] transition-all duration-500"
                    style={{ width: `${(uploadedRequired / requiredCount) * 100}%` }} />
                </div>
                <span className="font-body text-[10px] text-white/40">{uploadedRequired}/{requiredCount} required</span>
              </div>

              <button onClick={handleApply} disabled={submitting || !canSubmit}
                className="w-full py-3 rounded-xl font-body font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: canSubmit ? 'linear-gradient(135deg,#2563EB,#00D4FF)' : 'rgba(255,255,255,0.1)', color: canSubmit ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <OneCheckmark size="xs" label="" />}
                {canSubmit ? 'Submit Verification Request' : `Upload required docs (${uploadedRequired}/${requiredCount})`}
              </button>
              <button onClick={onClose} className="w-full text-center font-body text-xs text-white/30 hover:text-white transition-colors">← Cancel</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <OneCheckmark size="xl" label="" />
              </div>
              <h4 className="font-heading font-bold text-white text-lg">Application Submitted!</h4>
              <p className="font-body text-sm text-white/50 leading-relaxed">
                Your documents are under review. Once approved, you'll receive a congratulations email with your official <strong className="text-white">Verified Partner</strong> status and the <strong>1Checkmark</strong> badge.
              </p>
              <div className="rounded-xl p-3 text-left space-y-1" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="font-body text-[11px] font-bold text-green-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Typical review time: 24-48 hours</p>
                <p className="font-body text-[10px] text-white/40">You'll receive an approval or follow-up email from the 1MarketPH admin team.</p>
              </div>
              <button onClick={onClose}
                className="w-full py-3 text-white rounded-xl font-body font-bold text-sm transition-colors"
                style={{ background: 'linear-gradient(135deg,#ff2d55,#007aff)' }}>
                Done!
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}