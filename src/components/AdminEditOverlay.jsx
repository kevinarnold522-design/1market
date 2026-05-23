import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Save, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Wraps any card/item and shows an edit pencil when admin is hovering.
 * Props:
 *   entity      - 'Listing' | 'Business' | 'Review' (base44 entity name)
 *   record      - the full data object
 *   fields      - array of { key, label, type? ('text'|'textarea'|'number'|'boolean') }
 *   onSaved     - callback after save
 *   onDeleted   - optional callback after delete
 *   children    - the wrapped UI
 */
export default function AdminEditOverlay({ entity, record, fields, onSaved, onDeleted, children }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openModal = (e) => {
    e.stopPropagation();
    const initial = {};
    fields.forEach(f => { initial[f.key] = record[f.key] ?? ''; });
    setForm(initial);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {};
    fields.forEach(f => {
      if (f.type === 'number') updates[f.key] = Number(form[f.key]) || 0;
      else if (f.type === 'boolean') updates[f.key] = Boolean(form[f.key]);
      else updates[f.key] = form[f.key];
    });
    await base44.entities[entity].update(record.id, updates);
    setSaving(false);
    setOpen(false);
    if (onSaved) onSaved({ ...record, ...updates });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete this ${entity}?`)) return;
    setDeleting(true);
    await base44.entities[entity].delete(record.id);
    setDeleting(false);
    setOpen(false);
    if (onDeleted) onDeleted(record.id);
  };

  return (
    <>
      <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {children}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={openModal}
              className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'rgba(0,212,255,0.9)', backdropFilter: 'blur(4px)' }}
              title="Admin Edit"
            >
              <Pencil className="w-3.5 h-3.5 text-[#0A192F]"/>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-[#070F1A]/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.25)' }}>
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0"
                style={{ background: '#0D1F3C' }}>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-body text-[9px] font-bold border border-amber-500/30">⚙️ Admin</span>
                  <h3 className="font-heading font-bold text-white text-sm">Edit {entity}</h3>
                </div>
                <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-white/40"/></button>
              </div>
              <div className="p-5 space-y-3">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block font-body text-[10px] font-semibold text-white/45 mb-1 uppercase tracking-wider">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-20 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]"/>
                    ) : f.type === 'boolean' ? (
                      <button onClick={() => setForm(v => ({ ...v, [f.key]: !v[f.key] }))}
                        className={`w-9 h-5 rounded-full relative transition-colors ${form[f.key] ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[f.key] ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                      </button>
                    ) : (
                      <input type={f.type === 'number' ? 'number' : 'text'}
                        value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]"/>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                    {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"/> : <Save className="w-3 h-3"/>}
                    Save Changes
                  </button>
                  {onDeleted && (
                    <button onClick={handleDelete} disabled={deleting}
                      className="px-4 py-2.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl font-body text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-1">
                      {deleting ? <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin"/> : <Trash2 className="w-3 h-3"/>}
                      Delete
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-white/10 text-white/40 rounded-xl font-body text-xs">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}