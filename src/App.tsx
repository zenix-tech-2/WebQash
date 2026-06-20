import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { isSupabaseConfigured } from './lib/supabase';

// Pages - Lazy import to avoid issues
import { Landing } from './pages/Landing';
import { Login, Register } from './pages/Auth';
import { Payment } from './pages/Payment';
import { Dashboard } from './pages/Dashboard';
import { Courses, CourseDetail } from './pages/Courses';
import { Products, ProductDetail } from './pages/Products';
import { Accounts } from './pages/Accounts';
import { Proxies } from './pages/Proxies';
import { Tutorials, TutorialDetail } from './pages/Tutorials';
import { Support, TicketDetail } from './pages/Support';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminAccounts } from './pages/admin/AdminAccounts';
import { AdminProxies } from './pages/admin/AdminProxies';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminTickets } from './pages/admin/AdminTickets';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminProducts } from './pages/admin/AdminProducts';

const AppContent: React.FC = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<Payment />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/proxies" element={<Proxies />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/tutorials/:id" element={<TutorialDetail />} />
      <Route path="/support" element={<Support />} />
      <Route path="/support/:id" element={<TicketDetail />} />
      <Route path="/wallet" element={<Dashboard />} />
      <Route path="/more" element={<Dashboard />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/accounts" element={<AdminAccounts />} />
      <Route path="/admin/proxies" element={<AdminProxies />} />
      <Route path="/admin/payments" element={<AdminDashboard />} />
      <Route path="/admin/tickets" element={<AdminTickets />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/admin/podcasts" element={<AdminNotifications />} />
      <Route path="/admin/socials" element={<AdminSettings />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
          {!isSupabaseConfigured && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-500/20 border-b border-yellow-500/50 px-4 py-2 text-center text-yellow-200 text-sm z-50">
              Warning: Supabase is not configured. Please set environment variables.
            </div>
          )}
          <AppContent />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
