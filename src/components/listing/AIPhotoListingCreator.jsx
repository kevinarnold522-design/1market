import React, { useState } from 'react';
import { Camera, Sparkles, Upload, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToR2 } from '@/lib/r2Upload';

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function AIPhotoListingCreator({ onApplyListing }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    e.target.value = '';
    if (!files.length) return;
    const bad = files.find(f => !allowed.includes(f.type) || f.size > 25 * 1024 * 1024);
    if (bad) { setError('Only image files up to 25MB are allowed.'); return; }
    setBusy(true); setError(''); setStatus('Uploading photos to Cloudflare R2...');
    const uploads = [];
    for (const file of files) uploads.push(await uploadMediaFileToR2(file, 'listing-images'));
    const urls = uploads.map(u => u.file_url).filter(Boolean);
    setStatus('AI is scanning photos and generating your listing...');
    const res = await base44.functions.invoke('analyzeListingImages', { image_urls: urls });
    const draft = res.data.draft;
    if (!draft.safe_to_list) setError(draft.moderation_notes || 'AI flagged these images for review. You can edit, but it will not auto-publish.');
    onApplyListing(draft, urls);
    setStatus('AI draft added. Review and edit before submitting.');
    setBusy(false);
  };

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.13),rgba(37,99,235,0.16))', border: '1px solid rgba(0,212,255,0.35)' }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-[#00D4FF]" /></div>
        <div className="flex-1">
          <p className="font-heading font-bold text-white text-sm">Create Listing with AI</p>
          <p className="font-body text-xs text-white/45">Scan Photos & Generate Listing. Upload up to 10 photos; you approve before publishing.</p>
        </div>
      </div>
      <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl cursor-pointer font-body font-bold text-sm text-[#06163a] transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg,#00D4FF,#60a5fa)' }}>
        {busy ? <div className="w-4 h-4 border-2 border-[#06163a]/30 border-t-[#06163a] rounded-full animate-spin" /> : <><Camera className="w-4 h-4" /><Upload className="w-4 h-4" /></>}
        {busy ? 'Generating AI Listing...' : 'Scan Photos & Generate Listing'}
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={busy} />
      </label>
      {status && <p className="font-body text-[11px] text-[#00D4FF] flex items-center gap-1"><ShieldCheck className="w-3 h-3" />{status}</p>}
      {error && <p className="font-body text-[11px] text-amber-300">{error}</p>}
    </div>
  );
}