import React, { lazy, Suspense } from 'react';

import MascotDog from '../components/MascotDog';
import Footer from '../components/home/Footer';
import TopBanner from '../components/home/TopBanner';
import WelcomeSplash from '../components/home/WelcomeSplash';
import CategoryCards from '../components/home/CategoryCards';
import CompactOneStopDashboard from '../components/home/OneStopShopDashboard';
import ScrollToTop from '../components/ScrollToTop';
import CookieBanner from '../components/CookieBanner';
import { Plus, Store } from 'lucide-react';

const PlusIcon = Plus;
const StoreIcon = Store;

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
        
        <TopBanner />
        
        <Suspense fallback={<Spinner />}><HeroSection heroImage={HERO_IMAGE} /></Suspense>
        <CategoryCards />
        <Suspense fallback={<Spinner />}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Post an Ad CTA */}
              <div className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: 'linear-gradient(135deg,rgba(0,51,204,0.5),rgba(0,26,128,0.7))', border: '1px solid rgba(0,212,255,0.25)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
                    <PlusIcon className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-sm">Got something to sell?</p>
                    <p className="font-body text-xs text-white/50">Post an Ad — browse all categories.</p>
                  </div>
                </div>
                <a href="/post-ad" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-[#0A192F] flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#00D4FF,#2563EB)', boxShadow: '0 0 16px rgba(0,212,255,0.35)' }}>
                  <PlusIcon className="w-4 h-4" /> Post an Ad
                </a>
              </div>
              {/* Become a Seller CTA */}
              <div className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(0,212,255,0.08))', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <StoreIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-sm">Want to earn money?</p>
                    <p className="font-body text-xs text-white/50">Open a Sales Account — start listing for free.</p>
                  </div>
                </div>
                <a href="/onboarding" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm text-white flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
                  <StoreIcon className="w-4 h-4" /> Become a Seller
                </a>
              </div>
            </div>
          </div>
        </Suspense>
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