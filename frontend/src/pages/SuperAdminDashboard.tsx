import React, { useEffect, useState } from 'react';
import { get } from '../services/apiClient';

interface Admin {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    last_login: string;
    status: string;
}

const SuperAdminDashboard: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await get<{ admins: Admin[] }>('/admin/admins');
                setAdmins(response.admins);
            } catch (error) {
                console.error('Error fetching admins:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
                
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Danh sách Admin</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.role === 'super_admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.status === 'active' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(admin.last_login).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard; 