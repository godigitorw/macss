'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SuccessModal from '@/components/SuccessModal';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { availableIcons, getIconComponent } from '@/lib/iconMap';

interface PropertyType {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  order: number;
}

export default function PropertyTypesPage() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<PropertyType | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: 'FiHome',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch('/api/property-types');
      if (response.ok) {
        const data = await response.json();
        setPropertyTypes(data);
      }
    } catch (error) {
      console.error('Error fetching property types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingType
        ? `/api/property-types/${editingType.id}`
        : '/api/property-types';
      
      const method = editingType ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(
          editingType
            ? 'Property type updated successfully!'
            : 'Property type created successfully!'
        );
        setShowSuccessModal(true);
        setShowModal(false);
        resetForm();
        fetchPropertyTypes();
      } else {
        const error = await response.json();
        setSuccessMessage(`Error: ${error.error || 'Unknown error'}`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error saving property type:', error);
      setSuccessMessage('Error saving property type');
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (propertyType: PropertyType) => {
    setEditingType(propertyType);
    setFormData({
      name: propertyType.name,
      displayName: propertyType.displayName,
      description: propertyType.description || '',
      icon: propertyType.icon || 'FiHome',
      isActive: propertyType.isActive,
      order: propertyType.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property type?')) {
      return;
    }

    try {
      const response = await fetch(`/api/property-types/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage('Property type deleted successfully!');
        setShowSuccessModal(true);
        fetchPropertyTypes();
      } else {
        const error = await response.json();
        setSuccessMessage(`Error: ${error.error || 'Unknown error'}`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error deleting property type:', error);
      setSuccessMessage('Error deleting property type');
      setShowSuccessModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      icon: 'FiHome',
      isActive: true,
      order: 0,
    });
    setEditingType(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Property Types</h2>
            <p className="text-gray-600 mt-1">
              Manage property types that will be available when adding properties
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
          >
            <FiPlus className="w-5 h-5" />
            Add Property Type
          </button>
        </div>

        {/* Property Types Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : propertyTypes.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Property Types Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first property type
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all"
            >
              <FiPlus className="w-5 h-5" />
              Add Property Type
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {propertyTypes.map((type) => {
              const IconComponent = getIconComponent(type.icon);
              
              return (
                <div
                  key={type.id}
                  className={`bg-white rounded-xl border-2 p-6 transition-all ${
                    type.isActive
                      ? 'border-gray-200 hover:border-primary-400'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {type.displayName}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">{type.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {type.isActive ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          <FiCheck className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          <FiX className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {type.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {type.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(type)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 hover:border-primary-400 text-gray-700 hover:text-primary-600 font-medium rounded-lg transition-all"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-medium rounded-lg transition-all"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingType ? 'Edit Property Type' : 'Add New Property Type'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Type Name (CODE) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value.toUpperCase() })
                      }
                      required
                      placeholder="e.g., VILLA"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used internally (uppercase, no spaces)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({ ...formData, displayName: e.target.value })
                      }
                      required
                      placeholder="e.g., Luxury Villa"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Shown to users
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Brief description of this property type..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {availableIcons.map((iconOption) => {
                      const IconComp = getIconComponent(iconOption.name);
                      return (
                        <button
                          key={iconOption.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconOption.name })}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                            formData.icon === iconOption.name
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={iconOption.label}
                        >
                          <IconComp className="w-6 h-6 text-gray-700" />
                          <span className="text-[10px] text-gray-500 truncate w-full text-center">
                            {iconOption.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) })
                      }
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Display order (lower = first)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-400">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active (visible to users)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:border-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : editingType ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
      </div>
    </AdminLayout>
  );
}
