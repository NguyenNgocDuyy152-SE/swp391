import React, { useState, useEffect } from 'react';
import Blog from './Blog';

export const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        description: '',
        image: ''
    });

    const slides = [
        {
            image: '/h1.jpg',
            title: 'Chăm sóc sức khỏe toàn diện',
            description: 'Đội ngũ bác sĩ chuyên môn cao, trang thiết bị hiện đại',
        },
        {
            image: '/h2.png',
            title: 'Khám chữa bệnh 24/7',
            description: 'Sẵn sàng phục vụ bệnh nhân mọi lúc, mọi nơi',
        },
        {
            image: '/h3.jpg',
            title: 'Công nghệ tiên tiến',
            description: 'Áp dụng những tiến bộ mới nhất trong y học',
        },
        {
            image: '/h4.jpg',
            title: 'Hỗ trợ tận tâm',
            description: 'Luôn đồng hành cùng bệnh nhân trong mọi hành trình',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const openModal = (title: string, description: string, image: string = '') => {
        setModalContent({ title, description, image });
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    // Nội dung cho các quick links
    const quickLinks = [
        [
            {
                title: 'Quy trình khám bệnh',
                description: 'Hướng dẫn chi tiết các bước khám bệnh tại trung tâm, từ đăng ký, khám lâm sàng, xét nghiệm đến nhận kết quả.',
            },
            {
                title: 'Khám bảo hiểm',
                description: 'Thông tin về các loại bảo hiểm y tế được chấp nhận, quy trình và quyền lợi khi khám bảo hiểm.',
            },
            {
                title: 'Khám dịch vụ',
                description: 'Dịch vụ khám nhanh, chất lượng cao, không phải chờ đợi lâu, với đội ngũ bác sĩ chuyên môn sâu.',
            },
        ],
        [
            {
                title: 'Cẩm nang cho thân nhân',
                description: 'Những điều cần biết khi chăm sóc người thân nằm viện, quy định thăm nuôi, hỗ trợ tâm lý.',
            },
            {
                title: 'Kỹ thuật cao',
                description: 'Các kỹ thuật y tế hiện đại được áp dụng trong điều trị và chăm sóc bệnh nhân.',
            },
            {
                title: 'Các loại phòng dịch vụ',
                description: 'Thông tin về các loại phòng bệnh, tiện nghi và chi phí đi kèm.',
            },
        ],
        [
            {
                title: 'Tin tức & Hoạt động',
                description: 'Cập nhật các tin tức mới nhất và hoạt động nổi bật của trung tâm.',
            },
            {
                title: 'Thông báo',
                description: 'Các thông báo quan trọng về lịch làm việc, thay đổi quy định, chương trình ưu đãi.',
            },
            {
                title: 'Kiến thức y khoa',
                description: 'Chia sẻ kiến thức, kinh nghiệm về chăm sóc sức khỏe và phòng bệnh.',
            },
        ],
    ];

    // Nội dung cho các dịch vụ chăm sóc sức khỏe giới tính
    const sexHealthList = [
        {
            title: 'Tư vấn vô sinh và hiếm muộn',
            description: 'Tư vấn chuyên sâu về các nguyên nhân và giải pháp điều trị vô sinh, hiếm muộn cho cả nam và nữ.',
        },
        {
            title: 'Điều trị rối loạn nội tiết',
            description: 'Chẩn đoán và điều trị các rối loạn nội tiết ảnh hưởng đến sức khỏe sinh sản và giới tính.',
        },
        {
            title: 'Hỗ trợ sinh sản (IVF, IUI)',
            description: 'Cung cấp các phương pháp hỗ trợ sinh sản hiện đại như thụ tinh trong ống nghiệm (IVF), bơm tinh trùng vào buồng tử cung (IUI).',
        },
        {
            title: 'Tư vấn sức khỏe tình dục',
            description: 'Tư vấn các vấn đề về sức khỏe tình dục, phòng tránh bệnh lây truyền qua đường tình dục, nâng cao chất lượng cuộc sống.',
        },
    ];

    // Nội dung cho các hình ảnh chăm sóc sức khỏe giới tính
    const sexHealthImages = [
        {
            image: 'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
            title: 'Tư vấn sức khỏe',
            description: 'Đội ngũ bác sĩ tư vấn tận tâm, hỗ trợ giải đáp mọi thắc mắc về sức khỏe sinh sản và giới tính.',
        },
        {
            image: 'https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg',
            title: 'Khám sức khỏe',
            description: 'Khám sức khỏe tổng quát, phát hiện sớm các vấn đề tiềm ẩn và tư vấn điều trị kịp thời.',
        },
        {
            image: 'https://img.freepik.com/free-photo/medium-shot-doctor-talking-patient_23-2148814212.jpg',
            title: 'Tư vấn y tế',
            description: 'Tư vấn các vấn đề y tế chuyên sâu, hỗ trợ tâm lý cho bệnh nhân và gia đình.',
        },
        {
            image: 'https://img.freepik.com/free-photo/doctor-nurses-special-equipment_23-2148980721.jpg',
            title: 'Điều trị hiện đại',
            description: 'Áp dụng các phương pháp điều trị hiện đại, hiệu quả cao, an toàn cho bệnh nhân.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Slideshow */}
            <div className="relative h-[550px] overflow-hidden">
                {/* Slideshow */}
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => openModal(slide.title, slide.description, slide.image)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="w-full h-full relative">
                            <img
                                src={slide.image}
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
                            className={`h-2 w-10 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {quickLinks.map((col, colIdx) => (
                        <div key={colIdx} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">{colIdx === 0 ? 'Khám Bệnh' : colIdx === 1 ? 'Nằm viện' : 'Tin tức - Thông báo'}</h3>
                            <ul className="space-y-2">
                                {col.map((item, idx) => (
                                    <li key={idx}>
                                        <button
                                            className="text-blue-600 hover:underline focus:outline-none bg-transparent"
                                            onClick={() => openModal(item.title, item.description)}
                                        >
                                            {item.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
                                {sexHealthList.map((item, idx) => (
                                    <li className="flex items-start" key={idx}>
                                        <button
                                            className="flex items-center text-left focus:outline-none bg-transparent"
                                            onClick={() => openModal(item.title, item.description)}
                                        >
                                            <svg className="h-6 w-6 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                            <span>{item.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="mt-8 bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                                onClick={() => openModal('Đặt lịch tư vấn', 'Vui lòng liên hệ số điện thoại hoặc email của trung tâm để đặt lịch tư vấn với chuyên gia.')}
                            >
                                Đặt lịch tư vấn
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {sexHealthImages.map((img, idx) => (
                                <div className="overflow-hidden rounded-lg shadow-md cursor-pointer" key={idx} onClick={() => openModal(img.title, img.description, img.image)}>
                                    <img
                                        src={img.image}
                                        alt={img.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
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

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-blue-800">{modalContent.title}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        {modalContent.image && (
                            <img
                                src={modalContent.image}
                                alt={modalContent.title}
                                className="w-full h-auto rounded-lg mb-4"
                            />
                        )}
                        <p className="text-gray-700 leading-relaxed">{modalContent.description}</p>
                        <button
                            onClick={closeModal}
                            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

