'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import SuccessModal from '@/components/SuccessModal';
import { FiSave, FiX } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface PropertyType {
  id: string;
  name: string;
  displayName: string;
  icon: string | null;
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'HOUSE',
    status: 'FOR_SALE',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    parkingSpaces: '',
    district: '',
    sector: '',
    address: '',
    images: [] as string[],
    amenities: [] as string[],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    featured: false,
  });

  const [newAmenity, setNewAmenity] = useState('');

  // Fetch property types
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await fetch('/api/property-types?active=true');
        if (response.ok) {
          const data = await response.json();
          setPropertyTypes(data);
          // Set first property type as default if available
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, type: data[0].name }));
          }
        }
      } catch (error) {
        console.error('Error fetching property types:', error);
      }
    };

    fetchPropertyTypes();
  }, []);

  // Quill editor modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenityToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user ID from localStorage (in production, this should come from auth)
      const userId = 'cmiq4g3130000ezbw5pglhfed'; // Admin user ID

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          parkingSpaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
          userId,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Property added successfully!');
        setShowSuccessModal(true);
        // Redirect after modal auto-closes
        setTimeout(() => {
          router.push('/admin/properties');
        }, 2200);
      } else {
        const error = await response.json();
        setSuccessMessage(`Failed to add property: ${error.error || 'Unknown error'}`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setSuccessMessage('Error adding property. Please try again.');
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <p className="text-gray-600 mt-1">Fill in the details to add a new property listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Modern Villa in Kacyiru"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe the property in detail... You can use formatting tools above."
                    className="bg-white"
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  {propertyTypes.length === 0 ? (
                    <option value="">Loading property types...</option>
                  ) : (
                    propertyTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.displayName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Listing Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="FOR_SALE">For Sale</option>
                  <option value="FOR_RENT">For Rent</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Price (RWF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 250000000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Featured Property
                </label>
                <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-400">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Mark as featured property</span>
                </label>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show bedrooms/bathrooms only for HOUSE, APARTMENT, OFFICE */}
              {(formData.type === 'HOUSE' || formData.type === 'APARTMENT' || formData.type === 'OFFICE') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 3"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Area (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 350"
                />
              </div>

              {/* Show parking only for HOUSE, APARTMENT, COMMERCIAL, OFFICE, WAREHOUSE */}
              {formData.type !== 'LAND' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Select District</option>
                  {/* Kigali City */}
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                  {/* Eastern Province */}
                  <option value="Bugesera">Bugesera</option>
                  <option value="Gatsibo">Gatsibo</option>
                  <option value="Kayonza">Kayonza</option>
                  <option value="Kirehe">Kirehe</option>
                  <option value="Ngoma">Ngoma</option>
                  <option value="Nyagatare">Nyagatare</option>
                  <option value="Rwamagana">Rwamagana</option>
                  {/* Northern Province */}
                  <option value="Burera">Burera</option>
                  <option value="Gakenke">Gakenke</option>
                  <option value="Gicumbi">Gicumbi</option>
                  <option value="Musanze">Musanze</option>
                  <option value="Rulindo">Rulindo</option>
                  {/* Southern Province */}
                  <option value="Gisagara">Gisagara</option>
                  <option value="Huye">Huye</option>
                  <option value="Kamonyi">Kamonyi</option>
                  <option value="Muhanga">Muhanga</option>
                  <option value="Nyamagabe">Nyamagabe</option>
                  <option value="Nyanza">Nyanza</option>
                  <option value="Nyaruguru">Nyaruguru</option>
                  <option value="Ruhango">Ruhango</option>
                  {/* Western Province */}
                  <option value="Karongi">Karongi</option>
                  <option value="Ngororero">Ngororero</option>
                  <option value="Nyabihu">Nyabihu</option>
                  <option value="Nyamasheke">Nyamasheke</option>
                  <option value="Rubavu">Rubavu</option>
                  <option value="Rusizi">Rusizi</option>
                  <option value="Rutsiro">Rutsiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Sector <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Kacyiru"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., KG 123 St, Kacyiru"
                />
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Property Images</h3>
            <ImageUploader
              label="Property Gallery"
              images={formData.images}
              onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
              maxImages={15}
              required={true}
            />
            <p className="mt-2 text-xs text-gray-500">
              The first image will be used as the thumbnail. You can drag and drop to reorder images.
            </p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>

            {/* Add Amenity Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type amenity name and press Add"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all"
              >
                Add
              </button>
            </div>

            {/* Display Added Amenities */}
            {formData.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-50 border-2 border-primary-200 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No amenities added yet. Type and click Add to add amenities.</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+250788000000"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:border-gray-300 transition-all"
            >
              <FiX className="inline-block w-5 h-5 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Adding Property...
                </>
              ) : (
                <>
                  <FiSave className="inline-block w-5 h-5 mr-2" />
                  Add Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </AdminLayout>
  );
}
