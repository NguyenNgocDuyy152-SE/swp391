const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Thực hiện yêu cầu HTTP với đầy đủ xử lý lỗi và token xác thực
 */
export const apiRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data: any = null,
  requiresAuth: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Thêm token xác thực vào header nếu cần
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    // Kiểm tra nếu response trống
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

/**
 * Phương thức tiện ích để các yêu cầu GET
 */
export const get = <T>(endpoint: string, requiresAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(endpoint, 'GET', null, requiresAuth);
};

/**
 * Phương thức tiện ích cho các yêu cầu POST
 */
export const post = <T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(endpoint, 'POST', data, requiresAuth);
};

/**
 * Phương thức tiện ích cho các yêu cầu PUT
 */
export const put = <T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(endpoint, 'PUT', data, requiresAuth);
};

/**
 * Phương thức tiện ích cho các yêu cầu DELETE
 */
export const del = <T>(endpoint: string, requiresAuth: boolean = true): Promise<T> => {
  return apiRequest<T>(endpoint, 'DELETE', null, requiresAuth);
}; 