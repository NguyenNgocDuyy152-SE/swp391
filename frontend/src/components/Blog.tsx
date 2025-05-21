import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';

// Blog data with real images and content
export const allBlogPosts = [];

const Blog: React.FC = () => {
    // State để xử lý lỗi hình ảnh
    const [imgError, setImgError] = useState(false);
    // State để quản lý số lượng bài viết hiển thị
    const [visiblePosts, setVisiblePosts] = useState(6);
    // State để kiểm tra xem đã hiển thị hết bài viết chưa
    const [showLoadMore, setShowLoadMore] = useState(true);
    const navigate = useNavigate();
    const { posts } = useBlog();

    // Chuyển đổi chuỗi ngày sang đối tượng Date
    const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // Sắp xếp bài viết theo thời gian giảm dần (bài mới nhất lên đầu)
    const sortedBlogPosts = [...posts].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    // Lấy số lượng bài viết theo state hiện tại
    const blogPosts = sortedBlogPosts.slice(0, visiblePosts);

    // Featured blog post (most recent)
    const featuredPost = sortedBlogPosts[0] || {
        title: "Chưa có bài viết nào",
        excerpt: "Hiện tại chưa có bài viết nào trong hệ thống.",
        image: "/images/medical-fallback.jpg"
    };

    // Fallback image nếu có lỗi
    const fallbackImage = "/images/medical-fallback.jpg";

    // Hàm xử lý khi nhấn nút "Xem thêm bài viết"
    const handleLoadMore = () => {
        const newVisiblePosts = visiblePosts + 6;
        setVisiblePosts(newVisiblePosts);

        // Nếu đã hiển thị tất cả bài viết, ẩn nút "Xem thêm"
        if (newVisiblePosts >= posts.length) {
            setShowLoadMore(false);
        }
    };

    // Hàm để chuyển đến trang chi tiết bài viết
    const goToPost = (id: number) => {
        navigate(`/blog/${id}`);
    };

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
                        <div className="md:col-span-1 relative h-64 rounded-lg overflow-hidden cursor-pointer" onClick={() => goToPost(1)}>
                            <img
                                src={imgError ? fallbackImage : featuredPost.image}
                                alt="Bài viết gần đây"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                onError={() => setImgError(true)}
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center">
                            <h4 className="text-blue-600 text-sm font-semibold mb-2">BÀI VIẾT GẦN ĐÂY</h4>
                            <h3 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => goToPost(1)}>
                                {featuredPost.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {featuredPost.excerpt}
                            </p>
                            <button onClick={() => goToPost(1)} className="text-blue-600 hover:underline font-semibold w-fit">Đọc bài viết</button>
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
                    {blogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => goToPost(post.id)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Tránh lặp vô hạn
                                        target.src = fallbackImage;
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-blue-600 text-sm font-medium mb-2 block">{post.category}</span>
                                <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                                        alt={post.author}
                                        className="w-6 h-6 rounded-full mr-2"
                                    />
                                    <span>{post.author} | {post.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {showLoadMore && (
                    <div className="text-center mt-12">
                        <button
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={handleLoadMore}
                        >
                            Xem thêm bài viết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog; 