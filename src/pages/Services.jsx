import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Phone, MessageSquare, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';

const SUBCATEGORIES = [
  { key: 'all', label: 'All Services', icon: '⚡', desc: 'Browse everything' },
  { key: 'home', label: 'Home Services', icon: '🏠', desc: 'Cleaning, repairs, plumbing' },
  { key: 'tech', label: 'Tech & Digital', icon: '💻', desc: 'IT, web, design, repair' },
  { key: 'beauty', label: 'Beauty & Wellness', icon: '💅', desc: 'Salon, spa, massage, nails' },
  { key: 'events', label: 'Events & Catering', icon: '🎉', desc: 'Planning, catering, DJ' },
  { key: 'professional', label: 'Professional', icon: '📋', desc: 'Legal, financial, HR' },
  { key: 'transport', label: 'Transport & Delivery', icon: '🚚', desc: 'Movers, courier, trucking' },
  { key: 'health', label: 'Health & Medical', icon: '⚕️', desc: 'Dental, therapy, caregiving' },
];

const services = [
  // HOME SERVICES
  { id: 1, type: 'home', title: 'Aircon Cleaning & Regas', provider: 'Ernie AC Services', rate: '₱600–₱1,500/unit', location: 'Both', area: 'Manila & Cavite', stars: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', desc: 'Licensed technician. Cleaning, regas, and general repair. Same-day available.', contact: '09171234500' },
  { id: 2, type: 'home', title: 'Plumbing & Electrical Works', provider: 'Kuya Romy Trades', rate: '₱800/day', location: 'Manila', area: 'Tondo, Manila', stars: 4.7, reviews: 54, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80', desc: 'Residential repairs: faucets, outlets, rewiring. Available weekdays.', contact: '09185559999' },
  { id: 3, type: 'home', title: 'House Cleaning Service', provider: 'CleanUp Crew Manila', rate: '₱1,200–₱2,500/session', location: 'Manila', area: 'Metro Manila', stars: 4.8, reviews: 211, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', desc: 'Deep clean, regular cleaning, move-in/move-out. Full team available.', contact: '09209876543' },
  { id: 4, type: 'home', title: 'Pest Control Services', provider: 'EradiPest PH', rate: '₱1,500–₱3,500', location: 'Both', area: 'Manila & Cavite', stars: 4.6, reviews: 76, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80', desc: 'Cockroaches, termites, rodents. With warranty. Licensed operators.', contact: '09178889977' },
  { id: 5, type: 'home', title: 'Carpentry & Woodworks', provider: 'Mang Carding Carpentry', rate: '₱1,000/day', location: 'Cavite', area: 'Imus, Cavite', stars: 4.5, reviews: 33, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80', desc: 'Furniture repair, custom cabinets, partitions. Free quotation.', contact: '09301234567' },
  { id: 6, type: 'home', title: 'Interior Design & Renovation', provider: 'Studio 1 Design PH', rate: '₱5,000/room', location: 'Manila', area: 'BGC / Makati', stars: 4.9, reviews: 45, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80', desc: 'Full renovation, space planning, 3D rendering before construction.', contact: '09214455667' },
  { id: 7, type: 'home', title: 'Moving & Packing Services', provider: 'SwiftMove Cavite', rate: '₱2,500–₱6,000/move', location: 'Both', area: 'Manila & Cavite', stars: 4.7, reviews: 89, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80', desc: 'Residential & office moves. Packing materials included. Truck provided.', contact: '09161112200' },

  // TECH & DIGITAL
  { id: 8, type: 'tech', title: 'Freelance Web Developer', provider: 'John Paulo Dev', rate: '₱5,000–₱25,000/project', location: 'Both', area: 'Remote / Metro Manila', stars: 4.8, reviews: 62, image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80', desc: 'React, WordPress, landing pages. Fast turnaround. Portfolio available.', contact: '09177778888' },
  { id: 9, type: 'tech', title: 'Graphic Design Services', provider: 'Marni Designs', rate: '₱500–₱2,500/design', location: 'Both', area: 'Remote', stars: 4.9, reviews: 143, image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80', desc: 'Logos, social media posts, tarpaulin, menus. Same-day rush accepted.', contact: '09198886543' },
  { id: 10, type: 'tech', title: 'Computer & Laptop Repair', provider: 'TechFix Bacoor', rate: '₱300–₱1,500/repair', location: 'Cavite', area: 'Bacoor, Cavite', stars: 4.6, reviews: 97, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', desc: 'Hardware repair, virus removal, OS installation, data recovery.', contact: '09154321009' },
  { id: 11, type: 'tech', title: 'Social Media Management', provider: 'DigitalPH Agency', rate: '₱4,500/mo', location: 'Both', area: 'Remote / Nationwide', stars: 4.7, reviews: 38, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80', desc: 'Facebook, Instagram, TikTok management. Content creation + scheduling.', contact: '09209001122' },
  { id: 12, type: 'tech', title: 'CCTV Installation', provider: 'SafeCam Philippines', rate: '₱3,500–₱15,000', location: 'Both', area: 'Manila & Cavite', stars: 4.8, reviews: 56, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80', desc: '2–16 camera systems. Indoor/outdoor. Remote viewing setup.', contact: '09175543210' },

  // BEAUTY & WELLNESS
  { id: 13, type: 'beauty', title: 'Home Service Massage', provider: 'RelaxPH Massage', rate: '₱600–₱1,200/hr', location: 'Both', area: 'Metro Manila & Cavite', stars: 4.9, reviews: 302, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80', desc: 'Swedish, shiatsu, foot spa. Licensed therapists. 1-hour minimum.', contact: '09181234321' },
  { id: 14, type: 'beauty', title: 'Home Service Nails', provider: 'Glam Nails Manila', rate: '₱350–₱800/session', location: 'Manila', area: 'Metro Manila', stars: 4.8, reviews: 178, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80', desc: 'Manicure, pedicure, nail art. Tools sanitized. Home visits available.', contact: '09164563210' },
  { id: 15, type: 'beauty', title: 'Wedding Makeup Artist', provider: 'Glow & Go Bridal', rate: '₱3,500–₱12,000', location: 'Both', area: 'Manila & Cavite', stars: 5.0, reviews: 67, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', desc: 'Airbrush & HD makeup. Bridal package includes trial & entourage.', contact: '09221112233' },
  { id: 16, type: 'beauty', title: 'Home Service Haircut', provider: 'Kuya Barber Home Service', rate: '₱200–₱400/person', location: 'Cavite', area: 'Bacoor & Imus', stars: 4.7, reviews: 44, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80', desc: 'Haircut, fade, shave. Tools sanitized. Available evenings & weekends.', contact: '09307778899' },

  // EVENTS
  { id: 17, type: 'events', title: 'Event Planning & Coordination', provider: 'Perfect Day Events', rate: '₱8,000–₱50,000', location: 'Both', area: 'Metro Manila & Cavite', stars: 4.9, reviews: 93, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80', desc: 'Weddings, birthdays, debuts, corporate. Full coordination package.', contact: '09171234999' },
  { id: 18, type: 'events', title: 'Catering Services – Filipino Menu', provider: 'Luto ni Tita Catering', rate: '₱250–₱450/pax', location: 'Cavite', area: 'Dasmariñas & Imus', stars: 4.8, reviews: 121, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&q=80', desc: 'Buffet or packed meals. Lechon available. Min 50 pax.', contact: '09281110012' },
  { id: 19, type: 'events', title: 'DJ Services – Events & Parties', provider: 'DJ MarcoPH', rate: '₱4,500–₱12,000/event', location: 'Both', area: 'Manila & Cavite', stars: 4.7, reviews: 55, image: 'https://images.unsplash.com/photo-1571151424566-891bd284dcc1?w=500&q=80', desc: 'Birthday, corporate, debut, wedding receptions. With sound system.', contact: '09194445566' },
  { id: 20, type: 'events', title: 'Photography & Videography', provider: 'SnapShot Studios PH', rate: '₱6,000–₱25,000', location: 'Both', area: 'Manila & Cavite', stars: 4.9, reviews: 186, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', desc: 'Weddings, events, portraits. Same-day highlights available. Portfolio on request.', contact: '09206667788' },

  // PROFESSIONAL
  { id: 21, type: 'professional', title: 'Accounting & Bookkeeping', provider: 'NumericsPH Accounting', rate: '₱3,000–₱8,000/mo', location: 'Both', area: 'Remote / Manila', stars: 4.8, reviews: 39, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&q=80', desc: 'BIR compliance, payroll, financial statements. CPA-supervised.', contact: '09218899112' },
  { id: 22, type: 'professional', title: 'Tutorial Services – Math & Science', provider: 'Ms. Kristine V.', rate: '₱300/hr', location: 'Cavite', area: 'Bacoor, Cavite', stars: 4.7, reviews: 28, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80', desc: 'Grade 1–10. Home visit or online. Available weekday afternoons.', contact: '09154321876' },
  { id: 23, type: 'professional', title: 'Notary Public Services', provider: 'Atty. Reyes Law Office', rate: '₱200–₱800/document', location: 'Manila', area: 'Pasig, Manila', stars: 4.6, reviews: 18, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80', desc: 'Contracts, affidavits, deeds. Same-day notarization available.', contact: '09171119900' },

  // TRANSPORT
  { id: 24, type: 'transport', title: 'Trucking & Cargo Services', provider: 'BagoBag Trucking', rate: '₱1,800–₱5,000/trip', location: 'Both', area: 'Metro Manila & Cavite', stars: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80', desc: '10-wheeler, 6-wheeler, and closed van. Point-to-point delivery.', contact: '09305554433' },
  { id: 25, type: 'transport', title: 'Courier & Same-Day Delivery', provider: 'SpeedDrop Courier', rate: '₱80–₱200/delivery', location: 'Manila', area: 'Metro Manila', stars: 4.8, reviews: 214, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80', desc: 'Documents, packages, food. 2-hour delivery time. With tracking.', contact: '09197775566' },

  // HEALTH
  { id: 26, type: 'health', title: 'Home Care / Caregiver Services', provider: 'CareLink PH', rate: '₱600–₱900/day', location: 'Both', area: 'Manila & Cavite', stars: 4.8, reviews: 47, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80', desc: 'Elderly care, post-op care, PWD assistance. Background-checked caregivers.', contact: '09164323400' },
  { id: 27, type: 'health', title: 'Home Service Dental Check-up', provider: 'Dr. Santos DDS', rate: '₱500–₱3,000/procedure', location: 'Cavite', area: 'Imus & Bacoor', stars: 4.9, reviews: 33, image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80', desc: 'Cleaning, extraction, fluoride. Mobile dental service. By appointment.', contact: '09221115566' },
];

function ServiceCard({ svc, onContact }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0A192F]/5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${svc.location === 'Manila' ? 'bg-blue-100 text-blue-700' : svc.location === 'Cavite' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
            📍 {svc.area}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-body text-[10px] font-bold text-[#0A192F]">{svc.stars} ({svc.reviews})</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-sm text-[#0A192F] leading-tight mb-0.5">{svc.title}</h3>
        <p className="font-body text-xs text-[#2563EB] font-semibold mb-1">{svc.provider}</p>
        <p className="font-body text-xs text-[#0A192F]/50 mb-3 line-clamp-2">{svc.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm text-[#0A192F]">{svc.rate}</span>
          <button onClick={() => onContact(svc)} className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-lg font-body text-xs font-semibold transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ContactModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-24 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 to-transparent" />
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✕</button>
          <p className="absolute bottom-2 left-4 font-heading font-bold text-white text-sm">{item.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <p className="font-body text-xs text-[#0A192F]/60">Provider: <strong>{item.provider}</strong></p>
          <p className="font-body text-xs text-[#2563EB] font-semibold">{item.rate}</p>
          <div className="flex gap-2">
            <a href={`tel:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#2563EB] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a href={`sms:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> SMS
            </a>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="font-body text-[10px] text-amber-700">Always verify credentials and agree on terms before any payment.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [contactItem, setContactItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.type === activeCategory;
    const matchLoc = locationFilter === 'All' || s.location === locationFilter || s.location === 'Both';
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLoc && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Services</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">Services Provided</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Home services, tech, beauty, events, professional & health services across Manila and Cavite.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cleaning, web dev, massage..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-2 flex-wrap mb-8">
          {SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveCategory(sc.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all border ${activeCategory === sc.key ? 'bg-[#0A192F] text-white border-[#0A192F]' : 'bg-white border-[#0A192F]/5 hover:border-[#0A192F]/20 text-[#0A192F]/70'}`}>
              <span>{sc.icon}</span> {sc.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Manila', 'Cavite'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className={`px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
              {loc}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(svc => <ServiceCard key={svc.id} svc={svc} onContact={setContactItem} />)}
          </div>
        ) : (
          <div className="text-center py-24"><p className="font-body text-[#0A192F]/40">No services found. Try a different filter.</p></div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 bg-[#0A192F] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Offer Your Services Here</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">List your services for free and get discovered by thousands of customers across Manila and Cavite.</p>
          <button onClick={() => setShowSignup(true)} className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Sign Up Free & List Your Service
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {contactItem && <ContactModal item={contactItem} onClose={() => setContactItem(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </div>
  );
}