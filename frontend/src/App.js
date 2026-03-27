import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Eagerly loaded (critical path)
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loaded public pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const About = lazy(() => import('./pages/About'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Lazy loaded admin pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSections = lazy(() => import('./pages/admin/AdminSections'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));

// Minimal loading fallback — keeps UI stable without a heavy spinner
const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0f' }} />
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Policy Pages */}
          <Route path="/shipping" element={<PolicyPage type="shipping" />} />
          <Route path="/returns" element={<PolicyPage type="returns" />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Admin Routes */}
          <Route path="/shop-admin-portal-2002/login" element={<AdminLogin />} />

          <Route path="/shop-admin-portal-2002" element={<AdminLayout />}>
            <Route index element={<Navigate to="/shop-admin-portal-2002/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="sections" element={<AdminSections />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;