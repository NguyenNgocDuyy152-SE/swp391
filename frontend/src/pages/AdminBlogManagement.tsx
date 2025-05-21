import React, { useState, FormEvent } from 'react';
import { useBlog, BlogPost } from '../contexts/BlogContext';

interface FormData {
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
}

const AdminBlogManagement: React.FC = () => {
    const { posts, addPost, updatePost, deletePost } = useBlog();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: 'Kỹ thuật mới',
        excerpt: '',
        content: '',
        image: '',
        author: ''
    });

    // Filter posts based on search term and category
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (post: BlogPost) => {
        setSelectedPost(post);
        setFormData({
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            author: post.author
        });
        setIsEditing(true);
    };

    const handleDelete = (postId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            deletePost(postId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (selectedPost) {
            // Update existing post
            updatePost(selectedPost.id, {
                ...formData,
                date: new Date().toLocaleDateString('vi-VN')
            });
        } else {
            // Create new post
            addPost(formData);
        }

        // Reset form and close modal
        setFormData({
            title: '',
            category: 'Kỹ thuật mới',
            excerpt: '',
            content: '',
            image: '',
            author: ''
        });
        setSelectedPost(null);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            category: 'Kỹ thuật mới',
            excerpt: '',
            content: '',
            image: '',
            author: ''
        });
        setSelectedPost(null);
        setIsEditing(false);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Quản lý Bài viết</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/4">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="Kỹ thuật mới">Kỹ thuật mới</option>
                            <option value="Sức khỏe">Sức khỏe</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Thông báo">Thông báo</option>
                        </select>
                    </div>
                    <button
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => {
                            setSelectedPost(null);
                            setIsEditing(true);
                        }}
                    >
                        Thêm bài viết mới
                    </button>
                </div>
            </div>

            {/* Blog Posts Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tác giả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày đăng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="h-10 w-10 rounded-lg object-cover mr-3"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = "/images/medical-fallback.jpg";
                                            }}
                                        />
                                        <div className="text-sm font-medium text-gray-900">
                                            {post.title}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Create Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {selectedPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Đóng</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                                    <select
                                        name="category"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Kỹ thuật mới">Kỹ thuật mới</option>
                                        <option value="Sức khỏe">Sức khỏe</option>
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Thông báo">Thông báo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nội dung tóm tắt</label>
                                    <textarea
                                        name="excerpt"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={3}
                                        value={formData.excerpt}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nội dung chi tiết</label>
                                    <textarea
                                        name="content"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={10}
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Bạn có thể sử dụng HTML để định dạng nội dung (ví dụ: &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hình ảnh URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                                    <input
                                        type="text"
                                        name="author"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        {selectedPost ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogManagement; 