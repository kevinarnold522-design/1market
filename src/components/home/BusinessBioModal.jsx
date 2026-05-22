import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, ExternalLink, Star, Calendar, User } from 'lucide-react';

export default function BusinessBioModal({ business, onClose }) {
  if (!business) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Hero image */}
          <div className="relative h-44 overflow-hidden">
            <img src={business.image_url || business.image} alt={business.name}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 to-transparent" />

            {/* Logo */}
            {(business.logo_url || business.logoUrl) && (
              <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white p-1.5">
                <img src={business.logo_url || business.logoUrl} alt="logo" className="w-full h-full object-contain"
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}

            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 left-24">
              <h2 className="font-heading font-bold text-xl text-white leading-tight">{business.name}</h2>
              <p className="font-body text-xs text-[#00D4FF]">{business.category}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Bio */}
            <div>
              <h3 className="font-heading font-bold text-sm text-[#0A192F] mb-1">About This Business</h3>
              <p className="font-body text-sm text-[#0A192F]/60 leading-relaxed">
                {business.bio || business.description || `${business.name} is a trusted local business serving the community in ${business.area || business.location}. Known for quality ${business.category?.toLowerCase()} and excellent customer service.`}
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {business.founder && (
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Founded By</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{business.founder}</p>
                  </div>
                </div>
              )}
              {business.year_started && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Established</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{business.year_started}</p>
                  </div>
                </div>
              )}
              {business.address && (
                <div className="flex items-start gap-2 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Address</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{business.address}</p>
                  </div>
                </div>
              )}
              {business.hours && (
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Hours</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{business.hours}</p>
                  </div>
                </div>
              )}
              {business.rating > 0 && (
                <div className="flex items-start gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Rating</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{business.rating}/5.0</p>
                  </div>
                </div>
              )}
            </div>

            {/* Menu preview */}
            {business.menu && business.menu.length > 0 && (
              <div>
                <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-2">Known For</p>
                <div className="flex flex-wrap gap-1.5">
                  {business.menu.slice(0, 6).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/60 text-[10px] rounded-full border border-[#0A192F]/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Website
                </a>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-[#0A192F]/10 text-[#0A192F] rounded-xl font-body text-xs font-semibold hover:bg-[#EFF6FF] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}