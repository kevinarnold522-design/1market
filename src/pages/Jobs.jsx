import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Briefcase, Clock, ExternalLink, X, Building2, DollarSign, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';
import AddListingModal from '../components/AddListingModal';
import { base44 } from '@/api/base44Client';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', 'K', 'Q', 'J', '10', '9'];
const GRADIENTS = [
  'linear-gradient(135deg,#1a1000,#b45309)',
  'linear-gradient(135deg,#0f172a,#1e1b4b)',
  'linear-gradient(135deg,#0d1b2a,#1b4332)',
  'linear-gradient(135deg,#1a0a00,#78350f)',
  'linear-gradient(135deg,#0f2050,#1d4ed8)',
  'linear-gradient(135deg,#1a0030,#3b0764)',
  'linear-gradient(135deg,#1a1a2e,#2d6a4f)',
  'linear-gradient(135deg,#0a1628,#1d4ed8)',
];
const ACCENTS = ['#fbbf24','#60a5fa','#34d399','#f87171','#c084fc','#fb923c','#38bdf8','#e879f9'];

const JOB_SUBCATEGORIES = [
  { key: 'all',        label: 'All Jobs',      icon: '💼', desc: 'Browse all' },
  { key: 'tech',       label: 'Tech & IT',     icon: '💻', desc: 'Dev, IT, design' },
  { key: 'bpo',        label: 'BPO / Call Center', icon: '🎧', desc: 'CSR, agents' },
  { key: 'sales',      label: 'Sales & Retail',icon: '🏪', desc: 'Sales, promodizer' },
  { key: 'food',       label: 'Food & Resto',  icon: '🍳', desc: 'Chef, crew, cashier' },
  { key: 'drivers',    label: 'Drivers & Delivery', icon: '🚗', desc: 'Rider, driver' },
  { key: 'domestic',   label: 'Household',     icon: '🏡', desc: 'Kasambahay, yaya' },
  { key: 'healthcare', label: 'Healthcare',    icon: '🏥', desc: 'Nurse, medical' },
  { key: 'remote',     label: 'Remote / Online', icon: '🌐', desc: 'WFH, freelance' },
  { key: 'skilled',    label: 'Skilled Trades', icon: '🔧', desc: 'Electrician, plumber' },
  { key: 'events',     label: 'Events & Promo',icon: '🎉', desc: 'Events, performers' },
  { key: 'education',  label: 'Education',     icon: '📚', desc: 'Tutor, teacher' },
];

const JOBS = [
  { id:1, type:'tech', title:'React Developer – Remote', company:'TechStart PH', location:'Manila', area:'Remote', pay:'₱50,000–₱80,000/mo', type_label:'Full-time', desc:'Build and maintain web applications using React, Node.js. Min 2 yrs experience.', image:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80', contact:'hr@techstartph.com', urgent:true },
  { id:2, type:'bpo', title:'Customer Service Rep – Ortigas', company:'Global BPO Inc.', location:'Manila', area:'Ortigas', pay:'₱18,000–₱22,000/mo', type_label:'Full-time', desc:'Handle inbound US-based customer calls. Night shift. HMO Day 1.', image:'https://images.unsplash.com/photo-1553775282-20af80779df7?w=500&q=80', contact:'recruitment@globalbpo.com', urgent:false },
  { id:3, type:'food', title:'Restaurant Crew – Jollibee Bacoor', company:'Jollibee Foods Corp', location:'Cavite', area:'Bacoor', pay:'₱570/day', type_label:'Part-time', desc:'Counter crew for busy Bacoor branch. No experience needed. Training provided.', image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', contact:'09171234567', urgent:true },
  { id:4, type:'drivers', title:'Delivery Rider – GrabFood Partner', company:'Grab PH', location:'Manila', area:'Nationwide', pay:'₱800–₱2,000/day', type_label:'Freelance', desc:'Be your own boss. Flexible hours. Bike or motorcycle required.', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', contact:'partner.grab.com.ph', link:'https://partner.grab.com/ph', urgent:false },
  { id:5, type:'domestic', title:'Household Helper – BGC', company:'Private Household', location:'Manila', area:'BGC', pay:'₱8,000–₱10,000/mo', type_label:'Live-in', desc:'Household chores, cooking. Single employer. With free board & lodging.', image:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', contact:'09285551234', urgent:false },
  { id:6, type:'healthcare', title:'Staff Nurse – Cavite Medical Center', company:'Cavite Medical Center', location:'Cavite', area:'Imus', pay:'₱25,000–₱35,000/mo', type_label:'Full-time', desc:'ICU/ward nurse needed. PRC license required. With HMO and 13th month.', image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80', contact:'hr@cavitemedical.com.ph', urgent:true },
  { id:7, type:'remote', title:'Virtual Assistant – US Client', company:'Remote PH Solutions', location:'Manila', area:'WFH', pay:'$4–$6/hr', type_label:'Part-time', desc:'Email management, scheduling, research. Good English. Must have laptop & internet.', image:'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=500&q=80', contact:'jobs@remoteph.com', urgent:false },
  { id:8, type:'tech', title:'UI/UX Designer – Hybrid Makati', company:'Creative Studio MNL', location:'Manila', area:'Makati', pay:'₱35,000–₱55,000/mo', type_label:'Full-time', desc:'Design web and mobile interfaces. Figma proficiency required. Portfolio needed.', image:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80', contact:'careers@creativestudio.ph', urgent:false },
  { id:9, type:'sales', title:'Promodizer – SM Bacoor', company:'Consumer Goods Inc.', location:'Cavite', area:'Bacoor', pay:'₱600/day + commission', type_label:'Project-based', desc:'Promote personal care products inside SM Bacoor. 15 days assignment.', image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80', contact:'09181234987', urgent:true },
  { id:10, type:'skilled', title:'Licensed Electrician – Dasmariñas', company:'PowerFix Cavite', location:'Cavite', area:'Dasmariñas', pay:'₱700–₱900/day', type_label:'Contract', desc:'Residential & commercial electrical works. PRC license preferred. Tools provided.', image:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80', contact:'09291112233', urgent:false },
  { id:11, type:'events', title:'Event Hosts / Emcees – Manila', company:'EventsPro PH', location:'Manila', area:'Nationwide', pay:'₱3,000–₱8,000/event', type_label:'Freelance', desc:'Corporate and social events. Must be presentable, bilingual Filipino/English.', image:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', contact:'booking@eventspro.ph', urgent:false },
  { id:12, type:'education', title:'Online Math Tutor – Grades 6–10', company:'TutorPH Online', location:'Manila', area:'Online', pay:'₱300–₱500/hr', type_label:'Freelance', desc:'Teach math to elementary & high school students online. Flexible schedule.', image:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80', contact:'tutors@tutorph.com', urgent:false },
];

// Casino card for subcategory splash
function JobSubcatCard({ sc, index, onClick }) {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardIdx, setCardIdx] = useState(index % VALUES.length);
  const accent = ACCENTS[index % ACCENTS.length];
  const suit = SUITS[index % SUITS.length];
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const isRed = suit === '♥' || suit === '♦';

  useEffect(() => {
    const t = setInterval(() => setCardIdx(i => (i + 1) % VALUES.length), 850);
    return () => clearInterval(t);
  }, []);

  const calcTilt = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top - r.height/2) / (r.height/2)) * -8, y: ((e.clientX - r.left - r.width/2) / (r.width/2)) * 8 });
  };

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, scale:0.85, y:24 }} animate={{ opacity:1, scale:1, y:0 }}
      transition={{ delay: index * 0.05, type:'spring', stiffness:200, damping:18 }}
      style={{ perspective:'700px' }}
      onMouseEnter={() => setFlipped(true)} onMouseLeave={() => { setFlipped(false); setTilt({x:0,y:0}); }}
      onMouseMove={calcTilt}
      onClick={() => onClick(sc.key)}
      className="cursor-pointer select-none"
    >
      <motion.div style={{
        transformStyle:'preserve-3d',
        transform:`perspective(700px) rotateY(${flipped ? 180 : tilt.y}deg) rotateX(${tilt.x}deg)`,
        transition: flipped ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.1s ease',
        aspectRatio:'1/1.1', position:'relative',
      }}>
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility:'hidden', background:gradient, border:`1.5px solid ${accent}44`,
            boxShadow:`0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute top-1.5 left-2 text-[9px] font-black leading-none" style={{ color:accent }}>
            <div>{VALUES[cardIdx]}</div><div>{suit}</div>
          </div>
          <div className="absolute bottom-1.5 right-2 text-[9px] font-black leading-none rotate-180" style={{ color:accent }}>
            <div>{VALUES[cardIdx]}</div><div>{suit}</div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
            <div className="text-2xl sm:text-3xl mb-1.5 drop-shadow-lg">{sc.icon}</div>
            <p className="font-heading font-bold text-xs text-white leading-tight text-center">{sc.label}</p>
            <p className="font-body text-[9px] mt-0.5 text-white/50 text-center hidden sm:block">{sc.desc}</p>
          </div>
        </div>
        {/* BACK */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
          style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)',
            background:'linear-gradient(135deg,#0f172a,#1e1b4b)', border:`1.5px solid ${accent}88`,
            boxShadow:`0 0 28px 6px ${accent}33` }}>
          <div className="absolute inset-1 rounded-xl border border-white/5"
            style={{ background:'repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 2px,transparent 2px,transparent 10px)' }} />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.div key={cardIdx}
                initial={{ scale:0, rotate:-20, opacity:0 }} animate={{ scale:1, rotate:0, opacity:1 }}
                exit={{ scale:0, rotate:20, opacity:0 }} transition={{ duration:0.2 }}
                className="text-center">
                <p className="font-heading font-black text-3xl text-white drop-shadow">{VALUES[cardIdx]}</p>
                <p className="text-xl" style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</p>
              </motion.div>
            </AnimatePresence>
            <p className="font-body text-[9px] font-bold mt-0.5" style={{ color:accent }}>{sc.label}</p>
          </div>
          <div className="absolute top-1.5 left-2 text-[9px] font-black" style={{ color:accent }}>
            <div>{VALUES[cardIdx]}</div><div style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</div>
          </div>
          <div className="absolute bottom-1.5 right-2 text-[9px] font-black rotate-180" style={{ color:accent }}>
            <div>{VALUES[cardIdx]}</div><div style={{ color: isRed ? '#f87171' : '#f8fafc' }}>{suit}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function JobCard({ job, onApply }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      className="rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group"
      style={{ background:'rgba(13,31,60,0.85)', border:'1px solid rgba(0,212,255,0.12)' }}>
      <div className="relative h-32 overflow-hidden">
        <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A]/85 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {job.urgent && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/90 text-white">🔥 Urgent</span>}
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/15 text-white backdrop-blur-sm">{job.type_label}</span>
        </div>
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#2563EB]/80 text-white flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />{job.area}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-heading font-bold text-sm text-white leading-tight mb-0.5">{job.title}</h3>
        <p className="font-body text-[10px] text-[#00D4FF] font-semibold mb-0.5 flex items-center gap-1">
          <Building2 className="w-2.5 h-2.5" />{job.company}
        </p>
        <p className="font-body text-xs text-white/40 mb-2 line-clamp-2">{job.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm text-[#fbbf24] flex items-center gap-1">
            <DollarSign className="w-3 h-3" />{job.pay}
          </span>
          <button onClick={() => onApply(job)}
            className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#00D4FF] hover:text-[#0A192F] text-white rounded-lg font-body text-xs font-semibold transition-colors">
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ApplyModal({ job, onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070F1A]/85 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background:'#0D1F3C', border:'1px solid rgba(0,212,255,0.2)' }}>
        <div className="relative h-24 overflow-hidden">
          <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F3C]/95 to-transparent" />
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white text-xs">✕</button>
          <p className="absolute bottom-2 left-4 font-heading font-bold text-white text-sm">{job.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <p className="font-body text-xs text-[#00D4FF] font-bold mb-0.5">{job.company} · {job.area}</p>
            <p className="font-body text-xs text-white/50">{job.desc}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20">
            <p className="font-body text-[10px] text-[#fbbf24]">💰 Pay: <strong>{job.pay}</strong></p>
          </div>
          <div className="space-y-2">
            <p className="font-body text-[10px] text-white/40 uppercase tracking-wider">Contact / Apply via:</p>
            {job.link ? (
              <a href={job.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Open Application Page
              </a>
            ) : (
              <a href={`mailto:${job.contact}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors">
                📧 {job.contact}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Jobs() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [applyJob, setApplyJob] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [canAddListing, setCanAddListing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => {
        setCurrentUser(u);
        const allowed = u.role === 'admin' || u.is_seller || u.account_type === 'business_owner' || u.email === 'Kevinarnold522@gmail.com';
        setCanAddListing(allowed);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const handleSubcatSelect = (key) => { setActiveType(key); setShowSplash(false); };

  const filtered = JOBS.filter(j => {
    const matchType = activeType === 'all' || j.type === activeType;
    const matchLoc = locationFilter === 'All' || j.location === locationFilter;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.area.toLowerCase().includes(search.toLowerCase());
    return matchType && matchLoc && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <ParticleBackground />

      {/* Subcategory Splash — casino cards */}
      <AnimatePresence>
        {showSplash && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-20 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-[#070E1A]/90 backdrop-blur-md">
            <motion.div initial={{ opacity:0, scale:0.95, y:40 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95 }} transition={{ type:'spring', stiffness:160, damping:20 }}
              className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b)', border:'1px solid rgba(251,191,36,0.15)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background:'repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(255,255,255,0.01) 20px,rgba(255,255,255,0.01) 21px)' }} />
              <div className="text-center mb-6 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-[#fbbf24]">1Marketph Jobs</span>
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">Find Your Next Job</h2>
                <p className="font-body text-sm text-white/40 mt-1">Pick a job category below</p>
                <p className="font-body text-[10px] text-white/20 mt-1">Hover to flip • Tap to select</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 relative z-10">
                {JOB_SUBCATEGORIES.map((sc, i) => (
                  <JobSubcatCard key={sc.key} sc={sc} index={i} onClick={handleSubcatSelect} />
                ))}
              </div>
              <p className="text-center font-body text-[10px] text-white/20 mt-5 relative z-10">
                Tap a category to continue — you can change it anytime
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:`url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80)`, backgroundSize:'cover', backgroundPosition:'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/70 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-14">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#fbbf24]">1Market Job Board</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">Jobs in Manila & Cavite</h1>
              {canAddListing && (
                <button onClick={() => setShowAddListing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                  <Plus className="w-4 h-4" /> Post a Job
                </button>
              )}
            </div>
            <p className="font-body text-sm text-white/50 max-w-xl">Full-time, part-time, freelance & remote — real jobs from real companies across the Philippines.</p>
          </motion.div>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="mt-5 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies, locations..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#fbbf24]/50 transition-all" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Subcategory filter pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
          {JOB_SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveType(sc.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all ${activeType === sc.key ? 'bg-[#fbbf24] text-[#0A192F]' : 'bg-white/5 border border-white/15 text-white/60 hover:border-white/30 hover:text-white'}`}>
              <span>{sc.icon}</span> {sc.label}
            </button>
          ))}
        </div>

        {/* Location filter */}
        <div className="flex gap-2 mb-6">
          {['All','Manila','Cavite'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className={`px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#00D4FF] text-[#0A192F]' : 'bg-white/5 border border-white/15 text-white/60 hover:border-white/30'}`}>
              {loc}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(job => <JobCard key={job.id} job={job} onApply={setApplyJob} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="font-body text-white/30">No jobs found. Try different filters.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="mt-12 rounded-2xl p-8 text-center" style={{ background:'linear-gradient(135deg,#0D1F3C,#112240)', border:'1px solid rgba(251,191,36,0.2)' }}>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Hiring? Post a Job for Free</h2>
          <p className="font-body text-sm text-white/50 mb-5 max-w-md mx-auto">Reach thousands of job seekers across Manila and Cavite. Free job postings for verified businesses.</p>
          <button onClick={() => setShowSignup(true)} className="px-8 py-3 bg-[#fbbf24] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Post a Job Free →
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
        {showAddListing && <AddListingModal onClose={() => setShowAddListing(false)} defaultType="jobs" user={currentUser} />}
      </AnimatePresence>
    </div>
  );
}