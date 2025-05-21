import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { get } from '../services/apiClient';

interface Admin {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    last_login?: string;
}

interface ProfileResponse {
    admin: Admin;
}

const AdminLayout: React.FC = () => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            const storedAdminData = localStorage.getItem('adminData');
            const storedRole = localStorage.getItem('adminRole');
            
            if (!token || !storedRole) {
                navigate('/admin/login');
                return;
            }

            // Kiểm tra role và path
            const currentPath = location.pathname;
            if (storedRole === 'admin' && currentPath.includes('/admin/super-dashboard')) {
                navigate('/admin/dashboard');
                return;
            }

            // Initialize with stored data if available
            if (storedAdminData) {
                try {
                    const parsedData = JSON.parse(storedAdminData);
                    setAdmin(parsedData);
                } catch (e) {
                    console.error('Error parsing stored admin data:', e);
                }
            }

            try {
                const response = await get<ProfileResponse>('/admin/profile');
                
                // Kiểm tra role từ API có khớp với stored role không
                if (response.admin.role !== storedRole) {
                    console.error('Role mismatch between stored and API data');
                    handleLogout();
                    return;
                }
                
                setAdmin(response.admin);
                localStorage.setItem('adminData', JSON.stringify(response.admin));
            } catch (error) {
                console.error('Error fetching profile:', error);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate, location]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminRole');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-blue-800 text-white w-64 min-h-screen flex flex-col ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="p-4 border-b border-blue-700">
                    <h2 className="text-2xl font-semibold">Admin Panel</h2>
                </div>

                <nav className="mt-5">
                    <ul>
                        <li className="mb-2">
                            <Link
                                to={admin?.role === 'super_admin' ? '/admin/super-dashboard' : '/admin/dashboard'}
                                className={`flex items-center py-3 px-4 ${
                                    location.pathname === '/admin/dashboard' || location.pathname === '/admin/super-dashboard'
                                        ? 'bg-blue-900 text-white'
                                        : 'text-blue-100 hover:bg-blue-700'
                                }`}
                            >
                                <span className="ml-3">Dashboard</span>
                            </Link>
                        </li>
                        {/* Các menu items khác dựa vào role */}
                        {admin?.role === 'super_admin' && (
                            <>
                                <li className="mb-2">
                                    <Link
                                        to="/admin/manage-admins"
                                        className={`flex items-center py-3 px-4 ${
                                            location.pathname === '/admin/manage-admins'
                                                ? 'bg-blue-900 text-white'
                                                : 'text-blue-100 hover:bg-blue-700'
                                        }`}
                                    >
                                        <span className="ml-3">Quản lý Admin</span>
                                    </Link>
                                </li>
                            </>
                        )}
                        {/* Menu items cho cả admin và super_admin */}
                        <li className="mb-2">
                            <Link
                                to="/admin/manage-users"
                                className={`flex items-center py-3 px-4 ${
                                    location.pathname === '/admin/manage-users'
                                        ? 'bg-blue-900 text-white'
                                        : 'text-blue-100 hover:bg-blue-700'
                                }`}
                            >
                                <span className="ml-3">Quản lý Người dùng</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-600 lg:hidden"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

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
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 