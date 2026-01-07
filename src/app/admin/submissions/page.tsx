'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  FiMapPin,
  FiHome,
} from 'react-icons/fi';

interface Submission {
  id: string;
  propertyType: string;
  listingType: string;
  title: string;
  description: string;
  district: string;
  sector: string;
  address: string;
  bedrooms: string | null;
  bathrooms: string | null;
  area: string | null;
  price: string;
  images: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function SubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Check admin auth
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchSubmissions();
  }, [router]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
        setFilteredSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, statusFilter, submissions]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
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
          <h1 className="text-2xl font-bold text-gray-900">Property Submissions</h1>
          <p className="text-gray-600 mt-1">Manage property listing submissions from users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search submissions..."
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
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
              <FiHome className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.filter(s => s.status === 'PENDING').length}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'APPROVED').length}
                </p>
              </div>
              <FiCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(s => s.status === 'REJECTED').length}
                </p>
              </div>
              <FiX className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Submissions Found</h3>
            <p className="text-gray-600">No property submissions match your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
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
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{submission.title}</div>
                          <div className="text-sm text-gray-600">
                            {submission.propertyType} • {submission.listingType}
                          </div>
                          <div className="text-sm font-semibold text-primary-600 mt-1">
                            {submission.price} RWF
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{submission.ownerName}</div>
                          <div className="text-sm text-gray-600">{submission.ownerEmail}</div>
                          <div className="text-sm text-gray-600">{submission.ownerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {submission.sector}, {submission.district}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(submission.status)}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {submission.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateStatus(submission.id, 'APPROVED')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <FiCheck className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => updateStatus(submission.id, 'REJECTED')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <FiX className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteSubmission(submission.id)}
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
        {showDetailModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Property Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Listing Type</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.listingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold text-primary-600">{selectedSubmission.price} RWF</p>
                    </div>
                    {selectedSubmission.bedrooms && (
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-semibold text-gray-900">{selectedSubmission.bedrooms}</p>
                      </div>
                    )}
                    {selectedSubmission.bathrooms && (
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-semibold text-gray-900">{selectedSubmission.bathrooms}</p>
                      </div>
                    )}
                    {selectedSubmission.area && (
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-semibold text-gray-900">{selectedSubmission.area}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.description}</p>
                </div>

                {/* Property Images */}
                {selectedSubmission.images && selectedSubmission.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Property Images</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedSubmission.images.map((imageUrl, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition-colors group">
                          <img
                            src={imageUrl}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
                          >
                            View Full Size
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Location</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sector</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.sector}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.address}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.ownerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.ownerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      updateStatus(selectedSubmission.id, 'CONTACTED');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedSubmission.id, 'APPROVED');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedSubmission.id, 'REJECTED');
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Reject
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
