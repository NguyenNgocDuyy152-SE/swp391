import { post } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Service quản lý xác thực người dùng
 */
export const authService = {
  /**
   * Đăng nhập người dùng
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return post<AuthResponse>('/auth/login', credentials, false);
  },

  /**
   * Đăng ký người dùng mới
   */
  register: (userData: RegisterData): Promise<AuthResponse> => {
    // Loại bỏ confirmPassword trước khi gửi dữ liệu
    const { confirmPassword, ...userDataToSend } = userData;
    return post<AuthResponse>('/auth/register', userDataToSend, false);
  },

  /**
   * Đăng xuất người dùng
   */
  logout: (): void => {
    localStorage.removeItem('token');
  },

  /**
   * Kiểm tra trạng thái đăng nhập của người dùng
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },

  /**
   * Lấy token xác thực
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
}; 