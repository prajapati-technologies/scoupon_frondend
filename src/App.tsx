import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import RegisterPage from './pages/auth/Register'
import LoginPage from './pages/auth/Login'
import VendorDashboard from './pages/vendor/VendorDashboard'
import { useAuth } from './useAuth'
import { ProtectedRouteProps, UserRole } from './ProtectedRouteProps'
import Profile from './pages/vendor/Profile'
// import Subscription1 from './pages/vendor/Subscription1'
import Transaction from './pages/vendor/Transction'
import AdminPackages from './pages/admin/packages/Packages'
import CreatePackage from './pages/admin/packages/CreatePackage'
import LandingPage from './pages/LandingPage'
import UpdatePackage from './pages/admin/packages/UpdatePackage'
import Vendors from './pages/admin/vendors/Vendors'
import Transactions from './pages/admin/transactions/Transactions'
import PaymentSuccessHandler from './pages/vendor/PaymentSuccessHandler'
import PaymentCancelHandler from './pages/vendor/PaymentCancelHandler'
import AllVendors from './pages/AllVendors'
import SearchVendors from './pages/SearchVendors'
import AdminDashbaord from './pages/admin/AdminDashbaord'
import UpdateProfile from './pages/vendor/UpdateProfile'
import ResetPasswordPage from './pages/auth/ResetPassword'
import ForgotPasswordPage from './pages/auth/ForgetPassword'
import MyAds from './pages/MyAds'
import CoreAeration from './pages/CoreAeration'
import CoreAerationCaution from './pages/CoreAerationCaution'
import CoreAerationTips from './pages/CoreAerationTips'
import AddZipcode from './pages/vendor/AddZipcode'
import AddGallery from './pages/vendor/AddGallery'
import ResetPassword from './pages/vendor/ResetPassword'
import AdminResetPassword from './pages/admin/AdminResetPassword'
import Subscription from './pages/vendor/Subscription'
import CreateUser from './pages/admin/users/CreateUser'
import Chat from './pages/vendor/Chat'
import CreateTicket from './pages/vendor/CreateTicket'
import TicketMessages from './pages/vendor/TicketMessages'
import CreatePromo from './pages/admin/promo/CreatePromo'
import ShowPromos from './pages/admin/promo/ShowPromos'
import EditPromo from './pages/admin/promo/EditPromo'
import AllTickets from './pages/admin/tickets/AllTickets'
import ChatTicket from './pages/admin/tickets/ChatTicket'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Code from './pages/Code'
import PromoPage from './pages/PromoPage'
import EditAdminUser from './pages/admin/users/EditAdminUser'
import ImportUsers from './pages/admin/users/ImportUsers'
import CertificationBadge from './pages/vendor/CertificationBadge'
import Badge from './pages/Badge'
function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user role is not allowed
  if (!allowedRoles.includes(user?.utype as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - accessible to all users */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/all-vendors" element={<AllVendors />} />
        <Route path="/search-vendors" element={<SearchVendors />} />
        <Route path="/core-aeration" element={<CoreAeration />} />
        <Route path="/core-aeration-caution" element={<CoreAerationCaution />} />
        <Route path="/core-aeration-tips" element={<CoreAerationTips />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/conduct-code" element={<Code />} />
        <Route path="/Promos" element={<PromoPage />} />
        <Route path="/badge/:vendorId" element={<Badge />} />
        
        {/* Protected routes that require authentication */}
        <Route path="/my-ads" element={
          <ProtectedRoute allowedRoles={['VENDOR']}>
            <MyAds />
          </ProtectedRoute>
        } />
        {/* Public routes */}
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/reset-password/:userId"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
        />
        {/* ...other public routes... */}

        {/* Protected routes */}
        <Route path="/vendor/*" element={
          <ProtectedRoute allowedRoles={['VENDOR']}>
            <Routes>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="profiles" element={<Profile />} />
              <Route path="profile/update" element={<UpdateProfile />} />
              <Route path="subscriptions" element={<Subscription/>} />
              <Route path="add/zipcode" element={<AddZipcode />} />
              <Route path="transactions" element={<Transaction />} />
              <Route path="/payment-success" element={<PaymentSuccessHandler />} />
              <Route path="/payment-cancel" element={<PaymentCancelHandler />} />
              <Route path="add/gallery" element={<AddGallery />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="certification-badge" element={<CertificationBadge />} />
              <Route path="/support-chats" element={<Chat />} />
              <Route path="/createticket" element={<CreateTicket />} />
              <Route path="/ticket/:id" element={<TicketMessages />} />
            </Routes>
          </ProtectedRoute>
        } />
      

        {/* Fix the admin routes paths */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN','SUPERADMIN']}>
            {/* Admin routes */}
            <Routes>
              <Route path="dashboard" element={<AdminDashbaord />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="create-package" element={<CreatePackage />} />
              <Route path="packages/:id/edit" element={<UpdatePackage />} />
              <Route path="users" element={<Vendors />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="reset-password" element={<AdminResetPassword />} />
              <Route path="create-promo" element={<CreatePromo />} />
              <Route path="promos" element={<ShowPromos />} />
              <Route path="edit-promo/:id" element={<EditPromo />} />
              <Route path="tickets" element={<AllTickets />} />
              <Route path="ticket/:id" element={<ChatTicket />} />
              <Route path="update-user/:id" element={<EditAdminUser />} />
              <Route path="import-users" element={<ImportUsers />} />

            </Routes>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
