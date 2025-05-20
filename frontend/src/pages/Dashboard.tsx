import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Decode token to get user info (this is a simple approach; in production, you might want to validate on the server)
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            setUserName(tokenData.name || 'User');
        } catch (error) {
            console.error('Error decoding token', error);
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-6 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="text-sm text-gray-600">
                            Xin chào, {userName}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 px-6 sm:px-6 lg:px-8">
                    <Outlet />
                    
                    {/* Default content when no sub-route is selected */}
                    <div className="bg-white p-8 shadow rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Chào mừng đến với Gender Healthcare Service Management System</h2>
                        <p className="text-gray-600">
                            Hệ thống quản lý dịch vụ chăm sóc sức khỏe sinh sản và hiếm muộn. 
                            Hãy sử dụng thanh menu bên trái để điều hướng đến các chức năng khác nhau.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="p-6 bg-blue-50 rounded-lg shadow-md">
                                <h3 className="font-semibold text-blue-700 mb-2">Lịch hẹn sắp tới</h3>
                                <p className="text-sm text-gray-600">Xem và quản lý các lịch hẹn khám sắp tới của bạn.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/appointments')}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Xem lịch hẹn
                                </button>
                            </div>
                            
                            <div className="p-6 bg-green-50 rounded-lg shadow-md">
                                <h3 className="font-semibold text-green-700 mb-2">Liệu trình điều trị</h3>
                                <p className="text-sm text-gray-600">Theo dõi quá trình điều trị và các liệu trình hiện tại.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/treatments')}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Xem liệu trình
                                </button>
                            </div>
                            
                            <div className="p-6 bg-purple-50 rounded-lg shadow-md">
                                <h3 className="font-semibold text-purple-700 mb-2">Hồ sơ cá nhân</h3>
                                <p className="text-sm text-gray-600">Cập nhật thông tin cá nhân và hồ sơ sức khỏe của bạn.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/profile')}
                                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Xem hồ sơ
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard; 