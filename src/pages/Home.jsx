import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import CategoryCards from '../components/home/CategoryCards';
import Footer from '../components/home/Footer';
import BrandingBanner from '../components/home/BrandingBanner';
import WelcomeSplash from '../components/home/WelcomeSplash';
import BuySellElectronicsDeals from '../components/home/BuySellElectronicsDeals';
import MovingWelcomeBanner from '../components/home/MovingWelcomeBanner';
import CommunityAnimation from '../components/home/CommunityAnimation';
import SuggestionsBar from '../components/home/SuggestionsBar';
import { RentDashboard, ShoesClothingDashboard, ServicesDashboard } from '../components/home/MovingListingsDashboards';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FilipinoPrideBanner from '../components/home/FilipinoPrideBanner';
import WhatMakesUsSpecial from '../components/home/WhatMakesUsSpecial';
import SuggestionBox from '../components/home/SuggestionBox';
import PhFlightDeals from '../components/home/PhFlightDeals';
import PhHotelDeals from '../components/home/PhHotelDeals';
import StarField from '../components/StarField';
import PhilippinesTravelBanner from '../components/home/PhilippinesTravelBanner';
import ParticleBackground from '../components/ParticleBackground';
import CustomerSupportButton from '../components/CustomerSupportButton';
import ReviewHighlights from '../components/home/ReviewHighlights';
import FeaturedListings from '../components/home/FeaturedListings';
import AdminQuickAddFAB from '../components/admin/AdminQuickAddFAB';
import HeroSlider from '../components/home/HeroSlider';
import AdManager from '../components/AdManager';
import GetStartedButton from '../components/GetStartedButton';
import LiveStatsBar from '../components/home/LiveStatsBar';
import TrendingSearches from '../components/home/TrendingSearches';
import FlashDealsSection from '../components/home/FlashDealsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import TopSellersSection from '../components/home/TopSellersSection';
import AppDownloadBanner from '../components/home/AppDownloadBanner';
import NewsletterSection from '../components/home/NewsletterSection';
import RecentlyViewed from '../components/home/RecentlyViewed';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';

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
    <div className="min-h-screen bg-[#070F1A] pt-8 overflow-x-hidden relative">
      <StarField />
      <ParticleBackground />
      <div className="relative z-10">
      <WelcomeSplash />
      <Navbar />
      <LiveStatsBar />
      <TrendingSearches />
      <FilipinoPrideBanner />
      <SuggestionsBar />
      <MovingWelcomeBanner />
      <BrandingBanner />
      <HeroSlider />
      <HeroSection heroImage={HERO_IMAGE} />
      <WhatMakesUsSpecial />
      <FlashDealsSection />
      <CategoryCards />
      <TopSellersSection />
      <PhFlightDeals />
      <PhHotelDeals />
      <FeaturedListings />
      <BuySellElectronicsDeals />
      <RentDashboard />
      <ShoesClothingDashboard />
      <ServicesDashboard />
      <HowItWorksSection />
      <TestimonialsSection />
      <ReviewHighlights />
      <AppDownloadBanner />
      <NewsletterSection />
      <CommunityAnimation />
      <RecentlyViewed />
      <Footer />
      <SuggestionBox />
      </div>
      <PhilippinesTravelBanner />
      <CustomerSupportButton />
      <AdminQuickAddFAB defaultMode="listing" />
      <AdManager />
      <GetStartedButton />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}