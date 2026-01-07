'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuccessModal from '@/components/SuccessModal';
import MultiImageUpload from '@/components/MultiImageUpload';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiCheck } from 'react-icons/fi';

export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    // Property Details
    propertyType: '',
    listingType: '',
    title: '',
    description: '',

    // Location
    district: '',
    sector: '',
    address: '',

    // Property Features
    bedrooms: '',
    bathrooms: '',
    area: '',
    parkingSpaces: '',

    // Pricing
    price: '',
    negotiable: false,

    // Amenities
    amenities: [] as string[],

    // Images
    images: [] as string[],

    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',

    // Additional
    additionalInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Debug: Log what we're submitting
      console.log('Submitting form data:', formData);
      
      // Submit to API
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit property');
      }

      // Show success modal
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        propertyType: '',
        listingType: '',
        title: '',
        description: '',
        district: '',
        sector: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        parkingSpaces: '',
        price: '',
        negotiable: false,
        amenities: [],
        images: [],
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        additionalInfo: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableAmenities = [
    'Swimming Pool',
    'Gym',
    'Security',
    'Generator',
    'Water Tank',
    'Garden',
    'Balcony',
    'Elevator',
    'Furnished',
    'Air Conditioning',
    'Internet',
    'Servant Quarters',
  ];

  const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Property Details
        if (!formData.propertyType) {
          alert('Please select a property type');
          return false;
        }
        if (!formData.listingType) {
          alert('Please select a listing type (For Sale or For Rent)');
          return false;
        }
        if (!formData.title.trim()) {
          alert('Please enter a property title');
          return false;
        }
        if (!formData.description.trim()) {
          alert('Please enter a property description');
          return false;
        }
        return true;

      case 2:
        // Location & Features
        if (!formData.district) {
          alert('Please select a district');
          return false;
        }
        if (!formData.sector.trim()) {
          alert('Please enter a sector');
          return false;
        }
        if (!formData.area.trim()) {
          alert('Please enter the property area');
          return false;
        }
        return true;

      case 3:
        // Pricing & Amenities
        if (!formData.price.trim()) {
          alert('Please enter a price');
          return false;
        }
        return true;

      case 4:
        // Images (optional, so always valid)
        return true;

      case 5:
        // Owner Information
        if (!formData.ownerName.trim()) {
          alert('Please enter your full name');
          return false;
        }
        if (!formData.ownerEmail.trim()) {
          alert('Please enter your email address');
          return false;
        }
        if (!formData.ownerPhone.trim()) {
          alert('Please enter your phone number');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Property Details', icon: FiHome },
    { number: 2, title: 'Location & Features', icon: FiMapPin },
    { number: 3, title: 'Pricing & Amenities', icon: FiDollarSign },
    { number: 4, title: 'Property Images', icon: FiImage },
    { number: 5, title: 'Owner Information', icon: FiCheck },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                List Your Property
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Reach thousands of potential buyers and renters. List your property with us today!
              </p>
            </div>
          </div>
        </section>

        {/* Steps Indicator */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStep >= step.number
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block ${
                        currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        currentStep > step.number ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                {/* Step 1: Property Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>

                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Property Type *
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select property type</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                        <option value="office">Office</option>
                        <option value="warehouse">Warehouse</option>
                      </select>
                    </div>

                    {/* Listing Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Listing Type *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-400 transition-all">
                          <input
                            type="radio"
                            name="listingType"
                            value="FOR_SALE"
                            checked={formData.listingType === 'FOR_SALE'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span
                            className={`text-sm font-semibold ${
                              formData.listingType === 'FOR_SALE'
                                ? 'text-primary-600'
                                : 'text-gray-700'
                            }`}
                          >
                            For Sale
                          </span>
                          {formData.listingType === 'FOR_SALE' && (
                            <FiCheck className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                          )}
                        </label>
                        <label className="relative flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-400 transition-all">
                          <input
                            type="radio"
                            name="listingType"
                            value="FOR_RENT"
                            checked={formData.listingType === 'FOR_RENT'}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span
                            className={`text-sm font-semibold ${
                              formData.listingType === 'FOR_RENT'
                                ? 'text-primary-600'
                                : 'text-gray-700'
                            }`}
                          >
                            For Rent
                          </span>
                          {formData.listingType === 'FOR_RENT' && (
                            <FiCheck className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Property Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Modern 3 Bedroom House in Kacyiru"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Property Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Describe your property in detail..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Features */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Features</h2>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        District *
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select district</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sector */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Sector *
                      </label>
                      <input
                        type="text"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Kacyiru"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Property Features */}
                    <div className="grid grid-cols-2 gap-4">
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
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Area (m²) *
                        </label>
                        <input
                          type="number"
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          required
                          min="1"
                          placeholder="e.g., 250"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
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
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Pricing & Amenities */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Amenities</h2>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Price (RWF) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="e.g., 50000000"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Negotiable */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="negotiable"
                          checked={formData.negotiable}
                          onChange={handleChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Price is negotiable
                        </span>
                      </label>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Amenities
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableAmenities.map((amenity) => (
                          <label
                            key={amenity}
                            className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.amenities.includes(amenity)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.amenities.includes(amenity)}
                              onChange={() => handleAmenityToggle(amenity)}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Property Images */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Images</h2>
                    
                    <p className="text-gray-600 mb-4">
                      Upload up to 10 high-quality images of your property. Good photos help attract more potential buyers or renters.
                    </p>

                    <MultiImageUpload
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                      maxImages={10}
                      maxSizeMB={10}
                    />

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Tip:</strong> Include photos of the exterior, interior rooms, kitchen, bathrooms, and any special features like gardens or parking areas.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Owner Information */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Owner Information</h2>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="ownerEmail"
                          value={formData.ownerEmail}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="ownerPhone"
                          value={formData.ownerPhone}
                          onChange={handleChange}
                          required
                          placeholder="+250 788 308 043"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Additional Information
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Any additional information you'd like to share..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Note */}
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
                      <p className="text-sm text-primary-900">
                        <strong>Note:</strong> By submitting this form, you agree to our terms and conditions.
                        Our team will review your property listing and contact you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          Submit Property
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Why List With Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why List With MAC SS Real Estate?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get maximum exposure for your property
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Exposure</h3>
                <p className="text-gray-600">
                  Reach thousands of potential buyers and renters actively searching for properties
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Listing</h3>
                <p className="text-gray-600">
                  Simple process to get your property listed and visible within 24 hours
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Our team provides guidance throughout the listing and selling process
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank You!"
        message="Our team will review your property submission and get back to you within 24 hours."
        autoClose={false}
      />
    </>
  );
}
