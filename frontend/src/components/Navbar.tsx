import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <img src="/logo-chill.svg" alt="Logo" className="h-8 w-8 mr-2" />
                            <span className="text-xl font-bold text-gray-800">Tinh Trùng Chill</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Trang chủ
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Giới thiệu
                        </Link>
                        <Link to="/services" className="text-gray-600 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Dịch vụ
                        </Link>
                        <Link to="/blog" className="text-gray-600 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Tin tức
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Liên hệ
                        </Link>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Quản trị
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 