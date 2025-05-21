import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import Services from './components/Services';
import Contact from './components/Contact';
import { BlogProvider } from './contexts/BlogContext';
import AdminLayout from './components/AdminLayout';
import {
  SuperAdminDashboard,
  AdminLogin,
  AdminDashboardContent,
  AdminDoctorManagement,
  AdminBlogManagement,
  Dashboard,
  Login,
  BlogPost,
  Appointment
} from './pages';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
}

// Protected Route component
const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'admin' }) => {
  const token = localStorage.getItem('adminToken');
  const role = localStorage.getItem('adminRole');

  if (!token || !role) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole === 'super_admin' && role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BlogProvider>
      <Router>
        <Routes>
          {/* Admin routes with shared layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<AdminLayout />}>
            {/* Regular admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardContent />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/doctors" 
              element={
                <ProtectedAdminRoute>
                  <AdminDoctorManagement />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/blogs" 
              element={
                <ProtectedAdminRoute>
                  <AdminBlogManagement />
                </ProtectedAdminRoute>
              } 
            />
            
            {/* Super admin routes */}
            <Route 
              path="/admin/super-dashboard" 
              element={
                <ProtectedAdminRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
          </Route>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/appointment" element={<Appointment />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="appointments" element={
              <div className="bg-white p-8 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Lịch hẹn của bạn</h2>
                <p className="text-gray-600 mb-4">Danh sách các lịch hẹn sắp tới và đã qua.</p>
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </BlogProvider>
  );
}

export default App;
