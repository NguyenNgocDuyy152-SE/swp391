import React, { useState } from 'react';

// Interface cho dữ liệu bài viết
interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    authorImage: string;
    date: string;
    image: string;
}

const Blog: React.FC = () => {
    // State cho danh mục được chọn
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Danh sách các danh mục blog
    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'hoat-dong', name: 'Hoạt động' },
        { id: 'ky-thuat-moi', name: 'Kỹ thuật mới' },
        { id: 'suc-khoe', name: 'Sức khỏe' },
        { id: 'thong-bao', name: 'Thông báo' },
    ];

    // Dữ liệu mẫu cho các bài viết
    const blogPosts: BlogPost[] = [
        {
            id: 1,
            title: "Bệnh viện triển khai kỹ thuật mới trong điều trị tim mạch",
            excerpt: "Bệnh viện Nhân dân 115 vừa triển khai thành công kỹ thuật can thiệp tim mạch mới, mở ra cơ hội điều trị tốt hơn cho bệnh nhân tim mạch tại khu vực phía Nam.",
            category: "ky-thuat-moi",
            author: "BS. Nguyễn Văn A",
            authorImage: "https://via.placeholder.com/32",
            date: "15/03/2024",
            image: "https://via.placeholder.com/400x300?text=Kỹ+thuật+mới"
        },
        {
            id: 2,
            title: "Phòng ngừa đột quỵ: Những dấu hiệu cần lưu ý",
            excerpt: "Nhận biết sớm các dấu hiệu cảnh báo đột quỵ có thể cứu sống bạn hoặc người thân. Tìm hiểu các triệu chứng và cách ứng phó khi gặp tình huống khẩn cấp.",
            category: "suc-khoe",
            author: "ThS.BS. Trần Thị B",
            authorImage: "https://via.placeholder.com/32",
            date: "10/03/2024",
            image: "https://via.placeholder.com/400x300?text=Sức+khỏe"
        }
    ];

    // Bài viết nổi bật
    const featuredPost: BlogPost = {
        id: 0,
        title: "Phòng ngừa và Điều trị Bệnh Hô Hấp trong Mùa Lạnh",
        excerpt: "Tìm hiểu các biện pháp hiệu quả để bảo vệ sức khỏe hô hấp của bạn và gia đình trong thời tiết chuyển mùa, cùng các phương pháp điều trị hiện đại.",
        category: "suc-khoe",
        author: "PGS.TS. Lê Minh C",
        authorImage: "https://via.placeholder.com/40",
        date: "20/03/2024",
        image: "https://via.placeholder.com/400x300"
    };

    // Lọc bài viết theo danh mục
    const filteredPosts = selectedCategory === 'all'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    // Xử lý thay đổi danh mục
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div className="bg-white py-16">
            <div className="container mx-auto px-4">
                {/* Tiêu đề Blog */}
                <h1 className="text-4xl font-bold text-center mb-2">Tin tức & Sự kiện Y tế</h1>
                <p className="text-lg text-gray-600 text-center mb-12">
                    Cập nhật những thông tin mới nhất về y tế, hoạt động bệnh viện và kiến thức sức khỏe.
                </p>

                {/* Bài viết nổi bật */}
                <div className="mb-16 p-6 bg-gray-100 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 relative h-64 rounded-lg overflow-hidden">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center">
                            <h4 className="text-blue-600 text-sm font-semibold mb-2">BÀI VIẾT GẦN ĐÂY</h4>
                            <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                            <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                            <a href="#" className="text-blue-600 hover:underline font-semibold">Đọc bài viết</a>
                        </div>
                    </div>
                </div>

                {/* Lọc theo danh mục */}
                <div className="flex justify-end items-center mb-8">
                    <label htmlFor="category-filter" className="mr-2 text-gray-700 font-semibold">
                        Lọc theo Danh mục:
                    </label>
                    <select
                        id="category-filter"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Lưới bài viết */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-blue-600 text-sm font-medium mb-2 block">{post.category}</span>
                                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <img
                                            src={post.authorImage}
                                            alt={post.author}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span>{post.author} | {post.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        Không có bài viết nào trong danh mục này.
                    </div>
                )}

                {/* Nút xem thêm */}
                {filteredPosts.length > 0 && (
                    <div className="text-center mt-12">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Xem thêm bài viết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog; 