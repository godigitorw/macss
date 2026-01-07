'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiSearch, FiHome } from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  district: string;
  sector: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  views: number;
  createdAt: string;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Property deleted successfully');
        fetchProperties(); // Refresh list
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

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

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || property.status === filterStatus;
    const matchesType = !filterType || property.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <p className="text-gray-600 mt-1">Manage all property listings</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all"
          >
            <FiPlus className="w-5 h-5" />
            Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="">All Status</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="OFFICE">Office</option>
                <option value="WAREHOUSE">Warehouse</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No properties found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-900">Property</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Price</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-900">Views</th>
                    <th className="text-right py-4 px-6 text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {property.images && property.images[0] ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiHome className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {property.bedrooms && `${property.bedrooms} beds`}
                              {property.bathrooms && ` • ${property.bathrooms} baths`}
                              {property.area && ` • ${property.area} m²`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{property.type}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(property.price)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{property.district}</p>
                        <p className="text-xs text-gray-500">{property.sector}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{property.views || 0}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/properties/edit/${property.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
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

        {/* Summary */}
        {!loading && filteredProperties.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
