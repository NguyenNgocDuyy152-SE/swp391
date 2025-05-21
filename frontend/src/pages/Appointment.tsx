import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceFromUrl = queryParams.get('service') || '';

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    serviceType: serviceFromUrl,
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const serviceOptions = [
    'Tư Vấn Vô Sinh - Hiếm Muộn',
    'Khám và Chẩn Đoán Hiếm Muộn',
    'Điều Trị Nội Tiết Sinh Sản',
    'Thụ Tinh Trong Ống Nghiệm (IVF)',
    'Bơm Tinh Trùng Vào Buồng Tử Cung (IUI)',
    'Hỗ Trợ Tâm Lý Điều Trị Hiếm Muộn',
    'Xét Nghiệm Bệnh Lây Truyền Qua Đường Tình Dục',
    'Khác'
  ];

  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Vui lòng chọn dịch vụ';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Vui lòng chọn ngày';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Vui lòng chọn khung giờ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Gọi API đặt lịch tư vấn
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/appointment/schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('Appointment scheduled:', data);
          setSubmitSuccess(true);
          
          // Reset form after successful submission
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          console.error('Error scheduling appointment:', data.message);
          alert(`Đã xảy ra lỗi khi đặt lịch: ${data.message}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Calculate max date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {submitSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-medium text-green-800 mb-2">Đặt lịch thành công!</h2>
            <p className="text-green-700 mb-6">
              Cảm ơn bạn đã đặt lịch tư vấn. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
            </p>
            <p className="text-sm text-green-600">
              Bạn sẽ được chuyển hướng về trang chủ trong vài giây...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold text-blue-900">Đặt Lịch Tư Vấn</h1>
              <div className="w-24 h-1 bg-blue-800 mx-auto my-4"></div>
              <p className="mt-4 text-gray-600">
                Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch tư vấn với đội ngũ chuyên gia của chúng tôi.
              </p>
            </div>
            
            <div className="bg-white shadow-md rounded-lg border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
                      Dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.serviceType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {serviceOptions.map(service => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                      Ngày tư vấn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      min={minDate}
                      max={maxDateStr}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.preferredDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                      Khung giờ <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border ${errors.preferredTime ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">-- Chọn khung giờ --</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.preferredTime && <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>}
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Ghi chú thêm
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring-blue-500 border border-gray-300"
                      placeholder="Vui lòng nhập những thông tin bổ sung (nếu có)"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Xác nhận đặt lịch'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointment; 