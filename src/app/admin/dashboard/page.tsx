'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import {
  FiHome, FiCheckCircle, FiClock, FiUsers,
  FiPlus, FiEye, FiEdit, FiTrash2
} from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data.slice(0, 5)); // Get only 5 recent properties
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length.toString(),
      change: '+12%',
      icon: FiHome,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Listings',
      value: properties.filter(p => p.status === 'FOR_SALE' || p.status === 'FOR_RENT').length.toString(),
      change: '+8%',
      icon: FiCheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Submissions',
      value: '0',
      change: '+5',
      icon: FiClock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Users',
      value: '1',
      change: '+23%',
      icon: FiUsers,
      color: 'bg-purple-500',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'FOR_RENT':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SOLD':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'RENTED':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <FiPlus className="w-6 h-6 text-primary-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Add Property</p>
                <p className="text-sm text-gray-600">Create new listing</p>
              </div>
            </Link>

            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 transition-all group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                <FiClock className="w-6 h-6 text-yellow-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Review Submissions</p>
                <p className="text-sm text-gray-600">0 pending</p>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <FiUsers className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">View all users</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Properties</h2>
            <Link
              href="/admin/properties"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-900">Property</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-900">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{property.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(property.price)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
