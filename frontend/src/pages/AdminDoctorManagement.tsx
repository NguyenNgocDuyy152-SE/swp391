import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Doctor {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string; // chuyên khoa
    status: 'active' | 'inactive';
    image_url?: string;
}

const AdminDoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        status: 'active',
    });

    const navigate = useNavigate();

    // Fetch doctors data
    useEffect(() => {
        // For now, use mock data. In real implementation, fetch from API
        const mockDoctors: Doctor[] = [
            {
                id: 1,
                name: 'Bs. Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                specialization: 'Hiếm muộn nam',
                phone: '0901234567',
                image_url: 'https://randomuser.me/api/portraits/men/1.jpg',
                status: 'active'
            },
            {
                id: 2,
                name: 'Bs. Trần Thị B',
                email: 'tranthib@example.com',
                specialization: 'Hiếm muộn nữ',
                phone: '0901234568',
                image_url: 'https://randomuser.me/api/portraits/women/2.jpg',
                status: 'active'
            },
            {
                id: 3,
                name: 'Bs. Phạm Văn C',
                email: 'phamvanc@example.com',
                specialization: 'Nội tiết',
                phone: '0901234569',
                image_url: 'https://randomuser.me/api/portraits/men/3.jpg',
                status: 'inactive'
            },
            {
                id: 4,
                name: 'Bs. Lê Thị D',
                email: 'lethid@example.com',
                specialization: 'Hỗ trợ sinh sản',
                phone: '0901234570',
                image_url: 'https://randomuser.me/api/portraits/women/4.jpg',
                status: 'active'
            }
        ];

        setDoctors(mockDoctors);
        setFilteredDoctors(mockDoctors);
        setLoading(false);

        // In real implementation, fetch data from server
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
    };

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            status: doctor.status,
        });
        setShowAddForm(true);
    };

    const handleDelete = (doctorId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            // For mock implementation, just filter out the doctor
            const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorId);
            setDoctors(updatedDoctors);
            setFilteredDoctors(updatedDoctors);
            
            // In real implementation, make an API call to delete the doctor
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedDoctor) {
            // Update existing doctor
            const updatedDoctors = doctors.map(doctor => 
                doctor.id === selectedDoctor.id 
                    ? { ...doctor, ...formData, status: formData.status as 'active' | 'inactive' } 
                    : doctor
            );
            setDoctors(updatedDoctors);
            setFilteredDoctors(updatedDoctors);
        } else {
            // Add new doctor
            const newDoctor: Doctor = {
                id: Math.max(...doctors.map(d => d.id), 0) + 1,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                specialization: formData.specialization,
                status: formData.status as 'active' | 'inactive'
            };
            
            const updatedDoctors = [...doctors, newDoctor];
            setDoctors(updatedDoctors);
            setFilteredDoctors(updatedDoctors);
        }

        // Reset form
        setShowAddForm(false);
        setSelectedDoctor(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            specialization: '',
            status: 'active',
        });

        // In real implementation, make API calls to update or add doctors
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
                                status: 'active',
                            });
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
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 rounded-full" 
                                                        src={doctor.image_url || 'https://via.placeholder.com/150'} 
                                                        alt={doctor.name} 
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                                                </div>
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
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {doctor.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                            </span>
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
                            <h3 className="text-lg font-medium text-gray-900">
                                {selectedDoctor ? 'Cập nhật thông tin bác sĩ' : 'Thêm bác sĩ mới'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 text-right space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    {selectedDoctor ? 'Cập nhật' : 'Thêm'}
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