/**
 * AIListingAssistant — floating panel inside AddListingModal
 * Features:
 *  1. AI Description Generator
 *  2. AI Image Analyzer (detects product details from uploaded photo)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Loader2, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIListingAssistant({ form, onApplyDescription, onApplyImageData }) {
  const [open, setOpen] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [imageResult, setImageResult] = useState(null);

  const generateDescription = async () => {
    setDescLoading(true);
    setGeneratedDesc('');
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional Filipino marketplace copywriter for 1MarketPH.
Write a compelling, detailed listing description in Filipino-English (Taglish is OK) for:
- Title: ${form.title || 'Untitled'}
- Category: ${form.type || 'product'}
- Subcategory: ${form.subcategory || ''}
- Location: ${form.city ? `${form.city}, ${form.state_region || ''}` : form.location || 'Philippines'}
- Price: ${form.price ? `₱${Number(form.price).toLocaleString()}` : 'Not specified'}
- Condition: ${form.condition || 'Not specified'}

Write 3-5 sentences. Be specific, persuasive, and honest. Mention key features, benefits, and a call-to-action.
Do NOT use markdown. Return plain text only.`,
      });
      setGeneratedDesc(typeof result === 'string' ? result : result?.text || '');
    } catch (e) {
      setGeneratedDesc('Could not generate description. Please try again.');
    }
    setDescLoading(false);
  };

  const analyzeImage = async () => {
    if (!form.image_url) return;
    setImgLoading(true);
    setImageResult(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this product/listing image for a Philippine marketplace.
Extract and return:
1. What the item appears to be (product name/type)
2. Estimated condition (Brand New / Like New / Lightly Used / Used)
3. Key visible features or details
4. Suggested listing title (max 60 chars)
5. Suggested tags (comma-separated, max 8 tags)

Be concise and practical for a Filipino buyer.`,
        file_urls: [form.image_url],
        response_json_schema: {
          type: 'object',
          properties: {
            detected_item: { type: 'string' },
            condition: { type: 'string' },
            features: { type: 'string' },
            suggested_title: { type: 'string' },
            suggested_tags: { type: 'string' }
          }
        }
      });
      setImageResult(result);
    } catch {
      setImageResult({ error: 'Could not analyze image. Try again.' });
    }
    setImgLoading(false);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-sm text-[#00D4FF]">AI Listing Assistant</span>
          <span className="px-1.5 py-0.5 rounded-full font-body text-[9px] font-bold text-[#0A192F] bg-[#00D4FF]">NEW</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#00D4FF]/60" /> : <ChevronDown className="w-4 h-4 text-[#00D4FF]/60" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 space-y-4 border-t border-white/8">

              {/* === AI DESCRIPTION GENERATOR === */}
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span className="font-body text-[11px] font-bold text-white/70 uppercase tracking-wider">AI Description Writer</span>
                </div>
                <p className="font-body text-[10px] text-white/35 mb-2">
                  Fill in the title &amp; category first, then let AI write a professional description for you.
                </p>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={descLoading || !form.title}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)' }}>
                  {descLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                    : <><Sparkles className="w-3.5 h-3.5" /> Generate Description</>}
                </button>

                {generatedDesc && (
                  <div className="mt-3 rounded-xl p-3 space-y-2" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <p className="font-body text-xs text-white/80 leading-relaxed">{generatedDesc}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { onApplyDescription(generatedDesc); setGeneratedDesc(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-[#0A192F] bg-[#00D4FF] hover:bg-[#00D4FF]/90 transition-colors">
                        Use This Description
                      </button>
                      <button type="button" onClick={generateDescription}
                        className="px-3 py-1.5 rounded-lg font-body text-[11px] text-white/50 hover:text-white bg-white/8 transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* === AI IMAGE ANALYZER === */}
              <div className="border-t border-white/8 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-body text-[11px] font-bold text-white/70 uppercase tracking-wider">AI Image Analyzer</span>
                </div>
                <p className="font-body text-[10px] text-white/35 mb-2">
                  Upload your main photo first, then let AI detect product details, condition, and suggest a title.
                </p>
                <button
                  type="button"
                  onClick={analyzeImage}
                  disabled={imgLoading || !form.image_url}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                  {imgLoading
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Image...</>
                    : <><ImageIcon className="w-3.5 h-3.5" /> Analyze My Photo</>}
                </button>
                {!form.image_url && (
                  <p className="font-body text-[10px] text-white/25 mt-1">Upload a photo above first to enable this.</p>
                )}

                {imageResult && !imageResult.error && (
                  <div className="mt-3 rounded-xl p-3 space-y-2.5" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <div className="space-y-1">
                      {imageResult.detected_item && (
                        <div className="flex gap-2">
                          <span className="font-body text-[10px] text-white/40 w-20 flex-shrink-0">Item:</span>
                          <span className="font-body text-[10px] text-white/80">{imageResult.detected_item}</span>
                        </div>
                      )}
                      {imageResult.condition && (
                        <div className="flex gap-2">
                          <span className="font-body text-[10px] text-white/40 w-20 flex-shrink-0">Condition:</span>
                          <span className="font-body text-[10px] text-white/80">{imageResult.condition}</span>
                        </div>
                      )}
                      {imageResult.features && (
                        <div className="flex gap-2">
                          <span className="font-body text-[10px] text-white/40 w-20 flex-shrink-0">Features:</span>
                          <span className="font-body text-[10px] text-white/80">{imageResult.features}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {imageResult.suggested_title && (
                        <button type="button"
                          onClick={() => onApplyImageData({ title: imageResult.suggested_title, tags: imageResult.suggested_tags })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-white bg-purple-500/30 border border-purple-500/40 hover:bg-purple-500/50 transition-colors">
                          Apply Title &amp; Tags
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {imageResult?.error && (
                  <p className="mt-2 font-body text-[10px] text-red-400">{imageResult.error}</p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}