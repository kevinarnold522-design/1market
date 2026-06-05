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
  product: ['General', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Hobbies', 'Books & Media', 'Tools & Hardware', 'Garden & Outdoor', 'Baby & Kids'],
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
  ],
  jobs: [
    'Tech & IT', 'BPO / Call Center', 'Sales & Retail', 'Food & Restaurant', 'Drivers & Delivery',
    'Household / Kasambahay', 'Healthcare / Nursing', 'Remote / WFH', 'Skilled Trades',
    'Events & Entertainment', 'Education & Tutoring', 'Finance & Accounting', 'Marketing', 'Admin & Clerical',
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