// Central listing categories config used by AddListingModal and other components

export const MAIN_CATEGORIES = [
  { value: 'buysell', label: 'Buy & Sell' },
  { value: 'services', label: 'Services' },
  { value: 'jobs', label: 'Jobs' },
  { value: 'rent', label: 'For Rent / Lease' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
];

// Subcategories keyed by listing type
export const SUBCATEGORIES = {
  shoes: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids', 'Slip-ons', 'Heels', 'Other / Type Manually'],
  cars: ['Sedan', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Motorcycle', 'Truck', 'AUV', 'MPV', 'Other / Type Manually'],
  electronics: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories', 'Printers', 'Components', 'Other / Type Manually'],
  clothing: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing', 'Underwear & Socks', 'Accessories', 'Other / Type Manually'],
  furniture: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen', 'Storage', 'Kids Furniture', 'Other / Type Manually'],
  houses: ['House & Lot', 'Condominium', 'Townhouse', 'Apartment', 'Vacant Lot', 'Commercial Property', 'Foreclosed', 'Other / Type Manually'],
  food: ['Baked Goods', 'Ready-to-Eat Meals', 'Beverages', 'Snacks', 'Ingredients / Grocery', 'Desserts', 'Health Food', 'Lutong Bahay', 'Karinderya / Turo-turo', 'Other / Type Manually'],
  product: ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids', 'Other / Type Manually'],
  homeappliances: [
    'Refrigerator / Freezer', 'Washing Machine', 'Dryer', 'Air Conditioner', 'Electric Fan',
    'Microwave Oven', 'Electric Oven / Range', 'Rice Cooker', 'Electric Kettle', 'Coffee Maker',
    'Blender / Juicer / Food Processor', 'Dishwasher', 'Vacuum Cleaner / Floor Polisher',
    'Water Dispenser', 'Water Heater / Shower Heater', 'Electric Iron', 'Sewing Machine',
    'TV / Smart TV', 'Home Theater / Sound System', 'Projector', 'Generator / Inverter',
    'Other / Type Manually',
  ],
  mods: ['Car Modifications', 'Motorcycle Mods', 'PC Builds / Upgrades', 'Console Mods', 'Custom Accessories', 'Other / Type Manually'],
  other: ['Miscellaneous', 'Collectibles', 'Art & Crafts', 'Musical Instruments', 'Plants & Garden', 'Other / Type Manually'],
  services: [
    'Home Cleaning', 'Plumbing', 'Electrical', 'Aircon Services', 'Carpentry', 'Painting',
    'Pest Control', 'Interior Design', 'Moving / Packing',
    'Web Development', 'Graphic Design', 'IT Support', 'CCTV Installation', 'Social Media Management', 'Video Editing',
    'Massage / Spa', 'Nails', 'Hair Services', 'Makeup Artist',
    'Event Planning', 'Catering', 'DJ', 'Photography / Videography', 'Live Band',
    'Accounting / Bookkeeping', 'Tax Filing', 'Notary', 'Legal Services', 'Immigration Assistance',
    'Trucking', 'Courier', 'Airport Transfer', 'Habal-habal',
    'Dental', 'Caregiver', 'Online Doctor', 'Physical Therapy', 'Mental Health',
    'Tutoring', 'Online English', 'Coaching', 'Training',
    'Other / Type Manually',
  ],
  jobs: [
    // IT & BPO
    'Customer Service Representative (CSR)', 'Technical Support Representative (TSR)', 'Team Leader / Operations Supervisor',
    'Operations Manager', 'Service Delivery Lead / Director', 'Workforce Management (WFM) Analyst',
    'Real-Time Adherence (RTA) Specialist', 'Quality Assurance (QA) Analyst', 'Process Trainer / Product Trainer',
    'Implementation Manager', 'Software Engineer / Developer', 'Data Engineer / Cloud Architect',
    'Technical Project Manager', 'IT Helpdesk Specialist', 'Virtual Assistant (VA)',
    // Healthcare
    'Staff Nurse (ER / ICU / Ward)', 'Company Nurse / Occupational Health Nurse', 'Medical Technologist (MedTech)',
    'Pharmacist', 'Physical Therapist', 'General Practitioner (GP) / Resident Physician',
    'Medical Auditor', 'Medical Coder (ICD-10 / CPC)', 'Clinical Care Coordinator', 'Radiologic Technologist (RadTech)',
    // Operations & HR
    'Human Resources (HR) Generalist', 'Talent Acquisition / Recruitment Specialist', 'Payroll Specialist',
    'Administrative Assistant / Executive Secretary', 'Office Manager', 'Document Controller',
    'Process Excellence (Lean Six Sigma) Specialist', 'Compliance Officer', 'Risk Management Analyst', 'Legal Assistant / Paralegal',
    // Finance & Accounting
    'Bookkeeper', 'General Accountant', 'Certified Public Accountant (CPA)', 'Internal Auditor',
    'Billing and Collection Specialist', 'Accounts Payable / Receivable Analyst', 'Financial Analyst',
    'Credit and Loan Officer', 'Bank Teller', 'Investment Associate',
    // Engineering & Logistics
    'Civil Engineer', 'Project Engineer / Site Engineer', 'Safety Officer (BOSH / COSH Certified)',
    'Warehouse Supervisor', 'Logistics / Supply Chain Coordinator', 'Procurement / Purchasing Officer',
    'Inventory Controller', 'Customs Broker', 'Delivery Driver / Courier', 'Fleet Manager',
    // Sales, Marketing & Creative
    'Graphic Designer', 'UI/UX Designer', 'Video Editor', '3D Modeler / Motion Animator',
    'Social Media Manager / Specialist', 'SEO Specialist', 'Content Writer / Copywriter',
    'Digital Marketing Manager', 'Account Executive (Sales)', 'Brand Manager',
    // Education, Retail & Public
    'Public School Teacher (DepEd)', 'College Professor / Instructor', 'Guidance Counselor',
    'Store Manager / Retail Supervisor', 'Cashier / Sales Clerk', 'Merchandiser / Stock Clerk',
    'Government Administrative Officer (Civil Service)', 'Social Worker',
    // Food & Restaurant
    'Restaurant Manager', 'Assistant Restaurant Manager', 'Shift Manager / Supervisor (Fast Food)',
    'Head Chef / Executive Chef', 'Sous Chef', 'Line Cook / Commis', 'Kitchen Helper',
    'Service Crew (Fast Food)', 'Waiter / Waitress / Server', 'Bartender', 'Barista',
    'Food Attendant / Buffet Server', 'Dishwasher / Utility Worker', 'Receptionist / Hostess',
    'Delivery Rider (GrabFood / Foodpanda)',
    // General / Blue Collar
    'Janitor / Janitress / Sanitation Personnel', 'Messenger / Office Boy', 'Security Guard',
    'Maintenance Personnel / Handyman', 'Helper / Loader (Construction / Warehouse)',
    'Housekeeper / Room Attendant (Hotel)', 'Car Washer', 'Laundry Staff',
    'Factory Worker / Production Line Worker', 'Gasoline Boy / Gas Station Attendant',
    'Baggage Boy / Packer (Supermarket)',
    // Other
    'Other / Not Listed',
  ],
  rent_lease: [
    'Room for Rent', 'Apartment / Condo', 'House for Rent', 'Bedspace / Dorm', 'Commercial Space',
    'Office for Rent', 'Venue / Events Space', 'Land for Lease', 'Warehouse / Storage',
    'Other / Type Manually',
  ],
  // Travel subcategories
  hotel: ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Pension House', 'Airbnb / Homestay', 'Suite', 'Transient House', 'Villa / Private Pool', 'Other / Type Manually'],
  resort: ['Beach Resort', 'Mountain Resort', 'Island Resort', 'Eco Resort', 'Spa Resort', 'Family Resort', 'Other / Type Manually'],
  flights: ['Domestic Flight Package', 'International Flight Package', 'Charter Flight', 'Tour Package (Air + Hotel)', 'Budget Promo Fare', 'Business Class Deal', 'Other / Type Manually'],
  vehicle_rental: ['Car', 'Van', 'Motorcycle', 'Truck', 'Bus / Shuttle', 'UV Express', 'Other / Type Manually'],
  ferry: ['Ferry Ticket', 'Fast Craft', 'RORO', 'Bus Package', 'Other / Type Manually'],
  car_rental: ['Sedan', 'SUV', 'Pickup Truck', '4x4', 'Sports Car', 'Luxury Car', 'Other / Type Manually'],
  van_rental: ['10-Seater Van', '12-Seater Van', '15-Seater Van', 'L300 / FB Type', 'Coaster', 'Other / Type Manually'],
  island: ['Island Hopping Tour A', 'Island Hopping Tour B', 'Snorkeling Package', 'Full Day Island Tour', 'Other / Type Manually'],
  camping: ['Beach Camping', 'Mountain Camping', 'Glamping', 'Forest Camping', 'Other / Type Manually'],
  hiking: ['Day Hike', 'Overnight Trek', 'Multi-Day Expedition', 'Guided Trek', 'Other / Type Manually'],
  diving: ['Scuba Diving', 'Freediving', 'Snorkeling', 'Liveaboard', 'Dive Resort Package', 'Other / Type Manually'],
  surfing: ['Surf Lesson (Beginner)', 'Surf Lesson (Intermediate)', 'Surf Camp Package', 'Board Rental', 'Other / Type Manually'],
};

export const JOBS_SUBCATEGORIES = SUBCATEGORIES.jobs;
export const RENT_SUBCATEGORIES = SUBCATEGORIES.rent_lease;
export const HOMEAPPLIANCES_SUBCATEGORIES = SUBCATEGORIES.homeappliances;