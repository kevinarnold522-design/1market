/**
 * AIReviewSummary — shown in ListingDetail after 3+ reviews
 * Uses to summarize all reviews into a brief pro/con summary.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIReviewSummary({ comments, listing }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [shown, setShown] = useState(false);

  const ratedComments = comments.filter(c => c.comment && c.comment.trim().length > 5);
  if (ratedComments.length < 3) return null;

  const generateSummary = async () => {
    if (shown && summary) return;
    setLoading(true);
    try {
      const reviewTexts = ratedComments.slice(0, 20).map((c, i) =>
        `Review ${i + 1} (${c.rating || 0}/5 stars): "${c.comment}"`
      ).join('\n');

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful marketplace for 1MarketPH.com (Philippine marketplace).
Analyze these ${ratedComments.length} customer reviews for "${listing.title}" and provide a brief, honest summary.

Reviews:
${reviewTexts}

Summarize in a way that helps Filipino buyers make a quick decision.
Be concise, neutral, and practical. Use simple English/Taglish if appropriate.`,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_verdict: { type: 'string' },
            pros: { type: 'array', items: { type: 'string' } },
            cons: { type: 'array', items: { type: 'string' } },
            buyer_tip: { type: 'string' },
            avg_sentiment: { type: 'string' }
          }
        }
      });
      setSummary(res);
      setShown(true);
    } catch {
      setSummary({ error: 'Could not generate summary.' });
      setShown(true);
    }
    setLoading(false);
  };

  return (
    <div className="mb-4">
      {!shown ? (
        <button
          onClick={generateSummary}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body font-bold text-sm transition-all hover:scale-[1.01]"
          style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.25)' }}>
          {loading
            ? <><Loader2 className="w-4 h-4 text-[#00D4FF] animate-spin" /><span className="text-[#00D4FF]">Reading reviews with ...</span></>
            : <><Sparkles className="w-4 h-4 text-[#00D4FF]" /><span className="text-[#00D4FF]">Review Summary ({ratedComments.length} reviews)</span></>}
        </button>
      ) : summary && !summary.error ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-heading font-bold text-sm text-[#00D4FF]">Review Summary</span>
              <span className="font-body text-[9px] text-white/30">{ratedComments.length} reviews analyzed</span>
            </div>

            {summary.overall_verdict && (
              <p className="font-body text-sm text-white/80 leading-relaxed">{summary.overall_verdict}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {summary.pros?.length > 0 && (
                <div className="rounded-xl p-2.5 space-y-1" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ThumbsUp className="w-3 h-3 text-green-400" />
                    <span className="font-body text-[10px] font-bold text-green-400 uppercase tracking-wider">Pros</span>
                  </div>
                  {summary.pros.slice(0, 3).map((p, i) => (
                    <p key={i} className="font-body text-[10px] text-white/70 leading-snug">• {p}</p>
                  ))}
                </div>
              )}
              {summary.cons?.length > 0 && (
                <div className="rounded-xl p-2.5 space-y-1" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ThumbsDown className="w-3 h-3 text-red-400" />
                    <span className="font-body text-[10px] font-bold text-red-400 uppercase tracking-wider">Cons</span>
                  </div>
                  {summary.cons.slice(0, 3).map((c, i) => (
                    <p key={i} className="font-body text-[10px] text-white/70 leading-snug">• {c}</p>
                  ))}
                </div>
              )}
            </div>

            {summary.buyer_tip && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="font-body text-[10px] text-amber-300/90 leading-relaxed"><strong className="text-amber-400">Buyer Tip:</strong> {summary.buyer_tip}</p>
              </div>
            )}

            <button
              onClick={() => { setSummary(null); setShown(false); }}
              className="font-body text-[10px] text-white/25 hover:text-white/50 transition-colors">
              Hide Summary
            </button>
          </motion.div>
        </AnimatePresence>
      ) : summary?.error ? (
        <p className="font-body text-[10px] text-red-400 text-center py-2">{summary.error}</p>
      ) : null}
    </div>
  );
}