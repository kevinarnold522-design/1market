import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Plus, Trash2, X, ArrowLeft, LogIn, Edit2, Save, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OWNER_EMAIL = 'Kevinarnold522@gmail.com';
const LOCATIONS = ['Manila', 'Cavite', 'Nationwide'];
const STORAGE_PREFIX = '1m_ghost_';

const EMPTY_FORM = {
  full_name: '',
  channel_name: '',
  user_type: 'seller',
  business_name: '',
  location: 'Manila',
  bio: '',
  seller_area: '',
};

// localStorage helpers
const saveGhost = (g) => localStorage.setItem(STORAGE_PREFIX + g.ghost_id, JSON.stringify(g));
const getGhost = (id) => { try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + id)); } catch { return null; } };
const getAllGhosts = () => {
  const ghosts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try { ghosts.push(JSON.parse(localStorage.getItem(key))); } catch {}
    }
  }
  return ghosts.sort((a, b) => b.created_at - a.created_at);
};
const deleteGhost = (id) => localStorage.removeItem(STORAGE_PREFIX + id);

// Export for AuthContext
export function getImpersonatedUser() {
  try { return JSON.parse(sessionStorage.getItem('1mktph_impersonate')); } catch { return null; }
}

export default function ConnectedAccounts() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ghosts, setGhosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    base44.auth.me().then(user => {
      setIsAdmin(user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || user?.role === 'admin');
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  const load = () => { setLoading(true); setGhosts(getAllGhosts()); setLoading(false); };
  useEffect(() => { if (authChecked && isAdmin) load(); }, [authChecked, isAdmin]);

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { showToast('Name required'); return; }
    setSaving(true);
    setProgress(0);
    
    const interval = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 100);
    
    try {
      const ts = Date.now();
      const rnd = Math.random().toString(36).substring(2, 8);
      const ghostId = `ghost_${ts}_${rnd}`;
      
      const ghost = {
        id: ghostId,
        ghost_id: ghostId,
        full_name: form.full_name.trim(),
        channel_name: form.channel_name.trim() || form.full_name.trim(),
        email: `${ghostId}@1marketph-ghost.internal`,
        username: `ghost_${ts}_${rnd}`.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        username_set: true,
        user_type: form.user_type,
        is_seller: form.user_type !== 'customer',
        account_type: form.user_type === 'business' ? 'business_owner' : 'customer',
        business_name: form.business_name.trim() || form.full_name.trim(),
        seller_location: form.location,
        location: form.location,
        seller_area: form.seller_area,
        seller_page_enabled: form.user_type !== 'customer',
        is_ghost_account: true,
        is_connected_account: true,
        created_at: new Date().toISOString(),
        bio: form.bio,
        seller_bio: form.bio,
        profile_picture: '',
        cover_photo: '',
        is_verified_seller: false,
        verification_submitted: false,
        facebook_page_id: '',
        facebook_page_name: '',
        facebook_live_enabled: false,
        social_facebook: '',
        social_instagram: '',
        social_tiktok: '',
        phone: '',
        show_phone_public: false,
        show_email_public: false,
        seller_products: [],
        business_categories: [],
      };
      
      if (editing) {
        const updated = { ...editing, ...ghost, ghost_id: editing.ghost_id, id: editing.id };
        saveGhost(updated);
        setGhosts(prev => prev.map(g => g.ghost_id === updated.ghost_id ? updated : g));
        clearInterval(interval);
        setProgress(100);
        showToast('✓ Updated!');
      } else {
        saveGhost(ghost);
        clearInterval(interval);
        setProgress(100);
        showToast('✓ Created!');
      }
      
      setTimeout(() => {
        setSaving(false);
        setProgress(0);
        setShowForm(false);
        setEditing(null);
        setForm(EMPTY_FORM);
        load();
        if (!editing) window.location.href = `/seller/${ghost.ghost_id}`;
      }, 800);
    } catch (err) {
      clearInterval(interval);
      setSaving(false);
      setProgress(0);
      showToast('Error: ' + err.message);
    }
  };

  const deleteAccount = (g) => {
    if (!window.confirm('Delete?')) return;
    deleteGhost(g.ghost_id);
    showToast('Deleted');
    load();
  };

  const loginAs = (g) => {
    sessionStorage.setItem('1mktph_impersonate', JSON.stringify({
      id: g.ghost_id, full_name: g.full_name, email: g.email, user_type: g.user_type,
      business_name: g.business_name, channel_name: g.channel_name, role: 'user',
      is_seller: g.is_seller, is_ghost_account: true, profile_picture: g.profile_picture,
      seller_location: g.seller_location, social_facebook: g.social_facebook,
      social_instagram: g.social_instagram, social_tiktok: g.social_tiktok,
    }));
    showToast(`Switched to: ${g.full_name}`);
    setTimeout(() => navigate('/'), 800);
  };

  const openEdit = (g) => {
    setEditing(g);
    setForm({
      full_name: g.full_name, channel_name: g.channel_name, user_type: g.user_type,
      business_name: g.business_name, location: g.seller_location, bio: g.bio, seller_area: g.seller_area,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = ghosts.filter(g =>
    g.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.channel_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔒</div>
        <p className="font-body text-white/50 mb-4">Admin only</p>
        <Link to="/" className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body text-sm font-bold">← Home</Link>
      </div>
    </div>
  );

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]';
  const labelCls = 'block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-body">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                <Ghost className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white block text-sm">Ghost Accounts</span>
                <span className="font-body text-[10px] text-white/40">Test accounts</span>
              </div>
            </div>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        {/* Info */}
        <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="font-body text-xs text-purple-300">
            <strong className="text-white">How it works:</strong> Create test accounts stored locally. Click <strong>"Login As"</strong> to impersonate.
          </p>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">{editing ? 'Edit' : 'Create Ghost'}</h3>
                <button onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input value={form.full_name} onChange={e => setField('full_name', e.target.value)} placeholder="Maria Santos" className={inputCls} autoFocus />
                </div>
                <div>
                  <label className={labelCls}>Channel Name</label>
                  <input value={form.channel_name} onChange={e => setField('channel_name', e.target.value)} placeholder="MariaShop" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Business Name</label>
                  <input value={form.business_name} onChange={e => setField('business_name', e.target.value)} placeholder="Optional" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={form.user_type} onChange={e => setField('user_type', e.target.value)} className={inputCls}>
                    <option value="customer" className="bg-[#001a80]">Customer</option>
                    <option value="seller" className="bg-[#001a80]">Seller</option>
                    <option value="business" className="bg-[#001a80]">Business</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <select value={form.location} onChange={e => setField('location', e.target.value)} className={inputCls}>
                    {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Area</label>
                  <input value={form.seller_area} onChange={e => setField('seller_area', e.target.value)} placeholder="Bacoor" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Bio</label>
                  <textarea value={form.bio} onChange={e => setField('bio', e.target.value)} rows={2} placeholder="Short bio" className={`${inputCls} resize-none`} />
                </div>
              </div>

              <div className="space-y-2">
                <button onClick={handleSubmit} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? `Creating... ${progress}%` : (editing ? 'Save' : 'Create')}
                </button>
                {saving && <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-cyan-400" style={{ width: `${progress}%` }} /></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Ghost className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-body text-white/30 text-sm">No ghosts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(g => (
              <motion.div key={g.ghost_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4 flex-wrap"
                style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(168,85,247,0.15)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                  {(g.channel_name || g.full_name || 'G')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-sm text-white">{g.full_name}</p>
                  <p className="font-body text-xs text-white/40">{g.seller_location}{g.seller_area ? ` · ${g.seller_area}` : ''}{g.business_name ? ` · ${g.business_name}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => loginAs(g)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                    <LogIn className="w-3.5 h-3.5" /> Login
                  </button>
                  <button onClick={() => openEdit(g)} className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10">
                    <Edit2 className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  <button onClick={() => deleteAccount(g)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0A192F] text-white px-6 py-3 rounded-xl font-body text-sm shadow-2xl z-50 border border-purple-500/30">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}