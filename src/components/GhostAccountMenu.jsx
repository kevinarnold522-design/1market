import React, { useEffect, useState } from 'react';
import { Ghost, LogIn, Plus, Repeat, LogOut, X } from 'lucide-react';
import { clearGhostSession, getAllLocalGhosts, getGhostDisplayName, getGhostInitials, getGhostSession, saveGhostSession } from '@/lib/ghostAccounts';

const STORAGE_PREFIX = '1m_ghost_';
const emptyForm = { full_name: '', username: '', bio: '', phone: '', email_contact: '', user_type: 'seller' };

export default function GhostAccountMenu({ collapsed = false, compact = false, onAction }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('menu');
  const [form, setForm] = useState(emptyForm);
  const [ghost, setGhost] = useState(getGhostSession());
  const [ghosts, setGhosts] = useState([]);

  useEffect(() => {
    const refresh = () => {
      setGhost(getGhostSession());
      setGhosts(getAllLocalGhosts());
    };
    refresh();
    window.addEventListener('ghost-session-changed', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('ghost-session-changed', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const close = () => { setOpen(false); setMode('menu'); onAction?.(); };

  const logoutGhost = () => {
    clearGhostSession();
    close();
    window.location.href = '/';
  };

  const switchGhost = (g) => {
    saveGhostSession(g);
    close();
    window.location.href = '/';
  };

  const createGhost = () => {
    if (!form.full_name.trim()) return;
    const ts = Date.now();
    const slug = (form.username || form.full_name).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24) || `ghost_${ts}`;
    const ghostId = `ghost_${ts}_${Math.random().toString(36).slice(2, 7)}`;
    const newGhost = {
      id: ghostId,
      ghost_id: ghostId,
      full_name: form.full_name.trim(),
      username: slug,
      channel_name: form.full_name.trim(),
      bio: form.bio.trim(),
      seller_bio: form.bio.trim(),
      phone: form.phone.trim(),
      email_contact: form.email_contact.trim(),
      email: `${ghostId}@1marketph-ghost.internal`,
      user_type: form.user_type,
      is_seller: form.user_type !== 'customer',
      account_type: form.user_type === 'business' ? 'business_owner' : 'customer',
      is_ghost_account: true,
      is_connected_account: true,
      created_at: new Date().toISOString(),
      seller_page_enabled: true,
      profile_picture: '',
    };
    localStorage.setItem(STORAGE_PREFIX + ghostId, JSON.stringify(newGhost));
    saveGhostSession(newGhost);
    setForm(emptyForm);
    close();
    window.location.href = '/profile';
  };

  const name = getGhostDisplayName(ghost);
  const buttonClasses = compact
    ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all'
    : 'w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-left';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={buttonClasses}
        style={{ background: ghost ? 'rgba(168,85,247,0.16)' : 'rgba(255,255,255,0.04)', borderColor: ghost ? 'rgba(168,85,247,0.38)' : 'rgba(255,255,255,0.1)', color: ghost ? '#d8b4fe' : 'rgba(255,255,255,0.58)' }}
        title={collapsed ? 'Ghost Account' : undefined}
      >
        {ghost?.profile_picture ? (
          <img src={ghost.profile_picture} alt="" className="w-5 h-5 rounded-lg object-cover flex-shrink-0" />
        ) : ghost ? (
          <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0">{getGhostInitials(ghost)}</span>
        ) : (
          <Ghost className="w-4 h-4 flex-shrink-0" />
        )}
        {!collapsed && <span className="font-body text-xs font-semibold truncate">{ghost ? name : 'Ghost Account'}</span>}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl p-2 shadow-2xl z-[200]" style={{ background: '#0D1F3C', border: '1px solid rgba(168,85,247,0.35)' }}>
          <div className="flex items-center justify-between px-2 py-1">
            <p className="font-body text-[10px] text-purple-300 uppercase tracking-wider font-bold">Ghost Account</p>
            <button onClick={close} className="p-1 rounded-lg hover:bg-white/10"><X className="w-3 h-3 text-white/45" /></button>
          </div>

          {mode === 'create' ? (
            <div className="space-y-2 p-2">
              <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Ghost account name" className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none" />
              <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none" />
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" rows={2} className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none resize-none" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Contact number" className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none" />
              <select value={form.user_type} onChange={e => setForm(f => ({ ...f, user_type: e.target.value }))} className="w-full bg-[#15284a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                <option value="seller">Seller</option>
                <option value="business">Business</option>
                <option value="customer">Customer</option>
              </select>
              <button onClick={createGhost} className="w-full py-2 rounded-xl bg-purple-600 text-white font-body text-xs font-bold">Create New Ghost Account</button>
              <button onClick={() => setMode('menu')} className="w-full py-1 text-white/40 font-body text-xs">Back</button>
            </div>
          ) : (
            <>
              {ghost && (
                <div className="px-3 py-2 mb-1 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="font-body text-[9px] text-purple-300 uppercase tracking-wider font-bold">Active Ghost Account</p>
                  <p className="font-body text-sm text-white font-bold truncate">{name}</p>
                </div>
              )}
              <button onClick={() => setMode('switch')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-body text-xs">
                <LogIn className="w-3.5 h-3.5 text-purple-300" /> Sign In to Ghost Account
              </button>
              <button onClick={() => setMode('create')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-body text-xs">
                <Plus className="w-3.5 h-3.5 text-cyan-300" /> Create New Ghost Account
              </button>
              <div className="border-t border-white/8 my-1" />
              <p className="px-3 py-1 font-body text-[9px] text-white/30 uppercase tracking-wider font-bold">Switch Ghost Account</p>
              {ghosts.length ? ghosts.slice(0, 6).map(g => (
                <button key={g.ghost_id || g.id} onClick={() => switchGhost(g)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/65 hover:text-white hover:bg-white/10 font-body text-xs text-left">
                  <Repeat className="w-3.5 h-3.5 text-purple-300" /> <span className="truncate">{getGhostDisplayName(g)}</span>
                </button>
              )) : (
                <p className="px-3 py-2 font-body text-xs text-white/30">No Ghost accounts yet.</p>
              )}
              <div className="border-t border-white/8 my-1" />
              <button onClick={logoutGhost} disabled={!ghost} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-body text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                <LogOut className="w-3.5 h-3.5" /> Logout Ghost Account
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}