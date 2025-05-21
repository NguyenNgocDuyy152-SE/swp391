import React, { useState } from 'react';

const Contact: React.FC = () => {
    // State cho form liên hệ
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // State hiển thị thông báo
    const [formStatus, setFormStatus] = useState<{
        submitted: boolean;
        success: boolean;
        message: string;
    }>({
        submitted: false,
        success: false,
        message: ''
    });

    // Xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set loading state
        setFormStatus({
            submitted: true,
            success: false,
            message: 'Đang gửi tin nhắn của bạn...'
        });

        try {
            // Call the API to submit the contact form
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Success message
                setFormStatus({
                    submitted: true,
                    success: true,
                    message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!'
                });

                // Reset form after successful submission
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                // Error message
                setFormStatus({
                    submitted: true,
                    success: false,
                    message: `Lỗi: ${data.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.'}`
                });
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setFormStatus({
                submitted: true,
                success: false,
                message: 'Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau.'
            });
        }
    };

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Liên Hệ Với Chúng Tôi</h1>
                    <div className="w-24 h-1 bg-blue-900 mx-auto mb-6"></div>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                        Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy liên hệ với chúng tôi bằng một trong những cách dưới đây.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    {/* Map section */}
                    <div className="lg:col-span-2 rounded-xl overflow-hidden h-[500px] shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580121497!2d106.66372616108576!3d10.774243992323564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0xef77cd47a1cc691e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1686537388062!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Bản đồ vị trí trung tâm y tế"
                        ></iframe>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-blue-50 rounded-xl shadow-lg p-8 h-full">
                        <h3 className="text-2xl font-bold text-blue-900 mb-6">Thông Tin Liên Hệ</h3>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-1">Địa chỉ</h4>
                                    <p className="text-gray-700">Khu Kĩ thuật cao - Khám VIP: 818 Sư Vạn Hạnh, P.12, Q.10, TP.HCM</p>
                                    <p className="text-gray-700 mt-2">Cổng cấp cứu và Khám yêu cầu: 527 Sư Vạn Hạnh, P.12, Q.10, TP.HCM</p>
                                    <p className="text-gray-700 mt-2">Khoa khám: 88 Thành Thái, P.12, Q.10, TP.HCM</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-1">Số điện thoại</h4>
                                    <p className="text-gray-700">CSKH: (028) 38.666.888 - 1900 09.68.68</p>
                                    <p className="text-gray-700 mt-2">Khám VIP: (028) 38.666.999 - 0915.139.971</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-1">Email</h4>
                                    <p className="text-gray-700">tinhtrungchill@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-1">Giờ làm việc</h4>
                                    <p className="text-gray-700">Thứ 2 - Thứ 6: 7:30 - 16:30</p>
                                    <p className="text-gray-700 mt-2">Thứ 7 - Chủ nhật: 7:30 - 11:30</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Liên hệ */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
                    <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">Gửi Tin Nhắn Cho Chúng Tôi</h3>

                    {formStatus.submitted ? (
                        <div className={`p-4 mb-6 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {formStatus.message}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0901234567"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề *</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Chọn chủ đề</option>
                                    <option value="Tư vấn khám bệnh">Tư vấn khám bệnh</option>
                                    <option value="Tư vấn điều trị">Tư vấn điều trị</option>
                                    <option value="Thắc mắc về IVF">Thắc mắc về IVF</option>
                                    <option value="Phản hồi dịch vụ">Phản hồi dịch vụ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn *</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Hãy nhập tin nhắn của bạn..."
                            ></textarea>
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                Gửi tin nhắn
                            </button>
                        </div>
                    </form>
                </div>

                {/* FAQ Section */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">Câu Hỏi Thường Gặp</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-blue-800 mb-3">Quy trình khám bệnh tại Trung tâm như thế nào?</h4>
                            <p className="text-gray-700">Quy trình khám bệnh tại Trung tâm bao gồm: Đăng ký thông tin, thanh toán phí khám, khám với bác sĩ chuyên khoa, thực hiện các xét nghiệm cần thiết, nhận kết quả và tư vấn phương pháp điều trị.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-blue-800 mb-3">Chi phí khám và điều trị IVF là bao nhiêu?</h4>
                            <p className="text-gray-700">Chi phí điều trị IVF phụ thuộc vào tình trạng sức khỏe và phương pháp điều trị của từng cặp vợ chồng. Để biết chi tiết, quý khách vui lòng liên hệ trực tiếp với Trung tâm để được tư vấn cụ thể.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-blue-800 mb-3">Tôi có thể đặt lịch hẹn online không?</h4>
                            <p className="text-gray-700">Có, bạn có thể đặt lịch hẹn trực tuyến thông qua trang web của chúng tôi hoặc qua số điện thoại hotline: 1900 09.68.68. Chúng tôi sẽ liên hệ lại để xác nhận lịch hẹn trong vòng 24 giờ.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-blue-800 mb-3">Trung tâm có bác sĩ chuyên khoa nào?</h4>
                            <p className="text-gray-700">Trung tâm có đội ngũ bác sĩ chuyên khoa sản phụ khoa, nam học, nội tiết sinh sản và hỗ trợ sinh sản với trên 15 năm kinh nghiệm, được đào tạo trong và ngoài nước.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact; 