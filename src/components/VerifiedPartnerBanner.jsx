import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Share2, X, Copy, Check, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VerifiedPartnerBanner({ user, onClose }) {
  const [step, setStep] = useState(1); // 1=info, 2=apply, 3=done
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = `https://marketph.com/seller/${user?.username || user?.id}`;

  const handleApply = async () => {
    setSubmitting(true);
    await base44.auth.updateMe({ verification_requested: true });
    setSubmitting(false);
    setStep(3);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">Become a Verified Partner</h3>
              <p className="font-body text-[10px] text-[#00D4FF]">1Market.ph Official Seller Badge</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-white/60"/>
          </button>
        </div>

        <div className="p-5">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="rounded-xl p-3 bg-[#2563EB]/10 border border-[#2563EB]/20">
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  As a <strong className="text-white">Verified Partner</strong>, your listings get a blue ✅ badge, 
                  boosted placement, and full buyer trust — all for free.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: '✅', label: 'Verified Badge', desc: 'Blue checkmark on all your listings & profile' },
                  { icon: '📈', label: 'Boosted Visibility', desc: 'Your items appear higher in search results' },
                  { icon: '🤝', label: 'Official Partner', desc: 'Listed in our Verified Partners directory' },
                  { icon: '🔒', label: 'Buyer Trust', desc: 'Buyers see your identity is confirmed by 1Market.ph' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-body font-bold text-xs text-white">{item.label}</p>
                      <p className="font-body text-[10px] text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share requirement */}
              <div className="rounded-xl border border-[#00D4FF]/20 p-3 bg-[#00D4FF]/5">
                <p className="font-body text-[10px] font-bold text-[#00D4FF] mb-2 flex items-center gap-1.5">
                  <Share2 className="w-3 h-3"/> Share Requirement
                </p>
                <p className="font-body text-[10px] text-white/50 mb-2">
                  Share your seller profile on any social media platform to be eligible. Your profile link:
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-white/50 truncate font-body">
                    {shareLink}
                  </div>
                  <button onClick={copyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#00D4FF]/15 text-[#00D4FF] font-body text-[10px] font-bold flex items-center gap-1 hover:bg-[#00D4FF]/25 transition-colors">
                    {copied ? <><Check className="w-3 h-3"/>Copied</> : <><Copy className="w-3 h-3"/>Copy</>}
                  </button>
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-xl font-body font-bold text-sm transition-all">
                Apply for Verification →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📋</div>
                <h4 className="font-heading font-bold text-white text-base mb-1">Confirm Your Application</h4>
                <p className="font-body text-xs text-white/50">You are applying for a Verified Partner badge as:</p>
                <p className="font-body font-bold text-sm text-[#00D4FF] mt-1">@{user?.username || user?.full_name}</p>
              </div>
              <p className="font-body text-[10px] text-white/40 text-center leading-relaxed">
                By applying, you confirm that you have shared your seller profile on social media 
                and that your listings comply with 1Market.ph policies. Admin will review within 24–48 hours.
              </p>
              <button onClick={handleApply} disabled={submitting}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-xl font-body font-bold text-sm transition-all flex items-center justify-center gap-2">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <BadgeCheck className="w-4 h-4"/>}
                Submit Verification Request
              </button>
              <button onClick={() => setStep(1)} className="w-full text-center font-body text-xs text-white/30 hover:text-white transition-colors">← Back</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className="text-5xl">🎉</div>
              <h4 className="font-heading font-bold text-white text-lg">Request Submitted!</h4>
              <p className="font-body text-sm text-white/50">
                Your verification request has been sent to the 1Market.ph team. 
                You'll receive an email once your badge is approved (usually within 24–48 hours).
              </p>
              <button onClick={onClose}
                className="w-full py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
                Done!
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}