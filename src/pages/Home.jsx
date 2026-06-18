import React, { lazy, Suspense } from 'react';

import MascotDog from '../components/MascotDog';
import Footer from '../components/home/Footer';
import WelcomeSplash from '../components/home/WelcomeSplash';
import CategoryCards from '../components/home/CategoryCards';
import CompactOneStopDashboard from '../components/home/OneStopShopDashboard';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';

// Lazy-load heavy/below-fold sections
const LiveCategoryDashboards = lazy(() => import('../components/home/LiveCategoryDashboards'));
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const CompactOneStopDashboardLazy = lazy(() => import('../components/home/OneStopShopDashboard'));
const FlashDealsSection = lazy(() => import('../components/home/FlashDealsSection'));
const PhFlightDeals = lazy(() => import('../components/home/PhFlightDeals'));
const PhHotelDeals = lazy(() => import('../components/home/PhHotelDeals'));
const FeaturedListings = lazy(() => import('../components/home/FeaturedListings'));


const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const ReviewHighlights = lazy(() => import('../components/home/ReviewHighlights'));
const CommunityAnimation = lazy(() => import('../components/home/CommunityAnimation'));
const RecentlyViewed = lazy(() => import('../components/home/RecentlyViewed'));
const SuggestionBox = lazy(() => import('../components/home/SuggestionBox'));
const BrandingBanner = lazy(() => import('../components/home/BrandingBanner'));

const CustomerSupportButton = lazy(() => import('../components/CustomerSupportButton'));
// AdminQuickAddFAB replaced by PostListingMenu in navbar
const AdManager = lazy(() => import('../components/AdManager'));
const GetStartedButton = lazy(() => import('../components/GetStartedButton'));
const PhilippinesTravelBanner = lazy(() => import('../components/home/PhilippinesTravelBanner'));
// LiveStatsBar removed

const Spinner = () => null; // silent fallback — no layout shift
const HERO_IMAGE = 'https://media.base44.com/images/public/6a0bd24ab498f7341650c2a0/be5b76b23_generated_1fcae122.png';

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }}>
      {/* Permanent royal blue background */}
      <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(180deg, #0033CC 0%, #001a80 100%)' }} />
      
      <div className="relative z-10">
        <WelcomeSplash />
        
        <Suspense fallback={<Spinner />}><HeroSection heroImage={HERO_IMAGE} /></Suspense>
        <CategoryCards />
        <Suspense fallback={<Spinner />}><CompactOneStopDashboardLazy /></Suspense>
        <Suspense fallback={<Spinner />}><FlashDealsSection /></Suspense>
        <Suspense fallback={<Spinner />}><PhFlightDeals /></Suspense>
        <Suspense fallback={<Spinner />}><PhHotelDeals /></Suspense>
        <Suspense fallback={<Spinner />}><FeaturedListings /></Suspense>
        <Suspense fallback={<Spinner />}><LiveCategoryDashboards /></Suspense>
        <Suspense fallback={<Spinner />}><HowItWorksSection /></Suspense>
        <Suspense fallback={<Spinner />}><ReviewHighlights /></Suspense>
        <Suspense fallback={<Spinner />}><CommunityAnimation /></Suspense>
        <Suspense fallback={<Spinner />}><RecentlyViewed /></Suspense>
        <Footer />
        <Suspense fallback={<Spinner />}><SuggestionBox /></Suspense>
      </div>

      <Suspense fallback={<Spinner />}><PhilippinesTravelBanner /></Suspense>
      <Suspense fallback={<Spinner />}><CustomerSupportButton /></Suspense>
      <Suspense fallback={<Spinner />}><AdManager /></Suspense>
      <Suspense fallback={<Spinner />}><GetStartedButton /></Suspense>
      <MascotDog page="home" />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}