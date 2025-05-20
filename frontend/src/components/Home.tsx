import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-blue-900 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4">
                            Bệnh viện Nhân dân 115 - Bệnh viện Đa khoa Hạng I
                        </h1>
                        <p className="text-lg mb-8">
                            Bệnh Viện Nhân Dân 115 là Bệnh viện Đa khoa hạng 1, tuyến cuối của thành phố và trực thuộc Sở Y Tế.
                            Với hơn 30 năm hoạt động, Bệnh viện đã phát triển được 5 chuyên khoa mũi nhọn, 7 khối lâm sàng,
                            42 khoa phòng, đạt 3 kỷ lục Châu Á, 7 kỷ lục Việt Nam.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                                Đặt lịch khám
                            </button>
                            <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
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

            {/* Contact Info */}
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Địa chỉ</h3>
                            <ul className="space-y-2">
                                <li>Khu Kĩ thuật cao - Khám VIP: 818 Sư Vạn Hạnh, P.12, Q.10</li>
                                <li>Cổng cấp cứu và Khám yêu cầu: 527 Sư Vạn Hạnh, P.12, Q.10</li>
                                <li>Khoa khám: 88 Thành Thái, P.12, Q.10</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                            <ul className="space-y-2">
                                <li>CSKH: (028) 38.683.496 - 1900 09.99.83</li>
                                <li>Khám VIP: (028) 38.684.539 - 0902.768.115</li>
                                <li>Email: bvnd115tphcm@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 