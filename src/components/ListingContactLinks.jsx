import React, { useState } from 'react';
import { Phone, Mail, Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';

const BLOCKED_REDIRECT_PATTERN = /<\s*script\b|<\s*meta\b|<\s*iframe\b|javascript:|data:|vbscript:|adsbygoogle|googlesyndication|doubleclick|adservice|adsterra|propellerads|popads|taboola|outbrain|window\.location|location\.href|http-equiv\s*=\s*["']?refresh/i;

const toSafeHttpUrl = (value, prefix = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (BLOCKED_REDIRECT_PATTERN.test(raw)) return '';
  const normalized = /^https?:\/\//i.test(raw) ? raw : `${prefix}${raw.replace(/^@/, '')}`;
  try {
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    if (BLOCKED_REDIRECT_PATTERN.test(parsed.href)) return '';
    return parsed.href;
  } catch {
    return '';
  }
};

const cleanUrl = (value, prefix) => {
  return toSafeHttpUrl(value, prefix);
};

const whatsappUrl = (value, phone) => {
  const raw = String(value || phone || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return toSafeHttpUrl(raw);
  if (BLOCKED_REDIRECT_PATTERN.test(raw)) return '';
  const digits = raw.replace(/[^0-9]/g, '');
  return digits ? toSafeHttpUrl(`https://wa.me/${digits}`) : '';
};

function ContactButton({ available, href, onClick, icon: Icon, label, activeLabel, color = '#00D4FF' }) {
  const content = (
    <>
      <Icon className="w-3.5 h-3.5" />
      <span className="truncate">{activeLabel || label}</span>
    </>
  );

  const className = `flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg font-body text-[11px] font-bold border transition-all min-w-0 ${available ? 'hover:scale-105' : 'cursor-not-allowed opacity-45 grayscale'}`;
  const style = available
    ? { background: `${color}22`, borderColor: `${color}66`, color }
    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' };

  if (!available) return <div className={className} style={style}>{content}</div>;
  if (onClick) return <button type="button" onClick={onClick} className={className} style={style}>{content}</button>;
  return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={className} style={style}>{content}</a>;
}

export default function ListingContactLinks({ listing = {}, sellerUser = null, compact = false }) {
  const [showPhone, setShowPhone] = useState(false);
  const phone = listing.phone || sellerUser?.phone || '';
  const email = listing.email_contact || sellerUser?.email || '';
  const facebook = cleanUrl(listing.social_facebook || sellerUser?.social_facebook, 'https://facebook.com/');
  const instagram = cleanUrl(listing.social_instagram || sellerUser?.social_instagram, 'https://instagram.com/');
  const whatsapp = whatsappUrl(listing.social_whatsapp || sellerUser?.social_whatsapp, phone);
  const customSite = cleanUrl(listing.custom_site_url, 'https://');
  const customSiteLabel = listing.custom_site_name || (listing.alternate_site_options || [])[0] || 'Website';

  return (
    <div className={compact ? 'grid grid-cols-5 gap-1.5' : 'p-3 rounded-xl'} style={compact ? undefined : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {!compact && <p className="font-body text-[9px] text-white/30 uppercase tracking-wider mb-2">Contact Lister</p>}
      <div className={compact ? 'contents' : 'grid grid-cols-2 sm:grid-cols-3 gap-2'}>
        <ContactButton available={!!phone} onClick={() => setShowPhone(true)} icon={Phone} label="Phone" activeLabel={showPhone && phone ? phone : ''} color="#60cfff" />
        <ContactButton available={!!email} href={`mailto:${email}`} icon={Mail} label="Email" color="#fbbf24" />
        <ContactButton available={!!whatsapp} href={whatsapp} icon={MessageCircle} label="WhatsApp" color="#4ade80" />
        <ContactButton available={!!facebook} href={facebook} icon={Facebook} label="Facebook" color="#60a5fa" />
        <ContactButton available={!!instagram} href={instagram} icon={Instagram} label="Instagram" color="#f472b6" />
        <ContactButton available={!!customSite} href={customSite} icon={Globe} label={customSiteLabel} color="#c084fc" />
      </div>
    </div>
  );
}