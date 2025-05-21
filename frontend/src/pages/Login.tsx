import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        try {
            if (isLogin) {
                // Login
                const response = await authService.login({
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('token', response.token);
                
                // Check if password change is required
                if (response.user.password_change_required) {
                    setShowChangePasswordModal(true);
                } else {
                    navigate('/dashboard');
                }
            } else {
                // Register
                const response = await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                
                localStorage.setItem('token', response.token);
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Hiển thị thông báo lỗi chi tiết hơn để debug
            let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Hiển thị thêm thông tin về lỗi trong console để debug
            console.error('Error details:', {
                message: errorMessage,
                status: error.status || error.response?.status,
                data: error.response?.data
            });
            
            alert(`Lỗi: ${errorMessage}`);
        }
    };

    const handlePasswordChangeComplete = () => {
        setShowChangePasswordModal(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="sr-only">Họ tên</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Họ tên"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Xác nhận mật khẩu</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Xác nhận mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-500"
                    >
                        {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
                    </button>
                </div>
            </div>
            
            {/* Change Password Modal */}
            <ChangePasswordModal 
                isOpen={showChangePasswordModal}
                onClose={handlePasswordChangeComplete}
                isFirstLogin={true}
            />
        </div>
    );
};

export default Login; 