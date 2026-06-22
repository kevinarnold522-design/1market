/**
 * AIListingQualityChecker — Inside AddListingModal
 * Scores the listing quality and gives specific improvement suggestions.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIListingQualityChecker({ form }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const check = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a listing quality auditor for 1MarketPH, a Philippine marketplace.
Rate this listing's quality and provide specific feedback to improve approval chances and buyer trust.

Listing:
- Title: "${form.title || ''}"
- Category: ${form.type || 'N/A'}
- Description: "${(form.description || '').slice(0, 300)}"
- Price: ${form.price ? `₱${form.price}` : 'Not set'}
- Photos: ${(form.image_url ? 1 : 0) + (form.extra_images?.length || 0)} uploaded
- Location: ${form.city || 'Not set'}
- Contact: ${form.phone || form.email_contact ? 'Provided' : 'Missing'}

Score from 0-100 and list specific issues and improvements.
Be direct and Filipino-friendly.`,
        response_json_schema: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            grade: { type: 'string' },
            summary: { type: 'string' },
            issues: { type: 'array', items: { type: 'string' } },
            improvements: { type: 'array', items: { type: 'string' } },
            approval_chance: { type: 'string' }
          }
        }
      });
      setResult(res);
    } catch {
      setResult({ error: 'Could not check quality. Try again.' });
    }
    setLoading(false);
  };

  const score = result?.score || 0;
  const scoreColor = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); if (!open && !result) check(); }}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}>
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-sm text-emerald-400">Listing Quality Check</span>
          {result?.score && !loading && (
            <span className="px-2 py-0.5 rounded-full font-body text-[10px] font-bold text-white"
              style={{ background: scoreColor, opacity: 0.9 }}>
              {result.score}/100
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/8 space-y-3">
              {loading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="font-body text-xs text-white/50">Analyzing your listing...</span>
                </div>
              ) : result && !result.error ? (
                <div className="pt-3 space-y-3">
                  {/* Score Circle */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${scoreColor}18`, border: `2px solid ${scoreColor}` }}>
                      <span className="font-heading font-bold text-lg" style={{ color: scoreColor }}>{result.score}</span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-white">{result.grade || 'Quality Score'}</p>
                      {result.approval_chance && <p className="font-body text-[10px] text-white/50">Approval: {result.approval_chance}</p>}
                      {result.summary && <p className="font-body text-[11px] text-white/60 mt-0.5">{result.summary}</p>}
                    </div>
                  </div>

                  {/* Issues */}
                  {result.issues?.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-body text-[9px] text-red-400 uppercase tracking-wider font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Issues to Fix
                      </p>
                      {result.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <span className="text-red-400 text-[10px] mt-0.5 flex-shrink-0"></span>
                          <p className="font-body text-[10px] text-white/60">{issue}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Improvements */}
                  {result.improvements?.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-body text-[9px] text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Quick Improvements
                      </p>
                      {result.improvements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <span className="text-emerald-400 text-[10px] mt-0.5 flex-shrink-0">→</span>
                          <p className="font-body text-[10px] text-white/60">{imp}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button type="button" onClick={check}
                    className="font-body text-[10px] text-white/25 hover:text-white/50 transition-colors">
                    Re-check Quality
                  </button>
                </div>
              ) : result?.error ? (
                <p className="font-body text-[10px] text-red-400 pt-3">{result.error}</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}