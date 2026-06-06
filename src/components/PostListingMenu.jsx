import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Briefcase, Home, ShoppingBag, UtensilsCrossed, Wrench, Plane, X } from 'lucide-react';
import AddListingModal from './AddListingModal';
import MemberSignupModal from './MemberSignupModal';
import TravelPostModal from './travel/TravelPostModal';

const POST_SECTIONS = [
  {
    key: 'jobs',
    label: 'Post a Job',
    icon: Briefcase,
    color: '#f59e0b',
    desc: 'Hiring? Post for free',
    defaultType: 'jobs',
    posterTypes: ['Recruiter', 'Business Owner', 'HR Professional', 'Referrer / Headhunter', 'Individual Employer'],
  },
  {
    key: 'rent',
    label: 'Post for Rent / Lease',
    icon: Home,
    color: '#10b981',
    desc: 'Space, room, land, vehicle',
    defaultType: 'rent_lease',
    posterTypes: ['Property Owner', 'Non-Owner / Agent', 'Business Owner', 'Individual'],
  },
  {
    key: 'buysell',
    label: 'Post an Item for Sale',
    icon: ShoppingBag,
    color: '#8b5cf6',
    desc: 'Buy & sell anything',
    defaultType: 'product',
    posterTypes: ['Direct Seller / Owner', 'Reseller', 'Manufacturer', 'Freelancer', 'Retailer'],
  },
  {
    key: 'food',
    label: 'Post a Food Listing',
    icon: UtensilsCrossed,
    color: '#f97316',
    desc: 'Restaurants, homecooks, local',
    defaultType: 'food',
    posterTypes: ['Restaurant / Food Chain', 'Local / Home Business', 'Food Stall / Carinderia', 'Baker / Home Kitchen', 'Food Truck'],
  },
  {
    key: 'services',
    label: 'Post a Service',
    icon: Wrench,
    color: '#3b82f6',
    desc: 'Offer your skills',
    defaultType: 'services',
    posterTypes: ['Individual Freelancer', 'Business / Agency', 'Independent Contractor', 'Home Service Provider'],
  },
  {
    key: 'travel',
    label: 'Post Travel / Hotel',
    icon: Plane,
    color: '#0ea5e9',
    desc: 'Hotels, tours, rentals',
    defaultType: 'hotel',
    posterTypes: ['Hotel / Resort', 'Tour Operator', 'Vehicle Rental Business', 'Individual Host'],
  },
];

export default function PostListingMenu({ user, compact = false }) {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [posterType, setPosterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSectionClick = (section) => {
    if (!user) { setOpen(false); setShowSignup(true); return; }
    setSelectedSection(section);
    setPosterType('');
  };

  const handlePost = () => {
    setOpen(false);
    setSelectedSection(null);
    if (selectedSection?.key === 'travel') {
      setShowTravelModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body font-bold text-xs text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
          <Plus className="w-3.5 h-3.5" />
          {compact ? 'Post' : 'Post a Listing'}
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-[200]"
              style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>

              {!selectedSection ? (
                <div className="p-2">
                  <p className="font-body text-[9px] text-white/30 uppercase tracking-wider font-bold px-2 py-1.5">What are you posting?</p>
                  {POST_SECTIONS.map(sec => {
                    const Icon = sec.icon;
                    return (
                      <button key={sec.key} onClick={() => handleSectionClick(sec)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${sec.color}22`, border: `1px solid ${sec.color}44` }}>
                          <Icon className="w-4 h-4" style={{ color: sec.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-xs text-white group-hover:text-white leading-tight">{sec.label}</p>
                          <p className="font-body text-[9px] text-white/35">{sec.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedSection(null)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                      <ChevronDown className="w-3 h-3 text-white rotate-90" />
                    </button>
                    <p className="font-body font-bold text-sm text-white">{selectedSection.label}</p>
                  </div>
                  <div>
                    <p className="font-body text-[9px] text-white/40 uppercase tracking-wider mb-2">I am a / an:</p>
                    <div className="space-y-1">
                      {selectedSection.posterTypes.map(pt => (
                        <button key={pt} onClick={() => setPosterType(pt)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-left"
                          style={{
                            background: posterType === pt ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                            borderColor: posterType === pt ? '#00D4FF' : 'rgba(255,255,255,0.08)',
                          }}>
                          <span className="font-body text-xs text-white">{pt}</span>
                          {posterType === pt && <span className="text-[#00D4FF] text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handlePost}
                    className="w-full py-2.5 rounded-xl font-body font-bold text-sm text-white transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', opacity: posterType ? 1 : 0.4 }}
                    disabled={!posterType}>
                    Continue to Post →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddListingModal
            user={user}
            defaultType={selectedSection?.defaultType || ''}
            onClose={() => { setShowModal(false); setSelectedSection(null); }}
          />
        )}
        {showTravelModal && (
          <TravelPostModal user={user} onClose={() => { setShowTravelModal(false); setSelectedSection(null); }} />
        )}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
    </>
  );
}