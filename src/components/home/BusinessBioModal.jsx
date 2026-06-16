import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, ExternalLink, Star, Calendar, User, Camera, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { uploadMediaFileToR2 } from '@/lib/r2Upload';
import MultiPlatformRating from '../MultiPlatformRating';

export default function BusinessBioModal({ business, onClose, onUpdated }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [localBiz, setLocalBiz] = useState(business);
  const [uploadingField, setUploadingField] = useState(null);
  const wallpaperRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  useEffect(() => {
    setLocalBiz(business);
  }, [business]);

  if (!localBiz) return null;

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator' || currentUser?.email === 'Kevinarnold522@gmail.com';
  const isDbRecord = !!localBiz.id && !String(localBiz.id).startsWith('static_');

  const handleImageUpload = async (field, file) => {
    if (!file || !isAdmin || !isDbRecord) return;
    setUploadingField(field);
    const { file_url } = await uploadMediaFileToR2(file);
    await base44.entities.Business.update(localBiz.id, { [field]: file_url });
    const updated = { ...localBiz, [field]: file_url };
    setLocalBiz(updated);
    if (onUpdated) onUpdated(updated);
    setUploadingField(null);
  };

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
          className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Hero image — admin can click to change wallpaper */}
          <div className="relative h-44 overflow-hidden group/hero">
            <img
              src={localBiz.image_url || localBiz.image}
              alt={localBiz.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 to-transparent" />

            {/* Admin wallpaper upload overlay */}
            {isAdmin && isDbRecord && (
              <>
                <input
                  ref={wallpaperRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageUpload('image_url', e.target.files[0])}
                />
                <button
                  onClick={e => { e.stopPropagation(); wallpaperRef.current?.click(); }}
                  disabled={!!uploadingField}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover/hero:opacity-100 transition-opacity bg-black/30 text-white cursor-pointer"
                >
                  {uploadingField === 'image_url'
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Camera className="w-5 h-5" />}
                  <span className="font-body text-[10px] font-bold">Change Wallpaper</span>
                </button>
              </>
            )}

            {/* Logo — admin can click to change */}
            <div className="absolute bottom-4 left-4 group/logo">
              {(localBiz.logo_url || localBiz.logoUrl) ? (
                <div className="relative w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white p-1.5">
                  <img
                    src={localBiz.logo_url || localBiz.logoUrl}
                    alt="logo"
                    className="w-full h-full object-contain"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  {isAdmin && isDbRecord && (
                    <>
                      <input
                        ref={logoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageUpload('logo_url', e.target.files[0])}
                      />
                      <button
                        onClick={e => { e.stopPropagation(); logoRef.current?.click(); }}
                        disabled={!!uploadingField}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-xl"
                      >
                        {uploadingField === 'logo_url'
                          ? <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                          : <Upload className="w-3 h-3 text-white" />}
                      </button>
                    </>
                  )}
                </div>
              ) : isAdmin && isDbRecord ? (
                <>
                  <input
                    ref={logoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload('logo_url', e.target.files[0])}
                  />
                  <button
                    onClick={e => { e.stopPropagation(); logoRef.current?.click(); }}
                    className="w-14 h-14 rounded-xl bg-white/20 border-2 border-dashed border-white/40 flex flex-col items-center justify-center text-white gap-0.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-[8px] font-bold">Logo</span>
                  </button>
                </>
              ) : null}
            </div>

            <button onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 left-24">
              <h2 className="font-heading font-bold text-xl text-white leading-tight">{localBiz.name}</h2>
              <p className="font-body text-xs text-[#00D4FF]">{localBiz.category}</p>
            </div>
          </div>

          {/* Admin badge */}
          {isAdmin && isDbRecord && (
            <div className="px-5 pt-3 pb-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
                <Camera className="w-3 h-3" /> Hover over images to update wallpaper & logo
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Bio */}
            <div>
              <h3 className="font-heading font-bold text-sm text-[#0A192F] mb-1">About This Business</h3>
              <p className="font-body text-sm text-[#0A192F]/60 leading-relaxed">
                {localBiz.bio || localBiz.description || `${localBiz.name} is a trusted local business serving the community in ${localBiz.area || localBiz.location}. Known for quality ${localBiz.category?.toLowerCase()} and excellent customer service.`}
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {localBiz.founder && (
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Founded By</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{localBiz.founder}</p>
                  </div>
                </div>
              )}
              {localBiz.year_started && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Established</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{localBiz.year_started}</p>
                  </div>
                </div>
              )}
              {localBiz.address && (
                <div className="flex items-start gap-2 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Address</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{localBiz.address}</p>
                  </div>
                </div>
              )}
              {localBiz.hours && (
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider">Hours</p>
                    <p className="font-body text-xs font-semibold text-[#0A192F]">{localBiz.hours}</p>
                  </div>
                </div>
              )}
              
            </div>

            {/* Platform Ratings */}
            <MultiPlatformRating bizName={localBiz.name} baseRating={localBiz.rating || 4.2} />

            {/* Menu preview */}
            {localBiz.menu && localBiz.menu.length > 0 && (
              <div>
                <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-2">Known For</p>
                <div className="flex flex-wrap gap-1.5">
                  {localBiz.menu.slice(0, 6).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/60 text-[10px] rounded-full border border-[#0A192F]/5">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra images */}
            {localBiz.extra_images && localBiz.extra_images.length > 0 && (
              <div>
                <p className="font-body text-[10px] text-[#0A192F]/40 uppercase tracking-wider mb-2">Gallery</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {localBiz.extra_images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-[#0A192F]/5" />
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              {localBiz.website && (
                <a href={localBiz.website} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body text-xs font-semibold transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Visit Website
                </a>
              )}
              {localBiz.phone && (
                <a href={`tel:${localBiz.phone}`}
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