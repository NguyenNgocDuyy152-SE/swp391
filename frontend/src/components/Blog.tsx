import React from 'react';

const Blog: React.FC = () => {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-2">Tin tức & Sự kiện Y tế</h1>
                <p className="text-lg text-gray-600 text-center mb-12">
                    Cập nhật những thông tin mới nhất về y tế, hoạt động bệnh viện và kiến thức sức khỏe.
                </p>

                {/* Recent Blog Section */}
                <div className="mb-16 p-6 bg-gray-100 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 relative h-64 rounded-lg overflow-hidden">
                            <img
                                src="https://via.placeholder.com/400x300"
                                alt="Bài viết gần đây"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center">
                            <h4 className="text-blue-600 text-sm font-semibold mb-2">BÀI VIẾT GẦN ĐÂY</h4>
                            <h3 className="text-2xl font-bold mb-4">
                                Phòng ngừa và Điều trị Bệnh Hô Hấp trong Mùa Lạnh
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Tìm hiểu các biện pháp hiệu quả để bảo vệ sức khỏe hô hấp của bạn và gia đình
                                trong thời tiết chuyển mùa, cùng các phương pháp điều trị hiện đại.
                            </p>
                            <a href="#" className="text-blue-600 hover:underline font-semibold">Đọc bài viết</a>
                        </div>
                    </div>
                </div>

                {/* Filter by Category */}
                <div className="flex justify-end items-center mb-8">
                    <label htmlFor="category-filter" className="mr-2 text-gray-700 font-semibold">Lọc theo Danh mục:</label>
                    <select
                        id="category-filter"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="hoat-dong">Hoạt động</option>
                        <option value="ky-thuat-moi">Kỹ thuật mới</option>
                        <option value="suc-khoe">Sức khỏe</option>
                        <option value="thong-bao">Thông báo</option>
                    </select>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                                <img
                                    src={`https://via.placeholder.com/400x300?text=Tin+tức+${item}`}
                                    alt={`Bài viết ${item}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-blue-600 text-sm font-medium mb-2 block">Kỹ thuật mới</span> {/* Category */}
                                <h3 className="text-xl font-bold mb-2">
                                    Bệnh viện triển khai phòng khám chuyên khoa mới {item}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Bệnh viện Nhân dân 115 vừa đưa vào hoạt động phòng khám chuyên khoa mới với trang thiết bị hiện đại...
                                </p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <img
                                        src="https://via.placeholder.com/32"
                                        alt="Tác giả"
                                        className="w-6 h-6 rounded-full mr-2"
                                    />
                                    <span>BS. Trần Văn B | 10/03/2024</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button - Add back if needed */}
                <div className="text-center mt-12">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Xem thêm bài viết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Blog; 