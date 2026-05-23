import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, X, Save, Pencil, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ORDER_STATUSES = ['pending', 'seller_confirmed', 'buyer_confirmed', 'completed', 'cancelled'];

function OrderForm({ listings, user, onSave, onClose }) {
  const [form, setForm] = useState({
    listing_id: '',
    listing_title: '',
    listing_image: '',
    price_label: '',
    price: '',
    buyer_name: '',
    buyer_email: '',
    notes: '',
    status: 'pending',
  });
  const [saving, setSaving] = useState(false);

  const handleListingSelect = (e) => {
    const id = e.target.value;
    const listing = listings.find(l => l.id === id);
    if (listing) {
      setForm(f => ({
        ...f,
        listing_id: id,
        listing_title: listing.title,
        listing_image: listing.image_url || '',
        price_label: listing.price_label || `₱${Number(listing.price || 0).toLocaleString()}`,
        price: listing.price || '',
      }));
    } else {
      setForm(f => ({ ...f, listing_id: id }));
    }
  };

  const handleSave = async () => {
    if (!form.listing_id || !form.buyer_email) return;
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price) || 0,
      seller_email: user.email,
      seller_name: user.full_name || user.username || '',
    };
    await base44.entities.Order.create(data);
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="mb-4 rounded-2xl border border-white/10 p-4 space-y-3" style={{ background: 'rgba(13,31,60,0.9)' }}>
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm text-white">Add New Order</h4>
        <button onClick={onClose}><X className="w-4 h-4 text-white/40 hover:text-white" /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Listing <span className="text-red-400">*</span></label>
          <select value={form.listing_id} onChange={handleListingSelect}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]">
            <option value="" className="bg-[#0D1F3C]">— Select a listing —</option>
            {listings.map(l => <option key={l.id} value={l.id} className="bg-[#0D1F3C]">{l.title}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white focus:outline-none focus:border-[#00D4FF]">
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-[#0D1F3C] capitalize">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Buyer Name</label>
          <input value={form.buyer_name} onChange={e => setForm(f => ({ ...f, buyer_name: e.target.value }))}
            placeholder="Buyer's name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Buyer Email <span className="text-red-400">*</span></label>
          <input value={form.buyer_email} onChange={e => setForm(f => ({ ...f, buyer_email: e.target.value }))}
            placeholder="buyer@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Price Display</label>
          <input value={form.price_label} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))}
            placeholder="₱3,500"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Optional notes..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving || !form.listing_id || !form.buyer_email}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-40">
          {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
          Create Order
        </button>
        <button onClick={onClose} className="px-4 py-2 border border-white/10 text-white/40 rounded-xl font-body text-xs hover:bg-white/5 transition-colors">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

function OrderEditModal({ order, onClose, onSave }) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Order.update(order.id, { status, notes });
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#070F1A]/85 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl shadow-2xl" style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-bold text-white text-sm">Update Order</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-white/40" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <p className="font-body text-[10px] text-white/40 mb-1">Listing</p>
            <p className="font-body text-sm text-white font-semibold">{order.listing_title}</p>
            <p className="font-body text-[10px] text-white/40">Buyer: {order.buyer_name || order.buyer_email}</p>
          </div>
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Order Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
              {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-[#0D1F3C] capitalize">{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white resize-none h-16 focus:outline-none focus:border-[#00D4FF]"
              placeholder="Add notes..." />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body font-bold text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
              {saving ? <div className="w-3 h-3 border border-[#0A192F]/30 border-t-[#0A192F] rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 border border-white/10 text-white/40 rounded-xl font-body text-xs">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OrdersTab({ orders, setOrders, listings, user, confirmDelivery, showToast }) {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const refreshOrders = async () => {
    const ords = await base44.entities.Order.filter({ seller_email: user.email });
    setOrders(ords);
    showToast('Order updated!');
  };

  const handleAddSave = async () => {
    await refreshOrders();
    setShowAddOrder(false);
    showToast('Order created!');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-white text-sm">Orders ({orders.length})</h3>
        <button onClick={() => setShowAddOrder(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-xl font-body text-[10px] font-bold hover:bg-white transition-colors">
          <Plus className="w-3 h-3" /> Add Order
        </button>
      </div>

      <AnimatePresence>
        {showAddOrder && (
          <OrderForm listings={listings} user={user} onSave={handleAddSave} onClose={() => setShowAddOrder(false)} />
        )}
      </AnimatePresence>

      {orders.length === 0 && !showAddOrder ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Truck className="w-8 h-8 text-white/15 mx-auto mb-2" />
          <p className="font-body text-sm text-white/30">No orders yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => (
            <div key={order.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-xs text-white truncate">{order.listing_title}</p>
                <p className="font-body text-[10px] text-white/35">Buyer: {order.buyer_name || order.buyer_email}</p>
                <p className="font-body text-[10px] text-[#00D4FF]">{order.price_label}</p>
                {order.notes && <p className="font-body text-[9px] text-white/25 truncate">{order.notes}</p>}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                  order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
                <button onClick={() => setEditOrder(order)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-[#2563EB]/20 border border-white/10 transition-colors">
                  <Pencil className="w-3 h-3 text-[#00D4FF]" />
                </button>
                {order.status !== 'completed' && order.status !== 'cancelled' && !order.seller_confirmed_delivery && (
                  <button onClick={() => confirmDelivery(order)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#2563EB]/10 text-[#60a5fa] font-body text-[9px] font-bold hover:bg-[#2563EB]/20 transition-colors whitespace-nowrap">
                    <Truck className="w-2.5 h-2.5" /> Delivered
                  </button>
                )}
                {order.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editOrder && (
          <OrderEditModal
            order={editOrder}
            onClose={() => setEditOrder(null)}
            onSave={async () => { setEditOrder(null); await refreshOrders(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}