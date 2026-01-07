'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  status: 'FOR_SALE' | 'FOR_RENT';
  image: string;
  featured?: boolean;
}

// Mock data - only FOR_RENT properties
const forRentProperties: Property[] = [
  {
    id: '2',
    title: 'Luxury Apartment',
    price: '1,200,000 RWF/month',
    location: 'Nyarutarama, Gasabo',
    bedrooms: 3,
    bathrooms: 2,
    area: '180 m²',
    type: 'apartment',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '5',
    title: 'Executive Office Space',
    price: '2,500,000 RWF/month',
    location: 'CBD, Nyarugenge',
    bedrooms: 0,
    bathrooms: 2,
    area: '200 m²',
    type: 'office',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '6',
    title: 'Warehouse Facility',
    price: '3,000,000 RWF/month',
    location: 'Gikondo Industrial Park',
    bedrooms: 0,
    bathrooms: 2,
    area: '1000 m²',
    type: 'warehouse',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '7',
    title: 'Family Home',
    price: '600,000 RWF/month',
    location: 'Remera, Gasabo',
    bedrooms: 3,
    bathrooms: 2,
    area: '250 m²',
    type: 'house',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '8',
    title: 'Studio Apartment',
    price: '400,000 RWF/month',
    location: 'Kicukiro, Kicukiro',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
    type: 'apartment',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '10',
    title: 'Retail Shop',
    price: '1,800,000 RWF/month',
    location: 'Union Trade Center',
    bedrooms: 0,
    bathrooms: 1,
    area: '80 m²',
    type: 'commercial',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '12',
    title: 'Co-working Space',
    price: '800,000 RWF/month',
    location: 'Kimihurura, Gasabo',
    bedrooms: 0,
    bathrooms: 2,
    area: '150 m²',
    type: 'office',
    status: 'FOR_RENT',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
];

export default function RentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(forRentProperties);

  useEffect(() => {
    let filtered = [...forRentProperties];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedType]);

  const propertyTypes = [
    { value: '', label: 'All Types', count: forRentProperties.length },
    { value: 'house', label: 'Houses', count: forRentProperties.filter(p => p.type === 'house').length },
    { value: 'apartment', label: 'Apartments', count: forRentProperties.filter(p => p.type === 'apartment').length },
    { value: 'office', label: 'Offices', count: forRentProperties.filter(p => p.type === 'office').length },
    { value: 'commercial', label: 'Commercial', count: forRentProperties.filter(p => p.type === 'commercial').length },
    { value: 'warehouse', label: 'Warehouse', count: forRentProperties.filter(p => p.type === 'warehouse').length },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Find Your Perfect Rental
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Browse through our wide selection of rental properties. From cozy apartments to spacious offices, find the perfect space for you.
              </p>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-2 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-2">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by location or property name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Property Type Select */}
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="house">Houses</option>
                      <option value="apartment">Apartments</option>
                      <option value="office">Offices</option>
                      <option value="commercial">Commercial</option>
                      <option value="warehouse">Warehouse</option>
                    </select>

                    {/* Search Button */}
                    <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{forRentProperties.length}+</div>
                <div className="text-white/80 text-sm">Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">Flexible</div>
                <div className="text-white/80 text-sm">Terms</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">Instant</div>
                <div className="text-white/80 text-sm">Viewing</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Types Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all border-2 ${
                    selectedType === type.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} For Rent
              </h2>
              <Link
                href="/properties?status=FOR_RENT"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                View All →
              </Link>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Why Rent With Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Rent With MAC SS Real Estate?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make renting easy, affordable, and hassle-free
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Terms</h3>
                <p className="text-gray-600">
                  Choose rental periods that suit your needs - monthly, quarterly, or annually
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Properties</h3>
                <p className="text-gray-600">
                  Well-maintained properties in prime locations with modern amenities
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Process</h3>
                <p className="text-gray-600">
                  Transparent contracts and secure payment methods for your peace of mind
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Process */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple steps to find your perfect rental property
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Browse Properties</h3>
                <p className="text-gray-600 text-sm">
                  Search through our extensive collection of rental properties
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Viewing</h3>
                <p className="text-gray-600 text-sm">
                  Book a viewing at a time that works for you
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Apply Online</h3>
                <p className="text-gray-600 text-sm">
                  Submit your application with required documents
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Move In</h3>
                <p className="text-gray-600 text-sm">
                  Sign the lease and move into your new space
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Rental?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today to schedule a viewing or get more information about available properties
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties?status=FOR_RENT"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Browse All Rentals
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
