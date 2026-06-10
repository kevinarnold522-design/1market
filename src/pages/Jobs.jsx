import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import MascotDog from '../components/MascotDog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Briefcase, ExternalLink, X, Building2, DollarSign, Plus, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';
import PostListingMenu from '../components/PostListingMenu';
import { base44 } from '@/api/base44Client';

// Royal Blue theme colors
const THEME = {
  primary: '#0040D0',
  primaryDark: '#0033C4',
  accent: '#3E97F1',
  deep: '#011640',
};

const JOB_SUBCATEGORIES = [
  { key: 'all',        label: 'All Jobs',            color: '#3E97F1' },
  { key: 'tech',       label: 'Tech & IT',           color: '#6366f1' },
  { key: 'bpo',        label: 'BPO / Call Center',   color: '#0ea5e9' },
  { key: 'healthcare', label: 'Healthcare',          color: '#10b981' },
  { key: 'operations', label: 'Operations & HR',     color: '#f59e0b' },
  { key: 'finance',    label: 'Finance & Banking',   color: '#22c55e' },
  { key: 'engineering',label: 'Engineering',         color: '#64748b' },
  { key: 'sales',      label: 'Sales & Marketing',   color: '#f97316' },
  { key: 'creative',   label: 'Creative & Design',   color: '#ec4899' },
  { key: 'education',  label: 'Education',           color: '#8b5cf6' },
  { key: 'food',       label: 'Food & Resto',        color: '#ef4444' },
  { key: 'drivers',    label: 'Drivers & Delivery',  color: '#14b8a6' },
  { key: 'domestic',   label: 'Household',           color: '#84cc16' },
  { key: 'remote',     label: 'Remote / Online',     color: '#06b6d4' },
  { key: 'skilled',    label: 'Skilled Trades',      color: '#a78bfa' },
  { key: 'events',     label: 'Events & Promo',      color: '#fb923c' },
  { key: 'general',    label: 'General / Blue Collar',color: '#94a3b8' },
];

const STATIC_JOBS = [
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

function getCatColor(type) {
  return JOB_SUBCATEGORIES.find(s => s.key === type)?.color || '#3E97F1';
}
function getCatIcon(type) {
  return JOB_SUBCATEGORIES.find(s => s.key === type)?.label?.slice(0,2) || '';
}

function JobCard({ job, onApply }) {
  const catColor = getCatColor(job.type);
  const catIcon = getCatIcon(job.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer"
      style={{ background: `linear-gradient(160deg, #011640 0%, #0D1F3C 100%)`, border: `1px solid ${catColor}33` }}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={job.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80'}
          alt={job.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80'; }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #011640 0%, transparent 60%)` }} />
        {/* Category badge */}
        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm text-white"
          style={{ background: `${catColor}CC` }}>
          {job.type_label || job.type}
        </span>
        {job.urgent && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white">
            🔥 Urgent
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white flex items-center gap-1"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <MapPin className="w-2.5 h-2.5" />{job.area}
          </span>
          {job.location && job.location !== job.area && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/80"
              style={{ background: 'rgba(0,64,208,0.7)' }}>
              {job.location}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category color bar */}
        <div className="w-8 h-1 rounded-full mb-2" style={{ background: catColor }} />
        <h3 className="font-heading font-bold text-sm text-white leading-tight mb-1 line-clamp-2">{job.title}</h3>
        <p className="font-body text-[10px] font-semibold mb-1 flex items-center gap-1" style={{ color: catColor }}>
          <Building2 className="w-2.5 h-2.5" />{job.company}
        </p>
        <p className="font-body text-xs text-white/40 mb-3 line-clamp-2">{job.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm text-amber-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />{job.pay}
          </span>
          <button
            onClick={() => onApply(job)}
            className="px-4 py-1.5 rounded-lg font-body text-xs font-bold text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.accent})` }}
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ApplyModal({ job, onClose }) {
  const catColor = getCatColor(job.type);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(1,22,64,0.9)' }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0D1F3C', border: `1px solid ${catColor}44` }}>
        <div className="relative h-28 overflow-hidden">
          <img src={job.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80'} alt={job.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0D1F3C 20%, transparent)' }} />
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white">✕</button>
          <p className="absolute bottom-2 left-4 font-heading font-bold text-white text-sm">{job.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <p className="font-body text-xs font-bold mb-0.5" style={{ color: catColor }}>{getCatIcon(job.type)} {job.company} · {job.area}</p>
            <p className="font-body text-xs text-white/50">{job.desc}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p className="font-body text-[10px] text-amber-400">Pay: <strong>{job.pay}</strong></p>
          </div>
          <div className="space-y-2">
            <p className="font-body text-[10px] text-white/40 uppercase tracking-wider">Contact / Apply via:</p>
            {job.link ? (
              <a href={job.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-body text-xs font-bold text-white transition-all"
                style={{ background: `linear-gradient(135deg,${THEME.primary},${THEME.accent})` }}>
                <ExternalLink className="w-3.5 h-3.5" /> Open Application Page
              </a>
            ) : (
              <a href={`mailto:${job.contact}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-body text-xs font-bold text-white transition-all"
                style={{ background: `linear-gradient(135deg,${THEME.primary},${THEME.accent})` }}>
                {job.contact}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Jobs() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlSub = urlParams.get('sub');

  const [activeType, setActiveType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch] = useState(urlSub || '');
  const [applyJob, setApplyJob] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbJobs, setDbJobs] = useState([]);

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => setCurrentUser(u)).catch(() => {});
    }).catch(() => {});
    base44.entities.Listing.filter({ type: 'jobs', approval_status: 'approved', is_active: true }, '-created_date', 100)
      .then(jobs => setDbJobs(jobs))
      .catch(() => {});
  }, []);

  const SECTOR_TYPE_MAP = {
    operations: ['admin', 'hr', 'operations'],
    finance: ['finance', 'accounting', 'banking'],
    engineering: ['engineering', 'logistics', 'construction'],
    creative: ['design', 'creative', 'media'],
    general: ['general', 'utility', 'security'],
  };

  const allJobs = [
    ...STATIC_JOBS,
    ...dbJobs.map(j => ({
      id: j.id,
      type: j.subcategory?.toLowerCase().replace(/\s+/g, '') || 'other',
      title: j.title,
      company: j.seller_name || 'Posted on 1MarketPH',
      location: j.location,
      area: j.area || j.location,
      pay: j.price_label || (j.price ? `₱${Number(j.price).toLocaleString()}` : 'Negotiable'),
      type_label: j.subcategory || 'Job',
      desc: j.description || '',
      image: j.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80',
      contact: j.email_contact || j.phone || '',
      link: j.apply_link || null,
      urgent: false,
      isDb: true,
    }))
  ];

  const filtered = allJobs.filter(j => {
    const mappedTypes = SECTOR_TYPE_MAP[activeType];
    const matchType = activeType === 'all' || j.type === activeType || (mappedTypes && mappedTypes.includes(j.type));
    const matchLoc = locationFilter === 'All' || j.location === locationFilter;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || (j.area || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchLoc && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: THEME.deep }}>
      <ParticleBackground />

      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-14">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-amber-300">1Market Job Board</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">Jobs in the Philippines</h1>
              {currentUser ? (
                <Link to="/post-ad?category=jobs&type=jobs"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
                  <Plus className="w-3.5 h-3.5" /> Post a Job Ad
                </Link>
              ) : (
                <button
                  onClick={() => setShowSignup(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
                  <Plus className="w-3.5 h-3.5" /> Post a Job Ad
                </button>
              )}
            </div>
            <p className="font-body text-sm text-white/60 max-w-xl">Full-time, part-time, freelance & remote — real jobs from real companies across the Philippines.</p>
          </motion.div>
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies, locations..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid rgba(255,255,255,0.2)` }} />
          </motion.div>
        </div>
      </div>



      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Category pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {JOB_SUBCATEGORIES.map(sc => (
            <button key={sc.key} onClick={() => setActiveType(sc.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all border"
              style={activeType === sc.key
                ? { background: sc.color, color: '#fff', borderColor: sc.color, boxShadow: `0 0 12px ${sc.color}66` }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.12)' }}>
              {sc.label}
            </button>
          ))}
        </div>

        {/* Location filter */}
        <div className="flex gap-2 mb-6">
          {['All', 'Manila', 'Cavite', 'Nationwide'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className="px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all"
              style={locationFilter === loc
                ? { background: THEME.accent, color: '#fff' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
              {loc}
            </button>
          ))}
        </div>

        {/* Job count */}
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4" style={{ color: THEME.accent }} />
          <span className="font-body text-sm text-white/50">{filtered.length} jobs found</span>
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-14 rounded-2xl p-8 text-center"
          style={{ background: `linear-gradient(135deg, ${THEME.primaryDark}, ${THEME.primary})`, border: `1px solid ${THEME.accent}44` }}>
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Hiring? Post a Job for Free</h2>
          <p className="font-body text-sm text-white/60 mb-5 max-w-md mx-auto">Reach thousands of job seekers across the Philippines. Free job postings for all users.</p>
          <div className="flex justify-center">
            {currentUser ? (
              <PostListingMenu user={currentUser} compact={false} />
            ) : (
              <button onClick={() => setShowSignup(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                <Plus className="w-4 h-4" /> Post a Job Ad for Free
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
      <MascotDog page="jobs" />
    </div>
  );
}