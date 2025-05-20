import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointment from './pages/Appointment';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="appointments" element={
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
          } />
          <Route path="treatments" element={
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
          } />
          <Route path="profile" element={
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
          } />
        </Route>

        {/* Public routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Home />
          </div>
        } />
        <Route path="/login" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Login />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <About />
          </div>
        } />
        <Route path="/services" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Services />
          </div>
        } />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </Router>
  );
}

export default App;
