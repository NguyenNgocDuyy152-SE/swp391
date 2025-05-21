const API_BASE_URL = 'http://localhost:5001/api';

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
    // Try to get the appropriate token - either user token or admin token
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
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
    console.log(`API Request: ${method} ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Log chi tiết về response lỗi
      console.error(`API Error: ${response.status} ${response.statusText}`);
      
      try {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        
        // Tạo một error object có thêm thông tin về response
        const enhancedError: any = new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
        enhancedError.status = response.status;
        enhancedError.response = { data: errorData, status: response.status };
        throw enhancedError;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        const enhancedError: any = new Error(`Request failed with status ${response.status}`);
        enhancedError.status = response.status;
        throw enhancedError;
      }
    }

    // Kiểm tra nếu response trống
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      console.log('API Response:', responseData);
      return responseData;
    }
    
    console.log('API Response: Empty or non-JSON response');
    return {} as T;
  } catch (error) {
    console.error('API Request Error:', error);
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