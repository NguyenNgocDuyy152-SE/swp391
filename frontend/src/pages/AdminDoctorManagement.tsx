import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put, del } from '../services/apiClient';

interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string; // chuyên khoa
    qualification?: string;
    status: 'active' | 'inactive';
    image_url?: string;
}

interface DoctorFormData {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    status: 'active' | 'inactive';
}

const AdminDoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState<DoctorFormData>({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        status: 'active',
    });

    const navigate = useNavigate();

    // Fetch doctors data
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const response = await get<{ doctors: Doctor[] }>('/admin/doctors');
            if (response && response.doctors) {
                setDoctors(response.doctors);
                setFilteredDoctors(response.doctors);
            } else {
                // Fallback to mock data for testing
                const mockDoctors: Doctor[] = [
                    {
                        id: 1,
                        name: 'Bs. Nguyễn Văn A',
                        email: 'nguyenvana@example.com',
                        specialization: 'Hiếm muộn nam',
                        qualification: 'MD',
                        phone: '0901234567',
                        image_url: 'https://randomuser.me/api/portraits/men/1.jpg',
                        status: 'active'
                    },
                    {
                        id: 2,
                        name: 'Bs. Trần Thị B',
                        email: 'tranthib@example.com',
                        specialization: 'Hiếm muộn nữ',
                        qualification: 'PhD',
                        phone: '0901234568',
                        image_url: 'https://randomuser.me/api/portraits/women/2.jpg',
                        status: 'active'
                    }
                ];
                
                setDoctors(mockDoctors);
                setFilteredDoctors(mockDoctors);
                console.warn("Loading mock doctor data. In production, API should return actual data.");
            }
        } catch (err) {
            console.error("Failed to fetch doctors:", err);
            setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Handle search and filtering
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDoctors(doctors);
            return;
        }

        const filtered = doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.phone.includes(searchTerm)
        );
        
        setFilteredDoctors(filtered);
    }, [doctors, searchTerm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone || '',
            specialization: doctor.specialization,
            qualification: doctor.qualification || '',
            status: doctor.status,
        });
        setShowAddForm(true);
    };

    const handleDelete = async (doctorId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            try {
                await del(`/admin/doctors/${doctorId}`);
                
                // Cập nhật danh sách sau khi xóa
                const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorId);
                setDoctors(updatedDoctors);
                setFilteredDoctors(updatedDoctors);
                
                alert("Xóa bác sĩ thành công");
            } catch (err: any) {
                console.error("Failed to delete doctor:", err);
                alert("Không thể xóa bác sĩ: " + (err.message || "Đã xảy ra lỗi"));
            }
        }
    };

    const handleStatusChange = async (doctorId: number, newStatus: 'active' | 'inactive') => {
        try {
            console.log('Updating status for doctor:', doctorId, 'to:', newStatus);
            
            // Call the API to update the doctor's status
            const response = await put(`/admin/doctors/${doctorId}/status`, { status: newStatus });
            console.log('Update status response:', response);
            
            // After successful API call, fetch the updated list
            await fetchDoctors();
            
            // Show success message
            alert(newStatus === 'active' 
                ? "Bác sĩ đã được kích hoạt thành công" 
                : "Bác sĩ đã được ngừng hoạt động");
                
        } catch (err: any) {
            console.error("Failed to update doctor status:", err);
            console.error("Error details:", {
                message: err.message,
                status: err.status,
                response: err.response
            });
            alert("Không thể cập nhật trạng thái bác sĩ: " + (err.message || "Đã xảy ra lỗi"));
            // Refresh the list to ensure UI shows correct state
            await fetchDoctors();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            if (selectedDoctor) {
                // API chưa hỗ trợ cập nhật, chỉ cập nhật local state tạm thời
                console.warn("API update doctor not implemented yet, updating local state only");
                const updatedDoctors = doctors.map(doctor => 
                    doctor.id === selectedDoctor.id 
                        ? { ...doctor, ...formData, status: formData.status as 'active' | 'inactive' } 
                        : doctor
                );
                setDoctors(updatedDoctors);
                setFilteredDoctors(updatedDoctors);
            } else {
                // Thêm bác sĩ mới
                const response = await post<{ user_id: number; doctor_id: number; message: string }>('/admin/doctors', formData);
                
                // Sau khi thêm thành công, tải lại danh sách bác sĩ
                fetchDoctors();
                alert("Thêm bác sĩ thành công. Tài khoản đã được tạo với mật khẩu mặc định.");
            }

            // Reset form
            setShowAddForm(false);
            setSelectedDoctor(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                specialization: '',
                qualification: '',
                status: 'active',
            });
        } catch (err: any) {
            console.error("Error submitting doctor:", err);
            
            // Special handling for authentication errors
            if (err.message === 'Authentication required') {
                setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                // Optional: Redirect to login after a short delay
                setTimeout(() => {
                    navigate('/admin/login');
                }, 2000);
                return;
            }
            
            // Special handling for conflict errors (409) - typically email already exists
            if (err.status === 409) {
                setError(`Email ${formData.email} đã được sử dụng. Vui lòng sử dụng email khác.`);
                return;
            }
            
            const errorMessage = err.response?.data?.message || err.message || "Đã xảy ra lỗi khi lưu thông tin bác sĩ";
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">Đang tải...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý Bác sĩ</h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bác sĩ..."
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedDoctor(null);
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                specialization: '',
                                qualification: '',
                                status: 'active',
                            });
                            setError(null);
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Thêm Bác sĩ
                    </button>
                </div>
            </div>

            {/* Doctor list */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{doctor.specialization}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{doctor.email}</div>
                                            <div className="text-sm text-gray-500">{doctor.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={doctor.status}
                                                onChange={(e) => handleStatusChange(doctor.id, e.target.value as 'active' | 'inactive')}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    doctor.status === 'active' 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                <option value="active">Đang hoạt động</option>
                                                <option value="inactive">Ngừng hoạt động</option>
                                            </select>
                                            {doctor.status === 'inactive' && (
                                                <p className="mt-1 text-xs text-red-500">Không thể đăng nhập</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleEdit(doctor)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doctor.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không tìm thấy bác sĩ nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Doctor Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {selectedDoctor ? 'Cập nhật thông tin bác sĩ' : 'Thêm bác sĩ mới'}
                                </h3>
                                <button 
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-4">
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Email này sẽ được dùng làm tên đăng nhập</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        required
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Học vị / Chứng chỉ</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        required
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="MD, PhD, ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="active">Đang hoạt động</option>
                                        <option value="inactive">Ngừng hoạt động</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">Chỉ bác sĩ có trạng thái "Đang hoạt động" mới có thể đăng nhập vào hệ thống.</p>
                                </div>
                                </div>
                                
                                {!selectedDoctor && (
                                    <div className="mt-4 bg-blue-50 p-4 rounded-md">
                                        <p className="text-sm text-blue-700">
                                            <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo tài khoản cho bác sĩ với mật khẩu mặc định.
                                            Bác sĩ sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-3 bg-gray-50 text-right">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang xử lý...' : selectedDoctor ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctorManagement; 