import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// Add page imports here
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Travel from './pages/Travel';
import Food from './pages/Food';
import BuySell from './pages/BuySell.jsx';
import Admin from './pages/Admin';
import SellerDashboard from './pages/SellerDashboard';
import ForRent from './pages/ForRent';
import Services from './pages/Services';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserProfile from './pages/UserProfile';
import Jobs from './pages/Jobs';
import SellerProfilePage from './pages/SellerProfilePage';
import ListingDetail from './pages/ListingDetail';
import About from './pages/About';
import ExplorePage from './pages/ExplorePage';
import Messages from './pages/Messages';
import Favourites from './pages/Favourites';
import BusinessCommunity from './pages/BusinessCommunity';
import Notifications from './pages/Notifications';
import SellerOnboarding from './pages/SellerOnboarding';
import PostAdLanding from './pages/PostAdLanding';
import GlowInteraction from './components/GlowInteraction';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/food" element={<Food />} />
        <Route path="/buysell" element={<BuySell />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/seller" element={<Navigate to="/profile?tab=listings" replace />} />
        <Route path="/rent" element={<ForRent />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
        <Route path="/seller-profile/:sellerId" element={<SellerProfilePage />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/community" element={<BusinessCommunity />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/onboarding" element={<SellerOnboarding />} />
        <Route path="/post-ad" element={<PostAdLanding />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <GlowInteraction />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App