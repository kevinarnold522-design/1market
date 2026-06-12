/**
 * SavedTemplates — lets users save their listing form as a named template,
 * load/autopopulate from a saved template, rename, or delete.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, Pencil, Trash2, Check, X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function SavedTemplates({ form, onLoadTemplate }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const all = await base44.entities.SavedListingTemplate.filter({ user_id: user.id }, '-created_date', 100);
      setTemplates(all);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (open) load(); }, [open, user]);

  const saveTemplate = async () => {
    if (!saveName.trim() || !user) return;
    setSaving(true);
    try {
      // Strip non-serializable UI state, keep form data
      const formData = { ...form };
      await base44.entities.SavedListingTemplate.create({
        user_id: user.id,
        user_email: user.email,
        name: saveName.trim(),
        form_data: formData,
      });
      setSaveName('');
      showToast('Template saved!');
      load();
    } catch {
      showToast('Could not save template.');
    }
    setSaving(false);
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    await base44.entities.SavedListingTemplate.delete(id);
    showToast('Deleted');
    load();
  };

  const renameTemplate = async (id) => {
    if (!editName.trim()) return;
    await base44.entities.SavedListingTemplate.update(id, { name: editName.trim() });
    setEditId(null);
    setEditName('');
    showToast('Renamed!');
    load();
  };

  if (!user) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-emerald-500/20">
            <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-heading font-bold text-sm text-emerald-400">Saved Templates</span>
          {templates.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-body text-[9px] font-bold">{templates.length}</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-emerald-400/60" /> : <ChevronDown className="w-4 h-4 text-emerald-400/60" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-white/8 space-y-3">

              {/* Save current form as template */}
              <div className="pt-3">
                <p className="font-body text-[10px] text-white/40 mb-2">Save the current form data as a reusable template:</p>
                <div className="flex gap-2">
                  <input
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder="Template name (e.g. My iPhone Listing)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400"
                    onKeyDown={e => { if (e.key === 'Enter') saveTemplate(); }}
                  />
                  <button type="button" onClick={saveTemplate} disabled={!saveName.trim() || saving}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs text-white disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}
                  </button>
                </div>
              </div>

              {/* Template list */}
              {loading ? (
                <div className="text-center py-3">
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
                </div>
              ) : templates.length === 0 ? (
                <p className="font-body text-[10px] text-white/25 text-center py-2">No saved templates yet. Save your first listing template above!</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {templates.map(t => (
                    <div key={t.id} className="flex items-center gap-2 p-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {editId === t.id ? (
                        <div className="flex-1 flex items-center gap-1.5">
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                            className="flex-1 bg-white/10 border border-emerald-400/40 rounded-lg px-2 py-1 font-body text-xs text-white focus:outline-none"
                            onKeyDown={e => { if (e.key === 'Enter') renameTemplate(t.id); if (e.key === 'Escape') setEditId(null); }}
                          />
                          <button type="button" onClick={() => renameTemplate(t.id)} className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </button>
                          <button type="button" onClick={() => setEditId(null)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <X className="w-3 h-3 text-white/50" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs text-white font-semibold truncate">{t.name}</p>
                            <p className="font-body text-[9px] text-white/30">{t.form_data?.type || 'listing'} · saved {new Date(t.created_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</p>
                          </div>
                          <button type="button" onClick={() => { onLoadTemplate(t.form_data); showToast(`Loaded: ${t.name}`); }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/15 transition-colors border border-emerald-500/30">
                            <Plus className="w-3 h-3" /> Load
                          </button>
                          <button type="button" onClick={() => { setEditId(t.id); setEditName(t.name); }}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors">
                            <Pencil className="w-3 h-3 text-white/40" />
                          </button>
                          <button type="button" onClick={() => deleteTemplate(t.id)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center transition-colors">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-body text-xs text-white shadow-xl z-[200]"
            style={{ background: '#0D1F3C', border: '1px solid rgba(16,185,129,0.4)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}