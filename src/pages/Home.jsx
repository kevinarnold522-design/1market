import React, { lazy, Suspense } from 'react';
import Navbar from '../components/home/Navbar';
import MascotDog from '../components/MascotDog';
import Footer from '../components/home/Footer';
import WelcomeSplash from '../components/home/WelcomeSplash';
import TrendingSearches from '../components/home/TrendingSearches';
import MovingWelcomeBanner from '../components/home/MovingWelcomeBanner';
import HeroSlider from '../components/home/HeroSlider';
import CategoryCards from '../components/home/CategoryCards';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';

// Lazy-load heavy/below-fold sections
const StarField = lazy(() => import('../components/StarField'));
const ParticleBackground = lazy(() => import('../components/ParticleBackground'));
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const CategoryCards2 = CategoryCards; // already imported above
const WhatMakesUsSpecial = lazy(() => import('../components/home/WhatMakesUsSpecial'));
const FlashDealsSection = lazy(() => import('../components/home/FlashDealsSection'));
const TopSellersSection = lazy(() => import('../components/home/TopSellersSection'));
const PhFlightDeals = lazy(() => import('../components/home/PhFlightDeals'));
const PhHotelDeals = lazy(() => import('../components/home/PhHotelDeals'));
const FeaturedListings = lazy(() => import('../components/home/FeaturedListings'));
const BuySellElectronicsDeals = lazy(() => import('../components/home/BuySellElectronicsDeals'));
const RentDashboardLazy = lazy(() => import('../components/home/MovingListingsDashboards').then(m => ({ default: m.RentDashboard })));
const ShoesClothingLazy = lazy(() => import('../components/home/MovingListingsDashboards').then(m => ({ default: m.ShoesClothingDashboard })));
const ServicesLazy = lazy(() => import('../components/home/MovingListingsDashboards').then(m => ({ default: m.ServicesDashboard })));
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const ReviewHighlights = lazy(() => import('../components/home/ReviewHighlights'));
const CommunityAnimation = lazy(() => import('../components/home/CommunityAnimation'));
const RecentlyViewed = lazy(() => import('../components/home/RecentlyViewed'));
const SuggestionBox = lazy(() => import('../components/home/SuggestionBox'));
const BrandingBanner = lazy(() => import('../components/home/BrandingBanner'));
const FilipinoPrideBanner = lazy(() => import('../components/home/FilipinoPrideBanner'));
const SuggestionsBar = lazy(() => import('../components/home/SuggestionsBar'));
const CustomerSupportButton = lazy(() => import('../components/CustomerSupportButton'));
const AdminQuickAddFAB = lazy(() => import('../components/admin/AdminQuickAddFAB'));
const AdManager = lazy(() => import('../components/AdManager'));
const GetStartedButton = lazy(() => import('../components/GetStartedButton'));
const PhilippinesTravelBanner = lazy(() => import('../components/home/PhilippinesTravelBanner'));
// LiveStatsBar removed

const Spinner = () => null; // silent fallback — no layout shift

const HERO_IMAGE = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/be5b76b23_generated_1fcae122.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#001060] pt-8 overflow-x-hidden relative">
      <Suspense fallback={<Spinner />}>
        <StarField />
        <ParticleBackground />
      </Suspense>

      <div className="relative z-10">
        <WelcomeSplash />
        <Navbar />
        <TrendingSearches />
        <Suspense fallback={<Spinner />}><FilipinoPrideBanner /></Suspense>
        <Suspense fallback={<Spinner />}><SuggestionsBar /></Suspense>
        <MovingWelcomeBanner />
        <Suspense fallback={<Spinner />}><BrandingBanner /></Suspense>
        <HeroSlider />
        <Suspense fallback={<Spinner />}><HeroSection heroImage={HERO_IMAGE} /></Suspense>
        <Suspense fallback={<Spinner />}><WhatMakesUsSpecial /></Suspense>
        <Suspense fallback={<Spinner />}><FlashDealsSection /></Suspense>
        <CategoryCards />
        <Suspense fallback={<Spinner />}><TopSellersSection /></Suspense>
        <Suspense fallback={<Spinner />}><PhFlightDeals /></Suspense>
        <Suspense fallback={<Spinner />}><PhHotelDeals /></Suspense>
        <Suspense fallback={<Spinner />}><FeaturedListings /></Suspense>
        <Suspense fallback={<Spinner />}><BuySellElectronicsDeals /></Suspense>
        <Suspense fallback={<Spinner />}><RentDashboardLazy /></Suspense>
        <Suspense fallback={<Spinner />}><ShoesClothingLazy /></Suspense>
        <Suspense fallback={<Spinner />}><ServicesLazy /></Suspense>
        <Suspense fallback={<Spinner />}><HowItWorksSection /></Suspense>
        <Suspense fallback={<Spinner />}><ReviewHighlights /></Suspense>
        <Suspense fallback={<Spinner />}><CommunityAnimation /></Suspense>
        <Suspense fallback={<Spinner />}><RecentlyViewed /></Suspense>
        <Footer />
        <Suspense fallback={<Spinner />}><SuggestionBox /></Suspense>
      </div>

      <Suspense fallback={<Spinner />}><PhilippinesTravelBanner /></Suspense>
      <Suspense fallback={<Spinner />}><CustomerSupportButton /></Suspense>
      <Suspense fallback={<Spinner />}><AdminQuickAddFAB defaultMode="listing" /></Suspense>
      <Suspense fallback={<Spinner />}><AdManager /></Suspense>
      <Suspense fallback={<Spinner />}><GetStartedButton /></Suspense>
      <MascotDog page="home" />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}