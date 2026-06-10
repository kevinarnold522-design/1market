import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, Plus, Trash2, X, ArrowLeft, User, LogIn, Shield, Search, Edit2, Save, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminEditMode } from '@/components/home/Navbar';

const OWNER_EMAIL = 'Kevinarnold522@gmail.com';
const LOCATIONS = ['Manila', 'Cavite', 'Nationwide'];

const EMPTY_FORM = {
  full_name: '',
  channel_name: '',
  user_type: 'seller',
  business_name: '',
  location: 'Manila',
  bio: '',
  seller_area: '',
  social_facebook: '',
  social_instagram: '',
  social_tiktok: '',
};

// Session key for impersonation
const IMPERSONATE_KEY = '1mktph_impersonate';

export function getImpersonatedUser() {
  try { return JSON.parse(sessionStorage.getItem(IMPERSONATE_KEY)); } catch { return null; }
}

export function clearImpersonation() {
  sessionStorage.removeItem(IMPERSONATE_KEY);
  window.location.href = '/connected-accounts';
}

export default function ConnectedAccounts() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [toast, setToast] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    base44.auth.me().then(user => {
      const admin = user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || user?.role === 'admin';
      setIsAdmin(admin);
      setAuthChecked(true);
    }).catch(() => setAuthChecked(true));

    // Check active impersonation session
    const imp = getImpersonatedUser();
    if (imp) setActiveSession(imp);
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    const all = await base44.entities.User.list('-created_date', 500);
    // Filter to show only accounts created by admin (ghost accounts)
    // Ghost accounts have internal email domain
    setAccounts(all.filter(u => u.email?.includes('@ghost.1marketph.internal') || u.is_ghost_account || u.is_connected_account));
    setLoading(false);
  };

  useEffect(() => { if (authChecked && isAdmin) loadAccounts(); }, [authChecked, isAdmin]);

  const handleCreate = async () => {
    if (!form.full_name.trim()) { showToast('Name is required'); return; }
    setSaving(true);
    setSaveProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setSaveProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);
      
      const ghostId = `ghost_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (editingAccount) {
        await base44.entities.User.update(editingAccount.id, {
          full_name: form.full_name.trim(),
          channel_name: form.channel_name.trim() || form.full_name.trim(),
          user_type: form.user_type,
          business_name: form.business_name.trim() || form.full_name.trim(),
          seller_location: form.location,
          bio: form.bio,
          seller_area: form.seller_area,
          social_facebook: form.social_facebook,
          social_instagram: form.social_instagram,
          social_tiktok: form.social_tiktok,
          is_seller: form.user_type === 'seller' || form.user_type === 'business',
        });
        clearInterval(progressInterval);
        setSaveProgress(100);
        showToast('Account updated!');
      } else {
        const userData = {
          full_name: form.full_name.trim(),
          channel_name: form.channel_name.trim() || form.full_name.trim(),
          email: `${ghostId}@ghost.1marketph.internal`,
          user_type: form.user_type,
          is_seller: form.user_type === 'seller' || form.user_type === 'business',
          business_name: form.business_name.trim() || form.full_name.trim(),
          seller_location: form.location,
          seller_area: form.seller_area,
          bio: form.bio,
          social_facebook: form.social_facebook,
          social_instagram: form.social_instagram,
          social_tiktok: form.social_tiktok,
          seller_page_enabled: true,
          role: 'user',
        };
        if (form.user_type === 'business') {
          userData.account_type = 'business_owner';
        }
        await base44.entities.User.create(userData);
        clearInterval(progressInterval);
        setSaveProgress(100);
        showToast('Account created!');
      }
      setTimeout(() => {
        setSaving(false);
        setSaveProgress(0);
        setShowForm(false);
        setEditingAccount(null);
        setForm(EMPTY_FORM);
        loadAccounts();
      }, 500);
    } catch (err) {
      console.error('Failed to create account:', err);
      console.error('Error details:', err.message, err.stack);
      setSaving(false);
      setSaveProgress(0);
      showToast('Failed: ' + (err.message || 'Please try again'));
    }
  };

  const deleteAccount = async (id) => {
    if (!window.confirm('Delete this account?')) return;
    await base44.entities.User.delete(id);
    showToast('Account deleted.');
    loadAccounts();
  };

  const loginAs = (account) => {
    // Store the ghost account data in sessionStorage for impersonation
    const impersonateData = {
      id: account.id,
      full_name: account.full_name,
      email: account.email,
      user_type: account.user_type,
      business_name: account.business_name,
      channel_name: account.channel_name,
      role: 'user',
      is_seller: account.is_seller,
      is_ghost_account: true,
      profile_picture: account.profile_picture,
      seller_location: account.seller_location,
      social_facebook: account.social_facebook,
      social_instagram: account.social_instagram,
      social_tiktok: account.social_tiktok,
    };
    sessionStorage.setItem(IMPERSONATE_KEY, JSON.stringify(impersonateData));
    setActiveSession(impersonateData);
    showToast(`Switched to: ${account.full_name}`);
    setTimeout(() => navigate('/'), 800);
  };

  const stopImpersonation = () => {
    sessionStorage.removeItem(IMPERSONATE_KEY);
    setActiveSession(null);
    showToast('Session ended.');
  };

  const openEdit = (account) => {
    setEditingAccount(account);
    setForm({
      full_name: account.full_name || '',
      channel_name: account.channel_name || '',
      user_type: account.user_type || 'seller',
      business_name: account.business_name || '',
      location: account.seller_location || 'Manila',
      bio: account.bio || '',
      seller_area: account.seller_area || '',
      social_facebook: account.social_facebook || '',
      social_instagram: account.social_instagram || '',
      social_tiktok: account.social_tiktok || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = accounts.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.channel_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#070F1A' }}>
      <div className="w-8 h-8 border-4 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#070F1A' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔒</div>
        <p className="font-body text-white/50 mb-4">Admin only.</p>
        <Link to="/" className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-body text-sm font-bold">← Go Home</Link>
      </div>
    </div>
  );

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]';
  const labelCls = 'block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#070F1A 0%,#0a1940 100%)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-body">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white block text-sm">Connected Accounts</span>
                <span className="font-body text-[10px] text-white/40">Manage user profiles</span>
              </div>
            </div>
          </div>
          <button onClick={() => { setShowForm(true); setEditingAccount(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm text-white transition-colors"
            style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
            <Plus className="w-4 h-4" /> New Account
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        {/* Active Session Banner */}
        {activeSession && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1.5px solid rgba(168,85,247,0.5)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <p className="font-body font-bold text-sm text-purple-200">Currently acting as: <span className="text-white">{activeSession.full_name}</span></p>
                <p className="font-body text-[10px] text-purple-300/60">All actions on the site will appear as this user. Navigate to any page.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-colors">
                <LogIn className="w-3 h-3" /> Go to Site
              </button>
              <button onClick={stopImpersonation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
                <EyeOff className="w-3 h-3" /> Stop / Exit
              </button>
            </div>
          </motion.div>
        )}

        {/* Info card */}
        <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="font-body text-xs text-purple-300 leading-relaxed">
            <strong className="text-white">How it works:</strong> Create test accounts with custom profiles. Click <strong>"Login As"</strong> to switch to that persona — you can browse, post listings, send messages, and interact as that user. The session is stored locally for testing. Click <strong>"Stop / Exit"</strong> to return to your admin account.
          </p>
        </div>

        {/* Create / Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(13,31,60,0.9)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">{editingAccount ? 'Edit Account' : 'Create Connected Account'}</h3>
                <button onClick={() => { setShowForm(false); setEditingAccount(null); setForm(EMPTY_FORM); }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Display Name *</label>
                  <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Maria Santos" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Channel Name (Public)</label>
                  <input value={form.channel_name} onChange={e => set('channel_name', e.target.value)} placeholder="e.g. MariaShop PH" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Business / Store Name</label>
                  <input value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Optional" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Account Type</label>
                  <select value={form.user_type} onChange={e => set('user_type', e.target.value)} className={inputCls}>
                    <option value="customer" className="bg-[#0D1F3C]">Customer</option>
                    <option value="seller" className="bg-[#0D1F3C]">Seller</option>
                    <option value="business" className="bg-[#0D1F3C]">Business</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <select value={form.location} onChange={e => set('location', e.target.value)} className={inputCls}>
                    {LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Area / District</label>
                  <input value={form.seller_area} onChange={e => set('seller_area', e.target.value)} placeholder="e.g. Bacoor, Cavite" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Bio / About</label>
                  <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2} placeholder="Short bio..." className={`${inputCls} resize-none`} />
                </div>
              </div>

              <div>
                <p className="font-body text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Social Links (optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Facebook URL</label>
                    <input value={form.social_facebook} onChange={e => set('social_facebook', e.target.value)} placeholder="https://facebook.com/..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram URL</label>
                    <input value={form.social_instagram} onChange={e => set('social_instagram', e.target.value)} placeholder="https://instagram.com/..." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>TikTok URL</label>
                    <input value={form.social_tiktok} onChange={e => set('social_tiktok', e.target.value)} placeholder="https://tiktok.com/@..." className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button onClick={handleCreate} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-colors disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? `Creating... ${saveProgress}%` : (editingAccount ? 'Save Changes' : 'Create Account')}
                </button>
                {saving && (
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300"
                      style={{ width: `${saveProgress}%` }} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
        </div>

        {/* Accounts list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Ghost className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-body text-white/30 text-sm">No connected accounts yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(account => (
              <motion.div key={account.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-4 flex items-center gap-4 flex-wrap"
                style={{
                  background: activeSession?.id === account.id ? 'rgba(168,85,247,0.12)' : 'rgba(13,31,60,0.85)',
                  border: activeSession?.id === account.id ? '1.5px solid rgba(168,85,247,0.5)' : '1px solid rgba(168,85,247,0.15)',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                  {(account.channel_name || account.full_name || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-heading font-bold text-sm text-white">{account.full_name}</p>
                    {account.channel_name && account.channel_name !== account.full_name && (
                      <span className="font-body text-[10px] text-white/40">@{account.channel_name}</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/60 capitalize">{account.user_type || 'seller'}</span>
                    {activeSession?.id === account.id && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/25">● Active</span>
                    )}
                  </div>
                  <p className="font-body text-xs text-white/40">{account.seller_location || 'No location'}{account.seller_area ? ` · ${account.seller_area}` : ''}{account.business_name ? ` · ${account.business_name}` : ''}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {account.social_facebook && <span className="font-body text-[9px] text-blue-400">FB</span>}
                    {account.social_instagram && <span className="font-body text-[9px] text-pink-400">IG</span>}
                    {account.social_tiktok && <span className="font-body text-[9px] text-white/50">TT</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activeSession?.id === account.id ? (
                    <button onClick={stopImpersonation}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold bg-white/10 text-white/60 hover:bg-white/20 transition-colors">
                      <EyeOff className="w-3.5 h-3.5" /> Stop
                    </button>
                  ) : (
                    <button onClick={() => loginAs(account)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs font-bold text-white transition-colors"
                      style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                      <LogIn className="w-3.5 h-3.5" /> Login As
                    </button>
                  )}
                  <button onClick={() => openEdit(account)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors">
                    <Edit2 className="w-3.5 h-3.5 text-white/50" />
                  </button>
                  <button onClick={() => deleteAccount(account.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 transition-colors">
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