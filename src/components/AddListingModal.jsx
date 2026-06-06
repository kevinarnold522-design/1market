import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ALL_LOCATIONS = [
  'Manila', 'Quezon City', 'Makati', 'BGC / Taguig', 'Pasig', 'Mandaluyong', 'Marikina',
  'Parañaque', 'Las Piñas', 'Muntinlupa', 'Caloocan', 'Malabon', 'Navotas', 'Valenzuela',
  'Pasay', 'Pateros', 'San Juan',
  'Bacoor', 'Imus', 'Dasmariñas', 'Cavite City', 'Tagaytay', 'Carmona', 'General Trias',
  'Silang', 'Alfonso', 'Kawit', 'Noveleta', 'Rosario',
  'Cebu City', 'Davao City', 'Iloilo City', 'Cagayan de Oro', 'Bacolod', 'Zamboanga',
  'Baguio City', 'Palawan', 'Boracay', 'Batangas', 'Laguna', 'Bulacan', 'Pampanga',
  'Rizal', 'Bataan', 'Pangasinan', 'Tarlac', 'Nueva Ecija', 'Nationwide', 'Remote / Online',
];

const CATEGORIES = [
  {
    value: 'product', label: 'General Product',
    subs: ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids', 'Other'],
  },
  {
    value: 'electronics', label: 'Electronics',
    subs: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories', 'Printers', 'Components'],
  },
  {
    value: 'shoes', label: 'Shoes & Footwear',
    subs: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids', 'Slip-ons', 'Heels'],
  },
  {
    value: 'clothing', label: 'Clothing & Apparel',
    subs: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing', 'Accessories'],
  },
  {
    value: 'furniture', label: 'Furniture',
    subs: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen', 'Storage', 'Kids Furniture'],
  },
  {
    value: 'homeappliances', label: 'Home Appliances',
    subs: ['Refrigerator / Freezer', 'Washing Machine', 'Air Conditioner', 'Microwave / Oven', 'Rice Cooker', 'TV / Smart TV', 'Other Appliance'],
  },
  {
    value: 'cars', label: 'Cars & Vehicles',
    subs: ['Sedan', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Motorcycle', 'Truck', 'AUV / MPV'],
  },
  {
    value: 'houses', label: 'Real Estate',
    subs: ['House & Lot', 'Condominium', 'Townhouse', 'Apartment', 'Vacant Lot', 'Commercial Property'],
  },
  {
    value: 'food', label: 'Food & Beverages',
    subs: ['Baked Goods', 'Ready-to-Eat Meals', 'Beverages', 'Snacks', 'Ingredients / Grocery', 'Desserts', 'Health Food'],
  },
  {
    value: 'services', label: 'Services',
    subs: [
      'Home Cleaning', 'Plumbing', 'Electrical', 'Aircon Services', 'Carpentry', 'Pest Control',
      'Web Development', 'Graphic Design', 'IT Support', 'CCTV Installation', 'Social Media',
      'Massage / Spa', 'Nails', 'Hair Services', 'Makeup Artist',
      'Event Planning', 'Catering', 'DJ', 'Photography / Videography',
      'Accounting / Bookkeeping', 'Tax Filing', 'Legal Services',
      'Trucking', 'Courier', 'Airport Transfer',
      'Dental', 'Caregiver', 'Online Doctor', 'Tutoring', 'Other / Type Manually',
    ],
  },
  {
    value: 'jobs', label: 'Job Posting',
    subs: [
      'Customer Service Rep (CSR)', 'Technical Support (TSR)', 'Virtual Assistant (VA)',
      'Software Engineer / Developer', 'IT Helpdesk', 'Data Analyst',
      'Staff Nurse', 'Medical Technologist', 'Pharmacist', 'Physical Therapist',
      'HR Generalist', 'Recruitment Specialist', 'Payroll Specialist',
      'Bookkeeper', 'Accountant / CPA', 'Financial Analyst',
      'Civil Engineer', 'Warehouse Supervisor', 'Delivery Driver',
      'Graphic Designer', 'UI/UX Designer', 'Video Editor', 'Content Writer',
      'Sales Executive', 'Digital Marketing', 'Social Media Manager',
      'Restaurant Manager', 'Service Crew', 'Cashier', 'Cook / Chef',
      'Security Guard', 'Janitor / Utility', 'Factory Worker',
      'Other / Not Listed',
    ],
  },
  {
    value: 'rent_lease', label: 'For Rent / Lease',
    subs: [
      'Room for Rent', 'Apartment / Condo', 'House for Rent', 'Bedspace / Dorm',
      'Commercial Space', 'Office for Rent', 'Venue / Events Space',
      'Land for Lease', 'Warehouse / Storage',
      'Car Rental', 'Van Rental', 'Motorcycle Rental',
      'Sound System Rental', 'Camera / Equipment Rental',
    ],
  },
  {
    value: 'hotel', label: 'Hotel / Accommodation',
    subs: ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Pension House', 'Airbnb / Homestay', 'Suite'],
  },
  {
    value: 'vehicle_rental', label: 'Vehicle Rental',
    subs: ['Car', 'Van', 'Motorcycle', 'Truck', 'Bus / Shuttle'],
  },
  {
    value: 'mods', label: 'Mods & Customizations',
    subs: ['Car Modifications', 'Motorcycle Mods', 'PC Builds / Upgrades', 'Console Mods', 'Custom Accessories'],
  },
  {
    value: 'other', label: 'Other / Miscellaneous',
    subs: ['Miscellaneous', 'Collectibles', 'Art & Crafts', 'Musical Instruments', 'Plants & Garden'],
  },
];

const CONDITIONS = ['Brand New', 'Like New', 'Good as New', 'Lightly Used', 'Used', 'Heavily Used', 'N/A'];

const EMPTY = {
  title: '', type: 'product', subcategory: '', location: 'Manila', area: '',
  price: '', price_label: '', description: '', image_url: '',
  phone: '', seller_name: '', email_contact: '', apply_link: '',
  condition: 'Brand New', is_active: true,
  job_position: '', job_title_custom: '',
  rent_title: '',
};

export default function AddListingModal({ onClose, defaultType = 'product', defaultSubcategory = '', user }) {
  const [form, setForm] = useState({
    ...EMPTY,
    type: defaultType,
    subcategory: defaultSubcategory,
    seller_name: user?.full_name || '',
    email_contact: user?.email || '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const currentCat = CATEGORIES.find(c => c.value === form.type);
  const isJob = form.type === 'jobs';
  const isRent = form.type === 'rent_lease' || form.type === 'vehicle_rental';

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    setSubmitting(true);
    const mainCatMap = {
      jobs: 'jobs', rent_lease: 'rent', vehicle_rental: 'rent',
      hotel: 'travel', flights: 'travel', services: 'services',
      food: 'food',
    };
    await base44.entities.Listing.create({
      title: form.title,
      type: form.type,
      subcategory: isJob ? (form.job_position || form.subcategory) : isRent ? (form.rent_title || form.subcategory) : form.subcategory,
      location: form.location,
      area: form.area,
      price: Number(form.price) || 0,
      price_label: form.price_label,
      description: form.description,
      image_url: form.image_url,
      phone: form.phone,
      seller_name: form.seller_name,
      email_contact: form.email_contact,
      apply_link: form.apply_link,
      condition: form.condition,
      is_active: form.is_active,
      main_category: mainCatMap[form.type] || 'buysell',
      approval_status: form.type === 'jobs' ? 'pending' : 'approved',
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#070F1A]/90 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)', maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 className="font-heading font-bold text-white text-base">Add New Listing</h2>
            <p className="font-body text-[10px] text-white/30">All categories in one place</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {done ? (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
              <p className="font-heading font-bold text-white text-lg mb-1">Listing Submitted!</p>
              <p className="font-body text-sm text-white/50">{form.type === 'jobs' ? 'Pending admin approval before going live.' : 'Your listing is now live.'}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

            {/* Photo */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Photo</label>
              {form.image_url ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/40 transition-colors">
                  {uploading
                    ? <div className="w-5 h-5 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                    : <><Upload className="w-5 h-5 text-white/25 mb-1" /><span className="font-body text-xs text-white/25">Upload Image</span></>
                  }
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Listing title..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Category</label>
                <select value={form.type} onChange={e => { set('type', e.target.value); set('subcategory', ''); set('job_position', ''); set('rent_title', ''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-[#0D1F3C]">{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Subcategory</label>
                <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  <option value="" className="bg-[#0D1F3C]">— Select —</option>
                  {(currentCat?.subs || []).map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
                </select>
              </div>
            </div>

            {/* Job-specific fields */}
            {isJob && (
              <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <p className="font-body text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Job Details</p>
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Job Position</label>
                  <select value={form.job_position} onChange={e => set('job_position', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                    <option value="" className="bg-[#0D1F3C]">— Select Position —</option>
                    {(currentCat?.subs || []).map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Job Title (Manual)</label>
                  <input value={form.job_title_custom} onChange={e => set('job_title_custom', e.target.value)} placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Application Link (optional)</label>
                  <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
              </div>
            )}

            {/* Rent-specific fields */}
            {isRent && (
              <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p className="font-body text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Rental Details</p>
                <div>
                  <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Rent Title (Manual)</label>
                  <input value={form.rent_title} onChange={e => set('rent_title', e.target.value)} placeholder="e.g. 2BR Condo Near DLSU"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Price (₱)</label>
                    <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                  </div>
                  <div>
                    <label className="block font-body text-[10px] text-white/40 uppercase tracking-wider mb-1">Price Display</label>
                    <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="₱18,000/mo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Location</label>
                <select value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {ALL_LOCATIONS.map(l => <option key={l} value={l} className="bg-[#0D1F3C]">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Area / District</label>
                <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. BGC, Bacoor"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            </div>

            {/* Price (non-rent) */}
            {!isRent && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Price (₱)</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
                <div>
                  <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Price Display</label>
                  <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder="₱3,500 neg"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
                </div>
              </div>
            )}

            {/* Condition (not for jobs/services) */}
            {!isJob && form.type !== 'services' && (
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Condition</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]">
                  {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
                </select>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                placeholder="Describe your listing..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF] resize-none" />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Your Name</label>
                <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Name / Business"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
              <div>
                <label className="block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Contact #</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+63 9xx"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]" />
              </div>
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="publish-toggle" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
              <label htmlFor="publish-toggle" className="font-body text-xs text-white/50">Publish publicly</label>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={!form.title || submitting}
              className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              {submitting
                ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                : 'Submit Listing'}
            </button>

            {form.type === 'jobs' && (
              <p className="font-body text-[10px] text-white/25 text-center">Job listings require admin approval before going live.</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}