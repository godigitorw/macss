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

// Mock data - only FOR_SALE properties
const forSaleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Villa in Kigali',
    price: '450,000,000 RWF',
    location: 'Kacyiru, Gasabo',
    bedrooms: 4,
    bathrooms: 3,
    area: '350 m²',
    type: 'house',
    status: 'FOR_SALE',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    featured: true,
  },
  {
    id: '3',
    title: 'Commercial Building',
    price: '800,000,000 RWF',
    location: 'Kimihurura, Gasabo',
    bedrooms: 0,
    bathrooms: 4,
    area: '600 m²',
    type: 'commercial',
    status: 'FOR_SALE',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '4',
    title: 'Prime Land Plot',
    price: '250,000,000 RWF',
    location: 'Gisozi, Gasabo',
    bedrooms: 0,
    bathrooms: 0,
    area: '500 m²',
    type: 'land',
    status: 'FOR_SALE',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '9',
    title: 'Residential Land',
    price: '150,000,000 RWF',
    location: 'Kibagabaga, Gasabo',
    bedrooms: 0,
    bathrooms: 0,
    area: '300 m²',
    type: 'land',
    status: 'FOR_SALE',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
  },
  {
    id: '11',
    title: 'Penthouse Suite',
    price: '550,000,000 RWF',
    location: 'Nyarutarama, Gasabo',
    bedrooms: 4,
    bathrooms: 4,
    area: '320 m²',
    type: 'apartment',
    status: 'FOR_SALE',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    featured: true,
  },
];

export default function BuyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(forSaleProperties);

  useEffect(() => {
    let filtered = [...forSaleProperties];

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
    { value: '', label: 'All Types', count: forSaleProperties.length },
    { value: 'house', label: 'Houses', count: forSaleProperties.filter(p => p.type === 'house').length },
    { value: 'apartment', label: 'Apartments', count: forSaleProperties.filter(p => p.type === 'apartment').length },
    { value: 'land', label: 'Land', count: forSaleProperties.filter(p => p.type === 'land').length },
    { value: 'commercial', label: 'Commercial', count: forSaleProperties.filter(p => p.type === 'commercial').length },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Find Your Dream Property
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Discover the perfect property for sale across Rwanda. From luxury villas to commercial spaces, we have it all.
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Property Type Select */}
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-6 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="house">Houses</option>
                      <option value="apartment">Apartments</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                    </select>

                    {/* Search Button */}
                    <button className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{forSaleProperties.length}+</div>
                <div className="text-white/80 text-sm">Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">3</div>
                <div className="text-white/80 text-sm">Districts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-white/80 text-sm">Verified</div>
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
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
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
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} For Sale
              </h2>
              <Link
                href="/properties?status=FOR_SALE"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
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
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Why Buy With Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Buy With MAC SS Real Estate?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make buying your dream property simple, secure, and stress-free
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Properties</h3>
                <p className="text-gray-600">
                  All properties are thoroughly verified and legally documented for your peace of mind
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">
                  Competitive pricing and transparent deals with no hidden costs or surprises
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Professional guidance from experienced agents throughout your buying journey
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Get in touch with our expert team today and let us help you find the property of your dreams
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties?status=FOR_SALE"
                className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Browse All Properties
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
