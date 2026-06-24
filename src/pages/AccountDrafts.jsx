import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function AccountDrafts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const storageKey = `listing_options_draft_history_${user?.id || user?.email || 'guest'}`;

  useEffect(() => {
    const loadDrafts = async () => {
      const localDrafts = JSON.parse(localStorage.getItem(storageKey) || '[]').map((draft, index) => ({ ...draft, source: 'local', localIndex: index }));
      let savedDrafts = [];
      if (user?.id) {
        savedDrafts = await base44.entities.DraftListing.filter({ user_id: user.id }, '-created_date', 50).catch(() => []);
      }
      const normalizedSaved = savedDrafts.map(item => ({
        id: item.id,
        title: item.title,
        form: item.form_data || item,
        step: 2,
        updated_at: item.updated_date || item.created_date,
        draftKey: item.draft_key || `listing_options_draft_${user?.id || 'guest'}_new`,
        source: 'db',
      }));
      const seen = new Set();
      const merged = [...localDrafts, ...normalizedSaved].filter(item => {
        const key = item.draftKey || item.id || item.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setDrafts(merged);
      setLoading(false);
    };
    loadDrafts();
  }, [storageKey, user?.id]);

  const resumeDraft = (draft) => {
    const key = `listing_options_draft_${user?.id || user?.email || 'guest'}_new`;
    localStorage.setItem(key, JSON.stringify({ form: draft.form, step: draft.step || 2, updated_at: new Date().toISOString() }));
    navigate('/post-ad');
  };

  const deleteDraft = async (draft) => {
    if (!window.confirm('Delete this draft?')) return;
    if (draft.source === 'db' && draft.id) await base44.entities.DraftListing.delete(draft.id).catch(() => {});
    const localDrafts = JSON.parse(localStorage.getItem(storageKey) || '[]').filter(item => item.draftKey !== draft.draftKey);
    localStorage.setItem(storageKey, JSON.stringify(localDrafts));
    setDrafts(prev => prev.filter(item => (item.id || item.draftKey) !== (draft.id || draft.draftKey)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#581c87] via-[#7c3aed] to-[#2e1065] px-4 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="rounded-3xl p-6 shadow-xl border border-white/15 bg-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl">Drafts</h1>
              <p className="text-white/55 text-sm">Incomplete listings saved from the post-ad form.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-white/50">Loading drafts...</div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 mb-5">No saved drafts yet.</p>
              <Link to="/post-ad" className="px-5 py-2 rounded-xl bg-[#a855f7] text-white font-bold">Create a listing</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft, index) => (
                <div key={draft.id || draft.draftKey || index} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 p-4">
                  {draft.form?.image_url ? <img src={draft.form.image_url} alt="" className="w-14 h-14 rounded-xl object-cover" /> : <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center"><FileText className="w-5 h-5 text-white/50" /></div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-white truncate">{draft.title || draft.form?.title || 'Untitled draft'}</p>
                    <p className="font-body text-xs text-white/45 truncate">{draft.form?.main_category || draft.form?.type || 'Listing'} {draft.form?.subcategory ? `· ${draft.form.subcategory}` : ''}</p>
                    {draft.updated_at && <p className="font-body text-[10px] text-white/30">Saved {new Date(draft.updated_at).toLocaleString('en-PH')}</p>}
                  </div>
                  <button onClick={() => resumeDraft(draft)} className="px-4 py-2 rounded-xl bg-[#a855f7] text-white font-body text-xs font-bold">Resume</button>
                  <button onClick={() => deleteDraft(draft)} className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-400/25 flex items-center justify-center text-red-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}