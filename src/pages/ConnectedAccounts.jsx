import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Plus, Trash2, X, ArrowLeft, LogIn, Edit2, Save, Search, LogOut, Users, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isOwnerAccount } from '@/lib/adminAuth';
import { saveGhostSession as persistGhostSession, clearGhostSession as clearPersistedGhostSession } from '@/lib/ghostAccounts';

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

// localStorage helpers for session management
const saveGhostSession = (ghost) => persistGhostSession(ghost);
const getGhostSession = () => { try { return JSON.parse(sessionStorage.getItem('1m_ghost_session') || localStorage.getItem('1m_ghost_session')); } catch { return null; } };
const clearGhostSession = () => clearPersistedGhostSession();
const saveGhostLocal = (g) => localStorage.setItem(STORAGE_PREFIX + g.ghost_id, JSON.stringify(g));
const getAllGhostsLocal = () => {
  const ghosts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try { ghosts.push(JSON.parse(localStorage.getItem(key))); } catch {}
    }
  }
  return ghosts.sort((a, b) => b.created_at - a.created_at);
};
const deleteGhostLocal = (id) => localStorage.removeItem(STORAGE_PREFIX + id);

export function getImpersonatedUser() {
  return getGhostSession();
}

export function clearImpersonation() {
  clearGhostSession();
  window.location.href = '/connected-accounts';
}

export default function ConnectedAccounts() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ghosts, setGhosts] = useState([]);
  const [dbGhosts, setDbGhosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('local'); // 'local' or 'database'
  const [currentGhost, setCurrentGhost] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    // Check for active ghost session - created users cannot access this page
    const session = getGhostSession();
    if (session) {
      setCurrentGhost(session);
    }

    base44.auth.me().then(user => {
      // Only the owner email gets access — no role checks
      setIsAdmin(isOwnerAccount(user, getGhostSession()));
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));
  }, []);

  const loadLocalGhosts = () => {
    setGhosts(getAllGhostsLocal());
    setLoading(false);
  };

  const loadDbGhosts = async () => {
    setLoading(true);
    try {
      const allUsers = await base44.entities.User.list('-created_date', 1000);
      const ghosts = allUsers.filter(u => u.is_ghost_account || u.ghost_id || u.email?.includes('@1marketph-ghost.internal'));
      setDbGhosts(ghosts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    } catch (err) {
      console.error('Failed to load DB ghosts:', err);
      setDbGhosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authChecked && isAdmin) {
      loadLocalGhosts();
      loadDbGhosts();
    }
  }, [authChecked, isAdmin]);

  const createDbGhost = async () => {
    if (!form.full_name.trim()) { showToast('Name required'); return; }
    setSaving(true);
    setProgress(0);
    
    try {
      const ts = Date.now();
      const rnd = Math.random().toString(36).substring(2, 8);
      const ghostId = `ghost_${ts}_${rnd}`;
      const ghostEmail = `${ghostId}@1marketph-ghost.internal`;
      const cleanUsername = `ghost_${ts}_${rnd}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
      
      // Create via backend function for proper DB persistence
      const response = await base44.functions.invoke('createGhostAccount', {
        full_name: form.full_name.trim(),
        channel_name: form.channel_name.trim() || form.full_name.trim(),
        user_type: form.user_type,
        business_name: form.business_name.trim() || form.full_name.trim(),
        location: form.location,
        bio: form.bio || '',
        seller_area: form.seller_area || '',
      });

      if (response.data.success) {
        showToast('✓ Database ghost created!');
        setTimeout(() => {
          setSaving(false);
          setProgress(0);
          setShowForm(false);
          setForm(EMPTY_FORM);
          loadDbGhosts();
          // Auto-login to the new ghost
          loginAsDb(response.data.user);
        }, 800);
      } else {
        throw new Error(response.data.error || 'Creation failed');
      }
    } catch (err) {
      console.error('DB ghost creation error:', err);
      setSaving(false);
      setProgress(0);
      showToast('Error: ' + err.message);
    }
  };

  const createLocalGhost = async () => {
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
      
      saveGhostLocal(ghost);
      clearInterval(interval);
      setProgress(100);
      showToast('✓ Local ghost created!');
      
      setTimeout(() => {
        setSaving(false);
        setProgress(0);
        setShowForm(false);
        setForm(EMPTY_FORM);
        loadLocalGhosts();
        window.location.href = `/seller/${ghost.ghost_id}`;
      }, 800);
    } catch (err) {
      clearInterval(interval);
      setSaving(false);
      setProgress(0);
      showToast('Error: ' + err.message);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'database') {
      await createDbGhost();
    } else {
      await createLocalGhost();
    }
  };

  const deleteLocalAccount = (g) => {
    if (!window.confirm('Delete local ghost?')) return;
    deleteGhostLocal(g.ghost_id);
    showToast('Deleted');
    loadLocalGhosts();
  };

  const deleteDbGhost = async (g) => {
    if (!window.confirm('Delete database ghost? This cannot be undone.')) return;
    try {
      await base44.entities.User.delete(g.id);
      showToast('Deleted from database');
      loadDbGhosts();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const loginAsLocal = (g) => {
    const sessionData = {
      id: g.ghost_id,
      full_name: g.full_name,
      email: g.email,
      user_type: g.user_type,
      business_name: g.business_name,
      channel_name: g.channel_name,
      role: 'user',
      is_seller: g.is_seller,
      is_ghost_account: true,
      profile_picture: g.profile_picture,
      seller_location: g.seller_location,
      social_facebook: g.social_facebook,
      social_instagram: g.social_instagram,
      social_tiktok: g.social_tiktok,
    };
    saveGhostSession(sessionData);
    setCurrentGhost(sessionData);
    showToast(`Switched to: ${g.full_name} (persistent)`);
    setTimeout(() => navigate('/'), 800);
  };

  const loginAsDb = (g) => {
    const sessionData = {
      id: g.id,
      full_name: g.full_name,
      email: g.email,
      user_type: g.user_type,
      business_name: g.business_name,
      channel_name: g.channel_name,
      role: 'user',
      is_seller: g.is_seller,
      is_ghost_account: g.is_ghost_account,
      profile_picture: g.profile_picture,
      seller_location: g.seller_location,
      social_facebook: g.social_facebook,
      social_instagram: g.social_instagram,
      social_tiktok: g.social_tiktok,
    };
    saveGhostSession(sessionData);
    setCurrentGhost(sessionData);
    showToast(`Switched to: ${g.full_name} (persistent)`);
    setTimeout(() => navigate('/'), 800);
  };

  const signOutGhost = () => {
    clearGhostSession();
    setCurrentGhost(null);
    showToast('Signed out of ghost account');
    setTimeout(() => navigate('/'), 500);
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

  const filteredLocal = ghosts.filter(g =>
    g.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.channel_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDb = dbGhosts.filter(g =>
    g.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    g.channel_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  // Block created users from accessing this page
  const session = getGhostSession();
  if (session || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔒</div>
        <p className="font-body text-white/50 mb-4">{session ? 'Ghost accounts cannot access this page' : 'Admin access required'}</p>
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
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
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
                <span className="font-heading font-bold text-white block text-sm">Created Users Dashboard</span>
                <span className="font-body text-[10px] text-white/40">Manage live created users</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentGhost && (
              <button onClick={signOutGhost}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Sign Out Ghost
              </button>
            )}
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
              <Plus className="w-4 h-4" /> New Created User
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        {/* Current Ghost Session Banner */}
        {currentGhost && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.5)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="font-body font-bold text-sm text-green-200">Currently signed in as ghost: <span className="text-white">{currentGhost.full_name}</span></p>
                <p className="font-body text-[10px] text-green-300/60">Session persists across refreshes. Sign out to return to admin account.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('local')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm transition-all ${activeTab === 'local' ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}>
            <Users className="w-4 h-4" /> Local Created Users ({ghosts.length})
          </button>
          <button onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm transition-all ${activeTab === 'database' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}>
            <DatabaseIcon className="w-4 h-4" /> Database Created Users ({dbGhosts.length})
          </button>
        </div>

        {/* Info card */}
        <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="font-body text-xs text-purple-300 leading-relaxed">
            <strong className="text-white">Local Created Users:</strong> Stored in browser, quick testing. <strong className="text-white">Database Created Users:</strong> Real User records, persistent across devices. Click <strong>"Login As"</strong> to impersonate — session persists until sign out.
          </p>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">{editing ? 'Edit Ghost' : `Create ${activeTab === 'database' ? 'Database' : 'Local'} Ghost`}</h3>
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
                  {saving ? `Creating... ${progress}%` : (editing ? 'Save' : `Create ${activeTab === 'database' ? 'in Database' : 'Locally'}`)}
                </button>
                {saving && <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-cyan-400" style={{ width: `${progress}%` }} /></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab === 'database' ? 'database' : 'local'} ghosts...`}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (activeTab === 'database' ? filteredDb : filteredLocal).length === 0 ? (
          <div className="text-center py-20">
            <Ghost className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-body text-white/30 text-sm">No {activeTab === 'database' ? 'database' : 'local'} ghosts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(activeTab === 'database' ? filteredDb : filteredLocal).map(g => (
              <motion.div key={g.ghost_id || g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
                  <button onClick={() => (activeTab === 'database' ? loginAsDb : loginAsLocal)(g)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                    <LogIn className="w-3.5 h-3.5" /> Login As
                  </button>
                  <button onClick={() => openEdit(g)} className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10">
                    <Edit2 className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  <button onClick={() => (activeTab === 'database' ? deleteDbGhost : deleteLocalAccount)(g)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10">
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

function DatabaseIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  );
}