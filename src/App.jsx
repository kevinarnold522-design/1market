import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Login from './pages/Login';
// Add page imports here
import Home from './pages/Home';
import Travel from './pages/Travel';
import Food from './pages/Food';
import BuySell from './pages/BuySell';
import Admin from './pages/Admin';
import SellerDashboard from './pages/SellerDashboard';
import ForRent from './pages/ForRent';
import Services from './pages/Services';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserProfile from './pages/UserProfile';
import Jobs from './pages/Jobs';
import SellerProfilePage from './pages/SellerProfilePage';

const AuthenticatedApp = () => {
  // 1Market is a public marketplace: pages render for everyone and sign in is
  // optional. Auth state is available via useAuth() for components that need it,
  // and protected actions route users to the in-app /login page.
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
      <Route path="*" element={<PageNotFound />} />
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
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
