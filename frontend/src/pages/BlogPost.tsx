import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Define types for our blog posts
interface BlogPostSummary {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    author: string;
    date: string;
}

interface BlogPostDetail extends BlogPostSummary {
    content: string;
}

// All blog posts data - both for list and detail views
const allBlogPosts: BlogPostSummary[] = [
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

// Detailed content for select posts
const detailedContent: Record<number, string> = {
    1: `
        <p>Tiến bộ y học trong lĩnh vực điều trị vô sinh hiếm muộn đã có những bước tiến vượt bậc trong những năm gần đây. Đặc biệt, kỹ thuật thụ tinh ống nghiệm (IVF) đã được cải tiến đáng kể, mang lại hy vọng cho hàng ngàn cặp vợ chồng đang khao khát có con.</p>
        
        <h3>Công nghệ time-lapse trong nuôi cấy phôi</h3>
        <p>Một trong những tiến bộ đáng chú ý nhất là việc ứng dụng công nghệ time-lapse trong quá trình nuôi cấy phôi. Hệ thống này cho phép các nhà khoa học theo dõi liên tục sự phát triển của phôi mà không cần phải lấy phôi ra khỏi môi trường nuôi cấy. Điều này không chỉ giúp duy trì môi trường tối ưu cho sự phát triển của phôi mà còn cung cấp dữ liệu quý giá về quá trình phân chia tế bào.</p>
        
        <p>Theo nghiên cứu mới công bố trên Tạp chí Y học Sinh sản, việc sử dụng công nghệ time-lapse đã giúp tăng tỷ lệ thành công của IVF lên 15-20% so với phương pháp truyền thống.</p>
        
        <h3>Kỹ thuật ICSI cải tiến</h3>
        <p>Bên cạnh đó, kỹ thuật tiêm tinh trùng vào bào tương trứng (ICSI) cũng đã được cải tiến với việc sử dụng kính hiển vi công suất cao và hệ thống micromanipulation chính xác hơn. Điều này cho phép các bác sĩ chọn được những tinh trùng có chất lượng tốt nhất và thực hiện quá trình tiêm một cách chính xác, giảm thiểu tổn thương cho trứng.</p>
        
        <p>Tại Trung tâm Y tế Tinh Trùng Chill, chúng tôi đã triển khai những kỹ thuật tiên tiến nhất này, đem lại kết quả điều trị vượt trội cho các cặp vợ chồng.</p>
    `,
    2: `
        <p>Sức khỏe sinh sản nam giới là một chủ đề thường bị bỏ qua trong các cuộc thảo luận về vô sinh. Tuy nhiên, theo thống kê, khoảng 40% các trường hợp vô sinh có liên quan đến vấn đề từ phía nam giới.</p>
        
        <h3>Các yếu tố ảnh hưởng đến chất lượng tinh trùng</h3>
        <p>Nhiều yếu tố có thể ảnh hưởng đến số lượng và chất lượng tinh trùng, bao gồm:</p>
        <ul>
            <li>Chế độ ăn uống thiếu cân đối, thiếu các vitamin và khoáng chất cần thiết</li>
            <li>Lối sống không lành mạnh: hút thuốc, uống rượu bia, sử dụng chất kích thích</li>
            <li>Tiếp xúc với môi trường độc hại, hóa chất, nhiệt độ cao</li>
            <li>Stress và căng thẳng kéo dài</li>
            <li>Một số bệnh lý như giãn tĩnh mạch thừng tinh, nhiễm trùng đường sinh dục</li>
        </ul>
        
        <h3>Biện pháp cải thiện sức khỏe sinh sản</h3>
        <p>Để cải thiện chất lượng tinh trùng và tăng khả năng sinh sản, nam giới nên:</p>
        <ul>
            <li>Duy trì chế độ ăn giàu chất chống oxy hóa (vitamin C, E, selenium, kẽm)</li>
            <li>Tập thể dục đều đặn nhưng tránh các bài tập quá sức</li>
            <li>Hạn chế rượu bia, bỏ thuốc lá</li>
            <li>Tránh mặc quần quá chật, tránh tiếp xúc với nhiệt độ cao</li>
            <li>Kiểm tra sức khỏe định kỳ, đặc biệt khi có dấu hiệu bất thường</li>
        </ul>
        
        <p>Tại Trung tâm Y tế Tinh Trùng Chill, chúng tôi cung cấp dịch vụ tư vấn và khám sức khỏe sinh sản toàn diện cho nam giới, giúp phát hiện sớm và điều trị hiệu quả các vấn đề ảnh hưởng đến khả năng sinh sản.</p>
    `,
    3: `
        <p>Ngày 29/4/2024 vừa qua, Trung tâm Y tế Tinh Trùng Chill đã tổ chức thành công hội thảo "Sức khỏe sinh sản ở phụ nữ trẻ" với sự tham gia của hơn 200 phụ nữ độ tuổi 20-35.</p>
        
        <h3>Mục tiêu hội thảo</h3>
        <p>Hội thảo nhằm cung cấp kiến thức chuyên sâu về sức khỏe sinh sản, giúp phụ nữ trẻ hiểu rõ hơn về cơ thể mình và có những quyết định đúng đắn trong việc bảo vệ khả năng sinh sản.</p>
        
        <h3>Các chủ đề chính</h3>
        <ul>
            <li>Hiểu về chu kỳ kinh nguyệt và dấu hiệu rụng trứng</li>
            <li>Các bệnh lý phụ khoa thường gặp và ảnh hưởng đến khả năng sinh sản</li>
            <li>Dinh dưỡng và lối sống lành mạnh cho sức khỏe sinh sản</li>
            <li>Kế hoạch hóa gia đình và thời điểm tốt nhất để mang thai</li>
            <li>Bảo quản trứng đông lạnh - giải pháp cho phụ nữ muốn trì hoãn việc sinh con</li>
        </ul>
        
        <h3>Đội ngũ chuyên gia</h3>
        <p>Hội thảo có sự tham gia của các chuyên gia hàng đầu trong lĩnh vực sản phụ khoa và hỗ trợ sinh sản:</p>
        <ul>
            <li>PGS.TS Nguyễn Thị Hương - Trưởng khoa Phụ sản</li>
            <li>TS.BS Trần Văn Minh - Chuyên gia hỗ trợ sinh sản</li>
            <li>ThS.BS Lê Thị Hồng - Chuyên gia nội tiết sinh sản</li>
            <li>CN Dinh dưỡng Phạm Thu Hà - Chuyên gia dinh dưỡng</li>
        </ul>
        
        <p>Trung tâm Y tế Tinh Trùng Chill sẽ tiếp tục tổ chức các hội thảo tương tự trong thời gian tới, với mục tiêu nâng cao nhận thức của cộng đồng về sức khỏe sinh sản.</p>
    `
};

// Function to get post data by ID
const getPostById = (id: string): BlogPostDetail | null => {
    const postId = parseInt(id);
    const post = allBlogPosts.find(post => post.id === postId);

    if (!post) return null;

    // Create full blog post with content
    return {
        ...post,
        content: detailedContent[postId] || `
            <p>${post.excerpt}</p>
            
            <h3>Thông tin chi tiết</h3>
            <p>Đây là bài viết về chủ đề "${post.category}" đang được biên tập và bổ sung nội dung đầy đủ.</p>
            
            <p>Bài viết được cung cấp bởi ${post.author} và đăng tải vào ngày ${post.date}.</p>
            
            <h3>Nội dung sắp có</h3>
            <p>Chúng tôi đang cập nhật nội dung đầy đủ cho bài viết này. Vui lòng quay lại sau để đọc phiên bản hoàn chỉnh.</p>
            
            <p>Trong thời gian chờ đợi, bạn có thể tham khảo các bài viết khác trong cùng chủ đề ${post.category} được liệt kê bên dưới.</p>
        `
    };
};

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostSummary[]>([]);

    useEffect(() => {
        if (id) {
            // Get post data
            const postData = getPostById(id);
            setPost(postData);

            // Get related posts from the same category
            if (postData) {
                const related = allBlogPosts
                    .filter(relatedPost =>
                        relatedPost.id !== parseInt(id) &&
                        relatedPost.category === postData.category
                    )
                    .slice(0, 3);
                setRelatedPosts(related);
            }

            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-full h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="w-3/4 h-6 bg-gray-300 rounded mb-8"></div>
                        <div className="w-full h-64 bg-gray-300 rounded mb-8"></div>
                        <div className="w-full">
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded-lg w-2/3 mb-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Không tìm thấy bài viết</h1>
                    <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-8">
                    <a href="/" className="hover:text-blue-600">Trang chủ</a> &gt;
                    <a href="/blog" className="hover:text-blue-600 mx-1">Blog</a> &gt;
                    <span className="text-gray-700">{post.title}</span>
                </div>

                {/* Article header */}
                <h1 className="text-4xl font-bold text-blue-900 mb-4">{post.title}</h1>

                <div className="flex items-center text-gray-600 mb-8">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                        alt={post.author}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <div className="font-medium">{post.author}</div>
                        <div className="text-sm flex items-center">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span className="text-blue-600">{post.category}</span>
                        </div>
                    </div>
                </div>

                {/* Featured image */}
                <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/medical-fallback.jpg";
                        }}
                    />
                </div>

                {/* Article content */}
                <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                <div className="mb-12">
                    <div className="text-lg font-semibold mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Sức khỏe sinh sản</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{post.category}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Y tế</span>
                    </div>
                </div>

                {/* Related articles */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((relatedPost) => (
                            <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <a
                                    href={`/blog/${relatedPost.id}`}
                                    className="block hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        src={relatedPost.image}
                                        alt={relatedPost.title}
                                        className="w-full h-40 object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "/images/medical-fallback.jpg";
                                        }}
                                    />
                                    <div className="p-4">
                                        <span className="text-blue-600 text-sm font-medium mb-1 block">{relatedPost.category}</span>
                                        <h4 className="font-semibold hover:text-blue-600 transition-colors">
                                            {relatedPost.title}
                                        </h4>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back to blog button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/blog')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogPost; 