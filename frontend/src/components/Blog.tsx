import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Blog: React.FC = () => {
    // State để xử lý lỗi hình ảnh
    const [imgError, setImgError] = useState(false);
    // State để quản lý số lượng bài viết hiển thị
    const [visiblePosts, setVisiblePosts] = useState(6);
    // State để kiểm tra xem đã hiển thị hết bài viết chưa
    const [showLoadMore, setShowLoadMore] = useState(true);
    const navigate = useNavigate();

    // Chuyển đổi chuỗi ngày sang đối tượng Date
    const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    // Blog data with real images and content - tăng số lượng bài viết
    const allBlogPosts = [
        {
            id: 1,
            title: "Tiến bộ mới trong kỹ thuật thụ tinh ống nghiệm",
            excerpt: "Nghiên cứu mới từ các chuyên gia hàng đầu về phương pháp cải tiến giúp tăng tỷ lệ thành công của IVF...",
            image: "/images/medical-fallback.jpg",
            category: "Kỹ thuật mới",
            author: "BS. Nguyễn Thị Minh",
            date: "15/05/2024"
        },
        {
            id: 2,
            title: "Những điều cần biết về sức khỏe sinh sản nam giới",
            excerpt: "Tìm hiểu các yếu tố ảnh hưởng đến chất lượng tinh trùng và biện pháp cải thiện khả năng sinh sản...",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
            category: "Sức khỏe",
            author: "BS. Trần Văn Nam",
            date: "08/05/2024"
        },
        {
            id: 3,
            title: "Hội thảo về sức khỏe sinh sản cho phụ nữ trẻ",
            excerpt: "Trung tâm Y tế tổ chức hội thảo cung cấp kiến thức về sức khỏe sinh sản dành cho phụ nữ độ tuổi 20-35...",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1780&auto=format&fit=crop",
            category: "Hoạt động",
            author: "ThS. Lê Thị Hồng",
            date: "29/04/2024"
        },
        {
            id: 4,
            title: "Ảnh hưởng của dinh dưỡng đến khả năng sinh sản",
            excerpt: "Chế độ ăn uống đóng vai trò quan trọng trong việc cải thiện khả năng sinh sản của cả nam và nữ...",
            image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
            category: "Sức khỏe",
            author: "CN. Dinh dưỡng Phạm Thu Hà",
            date: "20/04/2024"
        },
        {
            id: 5,
            title: "Khai trương phòng khám sức khỏe sinh sản số 2",
            excerpt: "Trung tâm Y tế Tinh Trùng Chill khai trương cơ sở mới tại quận 7, TP.HCM với nhiều trang thiết bị hiện đại...",
            image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop",
            category: "Thông báo",
            author: "Ban Truyền thông",
            date: "15/04/2024"
        },
        {
            id: 6,
            title: "Ứng dụng trí tuệ nhân tạo trong điều trị vô sinh",
            excerpt: "Công nghệ AI đang giúp các bác sĩ chẩn đoán và lựa chọn phương pháp điều trị hiệu quả hơn cho từng bệnh nhân...",
            image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=2070&auto=format&fit=crop",
            category: "Kỹ thuật mới",
            author: "TS. Hoàng Minh Tuấn",
            date: "10/04/2024"
        },
        {
            id: 7,
            title: "Vai trò của hormone trong điều trị vô sinh nữ",
            excerpt: "Tìm hiểu về các loại hormone quan trọng và tác động của chúng đến khả năng sinh sản của nữ giới...",
            image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2072&auto=format&fit=crop",
            category: "Sức khỏe",
            author: "BS. Nguyễn Thị Hương",
            date: "05/04/2024"
        },
        {
            id: 8,
            title: "Giải pháp điều trị bất thường tinh trùng",
            excerpt: "Các phương pháp hiện đại giúp cải thiện chất lượng tinh trùng và tăng khả năng thụ thai tự nhiên...",
            image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=2070&auto=format&fit=crop",
            category: "Kỹ thuật mới",
            author: "BS. Lê Văn Thành",
            date: "28/03/2024"
        },
        {
            id: 9,
            title: "Kỹ thuật nuôi cấy trứng mới nhất",
            excerpt: "Phương pháp nuôi cấy trứng cải tiến giúp nâng cao tỷ lệ thành công trong điều trị IVF...",
            image: "https://images.unsplash.com/photo-1579165466741-7f35e4755183?q=80&w=1887&auto=format&fit=crop",
            category: "Kỹ thuật mới",
            author: "PGS.TS Trần Văn Chính",
            date: "20/03/2024"
        },
        {
            id: 10,
            title: "Hiểu đúng về lão hóa trứng ở phụ nữ",
            excerpt: "Những thông tin quan trọng về quá trình lão hóa trứng và các biện pháp phòng ngừa...",
            image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=2070&auto=format&fit=crop",
            category: "Sức khỏe",
            author: "BS. Hoàng Thị Mai",
            date: "15/03/2024"
        },
        {
            id: 11,
            title: "Phác đồ điều trị vô sinh hiệu quả năm 2024",
            excerpt: "Cập nhật các phác đồ điều trị vô sinh mới nhất được áp dụng tại các trung tâm hỗ trợ sinh sản hàng đầu...",
            image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b7e85?q=80&w=1972&auto=format&fit=crop",
            category: "Kỹ thuật mới",
            author: "GS.TS Nguyễn Văn Bình",
            date: "10/03/2024"
        },
        {
            id: 12,
            title: "Ảnh hưởng của môi trường đến chất lượng tinh trùng",
            excerpt: "Môi trường sống, chế độ sinh hoạt và các yếu tố môi trường có thể tác động mạnh đến sức khỏe sinh sản nam giới...",
            image: "https://images.unsplash.com/photo-1523978591478-c753949ff840?q=80&w=2071&auto=format&fit=crop",
            category: "Sức khỏe",
            author: "BS. Đặng Minh Hùng",
            date: "05/03/2024"
        }
    ];

    // Sắp xếp bài viết theo thời gian giảm dần (bài mới nhất lên đầu)
    const sortedBlogPosts = [...allBlogPosts].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    // Lấy số lượng bài viết theo state hiện tại
    const blogPosts = sortedBlogPosts.slice(0, visiblePosts);

    // Featured blog post (most recent)
    const featuredPost = {
        title: "Phương pháp mới trong điều trị vô sinh hiếm muộn",
        excerpt: "Tiến bộ y học mới nhất trong lĩnh vực sinh sản hỗ trợ mang lại hy vọng cho những cặp vợ chồng khó có con. Các kỹ thuật điều trị tiên tiến đã giúp tăng tỷ lệ thành công lên đáng kể, đặc biệt ở những trường hợp khó.",
        image: "/images/medical-fallback.jpg"
    };

    // Fallback image nếu có lỗi
    const fallbackImage = "/images/medical-fallback.jpg";

    // Hàm xử lý khi nhấn nút "Xem thêm bài viết"
    const handleLoadMore = () => {
        const newVisiblePosts = visiblePosts + 6;
        setVisiblePosts(newVisiblePosts);

        // Nếu đã hiển thị tất cả bài viết, ẩn nút "Xem thêm"
        if (newVisiblePosts >= allBlogPosts.length) {
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