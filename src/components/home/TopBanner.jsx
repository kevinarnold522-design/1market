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
    <div className="relative" style={{ background: 'linear-gradient(180deg, #001060 0%, #0033CC 40%, #001a80 100%)', borderBottom: '1px solid rgba(0,212,255,0.15)', paddingTop: 108 }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-2">
        {/* Horizontal compact layout */}
        <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <img src="https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/e75a169ec_59E45701-6C10-4FA1-9279-AED5F6B2A6DE.jpg"
              alt="1Market PH" className="w-6 h-6 rounded-md object-cover" />
            <p className="font-heading font-bold text-white text-xs tracking-tight">
              1Market<span style={{ color: '#FFD700' }}>PH</span><span className="text-white/40">.com</span>
            </p>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-white/10" />
          
          {/* Links - Horizontal */}
          <div className="flex items-center gap-2">
            <Link to="/about" className="font-body text-[9px] text-[#00D4FF]/80 hover:text-[#00D4FF] transition-colors font-semibold">About Us</Link>
            <div className="w-px h-3 bg-white/10" />
            <Link to="/privacy-policy" className="font-body text-[9px] text-white/40 hover:text-[#00D4FF] transition-colors">Privacy</Link>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-white/10" />
          
          {/* Socials - Horizontal with @1MarketPH below */}
          <div className="flex items-center gap-1.5">
            <a href="https://www.facebook.com/share/18Neew76Yo/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center px-1.5 py-0.5 rounded-sm font-body text-[9px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center gap-1"><Facebook className="w-2.5 h-2.5" /><span>FB</span></div>
              <span className="text-[8px] text-blue-300/60 mt-0.5">@1MarketPH</span>
            </a>
            <a href="https://instagram.com/1marketph" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center px-1.5 py-0.5 rounded-sm font-body text-[9px] font-bold text-pink-400 hover:text-pink-300 transition-colors"
              style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <div className="flex items-center gap-1"><Instagram className="w-2.5 h-2.5" /><span>IG</span></div>
              <span className="text-[8px] text-pink-300/60 mt-0.5">@1MarketPH</span>
            </a>
            <a href="https://tiktok.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center px-1.5 py-0.5 rounded-sm font-body text-[9px] font-bold text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span>TikTok</span>
              <span className="text-[8px] text-white/40 mt-0.5">@1MarketPH</span>
            </a>
            <a href="https://youtube.com/@1marketph" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm font-body text-[9px] font-bold text-red-400 hover:text-red-300 transition-colors"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Youtube className="w-2.5 h-2.5" /> YT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}