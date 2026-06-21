import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Save, Trash2, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import { getAdminEditMode } from './home/Navbar';

function useGlobalEditMode() {
  const [mode, setMode] = useState(getAdminEditMode());
  useEffect(() => {
    // poll every 300ms — lightweight enough
    const t = setInterval(() => setMode(getAdminEditMode()), 300);
    return () => clearInterval(t);
  }, []);
  return mode;
}

/**
 * Wraps any card/item and shows an edit pencil on hover for admins OR the item owner (seller).
 * Props:
 *   entity      - 'Listing' | 'Business' | etc.
 *   record      - the full data object
 *   fields      - array of { key, label, type? ('text'|'textarea'|'number'|'boolean'|'image') }
 *   onSaved     - callback after save
 *   onDeleted   - optional callback after delete
 *   isOwner     - if true, shows edit button for sellers editing their own items
 *   children    - the wrapped UI
 */
export default function AdminEditOverlay({ entity, record, fields, onSaved, onDeleted, isOwner = false, children }) {
  const globalEditMode = useGlobalEditMode();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const fileRefs = useRef({});

  const openModal = (e) => {
    e.stopPropagation();
    const initial = {};
    fields.forEach(f => {
      if (f.type === 'images') initial[f.key] = record[f.key] ?? [];
      else initial[f.key] = record[f.key] ?? '';
    });
    setForm(initial);
    setOpen(true);
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const { file_url } = await uploadMediaFileToSupabase(file);
      setForm(v => ({ ...v, [key]: file_url }));
    } catch (e) {
      alert('Image upload failed. Please try again.');
    }
    setUploadingKey(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {};
    fields.forEach(f => {
      if (f.type === 'number') updates[f.key] = Number(form[f.key]) || 0;
      else if (f.type === 'boolean') updates[f.key] = Boolean(form[f.key]);
      else if (f.type === 'images') updates[f.key] = Array.isArray(form[f.key]) ? form[f.key] : [];
      else updates[f.key] = form[f.key];
    });
    await base44.entities[entity].update(record.id, updates);
    setSaving(false);
    setOpen(false);
    if (onSaved) onSaved({ ...record, ...updates });
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete this ${entity}? This cannot be undone.`)) return;
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
          {(hovered && (globalEditMode || isOwner)) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={openModal}
              className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full flex items-center justify-center shadow-lg gap-1"
              style={{ background: isOwner ? 'rgba(37,99,235,0.92)' : 'rgba(0,212,255,0.9)', backdropFilter: 'blur(4px)' }}
              title={isOwner ? 'Edit Your Item' : 'Admin Edit'}
            >
              <Pencil className="w-3.5 h-3.5 text-white"/>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center sm:p-4 bg-[#070F1A]/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.25)' }}>

              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-10"
                style={{ background: '#0D1F3C' }}>
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-body text-[9px] font-bold border border-blue-500/30">AI️ Edit Item</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-body text-[9px] font-bold border border-amber-500/30">AI️ Admin Edit</span>
                  )}
                  <h3 className="font-heading font-bold text-white text-sm">{record.title || record.name || entity}</h3>
                </div>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-white/60"/>
                </button>
              </div>

              {/* Fields */}
              <div className="p-5 space-y-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block font-body text-[10px] font-semibold text-white/45 mb-1.5 uppercase tracking-wider">{f.label}</label>

                    {f.type === 'image' ? (
                      <div className="space-y-2">
                        {form[f.key] && (
                          <div className="relative rounded-xl overflow-hidden bg-white/5">
                            <img src={form[f.key]} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                            <button onClick={() => setForm(v => ({ ...v, [f.key]: '' }))}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                              <X className="w-3 h-3 text-white"/>
                            </button>
                          </div>
                        )}
                        <input
                          ref={el => fileRefs.current[f.key] = el}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(f.key, e.target.files[0])}
                        />
                        <button
                          onClick={() => fileRefs.current[f.key]?.click()}
                          disabled={uploadingKey === f.key}
                          className="w-full py-3 border-2 border-dashed border-[#00D4FF]/40 hover:border-[#00D4FF]/80 rounded-xl text-[#00D4FF] font-body text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                          {uploadingKey === f.key
                            ? <><div className="w-3 h-3 border border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin"/> Uploading...</>
                            : <><Upload className="w-3.5 h-3.5"/> Upload Image from Device (JPG, PNG, etc.)</>}
                        </button>
                      </div>
                    ) : f.type === 'images' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {(form[f.key] || []).map((url, i) => (
                            <div key={i} className="relative">
                              <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                              <button onClick={() => setForm(v => ({ ...v, [f.key]: v[f.key].filter((_, j) => j !== i) }))}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">AI</button>
                            </div>
                          ))}
                        </div>
                        <input
                          ref={el => fileRefs.current[f.key] = el}
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/*"
                          multiple
                          className="hidden"
                          onChange={async e => {
                            const files = Array.from(e.target.files);
                            if (!files.length) return;
                            setUploadingKey(f.key);
                            const urls = await Promise.all(files.map(file => uploadMediaFileToSupabase(file).then(r => r.file_url)));
                            setForm(v => ({ ...v, [f.key]: [...(v[f.key] || []), ...urls] }));
                            setUploadingKey(null);
                            e.target.value = '';
                          }}
                        />
                        <button
                          onClick={() => fileRefs.current[f.key]?.click()}
                          disabled={uploadingKey === f.key}
                          className="w-full py-2.5 border-2 border-dashed border-white/20 hover:border-[#00D4FF]/60 rounded-xl text-white/50 font-body text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                          {uploadingKey === f.key
                            ? <><div className="w-3 h-3 border border-white/20 border-t-[#00D4FF] rounded-full animate-spin"/> Uploading...</>
                            : <><Upload className="w-3.5 h-3.5"/> Add Photos from Device</>}
                        </button>
                      </div>
                    ) : f.type === 'textarea' ? (
                      <textarea value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs resize-none h-20 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]"/>
                    ) : f.type === 'boolean' ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => setForm(v => ({ ...v, [f.key]: !v[f.key] }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${form[f.key] ? 'bg-[#2563EB]' : 'bg-white/15'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[f.key] ? 'translate-x-5' : 'translate-x-0.5'}`}/>
                        </button>
                        <span className="font-body text-xs text-white/50">{form[f.key] ? 'Yes / Active' : 'No / Hidden'}</span>
                      </div>
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={form[f.key] || ''}
                        onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white bg-white/5 focus:outline-none focus:border-[#00D4FF]"
                      />
                    )}
                  </div>
                ))}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 pb-1">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-3 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-sm hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <div className="w-4 h-4 border-2 border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin"/> : <Save className="w-4 h-4"/>}
                    Save Changes
                  </button>
                  {onDeleted && (
                    <button onClick={handleDelete} disabled={deleting}
                      className="px-4 py-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl font-body text-sm font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center gap-1">
                      {deleting ? <div className="w-4 h-4 border border-red-400/30 border-t-red-400 rounded-full animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}