'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiClock,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiExternalLink,
  FiHome,
} from 'react-icons/fi';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    images: string[];
    price: number;
  };
}

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Check admin auth
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchInquiries();
  }, [router]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
        setFilteredInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = inquiries;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.property.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInquiries(filtered);
  }, [searchTerm, statusFilter, inquiries]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry) {
            setSelectedInquiry(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInquiries();
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONTACTED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Property Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter(i => i.status === 'PENDING').length}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-green-600">
                  {inquiries.filter(i => i.status === 'CONTACTED').length}
                </p>
              </div>
              <FiCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
              </div>
              <FiMessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Inquiries Found</h3>
            <p className="text-gray-600">No inquiries match your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-600">{inquiry.email}</div>
                          <div className="text-sm text-gray-600">{inquiry.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                {inquiry.property.images && inquiry.property.images[0] ? (
                                    <Image 
                                        src={inquiry.property.images[0]} 
                                        alt={inquiry.property.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FiHome />
                                    </div>
                                )}
                            </div>
                            <div className="max-w-[200px]">
                                <div className="text-sm font-medium text-gray-900 truncate" title={inquiry.property.title}>
                                    {inquiry.property.title}
                                </div>
                                <Link 
                                    href={`/properties/${inquiry.property.id}`}
                                    target="_blank"
                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-0.5"
                                >
                                    View Property <FiExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {inquiry.status === 'PENDING' && (
                              <button
                                onClick={() => updateStatus(inquiry.id, 'CONTACTED')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Contacted"
                              >
                                <FiCheck className="w-5 h-5" />
                              </button>
                          )}
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${getStatusBadge(selectedInquiry.status)}`}>
                        {selectedInquiry.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${selectedInquiry.email}`} className="font-semibold text-primary-600 hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${selectedInquiry.phone}`} className="font-semibold text-primary-600 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-3">Interested Property</h3>
                   <div className="flex items-center gap-4 border border-gray-200 rounded-lg p-3">
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            {selectedInquiry.property.images && selectedInquiry.property.images[0] ? (
                                <Image 
                                    src={selectedInquiry.property.images[0]} 
                                    alt={selectedInquiry.property.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FiHome />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{selectedInquiry.property.title}</h4>
                            <p className="text-primary-600 font-medium">
                                {new Intl.NumberFormat('en-RW').format(selectedInquiry.property.price)} RWF
                            </p>
                            <Link 
                                href={`/properties/${selectedInquiry.property.id}`}
                                target="_blank"
                                className="text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 mt-1"
                            >
                                View Full Listing <FiExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                   </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: Inquiry about ${selectedInquiry.property.title}`}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4" />
                    Reply via Email
                  </a>
                  {selectedInquiry.status !== 'CONTACTED' && (
                    <button
                        onClick={() => {
                        updateStatus(selectedInquiry.id, 'CONTACTED');
                        setShowDetailModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <FiCheck className="w-4 h-4" />
                        Mark as Contacted
                    </button>
                  )}
                  <button
                    onClick={() => {
                        deleteInquiry(selectedInquiry.id);
                    }}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
