import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

// Route Guards
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SellerRoute } from './components/auth/SellerRoute';

// Common Layout Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AIAssistant } from './components/ai/AIAssistant';

// Auth Pages
import { Login } from './pages/auth/Login';
import { SellerLogin } from './pages/auth/SellerLogin';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Account } from './pages/customer/Account';
import { OrderHistory } from './pages/customer/OrderHistory';

// Admin Pages & Layout
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AddEditProduct } from './pages/admin/AddEditProduct';
import { AdminOrders } from './pages/admin/Orders';
import { AdminInventory } from './pages/admin/Inventory';
import { AdminAnalytics } from './pages/admin/Analytics';

// Main Layout Controller
const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/seller/login';
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Admin Portal Layout (protected by SellerRoute inside individual sub-routes)
  if (isAdminRoute) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAF7F2]">
        <AdminSidebar />
        <Routes>
          <Route
            path="/admin"
            element={
              <SellerRoute>
                <AdminDashboard />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <SellerRoute>
                <AdminProducts />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <SellerRoute>
                <AddEditProduct />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <SellerRoute>
                <AddEditProduct />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <SellerRoute>
                <AdminOrders />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <SellerRoute>
                <AdminInventory />
              </SellerRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <SellerRoute>
                <AdminAnalytics />
              </SellerRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    );
  }

  // Customer Storefront Layout
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#1A1A1A]">
      <Navbar onOpenAI={() => setIsAIOpen(true)} />
      <main className="flex-1">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<Home onOpenAI={() => setIsAIOpen(true)} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderConfirmation />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* Customer Account Routes (Protected) */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <AIAssistant isOpen={isAIOpen} setIsOpen={setIsAIOpen} />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <MainLayout />
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
