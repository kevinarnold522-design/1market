import React, { lazy, Suspense } from 'react';
import Navbar from '../components/home/Navbar';
import MascotDog from '../components/MascotDog';
import Footer from '../components/home/Footer';
import WelcomeSplash from '../components/home/WelcomeSplash';
import MovingWelcomeBanner from '../components/home/MovingWelcomeBanner';
import CategoryCards from '../components/home/CategoryCards';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';
import AdOverlay from '../components/AdOverlay';
import WaveBackground from '../components/WaveBackground';


// Lazy-load heavy/below-fold sections
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const CategoryCards2 = CategoryCards; // already imported above
const WhatMakesUsSpecial = lazy(() => import('../components/home/WhatMakesUsSpecial'));
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
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: 'linear-gradient(180deg, #001240 0%, #002366 50%, #001a5c 100%)' }}>
      <WaveBackground />

      <div className="relative z-10">
        <WelcomeSplash />
        <Navbar />
        {/* Spacer for dual fixed navbar (top banner 40px + nav 40px + category bar 36px) */}
        <div style={{ height: 116 }} />
        <MovingWelcomeBanner />
        <Suspense fallback={<Spinner />}><BrandingBanner /></Suspense>
        <Suspense fallback={<Spinner />}><HeroSection heroImage={HERO_IMAGE} /></Suspense>
        <Suspense fallback={<Spinner />}><WhatMakesUsSpecial /></Suspense>
        <Suspense fallback={<Spinner />}><FlashDealsSection /></Suspense>
        <CategoryCards />
        <Suspense fallback={<Spinner />}><PhFlightDeals /></Suspense>
        <Suspense fallback={<Spinner />}><PhHotelDeals /></Suspense>
        <Suspense fallback={<Spinner />}><FeaturedListings /></Suspense>

        <Suspense fallback={<Spinner />}><HowItWorksSection /></Suspense>
        <Suspense fallback={<Spinner />}><ReviewHighlights /></Suspense>
        <Suspense fallback={<Spinner />}><CommunityAnimation /></Suspense>
        <Suspense fallback={<Spinner />}><RecentlyViewed /></Suspense>
        <Footer />
        <Suspense fallback={<Spinner />}><SuggestionBox /></Suspense>
      </div>

      <Suspense fallback={<Spinner />}><PhilippinesTravelBanner /></Suspense>
      <Suspense fallback={<Spinner />}><CustomerSupportButton /></Suspense>
      {/* AdminQuickAddFAB removed — use PostListingMenu in navbar */}
      <Suspense fallback={<Spinner />}><AdManager /></Suspense>
      <Suspense fallback={<Spinner />}><GetStartedButton /></Suspense>
      <AdOverlay />
      <MascotDog page="home" />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}