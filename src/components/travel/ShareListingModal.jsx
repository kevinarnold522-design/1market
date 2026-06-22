import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

export default function ShareListingModal({ listing, onClose }) {
  const [copied, setCopied] = useState(false);

  const url = listing?.link
    ? listing.link
    : `${window.location.origin}/travel?item=${listing?.id || ''}`;

  const title = listing?.name || listing?.title || listing?.route || 'Travel Listing';
  const text = `Check out: ${title} — ${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = [
    {
      label: 'Facebook',
      icon: '',
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'WhatsApp',
      icon: '',
      color: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(text)}`,
    },
    {
      label: 'Telegram',
      icon: '',
      color: '#2AABEE',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#070F1A]/85 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <p className="font-heading font-bold text-white text-sm">Share Listing</p>
            <p className="font-body text-[10px] text-white/40 mt-0.5 line-clamp-1">{title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Social share buttons */}
          <div className="grid grid-cols-3 gap-3">
            {shareLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl font-body text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
                <span className="text-xl">{s.icon}</span>
                <span style={{ color: s.color }}>{s.label}</span>
              </a>
            ))}
          </div>
          {/* Copy link */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white/50 truncate">
              {url}
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105"
              style={{ background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(0,212,255,0.15)', border: copied ? '1px solid #22c55e' : '1px solid rgba(0,212,255,0.3)' }}>
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#00D4FF]" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}