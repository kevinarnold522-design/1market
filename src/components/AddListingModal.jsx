import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, ChevronLeft, Image } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CategoryIcon from './CategoryIcon';

const MAIN_CATEGORIES = [
  { value: 'travel',   label: 'Travel',                   iconKey: 'travel',   color: '#0ea5e9' },
  { value: 'food',     label: 'Food',                     iconKey: 'food',     color: '#f97316' },
  { value: 'buysell',  label: 'Buy & Sell',               iconKey: 'buysell',  color: '#8b5cf6' },
  { value: 'rent',     label: 'Rent / For Sale / Lease',  iconKey: 'rent',     color: '#10b981' },
  { value: 'services', label: 'Services',                 iconKey: 'services', color: '#3b82f6' },
  { value: 'jobs',     label: 'Jobs',                     iconKey: 'jobs',     color: '#f59e0b' },
];

const TYPES_BY_MAIN = {
  travel:   [
    { value: 'hotel',          label: 'Hotel / Accommodation' },
    { value: 'flights',        label: 'Flights / Tour Package' },
    { value: 'vehicle_rental', label: 'Vehicle Rental' },
    { value: 'other',          label: 'Other Travel' },
  ],
  food:     [{ value: 'food', label: 'Food & Beverages' }],
  buysell:  [
    { value: 'product',        label: 'General Product' },
    { value: 'electronics',    label: 'Electronics' },
    { value: 'shoes',          label: 'Shoes & Footwear' },
    { value: 'clothing',       label: 'Clothing & Apparel' },
    { value: 'furniture',      label: 'Furniture' },
    { value: 'homeappliances', label: 'Home Appliances' },
    { value: 'cars',           label: 'Cars & Vehicles' },
    { value: 'houses',         label: 'Real Estate' },
    { value: 'mods',           label: 'Mods & Customizations' },
    { value: 'other',          label: 'Other / Miscellaneous' },
  ],
  rent:     [
    { value: 'rent_lease',     label: 'Property — Rent / For Sale / Lease' },
    { value: 'vehicle_rental', label: 'Vehicle Rental' },
  ],
  services: [{ value: 'services', label: 'Service Listing' }],
  jobs:     [{ value: 'jobs',     label: 'Job Posting' }],
};

const SUBS_BY_TYPE = {
  product:        ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids', 'Other'],
  electronics:    ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories', 'Printers', 'Components'],
  shoes:          ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids', 'Slip-ons', 'Heels'],
  clothing:       ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing', 'Accessories'],
  furniture:      ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen', 'Storage', 'Kids Furniture'],
  homeappliances: ['Refrigerator / Freezer', 'Washing Machine', 'Air Conditioner', 'Microwave / Oven', 'Rice Cooker', 'TV / Smart TV', 'Other Appliance'],
  cars:           ['Sedan', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Motorcycle', 'Truck', 'AUV / MPV'],
  houses:         ['House & Lot', 'Condominium', 'Townhouse', 'Apartment', 'Vacant Lot / Land', 'Commercial Lot', 'Commercial Property'],
  food:           ['Baked Goods', 'Ready-to-Eat Meals', 'Beverages', 'Snacks', 'Ingredients / Grocery', 'Desserts', 'Health Food', 'Restaurant / Carinderia', 'Home Kitchen', 'Food Stall'],
  services: [
    // 🏠 Home Services
    'House Cleaning', 'Plumbing', 'Electrical Repair', 'Carpentry', 'Roofing', 'Flooring',
    'Painting Services', 'Landscaping', 'Interior Design', 'Appliance Repair',
    'Aircon Cleaning & Repair', 'CCTV Installation', 'Pest Control', 'Home Renovation',
    // 🚗 Automotive
    'Car Repair', 'Motorcycle Repair', 'Car Wash', 'Auto Detailing', 'Vehicle Rental',
    'Towing Services', 'Driving Lessons', 'Tint Installation',
    // 💻 Technology
    'Website Development', 'Mobile App Development', 'Software Development', 'IT Support',
    'Cybersecurity', 'Cloud Services', 'AI Development', 'Chatbot Creation', 'Data Analytics',
    'Network Installation',
    // 🎨 Creative
    'Graphic Design', 'Logo Design', 'Branding', 'Animation', 'Video Editing',
    'Photography', 'Videography', 'Voice Over', 'Content Writing', 'Copywriting', 'Printing Services',
    // 📣 Marketing
    'Social Media Management', 'Facebook Ads', 'Google Ads', 'SEO Services',
    'Influencer Marketing', 'Email Marketing', 'Public Relations', 'Lead Generation',
    // 📚 Education & Training
    'Tutoring', 'Online Classes', 'Language Lessons', 'Coding Lessons',
    'Music Lessons', 'Dance Lessons', 'Review Centers', 'Skills Training',
    // 🎉 Events & Entertainment
    'Wedding Coordination', 'Event Planning', 'DJ Services', 'Event Hosting / Emcee',
    'Catering', 'Photography', 'Videography', 'Photobooth', 'Sound System Rental', 'Stage Rental',
    // 🏥 Health & Wellness
    'Fitness Coaching', 'Personal Training', 'Massage Services', 'Spa & Wellness',
    'Nutrition Coaching', 'Mental Wellness Coaching', 'Home Caregiver Services', 'Home Nursing',
    // 🐶 Pet Services
    'Pet Grooming', 'Pet Sitting', 'Dog Walking', 'Pet Training', 'Veterinary Services', 'Pet Boarding',
    // 🏢 Business & Professional
    'Accounting', 'Bookkeeping', 'Tax Filing', 'Payroll Services', 'Business Registration',
    'Legal Consultation', 'Trademark Registration', 'Business Consulting',
    'HR Services', 'Recruitment', 'Virtual Assistant',
    // 🏗️ Construction
    'General Contractors', 'Architecture', 'Civil Engineering', 'Structural Engineering',
    'Surveying Services', 'Construction Equipment Rental',
    // 🚚 Logistics & Delivery
    'Moving Services', 'Delivery Services', 'Courier Services', 'Freight Forwarding',
    'Warehousing', 'Storage Solutions',
    // 👤 Personal Services
    'Babysitting', 'Elderly Care', 'Laundry Services', 'Makeup Artist',
    'Hair Styling', 'Barbershop', 'Personal Assistant',
    // 💼 Freelance & Remote
    'Data Entry', 'Customer Support', 'Appointment Setting',
    'Research Services', 'Translation', 'Transcription', 'Resume Writing',
    // 💰 Finance & Insurance
    'Financial Advisory', 'Insurance Services', 'Real Estate Agent', 'Property Management',
    // 🌐 Other
    'Travel & Tours', 'Gaming Services', 'AI Services', 'Other / Type Manually',
  ],
  jobs:           ['Customer Service Rep', 'Technical Support', 'Software Engineer', 'Web Developer', 'IT Helpdesk', 'Staff Nurse (RN)', 'Caregiver', 'HR Generalist', 'Accountant / CPA', 'Civil Engineer', 'Electrician', 'Delivery Rider', 'Sales Executive', 'Graphic Designer', 'Cook / Chef', 'Teacher / Instructor', 'Household Helper', 'Virtual Assistant (VA)', 'Other / Not Listed'],
  rent_lease:     ['Room for Rent', 'Bedspace / Dormitory', 'Apartment / Condo', 'House', 'Townhouse', 'Commercial Space', 'Office Space', 'Bodega / Warehouse', 'Land / Vacant Lot', 'Lot for Lease', 'Commercial Lot', 'Venue / Events Space', 'Stall / Kiosk'],
  vehicle_rental: ['Car Rental', 'Van Rental', 'Motorcycle Rental', 'Truck Rental', 'Bus / Shuttle'],
  hotel:          ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Pension House', 'Airbnb / Homestay', 'Suite / Villa'],
  flights:        ['Domestic Flight Package', 'International Flight Package', 'Charter Flight', 'Tour Package (Air + Hotel)', 'Budget Promo Fare', 'Other / Type Manually'],
  mods:           ['Car Modifications', 'Motorcycle Mods', 'PC Builds / Upgrades', 'Console Mods', 'Custom Accessories'],
  other:          ['Miscellaneous', 'Collectibles', 'Art & Crafts', 'Musical Instruments', 'Plants & Garden'],
};

const ALL_CITIES = [
  'Manila', 'Quezon City', 'Makati', 'BGC / Taguig', 'Pasig', 'Mandaluyong', 'Marikina',
  'Paranaque', 'Las Pinas', 'Muntinlupa', 'Caloocan', 'Malabon', 'Navotas', 'Valenzuela',
  'Pasay', 'Pateros', 'San Juan', 'Cubao', 'Ermita / Malate', 'Intramuros / Binondo',
  'Bacoor', 'Imus', 'Dasmarinas', 'Cavite City', 'Tagaytay', 'Carmona', 'General Trias',
  'Silang', 'Alfonso', 'Kawit', 'Noveleta', 'Rosario', 'Naic', 'Tanza', 'GMA',
  'San Pablo City', 'Santa Rosa', 'Binan', 'Calamba', 'Los Banos', 'San Pedro',
  'Batangas City', 'Lipa City', 'Tanauan', 'Nasugbu',
  'Antipolo', 'Cainta', 'Taytay', 'Angono', 'San Mateo',
  'Malolos', 'Meycauayan', 'Marilao', 'San Jose del Monte', 'Santa Maria',
  'Angeles City', 'San Fernando (Pampanga)', 'Mabalacat',
  'Dagupan City', 'Urdaneta', 'Alaminos',
  'Cebu City', 'Lapu-Lapu City', 'Mandaue', 'Iloilo City', 'Bacolod', 'Dumaguete',
  'Davao City', 'Cagayan de Oro', 'Zamboanga City', 'General Santos City',
  'Palawan / Puerto Princesa', 'Boracay / Malay', 'Baguio City', 'Siargao',
  'Nationwide', 'Remote / Online / WFH',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good as New', 'Lightly Used', 'Used', 'Heavily Used', 'N/A'];
const SLIDESHOW_ANIMATIONS = [
  { value: 'fade',   label: 'Fade',   emoji: '✨', desc: 'Crossfade' },
  { value: 'slide',  label: 'Slide',  emoji: 'slide', desc: 'Slide L/R' },
  { value: 'zoom',   label: 'Zoom',   emoji: 'zoom', desc: 'Zoom in/out' },
  { value: 'flip',   label: 'Flip',   emoji: 'flip', desc: '3D flip' },
  { value: 'bounce', label: 'Bounce', emoji: 'bounce', desc: 'Bouncy' },
];

const DELIVERY_OPTIONS_BUYSELL = [
  'LBC', 'J&T Express', 'Shopee Express', 'Lazada Express', 'Lalamove',
  'GrabExpress', 'Angkas Padala', 'Flash Express', 'GoGo Xpress', 'DHL',
  'Meetup at Location', 'Pickup at My Address', 'Cash on Delivery (COD)',
];
const DELIVERY_OPTIONS_FOOD = [
  'Lalamove', 'GrabFood Delivery', 'Foodpanda Delivery',
  'Angkas Padala', 'GrabExpress', 'Pickup at Store / Kitchen',
  'Meetup / Agreed Location', 'Free Delivery (within area)', 'Cash on Delivery (COD)',
];

const FOOD_SPICE = ['Mild', 'Medium', 'Spicy', 'Extra Spicy', 'N/A'];
const FOOD_BUSINESS_TYPES = ['Home Kitchen', 'Karinderia / Carinderia', 'Bakery / Pastry Shop', 'Fast Food Chain', 'Restaurant / Resto Bar', 'Food Stall / Kiosk', 'Catering Service', 'Corporation / Franchise', 'Cloud Kitchen / Online Only', 'Other'];
const FOOD_TYPES = ['Lutong Bahay / Home-cooked', 'Baked Goods & Pastries', 'Karinderia Meals', 'Grilled / BBQ', 'Seafood', 'Noodles & Pasta', 'Rice Meals', 'Snacks & Merienda', 'Beverages & Drinks', 'Desserts & Sweets', 'Vegan / Healthy Food', 'International Cuisine', 'Street Food', 'Sari-sari / Grocery Items', 'Other'];
const JOB_EMPLOYMENT = ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship', 'WFH / Remote', 'Hybrid'];
const JOB_EXPERIENCE = ['No Experience', 'Entry Level', '1-2 Years', '3-5 Years', '5+ Years', 'Senior / Managerial'];
const SERVICE_RATE_TYPE = ['Per Hour', 'Per Day', 'Per Project', 'Monthly', 'Fixed Rate', 'Custom Quote'];
const SERVICE_AREA_TYPES = ['Nationwide', 'Regional', 'City / Municipality', 'Barangay', 'Remote / Online', 'On-site'];
const SERVICE_EXPERIENCE = ['Less than 1 year', '1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];
const AVAILABILITY_OPTIONS = ['Available Now', 'By Appointment', 'Weekdays Only', 'Weekends Only', 'Mon-Fri 8am-5pm', 'Mon-Sat 8am-6pm', '24/7 Emergency', 'Flexible / Custom'];
const PACKAGE_TIERS = ['Basic', 'Standard', 'Premium'];
const RENT_FURNISHED = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];
const RENT_PET = ['Pets Allowed', 'No Pets', 'Case to Case'];
const CAR_OWNERSHIP = ['Brand New', '1st Owner', '2nd Owner', '3rd Owner', '4th Owner', '5th Owner'];
const CAR_SALE_TYPES = ['Cash', 'Installment', 'Pasalo / Name Transfer', 'Negotiable'];
const PROPERTY_LISTING_TYPES = ['For Rent', 'For Sale', 'For Lease'];
const PROPERTY_SALE_TYPES = ['Pre-Selling', 'Ready for Occupancy (RFO)', 'Pasalo / Name Transfer', 'Regular Sale - Cash Basis'];
const PRESELLING_TURNOVER = ['12-18 months', '18-24 months', '24-30 months', '30-36 months', '36-42 months', '42-48 months', '48-60 months', '5+ years'];
const LEASE_MONTHS = [1, 2, 3, 6, 12, 18, 24, 36, 60];

const EMPTY_FORM = {
  main_category: '', type: '', subcategory: '', title: '', description: '',
  city: '', state_region: '', zip: '', area: '',
  price: '', original_price: '', price_label: '', quantity: 1,
  seller_name: '', phone: '', email_contact: '', apply_link: '',
  condition: 'Brand New', image_url: '', extra_images: [], is_active: true,
  slideshow_animation: 'fade',
  tags: '',
  custom_product_name: '',
  custom_service_name: '',
  food_serving: '', food_dietary: '', food_spice_level: 'N/A', food_allergens: '',
  food_business_type: '', food_type: '',
  delivery_options: [], meetup_details: '',
  job_employment_type: 'Full-time', job_experience: 'Entry Level', job_salary_min: '', job_salary_max: '', job_benefits: '',
  service_duration: '', service_availability: '', service_rate_type: 'Per Hour',
  service_area_type: 'City / Municipality', service_experience: '', service_team_size: '',
  service_certifications: '', service_languages: '', service_warranty: '',
  service_package_basic: '', service_package_standard: '', service_package_premium: '',
  service_online_available: false, service_mobile_available: false,
  service_emergency_available: false, service_same_day: false,
  channel_name: '',
  rent_deposit: '', rent_utilities: '', rent_furnished: 'Semi-Furnished', rent_pet_policy: 'No Pets',
  property_listing_type: 'For Rent', property_sale_type: '', property_turnover_months: '', property_lease_months: 12, property_developer: '',
  car_ownership: '1st Owner', car_sale_type: 'Cash', car_owner_name: '',
  flight_departure_date: '', flight_departure_time: '', flight_return_date: '',
};

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

function PillSelect({ options, value, onChange, color = '#00D4FF' }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className="px-3 py-1 rounded-full border font-body text-[11px] transition-all"
          style={{
            borderColor: value === o ? color : 'rgba(255,255,255,0.12)',
            background: value === o ? `${color}22` : 'rgba(255,255,255,0.04)',
            color: value === o ? color : 'rgba(255,255,255,0.5)',
          }}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function AddListingModal({ onClose, defaultType = '', defaultSubcategory = '', user }) {
  const resolvedMain = defaultType ? (Object.entries(TYPE_TO_MAIN).find(([t]) => t === defaultType)?.[1] || '') : '';

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    main_category: resolvedMain,
    type: defaultType,
    subcategory: defaultSubcategory,
    seller_name: user?.channel_name || user?.business_name || user?.full_name || '',
    email_contact: user?.show_email_public ? (user?.email || '') : '',
    channel_name: user?.channel_name || user?.business_name || '',
  });
  const [step, setStep] = useState(resolvedMain ? (defaultType ? 2 : 1) : 0);
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [dpaAccepted, setDpaAccepted] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isJob = form.type === 'jobs';
  const isRent = form.type === 'rent_lease' || form.type === 'vehicle_rental';
  const isPropertyRent = form.type === 'rent_lease';
  const isCar = form.type === 'cars';
  const isLot = (form.type === 'houses' || form.type === 'rent_lease') && 
    (form.subcategory?.toLowerCase().includes('lot') || form.subcategory?.toLowerCase().includes('land'));
  const isVehicleListing = form.type === 'cars' || form.type === 'vehicle_rental';
  const isGadget = form.type === 'electronics' || form.type === 'homeappliances';
  const hidePrice = isJob;
  const currentSubs = SUBS_BY_TYPE[form.type] || [];
  const isPropertyForSale = isPropertyRent && form.property_listing_type === 'For Sale';
  const isPropertyForLease = isPropertyRent && form.property_listing_type === 'For Lease';
  const isPropertyForRent = isPropertyRent && form.property_listing_type === 'For Rent';
  const isPreselling = isPropertyForSale && form.property_sale_type === 'Pre-Selling';

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false); e.target.value = '';
  };

  const handleExtraImageUpload = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploadingExtra(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    set('extra_images', [...(form.extra_images || []), ...urls]);
    setUploadingExtra(false); e.target.value = '';
  };

  const removeExtraImage = (idx) => set('extra_images', form.extra_images.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!form.title) return;
    setSubmitting(true);
    const locationStr = [form.city, form.state_region].filter(Boolean).join(', ') || 'Nationwide';
    await base44.entities.Listing.create({
      title: form.title, type: form.type, main_category: form.main_category, subcategory: form.subcategory,
      location: locationStr,
      area: form.area || (form.zip ? `Zip: ${form.zip}` : ''),
      full_address: [form.area, form.city, form.state_region, form.zip].filter(Boolean).join(', '),
      price: hidePrice ? 0 : (Number(form.price) || 0),
      original_price: (!hidePrice && form.original_price && Number(form.original_price) > Number(form.price)) ? Number(form.original_price) : null,
      price_label: hidePrice ? '' : form.price_label,
      description: form.description, image_url: form.image_url, extra_images: form.extra_images || [],
      phone: form.phone, seller_name: form.seller_name, email_contact: form.email_contact, apply_link: form.apply_link,
      condition: form.condition, is_active: false,
      approval_status: 'pending',
      quantity: Number(form.quantity) || 1,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean).join(',') : '',
      specs: [form.custom_product_name, form.custom_service_name].filter(Boolean).join(' | ') || undefined,
      slideshow_animation: form.slideshow_animation || 'fade',
      ...(form.type === 'food' ? { food_serving: form.food_serving, food_dietary: form.food_dietary, food_spice_level: form.food_spice_level, food_allergens: form.food_allergens, food_business_type: form.food_business_type, food_type: form.food_type, delivery_options: form.delivery_options, meetup_details: form.meetup_details } : {}),
      ...(form.main_category === 'buysell' ? { delivery_options: form.delivery_options, meetup_details: form.meetup_details } : {}),
      ...(form.type === 'jobs' ? { company_hiring: form.company_hiring || '', job_employment_type: form.job_employment_type, job_experience: form.job_experience, job_salary_min: Number(form.job_salary_min) || 0, job_salary_max: Number(form.job_salary_max) || 0, job_benefits: form.job_benefits } : {}),
      ...(form.type === 'services' ? {
        service_duration: form.service_duration,
        service_rate_type: form.service_rate_type,
        service_availability: form.service_availability,
        service_area: form.service_area_type,
        specs: [
          form.service_experience ? `Experience: ${form.service_experience}` : '',
          form.service_team_size ? `Team: ${form.service_team_size}` : '',
          form.service_languages ? `Languages: ${form.service_languages}` : '',
          form.service_certifications ? `Certified: ${form.service_certifications}` : '',
          form.service_warranty ? `Warranty: ${form.service_warranty}` : '',
          form.service_online_available ? 'Online/Remote: Yes' : '',
          form.service_mobile_available ? 'Mobile/On-site: Yes' : '',
          form.service_same_day ? 'Same Day: Yes' : '',
          form.service_emergency_available ? 'Emergency Service: Yes' : '',
          form.service_package_basic ? `Basic: ${form.service_package_basic}` : '',
          form.service_package_standard ? `Standard: ${form.service_package_standard}` : '',
          form.service_package_premium ? `Premium: ${form.service_package_premium}` : '',
        ].filter(Boolean).join(' | '),
      } : {}),
      ...(isPropertyRent ? {
        rent_deposit: form.rent_deposit, rent_utilities: form.rent_utilities, rent_furnished: form.rent_furnished, rent_pet_policy: form.rent_pet_policy,
        property_listing_type: form.property_listing_type, property_developer: form.property_developer,
        ...(isPropertyForSale ? { property_sale_type: form.property_sale_type, ...(isPreselling ? { property_turnover_months: form.property_turnover_months } : {}) } : {}),
        ...(isPropertyForLease ? { property_lease_months: Number(form.property_lease_months) } : {}),
      } : {}),
      ...(isCar ? { car_ownership: form.car_ownership, car_sale_type: form.car_sale_type, car_owner_name: form.car_owner_name } : {}),
      ...(isFlights ? { flight_departure_date: form.flight_departure_date, flight_departure_time: form.flight_departure_time, flight_return_date: form.flight_return_date } : {}),
    });
    setSubmitting(false); setDone(true);
    setTimeout(() => onClose(), 2000);
  };

  const isFlights = form.type === 'flights';
  const totalImages = (form.image_url ? 1 : 0) + (form.extra_images?.length || 0);
  const canSubmit = form.title && form.description && dpaAccepted && termsAccepted && (isCar ? legalAccepted : true) && totalImages >= 3;

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
              <h2 className="font-heading font-bold text-white text-base">Post a Listing</h2>
              <p className="font-body text-[10px] text-white/30">
                {step === 0 ? 'Step 1 — Pick a main category' : step === 1 ? 'Step 2 — Choose type' : 'Step 3 — Listing details'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {done ? (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="font-heading font-bold text-white text-lg mb-1">Listing Submitted for Review!</p>
              <p className="font-body text-sm text-white/50">Your listing is pending admin approval. You will receive an email and notification once it is reviewed.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <AnimatePresence mode="wait">

              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="font-body text-sm text-white/50 mb-4">What are you listing?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MAIN_CATEGORIES.map(mc => (
                      <button key={mc.value} onClick={() => {
                        set('main_category', mc.value);
                        const types = TYPES_BY_MAIN[mc.value];
                        if (types.length === 1) { set('type', types[0].value); setStep(2); }
                        else { set('type', ''); setStep(1); }
                      }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105"
                        style={{
                          background: form.main_category === mc.value ? `${mc.color}22` : 'rgba(255,255,255,0.04)',
                          borderColor: form.main_category === mc.value ? mc.color : 'rgba(255,255,255,0.1)',
                          boxShadow: form.main_category === mc.value ? `0 0 16px ${mc.color}44` : 'none',
                        }}>
                        <CategoryIcon name={mc.iconKey} size={28} color={mc.color} />
                        <span className="font-body font-semibold text-xs text-white text-center leading-tight">{mc.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

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
                        {form.type === t.value && <span className="text-[#00D4FF] text-xs">done</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                  {/* PHOTOS */}
                  <div>
                    <label className={labelCls}>Photos (Main + Additional)</label>
                    {form.image_url ? (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-2">
                        <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center">
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold">Main Photo</span>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/40 transition-colors mb-2">
                        {uploading
                          ? <div className="w-5 h-5 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                          : <><Upload className="w-5 h-5 text-white/25 mb-1" /><span className="font-body text-xs text-white/25">Upload Main Photo (camera or gallery)</span></>}
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    )}

                    {form.extra_images && form.extra_images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {form.extra_images.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => removeExtraImage(idx)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/90 flex items-center justify-center">
                              <X className="w-2.5 h-2.5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/10 cursor-pointer hover:border-[#00D4FF]/30 transition-colors">
                      {uploadingExtra
                        ? <div className="w-4 h-4 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                        : <><Image className="w-4 h-4 text-white/30" /><span className="font-body text-xs text-white/30">Add More Photos from device</span></>}
                      <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={handleExtraImageUpload} disabled={uploadingExtra} />
                    </label>
                  </div>

                  {/* IMAGE COUNT WARNING */}
                  {totalImages < 3 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <span className="font-body text-[11px] text-amber-400">⚠️ At least 3 photos required ({totalImages}/3 uploaded)</span>
                    </div>
                  )}

                  {/* TITLE */}
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Listing title..." className={inputCls} />
                  </div>

                  {/* SUBCATEGORY — Jobs gets special manual-entry fallback */}
                  {currentSubs.length > 0 && (
                    <div>
                      <label className={labelCls}>{isJob ? 'Job Position / Role' : 'Subcategory'}</label>
                      {isJob ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {currentSubs.filter(s => s !== 'Other / Not Listed').map(s => (
                              <button key={s} type="button" onClick={() => set('subcategory', s)}
                                className="px-2.5 py-1 rounded-full border font-body text-[11px] transition-all"
                                style={{
                                  borderColor: form.subcategory === s ? '#f59e0b' : 'rgba(255,255,255,0.12)',
                                  background: form.subcategory === s ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.04)',
                                  color: form.subcategory === s ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                                }}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              value={!currentSubs.filter(s => s !== 'Other / Not Listed').includes(form.subcategory) ? form.subcategory : ''}
                              onChange={e => set('subcategory', e.target.value)}
                              placeholder="Or type your own job title / position..."
                              className={inputCls}
                            />
                          </div>
                          {form.subcategory && (
                            <p className="font-body text-[10px] text-amber-400">Selected: {form.subcategory}</p>
                          )}
                        </div>
                      ) : (
                        <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)} className={inputCls}>
                          <option value="" className="bg-[#0D1F3C]">Select subcategory</option>
                          {currentSubs.map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
                        </select>
                      )}
                    </div>
                  )}

                  {/* FLIGHT DATE/TIME FIELDS */}
                  {isFlights && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.25)' }}>
                      <p className="font-body text-[10px] font-bold text-sky-400 uppercase tracking-wider">Flight / Tour Schedule</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Departure Date</label>
                          <input type="date" value={form.flight_departure_date} onChange={e => set('flight_departure_date', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Departure Time</label>
                          <input type="time" value={form.flight_departure_time} onChange={e => set('flight_departure_time', e.target.value)} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Return Date (optional)</label>
                        <input type="date" value={form.flight_return_date} onChange={e => set('flight_return_date', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  )}

                  {/* LOT / LAND AREA FIELDS */}
                  {isLot && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <p className="font-body text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Lot / Land Details</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Lot Area (sqm) Min</label>
                          <input type="number" value={form.lot_area_min || ''} onChange={e => set('lot_area_min', e.target.value)} placeholder="e.g. 100" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Lot Area (sqm) Max</label>
                          <input type="number" value={form.lot_area_max || ''} onChange={e => set('lot_area_max', e.target.value)} placeholder="e.g. 500" className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Floor Area (sqm) — optional</label>
                          <input type="number" value={form.floor_area || ''} onChange={e => set('floor_area', e.target.value)} placeholder="e.g. 80" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Zoning</label>
                          <input value={form.zoning || ''} onChange={e => set('zoning', e.target.value)} placeholder="e.g. Residential, Commercial" className={inputCls} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CAR DETAILS */}
                  {isCar && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.25)' }}>
                      <p className="font-body text-[10px] font-bold text-purple-400 uppercase tracking-wider">Vehicle Details</p>
                      <div>
                        <label className={labelCls}>Ownership</label>
                        <PillSelect options={CAR_OWNERSHIP} value={form.car_ownership} onChange={v => set('car_ownership', v)} color="#8b5cf6" />
                      </div>
                      <div>
                        <label className={labelCls}>Sale Type</label>
                        <PillSelect options={CAR_SALE_TYPES} value={form.car_sale_type} onChange={v => set('car_sale_type', v)} color="#8b5cf6" />
                      </div>
                      <div>
                        <label className={labelCls}>Car Owner Full Name</label>
                        <input value={form.car_owner_name} onChange={e => set('car_owner_name', e.target.value)} placeholder="Full legal name of owner" className={inputCls} />
                      </div>
                      <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${legalAccepted ? 'border-orange-400/40 bg-orange-400/5' : 'border-red-500/30 bg-red-500/5'}`}>
                        <input type="checkbox" id="legal-ack" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#00D4FF] flex-shrink-0" />
                        <label htmlFor="legal-ack" className="font-body text-[11px] text-white/60 leading-relaxed cursor-pointer">
                          I acknowledge that providing false or misleading information about this vehicle (ownership, condition, price) may result in legal liability. 1MarketPH is not liable for any disputes or misrepresentation arising from this listing. I confirm all details are truthful and accurate.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* PROPERTY TYPE */}
                  {isPropertyRent && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <p className="font-body text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Property Listing Type</p>
                      <div className="grid grid-cols-3 gap-2">
                        {PROPERTY_LISTING_TYPES.map(t => (
                          <button key={t} type="button" onClick={() => set('property_listing_type', t)}
                            className="py-2.5 rounded-xl border font-body text-xs font-bold transition-all"
                            style={{
                              borderColor: form.property_listing_type === t ? '#10b981' : 'rgba(255,255,255,0.1)',
                              background: form.property_listing_type === t ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                              color: form.property_listing_type === t ? '#34d399' : 'rgba(255,255,255,0.5)',
                            }}>
                            {t}
                          </button>
                        ))}
                      </div>

                      {isPropertyForSale && (
                        <div className="space-y-2">
                          <label className={labelCls}>Sale Classification</label>
                          <div className="grid grid-cols-2 gap-2">
                            {PROPERTY_SALE_TYPES.map(t => (
                              <button key={t} type="button" onClick={() => set('property_sale_type', t)}
                                className="py-2 px-3 rounded-xl border font-body text-xs text-left transition-all"
                                style={{
                                  borderColor: form.property_sale_type === t ? '#00D4FF' : 'rgba(255,255,255,0.1)',
                                  background: form.property_sale_type === t ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                                  color: form.property_sale_type === t ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                                }}>
                                {t}
                              </button>
                            ))}
                          </div>
                          {isPreselling && (
                            <div>
                              <label className={labelCls}>Estimated Turnover Period</label>
                              <select value={form.property_turnover_months} onChange={e => set('property_turnover_months', e.target.value)} className={inputCls}>
                                <option value="" className="bg-[#0D1F3C]">Select turnover period</option>
                                {PRESELLING_TURNOVER.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      {isPropertyForLease && (
                        <div>
                          <label className={labelCls}>Lease Duration</label>
                          <select value={form.property_lease_months} onChange={e => set('property_lease_months', e.target.value)} className={inputCls}>
                            {LEASE_MONTHS.map(m => <option key={m} value={m} className="bg-[#0D1F3C]">{m} month{m > 1 ? 's' : ''}</option>)}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className={labelCls}>Property Developer (optional)</label>
                        <input value={form.property_developer} onChange={e => set('property_developer', e.target.value)} placeholder="e.g. Ayala Land, SM Prime, DMCI, Filinvest..." className={inputCls} />
                      </div>

                      {(isPropertyForRent || isPropertyForLease) && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={labelCls}>Furnished?</label>
                            <select value={form.rent_furnished} onChange={e => set('rent_furnished', e.target.value)} className={inputCls}>
                              {RENT_FURNISHED.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Pet Policy</label>
                            <select value={form.rent_pet_policy} onChange={e => set('rent_pet_policy', e.target.value)} className={inputCls}>
                              {RENT_PET.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                            </select>
                          </div>
                          <div><label className={labelCls}>Deposit Terms</label><input value={form.rent_deposit} onChange={e => set('rent_deposit', e.target.value)} placeholder="e.g. 2 months deposit" className={inputCls} /></div>
                          <div><label className={labelCls}>Utilities</label><input value={form.rent_utilities} onChange={e => set('rent_utilities', e.target.value)} placeholder="e.g. Meralco included" className={inputCls} /></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FOOD DETAILS */}
                  {form.type === 'food' && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
                      <p className="font-body text-[10px] font-bold text-orange-400 uppercase tracking-wider">Food Business Details</p>

                      <div>
                        <label className={labelCls}>Food Business Type *</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {FOOD_BUSINESS_TYPES.map(bt => (
                            <button key={bt} type="button" onClick={() => set('food_business_type', bt)}
                              className="py-2 px-3 rounded-xl border font-body text-xs text-left transition-all"
                              style={{
                                borderColor: form.food_business_type === bt ? '#f97316' : 'rgba(255,255,255,0.1)',
                                background: form.food_business_type === bt ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.04)',
                                color: form.food_business_type === bt ? '#fb923c' : 'rgba(255,255,255,0.5)',
                              }}>
                              {bt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Type of Food Being Sold *</label>
                        <div className="flex flex-wrap gap-1.5">
                          {FOOD_TYPES.map(ft => (
                            <button key={ft} type="button" onClick={() => set('food_type', ft)}
                              className="px-2.5 py-1 rounded-full border font-body text-[11px] transition-all"
                              style={{
                                borderColor: form.food_type === ft ? '#f97316' : 'rgba(255,255,255,0.1)',
                                background: form.food_type === ft ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.04)',
                                color: form.food_type === ft ? '#fb923c' : 'rgba(255,255,255,0.4)',
                              }}>
                              {ft}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={labelCls}>Serving Size</label><input value={form.food_serving} onChange={e => set('food_serving', e.target.value)} placeholder="e.g. Good for 2" className={inputCls} /></div>
                        <div><label className={labelCls}>Dietary Info</label><input value={form.food_dietary} onChange={e => set('food_dietary', e.target.value)} placeholder="e.g. Halal, Vegan" className={inputCls} /></div>
                        <div><label className={labelCls}>Allergens</label><input value={form.food_allergens} onChange={e => set('food_allergens', e.target.value)} placeholder="e.g. Nuts, Dairy" className={inputCls} /></div>
                        <div>
                          <label className={labelCls}>Spice Level</label>
                          <select value={form.food_spice_level} onChange={e => set('food_spice_level', e.target.value)} className={inputCls}>
                            {FOOD_SPICE.map(s => <option key={s} value={s} className="bg-[#0D1F3C]">{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* JOB DETAILS */}
                  {form.type === 'jobs' && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="font-body text-[10px] font-bold text-amber-400 uppercase tracking-wider">Job Details</p>
                      <div><label className={labelCls}>Company Hiring *</label><input value={form.company_hiring || ''} onChange={e => set('company_hiring', e.target.value)} placeholder="e.g. Jollibee, BDO, SM Retail, Private Company..." className={inputCls} /></div>
                      <div><label className={labelCls}>Application Link (optional)</label><input value={form.apply_link} onChange={e => set('apply_link', e.target.value)} placeholder="https://..." className={inputCls} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Employment Type</label>
                          <select value={form.job_employment_type} onChange={e => set('job_employment_type', e.target.value)} className={inputCls}>
                            {JOB_EMPLOYMENT.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Experience Required</label>
                          <select value={form.job_experience} onChange={e => set('job_experience', e.target.value)} className={inputCls}>
                            {JOB_EXPERIENCE.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                          </select>
                        </div>
                        <div><label className={labelCls}>Salary Min</label><input type="number" value={form.job_salary_min} onChange={e => set('job_salary_min', e.target.value)} placeholder="18000" className={inputCls} /></div>
                        <div><label className={labelCls}>Salary Max</label><input type="number" value={form.job_salary_max} onChange={e => set('job_salary_max', e.target.value)} placeholder="30000" className={inputCls} /></div>
                      </div>
                      <div><label className={labelCls}>Benefits</label><input value={form.job_benefits} onChange={e => set('job_benefits', e.target.value)} placeholder="e.g. SSS, PhilHealth, HMO, 13th month" className={inputCls} /></div>
                    </div>
                  )}

                  {/* SERVICE DETAILS */}
                  {form.type === 'services' && (
                    <div className="rounded-xl p-3 space-y-4" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <p className="font-body text-[10px] font-bold text-blue-400 uppercase tracking-wider">Service Details</p>

                      {/* Channel / Business Name */}
                      <div>
                        <label className={labelCls}>Channel / Business Name (Public)</label>
                        <input value={form.channel_name} onChange={e => set('channel_name', e.target.value)} placeholder="e.g. Kevin's Repair Shop, CleanPro Services..." className={inputCls} />
                        <p className="font-body text-[9px] text-white/25 mt-1">This name will be shown publicly instead of your personal name.</p>
                      </div>

                      {/* Rate & Duration */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Rate Type</label>
                          <select value={form.service_rate_type} onChange={e => set('service_rate_type', e.target.value)} className={inputCls}>
                            {SERVICE_RATE_TYPE.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                          </select>
                        </div>
                        <div><label className={labelCls}>Duration / Est. Time</label><input value={form.service_duration} onChange={e => set('service_duration', e.target.value)} placeholder="e.g. 2 hours, 1 day" className={inputCls} /></div>
                      </div>

                      {/* Service Area */}
                      <div>
                        <label className={labelCls}>Service Area Type</label>
                        <div className="flex flex-wrap gap-1.5">
                          {SERVICE_AREA_TYPES.map(a => (
                            <button key={a} type="button" onClick={() => set('service_area_type', a)}
                              className="px-2.5 py-1 rounded-full border font-body text-[11px] transition-all"
                              style={{
                                borderColor: form.service_area_type === a ? '#3b82f6' : 'rgba(255,255,255,0.12)',
                                background: form.service_area_type === a ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
                                color: form.service_area_type === a ? '#60a5fa' : 'rgba(255,255,255,0.5)',
                              }}>{a}</button>
                          ))}
                        </div>
                      </div>

                      {/* Quick toggles */}
                      <div>
                        <label className={labelCls}>Service Options</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'service_online_available', label: '💻 Online / Remote' },
                            { key: 'service_mobile_available', label: '🚗 Mobile / On-site' },
                            { key: 'service_same_day', label: '⚡ Same Day Available' },
                            { key: 'service_emergency_available', label: '🚨 Emergency Service' },
                          ].map(({ key, label }) => (
                            <button key={key} type="button" onClick={() => set(key, !form[key])}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-left"
                              style={{
                                borderColor: form[key] ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                background: form[key] ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                              }}>
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${form[key] ? 'bg-blue-400' : 'bg-white/20'}`} />
                              <span className="font-body text-[11px] text-white/70">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Availability & Experience */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Availability</label>
                          <select value={form.service_availability} onChange={e => set('service_availability', e.target.value)} className={inputCls}>
                            <option value="" className="bg-[#0D1F3C]">Select availability</option>
                            {AVAILABILITY_OPTIONS.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Years of Experience</label>
                          <select value={form.service_experience} onChange={e => set('service_experience', e.target.value)} className={inputCls}>
                            <option value="" className="bg-[#0D1F3C]">Select</option>
                            {SERVICE_EXPERIENCE.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
                          </select>
                        </div>
                        <div><label className={labelCls}>Team Size</label><input value={form.service_team_size} onChange={e => set('service_team_size', e.target.value)} placeholder="e.g. Solo, 2-5 people" className={inputCls} /></div>
                        <div><label className={labelCls}>Languages Spoken</label><input value={form.service_languages} onChange={e => set('service_languages', e.target.value)} placeholder="e.g. Filipino, English" className={inputCls} /></div>
                      </div>

                      {/* Certifications & Warranty */}
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={labelCls}>Licenses / Certifications</label><input value={form.service_certifications} onChange={e => set('service_certifications', e.target.value)} placeholder="e.g. PRC Licensed, DTI Registered" className={inputCls} /></div>
                        <div><label className={labelCls}>Warranty / Guarantee</label><input value={form.service_warranty} onChange={e => set('service_warranty', e.target.value)} placeholder="e.g. 30-day workmanship warranty" className={inputCls} /></div>
                      </div>

                      {/* Packages */}
                      <div>
                        <label className={labelCls}>Service Packages (optional)</label>
                        <div className="space-y-2">
                          {[
                            { key: 'service_package_basic', label: '🥉 Basic Package', placeholder: 'e.g. Basic cleaning ₱500 — 1 room, 1hr' },
                            { key: 'service_package_standard', label: '🥈 Standard Package', placeholder: 'e.g. Standard ₱1,200 — 3 rooms, full clean' },
                            { key: 'service_package_premium', label: '🥇 Premium Package', placeholder: 'e.g. Premium ₱2,500 — whole house + deep clean' },
                          ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                              <label className="block font-body text-[9px] text-white/30 mb-1">{label}</label>
                              <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LOCATION */}
                  <div>
                    <label className={labelCls}>Location and Address</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">City / Municipality</label>
                        <input list="city-list-modal" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Manila" className={inputCls} />
                        <datalist id="city-list-modal">{ALL_CITIES.map(c => <option key={c} value={c} />)}</datalist>
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">Province / Region</label>
                        <input value={form.state_region} onChange={e => set('state_region', e.target.value)} placeholder="e.g. Metro Manila" className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">Zip / Postal Code</label>
                        <input value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="e.g. 1000" className={inputCls} />
                      </div>
                      <div>
                        <label className="block font-body text-[9px] text-white/30 mb-1">Barangay / Area / District</label>
                        <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. Brgy. San Antonio" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="space-y-2">
                    <div>
                      <label className={labelCls}>Channel / Business Name (Public Display)</label>
                      <input value={form.channel_name} onChange={e => { set('channel_name', e.target.value); set('seller_name', e.target.value); }} placeholder="e.g. Juan's Store, CleanPro PH — shown publicly" className={inputCls} />
                      <p className="font-body text-[9px] text-white/25 mt-1">This replaces your personal name on the public listing.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelCls}>Contact Number (optional)</label>
                        <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+63 9xx xxx xxxx" className={inputCls} />
                        <p className="font-body text-[9px] text-white/25 mt-0.5">Hidden by default unless enabled in settings</p>
                      </div>
                      <div>
                        <label className={labelCls}>Email Contact (optional)</label>
                        <input value={form.email_contact} onChange={e => set('email_contact', e.target.value)} placeholder="youremail@mail.com" className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* PRICING */}
                  {!hidePrice && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Price (PHP)</label>
                          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Compare-at Price (optional)</label>
                          <input type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="Higher original" className={inputCls} />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Price Display Label</label>
                          <input value={form.price_label} onChange={e => set('price_label', e.target.value)} placeholder={isRent ? '18,000/mo' : '3,500 neg'} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Quantity / Stock</label>
                          <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', Math.max(1, parseInt(e.target.value) || 1))} className={inputCls} />
                        </div>
                        </div>
                    </div>
                  )}

                  {/* CONDITION */}
                  {!isJob && form.type !== 'services' && !isPropertyRent && (
                    <div>
                      <label className={labelCls}>Condition</label>
                      <select value={form.condition} onChange={e => set('condition', e.target.value)} className={inputCls}>
                        {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0D1F3C]">{c}</option>)}
                      </select>
                    </div>
                  )}

                  {/* DELIVERY OPTIONS — buysell & food */}
                  {(form.main_category === 'buysell' || form.type === 'food') && (
                    <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.25)' }}>
                      <p className="font-body text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        🚚 Delivery / Pickup Options
                      </p>
                      <p className="font-body text-[10px] text-white/35">Select all that apply — shown to buyers on your listing.</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(form.type === 'food' ? DELIVERY_OPTIONS_FOOD : DELIVERY_OPTIONS_BUYSELL).map(opt => {
                          const active = (form.delivery_options || []).includes(opt);
                          return (
                            <button key={opt} type="button"
                              onClick={() => {
                                const curr = form.delivery_options || [];
                                set('delivery_options', active ? curr.filter(d => d !== opt) : [...curr, opt]);
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-xl border font-body text-[11px] text-left transition-all"
                              style={{
                                borderColor: active ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                                background: active ? 'rgba(139,92,246,0.18)' : 'rgba(255,255,255,0.03)',
                                color: active ? '#c084fc' : 'rgba(255,255,255,0.45)',
                              }}>
                              <div className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ background: active ? '#8b5cf6' : 'rgba(255,255,255,0.15)' }} />
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {(form.delivery_options || []).some(d => d.toLowerCase().includes('meetup') || d.toLowerCase().includes('pickup')) && (
                        <div>
                          <label className={labelCls}>Meetup / Pickup Location Details</label>
                          <input value={form.meetup_details} onChange={e => set('meetup_details', e.target.value)}
                            placeholder="e.g. SM Bacoor, near 7-Eleven Molino, etc." className={inputCls} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* DESCRIPTION */}
                  <div>
                    <label className={labelCls}>Description * (Required)</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                      placeholder={
                        isVehicleListing ? "Describe the vehicle: year, make, model, mileage, color, condition, features, accident history, reason for selling..." :
                        isGadget ? "Describe the gadget: brand, model, specs, storage, color, condition, included accessories, warranty status..." :
                        isPropertyRent || form.type === 'houses' ? "Describe the property: size (sqm), number of rooms, floors, amenities, nearby landmarks, parking, utilities..." :
                        "Describe your listing in detail..."
                      }
                      className={`${inputCls} resize-none`} />
                  </div>

                  {/* MANUAL NAME — Buy & Sell */}
                  {(form.main_category === 'buysell') && (
                    <div>
                      <label className={labelCls}>Manually Specify Product (optional)</label>
                      <input value={form.custom_product_name} onChange={e => set('custom_product_name', e.target.value)}
                        placeholder="e.g. Handmade Carved Wooden Shelf, Custom Sneakers..." className={inputCls} />
                    </div>
                  )}

                  {/* MANUAL NAME — Services */}
                  {(form.type === 'services') && (
                    <div>
                      <label className={labelCls}>Manually Specify Service Offered (optional)</label>
                      <input value={form.custom_service_name} onChange={e => set('custom_service_name', e.target.value)}
                        placeholder="e.g. Custom Wedding Invitations, Mobile Car Detailing..." className={inputCls} />
                    </div>
                  )}

                  {/* TAGS / SEARCH KEYWORDS */}
                  <div>
                    <label className={labelCls}>Search Tags (comma-separated)</label>
                    <input value={form.tags} onChange={e => set('tags', e.target.value)}
                      placeholder="e.g. laptop, second hand, gaming, Cavite, cheap" className={inputCls} />
                    <p className="font-body text-[9px] text-white/25 mt-1">Add keywords to help buyers find your listing faster</p>
                  </div>

                  {/* SLIDESHOW ANIMATION */}
                  <div>
                    <label className={labelCls}>Image Gallery Animation</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {SLIDESHOW_ANIMATIONS.map(a => (
                        <button key={a.value} type="button" onClick={() => set('slideshow_animation', a.value)}
                          className="flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all text-center"
                          style={{
                            borderColor: form.slideshow_animation === a.value ? '#00D4FF' : 'rgba(255,255,255,0.1)',
                            background: form.slideshow_animation === a.value ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                          }}>
                          <span className="font-body text-[10px] font-bold text-white/70">{a.label}</span>
                          <span className="font-body text-[9px] text-white/30 leading-tight">{a.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PUBLISH TOGGLE */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="publish-toggle" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-3.5 h-3.5 accent-[#00D4FF]" />
                    <label htmlFor="publish-toggle" className="font-body text-xs text-white/50">Publish publicly</label>
                  </div>

                  {/* DPA CONSENT */}
                  <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${dpaAccepted ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                    <input type="checkbox" id="dpa-consent" checked={dpaAccepted} onChange={e => setDpaAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#00D4FF] flex-shrink-0" />
                    <label htmlFor="dpa-consent" className="font-body text-[11px] text-white/60 leading-relaxed cursor-pointer">
                      I agree to the Data Privacy Act of 2012 (RA 10173). I consent to the collection and processing of my personal information for this listing. 1MarketPH may store and display this publicly.
                    </label>
                  </div>

                  {/* FULL LEGAL TERMS & CONDITIONS */}
                  <div className={`p-3 rounded-xl border space-y-2 ${termsAccepted ? 'border-blue-500/30 bg-blue-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <p className="font-body text-[10px] font-bold text-white/50 uppercase tracking-wider">Terms & Conditions — Required</p>
                    <div className="max-h-28 overflow-y-auto pr-1">
                      <p className="font-body text-[10px] text-white/50 leading-relaxed">
                        By agreeing to these Terms and Conditions, you promise to have no false or inaccurate information on the listed item/service published. 1MarketPH does not promote or tolerate the promotion of illegal drugs, gambling, harmful products, or products that can cause physical or immediate danger to any buyers or users.
                        <br /><br />
                        By accepting these terms you legally agree that 1MarketPH is not liable for any illegal products promoted on its platform, but has full legal authority to ensure that forms of damages caused by any misrepresentation, false advertisement, or the promotion of dangerous products or illegal drugs constitutes an act of endangering 1MarketPH's reputation and is in violation of Philippine laws. Therefore any forms of damages can be recovered through legal means.
                        <br /><br />
                        By clicking Submit, this listing will be reviewed by our Approval Team. Once fully approved, you will receive an approval email and notification.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 pt-1">
                      <input type="checkbox" id="terms-consent" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#00D4FF] flex-shrink-0" />
                      <label htmlFor="terms-consent" className="font-body text-[11px] text-white/70 leading-relaxed cursor-pointer font-semibold">
                        I have read and agree to the 1MarketPH Terms and Conditions above.
                      </label>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                    className="w-full py-3 rounded-xl font-body font-bold text-sm text-white transition-all disabled:opacity-40 hover:scale-[1.01] flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#0033CC,#2563EB)', boxShadow: '0 0 20px rgba(37,99,235,0.5)' }}>
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting for Review...</>
                      : 'Submit for Admin Review'}
                  </button>

                  {isCar && !legalAccepted && (
                    <p className="font-body text-[10px] text-orange-400 text-center">Please acknowledge the legal liability checkbox above.</p>
                  )}
                  {!form.description && (
                    <p className="font-body text-[10px] text-red-400 text-center">Description is required.</p>
                  )}
                  {totalImages < 3 && (
                    <p className="font-body text-[10px] text-amber-400 text-center">Minimum 3 photos required ({totalImages}/3).</p>
                  )}
                  <p className="font-body text-[10px] text-white/25 text-center">All listings are reviewed by our team before going live. You will be notified by email once approved.</p>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}