/**
 * AIPriceSuggester — AI-powered price recommendation inside AddListingModal
 * Uses InvokeLLM to analyze listing details and suggest a competitive price range.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIPriceSuggester({ form, onApplyPrice }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const canSuggest = form.title || form.subcategory || form.type;

  const suggest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Philippine marketplace pricing expert for 1MarketPH.com.
Analyze this listing and suggest a competitive price range in Philippine Peso (PHP).

Listing Details:
- Title: ${form.title || 'N/A'}
- Category: ${form.type || 'N/A'}
- Subcategory: ${form.subcategory || 'N/A'}
- Condition: ${form.condition || 'N/A'}
- Location: ${form.city ? `${form.city}, Philippines` : 'Philippines'}
- Description: ${form.description ? form.description.slice(0, 200) : 'N/A'}
- Brand: ${form.brand || 'N/A'}
- Model: ${form.model || 'N/A'}

Based on typical Philippine marketplace prices (Carousell, Facebook Marketplace, Shopee):
Return a competitive price suggestion with min, max, and recommended values.
Include brief reasoning (1-2 sentences max).`,
        response_json_schema: {
          type: 'object',
          properties: {
            price_min: { type: 'number' },
            price_max: { type: 'number' },
            recommended: { type: 'number' },
            reasoning: { type: 'string' },
            confidence: { type: 'string' }
          }
        }
      });
      setResult(res);
    } catch {
      setResult({ error: 'Could not generate price suggestion. Try again.' });
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-sm text-amber-400">AI Price Suggester</span>
          <span className="px-1.5 py-0.5 rounded-full font-body text-[9px] font-bold text-[#0A192F] bg-amber-400">SMART</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-amber-400/60" /> : <ChevronDown className="w-4 h-4 text-amber-400/60" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/8 pt-3 space-y-3">
              <p className="font-body text-[10px] text-white/40">
                Let AI analyze your listing and suggest a competitive price range based on current Philippine marketplace trends.
              </p>
              <button
                type="button"
                onClick={suggest}
                disabled={loading || !canSuggest}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
                {loading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Market...</>
                  : <><TrendingUp className="w-3.5 h-3.5" /> Suggest a Price</>}
              </button>
              {!canSuggest && <p className="font-body text-[10px] text-white/25">Add a title or category first.</p>}

              <AnimatePresence>
                {result && !result.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl p-3 space-y-3"
                    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
                    {/* Price range bar */}
                    <div className="flex items-end justify-between gap-2">
                      <div className="text-center">
                        <p className="font-body text-[9px] text-white/40 mb-0.5">Min</p>
                        <p className="font-heading font-bold text-sm text-white/60">₱{Number(result.price_min || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-body text-[9px] text-amber-400 mb-0.5 font-bold">RECOMMENDED</p>
                        <p className="font-heading font-bold text-xl text-amber-400">₱{Number(result.recommended || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-body text-[9px] text-white/40 mb-0.5">Max</p>
                        <p className="font-heading font-bold text-sm text-white/60">₱{Number(result.price_max || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {result.reasoning && (
                      <p className="font-body text-[10px] text-white/60 leading-relaxed italic">{result.reasoning}</p>
                    )}
                    {result.confidence && (
                      <p className="font-body text-[9px] text-amber-400/60">Confidence: {result.confidence}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onApplyPrice(result.recommended)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-[#0A192F] bg-amber-400 hover:bg-amber-300 transition-colors">
                        <CheckCircle className="w-3 h-3" /> Use ₱{Number(result.recommended || 0).toLocaleString()}
                      </button>
                      <button type="button" onClick={suggest}
                        className="px-3 py-1.5 rounded-lg font-body text-[11px] text-white/50 hover:text-white bg-white/8 transition-colors">
                        Re-analyze
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {result?.error && <p className="font-body text-[10px] text-red-400">{result.error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}