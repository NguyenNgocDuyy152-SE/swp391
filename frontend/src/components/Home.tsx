import React, { useState, useEffect } from 'react';
import Blog from './Blog';

export const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        '/h1.jpg',
        '/h2.png',
        '/h3.jpg',
        '/h4.jpg'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Slideshow */}
            <div className="relative h-[550px] overflow-hidden">
                {/* Slideshow */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className="w-full h-full relative">
                            <img
                                src={slide}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
                        </div>
                    </div>
                ))}

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-3xl text-white">
                        <h1 className="text-4xl font-bold mb-4">
                            Trung Tâm Y Tế Tinh Trùng Chill
                        </h1>
                        <p className="text-lg mb-8">
                            Với đội ngũ bác sĩ chuyên khoa đầu ngành và công nghệ hiện đại hàng đầu, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực điều trị vô sinh hiếm muộn tại Việt Nam. Trung tâm đã giúp hơn 5.000 cặp vợ chồng hiện thực hóa ước mơ làm cha mẹ, với tỷ lệ thành công cao nhất khu vực.
                        </p>
                    </div>
                </div>

                {/* Slideshow indicators */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 w-10 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Khám Bệnh</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-blue-600 hover:underline">Quy trình khám bệnh</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Khám bảo hiểm</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Khám dịch vụ</a></li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Nằm viện</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-blue-600 hover:underline">Cẩm nang cho thân nhân</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Kỹ thuật cao</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Các loại phòng dịch vụ</a></li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Tin tức - Thông báo</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-blue-600 hover:underline">Tin tức & Hoạt động</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Thông báo</a></li>
                            <li><a href="#" className="text-blue-600 hover:underline">Kiến thức y khoa</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chăm sóc sức khỏe giới tính Section */}
            <div className="bg-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Chăm Sóc Sức Khỏe Giới Tính</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Giải Pháp Toàn Diện Cho Sức Khỏe Sinh Sản</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Trung tâm chúng tôi cung cấp các dịch vụ chăm sóc sức khỏe sinh sản và giới tính toàn diện,
                                kết hợp y học hiện đại và sự tư vấn tâm lý chuyên sâu. Đội ngũ bác sĩ giàu kinh nghiệm của
                                chúng tôi cam kết hỗ trợ bạn trong mọi vấn đề liên quan đến sức khỏe sinh sản.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Tư vấn vô sinh và hiếm muộn</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Điều trị rối loạn nội tiết</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Hỗ trợ sinh sản (IVF, IUI)</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-6 w-6 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>Tư vấn sức khỏe tình dục</span>
                                </li>
                            </ul>
                            <button className="mt-8 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors duration-300">
                                Đặt lịch tư vấn
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img
                                    src="https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg"
                                    alt="Tư vấn sức khỏe"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img
                                    src="https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg"
                                    alt="Khám sức khỏe"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img
                                    src="https://img.freepik.com/free-photo/medium-shot-doctor-talking-patient_23-2148814212.jpg"
                                    alt="Tư vấn y tế"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg shadow-md">
                                <img
                                    src="https://img.freepik.com/free-photo/doctor-nurses-special-equipment_23-2148980721.jpg"
                                    alt="Điều trị hiện đại"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Section */}
            <Blog />

            {/* Contact Info */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
                            <ul className="space-y-2">
                                <li>Địa chỉ cơ sở 1: 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000</li>
                                <li>Địa chỉ cơ sở 2: Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                            <ul className="space-y-2">
                                <li>CSKH: (028) 38.666.888 - 1900 09.68.68</li>
                                <li>Khám VIP: (028) 38.666.999 - 0915.139.971</li>
                                <li>Email: tinhtrungchill@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Login Link */}
            <div className="text-center mt-6">
                <a href="/admin/login" className="text-xs text-gray-500 hover:text-gray-700">Đăng nhập quản trị</a>
            </div>
        </div>
    );
};

