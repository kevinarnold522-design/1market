/**
 * AIListingAssistant — floating panel inside AddListingModal
 * Features:
 *  1. AI Description Generator
 *  2. Image Analyzer (detects product details from uploaded photo)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Loader2, ChevronDown, ChevronUp, Wand2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIListingAssistant({ form, onApplyDescription, onApplyImageData, onApplyFullDraft }) {
  const [open, setOpen] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [answers, setAnswers] = useState({ item: '', audience: '', condition: '', inclusions: '', location: '' });
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [smartDraft, setSmartDraft] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  const generateSmartDraft = async () => {
    setDraftLoading(true);
    setSmartDraft(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Act as a smart 1MarketPH listing coach. Based on the seller answers and current form, recommend the best category, subcategory, title, price label, tags, condition, and description. Ask yourself what a Filipino buyer needs before publishing.

Current form: ${JSON.stringify(form)}
Seller answers: ${JSON.stringify(answers)}

Return a complete practical draft. Keep description honest, clear, and Taglish-friendly.`,
      response_json_schema: {
        type: 'object',
        properties: {
          main_category: { type: 'string' },
          type: { type: 'string' },
          subcategory: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          condition: { type: 'string' },
          price_label: { type: 'string' },
          tags: { type: 'string' },
          brand: { type: 'string' },
          model: { type: 'string' },
          specs: { type: 'string' },
          recommendations: { type: 'array', items: { type: 'string' } }
        }
      }
    });
    setSmartDraft(result);
    setDraftLoading(false);
  };

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
          <span className="font-heading font-bold text-sm text-[#00D4FF]">Listing Assistant</span>
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

            {/* === SMART QUESTIONNAIRE === */}
            <div className="pt-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="font-body text-[11px] font-bold text-white/70 uppercase tracking-wider">Smart Listing Questions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input value={answers.item} onChange={e => setAnswers(a => ({ ...a, item: e.target.value }))} placeholder="What exactly are you selling?" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
                <input value={answers.audience} onChange={e => setAnswers(a => ({ ...a, audience: e.target.value }))} placeholder="Who is it best for?" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
                <input value={answers.condition} onChange={e => setAnswers(a => ({ ...a, condition: e.target.value }))} placeholder="Condition / issue / warranty?" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
                <input value={answers.inclusions} onChange={e => setAnswers(a => ({ ...a, inclusions: e.target.value }))} placeholder="Inclusions / freebies / delivery?" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <input value={answers.location} onChange={e => setAnswers(a => ({ ...a, location: e.target.value }))} placeholder="Exact city/area and pickup or service coverage" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00D4FF] mb-2" />
              <button type="button" onClick={generateSmartDraft} disabled={draftLoading || !answers.item}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#10b981,#2563EB)' }}>
                {draftLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...</> : <><Sparkles className="w-3.5 h-3.5" /> Recommend & Autofill Listing</>}
              </button>
              {smartDraft && (
                <div className="mt-3 rounded-xl p-3 space-y-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <p className="font-body text-xs text-white/80"><strong className="text-green-300">Suggested:</strong> {smartDraft.title}</p>
                  <p className="font-body text-[10px] text-white/55">{smartDraft.main_category} › {smartDraft.type} › {smartDraft.subcategory}</p>
                  {smartDraft.recommendations?.map((tip, i) => <p key={i} className="font-body text-[10px] text-white/50">• {tip}</p>)}
                  <button type="button" onClick={() => onApplyFullDraft && onApplyFullDraft(smartDraft)} className="px-3 py-1.5 rounded-lg font-body font-bold text-[11px] text-[#0A192F] bg-green-400 hover:bg-green-300 transition-colors">Apply All Suggestions</button>
                </div>
              )}
            </div>

            {/* === AI DESCRIPTION GENERATOR === */}
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span className="font-body text-[11px] font-bold text-white/70 uppercase tracking-wider">Description Writer</span>
                </div>
                <p className="font-body text-[10px] text-white/35 mb-2">
                  Fill in the title &amp; category first, then generate a professional description for you.
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
                  <span className="font-body text-[11px] font-bold text-white/70 uppercase tracking-wider">Image Analyzer</span>
                </div>
                <p className="font-body text-[10px] text-white/35 mb-2">
                  Upload your main photo first, then detect product details, condition, and suggest a title.
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