import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import CategoryCards from '../components/home/CategoryCards';
import FeaturedFeed from '../components/home/FeaturedFeed';
import Footer from '../components/home/Footer';
import BrandingBanner from '../components/home/BrandingBanner';
import TrendingDeals from '../components/home/TrendingDeals';
import WelcomeSplash from '../components/home/WelcomeSplash';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/be5b76b23_generated_1fcae122.png';

const CATEGORY_IMAGES = [
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/01de476de_generated_bb6a91ec.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/721da2411_generated_1e2809d2.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/9cae4b295_generated_247ddfde.png',
];

const FEATURED_IMAGES = [
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/6098af1fb_generated_7d2dead2.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/d8b9d87ce_generated_b111955d.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/03139a3d5_generated_8626cd84.png',
  'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/09b1e18d7_generated_0ca11390.png',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 overflow-x-hidden">
      <WelcomeSplash />
      <Navbar />
      <BrandingBanner />
      <HeroSection heroImage={HERO_IMAGE} />
      <CategoryCards />
      <TrendingDeals />
      <FeaturedFeed images={FEATURED_IMAGES} />
      <Footer />
    </div>
  );
}