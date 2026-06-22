import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Printer, ShoppingBag, MapPin, Phone, Mail, Package } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ReceiptModal({ listing, user, onClose }) {
  const [qty, setQty] = useState(1);
  const [buyerName, setBuyerName] = useState(user?.full_name || '');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const receiptRef = useRef(null);

  const unitPrice = listing.price || 0;
  const total = unitPrice * qty;
  const maxQty = listing.quantity || 999;

  const handleOrder = async () => {
    if (!buyerName.trim() || !buyerEmail.trim()) return;
    setPlacing(true);
    const created = await base44.entities.Order.create({
      listing_id: listing.id,
      listing_title: listing.title,
      listing_image: listing.image_url,
      price_label: listing.price_label || `₱${Number(unitPrice).toLocaleString()}`,
      price: total,
      buyer_email: buyerEmail.trim(),
      buyer_name: buyerName.trim(),
      seller_email: listing.email_contact || '',
      seller_name: listing.seller_name || '',
      notes: `Qty: ${qty}${notes ? ' | ' + notes : ''}`,
      status: 'pending',
    });
    setOrder(created);
    setPlacing(false);
    setPlaced(true);
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Receipt - ${listing.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; max-width: 480px; margin: auto; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .row.total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; border-bottom: none; margin-top: 8px; }
        .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
        .logo { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
        .footer { margin-top: 24px; text-align: center; color: #999; font-size: 11px; }
      </style></head><body>
      <div class="logo">1Market<span style="color:#2563EB">PH</span>.com</div>
      <h1>${listing.title}</h1>
      <div class="meta">Order Receipt · ${new Date().toLocaleString('en-PH')}</div>
      ${order?.id ? `<div class="meta">Order ID: ${order.id}</div>` : ''}
      <div class="row"><span>Buyer</span><span>${buyerName}</span></div>
      <div class="row"><span>Email</span><span>${buyerEmail}</span></div>
      ${buyerPhone ? `<div class="row"><span>Phone</span><span>${buyerPhone}</span></div>` : ''}
      <div class="row"><span>Seller</span><span>${listing.seller_name || '—'}</span></div>
      <div class="row"><span>Location</span><span>${listing.area ? listing.area + ', ' : ''}${listing.location}</span></div>
      <div class="row"><span>Unit Price</span><span>${listing.price_label || '₱' + Number(unitPrice).toLocaleString()}</span></div>
      <div class="row"><span>Quantity</span><span>${qty}</span></div>
      ${notes ? `<div class="row"><span>Notes</span><span>${notes}</span></div>` : ''}
      <div class="row total"><span>TOTAL</span><span>₱${Number(total).toLocaleString()}</span></div>
      <div style="margin-top:16px"><span class="badge">Status: Pending Confirmation</span></div>
      <div class="footer">Thank you for ordering on 1MarketPH.com!<br/>Contact seller directly to confirm payment & delivery.</div>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#00D4FF]" />
            <span className="font-heading font-bold text-white">{placed ? 'Order Receipt' : 'Place Order'}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5" ref={receiptRef}>
          {/* Listing summary */}
          <div className="flex gap-3 mb-5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {listing.image_url && (
              <img src={listing.image_url} alt={listing.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-body font-bold text-sm text-white truncate">{listing.title}</p>
              <p className="font-body text-xs text-white/40 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {listing.area ? `${listing.area}, ` : ''}{listing.location}
              </p>
              {listing.seller_name && <p className="font-body text-[10px] text-[#00D4FF] mt-0.5">Seller: {listing.seller_name}</p>}
            </div>
          </div>

          {!placed ? (
            <div className="space-y-4">
              {/* Buyer info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Your Name *</label>
                  <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Phone</label>
                  <input value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="+63..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div className="col-span-2">
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Email *</label>
                  <input value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="youremail@mail.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
              </div>

              {/* Quantity */}
              {listing.quantity !== 0 && (
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">
                    Quantity {listing.quantity ? `(max ${maxQty})` : ''}
                  </label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">−</button>
                    <span className="font-heading font-bold text-white text-lg w-8 text-center">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">+</button>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Notes / Special Requests</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="e.g. specific color, size, delivery instructions..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none" />
              </div>

              {/* Price summary */}
              <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-white/50">Unit Price</span>
                  <span className="font-body text-sm text-white">{listing.price_label || (unitPrice ? `₱${Number(unitPrice).toLocaleString()}` : '—')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-white/50">Quantity</span>
                  <span className="font-body text-sm text-white">× {qty}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="font-body font-bold text-sm text-white">Total</span>
                  <span className="font-heading font-bold text-lg text-[#00D4FF]">
                    {unitPrice ? `₱${Number(total).toLocaleString()}` : listing.price_label || '—'}
                  </span>
                </div>
              </div>

              <p className="font-body text-[10px] text-white/30 text-center">
                This sends a purchase request to the seller. Payment & delivery are arranged directly.
              </p>

              <button onClick={handleOrder} disabled={placing || !buyerName.trim() || !buyerEmail.trim()}
                className="w-full py-3 rounded-xl font-body font-bold text-sm text-[#0A192F] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                {placing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</> : 'Place Order & Get Receipt'}
              </button>
            </div>
          ) : (
            /* RECEIPT VIEW */
            <div className="space-y-4">
              <div className="text-center py-3">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="font-heading font-bold text-white text-lg">Order Placed!</p>
                <p className="font-body text-xs text-white/40">Seller will contact you to confirm.</p>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Receipt header */}
                <div className="px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)' }}>
                  <p className="font-heading font-bold text-white text-sm">1Market<span style={{ color: '#FFD700' }}>PH</span>.com</p>
                  <p className="font-body text-[10px] text-white/40 mt-0.5">Official Order Receipt</p>
                  <p className="font-body text-[10px] text-white/30">{new Date().toLocaleString('en-PH')}</p>
                  {order?.id && <p className="font-body text-[9px] text-[#00D4FF]/60 mt-0.5">Order ID: {order.id.slice(-8).toUpperCase()}</p>}
                </div>

                {/* Receipt rows */}
                <div className="divide-y divide-white/8">
                  {[
                    { label: 'Buyer', value: buyerName, icon: null },
                    { label: 'Email', value: buyerEmail, icon: null },
                    ...(buyerPhone ? [{ label: 'Phone', value: buyerPhone }] : []),
                    { label: 'Seller', value: listing.seller_name || '—' },
                    { label: 'Item', value: listing.title },
                    { label: 'Qty', value: qty },
                    { label: 'Unit Price', value: listing.price_label || (unitPrice ? `₱${Number(unitPrice).toLocaleString()}` : '—') },
                    ...(notes ? [{ label: 'Notes', value: notes }] : []),
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-body text-[10px] text-white/40 uppercase tracking-wider">{row.label}</span>
                      <span className="font-body text-xs text-white text-right max-w-[60%] truncate">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0,212,255,0.08)' }}>
                    <span className="font-body font-bold text-sm text-white">TOTAL</span>
                    <span className="font-heading font-bold text-lg text-[#00D4FF]">
                      {unitPrice ? `₱${Number(total).toLocaleString()}` : listing.price_label || '—'}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="px-4 py-3 text-center" style={{ background: 'rgba(245,158,11,0.06)' }}>
                  <span className="px-3 py-1 rounded-full font-body font-bold text-[11px] text-amber-400" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    ⏳ Pending Seller Confirmation
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-body text-xs font-bold hover:bg-white/10 transition-colors">
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl font-body text-xs font-bold text-[#0A192F] transition-all"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)' }}>
                  Done
                </button>
              </div>

              <p className="font-body text-[10px] text-white/25 text-center">
                Contact seller via phone or message to arrange payment & delivery.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}