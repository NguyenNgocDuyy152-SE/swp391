import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface Admin {
    id: number;
    username: string;
    role: string;
    last_login: string;
}

const AdminDashboard: React.FC = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAdmin(data.admin);
                } else {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminRole');
                    navigate('/admin/login');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('Không thể kết nối đến máy chủ');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        navigate('/admin/login');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    }

    const menuItems = [
        { title: 'Tổng quan', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { title: 'Quản lý bác sĩ', path: '/admin/doctors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { title: 'Quản lý bệnh nhân', path: '/admin/patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { title: 'Lịch hẹn', path: '/admin/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { title: 'Đánh giá', path: '/admin/ratings', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        { title: 'Bài viết blog', path: '/admin/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
        { title: 'Người dùng', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { title: 'Cài đặt', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4 border-b border-blue-700">
                    <div className={`${!sidebarOpen && 'hidden'} font-bold text-xl`}>Admin Panel</div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="p-1 rounded-full hover:bg-blue-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {sidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                        </svg>
                    </button>
                </div>

                <nav className="mt-5">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index} className="mb-2">
                                <Link
                                    to={item.path}
                                    className={`flex items-center py-3 px-4 ${
                                        location.pathname === item.path
                                            ? 'bg-blue-900 text-white'
                                            : 'text-blue-100 hover:bg-blue-700'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    {sidebarOpen && <span className="ml-3">{item.title}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h1 className="text-xl font-semibold">Bảng Điều Khiển Quản Trị</h1>
                        <div className="flex items-center">
                            {admin && (
                                <div className="mr-4">
                                    <span className="text-gray-600 mr-2">Xin chào,</span>
                                    <span className="font-medium">{admin.username}</span>
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 rounded text-sm text-white bg-red-500 hover:bg-red-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">Bệnh nhân</h3>
                                        <p className="text-2xl font-bold">1,254</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 text-green-800">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">Lịch hẹn</h3>
                                        <p className="text-2xl font-bold">48</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 text-purple-800">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">Bác sĩ</h3>
                                        <p className="text-2xl font-bold">24</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Thông tin quản trị viên</h2>
                            {admin && (
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {admin.id}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Tên đăng nhập</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {admin.username}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Đăng nhập gần nhất</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {new Date(admin.last_login).toLocaleString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            )}
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Lịch hẹn gần nhất</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Văn A</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bs. Trần Thị B</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/05/2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Đã xác nhận
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lê Thị C</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bs. Phạm Văn D</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">16/05/2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Chờ xác nhận
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Hoàng Văn E</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bs. Trần Thị B</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">17/05/2023</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Đã hủy
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard; 