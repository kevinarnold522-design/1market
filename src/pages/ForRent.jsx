import React, { useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, ExternalLink, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';

const SUBCATEGORIES = [
  { key: 'all', label: 'All Rentals', icon: '🏘️', desc: 'Browse everything' },
  { key: 'residential', label: 'Residential', icon: '🏠', desc: 'Houses, condos, apartments' },
  { key: 'commercial', label: 'Commercial', icon: '🏢', desc: 'Offices, retail, warehouses' },
  { key: 'vehicles', label: 'Vehicles', icon: '🚗', desc: 'Cars, vans, motorcycles' },
  { key: 'equipment', label: 'Equipment', icon: '🔧', desc: 'Tools, sound, cameras' },
  { key: 'events', label: 'Event Venues', icon: '🎉', desc: 'Halls, function rooms' },
];

const listings = [
  // RESIDENTIAL
  { id: 1, type: 'residential', title: '1BR Condo for Rent – Malate, Manila', sub: 'Condominium', price: '₱18,000/mo', location: 'Manila', area: 'Malate', desc: 'Furnished 1BR. High floor. Near LRT & hospitals. Pets allowed.', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80', contact: '09171234567' },
  { id: 2, type: 'residential', title: 'Bedspace for Rent – Near UST, Sampaloc', sub: 'Bedspace', price: '₱3,500/mo', location: 'Manila', area: 'Sampaloc', desc: 'AC room with WiFi. Inclusive of water & electricity. Female only.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', contact: '09185554321' },
  { id: 3, type: 'residential', title: 'Studio Unit for Rent – BGC, Taguig', sub: 'Studio', price: '₱22,000/mo', location: 'Manila', area: 'BGC', desc: 'Fully furnished studio. 24hr security. Pool access. Pet friendly.', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80', contact: '09209998877' },
  { id: 4, type: 'residential', title: '2BR Apartment – Imus, Cavite', sub: 'Apartment', price: '₱12,000/mo', location: 'Cavite', area: 'Imus', desc: '2 bedroom apartment, partly furnished, near Robinsons Imus.', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80', contact: '09301112233' },
  { id: 5, type: 'residential', title: 'House for Rent – Molino, Bacoor', sub: 'House', price: '₱15,000/mo', location: 'Cavite', area: 'Bacoor', desc: '3BR 2-storey house. With garage. Near SM Bacoor.', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80', contact: '09154443322' },
  { id: 6, type: 'residential', title: 'Airbnb Tagaytay Villa – Scenic View', sub: 'Vacation Home', price: '₱3,500/night', location: 'Cavite', area: 'Tagaytay', desc: 'Stunning Taal view villa. 4BR sleeps 10. Perfect for groups.', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80', contact: '09176667788', link: 'https://www.airbnb.com/s/Tagaytay' },
  { id: 7, type: 'residential', title: 'Dormitory Rooms – Dasmariñas, Cavite', sub: 'Dormitory', price: '₱2,800/mo', location: 'Cavite', area: 'Dasmariñas', desc: 'Near DLSU-D. Air conditioned. 24hr security. All-inclusive.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', contact: '09271239876' },
  { id: 8, type: 'residential', title: '3BR Beach House for Rent – Kawit', sub: 'Beach House', price: '₱8,000/night', location: 'Cavite', area: 'Kawit', desc: 'Private beach access. 3 bedrooms. Fully equipped kitchen.', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80', contact: '09198765432' },

  // COMMERCIAL
  { id: 9, type: 'commercial', title: 'Commercial Space – Taft Ave., Manila', sub: 'Retail Space', price: '₱55,000/mo', location: 'Manila', area: 'Malate', desc: '80 sqm ground floor. High foot traffic. Suitable for restaurant or store.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', contact: '09161122334' },
  { id: 10, type: 'commercial', title: 'Office Space – Makati CBD', sub: 'Office Space', price: '₱120,000/mo', location: 'Manila', area: 'Makati', desc: '200 sqm fitted office. 2 parking slots. 24/7 building access.', image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500&q=80', contact: '09209988776' },
  { id: 11, type: 'commercial', title: 'Warehouse for Lease – Carmona, Cavite', sub: 'Warehouse', price: '₱80,000/mo', location: 'Cavite', area: 'Carmona', desc: '500 sqm warehouse near SLEX. Loading bay. CCTV. Security.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80', contact: '09281234567' },
  { id: 12, type: 'commercial', title: 'Kiosk Space – SM Bacoor', sub: 'Kiosk', price: '₱25,000/mo', location: 'Cavite', area: 'Bacoor', desc: 'Kiosk inside SM Bacoor. 6 sqm. Great for food, accessories, services.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80', contact: '09154433210' },

  // VEHICLES
  { id: 13, type: 'vehicles', title: 'Toyota Vios – Self Drive Rental', sub: 'Sedan', price: '₱1,800/day', location: 'Manila', area: 'Pasay', desc: 'Clean unit. Self-drive. Gas not included. Min. 1 day rental.', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&q=80', contact: '09177766554' },
  { id: 14, type: 'vehicles', title: 'Toyota Hi-Ace Van – With Driver', sub: 'Van', price: '₱4,000/day', location: 'Cavite', area: 'Imus', desc: '15 seater with professional driver. Available nationwide.', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80', contact: '09305559988' },
  { id: 15, type: 'vehicles', title: 'Motorcycle Rental – Tagaytay', sub: 'Motorcycle', price: '₱500/day', location: 'Cavite', area: 'Tagaytay', desc: 'Honda Click 125i. Helmet included. Perfect for Tagaytay rides.', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80', contact: '09192223344' },
  { id: 16, type: 'vehicles', title: 'Mitsubishi Montero SUV Rental', sub: 'SUV', price: '₱3,200/day', location: 'Manila', area: 'Parañaque', desc: 'Premium SUV. With driver available. Airport pickup possible.', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&q=80', contact: '09218899001' },

  // EQUIPMENT
  { id: 17, type: 'equipment', title: 'Sound System Rental – Manila', sub: 'Sound System', price: '₱5,000/event', location: 'Manila', area: 'Pasig', desc: '10,000W sound system. With operator. Setup included.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80', contact: '09161122998' },
  { id: 18, type: 'equipment', title: 'DSLR Camera Rental – Makati', sub: 'Camera', price: '₱800/day', location: 'Manila', area: 'Makati', desc: 'Canon 5D Mark IV with lens kit. Deposit required. ID check.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', contact: '09174321987' },
  { id: 19, type: 'equipment', title: 'Generator Rental – Bacoor, Cavite', sub: 'Generator', price: '₱1,500/day', location: 'Cavite', area: 'Bacoor', desc: '10KVA generator. Fuel not included. Delivery available.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', contact: '09295553344' },
  { id: 20, type: 'equipment', title: 'Drone Rental – DJI Mavic 3', sub: 'Drone', price: '₱2,500/day', location: 'Manila', area: 'QC', desc: '4K footage. With licensed operator available. Min 4 hr rental.', image: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=500&q=80', contact: '09181234556' },

  // EVENTS
  { id: 21, type: 'events', title: 'Function Hall – Dasmariñas, Cavite', sub: 'Function Hall', price: '₱15,000/event', location: 'Cavite', area: 'Dasmariñas', desc: '150 pax capacity. With tables, chairs & basic decor. AC.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&q=80', contact: '09307776655' },
  { id: 22, type: 'events', title: 'Garden Event Venue – Tagaytay', sub: 'Garden Venue', price: '₱35,000/event', location: 'Cavite', area: 'Tagaytay', desc: 'Scenic outdoor venue. 200 pax. Perfect for weddings & debuts.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80', contact: '09163334455' },
  { id: 23, type: 'events', title: 'Conference Room – Makati', sub: 'Conference Room', price: '₱3,500/day', location: 'Manila', area: 'Makati', desc: '20 seater. Projector & whiteboard included. Catering optional.', image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500&q=80', contact: '09218811223' },
  { id: 24, type: 'events', title: 'Event Tent Rental – Imus, Cavite', sub: 'Tent Rental', price: '₱8,000/event', location: 'Cavite', area: 'Imus', desc: 'Heavy-duty white wedding tent. 100 pax. With lights & fans.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', contact: '09264445566' },
];

function RentalCard({ item, onContact }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
      style={{ background: 'rgba(13,31,60,0.85)', border: '1px solid rgba(0,212,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.location === 'Manila' ? 'bg-blue-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>📍 {item.area}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white backdrop-blur-sm">{item.sub}</span>
        </div>
        {item.link && (
          <button onClick={() => window.open(item.link, '_blank')} className="absolute top-3 right-3 w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1">{item.title}</h3>
        <p className="font-body text-xs text-white/40 mb-3 line-clamp-2">{item.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-base text-[#00D4FF]">{item.price}</span>
          <button onClick={() => onContact(item)}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-lg font-body text-xs font-semibold transition-colors">
            Inquire
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ContactModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070F1A]/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="relative h-24 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/90 to-transparent" />
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white text-xs hover:bg-white/25">✕</button>
          <p className="absolute bottom-2 left-4 font-heading font-bold text-white text-sm">{item.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <a href={`tel:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a href={`sms:${item.contact}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 border border-white/15 text-white rounded-xl font-body text-xs font-semibold hover:bg-white/20 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> SMS
            </a>
          </div>
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="font-body text-[10px] text-amber-300">Verify all agreements and documents directly with the owner before any payment.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ForRent() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [contactItem, setContactItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const filtered = listings.filter(l => {
    const matchCat = !activeCategory || activeCategory === 'all' || l.type === activeCategory;
    const matchLoc = locationFilter === 'All' || l.location === locationFilter;
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.area.toLowerCase().includes(search.toLowerCase()) || l.sub.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLoc && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />
      <SubcategorySplash
        subcategories={SUBCATEGORIES}
        activeKey={activeCategory}
        onSelect={setActiveCategory}
        title="What are you looking to rent?"
        subtitle="Choose a category to browse listings"
      />
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Rentals</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">For Rent / Lease</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Residential, commercial, vehicles & equipment — find the perfect rental across Manila and Cavite.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search condos, cars, event venues..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveCategory(sc.key)}
              className={`p-3 rounded-2xl text-left transition-all border ${activeCategory === sc.key ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white' : 'bg-white/5 border-white/10 hover:border-white/25 text-white'}`}>
              <div className="text-xl mb-1">{sc.icon}</div>
              <p className="font-heading font-bold text-xs">{sc.label}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['All', 'Manila', 'Cavite'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className={`px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/5 border border-white/15 text-white/60 hover:border-white/30'}`}>
              {loc}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => <RentalCard key={item.id} item={item} onContact={setContactItem} />)}
          </div>
        ) : (
          <div className="text-center py-24"><p className="font-body text-white/30">No rentals found. Try a different filter.</p></div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,#0D1F3C,#112240)', border: '1px solid rgba(0,212,255,0.15)' }}>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Have a Property or Item to Rent Out?</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">List your property, vehicle, or equipment for free and reach renters across Manila and Cavite.</p>
          <button onClick={() => setShowSignup(true)} className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Sign Up Free & Post a Rental
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