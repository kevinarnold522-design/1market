import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Pencil, Trash2, Eye, Clock, CheckCircle2 } from 'lucide-react';
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

  const loadListings = async () => {
    setLoading(true);
    const all = await base44.entities.Listing.list('-created_date', 500);
    const owned = all.filter(item => {
      if (ghost) return isGhostOwnedRecord(item, ghost);
      return item.owner_user_id === user?.id || item.created_by_id === user?.id || item.owner_email === user?.email || item.created_by === user?.email;
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
    await base44.entities.Listing.delete(listing.id);
    setListings(items => items.filter(item => item.id !== listing.id));
  };

  const accountName = ghost ? getGhostDisplayName(ghost) : (user?.full_name || 'My Account');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0033CC] to-[#001a80] px-4 py-8 text-white">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="rounded-3xl p-6 mb-6" style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <p className="font-body text-xs text-white/45 uppercase tracking-wider font-bold">{ghost ? 'Ghost Account Dashboard' : 'Account Dashboard'}</p>
          <h1 className="font-heading font-bold text-3xl mt-1">{accountName}</h1>
          <p className="font-body text-sm text-white/55 mt-2">Only listings owned by this account are shown here.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {statusTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            const count = tab.key === 'all' ? listings.length : listings.filter(item => item.approval_status === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="rounded-2xl p-4 text-left transition-all" style={{ background: active ? 'rgba(0,212,255,0.16)' : 'rgba(255,255,255,0.06)', border: `1px solid ${active ? 'rgba(0,212,255,0.45)' : 'rgba(255,255,255,0.1)'}` }}>
                <Icon className="w-5 h-5 text-[#00D4FF] mb-2" />
                <p className="font-body text-xs text-white/55">{tab.label}</p>
                <p className="font-heading font-bold text-2xl">{count}</p>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-white/20 border-t-[#00D4FF] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-xl text-center">
            <Package className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h2 className="font-heading font-bold text-2xl mb-2">No listings found</h2>
            <p className="text-slate-500 mb-5">Listings created by this account will appear here and remain isolated.</p>
            <Link to="/post-ad" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold">Create listing</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'rgba(13,31,60,0.86)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <img src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-white truncate">{item.title}</h3>
                  <p className="font-body text-xs text-white/45 truncate">{item.location || 'No location'} · {item.price_label || (item.price ? `₱${Number(item.price).toLocaleString()}` : 'Price on request')}</p>
                  <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: item.approval_status === 'approved' ? 'rgba(16,185,129,0.16)' : 'rgba(245,158,11,0.16)', color: item.approval_status === 'approved' ? '#6ee7b7' : '#fbbf24' }}>{item.approval_status || 'pending'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/listing/${item.id}`} className="p-2 rounded-xl bg-white/8 hover:bg-white/15"><Eye className="w-4 h-4 text-white/65" /></Link>
                  <Link to={`/profile?tab=listings&edit=${item.id}`} className="p-2 rounded-xl bg-white/8 hover:bg-white/15"><Pencil className="w-4 h-4 text-[#00D4FF]" /></Link>
                  <button onClick={() => deleteListing(item)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}