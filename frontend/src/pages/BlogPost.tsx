import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useBlog, BlogPost as BlogPostType } from '../contexts/BlogContext';

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { posts } = useBlog();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

    useEffect(() => {
        if (id) {
            // Get post data
            const postData = posts.find(p => p.id === parseInt(id));
            setPost(postData || null);

            // Get related posts from the same category
            if (postData) {
                const related = posts
                    .filter(relatedPost =>
                        relatedPost.id !== parseInt(id) &&
                        relatedPost.category === postData.category
                    )
                    .slice(0, 3);
                setRelatedPosts(related);
            }

            setLoading(false);
        }
    }, [id, posts]);

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