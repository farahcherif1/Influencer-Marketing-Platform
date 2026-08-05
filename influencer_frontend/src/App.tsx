import './App.css';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './Context/UserContext';

import SearchPage from './Pages/SearchPage';
import ProfilePage from './Pages/ProfilePage';
import ContactUs from './Pages/ContactUs';
import FAQPage from './Pages/FAQPage';
import SignUpForm from './Pages/SignupPage/Signup';
import VerifyEmailPage from './Pages/SignupPage/VerifyEmailPage';
import LoginPage from './Pages/SignupPage/LoginPage';
import Layout from './Components/Layout';
import CompleteBrandProfile from './Components/CompleteBrandprofile';
import CompleteCreatorProfile from './Components/CompleteCreatorProfile';
import HomePage from './Pages/HomePage';
import TermsOfUse from './Pages/TermsPage';
import PrivacyPolicy from './Pages/PrivacyPage';
import InterceptorSetup from './api/InterceptorSetup';
import ReferralsPage from './Pages/ReferralPage';
import BrandAccessibleLayout from './BrandAccessibleLayout';
import CreatorLayout from './CreatorLayout';
import { CartProvider } from './Context/cartProvider';
import PublicOnlyRoute from './Context/PublicOnlyRoute';
import ProfileCompletionGuard from './Context/ProfileCompletionGuard';
import AuthSuccess from './Pages/SignupPage/AuthSuccess';
import EditProfileTabs from './Components/CreatorProfile/EditProfileTabs';
import ForgotPasswordPage from './Pages/SignupPage/ForgetPassword';
import ResetPasswordPage from './Pages/SignupPage/ResetPasswordPage';
import CheckoutPage from './Pages/Booking/CheckoutPage';
import OrdersPage from './Pages/Orders';
import AdminDashboard from './admin/adminDashboard';

import BrandLayout from './BrandLayout';
import AccessGuard from './Context/AccessGuard';
import EarningsPage from './Pages/EarningsPage';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <InterceptorSetup />

        <Routes>
          <Route element={<CreatorLayout />}>
            <Route
              path="/creator/edit-profile"
              element={
                <AccessGuard>
                  <EditProfileTabs />
                </AccessGuard>
              }
            />
          </Route>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route element={<BrandLayout />}>
            <Route element={<BrandLayout />}>
              <Route
                path="/brand/edit-profile"
                element={
                  <AccessGuard>
                    <EditProfileTabs />
                  </AccessGuard>
                }
              />
            </Route>
          </Route>
          <Route element={<Layout />}>
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignUpForm />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PublicOnlyRoute>
                  <VerifyEmailPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/reset/:token/set-password/"
              element={
                <PublicOnlyRoute>
                  <ResetPasswordPage />
                </PublicOnlyRoute>
              }
            />
          </Route>
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/*  Shared routes with cart for brand users only */}
          <Route element={<BrandAccessibleLayout />}>
            <Route path="/checkout" element={<CheckoutPage />}>
              <Route path="/checkout/:itemIndex" element={<CheckoutPage />} />
            </Route>

            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/orders/:bookingId" element={<OrdersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route
                path="/complete-brand-profile"
                element={
                  <ProfileCompletionGuard>
                    <CompleteBrandProfile />
                  </ProfileCompletionGuard>
                }
              />
              <Route
                path="/complete-creator-profile"
                element={
                  <ProfileCompletionGuard>
                    <CompleteCreatorProfile />
                  </ProfileCompletionGuard>
                }
              />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="/referrals"
                element={
                  <AccessGuard>
                    <ReferralsPage />
                  </AccessGuard>
                }
              />
              <Route
                path="/earnings"
                element={
                  <AccessGuard>
                    <EarningsPage />
                  </AccessGuard>
                }
              />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
