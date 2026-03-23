import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import ProductDetails from './pages/ProductDetails';
import PolicyPage from './pages/PolicyPage';
import TermsOfService from './pages/TermsOfService';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSections from './pages/admin/AdminSections';
import AdminReviews from './pages/admin/AdminReviews';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
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
    </Router>
  );
}

export default App;