import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const REASONS = [
  { value: 'spam', label: 'Spam or Misleading' },
  { value: 'scam', label: 'Scam / Fraud' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'wrong_category', label: 'Wrong Category' },
  { value: 'duplicate', label: 'Duplicate Listing' },
  { value: 'other', label: 'Other' },
];

export default function ReportModal({ listing, user, onClose }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    // Suspend the listing immediately
    await base44.entities.Listing.update(listing.id, { is_active: false, status: 'suspended' });
    // Create report
    await base44.entities.Report.create({
      listing_id: listing.id,
      listing_title: listing.title,
      reporter_email: user?.email || 'anonymous',
      reporter_name: user?.full_name || 'Anonymous',
      reason,
      details: details.trim(),
      status: 'pending',
    });
    setSubmitting(false);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,15,26,0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Flag className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-heading font-bold text-white">Report Listing</h3>
            </div>
            <button onClick={onClose}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
          </div>

          {done ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3"></div>
              <p className="font-heading font-bold text-white mb-1">Report Submitted</p>
              <p className="font-body text-xs text-white/50 mb-4">This listing has been suspended and will be reviewed by our admin team.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="font-body text-xs text-white/50 mb-4">
                Reporting: <span className="text-white font-semibold">{listing.title}</span>
              </p>

              <div className="space-y-2 mb-4">
                <label className="font-body text-xs text-white/40 uppercase tracking-wider">Reason *</label>
                {REASONS.map(r => (
                  <button key={r.value} onClick={() => setReason(r.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-body text-sm transition-all ${reason === r.value ? 'bg-red-500/20 border border-red-500/40 text-white' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
                    {r.label}
                  </button>
                ))}
              </div>

              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Additional details (optional)..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-red-400/50 resize-none mb-4"
              />

              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="font-body text-[10px] text-amber-300">This listing will be <strong>suspended immediately</strong> and reviewed by our admin team. Admin can restore or permanently remove it.</p>
              </div>

              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 py-2.5 border border-white/15 text-white/60 rounded-xl font-body text-sm hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={!reason || submitting}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-body font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
                  {submitting ? 'Submitting...' : 'Report & Suspend'}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}