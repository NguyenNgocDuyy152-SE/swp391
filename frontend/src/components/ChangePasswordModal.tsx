import React, { useState } from 'react';
import { authService, PasswordChangeData } from '../services/authService';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstLogin?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose,
  isFirstLogin = false
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoading(true);
    
    try {
      const passwordData: PasswordChangeData = {
        current_password: currentPassword,
        new_password: newPassword
      };
      
      await authService.changePassword(passwordData);
      setSuccess(true);
      
      // Nếu không phải là đăng nhập lần đầu, đóng modal sau 1.5 giây
      if (!isFirstLogin) {
        setTimeout(() => {
          onClose();
          setSuccess(false);
          // Clear form
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1500);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Mật khẩu hiện tại không đúng');
      } else {
        setError('Có lỗi xảy ra khi thay đổi mật khẩu');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isFirstLogin ? 'Thay đổi mật khẩu mặc định' : 'Thay đổi mật khẩu'}
          </h2>
          {!isFirstLogin && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isFirstLogin && (
          <div className="bg-blue-100 p-3 rounded mb-4 text-blue-800">
            <p>Đây là lần đăng nhập đầu tiên của bạn hoặc tài khoản của bạn mới được tạo. Vui lòng thay đổi mật khẩu mặc định để đảm bảo an toàn.</p>
          </div>
        )}

        {success ? (
          <div className="bg-green-100 p-3 rounded text-green-800 mb-4">
            <p>Thay đổi mật khẩu thành công!</p>
            {isFirstLogin && (
              <button 
                onClick={onClose}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Tiếp tục
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 p-3 rounded text-red-800 mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal; 