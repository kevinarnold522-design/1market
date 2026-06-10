import React from 'react';
import { Facebook, Instagram, Youtube, Lock, CheckCircle, Zap, MessageCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const TRUST_BADGES = [
  { icon: Lock, label: 'SSL Secured', color: '#00D4FF' },
  { icon: Globe, label: 'Made in PH', color: '#10b981' },
  { icon: CheckCircle, label: 'DPA 2012 Compliant', color: '#a855f7' },
  { icon: Zap, label: 'Fast & Reliable', color: '#f59e0b' },
  { icon: MessageCircle, label: '24/7 Support', color: '#60a5fa' },
];

export default function TopBanner() {
  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #001060 0%, #0033CC 40%, #001a80 100%)' }}>
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #00D4FF40, #2563EB60, #00D4FF40, transparent)' }} />

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-heading font-bold text-[8rem] sm:text-[12rem] lg:text-[16rem] whitespace-nowrap"
          style={{ color: 'rgba(0,212,255,0.025)' }}>
          1MarketPH
        </span>
      </div>

      {/* Decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: i % 2 === 0 ? '#00D4FF' : '#2563EB',
              opacity: 0.3,
              animationDelay: `${i * 0.4}s`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Social bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
              alt="1Market PH" className="w-12 h-12 rounded-2xl object-cover shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3)' }} />
            <div>
              <p className="font-heading font-bold text-white text-xl tracking-tight">
                1Market<span style={{ color: '#FFD700' }}>PH</span><span className="text-white/40">.com</span>
              </p>
              <p className="font-body text-[10px] text-white/35">Philippines' Premier Marketplace</p>
            </div>
          </div>
          {/* Socials */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="https://www.facebook.com/share/18Neew76Yo/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-xs font-bold text-blue-400 transition-all hover:scale-105"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Facebook className="w-4 h-4" /> Facebook
            </a>
            <a href="https://instagram.com/1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-xs font-bold text-pink-400 transition-all hover:scale-105"
              style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}>
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <a href="https://tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-xs font-bold text-white/80 transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}>
              TikTok
            </a>
            <a href="https://youtube.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-body text-xs font-bold text-red-400 transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <Youtube className="w-4 h-4" /> YouTube
            </a>
          </div>
        </div>

        {/* Links grid — 3 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-8">
          {/* About 1MarketPH */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-white/50">About 1MarketPH</h4>
            <div className="space-y-2.5">
              <p className="font-body text-sm text-white/40">Founded by Kevin W. Roberto</p>
              <p className="font-body text-sm text-white/40">Manila, Philippines</p>
              <p className="font-body text-xs text-white/30 leading-relaxed">Born from a vision to bridge the gap between Filipino consumers and businesses that power our communities.</p>
              <Link to="/about" className="block font-body text-xs text-[#00D4FF]/60 hover:text-[#00D4FF] transition-colors">Read Our Story</Link>
              <Link to="/privacy-policy" className="block font-body text-xs text-white/25 hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-white/50">Marketplace</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Buy & Sell', href: '/buysell' },
                { label: 'Food', href: '/food' },
                { label: 'Travel', href: '/travel' },
                { label: 'For Rent', href: '/rent' },
              ].map(l => (
                <Link key={l.label} to={l.href} className="block font-body text-sm text-white/40 hover:text-[#00D4FF] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-white/50">Services</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Jobs', href: '/jobs' },
                { label: 'Explore', href: '/explore' },
              ].map(l => (
                <Link key={l.label} to={l.href} className="block font-body text-sm text-white/40 hover:text-[#00D4FF] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Tagline banner */}
        <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.2),rgba(0,212,255,0.08))', border: '1px solid rgba(0,212,255,0.12)' }}>
          <p className="font-heading font-bold text-white text-base sm:text-lg mb-1">
            Connecting Filipinos to <span style={{ color: '#FFD700' }}>Products</span>, <span style={{ color: '#00D4FF' }}>Services</span> & <span style={{ color: '#a855f7' }}>Opportunities</span>
          </p>
          <p className="font-body text-xs text-white/35">Proudly Made in the Philippines — Since 2026</p>
        </div>
      </div>
    </div>
  );
}