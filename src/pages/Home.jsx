import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';

import MascotDog from '../components/MascotDog';
import Footer from '../components/home/Footer';
import WelcomeSplash from '../components/home/WelcomeSplash';
import CategoryCards from '../components/home/CategoryCards';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';
import RoyalBlueWaves from '../components/RoyalBlueWaves';

// Lazy-load heavy/below-fold sections
const LiveCategoryDashboards = lazy(() => import('../components/home/LiveCategoryDashboards'));
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const CompactOneStopDashboardLazy = lazy(() => import('../components/home/OneStopShopDashboard'));
const FlashDealsSection = lazy(() => import('../components/home/FlashDealsSection'));
const PhFlightDeals = lazy(() => import('../components/home/PhFlightDeals'));
const PhHotelDeals = lazy(() => import('../components/home/PhHotelDeals'));
const FeaturedListings = lazy(() => import('../components/home/FeaturedListings'));
const TopSellersSection = lazy(() => import('../components/home/TopSellersSection'));


const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const ReviewHighlights = lazy(() => import('../components/home/ReviewHighlights'));
const CommunityAnimation = lazy(() => import('../components/home/CommunityAnimation'));
const RecentlyViewed = lazy(() => import('../components/home/RecentlyViewed'));
const SuggestionBox = lazy(() => import('../components/home/SuggestionBox'));
const CustomerSupportButton = lazy(() => import('../components/CustomerSupportButton'));
// AdminQuickAddFAB replaced by PostListingMenu in navbar
const AdManager = lazy(() => import('../components/AdManager'));
const GetStartedButton = lazy(() => import('../components/GetStartedButton'));
const PhilippinesTravelBanner = lazy(() => import('../components/home/PhilippinesTravelBanner'));
// LiveStatsBar removed

const Spinner = () => null; // silent fallback — no layout shift
const HERO_IMAGE = '';

function LazyOnVisible({ children, minHeight = 80 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '500px 0px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ minHeight: visible ? 0 : minHeight }}>{visible ? children : null}</div>;
}

function DeferredMount({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const run = () => setReady(true);
    const id = window.requestIdleCallback ? window.requestIdleCallback(run) : window.setTimeout(run, 1200);
    return () => window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id);
  }, []);
  return ready ? children : null;
}

export default function Home() {
  return (
    <div className="home-blue-aligned min-h-screen overflow-x-hidden relative" style={{ background: 'transparent' }}>
      {/* Permanent royal blue wave background */}
      <RoyalBlueWaves />
      <div className="fixed inset-0 -z-10" style={{ background: 'transparent' }} />
      
      <div className="relative z-10">
        <WelcomeSplash />
        
        <Suspense fallback={<Spinner />}><HeroSection heroImage={HERO_IMAGE} /></Suspense>
        <CategoryCards />
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><CompactOneStopDashboardLazy /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><FlashDealsSection /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><PhFlightDeals /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><PhHotelDeals /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={160}><Suspense fallback={<Spinner />}><FeaturedListings /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><TopSellersSection /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={160}><Suspense fallback={<Spinner />}><LiveCategoryDashboards /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><HowItWorksSection /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><ReviewHighlights /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={120}><Suspense fallback={<Spinner />}><CommunityAnimation /></Suspense></LazyOnVisible>
        <LazyOnVisible minHeight={80}><Suspense fallback={<Spinner />}><RecentlyViewed /></Suspense></LazyOnVisible>
        <Footer />
        <DeferredMount><Suspense fallback={<Spinner />}><SuggestionBox /></Suspense></DeferredMount>
      </div>

      <DeferredMount><Suspense fallback={<Spinner />}><PhilippinesTravelBanner /></Suspense></DeferredMount>
      <DeferredMount><Suspense fallback={<Spinner />}><CustomerSupportButton /></Suspense></DeferredMount>
      <DeferredMount><Suspense fallback={<Spinner />}><AdManager /></Suspense></DeferredMount>
      <DeferredMount><Suspense fallback={<Spinner />}><GetStartedButton /></Suspense></DeferredMount>
      <MascotDog page="home" />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}