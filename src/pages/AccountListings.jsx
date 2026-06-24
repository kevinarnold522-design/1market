import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Pencil, Trash2, Eye, Clock, CheckCircle2, Crown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getGhostSession, getGhostDisplayName, isGhostOwnedRecord } from '@/lib/ghostAccounts';

const statusTabs = [
  { key: 'all', label: 'My Listings', icon: Package },
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'approved', label: 'Published', icon: CheckCircle2 },
];

export default function AccountListings() {
  const [user, setUser] = useState(null);
  const [ghost, setGhost] = useState(getGhostSession());
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const refreshGhost = () => setGhost(getGhostSession());
    window.addEventListener('ghost-session-changed', refreshGhost);
    base44.auth.me().then(setUser).catch(() => setUser(null));
    return () => window.removeEventListener('ghost-session-changed', refreshGhost);
  }, []);

  useEffect(() => {
    loadListings();
  }, [ghost?.ghost_id, ghost?.id, user?.id]);

  useEffect(() => {
    const unsubscribe = base44.entities.Listing.subscribe((event) => {
      const changed = event.data || event.old_data;
      if (!changed?.id) return;
      if (event.type === 'delete') {
        setListings(items => items.filter(item => item.id !== changed.id));
        return;
      }
      const owned = ghost
        ? isGhostOwnedRecord(changed, ghost)
        : changed.created_by_id === user?.id || changed.owner_email === user?.email || changed.created_by === user?.email;
      if (!owned) return;
      if (changed.is_active === false) {
        setListings(items => items.filter(item => item.id !== changed.id));
        return;
      }
      setListings(items => {
        const exists = items.some(item => item.id === changed.id);
        return exists ? items.map(item => item.id === changed.id ? { ...item, ...changed } : item) : [changed, ...items];
      });
    });
    return unsubscribe;
  }, [ghost?.ghost_id, ghost?.id, user?.id, user?.email]);

  const loadListings = async () => {
    setLoading(true);
    const all = await base44.entities.Listing.list('-created_date', 500);
    const owned = all.filter(item => {
      if (item.is_active === false) return false;
      if (ghost) return isGhostOwnedRecord(item, ghost);
      return item.created_by_id === user?.id || item.owner_email === user?.email || item.created_by === user?.email;
    });
    setListings(owned);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (activeTab === 'all') return listings;
    return listings.filter(item => item.approval_status === activeTab);
  }, [listings, activeTab]);

  const deleteListing = async (listing) => {
    if (ghost && !isGhostOwnedRecord(listing, ghost)) return;
    if (!window.confirm('Delete this listing?')) return;
    try {
      await base44.entities.Listing.delete(listing.id);
    } catch {
      await base44.entities.Listing.update(listing.id, { is_active: false, approval_status: 'rejected' });
    }
    setListings(items => items.filter(item => item.id !== listing.id));
    window.dispatchEvent(new CustomEvent('listing-deleted', { detail: { id: listing.id } }));
  };

  const accountName = ghost ? getGhostDisplayName(ghost) : (user?.full_name || 'My Account');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07123d] via-[#0033CC] to-[#001a80] px-4 py-8 text-white font-body">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/65 hover:text-white mb-6 font-body text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="rounded-[2rem] p-6 md:p-8 mb-6 shadow-2xl" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.13),rgba(13,31,60,0.88))', border: '1px solid rgba(255,215,0,0.22)', boxShadow: '0 24px 70px rgba(0,0,0,0.26)' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(255,215,0,0.11)', border: '1px solid rgba(255,215,0,0.24)' }}>
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <p className="font-body text-[10px] text-amber-200 uppercase tracking-[0.22em] font-bold">{ghost ? 'Test Account Listings' : 'Premium Listings Dashboard'}</p>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-white">{accountName}</h1>
          <p className="font-body text-sm text-white/60 mt-2 max-w-2xl">Manage, review, and polish the listings owned by this account.</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
            <Package className="w-4 h-4 text-[#00D4FF]" />
            <span className="font-body text-sm font-bold text-white">Total Listings: {listings.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {statusTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            const count = tab.key === 'all' ? listings.length : listings.filter(item => item.approval_status === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5" style={{ background: active ? 'linear-gradient(135deg,rgba(255,215,0,0.18),rgba(0,212,255,0.13))' : 'rgba(255,255,255,0.07)', border: `1px solid ${active ? 'rgba(255,215,0,0.42)' : 'rgba(255,255,255,0.12)'}`, boxShadow: active ? '0 14px 34px rgba(255,215,0,0.12)' : 'none' }}>
                <Icon className="w-5 h-5 text-amber-300 mb-2" />
                <p className="font-body text-xs text-white/60 font-semibold">{tab.label}</p>
                <p className="font-heading font-bold text-2xl tracking-tight">{count}</p>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-[#00D4FF] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white text-slate-950 rounded-[2rem] p-8 shadow-2xl text-center border border-amber-200/60">
            <Package className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="font-heading font-bold text-2xl mb-2 tracking-tight">No listings found</h2>
            <p className="text-slate-500 mb-5 font-body">Listings created by this account will appear here.</p>
            <Link to="/post-ad" className="px-5 py-2.5 rounded-xl bg-blue-600 text-yellow-200 font-bold shadow-lg">Create listing</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="rounded-2xl p-4 flex items-center gap-4 shadow-xl transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.12),rgba(13,31,60,0.88))', border: '1px solid rgba(255,255,255,0.14)' }}>
                <img src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop'} alt="" className="w-16 h-16 rounded-2xl object-cover ring-1 ring-amber-200/30" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-white truncate tracking-tight">{item.title}</h3>
                  <p className="font-body text-xs text-white/50 truncate">{item.location || 'No location'} · {item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : 'Price on request')}</p>
                  <span className="inline-flex mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: item.approval_status === 'approved' ? 'rgba(16,185,129,0.16)' : 'rgba(255,215,0,0.14)', color: item.approval_status === 'approved' ? '#6ee7b7' : '#fcd34d' }}>{item.approval_status || 'pending'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/listing/${item.id}`} className="p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10"><Eye className="w-4 h-4 text-white/70" /></Link>
                  <Link to={`/listing/${item.id}/edit`} className="p-2 rounded-xl bg-amber-300/10 hover:bg-amber-300/20 border border-amber-300/20"><Pencil className="w-4 h-4 text-amber-300" /></Link>
                  <button onClick={() => deleteListing(item)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}