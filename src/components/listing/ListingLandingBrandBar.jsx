import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import TikTokIcon from '@/components/icons/TikTokIcon';
import { MARKETPH_LOGO } from '@/lib/brandAssets';

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/share/18Neew76Yo/?mibextid=wwXIfr', Icon: Facebook, color: '#93c5fd' },
  { label: 'Instagram', href: 'https://instagram.com/1marketph', Icon: Instagram, color: '#f9a8d4' },
  { label: 'TikTok', href: 'https://tiktok.com/@1marketph', Icon: TikTokIcon, color: '#ffffff' },
  { label: 'YouTube', href: 'https://youtube.com/@1marketph', Icon: Youtube, color: '#fca5a5' },
];

export default function ListingLandingBrandBar({ compact = false }) {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-4" style={{ background: 'linear-gradient(135deg,#0033CC 0%,#2563EB 52%,#0033CC 100%)', borderTop: '1px solid rgba(255,255,255,0.16)', borderBottom: '1px solid rgba(255,255,255,0.16)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(22px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 18px 48px rgba(0,51,204,0.24)' }}>
        <div className="flex items-center gap-3">
          <img src={MARKETPH_LOGO} alt="1Market PH" className="w-12 h-12 rounded-2xl object-cover shadow-xl" />
          <div>
            <p className="font-heading font-extrabold text-white text-xl tracking-tight">1Market <span className="text-[#FFD700]">PH</span></p>
            <p className="font-heading font-bold text-white/90 text-sm">1MarketPH.com</p>
            {!compact && <p className="font-body text-xs text-white/65 mt-0.5">Philippines' Premier Marketplace</p>}
          </div>
        </div>
        <div className="md:text-right">
          {!compact && <p className="font-body text-xs text-white/70 mb-3">Follow us and stay connected with the latest deals and listings!</p>}
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map(({ label, href, Icon, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-body text-xs font-bold text-white transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} /> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}