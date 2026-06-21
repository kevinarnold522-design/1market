import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToSupabase } from '@/lib/supabaseUpload';
import SmartImage from '@/components/media/SmartImage';

const PH_LOCATIONS = [
  { group: 'NCR — Metro Manila', cities: ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'Marikina', 'Parañaque', 'Las Piñas', 'Muntinlupa', 'Caloocan', 'Valenzuela', 'Malabon', 'Navotas', 'San Juan', 'Pasay', 'Pateros'] },
  { group: 'Region IV-A — Calabarzon', cities: ['Bacoor (Cavite)', 'Dasmariñas (Cavite)', 'General Trias (Cavite)', 'Imus (Cavite)', 'Tagaytay (Cavite)', 'Batangas City', 'Calamba (Laguna)', 'Santa Rosa (Laguna)', 'Antipolo (Rizal)'] },
  { group: 'Region III — Central Luzon', cities: ['Angeles City (Pampanga)', 'San Fernando (Pampanga)', 'Malolos (Bulacan)', 'Cabanatuan (Nueva Ecija)', 'Olongapo (Zambales)'] },
  { group: 'Region VII — Central Visayas', cities: ['Cebu City', 'Mandaue (Cebu)', 'Lapu-Lapu (Cebu)'] },
  { group: 'Region XI — Davao Region', cities: ['Davao City'] },
  { group: 'Region X — Northern Mindanao', cities: ['Cagayan de Oro'] },
  { group: 'Nationwide / Remote', cities: ['Nationwide', 'Remote / Online', 'Work From Home'] },
];

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Project-based', 'Live-in', 'Internship'];

export default function AddJobModal({ onClose, user, categories = [] }) {
  const [form, setForm] = useState({
    title: '',
    subcategory: '',
    type_label: 'Full-time',
    company: '',
    location: '',
    area: '',
    pay: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    apply_link: '',
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dpaAccepted, setDpaAccepted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedCat = categories.find(c => c.key === form.subcategory);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await uploadMediaFileToSupabase(file);
      set('image_url', file_url);
    } catch {
      // Toast is shown by the uploader.
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.location) return;
    setSaving(true);
    await base44.entities.Listing.create({
      title: form.title,
      type: 'jobs',
      main_category: 'jobs',
      subcategory: form.subcategory,
      seller_name: form.company || user?.full_name || '',
      location: form.location,
      area: form.area,
      price_label: form.pay,
      description: form.description,
      email_contact: form.contact_email,
      phone: form.contact_phone,
      apply_link: form.apply_link,
      image_url: form.image_url,
      is_active: true,
      approval_status: 'pending',
    });
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[8000] flex items-start justify-center p-4 pt-8 overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl mb-8"
          style={{ background: '#0A1628', border: '1px solid rgba(62,151,241,0.3)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10"
            style={{ background: 'linear-gradient(90deg, #0033C4, #0040D0)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-lg">Post a Job</h2>
                <p className="font-body text-xs text-white/50">Pending admin approval before going live</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {saved ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(62,151,241,0.2)' }}>
                <Briefcase className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-heading font-bold text-white text-xl">Job Submitted!</h3>
              <p className="font-body text-white/50 text-sm mt-2">Pending admin review. It'll go live once approved.</p>
            </div>
          ) : (
            <div className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">

              {/* Job category selector — visual cards */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-2 font-semibold">Job Category *</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {categories.map(cat => (
                    <button key={cat.key} onClick={() => set('subcategory', cat.key)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all"
                      style={form.subcategory === cat.key
                        ? { background: `${cat.color}22`, borderColor: cat.color, boxShadow: `0 0 12px ${cat.color}44` }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-body text-[9px] text-white/70 text-center leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {selectedCat && (
                  <div className="mt-2 px-3 py-1.5 rounded-lg inline-flex items-center gap-2"
                    style={{ background: `${selectedCat.color}22`, border: `1px solid ${selectedCat.color}44` }}>
                    <span>{selectedCat.icon}</span>
                    <span className="font-body text-xs font-bold" style={{ color: selectedCat.color }}>{selectedCat.label} selected</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Job Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. React Developer, Restaurant Crew, Delivery Rider..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
              </div>

              {/* Job Type + Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Employment Type</label>
                  <select value={form.type_label} onChange={e => set('type_label', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#3E97F1]/60">
                    {JOB_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Company / Employer</label>
                  <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company name..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
                </div>
              </div>

              {/* Pay */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Salary / Pay</label>
                <input value={form.pay} onChange={e => set('pay', e.target.value)}
                  placeholder="e.g. ₱25,000–₱35,000/mo, ₱570/day, Negotiable..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Location *</label>
                  <select value={form.location} onChange={e => set('location', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#3E97F1]/60">
                    <option value="">Select location...</option>
                    {PH_LOCATIONS.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Area / District</label>
                  <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. BGC, Ortigas, WFH..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Job Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe the role, requirements, benefits..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60 resize-none" />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Contact Email</label>
                  <input value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="hr@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
                </div>
                <div>
                  <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Contact Phone</label>
                  <input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="+63..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
                </div>
              </div>

              {/* Apply link */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Apply Link (optional)</label>
                <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm placeholder-white/25 focus:outline-none focus:border-[#3E97F1]/60" />
              </div>

              {/* Photo upload */}
              <div>
                <label className="block font-body text-xs text-white/50 mb-1 font-semibold">Job Photo (optional — appears on listing page)</label>
                {form.image_url ? (
                  <div className="relative">
                    <SmartImage src={form.image_url} alt="Job photo preview" className="w-full h-40 rounded-xl" />
                    <button onClick={() => set('image_url', '')}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ border: '2px dashed rgba(62,151,241,0.3)' }}>
                    {uploading ? (
                      <div className="w-6 h-6 border border-[#3E97F1]/30 border-t-[#3E97F1] rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#3E97F1]/50" />
                    )}
                    <span className="font-body text-xs text-white/30">{uploading ? 'Uploading...' : 'Click to upload job photo'}</span>
                    <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} disabled={uploading} />
                  </label>
                )}
              </div>

              {/* DPA Consent */}
              <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${dpaAccepted ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                <input type="checkbox" id="dpa-job-consent" checked={dpaAccepted} onChange={e => setDpaAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#3E97F1] flex-shrink-0" />
                <label htmlFor="dpa-job-consent" className="font-body text-[11px] text-white/60 leading-relaxed cursor-pointer">
                  I agree to the <span className="text-[#3E97F1]">Data Privacy Act of 2012 (Republic Act 10173)</span>. I consent to the collection and processing of my personal information for this job listing and acknowledge that 1MarketPH may store and display this information publicly.
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm text-white/50 border border-white/10 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.title || !form.location || saving || !dpaAccepted}
                  className="flex-1 py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #0033C4, #3E97F1)', boxShadow: '0 0 16px rgba(62,151,241,0.4)' }}>
                  {saving ? 'Submitting...' : 'Submit Job Listing'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}