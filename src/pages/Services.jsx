import React, { useState, useEffect } from 'react';
import StarField from '../components/StarField';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Phone, MessageSquare, Star, AlertCircle, Plus, Pencil, Trash2, X, Home, Zap, Heart, UtensilsCrossed, Briefcase, GraduationCap, Scale, Plane, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberSignupModal from '../components/MemberSignupModal';
import AddListingModal from '../components/AddListingModal.jsx';
import PostListingMenu from '../components/PostListingMenu';
import { base44 } from '@/api/base44Client';

const SUBCATEGORIES = [
  { key: 'all', label: 'All Services', desc: 'Browse everything', icon: ShoppingBag },
  { key: 'home', label: 'Home Services', desc: 'Cleaning, repairs, plumbing', icon: Home },
  { key: 'tech', label: 'Tech & Digital', desc: 'IT, web, design, repair', icon: Zap },
  { key: 'beauty', label: 'Beauty & Wellness', desc: 'Salon, spa, massage, nails', icon: Heart },
  { key: 'events', label: 'Events & Catering', desc: 'Planning, catering, DJ', icon: UtensilsCrossed },
  { key: 'professional', label: 'Professional', desc: 'Legal, financial, HR', icon: Briefcase },
  { key: 'transport', label: 'Transport & Delivery', desc: 'Movers, courier, trucking', icon: Plane },
  { key: 'health', label: 'Health & Medical', desc: 'Dental, therapy, caregiving', icon: Heart },
  { key: 'legal', label: 'Legal Services', desc: 'Lawyers, notary, contracts', icon: Scale },
  { key: 'finance', label: 'Finance & Tax', desc: 'Accounting, tax, investment', icon: Briefcase },
  { key: 'education', label: 'Education & Tutoring', desc: 'Tutors, coaching, training', icon: GraduationCap },
  { key: 'media', label: 'Media & Creative', desc: 'Video, design, photography', icon: Zap },
];

const services = [];
const _REMOVED_FAKE_SERVICES = [
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
  { id: 28, type: 'professional', title: 'Civil & Criminal Lawyer', provider: 'Atty. Dela Cruz Law Office', rate: '₱5,000–₱50,000/case', location: 'Both', area: 'Manila & Cavite', stars: 4.8, reviews: 22, image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=500&q=80', desc: 'Civil cases, criminal defense, annulment, labor law. Free first consultation.', contact: '09171234556' },
  { id: 29, type: 'professional', title: 'Real Estate Lawyer', provider: 'LandRight Legal PH', rate: '₱3,000–₱15,000', location: 'Manila', area: 'Makati, Manila', stars: 4.7, reviews: 15, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80', desc: 'Title transfer, deed of sale, land disputes. Same-day consultation.', contact: '09189998877' },
  { id: 30, type: 'professional', title: 'Business Registration & SEC Filing', provider: 'BizStart PH', rate: '₱2,000–₱8,000', location: 'Both', area: 'Remote / Manila', stars: 4.6, reviews: 31, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80', desc: 'DTI, SEC, BIR registration. Corporation & sole proprietorship setup.', contact: '09201112233' },
  { id: 31, type: 'professional', title: 'Immigration & Visa Consultant', provider: 'PassPH Visa Assistance', rate: '₱2,500–₱10,000', location: 'Manila', area: 'Pasay, Manila', stars: 4.5, reviews: 19, image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&q=80', desc: 'Tourist, student, work visa processing. Document preparation.', contact: '09195556677' },
  { id: 32, type: 'professional', title: 'HR & Recruitment Services', provider: 'HireRight PH', rate: '₱5,000–₱20,000/hire', location: 'Both', area: 'Remote / Metro Manila', stars: 4.7, reviews: 14, image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80', desc: 'End-to-end hiring, background checks, employee onboarding.', contact: '09175544332' },
  { id: 33, type: 'professional', title: 'Online English Tutor', provider: 'SpeakUp PH', rate: '₱250/hr', location: 'Both', area: 'Remote / Nationwide', stars: 4.9, reviews: 88, image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&q=80', desc: 'Conversational English, IELTS prep, business English. Flexible schedule.', contact: '09163344556' },
  { id: 34, type: 'professional', title: 'Financial Planning & Investment', provider: 'WealthPH Advisors', rate: '₱1,500–₱5,000/session', location: 'Both', area: 'Remote / Manila', stars: 4.8, reviews: 26, image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=80', desc: 'Personal finance, mutual funds, UITF, insurance planning.', contact: '09221009988' },

  // TRANSPORT
  { id: 35, type: 'transport', title: 'Trucking & Cargo Services', provider: 'BagoBag Trucking', rate: '₱1,800–₱5,000/trip', location: 'Both', area: 'Metro Manila & Cavite', stars: 4.6, reviews: 72, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80', desc: '10-wheeler, 6-wheeler, and closed van. Point-to-point delivery.', contact: '09305554433' },
  { id: 36, type: 'transport', title: 'Courier & Same-Day Delivery', provider: 'SpeedDrop Courier', rate: '₱80–₱200/delivery', location: 'Manila', area: 'Metro Manila', stars: 4.8, reviews: 214, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80', desc: 'Documents, packages, food. 2-hour delivery time. With tracking.', contact: '09197775566' },
  { id: 37, type: 'transport', title: 'Airport Taxi / Transfer', provider: 'AirportRide PH', rate: '₱500–₱1,500/trip', location: 'Both', area: 'NAIA / Cavite', stars: 4.7, reviews: 103, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', desc: 'Reliable airport pickup & drop-off. 24/7. With confirmation text.', contact: '09178881122' },
  { id: 38, type: 'transport', title: 'Motorcycle Delivery (Habal-habal)', provider: 'FastRide Cavite', rate: '₱60–₱150/trip', location: 'Cavite', area: 'Bacoor & Imus', stars: 4.5, reviews: 58, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', desc: 'Small packages, documents, food. Fast local delivery within Cavite.', contact: '09305556789' },

  // HEALTH
  { id: 39, type: 'health', title: 'Home Care / Caregiver Services', provider: 'CareLink PH', rate: '₱600–₱900/day', location: 'Both', area: 'Manila & Cavite', stars: 4.8, reviews: 47, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80', desc: 'Elderly care, post-op care, PWD assistance. Background-checked caregivers.', contact: '09164323400' },
  { id: 40, type: 'health', title: 'Home Service Dental Check-up', provider: 'Dr. Santos DDS', rate: '₱500–₱3,000/procedure', location: 'Cavite', area: 'Imus & Bacoor', stars: 4.9, reviews: 33, image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&q=80', desc: 'Cleaning, extraction, fluoride. Mobile dental service. By appointment.', contact: '09221115566' },
  { id: 41, type: 'health', title: 'Online Doctor Consultation', provider: 'DocPH Telehealth', rate: '₱299–₱800/session', location: 'Both', area: 'Nationwide / Remote', stars: 4.8, reviews: 112, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80', desc: 'General physician, specialist referral, prescriptions. Via video call.', contact: '09181234000' },
  { id: 42, type: 'health', title: 'Physical Therapy – Home Visit', provider: 'PhysioMovePH', rate: '₱800–₱1,500/session', location: 'Manila', area: 'Metro Manila', stars: 4.7, reviews: 41, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80', desc: 'Stroke rehab, musculoskeletal therapy, sports injury recovery.', contact: '09192223344' },
  { id: 43, type: 'health', title: 'Mental Health Counseling', provider: 'MindBridge PH', rate: '₱1,200–₱2,500/hr', location: 'Both', area: 'Remote / Manila', stars: 4.9, reviews: 57, image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=500&q=80', desc: 'Licensed psychologists. Anxiety, depression, relationship issues. Online available.', contact: '09174445566' },
  { id: 44, type: 'health', title: 'Nutritionist / Dietitian', provider: 'NutriGuide PH', rate: '₱700–₱1,500/consultation', location: 'Both', area: 'Remote / Cavite', stars: 4.6, reviews: 28, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80', desc: 'Personalized meal plans, weight management, sports nutrition. Online consult.', contact: '09208889900' },

  // ADDITIONAL SERVICES
  { id: 45, type: 'home', title: 'Electrician – Emergency Services', provider: 'QuickWire PH', rate: '₱500–₱2,000', location: 'Both', area: 'Manila & Cavite', stars: 4.7, reviews: 84, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80', desc: 'Wiring, breaker repairs, panel installation. 24/7 emergency response.', contact: '09175432100' },
  { id: 46, type: 'home', title: 'Swimming Pool Cleaning', provider: 'PoolPro Cavite', rate: '₱1,500–₱3,000/cleaning', location: 'Cavite', area: 'Tagaytay & Bacoor', stars: 4.6, reviews: 22, image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&q=80', desc: 'Pool maintenance, chemical balancing, equipment repair.', contact: '09306665544' },
  { id: 47, type: 'home', title: 'Landscape & Garden Design', provider: 'GreenScape PH', rate: '₱2,000–₱15,000', location: 'Cavite', area: 'Cavite City & Tagaytay', stars: 4.8, reviews: 37, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80', desc: 'Garden layout, plant sourcing, irrigation setup. Free site visit.', contact: '09194448877' },
  { id: 48, type: 'tech', title: 'Mobile App Development', provider: 'CodePH Studio', rate: '₱30,000–₱120,000/app', location: 'Both', area: 'Remote / Manila', stars: 4.8, reviews: 19, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80', desc: 'iOS & Android apps. React Native, Flutter. NDA available.', contact: '09177009988' },
  { id: 49, type: 'tech', title: 'Network & IT Setup', provider: 'NetCraft PH', rate: '₱3,000–₱15,000', location: 'Both', area: 'Metro Manila & Cavite', stars: 4.7, reviews: 43, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80', desc: 'Office network, WiFi setup, server installation, troubleshooting.', contact: '09166671234' },
  { id: 50, type: 'tech', title: 'Video Editing Services', provider: 'CutPH Media', rate: '₱1,000–₱5,000/video', location: 'Both', area: 'Remote / Nationwide', stars: 4.9, reviews: 75, image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80', desc: 'YouTube, TikTok, reels, event highlights. Fast turnaround.', contact: '09203335566' },
  { id: 51, type: 'events', title: 'Live Band & Music Entertainment', provider: 'BandaPH Live', rate: '₱8,000–₱25,000/event', location: 'Both', area: 'Manila & Cavite', stars: 4.8, reviews: 44, image: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5a7c?w=500&q=80', desc: 'OPM covers, jazz, acoustic, dance band. 3–5 hour sets.', contact: '09182223344' },
  { id: 52, type: 'events', title: 'Balloon & Party Decoration', provider: 'BalloonCraft PH', rate: '₱2,000–₱8,000/setup', location: 'Both', area: 'Manila & Cavite', stars: 4.7, reviews: 67, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', desc: 'Balloons, streamers, photo walls, table centerpieces.', contact: '09178884455' },
  { id: 53, type: 'beauty', title: 'Mobile Spa & Hammam', provider: 'LuxuSpa PH', rate: '₱1,500–₱3,500/session', location: 'Manila', area: 'BGC / Makati', stars: 4.9, reviews: 34, image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500&q=80', desc: 'Full body treatment, facial, steam session. Premium setup at your home.', contact: '09223334455' },
  { id: 54, type: 'professional', title: 'Tax Filing & BIR Compliance', provider: 'TaxEase PH', rate: '₱500–₱3,000/filing', location: 'Both', area: 'Remote / Manila', stars: 4.8, reviews: 52, image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=500&q=80', desc: 'Individual & corporate tax returns, BIR form submissions. CPA in-house.', contact: '09189990011' },
  { id: 55, type: 'transport', title: 'Van for Hire – Day Tour', provider: 'VanKo Tours', rate: '₱2,500–₱5,000/day', location: 'Both', area: 'Manila & Cavite', stars: 4.6, reviews: 61, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80', desc: 'Air-conditioned van with driver. Tagaytay, Batangas, Manila tour packages.', contact: '09151234321' },
];

function ServiceEditModal({ item, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(item.title || '');
  const [rate, setRate] = useState(item.rate || item.price_label || '');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Listing.update(item.id, { title, price_label: rate });
    setSaving(false);
    onSave();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/85 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3"
        style={{ background: '#0D1F3C', border: '1px solid rgba(0,212,255,0.2)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-white text-sm">Edit Service Listing</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-white/40" /></button>
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <div>
          <label className="font-body text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Rate / Price Label</label>
          <input value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-[#00D4FF]" />
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl font-body font-bold text-sm hover:bg-[#00D4FF] hover:text-[#0A192F] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {confirming ? (
          <div className="flex gap-2">
            <button onClick={onDelete} className="flex-1 py-2 bg-red-500 text-white rounded-xl font-body font-bold text-xs">Confirm Delete</button>
            <button onClick={() => setConfirming(false)} className="flex-1 py-2 bg-white/10 text-white/60 rounded-xl font-body text-xs">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/30 text-red-400 rounded-xl font-body text-xs font-bold hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete Listing
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function ServiceCard({ svc, onContact, user, isAdmin, onEdit }) {
  const [touched, setTouched] = React.useState(false);
  const isOwner = user && svc.id && (svc.email_contact === user.email);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTimeout(() => setTouched(false), 800)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative"
      style={{ border: touched ? '1.5px solid #2563EB' : '1px solid rgba(10,25,47,0.06)', boxShadow: touched ? '0 0 24px rgba(37,99,235,0.3), 0 8px 30px rgba(0,0,0,0.1)' : undefined, transition: 'border 0.2s, box-shadow 0.2s' }}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${svc.location === 'Manila' ? 'bg-blue-100 text-blue-700' : svc.location === 'Cavite' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
            {svc.area}
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
          <div className="flex items-center gap-1.5">
            {(isAdmin || isOwner) && svc.id && (
              <button onClick={() => onEdit(svc)} className="p-1.5 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/15 text-[#2563EB] hover:bg-[#DBEAFE] transition-colors">
                <Pencil className="w-3 h-3" />
              </button>
            )}
            <button onClick={() => onContact(svc)} className="px-3 py-1.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-lg font-body text-xs font-semibold transition-colors">
              Book Now
            </button>
          </div>
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
  const urlParams = new URLSearchParams(window.location.search);
  const urlSub = urlParams.get('sub');

  // If a sub param is present, skip the splash and go straight to the listing view
  const [activeCategory, setActiveCategory] = useState(urlSub ? 'all' : null);
  const [splashDismissed, setSplashDismissed] = useState(!!urlSub);
  const [locationFilter, setLocationFilter] = useState('All');
  const [search, setSearch] = useState(urlSub || '');
  const [contactItem, setContactItem] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [addDefaultSub, setAddDefaultSub] = useState(urlSub || '');
  const [canAddListing, setCanAddListing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [dbListings, setDbListings] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    base44.auth.isAuthenticated().then(ok => {
      if (ok) base44.auth.me().then(u => {
        setCurrentUser(u);
        const admin = u.role === 'admin' || u.email === 'Kevinarnold522@gmail.com';
        setIsAdmin(admin);
        const allowed = admin || u.is_seller || u.account_type === 'business_owner';
        setCanAddListing(allowed);
      }).catch(() => {});
    }).catch(() => {});
    base44.entities.Listing.filter({ type: 'services', is_active: true }, '-created_date', 50)
      .then(items => setDbListings(items)).catch(() => {});
  }, []);

  const typeMap = { legal: 'professional', finance: 'professional', education: 'professional', media: 'tech' };

  const allServices = dbListings.map(l => ({
    id: l.id, type: l.subcategory?.toLowerCase().replace(/\s+/g, '') || 'home',
    title: l.title, provider: l.approved_channel_name || l.seller_name || '1Market Listing',
    rate: l.price_label || (l.price ? `₱${Number(l.price).toLocaleString()}` : 'Contact for rate'),
    location: l.location === 'Cavite' ? 'Cavite' : 'Manila', area: l.area || l.location,
    stars: l.rating || 0, reviews: l.rating_count || 0,
    image: l.image_url || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80',
    desc: l.description || '', contact: l.phone || l.email_contact || '',
    isDb: true,
  }));

  const filtered = allServices.filter(s => {
    const resolvedCat = typeMap[activeCategory] || activeCategory;
    const matchCat = !activeCategory || activeCategory === 'all' || s.type === resolvedCat;
    const matchLoc = locationFilter === 'All' || s.location === locationFilter || s.location === 'Both';
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLoc && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg,#000d40 0%,#001a80 50%,#000d40 100%)' }}>
      <StarField />
      {!splashDismissed && (
        <SubcategorySplash
          subcategories={SUBCATEGORIES}
          activeKey={activeCategory}
          onSelect={(key) => { setActiveCategory(key); setSplashDismissed(true); }}
          title="What service are you looking for?"
          subtitle="Pick a category to find the right provider"
          onBack={() => window.history.back()}
        />
      )}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)' }}>
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
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white">Services Provided</h1>
              {canAddListing && <PostListingMenu user={currentUser} compact={false} />}
            </div>
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all border ${activeCategory === sc.key ? 'border-[#3E97F1] text-white' : 'border-white/10 text-white/60 hover:border-white/25'}`}
              style={activeCategory === sc.key ? { background: 'rgba(62,151,241,0.2)' } : { background: 'rgba(255,255,255,0.04)' }}>
              {sc.label}
            </button>
          ))}
        </div>


        <div className="flex gap-2 mb-6">
          {['All', 'Manila', 'Cavite'].map(loc => (
            <button key={loc} onClick={() => setLocationFilter(loc)}
              className="px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all border"
              style={locationFilter === loc
                ? { background: 'rgba(62,151,241,0.2)', borderColor: '#3E97F1', color: '#fff' }
                : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              {loc}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(svc => <ServiceCard key={svc.id} svc={svc} onContact={setContactItem} user={currentUser} isAdmin={isAdmin} onEdit={(s) => s.isDb ? setEditItem(s) : null} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-body text-white/30 text-lg mb-1">
              {dbListings.length === 0 ? 'No service listings yet.' : 'No services found.'}
            </p>
            <p className="font-body text-white/20 text-sm">
              {dbListings.length === 0 ? 'Be the first to list your service!' : 'Try a different filter or search term.'}
            </p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg,#0033CC,#001a80)' }}>
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
        {showAddListing && <AddListingModal onClose={async () => { setShowAddListing(false); const items = await base44.entities.Listing.filter({ type: 'services', is_active: true }, '-created_date', 50); setDbListings(items); }} defaultType="services" defaultSubcategory={addDefaultSub} user={currentUser} />}
        {editItem && editItem.id && isAdmin && (
          <ServiceEditModal item={editItem} onClose={() => setEditItem(null)}
            onSave={async () => { setEditItem(null); const items = await base44.entities.Listing.filter({ type: 'services', is_active: true }, '-created_date', 50); setDbListings(items); setToast('Updated!'); setTimeout(() => setToast(''), 2500); }}
            onDelete={async () => { await base44.entities.Listing.delete(editItem.id); setEditItem(null); setDbListings(prev => prev.filter(l => l.id !== editItem.id)); setToast('Deleted.'); setTimeout(() => setToast(''), 2500); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-body text-sm shadow-2xl z-50 text-white"
            style={{ background: '#0A192F', border: '1px solid rgba(0,212,255,0.2)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}