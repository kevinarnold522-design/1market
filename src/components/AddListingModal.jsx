import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, ChevronLeft, Plane, UtensilsCrossed, ShoppingBag, Home, Wrench, Briefcase } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// ─── Main Categories ───────────────────────────────────────────────
const MAIN_CATEGORIES = [
  { value: 'travel',   label: 'Travel',       Icon: Plane,          color: '#0ea5e9' },
  { value: 'food',     label: 'Food',         Icon: UtensilsCrossed, color: '#f97316' },
  { value: 'buysell',  label: 'Buy & Sell',   Icon: ShoppingBag,    color: '#8b5cf6' },
  { value: 'rent',     label: 'Rent & Lease', Icon: Home,           color: '#10b981' },
  { value: 'services', label: 'Services',     Icon: Wrench,         color: '#3b82f6' },
  { value: 'jobs',     label: 'Jobs',         Icon: Briefcase,      color: '#f59e0b' },
];

// ─── Type options per main category ────────────────────────────────
const TYPES_BY_MAIN = {
  travel: [
    { value: 'hotel',          label: 'Hotel / Accommodation' },
    { value: 'flights',        label: 'Flights / Tour Package' },
    { value: 'vehicle_rental', label: 'Vehicle Rental' },
    { value: 'other',          label: 'Other Travel' },
  ],
  food: [
    { value: 'food', label: 'Food & Beverages' },
  ],
  buysell: [
    { value: 'product',       label: 'General Product' },
    { value: 'electronics',   label: 'Electronics' },
    { value: 'shoes',         label: 'Shoes & Footwear' },
    { value: 'clothing',      label: 'Clothing & Apparel' },
    { value: 'furniture',     label: 'Furniture' },
    { value: 'homeappliances',label: 'Home Appliances' },
    { value: 'cars',          label: 'Cars & Vehicles' },
    { value: 'houses',        label: 'Real Estate' },
    { value: 'mods',          label: 'Mods & Customizations' },
    { value: 'other',         label: 'Other / Miscellaneous' },
  ],
  rent: [
    { value: 'rent_lease',    label: 'Property / Space Rental' },
    { value: 'vehicle_rental',label: 'Vehicle Rental' },
  ],
  services: [
    { value: 'services', label: 'Service Listing' },
  ],
  jobs: [
    { value: 'jobs', label: 'Job Posting' },
  ],
};

// ─── Subcategories per type ─────────────────────────────────────────
const SUBS_BY_TYPE = {
  product:        ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids', 'Other'],
  electronics:    ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories', 'Printers', 'Components'],
  shoes:          ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids', 'Slip-ons', 'Heels'],
  clothing:       ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing', 'Accessories'],
  furniture:      ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen', 'Storage', 'Kids Furniture'],
  homeappliances: ['Refrigerator / Freezer', 'Washing Machine', 'Air Conditioner', 'Microwave / Oven', 'Rice Cooker', 'TV / Smart TV', 'Other Appliance'],
  cars:           ['Sedan', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Motorcycle', 'Truck', 'AUV / MPV'],
  houses:         ['House & Lot', 'Condominium', 'Townhouse', 'Apartment', 'Vacant Lot', 'Commercial Property'],
  food:           ['Baked Goods', 'Ready-to-Eat Meals', 'Beverages', 'Snacks', 'Ingredients / Grocery', 'Desserts', 'Health Food', 'Restaurant / Carinderia', 'Home Kitchen', 'Food Stall'],
  services: [
    'Home Cleaning', 'Plumbing', 'Electrical', 'Aircon Services', 'Carpentry', 'Pest Control',
    'Web Development', 'Graphic Design', 'IT Support', 'CCTV Installation', 'Social Media Management',
    'Massage / Spa', 'Nails', 'Hair Services', 'Makeup Artist',
    'Event Planning', 'Catering', 'DJ Services', 'Photography / Videography',
    'Accounting / Bookkeeping', 'Tax Filing', 'Legal Services',
    'Trucking', 'Courier / Delivery', 'Airport Transfer',
    'Dental', 'Caregiver', 'Online Doctor / Telemedicine',
    'Tutoring / Academic', 'Online Teaching',
    'Painting / Renovation', 'Landscaping / Garden',
    'Other / Type Manually',
  ],
  jobs: [
    // BPO / Call Center
    'Customer Service Rep (CSR)', 'Technical Support (TSR)', 'Chat Support Agent',
    'Collections Agent', 'Data Entry Specialist',
    // Tech
    'Software Engineer / Developer', 'Web Developer', 'Mobile App Developer',
    'IT Helpdesk / Support', 'Network Administrator', 'Data Analyst',
    'Cybersecurity Specialist', 'DevOps Engineer', 'QA Tester',
    // Healthcare
    'Staff Nurse (RN)', 'Nursing Assistant', 'Medical Technologist',
    'Pharmacist', 'Physical Therapist', 'Radiologic Technologist',
    'Dentist', 'Caregiver / Carer', 'Midwife',
    // HR / Admin
    'HR Generalist', 'Recruitment Specialist', 'Payroll Specialist',
    'Administrative Assistant', 'Executive Assistant', 'Receptionist',
    // Finance / Accounting
    'Bookkeeper', 'Accountant / CPA', 'Financial Analyst', 'Auditor',
    'Credit / Collections Officer', 'Teller / Bank Staff',
    // Engineering / Trades
    'Civil Engineer', 'Electrical Engineer', 'Mechanical Engineer',
    'Licensed Electrician', 'Plumber', 'Welder / Fabricator',
    'Construction Worker / Laborer', 'Carpenter', 'Mason',
    // Logistics / Warehouse
    'Warehouse Staff', 'Forklift Operator', 'Inventory Analyst',
    'Delivery Rider / Driver', 'Dispatcher', 'Logistics Coordinator',
    // Sales / Marketing
    'Sales Executive', 'Sales Associate / Promodizer', 'Account Manager',
    'Digital Marketing Specialist', 'Social Media Manager', 'SEO Specialist',
    'Brand Ambassador', 'Telemarketer',
    // Creative / Media
    'Graphic Designer', 'UI/UX Designer', 'Video Editor',
    'Photographer', 'Content Writer / Copywriter', 'Animator',
    'Podcast Producer', 'Voice Talent',
    // Food & Service
    'Restaurant Manager', 'Service Crew / Waiter', 'Cashier',
    'Cook / Chef', 'Barista', 'Dishwasher / Kitchen Helper',
    'Baker / Pastry Chef',
    // Education
    'Teacher / Instructor', 'Online Tutor', 'School Admin Staff',
    'Guidance Counselor',
    // Domestic / Household
    'Household Helper / Kasambahay', 'Yaya / Nanny', 'Laundrywoman',
    'Gardener / Landscaper', 'Driver (Private)', 'Security Guard',
    // Freelance / Remote
    'Virtual Assistant (VA)', 'Freelance Writer', 'Online ESL Teacher',
    'Remote Customer Support', 'Data Entry (WFH)',
    // Events / Entertainment
    'Event Host / Emcee', 'Event Coordinator', 'DJ', 'Photographer (Events)',
    'Promo Girl / Guy', 'Model',
    // Manufacturing
    'Factory Worker', 'Machine Operator', 'Quality Control Inspector',
    'Production Supervisor',
    // Utility
    'Janitor / Utility Worker', 'Maintenance Technician',
    'Aircon Technician', 'Pest Control Technician',
    'Other / Not Listed',
  ],
  rent_lease: [
    'Room for Rent', 'Bedspace / Dormitory', 'Apartment / Condo',
    'House for Rent', 'Townhouse for Rent',
    'Commercial Space', 'Office Space', 'Bodega / Warehouse',
    'Land for Lease', 'Venue / Events Space',
    'Stall / Kiosk Rental',
  ],
  vehicle_rental: ['Car Rental', 'Van Rental', 'Motorcycle Rental', 'Truck Rental', 'Bus / Shuttle'],
  hotel:          ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Pension House', 'Airbnb / Homestay', 'Suite / Villa'],
  flights:        ['Domestic Flight', 'International Flight', 'Tour Package', 'Bus / Ferry Package'],
  mods:           ['Car Modifications', 'Motorcycle Mods', 'PC Builds / Upgrades', 'Console Mods', 'Custom Accessories'],
  other:          ['Miscellaneous', 'Collectibles', 'Art & Crafts', 'Musical Instruments', 'Plants & Garden'],
};

// ─── Full location list ─────────────────────────────────────────────
const ALL_CITIES = [
  // NCR / Metro Manila
  'Manila', 'Quezon City', 'Makati', 'BGC / Taguig', 'Pasig', 'Mandaluyong', 'Marikina',
  'Parañaque', 'Las Piñas', 'Muntinlupa', 'Caloocan', 'Malabon', 'Navotas', 'Valenzuela',
  'Pasay', 'Pateros', 'San Juan', 'Cubao', 'Ermita / Malate', 'Intramuros / Binondo',
  // Cavite
  'Bacoor', 'Imus', 'Dasmariñas', 'Cavite City', 'Tagaytay', 'Carmona', 'General Trias',
  'Silang', 'Alfonso', 'Kawit', 'Noveleta', 'Rosario', 'Naic', 'Tanza', 'Mendez',
  'Maragondon', 'Ternate', 'Magallanes', 'General Mariano Alvarez (GMA)',
  // Laguna
  'San Pablo City', 'Santa Rosa', 'Biñan', 'Calamba', 'Los Baños', 'Bay', 'Cabuyao',
  'San Pedro', 'Calauan', 'Pagsanjan', 'Paete',
  // Batangas
  'Batangas City', 'Lipa City', 'Tanauan', 'Nasugbu', 'Lemery', 'Rosario (Batangas)',
  'Bauan', 'San Jose', 'Lobo',
  // Rizal
  'Antipolo', 'Cainta', 'Taytay', 'Angono', 'Binangonan', 'Morong', 'Tanay',
  'Rodríguez (Montalban)', 'San Mateo', 'Cardona',
  // Bulacan
  'Malolos', 'Meycauayan', 'Marilao', 'Bocaue', 'Balagtas', 'San Jose del Monte',
  'Santa Maria', 'Obando', 'Pulilan', 'Bulakan',
  // Pampanga
  'Angeles City', 'San Fernando (Pampanga)', 'Mabalacat', 'Porac', 'Magalang', 'Arayat',
  // Tarlac
  'Tarlac City', 'Capas', 'Concepcion (Tarlac)', 'San Clemente',
  // Pangasinan
  'Dagupan City', 'Urdaneta', 'Alaminos', 'Lingayen', 'San Carlos (Pangasinan)',
  // Nueva Ecija
  'Cabanatuan City', 'San Jose (Nueva Ecija)', 'Gapan', 'Palayan',
  // Visayas
  'Cebu City', 'Lapu-Lapu City', 'Mandaue', 'Talisay (Cebu)', 'Danao', 'Toledo',
  'Iloilo City', 'Bacolod', 'Dumaguete', 'Tagbilaran (Bohol)', 'Boracay / Malay',
  'Tacloban', 'Calbayog', 'Ormoc',
  // Mindanao
  'Davao City', 'Cagayan de Oro', 'Zamboanga City', 'General Santos City',
  'Iligan City', 'Butuan City', 'Cotabato City', 'Koronadal', 'Marawi City',
  'Dipolog', 'Dapitan', 'Pagadian', 'Ozamiz',
  // Island / Tourist
  'Palawan / Puerto Princesa', 'Coron (Palawan)', 'El Nido (Palawan)',
  'Batanes', 'Baguio City', 'La Union', 'Vigan', 'Laoag / Ilocos Norte',
  'Camarines Sur / Naga', 'Legazpi (Albay)', 'Sorsogon', 'Masbate',
  'Surigao', 'Siargao', 'Mati (Davao Oriental)', 'Samal Island',
  // Nationwide / Remote
  'Nationwide', 'Remote / Online / WFH',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good as New', 'Lightly Used', 'Used', 'Heavily Used', 'N/A'];

const EMPTY_FORM = {
  main_category: '',
  type: '',
  subcategory: '',
  title: '',
  description: '',
  // location
  city: '',
  state_region: '',
  zip: '',
  area: '',
  // pricing
  price: '',
  original_price: '',
  price_label: '',
  // contact
  seller_name: '',
  phone: '',
  email_contact: '',
  apply_link: '',
  // extras
  condition: 'Brand New',
  image_url: '',
  is_active: true,
};

// Map type → main_category for entity field
const TYPE_TO_MAIN = {
  hotel: 'travel', flights: 'travel',
  food: 'food',
  product: 'buysell', electronics: 'buysell', shoes: 'buysell', clothing: 'buysell',
  furniture: 'buysell', homeappliances: 'buysell', cars: 'buysell', houses: 'buysell',
  mods: 'buysell', other: 'buysell',
  rent_lease: 'rent', vehicle_rental: 'rent',
  services: 'services',
  jobs: 'jobs',
};

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00D4FF]';
const labelCls = 'block font-body text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1';

export default function AddListingModal({ onClose, defaultType = '', defaultSubcategory = '', user }) {
  const resolvedMain = defaultType
    ? (Object.entries(TYPE_TO_MAIN).find(([t]) => t === defaultType)?.[1] || '')
    : '';

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    main_category: resolvedMain,
    type: defaultType,
    subcategory: defaultSubcategory,
    seller_name: user?.full_name || '',
    email_contact: user?.email || '',
  });
  const [step, setStep] = useState(resolvedMain ? (defaultType ? 2 : 1) : 0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [dpaAccepted, setDpaAccepted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isJob = form.type === 'jobs';
  const isRent = form.type === 'rent_lease' || form.type === 'vehicle_rental';
  const hidePrice = isJob;
  const currentSubs = SUBS_BY_TYPE[form.type] || [];

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
    const locationStr = [form.city, form.state_region].filter(Boolean).join(', ') || 'Nationwide';
    await base44.entities.Listing.create({
      title: form.title,
      type: form.type,
      main_category: form.main_category,
      subcategory: form.subcategory,
      location: locationStr,
      area: form.area || (form.zip ? `Zip: ${form.zip}` : ''),
      full_address: [form.area, form.city, form.state_region, form.zip].filter(Boolean).join(', '),
      price: hidePrice ? 0 : (Number(form.price) || 0),
      original_price: (!hidePrice && form.original_price && Number(form.original_price) > Number(form.price)) ? Number(form.original_price) : null,
      price_label: hidePrice ? '' : form.price_label,
      description: form.description,
      image_url: form.image_url,
      phone: form.phone,
      seller_name: form.seller_name,
      email_contact: form.email_contact,
      apply_link: form.apply_link,
      condition: form.condition,
      is_active: form.is_active,
      approval_status: isJob ? 'pending' : 'approved',
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
          <div className="flex items-center gap-2">
            {step > 0 && !done && (
              <button onClick={() => setStep(s => s - 1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 mr-1">
                <ChevronLeft className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            <div>
              <h2 className="font-heading font-bold text-white text-base">Add New Listing</h2>
              <p className="font-body text-[10px] text-white/30">
                {step === 0 ? 'Step 1 — Pick a main category' : step === 1 ? 'Step 2 — Choose type & subcategory' : 'Step 3 — Listing details'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Body */}
        {done ? (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
              <p className="font-heading font-bold text-white text-lg mb-1">Listing Submitted!</p>
              <p className="font-body text-sm text-white/50">{isJob ? 'Pending admin approval before going live.' : 'Your listing is now live.'}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <AnimatePresence mode="wait">

              {/* STEP 0 — Main Category */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="font-body text-sm text-white/50 mb-4">What are you listing?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MAIN_CATEGORIES.map(mc => (
                      <button key={mc.value} onClick={() => {
                        set('main_category', mc.value);
                        const types = TYPES_BY_MAIN[mc.value];
                        if (types.length === 1) {
                          set('type', types[0].value);
                          setStep(2);
                        } else {
                          set('type', '');
                          setStep(1);
                        }
                      }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105"
                        style={{
                          background: form.main_category === mc.value ? `${mc.color}22` : 'rgba(255,255,255,0.04)',
                          borderColor: form.main_category === mc.value ? mc.color : 'rgba(255,255,255,0.1)',
                          boxShadow: form.main_category === mc.value ? `0 0 16px ${mc.color}44` : 'none',
                        }}>
                        <mc.Icon className="w-7 h-7" style={{ color: mc.color }} />
                        <span className="font-body font-semibold text-xs text-white">{mc.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Type selection (multi-type categories) */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="font-body text-sm text-white/50 mb-4">Which type of listing?</p>
                  <div className="space-y-2">
                    {(TYPES_BY_MAIN[form.main_category] || []).map(t => (
                      <button key={t.value} onClick={() => { set('type', t.value); set('subcategory', ''); setStep(2); }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left"
                        style={{
                          background: form.type === t.value ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                          borderColor: form.type === t.value ? '#00D4FF' : 'rgba(255,255,255,0.1)',
                        }}>
                        <span className="font-body text-sm text-white">{t.label}</span>
                        {form.type === t.value && <span className="text-[#00D4FF] text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Full form */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  {/* Photo */}
                  <div>
                    <label className={labelCls}>Photo</label>
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
                          : <><Upload className="w-5 h-5 text-white/25 mb-1" /><span className="font-body text-xs text-white/25">Upload Image</span></>}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className={labelCls}>Title <span className="text-red-400">*</span></label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Listing title..." className={inputCls} />
                  </div>

                  {/* Subcategory */}
                  {currentSubs.length > 0 && (
                    <div>
                      <label className={labelCls}>Subcategory</label>
                      <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)} className={inputCls}>
                        <option value="" className="bg-[#0D1F3C]">— Select —</option>
                        {currentSubs.map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Job-specific: application link */}
                  {isJob && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                      <p className="font-body text-[10px] font-bold text-amber-300 uppercase tracking-wider">Job Details</p>
                      <div>
                        <label className={labelCls}>Application Link (optional)</label>
                        <input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..." className={inputCls} />
                      </div>
                    </div>
                  )}

                  {/* Location — manual entry */}
                  <div>
                    <label className={labelCls}>Location</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">City / Municipality</label>
                        <input list="city-list" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Manila" className={inputCls} />
                        <datalist id="city-list">
                          {ALL_CITIES.map(c => <option key={c} value={c} />)}
                        </datalist>
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">State / Region / Province</label>
                        <input value={form.state_region} onChange={e => set('state_region', e.target.value)} placeholder="e.g. Metro Manila" className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">Zip / Postal Code</label>
                        <input value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="e.g. 1000" className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">Area / Barangay / District</label>
                        <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. BGC, Brgy. San Antonio" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* Pricing — hidden for jobs */}
                  {!hidePrice && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Current Price (₱) <span className="text-red-400">*</span></label>
                          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Original Price (₱) <span className="text-white/30">Optional</span></label>
                          <input
                            type="number"
                            value={form.original_price}
                            onChange={e => set('original_price', e.target.value)}
                            placeholder="Higher original price"
                            className={inputCls}
                          />
                          {form.original_price && Number(form.original_price) > 0 && Number(form.original_price) <= Number(form.price) && (
                            <p className="font-body text-[9px] text-red-400 mt-1">Original price must be higher than current price.</p>
                          )}
                          {form.original_price && Number(form.original_price) > Number(form.price) && Number(form.price) > 0 && (
                            <p className="font-body text-[9px] text-green-400 mt-1">
                              Save {Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100)}% badge will show on listing.
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-body text-[9px] text-white/30 leading-relaxed">Enter the higher, previous price you want to cross out (e.g., 1,500). Leave blank if not on sale.</p>
                      <div>
                        <label className={labelCls}>Price Display Label</label>
                        <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder={isRent ? '₱18,000/mo' : '₱3,500 neg'} className={inputCls} />
                      </div>
                    </div>
                  )}

                  {/* Condition — not for jobs/services */}
                  {!isJob && form.type !== 'services' && (
                    <div>
                      <label className={labelCls}>Condition</label>
                      <select value={form.condition} onChange={e => set('condition', e.target.value)} className={inputCls}>
                        {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                      placeholder="Describe your listing..." className={`${inputCls} resize-none`} />
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Your Name</label>
                      <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} placeholder="Name / Business" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact #</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+63 9xx" className={inputCls} />
                    </div>
                  </div>

                  {/* Publish toggle */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="publish-toggle" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
                    <label htmlFor="publish-toggle" className="font-body text-xs text-white/50">Publish publicly</label>
                  </div>

                  {/* DPA Consent */}
                  <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${dpaAccepted ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                    <input type="checkbox" id="dpa-consent" checked={dpaAccepted} onChange={e => setDpaAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#00D4FF] flex-shrink-0" />
                    <label htmlFor="dpa-consent" className="font-body text-[11px] text-white/60 leading-relaxed cursor-pointer">
                      I agree to the <span className="text-[#00D4FF]">Data Privacy Act of 2012 (Republic Act 10173)</span>. I consent to the collection and processing of my personal information for this listing and acknowledge that 1MarketPH may store and display this information publicly.
                    </label>
                  </div>

                  {/* Submit */}
                  <button onClick={handleSubmit} disabled={!form.title || submitting || !dpaAccepted}
                    className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40 hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                    {submitting
                      ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                      : 'Submit Listing'}
                  </button>

                  {isJob && (
                    <p className="font-body text-[10px] text-white/25 text-center">Job listings require admin approval before going live.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}