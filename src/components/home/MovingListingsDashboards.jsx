import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, X, Phone, MapPin, Shield } from 'lucide-react';

// ─── FOR RENT DATA — nationwide PH ───────────────────────────────────────────
const FOR_RENT = [
  { id: 1, title: 'Studio Unit – Malate Manila', type: 'Apartment', price: '₱8,500/mo', area: 'Malate, Manila', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', logo: '', rating: 4.7, badge: '🏙️ City View', link: 'https://www.lamudi.com.ph/manila/apartment-for-rent/', bio: 'Cozy studio unit near LRT-1. Furnished with aircon, ref, and wifi. Ideal for students and young professionals.', owner: 'Private Landlord' },
  { id: 2, title: '2BR Condo – BGC Taguig', type: 'Condominium', price: '₱28,000/mo', area: 'BGC, Taguig', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Ayala_Land_logo.svg/200px-Ayala_Land_logo.svg.png', rating: 4.9, badge: '✨ Premium', link: 'https://www.ayalaland.com.ph/', bio: 'Semi-furnished 2BR at the heart of BGC. Full amenities, gym, pool. Near major offices and malls.', owner: 'Ayala Land' },
  { id: 3, title: 'Townhouse – Bacoor Cavite', type: 'Townhouse', price: '₱12,000/mo', area: 'Bacoor, Cavite', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80', logo: '', rating: 4.5, badge: '🏡 Family', link: 'https://www.lamudi.com.ph/cavite/house-for-rent/', bio: '3-bedroom townhouse in a gated community. Pet-friendly, with parking and 24/7 security.', owner: 'Private Owner' },
  { id: 4, title: 'Commercial Space – Binondo', type: 'Commercial', price: '₱35,000/mo', area: 'Binondo, Manila', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', logo: '', rating: 4.6, badge: '🏪 Business', link: 'https://www.lamudi.com.ph/manila/commercial-for-rent/', bio: 'Ground floor retail/office space in Chinatown. High foot traffic. Ideal for restaurants or shops.', owner: 'Property Manager' },
  { id: 5, title: 'Beach House – Kawit Cavite', type: 'Beach House', price: '₱5,500/day', area: 'Kawit, Cavite', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80', logo: '', rating: 4.8, badge: '🌊 Beach', link: 'https://www.airbnb.com/s/Kawit--Cavite--Philippines', bio: 'Private beach house for rent by the day or week. Sea view, outdoor grill, and kayak access included.', owner: 'Vacation Rentals PH' },
  { id: 6, title: 'Boarding House – Sampaloc', type: 'Boarding House', price: '₱3,200/mo', area: 'Sampaloc, Manila', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', logo: '', rating: 4.3, badge: '🎓 Student', link: 'https://www.lamudi.com.ph/manila/house-for-rent/', bio: 'Budget-friendly room near UST. Meals optional. All utilities included.', owner: 'Ate Nora' },
  { id: 7, title: '1BR Unit – Dasmariñas Cavite', type: 'Apartment', price: '₱7,000/mo', area: 'Dasmariñas, Cavite', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80', logo: '', rating: 4.4, badge: '🏠 Comfy', link: 'https://www.lamudi.com.ph/cavite/apartment-for-rent/', bio: '1-bedroom furnished unit near SM Dasmariñas. Cable TV, wifi, and hot shower included.', owner: 'Condo Admin' },
  { id: 8, title: 'Office Space – Makati CBD', type: 'Office', price: '₱50,000/mo', area: 'Makati CBD', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80', logo: '', rating: 4.9, badge: '💼 Corporate', link: 'https://www.lamudi.com.ph/makati/commercial-for-rent/', bio: 'Fully serviced office space in Makati CBD. Includes receptionist, meeting rooms, and high-speed fiber.', owner: 'WeWork PH' },
  { id: 9, title: 'Villa – Cebu City', type: 'Villa', price: '₱25,000/mo', area: 'Cebu City, Cebu', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', logo: '', rating: 4.8, badge: '🏖️ Cebu', link: 'https://www.lamudi.com.ph/cebu/house-for-rent/', bio: 'Modern villa in a quiet subdivision in Cebu City. Near IT Park, malls, and hospitals.', owner: 'Cebu Property Group' },
  { id: 10, title: 'Condo – Davao City', type: 'Condominium', price: '₱9,500/mo', area: 'Davao City, Davao', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', logo: '', rating: 4.6, badge: '🌺 Davao', link: 'https://www.lamudi.com.ph/davao/apartment-for-rent/', bio: 'Studio-type condo near SM Davao. Fully furnished, 24/7 security, and swimming pool access.', owner: 'Anchor Land' },
];

// ─── SHOES & CLOTHING — with real brand logos ─────────────────────────────────
const SHOES_CLOTHING = [
  { id: 1, title: 'Nike Air Jordan 1 Retro High OG', brand: 'Nike', price: '₱7,500', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', rating: 4.9, badge: '🔥 Hot', link: 'https://www.nike.com/ph/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/200px-Logo_NIKE.svg.png', bio: 'Deadstock pair, size US 10. Chicago colorway. Original box and receipt included.', seller: 'Nike Philippines' },
  { id: 2, title: 'Adidas Ultraboost 5.0', brand: 'Adidas', price: '₱8,500', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80', rating: 4.7, badge: '✨ Boost', link: 'https://www.adidas.com.ph/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/200px-Adidas_Logo.svg.png', bio: 'Ultraboost 5.0 with Boost midsole for maximum comfort. Available in multiple colorways.', seller: 'Adidas Philippines' },
  { id: 3, title: 'Uniqlo Relaxed Fit Polo Set', brand: 'Uniqlo', price: '₱890', condition: 'Brand New', area: 'SM Malls Nationwide', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80', rating: 4.8, badge: '👔 Casual', link: 'https://www.uniqlo.com/ph/en/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/200px-UNIQLO_logo.svg.png', bio: 'Breathable cotton fabric perfect for Philippine weather. Available S-XL in 4 colors.', seller: 'Uniqlo Philippines' },
  { id: 4, title: 'Vans Old Skool Authentic', brand: 'Vans', price: '₱2,995', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80', rating: 4.6, badge: '🛹 Classic', link: 'https://www.vans.com.ph/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/200px-Vans-logo.svg.png', bio: 'All-black classic Vans. US size 8.5. Original box. Authentic direct from store.', seller: 'Vans Philippines' },
  { id: 5, title: 'H&M Linen Summer Dress', brand: 'H&M', price: '₱1,200', condition: 'Brand New', area: 'SM Malls PH', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', rating: 4.5, badge: '👗 Summer', link: 'https://www2.hm.com/en_ph/index.html', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/200px-H%26M-Logo.svg.png', bio: 'Lightweight linen dress in 4 colors. Size S-XL available. New with tags.', seller: 'H&M Philippines' },
  { id: 6, title: 'New Balance 327 White/Teal', brand: 'New Balance', price: '₱5,500', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80', rating: 4.8, badge: '🏃 Comfy', link: 'https://www.newbalance.com.ph/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/200px-New_Balance_logo.svg.png', bio: 'Trendy 327 silhouette. US 9. Retro style meets modern cushioning.', seller: 'New Balance Philippines' },
  { id: 7, title: 'Zara Basic Slim Chino', brand: 'Zara', price: '₱1,595', condition: 'Brand New', area: 'SM/Robinsons Malls', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80', rating: 4.6, badge: '👖 Slim Fit', link: 'https://www.zara.com/ph/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Zara_Logo.svg/200px-Zara_Logo.svg.png', bio: 'Slim fit chino in khaki. Size 30. Machine washable. Great for casual office wear.', seller: 'Zara Philippines' },
  { id: 8, title: 'Converse Chuck Taylor All Star', brand: 'Converse', price: '₱3,495', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&q=80', rating: 4.7, badge: '⭐ Classic', link: 'https://www.converse.com/c/chuck-taylor', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/200px-Converse_logo.svg.png', bio: 'Classic high-top in black. US 8. The most iconic sneaker of all time.', seller: 'Converse Philippines' },
  { id: 9, title: 'Penshoppe Urban Jogger Set', brand: 'Penshoppe', price: '₱1,299', condition: 'Brand New', area: 'Nationwide PH', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', rating: 4.5, badge: '🇵🇭 Pinoy', link: 'https://www.penshoppe.com/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Penshoppe_logo.svg/200px-Penshoppe_logo.svg.png', bio: 'Penshoppe is one of the Philippines\' top fashion brands. Stylish urban jogger set in 3 colors.', seller: 'Penshoppe' },
];

// ─── SERVICES — nationwide PH ─────────────────────────────────────────────────
const SERVICES_LIST = [
  { id: 1, title: 'Aircon Cleaning & Repair', provider: 'CoolAir Express', area: 'Manila & Cavite', price: '₱500–₱1,200', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', logo: '', rating: 4.8, badge: '❄️ AC Expert', link: '/services', phone: '+63 917 888 1234', bio: 'Licensed aircon technician. Cleaning, regas, install, repair. Same-day service available.' },
  { id: 2, title: 'Freelance Logo & Branding', provider: 'DesignPH Studio', area: 'Online / Nationwide', price: '₱1,500/project', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80', logo: '', rating: 4.9, badge: '🎨 Creative', link: '/services', phone: '+63 918 777 5566', bio: '5-star rated graphic designer. Logos, social media kits, menu designs. Fast 48-hr turnaround.' },
  { id: 3, title: 'Plumbing & Electrical', provider: 'FixIt Pro Manila', area: 'Metro Manila', price: '₱800/day', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80', logo: '', rating: 4.7, badge: '🔧 Trusted', link: '/services', phone: '+63 920 444 8899', bio: 'Experienced plumber & electrician. Faucet, outlets, waterproofing, rewiring. Residential only.' },
  { id: 4, title: 'Home Tutoring Math & Science', provider: 'Ms. Kristine V.', area: 'Bacoor, Cavite', price: '₱250/hour', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80', logo: '', rating: 4.9, badge: '📚 Top Tutor', link: '/services', phone: '+63 915 333 7744', bio: 'Licensed teacher. Grade 1–10 Math and Science. Weekday afternoons available.' },
  { id: 5, title: 'Car Detailing & PPF Wrap', provider: 'AutoClean Cavite', area: 'Dasmariñas, Cavite', price: '₱800–₱3,000', image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&q=80', logo: '', rating: 4.8, badge: '🚗 Auto Care', link: '/services', phone: '+63 922 111 6677', bio: 'Full interior & exterior detailing, PPF wrap, ceramic coating, tinting.' },
  { id: 6, title: 'Photography & Videography', provider: 'KlickPH Studio', area: 'Manila & Cavite', price: '₱3,500/event', image: 'https://images.unsplash.com/photo-1510127034890-ba27e05ab558?w=400&q=80', logo: '', rating: 4.9, badge: '📸 Pro Shots', link: '/services', phone: '+63 919 222 3344', bio: 'Events, product photography, social media content. Drone shots available.' },
  { id: 7, title: 'Massage & Home Spa', provider: 'RelaxPH', area: 'Metro Manila', price: '₱500/hour', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80', logo: '', rating: 4.8, badge: '💆 Wellness', link: '/services', phone: '+63 916 555 9900', bio: 'Licensed therapists for home service. Swedish, shiatsu, prenatal. Available 8AM–10PM.' },
  { id: 8, title: 'House Cleaning Service', provider: 'CleanHome PH', area: 'Manila & Bacoor', price: '₱600/session', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', logo: '', rating: 4.7, badge: '🧹 Sparkling', link: '/services', phone: '+63 923 888 4455', bio: 'Trusted house cleaning team. Deep clean, regular maintenance, move-in/out cleaning.' },
];

// ─── LIGHTNING CARD ANIMATION ────────────────────────────────────────────────

function LightningCard({ item, type, onAbout, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 flex-shrink-0 cursor-pointer relative"
      style={{
        width: '220px',
        boxShadow: hovered
          ? '0 0 0 2px #00D4FF, 0 8px 32px rgba(0,212,255,0.25), 0 20px 40px rgba(10,25,47,0.15)'
          : '0 2px 12px rgba(10,25,47,0.07)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {/* Lightning shimmer on hover */}
      {hovered && (
        <motion.div
          initial={{ x: '-100%', skewX: -15 }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.35), rgba(255,255,255,0.2), transparent)', width: '60%' }}
        />
      )}

      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/50 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-[#0A192F] px-2 py-0.5 rounded-full text-[9px] font-bold">{item.badge}</span>
        </div>
        {/* ⭐ Recommended badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full text-[8px] font-bold">⭐ Rec</span>
        </div>
        {item.logo && (
          <div className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center p-1">
            <img src={item.logo} alt="" className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-heading font-bold text-xs text-[#0A192F] leading-tight mb-0.5 line-clamp-2">{item.title}</h3>
        <p className="font-body text-[9px] text-[#2563EB] font-semibold mb-1">{item.area}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="font-body text-[9px] text-[#0A192F]/60">{item.rating}</span>
        </div>
        <p className="font-heading font-bold text-sm text-[#0A192F] mb-2">{item.price}</p>
        <div className="flex gap-1">
          <button onClick={() => onAbout(item)} className="flex-1 py-1 rounded-lg bg-[#F8FAFC] border border-[#0A192F]/8 text-[9px] font-semibold text-[#0A192F]/60 hover:bg-[#0A192F] hover:text-white transition-all">ℹ️ About</button>
          <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
            className="flex-1 py-1 rounded-lg bg-[#00D4FF] hover:bg-[#0A192F] text-[#0A192F] hover:text-white text-[9px] font-semibold flex items-center justify-center gap-0.5 transition-colors">
            View <ExternalLink className="w-2 h-2" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── UNVERIFIED NOTICE MODAL ─────────────────────────────────────────────────

function AboutModal({ item, onClose }) {
  const [showNotice, setShowNotice] = useState(true);
  if (!item) return null;

  const handleProceed = () => {
    setShowNotice(false);
    window.open(item.link.startsWith('http') ? item.link : `https://${item.link}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-32 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-3 left-3">
            <p className="font-heading font-bold text-white text-sm leading-tight">{item.title}</p>
            <p className="font-body text-[9px] text-[#00D4FF]">{item.type || item.brand || item.provider} · {item.area}</p>
          </div>
          {item.logo && (
            <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center p-1">
              <img src={item.logo} alt="" className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>
        <div className="p-4 space-y-3">
          {/* Unverified notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-bold text-[10px] text-amber-800 mb-0.5">Community Recommendation</p>
                <p className="font-body text-[9px] text-amber-700 leading-relaxed">
                  This listing is <strong>not a verified 1Marketph.com partner</strong>. It appears based on community ratings and preferences from Google, Facebook, and other platforms.
                </p>
              </div>
            </div>
          </div>
          {/* Recommended badge */}
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-50 border border-amber-200 text-amber-700">⭐ Highly Recommended</span>
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="font-body text-[9px] font-semibold text-[#0A192F]">{item.rating} avg rating</span>
          </div>
          <p className="font-body text-sm text-[#0A192F]/60 leading-relaxed">{item.bio}</p>
          {item.area && (
            <div className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
              <span className="font-body text-xs text-[#0A192F]/60">{item.area}</span>
            </div>
          )}
          <div className="flex gap-2">
            {item.link.startsWith('http') ? (
              <button onClick={handleProceed}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold transition-colors">
                <ExternalLink className="w-3 h-3" /> Visit Official Site
              </button>
            ) : (
              <a href={item.link}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold transition-colors">
                <ExternalLink className="w-3 h-3" /> View Listing
              </a>
            )}
            {item.phone && (
              <a href={`tel:${item.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
                <Phone className="w-3 h-3" /> Call
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── LIGHTNING SCROLLING SECTION ──────────────────────────────────────────────

function ScrollingDashboard({ title, subtitle, emoji, items, type, bgClass }) {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [aboutItem, setAboutItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [scrollDir, setScrollDir] = useState(1);

  const filters = type === 'shoes' ? ['All', 'Shoes', 'Clothing', 'Pinoy'] : ['All'];

  const filtered = activeFilter === 'Shoes'
    ? items.filter(i => i.brand && ['Nike', 'Adidas', 'Vans', 'New Balance', 'Converse'].includes(i.brand))
    : activeFilter === 'Clothing'
      ? items.filter(i => i.brand && ['Uniqlo', 'H&M', 'Zara'].includes(i.brand))
      : activeFilter === 'Pinoy'
        ? items.filter(i => i.brand && ['Penshoppe'].includes(i.brand))
        : items;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let dir = 1;
    const t = setInterval(() => {
      if (!el || isPaused) return;
      el.scrollLeft += dir * 0.8;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) dir = -1;
      if (el.scrollLeft <= 10) dir = 1;
      setScrollDir(dir);
    }, 25);
    return () => clearInterval(t);
  }, [isPaused]);

  return (
    <>
      <section className={`py-10 overflow-hidden ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{emoji}</span>
                <span className="font-body text-xs font-bold text-[#2563EB] uppercase tracking-wider">{title}</span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5], color: ['#00D4FF', '#2563EB', '#00D4FF'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)' }}
                >
                  ⭐ Highly Recommended
                </motion.span>
              </div>
              <p className="font-body text-xs text-[#0A192F]/40">{subtitle}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-full font-body text-xs font-semibold transition-all ${activeFilter === f ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/50 hover:border-[#0A192F]/20'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Lightning direction indicator */}
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ x: scrollDir > 0 ? [0, 6, 0] : [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[#00D4FF] text-sm"
            >
              {scrollDir > 0 ? '⚡→' : '←⚡'}
            </motion.div>
            <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <motion.div
                animate={{ x: scrollDir > 0 ? ['-100%', '100%'] : ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="h-full w-1/3 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)' }}
              />
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
          >
            {filtered.map((item, i) => (
              <LightningCard key={item.id} item={item} type={type} onAbout={setAboutItem} index={i} />
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {aboutItem && <AboutModal item={aboutItem} onClose={() => setAboutItem(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── EXPORTS ─────────────────────────────────────────────────────────────────

export function RentDashboard() {
  return <ScrollingDashboard title="For Rent" subtitle="Apartments, condos, villas & commercial spaces across the Philippines" emoji="🏠" items={FOR_RENT} type="rent" bgClass="bg-white" />;
}

export function ShoesClothingDashboard() {
  return <ScrollingDashboard title="Shoes & Clothing" subtitle="Authentic brands with verified store links — shipped nationwide" emoji="👟" items={SHOES_CLOTHING} type="shoes" bgClass="bg-[#F8FAFC]" />;
}

export function ServicesDashboard() {
  return <ScrollingDashboard title="Local Services" subtitle="Trusted providers for repairs, cleaning, tutoring & more nationwide" emoji="🔧" items={SERVICES_LIST} type="services" bgClass="bg-white" />;
}