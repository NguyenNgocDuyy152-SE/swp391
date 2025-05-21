import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
>>>>>>> refs/remotes/origin/main
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import Services from './components/Services';
import Contact from './components/Contact';
import { BlogProvider } from './contexts/BlogContext';
import AdminLayout from './components/AdminLayout';
<<<<<<< HEAD
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
=======
import { AnimatePresence, motion } from 'framer-motion';
>>>>>>> refs/remotes/origin/main

function AnimatedRoutes() {
  const location = useLocation();
  return (
<<<<<<< HEAD
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
=======
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Admin routes with shared layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardContent />} />
          <Route path="/admin/doctors" element={<AdminDoctorManagement />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="appointments" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <div className="bg-white p-8 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Lịch hẹn của bạn</h2>
                <p className="text-gray-600 mb-4">Danh sách các lịch hẹn sắp tới và đã qua.</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/05/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:30</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BS. Nguyễn Văn A</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Khám tổng quát</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Đã xác nhận
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22/05/2023</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">14:15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BS. Trần Thị B</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tư vấn dinh dưỡng</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Chờ xác nhận
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          } />
          <Route path="treatments" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <div className="bg-white p-8 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Liệu trình điều trị</h2>
                <p className="text-gray-600 mb-6">Thông tin về các liệu trình điều trị hiện tại của bạn.</p>

                <div className="mb-8 border-b pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Liệu trình 1: Điều trị hormon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bác sĩ phụ trách</p>
                      <p className="mt-1">BS. Nguyễn Văn A</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                      <p className="mt-1">01/04/2023</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tình trạng</p>
                      <p className="mt-1">Đang tiến hành (2/6 tuần)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                      <p className="mt-1">Đang đạt kết quả tốt</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Liệu trình 2: Bổ sung dinh dưỡng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bác sĩ phụ trách</p>
                      <p className="mt-1">BS. Trần Thị B</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                      <p className="mt-1">15/04/2023</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tình trạng</p>
                      <p className="mt-1">Đang tiến hành (3/12 tuần)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                      <p className="mt-1">Cần điều chỉnh chế độ</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          } />
          <Route path="profile" element={
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
              <div className="bg-white p-8 shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân</h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                      <input
                        type="text"
                        id="fullName"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="Nguyễn Văn C"
                      />
                    </div>
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                      <input
                        type="date"
                        id="dob"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="1990-01-01"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="nguyenvanc@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <input
                        type="tel"
                        id="phone"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="0123456789"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                      <input
                        type="text"
                        id="address"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        defaultValue="123 Đường ABC, Quận XYZ, TP.HCM"
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          } />
        </Route>

        {/* Public routes */}
        <Route path="/" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Home />
            </div>
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Login />
            </div>
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <About />
            </div>
          </motion.div>
        } />
        <Route path="/blog" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div>
              <Navbar />
              <Blog />
            </div>
          </motion.div>
        } />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/services" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Services />
            </div>
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Contact />
            </div>
          </motion.div>
        } />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
>>>>>>> refs/remotes/origin/main
  );
}

export default App;
