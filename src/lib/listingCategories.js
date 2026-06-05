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
  shoes: ['Sneakers', 'Formal', 'Sandals', 'Boots', 'Sports', 'Kids', 'Slip-ons', 'Heels'],
  cars: ['Sedan', 'SUV', 'Van', 'Pickup', 'Hatchback', 'Motorcycle', 'Truck', 'AUV', 'MPV'],
  electronics: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 'TV & Displays', 'Smart Devices', 'Accessories', 'Printers', 'Components'],
  clothing: ["Men's Tops", "Women's Tops", 'Bottoms', 'Outerwear', 'Formal Wear', 'Activewear', 'Kids Clothing', 'Underwear & Socks', 'Accessories'],
  furniture: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kitchen', 'Storage', 'Kids Furniture'],
  houses: ['House & Lot', 'Condominium', 'Townhouse', 'Apartment', 'Vacant Lot', 'Commercial Property', 'Foreclosed'],
  food: ['Baked Goods', 'Ready-to-Eat Meals', 'Beverages', 'Snacks', 'Ingredients / Grocery', 'Desserts', 'Health Food'],
  product: ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids', 'Other / Type Manually'],
  homeappliances: [
    'Refrigerator / Freezer', 'Washing Machine', 'Dryer', 'Air Conditioner', 'Electric Fan',
    'Microwave Oven', 'Electric Oven / Range', 'Rice Cooker', 'Electric Kettle', 'Coffee Maker',
    'Blender / Juicer / Food Processor', 'Dishwasher', 'Vacuum Cleaner / Floor Polisher',
    'Water Dispenser', 'Water Heater / Shower Heater', 'Electric Iron', 'Sewing Machine',
    'TV / Smart TV', 'Home Theater / Sound System', 'Projector', 'Generator / Inverter',
    'Other Appliance / Type Manually',
  ],
  mods: ['Car Modifications', 'Motorcycle Mods', 'PC Builds / Upgrades', 'Console Mods', 'Custom Accessories'],
  other: ['Miscellaneous', 'Collectibles', 'Art & Crafts', 'Musical Instruments', 'Plants & Garden'],
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
  ],
  hotel: ['Budget Hotel', 'Boutique Hotel', 'Resort', 'Pension House', 'Airbnb / Homestay', 'Suite'],
  flights: ['Domestic', 'International', 'Charter'],
  vehicle_rental: ['Car', 'Van', 'Motorcycle', 'Truck', 'Bus / Shuttle'],
};

export const JOBS_SUBCATEGORIES = SUBCATEGORIES.jobs;
export const RENT_SUBCATEGORIES = SUBCATEGORIES.rent_lease;
export const HOMEAPPLIANCES_SUBCATEGORIES = SUBCATEGORIES.homeappliances;