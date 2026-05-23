import React, { useState, useEffect } from 'react';
import StarField from '../components/StarField';
import AdminEditOverlay from '../components/AdminEditOverlay';
import SubcategorySplash from '../components/SubcategorySplash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Filter, X, UtensilsCrossed, Clock, ExternalLink, Pencil } from 'lucide-react';
import MultiPlatformRating from '../components/MultiPlatformRating';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MemberSignupModal from '../components/MemberSignupModal';
import BusinessBioModal from '../components/home/BusinessBioModal';
import { getAdminEditMode } from '../components/home/Navbar';
import AdminQuickAddFAB from '../components/admin/AdminQuickAddFAB';

const KNOWN_LOGOS = {
  'Jollibee': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Jollibee_logo.svg/220px-Jollibee_logo.svg.png',
  'McDonald': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/220px-McDonald%27s_Golden_Arches.svg.png',
  'KFC': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/220px-KFC_logo.svg.png',
  'Starbucks': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/220px-Starbucks_Corporation_Logo_2011.svg.png',
  'Mang Inasal': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Mang_Inasal_logo.svg/220px-Mang_Inasal_logo.svg.png',
  'Pick Up Coffee': 'https://scontent.fmnl9-1.fna.fbcdn.net/v/t39.30808-6/312058924_8627696557244025_6773741143267966218_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEOBdS-v_N-hAMt5MZ1BJ7P5CXwGYSqbr7kJfAZhKpuvuMl8BmEqm26yNjLRzPTVJt0eOxbqMH7ck8R75RBXR5e&_nc_ohc=Sdr6yxPJJm8AX87yQ3h&_nc_ht=scontent.fmnl9-1.fna&oh=00_AfA-VbGN8iE8-T57VriSjFJhCRREMqFq7K9X6tkBJx8cKg&oe=65E8E0C7',
  'Chowking': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Chowking_logo.svg/220px-Chowking_logo.svg.png',
  'Greenwich': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Greenwich_Pizza_Logo.svg/220px-Greenwich_Pizza_Logo.svg.png',
};

function getLogoUrl(name) {
  for (const [key, url] of Object.entries(KNOWN_LOGOS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return url;
  }
  return null;
}

const businesses = [
  // MANILA - Fast Food Chains
  { id: 1, name: 'Jollibee - Malate Branch', category: 'Fast Food', location: 'Manila', area: 'Malate', address: 'Taft Ave., Malate, Manila', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Jolly Spaghetti', 'Yumburger', 'Peach Mango Pie'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Jollibee_logo.svg/220px-Jollibee_logo.svg.png', website: 'https://www.jollibee.com.ph', founder: 'Tony Tan Caktiong', year_started: 1978, bio: 'Jollibee is the largest fast food chain in the Philippines, founded by Tony Tan Caktiong in 1978 in Cubao, Quezon City. What started as a small ice cream parlor evolved into a global fast food empire, beloved for its signature Chickenjoy fried chicken and Jolly Spaghetti. Today, Jollibee operates over 1,500 stores worldwide and is the pride of Filipino fast food culture.' },
  { id: 2, name: 'Jollibee - Recto, Manila', category: 'Fast Food', location: 'Manila', area: 'Recto / U-Belt', address: 'Recto Ave., Manila (near PUP)', hours: '6:00 AM – 11:00 PM', menu: ['Chickenjoy', 'Palabok Fiesta', 'Sundae', 'Burger Steak'], type: 'chain', tag: 'Near University', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Jollibee_logo.svg/220px-Jollibee_logo.svg.png', website: 'https://www.jollibee.com.ph', founder: 'Tony Tan Caktiong', year_started: 1978, bio: 'Jollibee is the largest fast food chain in the Philippines, founded by Tony Tan Caktiong in 1978. This branch serves the U-Belt student community near PUP and multiple Manila universities with their famous Chickenjoy and budget-friendly meals.' },
  { id: 3, name: 'Mang Inasal - Sampaloc', category: 'Fast Food', location: 'Manila', area: 'Sampaloc', address: 'España Blvd., Sampaloc, Manila', hours: '10:00 AM – 10:00 PM', menu: ['Chicken Inasal', 'BBQ Pork', 'Halo-Halo', 'Garlic Rice'], type: 'chain', tag: 'Popular', image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Mang_Inasal_logo.svg/220px-Mang_Inasal_logo.svg.png', website: 'https://www.manginasal.com', founder: 'Edgar Sia II', year_started: 2003, bio: "Mang Inasal was founded by Edgar 'Injap' Sia II in 2003 in Iloilo City. Famous for its unli-rice offering and smoky chicken inasal grilled over charcoal, it became a nationwide sensation and was acquired by Jollibee Foods Corporation in 2010. Today it operates over 570 branches across the Philippines." },

  // MANILA - Local Eateries / Carinderias
  { id: 4, name: "Aling Nena's Carinderia", category: 'Local Eatery', location: 'Manila', area: 'Tondo', address: 'Near Delpan St., Tondo, Manila', hours: '6:00 AM – 3:00 PM', menu: ['Sinigang na Baboy', 'Adobo', 'Pinakbet', 'Dinuguan'], type: 'carinderia', tag: 'Community Fave', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 5, name: 'Inday Lutong Bahay', category: 'Home Kitchen', location: 'Manila', area: 'Sampaloc', address: 'F. Cayco St., Sampaloc, Manila', hours: '7:00 AM – 2:00 PM', menu: ['Bulalo', 'Kare-Kare', 'Nilaga', 'Arroz Caldo'], type: 'home-kitchen', tag: 'Home Cooked', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 6, name: 'Tita Merly Merienda Hub', category: 'Local Eatery', location: 'Manila', area: 'Binondo', address: 'Ongpin St., Binondo, Manila', hours: '5:30 AM – 1:00 PM', menu: ['Goto', 'Lugaw', 'Dim Sum', 'Kikiam'], type: 'carinderia', tag: 'Historic District', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
  { id: 7, name: "Nanay Sosing's Kakanin", category: 'Native Delicacies', location: 'Manila', area: 'Pandacan', address: 'Pandacan, Manila', hours: '6:00 AM – 12:00 NN', menu: ['Puto', 'Kutsinta', 'Bibingka', 'Palitaw'], type: 'home-kitchen', tag: 'Native Sweets', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80' },
  { id: 8, name: 'Lola Nena Bakery – Sampaloc', category: 'Home Baker', location: 'Manila', area: 'Sampaloc', address: 'Near UST, Sampaloc, Manila', hours: '5:00 AM – 8:00 PM', menu: ['Pastillas', 'Ube Halaya', 'Cassava Cake', 'Biko'], type: 'home-baker', tag: 'Home Baker', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80' },
  { id: 9, name: 'U-Belt Lutong Ulam', category: 'Local Eatery', location: 'Manila', area: 'Recto / U-Belt', address: 'Near Far Eastern University, Manila', hours: '7:00 AM – 5:00 PM', menu: ['Menudo', 'Caldereta', 'Mechado', 'Paksiw'], type: 'carinderia', tag: 'Student Fave', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },
  { id: 10, name: 'Roxas Blvd. Seafood Grill', category: 'Local Eatery', location: 'Manila', area: 'Roxas Boulevard', address: 'Roxas Blvd., Manila (near CCP)', hours: '5:00 PM – 2:00 AM', menu: ['Inihaw na Pusit', 'Grilled Liempo', 'Buco Juice', 'Oysters'], type: 'carinderia', tag: 'Night Eats', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 11, name: 'Healthy Meals Manila', category: 'Meal Prep', location: 'Manila', area: 'Ermita', address: 'Delivers across Metro Manila', hours: 'Orders: 8:00 AM – 5:00 PM', menu: ['Grilled Chicken Bowl', 'Veggie Wraps', 'Brown Rice Meals', 'Salad Box'], type: 'home-kitchen', tag: 'Delivery', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80' },
  { id: 12, name: 'QC–Manila Border Lutuan', category: 'Local Eatery', location: 'Manila', area: 'Quezon City Border', address: 'E. Rodriguez Sr. Ave. area', hours: '8:00 AM – 8:00 PM', menu: ['Lechon Kawali', 'Kare-Kare', 'Chopsuey', 'Halo-Halo'], type: 'carinderia', tag: 'Family-Owned', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80' },

  // CAVITE - Fast Food Chains
  { id: 13, name: 'Jollibee - Molino Blvd.', category: 'Fast Food', location: 'Cavite', area: 'Bacoor', address: 'Molino Blvd., Bacoor, Cavite', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Burger Steak', 'Spaghetti', 'Peach Mango Pie'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 14, name: 'Jollibee - Aguinaldo Hwy., Cavite', category: 'Fast Food', location: 'Cavite', area: 'Imus', address: 'Aguinaldo Hwy., Imus, Cavite', hours: '6:00 AM – 11:00 PM', menu: ['Chickenjoy', 'Jolly Hotdog', 'Rice Meal', 'Sundae'], type: 'chain', tag: 'Busy Branch', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
  { id: 15, name: 'Jollibee - Dasmariñas City', category: 'Fast Food', location: 'Cavite', area: 'Dasmariñas', address: 'Congressional Rd., Dasmariñas, Cavite', hours: '6:00 AM – 12:00 AM', menu: ['Chickenjoy', 'Palabok', 'Yumburger', 'Jolly Crispy Fries'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80' },

  // CAVITE - Local Gems
  { id: 16, name: 'Silang Roadside Coffee Pop-Up', category: 'Specialty Coffee', location: 'Cavite', area: 'Silang', address: 'Aguinaldo Hwy., near Silang public market', hours: '5:00 AM – 10:00 AM', menu: ['Kapeng Barako', 'Brewed Liberica', 'Tablea Hot Choco', 'Pandesal'], type: 'coffee', tag: 'Cavite Gem', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: 17, name: "Tagaytay Kapeng Barako Stand", category: 'Specialty Coffee', location: 'Cavite', area: 'Tagaytay', address: 'Near Peoples Park in the Sky, Tagaytay', hours: '6:00 AM – 6:00 PM', menu: ['Barako Brewed', 'Iced Barako Latte', 'Bibingka', 'Puto Bumbong'], type: 'coffee', tag: 'Must Try', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
  { id: 18, name: 'Kawit Seafood Grill Stall', category: 'Local Eatery', location: 'Cavite', area: 'Kawit', address: 'Near Kawit Fish Port, Kawit, Cavite', hours: '11:00 AM – 9:00 PM', menu: ['Grilled Bangus', 'Sinugbang Pusit', 'Talaba', 'Kinilaw'], type: 'carinderia', tag: 'Fresh Seafood', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 19, name: 'Noveleta Bagnet House', category: 'Local Eatery', location: 'Cavite', area: 'Noveleta', address: 'Noveleta-Rosario Rd., Noveleta, Cavite', hours: '9:00 AM – 8:00 PM', menu: ['Bagnet', 'Crispy Pata', 'Dinengdeng', 'Bagoong Rice'], type: 'carinderia', tag: 'Local Fave', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 20, name: 'Gen. Trias Kakanin Makers', category: 'Native Delicacies', location: 'Cavite', area: 'General Trias', address: 'Gov. D. Mangubat Ave., Gen. Trias', hours: '5:00 AM – 11:00 AM', menu: ['Puto Pao', 'Sapin-Sapin', 'Ube Kalamay', 'Bibingka'], type: 'home-baker', tag: 'Native Delicacies', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80' },
  { id: 21, name: 'Imus Sari-Sari Merienda Hub', category: 'Sari-Sari Store', location: 'Cavite', area: 'Imus', address: 'Bayan Luma, Imus, Cavite', hours: '6:00 AM – 9:00 PM', menu: ['Fish Balls', 'Kikiam', 'Buko Juice', 'Ice Candy'], type: 'carinderia', tag: 'Street Snacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 22, name: "Bacoor Home Kitchen – Aling Fe's", category: 'Home Kitchen', location: 'Cavite', area: 'Bacoor', address: 'Habay, Bacoor, Cavite', hours: '7:00 AM – 3:00 PM', menu: ['Tinolang Manok', 'Menudo', 'Chicken Pochero', 'Sinigang'], type: 'home-kitchen', tag: 'Home Cooked', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },
  { id: 23, name: 'Dasmariñas Lutong Bahay Catering', category: 'Catering', location: 'Cavite', area: 'Dasmariñas', address: 'Dasmariñas City, Cavite', hours: 'By appointment', menu: ['Lechon Baboy', 'Pancit Palabok', 'Kare-Kare', 'Leche Flan'], type: 'home-kitchen', tag: 'Catering', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80' },

  // MORE CHAINS WITH REAL LOGOS
  { id: 24, name: 'KFC - SM Mall of Asia', category: 'Fast Food', location: 'Manila', area: 'Pasay', address: 'SM Mall of Asia, Pasay City', hours: '9:00 AM – 10:00 PM', menu: ['Original Recipe', 'Crispy Chicken', 'Zinger Burger', 'Mashed Potato'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/220px-KFC_logo.svg.png', website: 'https://www.kfc.com.ph', founder: 'Colonel Harland Sanders', year_started: 1952, bio: 'KFC (Kentucky Fried Chicken) was founded by Colonel Harland Sanders in 1952 in North Corbin, Kentucky. Known for its secret blend of 11 herbs and spices, KFC is the world\'s second largest restaurant chain. In the Philippines, KFC has been operating since the 1970s and is a popular destination for crispy chicken and family meals.' },
  { id: 25, name: "McDonald's - Robinsons Imus", category: 'Fast Food', location: 'Cavite', area: 'Imus', address: 'Robinsons Place Imus, Cavite', hours: '24 Hours', menu: ['Big Mac', 'McFlurry', 'Fries', 'Chicken McNuggets'], type: 'chain', tag: '24 Hours', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/220px-McDonald%27s_Golden_Arches.svg.png', website: 'https://www.mcdonalds.com.ph', founder: 'Ray Kroc', year_started: 1940, bio: "McDonald's was founded in 1940 by Richard and Maurice McDonald, and later franchised by Ray Kroc in 1955. It is the world's largest fast food restaurant chain with over 40,000 locations worldwide. In the Philippines, McDonald's has been operating since 1981 and is known for Chicken McDo, Big Mac, and its 24-hour branches." },
  { id: 26, name: 'Starbucks - BGC High Street', category: 'Specialty Coffee', location: 'Manila', area: 'BGC', address: 'BGC High Street, Taguig', hours: '7:00 AM – 11:00 PM', menu: ['Cold Brew', 'Caramel Macchiato', 'Java Chip Frappuccino', 'Matcha Latte'], type: 'coffee', tag: 'Premium Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/220px-Starbucks_Corporation_Logo_2011.svg.png', website: 'https://www.starbucks.com.ph', founder: 'Gordon Bowker, Jerry Baldwin, Zev Siegl', year_started: 1971, bio: 'Starbucks was founded in 1971 in Seattle, Washington by three partners. It is now the world\'s largest coffeehouse chain with over 35,000 locations globally. In the Philippines, Starbucks operates through Rustan Coffee Corporation and has hundreds of branches. The BGC High Street branch is one of the most popular premium coffee destinations in Metro Manila.' },
  { id: 27, name: 'Starbucks - Dasmariñas, Cavite', category: 'Specialty Coffee', location: 'Cavite', area: 'Dasmariñas', address: 'SM City Dasmariñas, Cavite', hours: '8:00 AM – 10:00 PM', menu: ['Caramel Frap', 'Iced Americano', 'Vanilla Latte', 'Croissant'], type: 'coffee', tag: 'Drive-Thru', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/220px-Starbucks_Corporation_Logo_2011.svg.png', website: 'https://www.starbucks.com.ph', founder: 'Gordon Bowker, Jerry Baldwin, Zev Siegl', year_started: 1971, bio: 'Starbucks in Dasmariñas serves as a popular hangout for residents of Cavite. This drive-thru location is one of the busiest in the province, offering the full Starbucks menu including seasonal specials and the iconic Caramel Frappuccino.' },
  { id: 28, name: 'Pick Up Coffee - Imus Branch', category: 'Specialty Coffee', location: 'Cavite', area: 'Imus', address: 'Aguinaldo Hwy., Imus, Cavite', hours: '7:00 AM – 10:00 PM', menu: ['Cold Brew', 'Spanish Latte', 'Matcha Latte', 'Blended Java'], type: 'coffee', tag: 'Local Fave', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: 29, name: "Chowking - SM Bacoor", category: 'Fast Food', location: 'Cavite', area: 'Bacoor', address: 'SM City Bacoor, Molino Blvd.', hours: '7:00 AM – 10:00 PM', menu: ['Lauriat Rice Meal', 'Chao Fan', 'Halo-Halo', 'Siopao'], type: 'chain', tag: 'Open Now', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
  { id: 30, name: "Greenwich Pizza - Taft, Manila", category: 'Pizza', location: 'Manila', area: 'Taft', address: 'Taft Ave. cor. P. Gil St., Manila', hours: '10:00 AM – 10:00 PM', menu: ['Hawaiian Pizza', 'Overloaded', 'Lasagna', 'Pasta'], type: 'chain', tag: 'Pizza & Pasta', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },

  // MILK TEA SHOPS
  { id: 31, name: 'Chatime - SM MOA', category: 'Milk Tea', location: 'Manila', area: 'Pasay', address: 'SM Mall of Asia, Pasay City', hours: '10:00 AM – 9:00 PM', menu: ['Classic Pearl Milk Tea', 'Taro', 'Wintermelon', 'Brown Sugar'], type: 'milktea', tag: 'Milk Tea', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: 32, name: 'Tiger Sugar - Quezon City', category: 'Milk Tea', location: 'Manila', area: 'QC', address: 'Tomas Morato, Quezon City', hours: '11:00 AM – 10:00 PM', menu: ['Brown Sugar Boba', 'Tiger Sugar Latte', 'Cream Mousse Series'], type: 'milktea', tag: 'Trending', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca4f60?w=400&q=80' },
  { id: 33, name: 'Gong Cha - Imus, Cavite', category: 'Milk Tea', location: 'Cavite', area: 'Imus', address: 'Imus Central Mall, Cavite', hours: '10:00 AM – 9:00 PM', menu: ['Earl Grey Milk Tea', 'Brown Sugar Dirty', 'Matcha Red Bean'], type: 'milktea', tag: 'K-Milk Tea', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },

  // JAPANESE
  { id: 34, name: 'Ramen Nagi - BGC', category: 'Japanese', location: 'Manila', area: 'BGC', address: 'Bonifacio High St., BGC, Taguig', hours: '11:00 AM – 10:00 PM', menu: ['King Black Ramen', 'Butao King', 'Gyoza', 'Karaage'], type: 'japanese', tag: 'Ramen', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&q=80' },
  { id: 35, name: 'Yabu - SM MOA', category: 'Japanese', location: 'Manila', area: 'Pasay', address: 'SM Mall of Asia, Pasay', hours: '10:00 AM – 9:30 PM', menu: ['Hire Katsu', 'Rosu Katsu', 'Katsu Don', 'Miso Soup'], type: 'japanese', tag: 'Katsu', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80' },

  // KOREAN
  { id: 36, name: 'Samgyupsalamat - Manila', category: 'Korean BBQ', location: 'Manila', area: 'Malate', address: 'Adriatico St., Malate, Manila', hours: '11:00 AM – 11:00 PM', menu: ['Unlimited Samgyupsal', 'Dakgalbi', 'Kimchi', 'Korean Fried Chicken'], type: 'korean', tag: 'Unlimited', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80' },
  { id: 37, name: 'Bulgogi Brothers - Bacoor', category: 'Korean BBQ', location: 'Cavite', area: 'Bacoor', address: 'SM City Bacoor, Cavite', hours: '11:00 AM – 10:00 PM', menu: ['Beef Bulgogi', 'Samgyupsal', 'Bibimbap', 'Korean Corn Dog'], type: 'korean', tag: 'K-BBQ', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80' },

  // SEAFOOD
  { id: 38, name: 'Dampa - SM by the Bay', category: 'Seafood', location: 'Manila', area: 'Pasay', address: 'SM by the Bay, Manila', hours: '10:00 AM – 10:00 PM', menu: ['Grilled Shrimp', 'Crab in Coconut', 'Bangus Sisig', 'Talaba'], type: 'seafood', tag: 'Fresh Catch', image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400&q=80' },
  { id: 39, name: 'Kawit Seafood Grill', category: 'Seafood', location: 'Cavite', area: 'Kawit', address: 'Near Kawit Fish Port, Kawit, Cavite', hours: '11:00 AM – 9:00 PM', menu: ['Grilled Bangus', 'Kinilaw', 'Sinugbang Pusit', 'Talaba'], type: 'seafood', tag: 'Fresh Catch', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
];

const categoryTypes = [
  { key: 'chain', label: 'Fast Food', icon: '🍔' },
  { key: 'carinderia', label: 'Local Eateries', icon: '🥘' },
  { key: 'coffee', label: 'Coffee Shops', icon: '☕' },
  { key: 'milktea', label: 'Milk Tea', icon: '🧋' },
  { key: 'japanese', label: 'Japanese', icon: '🍱' },
  { key: 'italian', label: 'Italian', icon: '🍝' },
  { key: 'indian', label: 'Indian', icon: '🍛' },
  { key: 'middle-eastern', label: 'Middle Eastern', icon: '🧆' },
  { key: 'korean', label: 'Korean', icon: '🥩' },
  { key: 'seafood', label: 'Seafood', icon: '🦞' },
  { key: 'bakery', label: 'Bakeries', icon: '🥐' },
  { key: 'dessert', label: 'Desserts', icon: '🍦' },
  { key: 'home-kitchen', label: 'Home Kitchens', icon: '🍲' },
  { key: 'home-baker', label: 'Home Bakers', icon: '🎂' },
  { key: 'catering', label: 'Catering', icon: '🍽️' },
];

function BusinessCard({ biz, onRate, onInfo }) {
  const locationColor = biz.location === 'Manila' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700';
  const imgSrc = biz.image_url || biz.image;
  const menuItems = biz.menu || [];
  const [touched, setTouched] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onTouchStart={() => setTouched(true)}
      onTouchEnd={() => setTimeout(() => setTouched(false), 800)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      style={{ border: touched ? '1.5px solid #2563EB' : '1px solid rgba(10,25,47,0.06)', boxShadow: touched ? '0 0 24px rgba(37,99,235,0.3)' : undefined, transition: 'border 0.2s, box-shadow 0.2s' }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={imgSrc} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${locationColor}`}>📍 {biz.location}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#0A192F]">{biz.tag}</span>
        </div>
        {/* Logo badge — known brands or custom */}
        {(biz.logo_url || getLogoUrl(biz.name)) && (
          <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-white">
            <img src={biz.logo_url || getLogoUrl(biz.name)} alt="logo" className="w-8 h-8 object-contain" onError={e => e.target.style.display='none'} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-base text-[#0A192F] leading-tight mb-0.5">{biz.name}</h3>
        <p className="font-body text-xs text-[#2563EB] font-semibold mb-1">{biz.category} · {biz.area}</p>
        <p className="font-body text-xs text-[#0A192F]/50 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {biz.address}
        </p>
        <p className="font-body text-xs text-[#0A192F]/40 mb-3 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {biz.hours}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {menuItems.slice(0, 3).map((item, i) => (
            <span key={i} className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/60 text-[10px] rounded-full border border-[#0A192F]/5">{item}</span>
          ))}
          {menuItems.length > 3 && <span className="px-2 py-0.5 bg-[#F8FAFC] text-[#0A192F]/40 text-[10px] rounded-full border border-[#0A192F]/5">+{menuItems.length - 3} more</span>}
        </div>
        <div className="mb-3">
          <MultiPlatformRating bizName={biz.name} baseRating={biz.rating || 4.2} compact />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onInfo(biz)}
            className="flex-1 py-2 rounded-xl bg-[#0A192F]/5 hover:bg-[#0A192F] hover:text-white text-[#0A192F]/60 font-body text-xs font-semibold transition-all duration-200"
          >
            ℹ️ About
          </button>
          <button
            onClick={() => onRate(biz)}
            className="flex-1 py-2 rounded-xl bg-[#0A192F]/5 hover:bg-[#2563EB] hover:text-white text-[#0A192F]/60 font-body text-xs font-semibold transition-all duration-200"
          >
            ⭐ Rate
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function RateModal({ biz, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-heading font-bold text-xl text-[#0A192F] mb-1">Thank you!</h3>
            <p className="font-body text-sm text-[#0A192F]/50 mb-4">Your rating has been submitted. Become a member to save your reviews!</p>
            <button onClick={onClose} className="w-full py-2.5 bg-[#0A192F] text-white rounded-xl font-body font-semibold text-sm">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-heading font-bold text-lg text-[#0A192F] mb-1">Rate this Business</h3>
            <p className="font-body text-sm text-[#0A192F]/50 mb-4">{biz.name}</p>
            <div className="flex gap-2 mb-4 justify-center">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-3xl transition-transform hover:scale-110 ${s <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="w-full border border-[#0A192F]/10 rounded-xl p-3 text-sm font-body text-[#0A192F] resize-none h-20 focus:outline-none focus:border-[#2563EB] mb-4"
            />
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 border border-[#0A192F]/10 text-[#0A192F]/60 rounded-xl font-body font-semibold text-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={rating === 0}
                className="flex-1 py-2.5 bg-[#0A192F] hover:bg-[#2563EB] text-white rounded-xl font-body font-semibold text-sm disabled:opacity-40 transition-colors">
                Submit
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

const FOOD_SUBCATEGORIES = [
  { key: 'all', label: 'All Food', icon: '🍴', desc: 'Everything' },
  { key: 'chain', label: 'Fast Food', icon: '🍔', desc: 'Chains' },
  { key: 'carinderia', label: 'Local Eats', icon: '🥘', desc: 'Carinderias' },
  { key: 'coffee', label: 'Coffee', icon: '☕', desc: 'Cafes' },
  { key: 'milktea', label: 'Milk Tea', icon: '🧋', desc: 'Boba' },
  { key: 'korean', label: 'Korean', icon: '🥩', desc: 'K-BBQ' },
  { key: 'japanese', label: 'Japanese', icon: '🍱', desc: 'Ramen & more' },
  { key: 'seafood', label: 'Seafood', icon: '🦞', desc: 'Fresh catch' },
  { key: 'home-kitchen', label: 'Home Kitchen', icon: '🍲', desc: 'Lutong bahay' },
  { key: 'home-baker', label: 'Home Bakers', icon: '🎂', desc: 'Pastries' },
  { key: 'milktea', label: 'Desserts', icon: '🍦', desc: 'Sweets' },
  { key: 'catering', label: 'Catering', icon: '🍽️', desc: 'Events' },
];

const BUSINESS_ADMIN_FIELDS = [
  { key: 'name', label: 'Business Name' },
  { key: 'image_url', label: 'Main Photo', type: 'image' },
  { key: 'logo_url', label: 'Logo', type: 'image' },
  { key: 'extra_images', label: 'Additional Photos', type: 'images' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'hours', label: 'Hours' },
  { key: 'tag', label: 'Tag / Badge' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'area', label: 'Area' },
  { key: 'is_active', label: 'Active / Visible', type: 'boolean' },
];

export default function Food() {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [activeTypes, setActiveTypes] = useState([]);
  const [selectedSubcat, setSelectedSubcat] = useState(null);
  const [ratingBiz, setRatingBiz] = useState(null);
  const [infoBiz, setInfoBiz] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dbBusinesses, setDbBusinesses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
    const t = setInterval(() => setAdminMode(getAdminEditMode()), 300);
    return () => clearInterval(t);
  }, []);

  const isAdminUser = currentUser?.role === 'admin' || currentUser?.role === 'moderator' || currentUser?.email === 'Kevinarnold522@gmail.com';

  useEffect(() => {
    base44.entities.Business.filter({ section: 'food', is_active: true }).then(setDbBusinesses).catch(() => {});
  }, []);

  // Merge DB businesses on top of static ones (DB takes priority)
  const allBusinesses = [...dbBusinesses, ...businesses.filter(sb => !dbBusinesses.some(db => db.name === sb.name))];

  const toggleType = (key) => {
    setActiveTypes(prev => prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]);
  };

  const filtered = allBusinesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || (b.area || '').toLowerCase().includes(search.toLowerCase()) || (b.category || '').toLowerCase().includes(search.toLowerCase());
    const matchLoc = locationFilter === 'All' || b.location === locationFilter;
    const matchType = activeTypes.length === 0 || activeTypes.includes(b.type);
    return matchSearch && matchLoc && matchType;
  });

  const manilaCount = filtered.filter(b => b.location === 'Manila').length;
  const caviteCount = filtered.filter(b => b.location === 'Cavite').length;

  return (
    <div className="min-h-screen bg-[#070F1A]">
      <StarField />
      <SubcategorySplash
        subcategories={FOOD_SUBCATEGORIES}
        activeKey={selectedSubcat}
        onSelect={(key) => { setSelectedSubcat(key); if (key !== 'all') setActiveTypes([key]); else setActiveTypes([]); }}
        title="What are you craving?"
        subtitle="Pick a food category to explore"
        category="food"
      />
      {/* Header */}
      <div className="relative bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 to-[#0A192F]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to 1Market.ph
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[#00D4FF]">1Market Food Directory</span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-3">Manila & Cavite Food</h1>
            <p className="font-body text-base text-white/50 max-w-xl">Real local businesses — from fast food chains to hidden carinderias, home kitchens, and barako coffee stands.</p>
          </motion.div>

          {/* Sign Up CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <span className="font-body text-sm text-white/70">Want to rate businesses?</span>
            <button onClick={() => setShowSignup(true)} className="px-3 py-1.5 bg-[#00D4FF] text-[#0A192F] rounded-lg font-body font-bold text-xs hover:bg-white transition-colors">
              Join Free →
            </button>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Jollibee, local carinderias, or home bakers in Cavite and Manila..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Location Tabs + Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {['All', 'Manila', 'Cavite'].map(loc => (
              <button key={loc} onClick={() => setLocationFilter(loc)}
                className={`px-5 py-2 rounded-full font-body font-semibold text-sm transition-all ${locationFilter === loc ? 'bg-[#0A192F] text-white' : 'bg-white border border-[#0A192F]/10 text-[#0A192F]/60 hover:border-[#0A192F]/20'}`}>
                {loc === 'Manila' ? `🗺️ Manila (${manilaCount})` : loc === 'Cavite' ? `🏝️ Cavite (${caviteCount})` : `All (${filtered.length})`}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0A192F]/10 rounded-full font-body text-sm text-[#0A192F]/60 hover:border-[#2563EB]/30 transition-all">
            <Filter className="w-3.5 h-3.5" /> Filters {activeTypes.length > 0 && <span className="w-4 h-4 bg-[#2563EB] text-white rounded-full text-[10px] flex items-center justify-center">{activeTypes.length}</span>}
          </button>
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white rounded-2xl border border-[#0A192F]/5 p-4">
              <p className="font-body text-xs uppercase tracking-wider text-[#0A192F]/40 mb-3">Filter by Type</p>
              <div className="flex flex-wrap gap-2">
                {categoryTypes.map(ct => (
                  <button key={ct.key} onClick={() => toggleType(ct.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${activeTypes.includes(ct.key) ? 'bg-[#0A192F] text-white' : 'bg-[#F8FAFC] text-[#0A192F]/60 border border-[#0A192F]/10 hover:border-[#0A192F]/20'}`}>
                    {ct.icon} {ct.label}
                  </button>
                ))}
                {activeTypes.length > 0 && (
                  <button onClick={() => setActiveTypes([])} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body text-red-500 border border-red-100 hover:bg-red-50 transition-all">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((biz) => {
              const isDbRecord = dbBusinesses.some(db => db.id === biz.id);
              const card = <BusinessCard key={biz.id} biz={biz} onRate={setRatingBiz} onInfo={setInfoBiz}/>;

              // Admin mode: wrap DB records with inline edit overlay
              if (isAdminUser && adminMode && isDbRecord) {
                return (
                  <AdminEditOverlay key={biz.id} entity="Business" record={biz} fields={BUSINESS_ADMIN_FIELDS}
                    onSaved={(updated) => setDbBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b))}
                    onDeleted={(id) => setDbBusinesses(prev => prev.filter(b => b.id !== id))}>
                    {card}
                  </AdminEditOverlay>
                );
              }

              // Admin mode + static record: show "Add to DB & Edit" overlay
              if (isAdminUser && adminMode && !isDbRecord) {
                return (
                  <div key={biz.id} className="relative group">
                    {card}
                    <button
                      onClick={async () => {
                        const { id: _id, ...rest } = biz;
                        const created = await base44.entities.Business.create({ ...rest, section: 'food', is_active: true });
                        setDbBusinesses(prev => [...prev, created]);
                      }}
                      className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-amber-500/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Register & Edit this business"
                    >
                      <Pencil className="w-3.5 h-3.5 text-white"/>
                    </button>
                  </div>
                );
              }

              return card;
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <UtensilsCrossed className="w-10 h-10 text-[#0A192F]/20 mx-auto mb-3" />
            <p className="font-body text-[#0A192F]/40">No businesses found for "{search}"</p>
          </div>
        )}

        {/* Become a Member CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 bg-[#0A192F] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-white mb-2">Rate & Save Your Favorites</h2>
          <p className="font-body text-sm text-white/50 mb-6 max-w-md mx-auto">Become a free member to rate businesses, write reviews, and save your go-to spots across Manila and Cavite.</p>
          <button onClick={() => setShowSignup(true)}
            className="px-8 py-3 bg-[#00D4FF] text-[#0A192F] font-body font-bold rounded-xl hover:bg-white transition-colors">
            Sign Up Free — It's 100% Free
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {ratingBiz && <RateModal biz={ratingBiz} onClose={() => setRatingBiz(null)} />}
        {showSignup && <MemberSignupModal onClose={() => setShowSignup(false)} />}
      </AnimatePresence>
      {infoBiz && <BusinessBioModal business={infoBiz} onClose={() => setInfoBiz(null)} onUpdated={(updated) => setDbBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b))} />}
      <AdminQuickAddFAB
        defaultMode="business"
        forceSection="food"
        forceSubcategory={selectedSubcat || undefined}
        onAdded={() => {
          base44.entities.Business.filter({ section: 'food', is_active: true }).then(setDbBusinesses).catch(() => {});
        }}
      />
    </div>
  );
}